import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.css';

function InstitutionSignup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    institutionName: '',
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/institution/signup', {
        institutionName: formData.institutionName,
        registrationNumber: formData.registrationNumber,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password
      });

      // Automatically log in after successful signup
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', 'institution');
      navigate('/institution-dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create account. Please try again.');
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

        <h2 className="auth-title">Register Institution</h2>
        <p className="auth-subtitle">Create an account for your institution</p>

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
            <label htmlFor="institutionName" className="form-label">Institution Name</label>
            <input
              id="institutionName"
              type="text"
              value={formData.institutionName}
              onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
              className="form-input"
              placeholder="Enter institution name"
              required
              autoComplete="organization"
            />
          </div>

          <div className="form-group">
            <label htmlFor="registrationNumber" className="form-label">Registration Number</label>
            <input
              id="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              className="form-input"
              placeholder="Enter registration number"
              required
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              placeholder="Enter institution email"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="form-input"
              placeholder="Enter phone number"
              required
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Address</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="form-input"
              placeholder="Enter institution address"
              required
              autoComplete="street-address"
              style={{ minHeight: '100px', resize: 'vertical' }}
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
              placeholder="Create a password"
              required
              autoComplete="new-password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="form-input"
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn institution"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : 'Register Institution'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already registered?</p>
          <Link to="/login?role=institution" className="auth-link institution">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InstitutionSignup; 