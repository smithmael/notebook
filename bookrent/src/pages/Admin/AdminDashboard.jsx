import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Paper, Divider } from "@mui/material";
import axios from "axios";

import StatsCard from "../../components/StatsCard";
import PieChartCard from "../../components/PieChartCard";
import BookStatusTable from "../../components/BookStatusTable";
import LineChartCard from "../../components/LineChartCard";

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalIncome: 0,
    totalOwners: 0,
    totalBooks: 0,
    recentBooks: []
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  // Mock chart data (since we aren't calculating history in backend yet)
  const donutData = [
    { name: "Fiction", value: 54, color: "#007AFF" },
    { name: "Business", value: 26, color: "#FF3B30" },
  ];
  const lineData = ["May", "Jun", "Jul", "Aug"].map(m => ({
    label: m, current: Math.random() * 100, previous: Math.random() * 80
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* LEFT COLUMN: System Stats */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: "white" }}>
            <Stack spacing={3}>
              <StatsCard
                title="Total Income"
                amount={`ETB ${data.totalIncome.toFixed(2)}`}
                dateTime="System Wide"
                incomeChip="All Time"
              />
               <StatsCard
                title="Total Owners"
                amount={data.totalOwners}
                dateTime="Active Users"
                incomeChip="Users"
              />
              <Divider />
              <PieChartCard title="Books by Category" data={donutData} showLegend />
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Recent Rentals Table */}
        <Grid item xs={12} md={8}>
          <BookStatusTable 
            title="Recent Rentals" 
            rows={data.recentBooks} 
            enableActions={false} // Admin just views here
          />
        </Grid>

        {/* BOTTOM: Growth Chart */}
        <Grid item xs={12}>
           <LineChartCard title="Revenue Growth" data={lineData} />
        </Grid>
      </Grid>
    </Box>
  );
}