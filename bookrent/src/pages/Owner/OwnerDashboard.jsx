import React, { useState, useEffect, useMemo } from "react";
import { Box, Grid, Stack, Paper, Divider } from "@mui/material";
import axios from "axios";

import StatsCard from "../../components/StatsCard";
import PieChartCard from "../../components/PieChartCard";
import BookStatusTable from "../../components/BookStatusTable";
import LineChartCard from "../../components/LineChartCard";

export default function OwnerDashboard() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ income: 0, rented: 0, free: 0 });
  
  // HARDCODED ID for testing. Replace with user.id from AuthContext later.
  const OWNER_ID = 1; 

  useEffect(() => {
    axios.get(`http://localhost:5000/api/owner/${OWNER_ID}/dashboard`)
      .then(res => {
        setRows(res.data.books);
        setStats({
          income: res.data.income,
          rented: res.data.rentedCount,
          free: res.data.freeCount
        });
      })
      .catch(err => console.error("API Error:", err));
  }, []);

  const donutData = [
    { name: "Rented", value: stats.rented, color: "#FF3B30" },
    { name: "Free", value: stats.free, color: "#007AFF" },
  ];

  const lineData = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({
    label: m, current: 50 + i * 10, previous: 30 + i * 5,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: "white" }}>
            <Stack spacing={3}>
              <StatsCard
                title="This Month Statistics"
                amount={`ETB ${stats.income.toFixed(2)}`}
                dateTime="Updated just now"
                delta={+2.5}
              />
              <Divider />
              <PieChartCard title="Book Status" data={donutData} showLegend />
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={8}>
          <BookStatusTable title="Live Book Status" rows={rows} />
        </Grid>

        {/* BOTTOM */}
        <Grid item xs={12}>
           <LineChartCard title="Earning Summary" data={lineData} />
        </Grid>
      </Grid>
    </Box>
  );
}