import React, { useState } from 'react';
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

  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Helper to show messages temporarily
  const showMessage = (type, text, duration = 4000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), duration);
  };

  const uploadCertificate = async () => {
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
      // Optionally clear form fields after upload:
      setName('');
      setIssuer('');
      setDate('');
      setNin('');
      setImage(null);
    } catch (error) {
      showMessage('error', 'Upload failed');
    }
  };

  const generateCode = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/generate-code',
        { certId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showMessage('success', `Generated Code: ${response.data.code}`);
    } catch (error) {
      showMessage('error', 'Failed to generate code');
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/certificates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCertificates(response.data);
      showMessage('success', `Fetched ${response.data.length} certificates`);
    } catch (error) {
      showMessage('error', 'Failed to fetch certificates');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '2rem auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#333',
      padding: '0 1rem',
      position: 'relative'
    }}>
      <button
        onClick={logout}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'background-color 0.3s ease',
          userSelect: 'none'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#c82333'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#dc3545'}
      >
        Logout
      </button>

      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Dashboard</h1>

      {/* Message Box */}
      {message && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            color: message.type === 'success' ? '#155724' : '#721c24',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontWeight: '600',
            textAlign: 'center',
            userSelect: 'none'
          }}
        >
          {message.text}
        </div>
      )}

      {/* Upload Certificate Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Upload Certificate</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Certificate Owner Name"
          style={inputStyle}
        />
        <input
          type="text"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          placeholder="Issuer Name"
          style={inputStyle}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Issue Date"
          style={inputStyle}
        />
        <input
          type="text"
          value={nin}
          onChange={(e) => setNin(e.target.value)}
          placeholder="General ID (e.g., NIN)"
          style={inputStyle}
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          style={{ marginBottom: '1rem' }}
        />

        <button onClick={uploadCertificate} style={buttonStyle}>
          Upload
        </button>
      </section>

      {/* Generate Verification Code Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Generate Verification Code</h2>

        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value)}
          placeholder="Certificate ID"
          style={inputStyle}
        />
        <button onClick={generateCode} style={buttonStyle}>
          Generate Code
        </button>
      </section>

      {/* View All Certificates Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitleStyle}>All Certificates</h2>

        <button onClick={fetchCertificates} style={{ ...buttonStyle, marginBottom: '1rem' }}>
          View All Certificates
        </button>

        {certificates.length === 0 ? (
          <p>No certificates loaded.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {certificates.map(cert => (
              <li key={cert.certId} style={{
                backgroundColor: '#f9f9f9',
                padding: '1rem',
                marginBottom: '0.75rem',
                borderRadius: '6px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <img 
                  src={`http://localhost:5000${cert.filePath}`} 
                  alt={`${cert.name} certificate`} 
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} 
                />
                <div>
                  <div><strong>ID:</strong> {cert.certId}</div>
                  <div><strong>Name:</strong> {cert.name}</div>
                  <div><strong>NIN:</strong> {cert.nin}</div>
                  <div><strong>Issuer:</strong> {cert.issuer}</div>
                  <div><strong>Date:</strong> {cert.date}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#007BFF',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  userSelect: 'none'
};

const sectionStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem 2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};

const sectionTitleStyle = {
  marginBottom: '1rem',
  color: '#444'
};

export default DashboardPage;
