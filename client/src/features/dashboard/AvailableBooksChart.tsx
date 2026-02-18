import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#00A3FF', '#FFBB28', '#FF8042', '#00C49F'];

const AvailableBooksChart = ({ data }: { data: any[] }) => {
  return (
    <Paper sx={{ p: 3, borderRadius: 4, height: 400 }}> {/* Fixed Height is Key! */}
      <Typography variant="h6" sx={{ mb: 2 }}>Available Books</Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value" // Matches our backend 'value'
              nameKey="name"   // Matches our backend 'name'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default AvailableBooksChart;