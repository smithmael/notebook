import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; // Make sure TopBar is here
import { useAuth } from '../context/AuthContext';

const OwnerLayout = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Sidebar userRole={user?.role} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar /> {/* Renders once at the top */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          <Outlet /> {/* Renders the specific page content */}
        </Box>
      </Box>
    </Box>
  );
};

export default OwnerLayout;