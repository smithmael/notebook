import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, TextField, Button, Grid, Stack } from "@mui/material";

export default function OwnerSettings() {
  const [formData, setFormData] = useState({});
  const OWNER_ID = 1;

  useEffect(() => {
    // Load current settings
    axios.get(`http://localhost:5000/api/owner/${OWNER_ID}/settings`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save to Database
    axios.put(`http://localhost:5000/api/owner/${OWNER_ID}/settings`, formData)
      .then(res => alert("Settings Saved!"))
      .catch(err => alert("Error saving settings"));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>Owner Settings</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Bank Name" name="bankName" value={formData.bankName || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
             <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}