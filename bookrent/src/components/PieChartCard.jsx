import React from "react";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function PieChartCard({ title = "Available Books", chip = "Today", data = [], showLegend = true }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, borderColor: "divider" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography fontWeight={700}>{title}</Typography>
        <Chip size="small" label={chip} />
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 1 }}>
        <Box sx={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={2}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {showLegend && (
          <Stack spacing={1} sx={{ flex: 1 }}>
            {data.map((d) => (
              <Stack key={d.name} direction="row" alignItems="center" spacing={1.5}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                <Typography variant="body2">{d.name}</Typography>
                <Box sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">{d.value}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}