// src/components/AuthLayout.js
import React from 'react';
import { Grid, Paper } from '@mui/material';
import StyledBookLogo from '../assets/StyledBookLogo';

const AuthLayout = ({ children }) => {
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      {/* Left Panel */}
      <Grid
        item
        xs={false}
        sm={4}
        md={5}
        sx={{
          backgroundColor: '#19224d',
          display: { xs: 'none', sm: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledBookLogo sx={{ fontSize: 180, color: '#ffffff' }} />
      </Grid>
      
      {/* Right Panel (Form) */}
      <Grid
        item
        xs={12}
        sm={8}
        md={7}
        component={Paper}
        elevation={0}
        square
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default AuthLayout;