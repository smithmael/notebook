import React, { useState } from "react";
import { Box, Paper, Stack, Typography, Select, MenuItem, FormControl } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function LineChartCard({
  title = "Earning Summary",
  data = [], // Expects [{ name: 'May', current: 200, previous: 100 }, ...]
}) {
  const [range, setRange] = useState("Mar 2022 - Oct 2024");

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "white", height: "100%" }}>
      {/* HEADER: Title, Dropdown, Legend */}
      <Stack 
        direction={{ xs: "column", sm: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", sm: "center" }} 
        mb={4}
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            
            {/* Date Range Dropdown */}
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
                <Select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    disableUnderline
                    IconComponent={KeyboardArrowDownIcon}
                    sx={{ 
                        fontSize: 12, 
                        color: "text.secondary", 
                        fontWeight: 500,
                        "& .MuiSelect-select": { py: 0 }
                    }}
                >
                    <MenuItem value="Mar 2022 - Oct 2024">Mar 2022 - Oct 2024</MenuItem>
                    <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                </Select>
            </FormControl>
        </Stack>

        {/* Legend */}
        <Stack direction="row" spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#0066FF" }} />
                <Typography variant="caption" color="text.secondary">Last 6 months</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                <Typography variant="caption" color="text.secondary">Same period last year</Typography>
            </Stack>
        </Stack>
      </Stack>

      {/* CHART AREA */}
      <Box sx={{ height: 280, width: "100%", ml: -2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {/* Blue Gradient for "Current" data */}
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            {/* Vertical Grid Lines only */}
            <CartesianGrid vertical={true} horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9ca3af", fontSize: 12 }} 
                dy={10}
            />
            
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#9ca3af", fontSize: 11 }} 
                // Format Y-axis to show "k Birr"
                tickFormatter={(value) => value === 0 ? "0.0 Birr" : `${value}k Birr`}
                // Adjust domain based on your data scale, or leave auto
                domain={[0, 'auto']} 
            />
            
            <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: 8, border: "none", boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
                itemStyle={{ fontSize: 12, fontWeight: 600 }}
                formatter={(value) => [`${value}k`, '']}
            />

            {/* 1. Grey Dashed Line (Previous Period) */}
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#cbd5e1"
              strokeWidth={2}
              strokeDasharray="5 5" // Makes it dashed
              fill="none" // No fill makes it look like a line
              activeDot={false}
            />

            {/* 2. Blue Gradient Area (Current Period) */}
            <Area
              type="monotone"
              dataKey="current"
              stroke="#0066FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCurrent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}