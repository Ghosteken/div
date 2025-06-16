import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function StudentDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);
  const [uploadData, setUploadData] = useState({
    certificateId: '',
    issuer: '',
    certificateFile: null
  });
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'upload'

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const nin = localStorage.getItem('userNin');
      const response = await axios.get(`http://localhost:5000/api/student/certificates/${nin}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCertificates(response.data);
    } catch (error) {
      setError('Failed to fetch certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData({
      ...uploadData,
      certificateFile: e.target.files[0]
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.certificateFile || !uploadData.certificateId || !uploadData.issuer) {
      setError('Please fill in all fields and select a certificate file');
      return;
    }

    const formData = new FormData();
    formData.append('certificateFile', uploadData.certificateFile);
    formData.append('certificateId', uploadData.certificateId);
    formData.append('issuer', uploadData.issuer);
    formData.append('nin', localStorage.getItem('userNin'));

    try {
      await axios.post('http://localhost:5000/api/student/upload-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setUploadData({
        certificateId: '',
        issuer: '',
        certificateFile: null
      });
      fetchCertificates();
      setError(null);
      alert('Certificate uploaded successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload certificate');
    }
  };

  const downloadCertificate = async (certId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates/download/${certId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px'
        }}>
          <div style={{ fontSize: '1.5rem', color: '#667eea' }}>Loading your certificates...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 0' }}>
        <h1 style={{
          fontSize: '2rem',
          color: 'white',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          Student Dashboard
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
          {['view', 'upload'].map(tab => (
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
              {tab === 'view' ? '📄 View Certificates' : '📤 Upload Certificate'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            color: '#c53030',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {activeTab === 'view' ? (
          <div>
            {certificates.map(cert => (
              <div key={cert.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{
                    margin: '0 0 0.5rem',
                    color: '#2d3748',
                    fontSize: '1.25rem'
                  }}>
                    {cert.title}
                  </h3>
                  <p style={{
                    margin: '0 0 1rem',
                    color: '#4a5568',
                    fontSize: '0.875rem'
                  }}>
                    Issued by {cert.issuer}
                  </p>
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#718096'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Certificate ID:</span>
                      <span>{cert.certificateId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Verification Code:</span>
                      <span style={{ color: '#667eea', fontWeight: '500' }}>{cert.verificationCode}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Status:</span>
                      <span style={{
                        color: cert.isVerified ? '#48bb78' : '#4299e1',
                        fontWeight: '500'
                      }}>
                        {cert.isVerified ? 'Verified ✓' : 'Pending'}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadCertificate(cert.id)}
                      style={{
                        backgroundColor: '#4299e1',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        marginTop: '1rem'
                      }}
                    >
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <form onSubmit={handleUpload} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568' }}>Certificate ID</label>
                <input
                  type="text"
                  value={uploadData.certificateId}
                  onChange={(e) => setUploadData({ ...uploadData, certificateId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568' }}>Issuer</label>
                <input
                  type="text"
                  value={uploadData.issuer}
                  onChange={(e) => setUploadData({ ...uploadData, issuer: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568' }}>Certificate File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0'
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Upload Certificate
              </button>
            </form>
          </div>
        )}

        {/* Certificate Details Modal */}
        {selectedCert && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              <button
                onClick={() => setSelectedCert(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#4a5568'
                }}
              >
                ×
              </button>

              <div style={{
                display: 'grid',
                gap: '2rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px'
                }}>
                  <h2 style={{
                    margin: '0 0 0.5rem',
                    color: '#2d3748',
                    fontSize: '1.5rem'
                  }}>
                    {selectedCert.title}
                  </h2>
                  <p style={{ color: '#4a5568', margin: 0 }}>
                    {selectedCert.issuer}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {[
                    { label: 'Certificate ID', value: selectedCert.certificateId },
                    { label: 'Verification Code', value: selectedCert.verificationCode },
                    { label: 'Status', value: selectedCert.isVerified ? 'Verified' : 'Pending Verification' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '200px 1fr',
                        padding: '1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        gap: '1rem'
                      }}
                    >
                      <span style={{ color: '#4a5568', fontWeight: '500' }}>{item.label}:</span>
                      <span style={{
                        color: item.label === 'Status' ? (selectedCert.isVerified ? '#48bb78' : '#4299e1') : '#2d3748',
                        fontWeight: item.label === 'Status' ? '600' : '400'
                      }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => {
                      const verificationLink = `http://localhost:5000/verify/${selectedCert.verificationCode}`;
                      navigator.clipboard.writeText(verificationLink);
                      alert('Verification link copied to clipboard!');
                    }}
                    style={{
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <span>🔗</span>
                    <span>Share Verification Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {certificates.length === 0 && activeTab === 'view' && (
          <div style={{
            textAlign: 'center',
            color: 'white',
            padding: '4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            margin: '2rem 0'
          }}>
            <h3 style={{ margin: '0 0 1rem' }}>No Certificates Found</h3>
            <p style={{ margin: 0, opacity: 0.8 }}>
              You haven't uploaded any certificates yet. Click on "Upload Certificate" to add your first certificate.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentDashboard; 