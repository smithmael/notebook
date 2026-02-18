import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EarningData {
  month: string;
  amount: number;
}

const EarningSummary = ({ data = [] }: { data: EarningData[] }) => {
  if (!data || data.length === 0) {
    return (
      <Paper sx={{ p: 3, borderRadius: 4, height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="textSecondary">No earning data available yet.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 4, height: 300 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Earning Summary</Typography>
        <Typography variant="body2" color="textSecondary">Overview</Typography>
      </Box>
      <Box sx={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9e9e9e', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9e9e9e', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
              // ✅ FIXED: Handle potentially undefined values to satisfy TypeScript
              formatter={(value: number | undefined) => {
                const numValue = value ?? 0;
                return [`$${numValue.toFixed(2)}`, 'Earnings'];
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#00A3FF" 
              strokeWidth={3} 
              dot={{ r: 6, fill: '#00A3FF', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 8 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default EarningSummary;