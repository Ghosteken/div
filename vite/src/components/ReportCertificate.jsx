import React, { useState } from 'react';
import axios from 'axios';

function ReportCertificate({ onClose }) {
  const [certId, setCertId] = useState('');
  const [reason, setReason] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!certId.trim() || !reason.trim()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('certId', certId);
      formData.append('reason', reason);
      if (evidence) {
        formData.append('evidence', evidence);
      }

      await axios.post('http://localhost:5000/api/report-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Report submitted successfully' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit report' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '2rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        animation: 'slideIn 0.3s ease-out'
      }}>
        <button
          onClick={onClose}
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

        <h2 style={{
          color: '#2d3748',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Report Fraudulent Certificate
        </h2>

        <form onSubmit={handleSubmit} style={{
          display: 'grid',
          gap: '1rem'
        }}>
          <div>
            <label
              htmlFor="certId"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#4a5568',
                fontSize: '0.9rem'
              }}
            >
              Certificate ID *
            </label>
            <input
              id="certId"
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="reason"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#4a5568',
                fontSize: '0.9rem'
              }}
            >
              Reason for Report *
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '100px',
                resize: 'vertical'
              }}
              placeholder="Please provide detailed information about why you believe this certificate is fraudulent..."
            />
          </div>

          <div>
            <label
              htmlFor="evidence"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#4a5568',
                fontSize: '0.9rem'
              }}
            >
              Supporting Evidence (Optional)
            </label>
            <div style={{
              border: '2px dashed #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
              cursor: 'pointer'
            }}>
              <input
                id="evidence"
                type="file"
                onChange={(e) => setEvidence(e.target.files[0])}
                style={{ display: 'none' }}
                accept="image/*,.pdf,.doc,.docx"
              />
              <label htmlFor="evidence" style={{ cursor: 'pointer', color: '#667eea' }}>
                {evidence ? '✓ File Selected' : '📎 Click to Upload Evidence'}
              </label>
            </div>
          </div>

          {message && (
            <div style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: message.type === 'success' ? '#f0fff4' : '#fff5f5',
              color: message.type === 'success' ? '#2f855a' : '#c53030',
              border: `1px solid ${message.type === 'success' ? '#c6f6d5' : '#feb2b2'}`
            }}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease',
              marginTop: '1rem'
            }}
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default ReportCertificate; 