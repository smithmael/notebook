import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid'; // Use standard Grid import
import AvailableBooksChart from '../../features/dashboard/AvailableBooksChart';
import EarningSummary from '../../features/dashboard/EarningSummary';
import LiveBookStatus from '../../features/dashboard/LiveBookStatus';
import { fetchOwnerDashboardData, DashboardData } from '../../services/dashboardService';

const OwnerDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    fetchOwnerDashboardData()
      .then((res: DashboardData) => { // ✅ Fixes 'res' any type
        setData(res);
        setLoading(false);
      })
      .catch((err: any) => { // ✅ Fixes 'err' any type
        console.error("Owner Fetch Error:", err);
        setError("Failed to load your dashboard data.");
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
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Owner / Dashboard</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* ✅ FIXED: Removed 'item' prop. Use size={{ xs, lg }} for MUI v6/v5 modern */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography color="textSecondary" variant="body2">Your Earnings (This Month)</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                ETB {data?.income?.toLocaleString() || 0}
              </Typography>
            </Paper>
            <AvailableBooksChart data={data?.pieChart || []} />
          </Box>
        </Grid>

        {/* ✅ FIXED: Removed 'item' prop. */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <LiveBookStatus 
              books={data?.liveBooks || []} 
              role="OWNER" 
              onRefresh={loadData} 
            />
            <EarningSummary data={data?.earningsSummary || []} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerDashboard;