import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Link as MuiLink, Divider, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import StyledBookLogo from '../assets/StyledBookLogo';

const primaryBlue = '#00bfff';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      const loggedInUser = await login(email, password);
      // Redirect based on role after successful login
      if (loggedInUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/owner/dashboard');
      }
    } catch (err) {
      // THIS IS THE FIX: Check for a response from the API
      // and use the specific error message it sends.
      const errorMessage = err.response?.data?.errors?.[0]?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {/* ... your header box ... */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
            <StyledBookLogo sx={{ fontSize: 50, color: primaryBlue }} />
            <Typography component="h1" variant="h5" sx={{ ml: 1.5, fontWeight: 'bold' }}>
              Book Rent
            </Typography>
          </Box>
          <Box sx={{ width: '100%', mb: 1 }}>
            <Typography component="h2" variant="h5">Login</Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
            {/* The Alert component will now display the helpful error message */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="Email address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField variant="outlined" margin="normal" required fullWidth name="password" label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5, backgroundColor: primaryBlue, '&:hover': { backgroundColor: '#00aeee' }, fontWeight: 'bold' }}>LOGIN</Button>
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don't have an account?{' '}
              <MuiLink component={Link} to="/signup" variant="body2" sx={{ color: primaryBlue, fontWeight: 'bold', textDecoration: 'none' }}>Sign up</MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </AuthLayout>
  );
}
export default LoginPage;