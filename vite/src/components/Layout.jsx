import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userNin');
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🎓 CertifyMe
            </span>
          </Link>

          <nav style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <Link
              to="/"
              style={{
                color: location.pathname === '/' ? '#667eea' : '#4a5568',
                textDecoration: 'none',
                fontWeight: location.pathname === '/' ? '600' : '400',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '6px'
              }}
            >
              Home
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={`/${userRole?.toLowerCase()}-dashboard`}
                  style={{
                    color: location.pathname.includes('dashboard') ? '#667eea' : '#4a5568',
                    textDecoration: 'none',
                    fontWeight: location.pathname.includes('dashboard') ? '600' : '400',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px'
                  }}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Link
                  to="/login?role=student"
                  style={{
                    backgroundColor: '#4299e1',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Student Sign In
                </Link>
                <Link
                  to="/login?role=institution"
                  style={{
                    backgroundColor: '#48bb78',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Institution Sign In
                </Link>
                <Link
                  to="/login?role=admin"
                  style={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Admin Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '2rem 0',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>About CertifyMe</h3>
            <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
              Secure certificate verification platform for educational institutions and organizations.
            </p>
          </div>
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/" style={{ color: '#4a5568', textDecoration: 'none' }}>Home</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/login?role=student" style={{ color: '#4a5568', textDecoration: 'none' }}>Student Portal</Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/login?role=institution" style={{ color: '#4a5568', textDecoration: 'none' }}>Institution Portal</Link>
              </li>
              <li>
                <Link to="/login?role=admin" style={{ color: '#4a5568', textDecoration: 'none' }}>Admin Portal</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Contact</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
                📧 support@certifyme.com
              </li>
              <li style={{ marginBottom: '0.5rem', color: '#4a5568' }}>
                📱 +1 (555) 123-4567
              </li>
              <li style={{ color: '#4a5568' }}>
                📍 123 Certification Ave, Suite 100
              </li>
            </ul>
          </div>
          <div>
            <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>Follow Us</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}>
                𝕏
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}>
                in
              </a>
              <a href="#" style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}>
                f
              </a>
            </div>
          </div>
        </div>
        <div style={{
          maxWidth: '1200px',
          margin: '2rem auto 0',
          padding: '2rem 2rem 0',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center',
          color: '#4a5568'
        }}>
          © {new Date().getFullYear()} CertifyMe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Layout; 