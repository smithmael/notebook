import React from 'react';
import { Box, Grid } from '@mui/material';
import StatsCard from '../../components/StatsCard';
import PieChartCard from '../../components/PieChartCard';
import BookStatusTable from '../../components/BookStatusTable';
import LineChartCard from '../../components/LineChartCard';
 
const OwnerDashboard = () => {
  return (
 
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatsCard />
          <Box mt={2}>
            <PieChartCard />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <BookStatusTable />
          <Box mt={2}>
            <LineChartCard />
          </Box>
        </Grid>
      </Grid>
    </Box>
  
  );
};

export default OwnerDashboard;