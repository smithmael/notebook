import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container, Link as MuiLink, Divider, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import StyledBookLogo from '../assets/StyledBookLogo';

const primaryBlue = '#00bfff';

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth(); // Get the signup function from context

  // --- State for all form fields ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // --- Front-end validation ---
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }

    try {
      // Create the data object to send to the API
      const userData = { name, email, password, location, phone };
      
      // Call the signup function from our context
      await signup(userData);
      
      setSuccess('Account created successfully! Please log in.');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds

    } catch (err) {
      // Handle errors from the API (like "user already exists")
      const errorMessage = err.response?.data?.errors?.[0]?.message || 'An unexpected error occurred during signup.';
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
            <StyledBookLogo sx={{ fontSize: 50, color: primaryBlue }} />
            <Typography component="h1" variant="h5" sx={{ ml: 1.5, fontWeight: 'bold' }}>Book Rent</Typography>
          </Box>
          <Box sx={{ width: '100%', mb: 1 }}>
            <Typography component="h2" variant="h5">Signup as Owner</Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          <Box component="form" onSubmit={handleSignup} noValidate sx={{ mt: 1, width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            {/* --- Controlled Components --- */}
            <TextField variant="outlined" margin="dense" fullWidth name="name" label="FullName" value={name} onChange={(e) => setName(e.target.value)} />
            <TextField variant="outlined" margin="dense" required fullWidth label="Email address" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField variant="outlined" margin="dense" required fullWidth name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <TextField variant="outlined" margin="dense" required fullWidth name="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <TextField variant="outlined" margin="dense" fullWidth name="location" label="Location (Optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
            <TextField variant="outlined" margin="dense" fullWidth name="phone" label="Phone Number (Optional)" value={phone} onChange={(e) => setPhone(e.target.value)} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, py: 1.5, backgroundColor: primaryBlue, '&:hover': { backgroundColor: '#00aeee' }, fontWeight: 'bold' }}>SIGN UP</Button>
            
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" variant="body2" sx={{ color: primaryBlue, fontWeight: 'bold', textDecoration: 'none' }}>Login</MuiLink>
            </Typography>
          </Box>
        </Box>
      </Container>
    </AuthLayout>
  );
}
export default SignupPage;