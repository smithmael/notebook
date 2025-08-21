import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material'; // For a loading spinner

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth(); // Assume useAuth also returns a 'loading' boolean

  // If the auth state is still being determined, show a loading spinner.
  // This prevents a brief flash of the login page on initial load.
  if (loading) { 
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not loading and no user, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />; // 'replace' is good practice for auth redirects
  }

  // If a role is required and it doesn't match, redirect.
  if (role && user.role !== role) {
    // It's often better to redirect to the home page or an "unauthorized" page
    // than back to login if they are already authenticated.
    return <Navigate to="/" replace />; 
  }

  return children;
};

export default ProtectedRoute;