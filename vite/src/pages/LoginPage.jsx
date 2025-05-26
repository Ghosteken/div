import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    identifier: '', // NIN for students, email for institutions/admin
    password: ''
  });

  // Get role from URL query parameter
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get('role') || 'student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Hardcoded admin credentials
      if (role === 'admin') {
        if (formData.identifier === 'admin@certifyme.com' && formData.password === 'admin123') {
          localStorage.setItem('token', 'admin-token');
          localStorage.setItem('userRole', 'admin');
          navigate('/admin-dashboard');
          return;
        } else {
          throw new Error('Invalid admin credentials');
        }
      }

      const endpoint = `/api/${role}/login`;
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', role);
      
      if (role === 'student') {
        localStorage.setItem('userNin', formData.identifier);
      }

      navigate(`/${role}-dashboard`);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          ← Back to Home
        </button>

        <h2 className="auth-title">
          {role === 'student' ? 'Student Login' :
           role === 'institution' ? 'Institution Login' :
           'Admin Login'}
        </h2>
        
        <p className="auth-subtitle">
          {role === 'student' ? 'Access your student portal' :
           role === 'institution' ? 'Manage your institution' :
           'Administrative access only'}
        </p>

        {error && (
          <div className="auth-error">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="identifier" className="form-label">
              {role === 'student' ? 'NIN' : 'Email Address'}
            </label>
            <input
              id="identifier"
              type={role === 'student' ? 'text' : 'email'}
              value={formData.identifier}
              onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
              className="form-input"
              placeholder={role === 'student' ? 'Enter your NIN' : 'Enter your email'}
              required
              autoComplete={role === 'student' ? 'off' : 'username'}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className={`auth-btn ${role}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {role === 'student' ? "Don't have a NIN?" :
             role === 'institution' ? 'Want to register your institution?' :
             'Admin Access Only'}
          </p>
          {role !== 'admin' && (
            <Link
              to={role === 'student' ? '/signup/student' : '/signup/institution'}
              className={`auth-link ${role}`}
            >
              {role === 'student' ? 'Create Student Account' : 'Register Institution'}
            </Link>
          )}
          {role === 'admin' && (
            <div style={{ color: '#667eea', fontWeight: '500' }}>
              This area is restricted to system administrators only.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
