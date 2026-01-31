import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';

const OwnerLayout = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#F9FAFB' }}>
      <Sidebar userRole={user?.role} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <TopBar title="Owner Dashboard" />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
export default OwnerLayout;