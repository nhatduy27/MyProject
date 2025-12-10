import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getTokens } from '../api/axiosClient';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { accessToken } = getTokens();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;