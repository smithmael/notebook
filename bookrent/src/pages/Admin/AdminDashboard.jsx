import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Paper, Divider } from "@mui/material";
import axios from "axios";

import StatsCard from "../../components/StatsCard";
import PieChartCard from "../../components/PieChartCard";
import BookStatusTable from "../../components/BookStatusTable";
import LineChartCard from "../../components/LineChartCard";

const API_URL = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ owners: 0, books: 0 });
  const [recentBooks, setRecentBooks] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const getChartData = axios.get(`${API_URL}/admin/revenue-chart`, { headers });
    // 1. Fetch Owners
    const getOwners = axios.get(`${API_URL}/admin/owners`, { headers });
    // 2. Fetch Books
    const getBooks = axios.get(`${API_URL}/admin/books`, { headers });

    Promise.all([getOwners, getBooks, getChartData])
      .then(([ownerRes, bookRes, chartRes]) => {
        setCounts({
          owners: ownerRes.data.length,
          books: bookRes.data.total // or bookRes.data.data.length
        });
          const formattedChartData = (chartRes.data || []).map(d => ({
            ...d,
            current: d.current / 1000,
            previous: d.previous / 1000,
        }));
        setChartData(formattedChartData);
      
        // Show first 5 books as "Recent"
        setRecentBooks(bookRes.data.data.slice(0, 5));
      })
      .catch(err => console.error(err));
  }, []);

  const donutData = [
    { name: "Fiction", value: 50, color: "#007AFF" }, // Mock data
    { name: "Business", value: 50, color: "#FF3B30" }, // Mock data
  ];

  const lineData = ["May", "Jun", "Jul", "Aug"].map(m => ({
    label: m, current: Math.random() * 100, previous: Math.random() * 80
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: "white" }}>
            <Stack spacing={3}>
               <StatsCard
                title="Total Owners"
                amount={counts.owners}
                dateTime="Active Users"
              />
              <StatsCard
                title="Total Books"
                amount={counts.books}
                dateTime="System Wide"
              />
              <Divider />
              <PieChartCard title="Books by Category" data={donutData} showLegend />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
        <BookStatusTable
         title="Recent Books"
          rows={recentBooks}
          enableActions={true}    
           onRowsChange={setRecentBooks}
/>
        </Grid>

        <Grid item xs={12}>
           <LineChartCard 
            title="Earning Summary" 
            data={chartData} 
          />
        </Grid>
      </Grid>
    </Box>
  );
}