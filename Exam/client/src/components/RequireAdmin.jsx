// client/src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
}
