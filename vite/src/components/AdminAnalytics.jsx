import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalVerifications: 0,
    totalInstitutions: 0,
    totalReports: 0,
    recentActivity: [],
    verificationTrends: [],
    institutionStats: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px'
      }}>
        <div style={{ fontSize: '1.5rem', color: '#667eea' }}>Loading analytics...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[
          { label: 'Total Certificates', value: stats.totalCertificates, icon: '📜' },
          { label: 'Total Verifications', value: stats.totalVerifications, icon: '✓' },
          { label: 'Registered Institutions', value: stats.totalInstitutions, icon: '🏛️' },
          { label: 'Reported Certificates', value: stats.totalReports, icon: '⚠️' }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
            <h3 style={{ margin: 0, color: '#2d3748', fontSize: '2rem' }}>
              {stat.value.toLocaleString()}
            </h3>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Recent Activity</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stats.recentActivity.map((activity, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>
                {activity.type === 'verification' ? '✓' :
                 activity.type === 'upload' ? '📤' :
                 activity.type === 'report' ? '⚠️' : '📋'}
              </span>
              <div>
                <p style={{ margin: '0 0 0.25rem', color: '#2d3748', fontWeight: '500' }}>
                  {activity.description}
                </p>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4a5568' }}>
                  {activity.institution}
                </p>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                {new Date(activity.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Institution Statistics */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 1rem', color: '#2d3748' }}>Institution Statistics</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {stats.institutionStats.map((inst, index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🏛️</span>
              <div>
                <p style={{ margin: '0 0 0.25rem', color: '#2d3748', fontWeight: '500' }}>
                  {inst.name}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.875rem',
                  color: '#4a5568'
                }}>
                  <span>Certificates: {inst.certificateCount}</span>
                  <span>Verifications: {inst.verificationCount}</span>
                  <span>Reports: {inst.reportCount}</span>
                </div>
              </div>
              <div style={{
                width: '100px',
                height: '6px',
                backgroundColor: '#e2e8f0',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(inst.verificationCount / inst.certificateCount) * 100}%`,
                  height: '100%',
                  backgroundColor: '#667eea',
                  borderRadius: '3px'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics; 