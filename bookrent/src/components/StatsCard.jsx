import React from "react";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";

export default function StatsCard({
  title = "This Month Statistics",
  dateTime = "",
  incomeChip = "This Month",
  amount = "ETB 0.00",
  delta = 0, // positive or negative
  compareText = "",
  lastMonthText = "",
}) {
  const up = delta >= 0;
  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {dateTime}
      </Typography>

      <Paper variant="outlined" sx={{ mt: 2, p: 2, borderRadius: 2, borderColor: "divider" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography fontWeight={700}>Income</Typography>
          <Chip size="small" label={incomeChip} />
        </Stack>

        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 1 }}>
          <Typography variant="h5" fontWeight={800}>{amount}</Typography>
          <Typography
            variant="body2"
            sx={{ color: up ? "success.main" : "error.main", fontWeight: 700 }}
          >
            {up ? "▲" : "▼"} {Math.abs(delta).toFixed(1)}%
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.25 }} color="text.secondary">
          <Typography variant="caption">{compareText}</Typography>
          <Typography variant="caption">{lastMonthText}</Typography>
        </Stack>
      </Paper>
    </Paper>
  );
}