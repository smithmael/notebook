import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
// ✅ Import Grid specifically from the Unstable_Grid2 or standard Grid 
// based on your package version. Most modern MUI apps use this:
import Grid from '@mui/material/Grid'; 
import AvailableBooksChart from '../../features/dashboard/AvailableBooksChart';
import EarningSummary from '../../features/dashboard/EarningSummary';
import LiveBookStatus from '../../features/dashboard/LiveBookStatus';
import { fetchAdminDashboardData, DashboardData } from '../../services/dashboardService';

const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    fetchAdminDashboardData()
      .then((res: DashboardData) => {
        setData(res);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Admin Fetch Error:", err);
        setError("Failed to fetch dashboard data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin / Dashboard</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      {/* 🚀 THE FIX STARTS HERE */}
      <Grid container spacing={3}>
        
        {/* ❌ NO 'item' prop. Use 'size' instead. */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography color="textSecondary" variant="body2">Income (This Month)</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                ETB {data?.income?.toLocaleString() || 0}
              </Typography>
            </Paper>
            <AvailableBooksChart data={data?.pieChart || []} />
          </Box>
        </Grid>

        {/* ❌ NO 'item' prop. Use 'size' instead. */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <LiveBookStatus 
              books={data?.liveBooks || []} 
              role="ADMIN" 
              onRefresh={loadData} 
            />
            <EarningSummary data={data?.earningsSummary || []} />
          </Box>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminDashboard;