/* eslint-disable react/prop-types */
// src/components/ProtectedRoute.js
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Context } from '../context/Context';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useContext(Context);

  if (!isAuthenticated) {
    return <Navigate to="/loginAdmin" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
