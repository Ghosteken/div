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
  const [verificationResult, setVerificationResult] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [recentVerifications, setRecentVerifications] = useState([]);
  const [showRecentVerifications, setShowRecentVerifications] = useState(false);
  const navigate = useNavigate();

  const verifyCode = async (e) => {
    e?.preventDefault(); // Prevent form submission
    if (!code.trim()) {
      alert('Please enter a verification code');
      return;
    }

    setIsLoading(true);
    try {
      // First verify the code
      const verifyResponse = await axios.get(`http://localhost:5000/api/verify/${code}`);
      console.log('Verification response:', verifyResponse.data);
      setVerificationResult(verifyResponse.data);
      setShowSuccessPopup(true);

      // If AI is enabled, get the analysis
      if (useAI) {
        try {
          console.log('Requesting AI analysis for code:', code);
          const aiResponse = await axios.get(`http://localhost:5000/api/verify/${code}/ai`, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log('AI analysis response:', aiResponse.data);
          setAiAnalysis(aiResponse.data.analysis);
        } catch (aiError) {
          console.error('AI analysis failed:', aiError);
          setAiAnalysis({
            error: 'AI analysis is currently unavailable. Please try again later.',
            details: {
              issuer: verifyResponse.data.issuer,
              issueDate: verifyResponse.data.uploadDate,
              verificationStatus: verifyResponse.data.isVerified ? 'Verified' : 'Pending'
            }
          });
        }
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert(error.response?.data?.message || 'Error verifying certificate');
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

            <form onSubmit={verifyCode} className="space-y-6">
              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Verification Code
                </label>
                <input
                  type="text"
                  id="verificationCode"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your verification code"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useAI"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="useAI" className="ml-2 block text-sm text-gray-700">
                  Use AI Analysis
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify Certificate'}
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Verification Result</h2>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium">✓ Certificate verified successfully!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Certificate Details</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-600">Certificate ID:</span> {verificationResult?.certificateId}</p>
                    <p><span className="text-gray-600">Issuer:</span> {verificationResult?.issuer}</p>
                    <p><span className="text-gray-600">Upload Date:</span> {verificationResult?.uploadDate && new Date(verificationResult.uploadDate).toLocaleDateString()}</p>
                    <p><span className="text-gray-600">Status:</span> {verificationResult?.isVerified ? 'Verified' : 'Pending'}</p>
                    <p><span className="text-gray-600">Verification Code:</span> {verificationResult?.originalCode}</p>
                  </div>
                </div>

                {useAI && aiAnalysis && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">AI Analysis</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Authenticity:</span> {aiAnalysis.authenticity}</p>
                      <p><span className="text-gray-600">Confidence:</span> {aiAnalysis.confidence}%</p>
                      {aiAnalysis.details && (
                        <>
                          <p><span className="text-gray-600">Student Name:</span> {aiAnalysis.details.studentName}</p>
                          <p><span className="text-gray-600">Program:</span> {aiAnalysis.details.program}</p>
                          <p><span className="text-gray-600">Grade:</span> {aiAnalysis.details.grade}</p>
                        </>
                      )}
                      {aiAnalysis.error && (
                        <p className="text-red-600">{aiAnalysis.error}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verification Result */}
      {verificationResult && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#2d3748', marginBottom: '1rem' }}>Verification Result</h2>
          <pre style={{ color: '#4a5568' }}>{JSON.stringify(verificationResult, null, 2)}</pre>
        </div>
      )}

      {/* Recent Verifications Section */}
      {showRecentVerifications && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Verifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVerifications && recentVerifications.length > 0 ? (
              recentVerifications.map((verification) => (
                <div key={verification.id} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{verification.certificateId}</h3>
                  <p className="text-gray-600">Issuer: {verification.issuer}</p>
                  <p className="text-gray-600">Date: {new Date(verification.uploadDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">Status: {verification.isVerified ? 'Verified' : 'Pending'}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-full">No recent verifications found.</p>
            )}
          </div>
        </div>
      )}

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
