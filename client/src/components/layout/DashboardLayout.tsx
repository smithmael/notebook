// components/layout/DashboardLayout.tsx
import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom'; // ✅ Import Outlet
import Sidebar from './Sidebar';

// ✅ Added interface to make children optional (?) 
// This fixes the "Property children is missing" error in App.tsx
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F7FA' }}>
      <CssBaseline />
      
      <Sidebar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: '240px', 
          width: `calc(100% - 240px)`,
          overflowY: 'auto'
        }}
      >
        {/* ✅ FIX: If children are passed (standard way), show them.
            Otherwise, show the Outlet (React Router way). */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default DashboardLayout;