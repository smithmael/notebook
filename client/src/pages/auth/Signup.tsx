import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  Box, Typography, TextField, Button, Divider, 
  Grid, RadioGroup, Paper, Fade, Link, 
  Backdrop 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSignupSchema, UserSignupInput } from '../../../../server/src/utils/validators';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MenuBookIcon from '@mui/icons-material/MenuBook';

// ✅ Import your thematic hollow book loader
import { BookLoader } from '../../components/loaders/BookLoader';

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
      // Give the user a moment to feel the success before moving
      setTimeout(() => navigate('/login'), 2200);
    } catch (error: any) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Grid container sx={{ height: '100vh', bgcolor: '#F5F7FA' }}>
      
      {/* 🚀 THEMATIC LOADER BACKDROP */}
      <Backdrop
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          // Transitions from clean white to a soft success green tint
          bgcolor: isSuccess ? 'rgba(232, 245, 233, 0.9)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(6px)',
          transition: 'all 0.6s ease-in-out',
          textAlign: 'center'
        }}
        open={isSubmitting || isSuccess}
      >
        {!isSuccess ? (
          <Box sx={{ transform: 'scale(1.2)' }}>
            <BookLoader />
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 2, color: '#171B36', mt: -4 }}>
              CREATING ACCOUNT...
            </Typography>
          </Box>
        ) : (
          <Fade in timeout={800}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 100, color: '#4CAF50' }} />
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#171B36' }}>
                WELCOME ABOARD!
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, opacity: 0.7 }}>
                Your library is being prepared. Redirecting to login...
              </Typography>
            </Box>
          </Fade>
        )}
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
            <Typography variant="body1" sx={{ opacity: 0.7 }}>The Next Generation of Rental Management</Typography>
          </Box>
        </Fade>
      </Grid>

      {/* Form Side */}
      <Grid size={{ xs: 12, sm: 8, md: 6 }} sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
          <Box sx={{ maxWidth: 480, width: '100%' }}>
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ color: '#171B36' }}>
              Get Started
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Join the community and start managing your books today.
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 900, color: '#171B36', fontSize: '0.75rem' }}>
                SIGNUP AS:
              </Typography>
              
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
                        elevation={0}
                        onClick={() => field.onChange(item.val)}
                        sx={{
                          flex: 1, p: 2, cursor: 'pointer', borderRadius: 3, border: '2px solid',
                          borderColor: field.value === item.val ? '#00A3FF' : '#F1F3F5',
                          bgcolor: field.value === item.val ? 'rgba(0, 163, 255, 0.05)' : 'white',
                          transition: 'all 0.2s ease-in-out',
                          display: 'flex', alignItems: 'center', gap: 1.5,
                          '&:hover': { borderColor: '#00A3FF' }
                        }}
                      >
                        <Box sx={{ color: field.value === item.val ? '#00A3FF' : '#919EAB' }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="900">
                          {item.label}
                        </Typography>
                      </Paper>
                    ))}
                  </RadioGroup>
                )}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth label="Full Name" 
                    {...register('name')} 
                    error={!!errors.name} 
                    helperText={errors.name?.message}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth label="Email Address" 
                    {...register('email')} 
                    error={!!errors.email} 
                    helperText={errors.email?.message} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField 
                    fullWidth label="Password" type="password" 
                    {...register('password')} 
                    error={!!errors.password} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField 
                    fullWidth label="Confirm" type="password" 
                    {...register('confirmPassword')} 
                    error={!!errors.confirmPassword} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                  />
                </Grid>
              </Grid>

              <Button 
                type="submit" fullWidth variant="contained" 
                disabled={isSubmitting || isSuccess}
                sx={{ 
                  mt: 4, mb: 3, bgcolor: '#171B36', height: 56, borderRadius: 3, fontWeight: '900',
                  boxShadow: '0 8px 16px rgba(23, 27, 54, 0.15)',
                  '&:hover': { bgcolor: '#00A3FF', boxShadow: '0 8px 24px rgba(0, 163, 255, 0.25)' } 
                }}
              >
                CREATE ACCOUNT
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link 
                    component="button" type="button"
                    onClick={() => navigate('/login')}
                    sx={{ fontWeight: '900', color: '#00A3FF', textDecoration: 'none' }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SignupPage;