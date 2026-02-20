import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Box, Typography, TextField, Button, Divider, 
  Grid, Alert, Fade, Backdrop 
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

// ✅ Import your thematic hollow book loader
import { BookLoader } from '../../components/loaders/BookLoader';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (formData: any) => {
    try {
      setError('');
      const response = await api.post('/auth/login', formData);
      const { user, token } = response.data.data;

      if (user.role === 'OWNER' && user.status === 'pending') {
        setError("Your account is pending admin approval. Please wait for activation.");
        return; 
      }

      setLoginSuccess(true);
      setAuth(token, user.role);

      // Transition time for the "Success" feeling
      setTimeout(() => {
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'OWNER') navigate('/owner/dashboard');
        else navigate('/bookshelf');
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <Grid container sx={{ height: '100vh', bgcolor: '#F5F7FA' }}>
      
      {/* 🚀 Thematic Loader Overlay */}
      <Backdrop
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          bgcolor: loginSuccess ? 'rgba(0, 163, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)', // Figma-style blur
          transition: 'all 0.5s ease'
        }}
        open={isSubmitting || loginSuccess}
      >
        <Box sx={{ transform: 'scale(1.5)' }}>
           <BookLoader />
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800, 
            letterSpacing: 4, 
            color: '#171B36', 
            mt: -10, // Adjust based on loader height
            opacity: 0.8,
            textTransform: 'uppercase'
          }}
        >
          {loginSuccess ? 'Welcome Back' : 'Opening your library...'}
        </Typography>
      </Backdrop>

      {/* Brand Side */}
      <Grid 
        size={{ xs: 0, sm: 4, md: 6 }} 
        sx={{ 
          background: 'linear-gradient(135deg, #171B36 0%, #0D1021 100%)', 
          display: { xs: 'none', sm: 'flex' }, 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' 
        }}
      >
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center' }}>
            <AutoStoriesIcon sx={{ fontSize: 100, mb: 2, color: '#00A3FF' }} />
            <Typography variant="h3" fontWeight="900">BookRent</Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>Secure Book Rental Management</Typography>
          </Box>
        </Fade>
      </Grid>

      {/* Form Side */}
      <Grid size={{ xs: 12, sm: 8, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#171B36' }}>
              Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Enter your credentials to access your dashboard
            </Typography>
            
            {error && (
              <Alert 
                severity={error.includes("pending") ? "info" : "error"} 
                sx={{ mb: 3, borderRadius: 3, fontWeight: 600, border: '1px solid' }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField 
                fullWidth label="Email address" margin="normal" 
                {...register('email', { required: true })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
              />
              <TextField 
                fullWidth label="Password" type="password" margin="normal" 
                {...register('password', { required: true })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
              />

              <Button 
                type="submit" fullWidth variant="contained" 
                disabled={isSubmitting || loginSuccess}
                sx={{ 
                  mt: 4, mb: 2, bgcolor: '#171B36', height: 56, borderRadius: 3, fontWeight: '900',
                  letterSpacing: 1,
                  boxShadow: '0 8px 16px rgba(23, 27, 54, 0.2)',
                  '&:hover': { bgcolor: '#00A3FF', boxShadow: '0 8px 24px rgba(0, 163, 255, 0.3)' } 
                }}
              >
                {isSubmitting ? 'VERIFYING...' : 'LOGIN'}
              </Button>

              <Divider sx={{ my: 3 }}>
                 <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account? 
                  <Button 
                    onClick={() => navigate('/signup')} 
                    sx={{ fontWeight: '900', color: '#00A3FF', ml: 1, textTransform: 'none' }}
                  >
                    Sign Up
                  </Button>
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;