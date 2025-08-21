import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar'; // Assuming you have a generic TopBar

const AdminLayout = () => {
    // Define navigation links specifically for the Admin
    const adminNavLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: 'DashboardIcon' },
        { name: 'Books', path: '/admin/books', icon: 'BookIcon' },
        { name: 'Owners', path: '/admin/owners', icon: 'OwnerIcon' },
        // Add other admin-specific links here
    ];

    return (
     <Box sx={{ display: 'flex', height: '100vh' }}>
    <Sidebar navLinks={adminNavLinks} userRole="Admin" />
    <Box sx={{ flex: 1, backgroundColor: '#f7f9fc', overflowY: 'auto' }}>
      <TopBar title="Admin"/>
      <Outlet />
    </Box>
  </Box>
    );
};

export default AdminLayout;