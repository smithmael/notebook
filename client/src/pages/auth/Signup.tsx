//client/src/pages/auth/Signup.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  Box, Typography, TextField, Button, Divider, 
   Grid, RadioGroup, Paper, LinearProgress, Fade, Zoom, Link 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSignupSchema, UserSignupInput } from '../../../../server/src/utils/validators';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MenuBookIcon from '@mui/icons-material/MenuBook';

const SignupPage = () => {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<UserSignupInput['body']>({
    resolver: zodResolver(userSignupSchema.shape.body) as any,
    defaultValues: { role: 'USER', name: '', email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data: any) => {
    try {
      await api.post('/auth/signup', data);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2200);
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Grid container sx={{ height: '100vh', bgcolor: '#F5F7FA' }}>
      {/* Brand Side */}
      <Grid size={{ xs: 0, sm: 4, md: 6 }} 
        sx={{ 
          background: 'linear-gradient(135deg, #171B36 0%, #0D1021 100%)', 
          display: { xs: 'none', sm: 'flex' }, 
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' 
        }}
      >
        <AutoStoriesIcon sx={{ fontSize: 100, mb: 2, color: '#00A3FF' }} />
        <Typography variant="h4" fontWeight="800">BookRent</Typography>
      </Grid>

      {/* Form Side */}
      <Grid size={{ xs: 12, sm: 8, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {isSubmitting && <LinearProgress sx={{ height: 4, position: 'absolute', top: 0, left: 0, right: 0 }} />}
        
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          {isSuccess ? (
            <Zoom in={isSuccess}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#4CAF50', mb: 2 }} />
                <Typography variant="h4" fontWeight="800">Awesome!</Typography>
                <Typography variant="body1" color="text.secondary">Account created. Redirecting to login...</Typography>
              </Box>
            </Zoom>
          ) : (
            <Fade in={!isSuccess}>
              <Box sx={{ maxWidth: 450, width: '100%' }}>
                <Typography variant="h4" fontWeight="800" gutterBottom>Get Started</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Join our community today.</Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Role Selector (Same as before) */}
                  <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700 }}>Choose Account Type</Typography>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row sx={{ mb: 4, gap: 2 }}>
                        {[
                          { val: 'USER', label: 'Renter', icon: <PersonSearchIcon /> },
                          { val: 'OWNER', label: 'Owner', icon: <MenuBookIcon /> }
                        ].map((item) => (
                          <Paper
                            key={item.val}
                            variant="outlined"
                            onClick={() => field.onChange(item.val)}
                            sx={{
                              flex: 1, p: 2, cursor: 'pointer', borderRadius: 3, border: '2px solid',
                              borderColor: field.value === item.val ? '#00A3FF' : '#E0E4EC',
                              bgcolor: field.value === item.val ? 'rgba(0, 163, 255, 0.04)' : 'white',
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': { transform: 'translateY(-2px)', borderColor: '#00A3FF' }
                            }}
                          >
                            <Box sx={{ color: field.value === item.val ? '#00A3FF' : '#637381', mb: 1 }}>{item.icon}</Box>
                            <Typography variant="body1" fontWeight="700">{item.label}</Typography>
                          </Paper>
                        ))}
                      </RadioGroup>
                    )}
                  />

                  {/* Form Inputs */}
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}><TextField fullWidth label="Full Name" {...register('name')} error={!!errors.name} helperText={errors.name?.message} /></Grid>
                    <Grid size={{ xs: 12 }}><TextField fullWidth label="Email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} /></Grid>
                    <Grid size={{ xs: 6 }}><TextField fullWidth label="Password" type="password" {...register('password')} error={!!errors.password} /></Grid>
                    <Grid size={{ xs: 6 }}><TextField fullWidth label="Confirm" type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} /></Grid>
                  </Grid>

                  <Button 
                    type="submit" fullWidth variant="contained" disabled={isSubmitting}
                    sx={{ mt: 4, mb: 3, bgcolor: '#171B36', height: 54, borderRadius: 3, fontWeight: '800', '&:hover': { bgcolor: '#00A3FF' } }}
                  >
                    {isSubmitting ? 'CREATING...' : 'CREATE ACCOUNT'}
                  </Button>

                  {/* ✅ THE PROFESSIONAL "BACK TO LOGIN" FOOTER */}
                  <Divider sx={{ mb: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>OR</Typography>
                  </Divider>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account?{' '}
                      <Link 
                        component="button"
                        type="button"
                        onClick={() => navigate('/login')}
                        sx={{ 
                          fontWeight: '800', 
                          color: '#00A3FF', 
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                      >
                        Login
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Box>
            </Fade>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;