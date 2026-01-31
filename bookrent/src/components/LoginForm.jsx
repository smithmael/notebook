import React, { useState } from 'react';
import AuthLayout from '../layout/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext'; // Import Context

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      // Use the context to login via API
      const user = await login(email, password);
      
      // Role-based redirect
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/owner/dashboard');
      
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  const formFields = [
    { id: 'email', label: 'Email', name: 'email', type: 'email', value: email, onChange: e => setEmail(e.target.value) },
    { id: 'password', label: 'Password', name: 'password', type: 'password', value: password, onChange: e => setPassword(e.target.value) },
  ];

  return (
    <AuthLayout title="Login" onSubmit={handleSubmit} formFields={formFields}>
      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
    </AuthLayout>
  );
}
export default LoginForm;