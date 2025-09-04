
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Search: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      sessionStorage.removeItem('auth-token');
      navigate('/login');
    }
  }, [navigate]);

  const systemInfo = localStorage.getItem('system-info') || '';

  return (
    <div className="page-container">
      <div className="dashboard-content">
        <p>Welcome! You have successfully logged in.</p>
        <div style={{ marginTop: 16, fontWeight: 500 }}>
          System Info: <span style={{ color: '#1976d2' }}>{systemInfo}</span>
        </div>
      </div>
    </div>
  );
};

export default Search;
