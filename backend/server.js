const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 5000;
const SECRET = 'ubdbwu9d38nd398hd393d928';

// Initialize database structure
const db = {
  users: {
    students: [],
    institutions: [],
    admins: []
  },
  certificates: []
};

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Load existing data if available
try {
  if (fs.existsSync(path.join(__dirname, 'db.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));
    Object.assign(db, data);
  }
} catch (error) {
  console.error('Error loading database:', error);
}

// Save database to file
const saveDb = () => {
  try {
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Static folder for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    // Always allow mock tokens for development
    if (token.startsWith('mock-token-')) {
      const role = token.replace('mock-token-', '');
      req.user = { role };
      if (role === 'student') {
        // Try to get NIN from header or localStorage fallback
        req.user.nin = req.headers['x-user-nin'] || req.headers['x-usernin'] || req.query.nin || 'student123';
      }
      if (role === 'institution') {
        // Use a default institution name for mock
        req.user.institutionName = 'Test Institution';
        req.user.email = 'institution@test.com';
      }
      return next();
    }

    // Handle JWT tokens
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;

    // For institutions, get the institution name
    if (decoded.role === 'institution') {
      const institution = db.users.institutions.find(i => i.email === decoded.email);
      if (!institution) {
        return res.status(401).json({ message: 'Institution not found' });
      }
      req.user.institutionName = institution.institutionName;
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Student signup endpoint
app.post('/api/student/signup', async (req, res) => {
  const { nin, fullName, email, password } = req.body;

  // Validate input
  if (!nin || !fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if student already exists
  const existingStudent = db.users.students.find(s => s.nin === nin || s.email === email);
  if (existingStudent) {
    return res.status(400).json({ message: 'Student with this NIN or email already exists' });
  }

  // Create new student
  const newStudent = {
    nin,
    fullName,
    email,
    password, // In a real app, this should be hashed
    createdAt: new Date().toISOString()
  };

  // Add to database
  db.users.students.push(newStudent);
  saveDb();

  // Generate token
  const token = jwt.sign(
    { nin, role: 'student' },
    SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Student account created successfully',
    token,
    user: {
      nin: newStudent.nin,
      fullName: newStudent.fullName,
      email: newStudent.email
    }
  });
});

// Student login endpoint
app.post('/api/student/login', async (req, res) => {
  const { identifier, password } = req.body;

  // Find student by NIN or email
  const student = db.users.students.find(s => 
    s.nin === identifier || s.email === identifier
  );

  if (!student || student.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate token
  const token = jwt.sign({ nin: student.nin, role: 'student' }, SECRET, { expiresIn: '24h' });

  res.json({
    message: 'Login successful',
    token,
    user: {
      nin: student.nin,
      fullName: student.fullName,
      email: student.email,
      role: 'student'
    }
  });
});

// Generate verification code
const generateVerificationCode = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Student certificate upload endpoint
app.post('/api/student/upload-certificate', authMiddleware, upload.single('certificateFile'), (req, res) => {
  const { certificateId, issuer } = req.body;
  const file = req.file;
  const nin = req.body.nin;

  if (!certificateId || !issuer || !file || !nin) {
    return res.status(400).json({ message: 'All fields including a file are required' });
  }

  // Check if certificate ID already exists
  const existingCert = db.certificates.find(c => c.certificateId === certificateId);
  if (existingCert) {
    return res.status(400).json({ message: 'Certificate ID already exists' });
  }

  const verificationCode = generateVerificationCode();
  const cert = {
    id: `cert-${Date.now()}`,
    certificateId,
    issuer,
    nin,
    filePath: `/uploads/${file.filename}`,
    verificationCode,
    isVerified: false,
    uploadDate: new Date().toISOString()
  };

  db.certificates.push(cert);
  saveDb();
  res.json({ message: 'Certificate uploaded successfully', certificate: cert });
});

// Get student certificates
app.get('/api/student/certificates/:nin', authMiddleware, (req, res) => {
  const { nin } = req.params;
  const certificates = db.certificates.filter(cert => cert.nin === nin);
  res.json(certificates);
});

// Verify certificate by code
app.get('/api/verify/:code', (req, res) => {
  const { code } = req.params;
  const certificate = db.certificates.find(cert => cert.verificationCode === code);
  
  if (!certificate) {
    return res.status(404).json({ message: 'Invalid verification code' });
  }

  // Mark certificate as verified
  certificate.isVerified = true;
  // Change verification code after use
  certificate.verificationCode = generateVerificationCode();
  saveDb();

  res.json({
    message: 'Certificate verified successfully',
    certificate: {
      certificateId: certificate.certificateId,
      issuer: certificate.issuer,
      uploadDate: certificate.uploadDate,
      isVerified: certificate.isVerified
    }
  });
});

// Institution certificate upload endpoint
app.post('/api/institution/upload-certificate', authMiddleware, upload.single('certificateFile'), (req, res) => {
  const { studentName, nin, program, grade, issueDate, expiryDate } = req.body;
  const file = req.file;

  if (!studentName || !nin || !program || !file) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Check if student exists
  let student = db.users.students.find(s => s.nin === nin);
  if (!student) {
    // Create a new student profile if not found
    student = {
      nin,
      fullName: studentName,
      email: `${nin}@example.com`, // Placeholder email
      password: 'defaultPassword', // Placeholder password
      createdAt: new Date().toISOString()
    };
    db.users.students.push(student);
    saveDb();
  }

  const verificationCode = generateVerificationCode();
  const cert = {
    id: `cert-${Date.now()}`,
    studentName,
    nin,
    program,
    grade: grade || 'N/A',
    issueDate: issueDate || new Date().toISOString(),
    expiryDate: expiryDate || null,
    filePath: `/uploads/${file.filename}`,
    verificationCode,
    isVerified: false,
    uploadDate: new Date().toISOString(),
    issuer: req.user.institutionName // From auth middleware
  };

  db.certificates.push(cert);
  saveDb();
  res.json({ message: 'Certificate uploaded successfully', certificate: cert });
});

// Get institution's certificates
app.get('/api/institution/certificates', authMiddleware, (req, res) => {
  const institutionName = req.user.institutionName;
  const certificates = db.certificates.filter(cert => cert.issuer === institutionName);
  res.json(certificates);
});

// Revoke certificate
app.post('/api/institution/revoke-certificate/:certId', authMiddleware, (req, res) => {
  const { certId } = req.params;
  const institutionName = req.user.institutionName;

  const certificate = db.certificates.find(cert => cert.id === certId && cert.issuer === institutionName);
  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  certificate.isRevoked = true;
  certificate.revocationDate = new Date().toISOString();
  saveDb();

  res.json({ message: 'Certificate revoked successfully' });
});

// Institution signup endpoint
app.post('/api/institution/signup', async (req, res) => {
  const { institutionName, registrationNumber, email, phone, address, password } = req.body;

  // Validate input
  if (!institutionName || !registrationNumber || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if institution already exists
  const existingInstitution = db.users.institutions.find(
    i => i.email === email || i.registrationNumber === registrationNumber
  );
  if (existingInstitution) {
    return res.status(400).json({ message: 'Institution with this email or registration number already exists' });
  }

  // Create new institution
  const newInstitution = {
    institutionName,
    registrationNumber,
    email,
    phone: phone || '',
    address: address || '',
    password, // In a real app, this should be hashed
    createdAt: new Date().toISOString()
  };

  // Add to database
  db.users.institutions.push(newInstitution);
  saveDb();

  // Generate token
  const token = jwt.sign(
    { email, role: 'institution' },
    SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    message: 'Institution account created successfully',
    token,
    user: {
      institutionName: newInstitution.institutionName,
      email: newInstitution.email,
      role: 'institution'
    }
  });
});

// Download certificate endpoint
app.get('/api/certificates/download/:certId', authMiddleware, (req, res) => {
  const { certId } = req.params;
  const certificate = db.certificates.find(cert => cert.id === certId);
  
  if (!certificate) {
    return res.status(404).json({ message: 'Certificate not found' });
  }

  const filePath = path.join(__dirname, certificate.filePath);
  console.log('Attempting to download file at path:', filePath);
  res.download(filePath);
});

// Admin analytics endpoint
app.get('/api/admin/analytics', authMiddleware, (req, res) => {
  const totalCertificates = db.certificates.length;
  const totalVerifications = db.certificates.filter(cert => cert.isVerified).length;
  const totalInstitutions = db.users.institutions.length;
  const totalReports = db.certificates.filter(cert => cert.isReported).length;

  const recentActivity = db.certificates.slice(-5).map(cert => ({
    type: cert.isVerified ? 'verification' : 'upload',
    description: `Certificate ${cert.certificateId} was ${cert.isVerified ? 'verified' : 'uploaded'}`,
    institution: cert.issuer,
    timestamp: cert.uploadDate
  }));

  const institutionStats = db.users.institutions.map(inst => ({
    name: inst.institutionName,
    certificateCount: db.certificates.filter(cert => cert.issuer === inst.institutionName).length,
    verificationCount: db.certificates.filter(cert => cert.issuer === inst.institutionName && cert.isVerified).length,
    reportCount: db.certificates.filter(cert => cert.issuer === inst.institutionName && cert.isReported).length
  }));

  res.json({
    totalCertificates,
    totalVerifications,
    totalInstitutions,
    totalReports,
    recentActivity,
    institutionStats
  });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Current directory:', __dirname);
  console.log('Uploads directory:', path.join(__dirname, 'uploads'));
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or close the application using this port.`);
  } else {
    console.error('Server failed to start:', err);
  }
  process.exit(1);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
