import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

function StudentDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

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
          My Certificates
        </h1>

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

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {certificates.map(cert => (
            <div
              key={cert.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedCert(cert)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                height: '200px',
                overflow: 'hidden',
                borderBottom: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <img
                  src={`http://localhost:5000${cert.filePath}`}
                  alt={cert.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: cert.isVerified ? '#48bb78' : '#4299e1',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  {cert.isVerified ? 'Verified ✓' : 'Pending'}
                </div>
              </div>

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
                  Issued by {cert.institution}
                </p>
                <div style={{
                  display: 'grid',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#718096'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Issue Date:</span>
                    <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Certificate ID:</span>
                    <span>{cert.certId}</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadCertificate(cert.certId);
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginTop: '1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📥</span>
                  <span>Download Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

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
                    {selectedCert.institution}
                  </p>
                </div>

                <div style={{
                  display: 'grid',
                  gap: '1rem'
                }}>
                  {[
                    { label: 'Certificate ID', value: selectedCert.certId },
                    { label: 'Issue Date', value: new Date(selectedCert.issueDate).toLocaleDateString() },
                    { label: 'Student Name', value: selectedCert.studentName },
                    { label: 'NIN', value: selectedCert.nin },
                    { label: 'Program', value: selectedCert.program },
                    { label: 'Grade/CGPA', value: selectedCert.grade },
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
                    onClick={() => downloadCertificate(selectedCert.certId)}
                    style={{
                      backgroundColor: '#667eea',
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
                    <span>📥</span>
                    <span>Download Certificate</span>
                  </button>
                  <button
                    onClick={() => {
                      // Share certificate verification link
                      const verificationLink = `http://localhost:5000/verify/${selectedCert.certId}`;
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

        {certificates.length === 0 && (
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
              You don't have any certificates yet. They will appear here once your institution uploads them.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default StudentDashboard; 