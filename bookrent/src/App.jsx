import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
//notification and setting
import AdminNotifications from './pages/Admin/AdminNotifications';
import AdminSettings from './pages/Admin/AdminSettings';
import OwnerNotifications from './pages/Owner/OwnerNotifications';
import OwnerSettings from './pages/Owner/OwnerSettings';
// Import Layouts - These are the "parent" components
import AdminLayout from './layout/AdminLayout';
import OwnerLayout from './layout/OwnerLayout';

// Import ALL Pages - These are the "child" components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminBooks from './pages/Admin/AdminBooks';
import AdminOwners from './pages/Admin/AdminOwners';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import BookUploadPage from './pages/Owner/BookUploadPage';

function App() {
  return (
    <AuthProvider>
       
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Admin Nested Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="owners" element={<AdminOwners />} />
            <Route path="notifications" element={<AdminNotifications />} /> 
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Owner Nested Routes */}
          <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="upload" element={<BookUploadPage />} />
            <Route path="notifications" element={<OwnerNotifications />} />
            <Route path="settings" element={<OwnerSettings />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
     
    </AuthProvider>
  );
}

export default App;