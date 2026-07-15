
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // If no token exists, kick them back to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a specific role is required and the user doesn't have it, kick them out
  if (allowedRole && userRole !== allowedRole) {
    // Redirect learners trying to access admin (and vice versa) to their correct home
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/learner'} replace />;
  }

  // If authorized, render the requested page
  return children;
}