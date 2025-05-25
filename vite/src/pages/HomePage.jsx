import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const verifyCode = async () => {
    setError('');
    setResult(null);
    if (!code.trim()) {
      setError('Please enter a verification code.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/verify/${code.trim()}`);
      if (response.data && !response.data.error) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Invalid or used code.');
      }
    } catch (err) {
      setError('Invalid or used code.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      {/* Top navigation with Login */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button
          onClick={handleLogin}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </div>

      {/* Main certificate verification UI */}
      <h1 style={{ marginBottom: '1rem', textAlign: 'center' }}>Verify Certificate</h1>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter verification code"
          style={{
            padding: '0.5rem',
            width: '300px',
            maxWidth: '100%',
            marginRight: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={verifyCode}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#842029',
            padding: '1rem',
            borderRadius: '5px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}
        >
          {error}
        </div>
      )}

      {/* Composed result display */}
      {result && (
        <div
          style={{
            backgroundColor: '#e9f7ef',
            border: '1px solid #28a745',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(40, 167, 69, 0.2)'
          }}
        >
          <h2 style={{ color: '#28a745', marginBottom: '0.5rem' }}>Certificate Verified</h2>
          <p><strong>Name:</strong> {result.name || 'N/A'}</p>
          <p><strong>Issued By:</strong> {result.issuer || 'N/A'}</p>
          <p><strong>Issue Date:</strong> {result.issueDate ? new Date(result.issueDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Expiration Date:</strong> {result.expiryDate ? new Date(result.expiryDate).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Status:</strong> <span style={{ color: result.valid ? '#28a745' : '#dc3545' }}>{result.valid ? 'Valid' : 'Valid'}</span></p>
          {/* Add more certificate fields as needed */}
        </div>
      )}
    </div>
  );
}

export default HomePage;
