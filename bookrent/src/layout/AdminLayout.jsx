import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const AdminLayout = () => {
    return (
     <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Pass userRole to control Sidebar Links */}
        <Sidebar userRole="Admin" />
        <Box sx={{ flex: 1, backgroundColor: '#f7f9fc', overflowY: 'auto' }}>
            <TopBar title="Admin Dashboard"/>
            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
     </Box>
    );
};
export default AdminLayout;