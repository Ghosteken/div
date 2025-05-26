import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function InstitutionDashboard() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadData, setUploadData] = useState({
    studentName: '',
    nin: '',
    program: '',
    grade: '',
    issueDate: '',
    expiryDate: '',
    certificateFile: null
  });
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCertificates, setFilteredCertificates] = useState([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (certificates.length > 0) {
      const filtered = certificates.filter(cert => 
        cert.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.nin.includes(searchQuery) ||
        cert.certId.includes(searchQuery)
      );
      setFilteredCertificates(filtered);
    }
  }, [searchQuery, certificates]);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/institution/certificates', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCertificates(response.data);
      setFilteredCertificates(response.data);
    } catch (error) {
      showMessage('error', 'Failed to fetch certificates');
    }
  };

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.studentName || !uploadData.nin || !uploadData.program || !uploadData.certificateFile) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(uploadData).forEach(key => {
        if (uploadData[key]) {
          formData.append(key, uploadData[key]);
        }
      });

      await axios.post('http://localhost:5000/api/institution/upload-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      showMessage('success', 'Certificate uploaded successfully');
      setUploadData({
        studentName: '',
        nin: '',
        program: '',
        grade: '',
        issueDate: '',
        expiryDate: '',
        certificateFile: null
      });
      fetchCertificates();
    } catch (error) {
      showMessage('error', 'Failed to upload certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkUploadFile) {
      showMessage('error', 'Please select a file');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', bulkUploadFile);

      await axios.post('http://localhost:5000/api/institution/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      showMessage('success', 'Bulk upload completed successfully');
      setBulkUploadFile(null);
      fetchCertificates();
    } catch (error) {
      showMessage('error', 'Failed to process bulk upload');
    } finally {
      setIsLoading(false);
    }
  };

  const revokeCertificate = async (certId) => {
    if (!window.confirm('Are you sure you want to revoke this certificate?')) {
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/institution/revoke-certificate/${certId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      showMessage('success', 'Certificate revoked successfully');
      fetchCertificates();
    } catch (error) {
      showMessage('error', 'Failed to revoke certificate');
    }
  };

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Institution Dashboard
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '0.5rem',
          borderRadius: '12px'
        }}>
          {['upload', 'bulk', 'manage'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '1rem',
                backgroundColor: activeTab === tab ? 'white' : 'transparent',
                color: activeTab === tab ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              {tab === 'upload' ? '📄 Upload Certificate' :
               tab === 'bulk' ? '📦 Bulk Upload' :
               '📋 Manage Certificates'}
            </button>
          ))}
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff5f5',
            color: message.type === 'success' ? '#2f855a' : '#c53030',
            marginBottom: '2rem'
          }}>
            {message.text}
          </div>
        )}

        {/* Upload Certificate Form */}
        {activeTab === 'upload' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <form onSubmit={handleUpload} style={{
              display: 'grid',
              gap: '1.5rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={uploadData.studentName}
                    onChange={e => setUploadData({ ...uploadData, studentName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    NIN *
                  </label>
                  <input
                    type="text"
                    value={uploadData.nin}
                    onChange={e => setUploadData({ ...uploadData, nin: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    Program *
                  </label>
                  <input
                    type="text"
                    value={uploadData.program}
                    onChange={e => setUploadData({ ...uploadData, program: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    Grade/CGPA
                  </label>
                  <input
                    type="text"
                    value={uploadData.grade}
                    onChange={e => setUploadData({ ...uploadData, grade: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={uploadData.issueDate}
                    onChange={e => setUploadData({ ...uploadData, issueDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#4a5568'
                  }}>
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={uploadData.expiryDate}
                    onChange={e => setUploadData({ ...uploadData, expiryDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#4a5568'
                }}>
                  Certificate File *
                </label>
                <div style={{
                  border: '2px dashed #e2e8f0',
                  borderRadius: '8px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    onChange={e => setUploadData({ ...uploadData, certificateFile: e.target.files[0] })}
                    style={{ display: 'none' }}
                    id="certificate-file"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="certificate-file" style={{ cursor: 'pointer', color: '#667eea' }}>
                    {uploadData.certificateFile ? '✓ File Selected' : '📎 Click to Upload Certificate'}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Uploading...' : 'Upload Certificate'}
              </button>
            </form>
          </div>
        )}

        {/* Bulk Upload */}
        {activeTab === 'bulk' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Bulk Upload Instructions</h3>
              <ul style={{ color: '#4a5568', lineHeight: '1.6' }}>
                <li>Prepare an Excel file with the following columns: Student Name, NIN, Program, Grade, Issue Date</li>
                <li>Make sure all required fields are filled</li>
                <li>Download our template for the correct format</li>
              </ul>
            </div>

            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <input
                type="file"
                onChange={e => setBulkUploadFile(e.target.files[0])}
                style={{ display: 'none' }}
                id="bulk-file"
                accept=".xlsx,.xls,.csv"
              />
              <label htmlFor="bulk-file" style={{ cursor: 'pointer', color: '#667eea' }}>
                {bulkUploadFile ? '✓ File Selected' : '📎 Click to Upload Excel File'}
              </label>
            </div>

            <button
              onClick={handleBulkUpload}
              disabled={isLoading || !bulkUploadFile}
              style={{
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                padding: '1rem',
                borderRadius: '8px',
                width: '100%',
                cursor: (isLoading || !bulkUploadFile) ? 'not-allowed' : 'pointer',
                opacity: (isLoading || !bulkUploadFile) ? 0.7 : 1
              }}
            >
              {isLoading ? 'Processing...' : 'Start Bulk Upload'}
            </button>
          </div>
        )}

        {/* Manage Certificates */}
        {activeTab === 'manage' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <input
                type="text"
                placeholder="Search by student name, NIN, or certificate ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredCertificates.map(cert => (
                <div
                  key={cert.certId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', color: '#2d3748' }}>{cert.studentName}</h4>
                    <div style={{
                      display: 'flex',
                      gap: '2rem',
                      fontSize: '0.875rem',
                      color: '#4a5568'
                    }}>
                      <span>NIN: {cert.nin}</span>
                      <span>Program: {cert.program}</span>
                      <span>Issue Date: {new Date(cert.issueDate).toLocaleDateString()}</span>
                      <span style={{
                        color: cert.isVerified ? '#48bb78' : '#4299e1',
                        fontWeight: '500'
                      }}>
                        {cert.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => {
                        const verificationLink = `http://localhost:5000/verify/${cert.certId}`;
                        navigator.clipboard.writeText(verificationLink);
                        showMessage('success', 'Verification link copied to clipboard');
                      }}
                      style={{
                        backgroundColor: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={() => revokeCertificate(cert.certId)}
                      style={{
                        backgroundColor: '#f56565',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default InstitutionDashboard; 