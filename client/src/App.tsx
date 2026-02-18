import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress } from '@mui/material';

import { useAuthStore } from './store/authStore';

import LoginPage from './pages/auth/Login';
import SignupPage from './pages/auth/Signup'; 
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import BookUpload from './pages/owner/BookUpload';
import DashboardLayout from './components/layout/DashboardLayout';

const theme = createTheme({
  palette: { primary: { main: '#00A3FF' } },
});

// 🛡️ Helper Component: Prevents loops by handling logic in one place
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole)?.toUpperCase();

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userRole || '')) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

function App() {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole);
  const _hasHydrated = useAuthStore((state) => state._hasHydrated);
  
  const isAuthenticated = !!token;
  const role = userRole?.toUpperCase();

  if (!_hasHydrated) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />} />

          {/* Protected Routes (Wrapped in Layout) */}
          <Route element={<DashboardLayout />}>
            
            {/* Owner Only */}
            <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/upload" element={<BookUpload />} />
            </Route>

            {/* Admin Only */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<div>Admin Books List</div>} />
              <Route path="/admin/owners" element={<div>Admin Owners List</div>} />
            </Route>

          </Route>

          {/* Logic for Root / and Redirects */}
          <Route path="/" element={
            isAuthenticated 
              ? <Navigate to={role === 'ADMIN' ? "/admin/dashboard" : "/owner/dashboard"} replace /> 
              : <Navigate to="/login" replace />
          } />

          {/* Catch-all for everything else */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;