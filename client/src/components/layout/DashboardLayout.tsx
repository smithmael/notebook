import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom'; // ✅ Added useLocation
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation(); // ✅ Track current URL path

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <CssBaseline />
      
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: '240px', 
          width: `calc(100% - 240px)`,
          overflowY: 'auto',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* 🚀 WRAPPER FOR ANIMATION 
          The 'key' prop is vital. When the path changes, 
          React treats this as a new element and re-runs the 'page-transition' 
        */}
        <Box 
          key={location.pathname} 
          className="page-transition" 
          sx={{ p: 3, flexGrow: 1 }}
        >
          {children || <Outlet />}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;