import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  CartesianGrid,
} from "recharts";

export default function LineChartCard({
  title = "Earning Summary",
  rangeLabel = "",
  legend = [],
  data = [],
  series = [
    { dataKey: "current", label: "This period", color: "#60a5fa" },
    { dataKey: "previous", label: "Last year", color: "#cbd5e1" },
  ],
  yFormatter = (v) => v,
}) {
  return (
    <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        sx={{ mb: 1 }}
        spacing={1}
      >
        <Typography fontWeight={700}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">{rangeLabel}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {legend.map((l) => (
            <Stack key={l.name} direction="row" alignItems="center" spacing={1}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: l.color, display: "inline-block" }} />
              <Typography variant="caption">{l.name}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>

      <Box sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 100, right: 20, bottom: 0, left: 0 }}>
            <defs>
              {series.map((s, i) => (
                <linearGradient id={`g${i}`} key={s.dataKey} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis tickFormatter={yFormatter} width={60} />
            <RTooltip formatter={(value, name) => [yFormatter(value), name]} />
            {series.map((s, i) => (
              <Area
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                stroke={s.color}
                fill={`url(#g${i})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}