import React, { useState, useEffect } from "react";
import { Box, Grid, Stack, Paper, Divider } from "@mui/material";
import axios from "axios";

// Assume you have these components created
import StatsCard from "../../components/StatsCard";
import PieChartCard from "../../components/PieChartCard";
import BookStatusTable from "../../components/BookStatusTable";
import LineChartCard from "../../components/LineChartCard";

const API_URL = 'http://localhost:5000/api';

export default function OwnerDashboard() {
  const [books, setBooks] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [stats, setStats] = useState({ rented: 0, free: 0 });
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    // 1. Fetch Revenue
    const fetchRevenue = axios.get(`${API_URL}/owner/revenue`, { headers });

     const fetchChartData = axios.get(`${API_URL}/owner/revenue-chart`, { headers });
    // 2. Fetch Books (to calculate stats and show table)
    const fetchBooks = axios.get(`${API_URL}/owner/books`, { headers });

    

    Promise.all([fetchRevenue, fetchBooks, fetchChartData])
      .then(([revRes, booksRes, chartRes]) => {
        setRevenue(revRes.data.revenue);
        
        const bookList = booksRes.data.data;
        setBooks(bookList);
        
         const formattedChartData = (chartRes.data || []).map(d => ({
            ...d,
            current: d.current / 1000,
            previous: d.previous / 1000,
        }));
        setChartData(formattedChartData);
        // Calculate Rented vs Free based on availableCopies
        const rented = bookList.filter(b => b.availableCopies === 0).length;
        const free = bookList.filter(b => b.availableCopies > 0).length;
        setStats({ rented, free });
      })
      .catch(err => console.error("Dashboard Error:", err));
  }, []);

  const donutData = [
    { name: "Rented", value: stats.rented, color: "#FF3B30" },
    { name: "Free", value: stats.free, color: "#007AFF" },
  ];

  // Mock data for Line Chart (since backend doesn't give history yet)
  const lineData = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((m, i) => ({
    label: m, current: 50 + i * 10, previous: 30 + i * 5,
  }));

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, height: "100%", bgcolor: "white" }}>
            <Stack spacing={3}>
              <StatsCard
                title="Total Income"
                amount={`ETB ${revenue.toFixed(2)}`}
                dateTime="Lifetime Earnings"
                delta={0}
              />
              <Divider />
              <PieChartCard title="Book Status" data={donutData} showLegend />
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
         <BookStatusTable
           title="Recent Books"
            rows={books}
            enableActions={true}   
            onRowsChange={setBooks}
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