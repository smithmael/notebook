import React, { useState } from 'react';
import AuthLayout from '../layout/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Checkbox } from '@mui/material';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Hardcoded credentials for demonstration purposes
    if ((email === 'admin@example.com' && password === 'password') || (email === 'owner@example.com' && password === 'password')) {
      if (email === 'admin@example.com') {
        localStorage.setItem('userRole', 'admin');
        navigate('/admin');
      } else if (email === 'owner@example.com') {
        localStorage.setItem('userRole', 'owner');
        navigate('/owner');
      }
    } else {
      alert('Invalid credentials');
    }
  };

  const formFields = [
    {
      id: 'email',
      label: 'Email Address',
      name: 'email',
      type: 'email',
      autoComplete: 'email',
      autoFocus: true,
      value: email,
      onChange: (e) => setEmail(e.target.value),
    },
    {
      id: 'password',
      label: 'Password',
      name: 'password',
      type: 'password',
      autoComplete: 'current-password',
      value: password,
      onChange: (e) => setPassword(e.target.value),
    },
  ];

  return (
    <AuthLayout title="Login" onSubmit={handleSubmit} formFields={formFields}>
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
    </AuthLayout>
  );
}

export default LoginForm;