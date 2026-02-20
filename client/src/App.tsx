import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion'; 

import { useAuthStore } from './store/authStore';

// Page Imports
import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup'; 
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import Owners from './pages/admin/Owners'; 
import BookUpload from './pages/owner/BookUpload';
import Bookshelf from './pages/user/Bookshelf';

// Loader Import
import { BookLoader } from './components/loaders/BookLoader';

const theme = createTheme({
  palette: { 
    primary: { main: '#00A3FF' },
    background: { default: '#F8FAFC' },
    text: { primary: '#171B36' }
  },
  typography: { 
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 900 },
    h5: { fontWeight: 800 }
  }
});

// --- 📖 Initial App Boot Loader (Only shows once) ---
const GlobalPageLoader = () => (
  <Box sx={{ 
    height: '100vh', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' 
  }}>
    <Box sx={{ position: 'relative', width: 80, height: 60, display: 'flex', justifyContent: 'center' }}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -160 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '50%', height: '100%', border: '3px solid #00A3FF',
          borderRight: 'none', borderRadius: '4px 0 0 4px', 
          originX: '100%', position: 'absolute', left: 0, 
          backgroundColor: 'white' 
        }}
      />
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 160 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '50%', height: '100%', border: '3px solid #00A3FF',
          borderLeft: 'none', borderRadius: '0 4px 4px 0', 
          originX: '0%', position: 'absolute', right: 0, 
          backgroundColor: 'white' 
        }}
      />
      <Box sx={{ width: 3, height: '100%', bgcolor: '#171B36', borderRadius: 2, zIndex: 2 }} />
    </Box>
    <Typography sx={{ mt: 4, color: '#171B36', fontWeight: 900, letterSpacing: 4, fontSize: '1rem', textTransform: 'uppercase' }}>
      Book Rent
    </Typography>
  </Box>
);

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole)?.toUpperCase();
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);

  // While switching internal routes, only the content area shows the transparent book
  if (!_hasHydrated) return <BookLoader />;
  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole || '')) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

function App() {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  
  // ✅ Key Fix: initialBoot state ensures the global loader only ever runs ONCE
  const [initialBoot, setInitialBoot] = useState(true);

  useEffect(() => {
    if (_hasHydrated) {
      const timer = setTimeout(() => setInitialBoot(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [_hasHydrated]);

  if (initialBoot) return <GlobalPageLoader />;

  const isAuthenticated = !!token;
  const role = userRole?.toUpperCase();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />} />

          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/upload" element={<BookUpload />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/owners" element={<Owners />} /> 
              <Route path="/admin/books" element={<Box sx={{ p: 4 }}>Admin Books Page Content</Box>} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
              <Route path="/bookshelf" element={<Bookshelf />} />
            </Route>
          </Route>

          <Route path="/" element={
            isAuthenticated 
              ? role === 'ADMIN' ? <Navigate to="/admin/dashboard" replace /> 
                : role === 'OWNER' ? <Navigate to="/owner/dashboard" replace />
                : <Navigate to="/bookshelf" replace />
              : <Navigate to="/login" replace />
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;