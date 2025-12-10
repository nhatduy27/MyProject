import React, { useState, useEffect } from 'react';
import { useLogout, useUserData } from '../hooks/useAuth';
import { getTokens } from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [protectedData, setProtectedData] = useState(null);
  const { mutate: logout } = useLogout();
  const { mutate: fetchUserData } = useUserData();
  const navigate = useNavigate(); 

  useEffect(() => {
    const { accessToken } = getTokens();
    console.log('Current Access Token:', accessToken);
    
    // Fetch protected data
    fetchUserData(undefined, {
      onSuccess: (data) => {
        setProtectedData(data);
      },
      onError: (error) => {
        console.error('Failed to fetch protected data:', error);
      }
    });
  }, [fetchUserData]);

  const handleLogout = () => {
    // Clear localStorage trước
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Gọi API logout
    logout(undefined, {
      onSuccess: () => {
        console.log('Logout successful, redirecting...');
         navigate('/login');
      },
      onError: (error) => {
        console.log('Logout API error, but still redirecting...', error);
         navigate('/login');
      }
    });
  };

  return (
    <div className="dashboard">
      <h1 style={{color: '#050505ff'}}>Dashboard</h1>
      
      <div className="user-info">
        <h2>Welcome to Protected Area</h2>
        <p>You are successfully authenticated!</p>
        
        {protectedData && (
          <div className="user-card">
            <div className="user-info-grid">
              <div className="info-row">
                <span className="label">ID: </span>
                <span className="value">{protectedData.id}</span>
              </div>
              <div className="info-row">
                <span className="label">Họ tên: </span>
                <span className="value">{protectedData.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Email: </span>
                <span className="value">{protectedData.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Vai trò: </span>
                <span className="value badge">{protectedData.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="token-info">
        <h3>Token Status:</h3>
        <p>Access Token: {getTokens().accessToken ? 'Present' : 'Missing'}</p>
        <p>Refresh Token: {getTokens().refreshToken ? 'Present' : 'Missing'}</p>
      </div>
      
      <div className="actions">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;