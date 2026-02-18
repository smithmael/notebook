import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  Box, Typography, TextField, Button, Divider, 
 Grid, // ✅ Use Grid2 to match modern MUI v6 standards
  LinearProgress, Alert, Fade 
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import api from '../../api/axios';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState('');

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

      setAuth(token, user.role);

      setTimeout(() => {
        if (user.role === 'ADMIN') navigate('/admin/dashboard');
        else if (user.role === 'OWNER') navigate('/owner/dashboard');
        else navigate('/bookshelf');
      }, 100);

    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <Grid container sx={{ height: '100vh', bgcolor: '#F5F7FA' }}>
      {/* ✅ FIX: Removed 'item' and used 'size' object for MUI v6 */}
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

      {/* ✅ FIX: Removed 'item' and used 'size' object */}
      <Grid size={{ xs: 12, sm: 8, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isSubmitting && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4 }} />}
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Box sx={{ maxWidth: 400, width: '100%' }}>
            <Typography variant="h4" fontWeight="800" gutterBottom>Login</Typography>
            
            {error && (
              <Alert severity={error.includes("pending") ? "info" : "error"} sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField 
                fullWidth label="Email address" margin="normal" 
                {...register('email', { required: true })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <TextField 
                fullWidth label="Password" type="password" margin="normal" 
                {...register('password', { required: true })} 
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />

              <Button 
                type="submit" fullWidth variant="contained" disabled={isSubmitting}
                sx={{ 
                  mt: 4, mb: 2, bgcolor: '#171B36', height: 56, borderRadius: 3, fontWeight: '800',
                  '&:hover': { bgcolor: '#00A3FF' } 
                }}
              >
                {isSubmitting ? 'VERIFYING...' : 'LOGIN'}
              </Button>

              <Divider sx={{ my: 3 }}>OR</Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account? 
                  <Button onClick={() => navigate('/signup')} sx={{ fontWeight: '800', color: '#00A3FF', ml: 1 }}>
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