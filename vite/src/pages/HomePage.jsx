import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/home.css';

function HomePage() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const navigate = useNavigate();

  const verifyCode = async (e) => {
    e?.preventDefault();
    setError('');
    setResult(null);
    setAiAnalysis(null);
    
    if (!code.trim()) {
      setError('Please enter a verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/verify/${code.trim()}`);
      if (response.data && !response.data.error) {
        setResult(response.data);
        
        // If AI is enabled, get additional analysis
        if (useAI) {
          try {
            const aiResponse = await axios.post(`http://localhost:5000/api/verify/ai-analysis`, {
              certificateData: response.data
            });
            setAiAnalysis(aiResponse.data);
          } catch (aiErr) {
            console.error('AI analysis failed:', aiErr);
            // Don't show error to user as this is an enhancement
          }
        }
      } else {
        setError(response.data.error || 'Invalid or used code.');
      }
    } catch (err) {
      setError('Invalid or used code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Layout>
      <div className="home-container">
        {/* Add particles */}
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        
        <div className="home-content">
          {/* Hero Section */}
          <section className="hero-section">
            <h1 className="hero-title">
              Verify Your Certificates with Confidence
            </h1>
            <p className="hero-subtitle">
              Our secure verification system ensures the authenticity of your educational and professional certificates using advanced blockchain technology.
            </p>
          </section>

          {/* Verification Form */}
          <section className="verification-form">
            <h2 className="verification-title">Certificate Verification</h2>

            <form onSubmit={verifyCode}>
              <div className="search-container">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>

              <div className="ai-toggle">
                <label className="ai-toggle-label">
                  <input
                    type="checkbox"
                    checked={useAI}
                    onChange={(e) => setUseAI(e.target.checked)}
                  />
                  <span className="ai-toggle-text">
                    Enable AI-powered verification insights
                    <span className="ai-badge">AI</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="verify-button"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span>Verify Certificate</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {error && (
                <div className="auth-error">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              )}
            </form>
          </section>

          {/* Features Grid */}
          <section className="features-grid">
            {[
              {
                icon: '🔒',
                title: 'Secure Verification',
                description: 'Advanced encryption and security measures to protect certificate data.'
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                description: 'Get verification results in real-time with our fast processing system.'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                description: 'Verify certificates on any device with our responsive platform.'
              },
              {
                icon: '📊',
                title: 'Detailed Information',
                description: 'Access comprehensive certificate details and verification history.'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </section>

          {/* Certificate Result */}
          {result && (
            <section className="certificate-result">
              <div className="result-status">
                <span className="status-badge">
                  <span>✓</span>
                  <span>Certificate Verified</span>
                </span>
              </div>

              <div className="result-grid">
                {[
                  { label: 'Name', value: result.name },
                  { label: 'Issued By', value: result.issuer },
                  { label: 'Issue Date', value: result.issueDate ? new Date(result.issueDate).toLocaleDateString() : 'N/A' },
                  { label: 'Expiry Date', value: result.expiryDate ? new Date(result.expiryDate).toLocaleDateString() : 'N/A' },
                  { label: 'Status', value: result.valid ? 'Valid' : 'Invalid', isStatus: true }
                ].map((item, index) => (
                  <div key={index} className="result-item">
                    <div className="result-label">
                      {item.label}
                    </div>
                    <div className={`result-value ${item.isStatus ? (result.valid ? 'valid' : 'invalid') : ''}`}>
                      {item.value || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Analysis Section */}
              {aiAnalysis && (
                <div className="ai-analysis">
                  <div className="ai-header">
                    <span className="ai-icon">🤖</span>
                    <h3>AI-Powered Insights</h3>
                    <span className="ai-badge">AI</span>
                  </div>
                  <div className="ai-content">
                    {aiAnalysis.insights.map((insight, index) => (
                      <div key={index} className="ai-insight">
                        <span className="insight-icon">{insight.icon}</span>
                        <div className="insight-content">
                          <h4>{insight.title}</h4>
                          <p>{insight.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => {
                    setResult(null);
                    setAiAnalysis(null);
                    setCode('');
                  }}
                  className="verify-another-btn"
                >
                  Verify Another Certificate
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Layout>
  );
}

export default HomePage;
