import React from 'react';
import { Box, Typography } from '@mui/material';

const TopBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        p: 2,
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        Owner / <Typography component="span" variant="subtitle2" fontWeight="bold" color="text.primary">Dashboard</Typography>
      </Typography>
    </Box>
  );
};

export default TopBar;