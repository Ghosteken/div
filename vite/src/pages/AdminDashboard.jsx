import React from 'react';
import Layout from '../components/Layout';
import AdminAnalytics from '../components/AdminAnalytics';

function AdminDashboard() {
  return (
    <Layout>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 0'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontSize: '2rem',
            color: 'white',
            margin: 0
          }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Analytics Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <AdminAnalytics />
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard; 