import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AvailableBooksChart from '../../features/dashboard/AvailableBooksChart';
import EarningSummary from '../../features/dashboard/EarningSummary';
import LiveBookStatus from '../../features/dashboard/LiveBookStatus';
import AddBookModal from '../../features/dashboard/AddBookModal'; // ✅ Import the new Modal
import { fetchDashboardData } from '../../services/dashboardService';

const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Modal State

  const loadData = () => {
    fetchDashboardData()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
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
      {/* HEADER WITH ADD BUTTON */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Admin / Dashboard</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setIsModalOpen(true)}
          sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
        >
          Add New Book
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
              <Typography color="textSecondary" variant="body2">Income (This Month)</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 1 }}>
                ETB {data?.income?.toLocaleString() || 0}
              </Typography>
            </Paper>
            <AvailableBooksChart key={data?.pieChart?.length} data={data?.pieChart || []} />
          </Box>
        </Grid>

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

      {/* ✅ Add the Modal here */}
      <AddBookModal 
        open={isModalOpen} 
        handleClose={() => setIsModalOpen(false)} 
        onRefresh={loadData} 
      />
    </Box>
  );
};

export default AdminDashboard;