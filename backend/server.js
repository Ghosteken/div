const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;
const SECRET = 'ubdbwu9d38nd398hd393d928';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static folder for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Initialize certs.json if it doesn't exist or is invalid
const initDB = () => {
  if (!fs.existsSync('certs.json')) {
    const initialData = { certificates: [], codes: {} };
    fs.writeFileSync('certs.json', JSON.stringify(initialData, null, 2));
  } else {
    try {
      JSON.parse(fs.readFileSync('certs.json', 'utf8'));
    } catch {
      const initialData = { certificates: [], codes: {} };
      fs.writeFileSync('certs.json', JSON.stringify(initialData, null, 2));
    }
  }
};
initDB();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Database utilities
const loadDB = () => JSON.parse(fs.readFileSync('certs.json', 'utf8'));
const saveDB = (data) => fs.writeFileSync('certs.json', JSON.stringify(data, null, 2));

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Get all certificates
app.get('/api/certificates', authMiddleware, (req, res) => {
  const db = loadDB();
  res.json(db.certificates);
});

// Upload certificate with file - expects field name 'image' to match client
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  const db = loadDB();
  const { name, issuer, date, nin } = req.body;
  const file = req.file;

  if (!name || !issuer || !date || !nin || !file) {
    return res.status(400).json({ message: 'All fields including a file are required' });
  }

  const certId = `cert-${Date.now()}`;
  const cert = {
    certId,
    name,
    issuer,
    date,
    nin,
    filePath: `/uploads/${file.filename}`
  };

  db.certificates.push(cert);
  saveDB(db);
  res.json({ message: 'Certificate uploaded', cert });
});

// Generate public code
app.post('/api/generate-code', authMiddleware, (req, res) => {
  const db = loadDB();
  const { certId } = req.body;
  if (!certId) return res.status(400).json({ message: 'certId is required' });

  // Check if certId exists
  const certExists = db.certificates.some(c => c.certId === certId);
  if (!certExists) return res.status(404).json({ message: 'Certificate ID not found' });

  const code = Math.random().toString(36).substring(2, 8);
  db.codes[code] = { certId, used: false };
  saveDB(db);
  res.json({ code });
});

// Verify code
app.get('/api/verify/:code', (req, res) => {
  const db = loadDB();
  const code = req.params.code;
  const entry = db.codes[code];
  if (!entry || entry.used) return res.status(404).json({ message: 'Code invalid or used' });

  entry.used = true;
  saveDB(db);

  const cert = db.certificates.find(c => c.certId === entry.certId);
  if (!cert) return res.status(404).json({ message: 'Certificate not found' });
  res.json(cert);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
