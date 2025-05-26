import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [certificates, setCertificates] = useState([]);
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [date, setDate] = useState('');
  const [certId, setCertId] = useState('');
  const [nin, setNin] = useState('');
  const [image, setImage] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const uploadCertificate = async () => {
    if (!name || !issuer || !date || !nin) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('issuer', issuer);
      formData.append('date', date);
      formData.append('nin', nin);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showMessage('success', `Certificate Uploaded! ID: ${response.data.cert.certId}`);
      setName('');
      setIssuer('');
      setDate('');
      setNin('');
      setImage(null);
    } catch (error) {
      showMessage('error', 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const generateCode = async () => {
    if (!certId) {
      showMessage('error', 'Please enter a Certificate ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-code',
        { certId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGeneratedCode(response.data.code);
      showMessage('success', 'Code generated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to generate code');
      setGeneratedCode(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      showMessage('error', 'Failed to copy to clipboard');
    }
  };

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(response.data);
      showMessage('success', `Fetched ${response.data.length} certificates`);
    } catch (error) {
      showMessage('error', 'Failed to fetch certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      color: '#333',
      padding: '2rem'
    }}>
      {/* Top Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto 2rem',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '1.5rem',
          color: '#667eea',
          fontWeight: '600'
        }}>
          Admin Dashboard
        </h1>
        <button
          onClick={logout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c82333'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden'
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          {['upload', 'generate', 'view'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'view') fetchCertificates();
              }}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #667eea' : '2px solid transparent',
                backgroundColor: 'transparent',
                color: activeTab === tab ? '#667eea' : '#4a5568',
                fontWeight: activeTab === tab ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                flex: 1,
                textTransform: 'capitalize'
              }}
            >
              {tab === 'upload' ? 'Upload Certificate' : 
               tab === 'generate' ? 'Generate Code' : 
               'View Certificates'}
            </button>
          ))}
        </div>

        {/* Message Box */}
        {message && (
          <div style={{
            margin: '1rem',
            padding: '1rem',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            textAlign: 'center'
          }}>
            {message.text}
          </div>
        )}

        <div style={{ padding: '2rem' }}>
          {/* Upload Certificate Form */}
          {activeTab === 'upload' && (
            <form onSubmit={e => { e.preventDefault(); uploadCertificate(); }} style={{
              display: 'grid',
              gap: '1rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Certificate Owner Name"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    paddingLeft: '2.5rem',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }}>👤</span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Issuer Name"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    paddingLeft: '2.5rem',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }}>🏢</span>
              </div>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  border: '2px solid #e1e1e1',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={nin}
                  onChange={(e) => setNin(e.target.value)}
                  placeholder="General ID (e.g., NIN)"
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    paddingLeft: '2.5rem',
                    border: '2px solid #e1e1e1',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#666'
                }}>🆔</span>
              </div>

              <div style={{
                border: '2px dashed #e1e1e1',
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  style={{
                    cursor: 'pointer',
                    color: '#667eea',
                    display: 'block'
                  }}
                >
                  {image ? '✓ Image Selected' : '📎 Click to Upload Image'}
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  marginTop: '1rem'
                }}
              >
                {isLoading ? (
                  <span style={{
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite'
                  }}>⌛</span>
                ) : 'Upload Certificate'}
              </button>
            </form>
          )}

          {/* Generate Code Form */}
          {activeTab === 'generate' && (
            <div style={{
              display: 'grid',
              gap: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <form onSubmit={e => { e.preventDefault(); generateCode(); }} style={{
                display: 'grid',
                gap: '1rem'
              }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Certificate ID"
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      paddingLeft: '2.5rem',
                      border: '2px solid #e1e1e1',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                      outline: 'none'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666'
                  }}>🔑</span>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    backgroundColor: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoading ? (
                    <span style={{
                      display: 'inline-block',
                      animation: 'spin 1s linear infinite'
                    }}>⌛</span>
                  ) : 'Generate Code'}
                </button>
              </form>

              {generatedCode && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '2px solid #667eea',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#666',
                    marginBottom: '0.5rem'
                  }}>
                    Generated Verification Code
                  </div>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                    wordBreak: 'break-all'
                  }}>
                    {generatedCode}
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedCode)}
                    style={{
                      backgroundColor: copySuccess ? '#48bb78' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      margin: '0 auto'
                    }}
                  >
                    {copySuccess ? (
                      <>
                        <span>✓ Copied!</span>
                      </>
                    ) : (
                      <>
                        <span>📋 Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View Certificates */}
          {activeTab === 'view' && (
            <div>
              {certificates.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#666'
                }}>
                  No certificates found
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
                }}>
                  {certificates.map(cert => (
                    <div
                      key={cert.certId}
                      style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <img
                        src={`http://localhost:5000${cert.filePath}`}
                        alt={`${cert.name} certificate`}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderBottom: '1px solid #e2e8f0'
                        }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <div style={{
                          display: 'grid',
                          gap: '0.5rem'
                        }}>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>Certificate ID</div>
                          <div style={{ fontWeight: '600' }}>{cert.certId}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>Name</div>
                          <div style={{ fontWeight: '600' }}>{cert.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>NIN</div>
                          <div>{cert.nin}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>Issuer</div>
                          <div>{cert.issuer}</div>
                          <div style={{ fontSize: '0.875rem', color: '#666' }}>Date</div>
                          <div>{new Date(cert.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default DashboardPage;
