import React from 'react';
import { Box, Paper, Typography, FormControlLabel, Switch, Stack, Button, Divider } from '@mui/material';

export default function AdminSettings() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>System Configuration</Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Stack spacing={3}>
           <FormControlLabel control={<Switch defaultChecked />} label="Allow New User Registrations" />
           <FormControlLabel control={<Switch defaultChecked />} label="Enable Maintenance Mode" />
           <FormControlLabel control={<Switch />} label="Disable All Rentals (Emergency)" />
           
           <Box>
             <Button variant="contained" color="primary">Save Configuration</Button>
           </Box>
        </Stack>
      </Paper>
    </Box>
  );
}