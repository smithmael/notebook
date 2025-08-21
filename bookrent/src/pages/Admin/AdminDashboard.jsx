import React, { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import StatsCard from "../../components/StatsCard";
import PieChartCard from "../../components/PieChartCard";
import BookStatusTable from "../../components/BookStatusTable";
import LineChartCard from "../../components/LineChartCard";

// ---- mock + persistence (replace with your API anytime) ----
const LS_KEY = "admin-dashboard-data-v1";

const owners = [
  { id: 1, name: "Nardos T", avatar: "https://i.pravatar.cc/56?img=3" },
  { id: 2, name: "Harry M", avatar: "https://i.pravatar.cc/56?img=12" },
  { id: 3, name: "Tesfu N", avatar: "https://i.pravatar.cc/56?img=33" },
  { id: 4, name: "Lina M", avatar: "https://i.pravatar.cc/56?img=22" },
];

const rng = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function seedBooks(count = 18) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const status = Math.random() > 0.45 ? "Rented" : "Free";
    const price = status === "Rented" ? 40 : 0;
    list.push({
      id: i + 1,
      bookNo: String(rng(1000, 9999)),
      owner: owners[i % owners.length],
      status,
      price,
    });
  }
  return list;
}
function loadRows() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : seedBooks();
  } catch {
    return seedBooks();
  }
}
function saveRows(rows) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows));
  } catch {}
}

const currency = (n) =>
  `ETB ${n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatNow = () =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

// ---- page ----
export default function AdminDashboard() {
  const [rows, setRows] = useState(() => loadRows());
  useEffect(() => saveRows(rows), [rows]);

  // top-left metrics
  const incomeThisMonth = useMemo(
    () => rows.filter((r) => r.status === "Rented").reduce((s, r) => s + r.price, 0),
    [rows]
  );
  const lastMonthIncome = Math.max(0, incomeThisMonth - rng(100, 500));
  const deltaPercent = lastMonthIncome
    ? ((incomeThisMonth - lastMonthIncome) / lastMonthIncome) * 100
    : 0;

  // donut
  const donutData = [
    { name: "Fiction", value: 54, color: "#2563eb" },
    { name: "Self Help", value: 20, color: "#22c55e" },
    { name: "Business", value: 26, color: "#ef4444" },
  ];

  // line chart
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const lineData = months.map((m, i) => ({
    label: m,
    current: 80 + rng(20, 120) + i * 10,
    previous: 70 + rng(0, 80) + i * 8,
  }));

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h6" fontWeight={700}>Admin</Typography>
        <Typography color="text.disabled">/</Typography>
        <Typography variant="h6" color="text.secondary">Dashboard</Typography>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <StatsCard
            title="This Month Statistics"
            dateTime={formatNow()}
            incomeChip="This Month"
            amount={currency(incomeThisMonth)}
            delta={Number(deltaPercent.toFixed(1))}
            compareText={`Compared to ${currency(lastMonthIncome)} last month`}
            lastMonthText={`Last Month Income  ${currency(lastMonthIncome)}`}
          />

          <Box sx={{ mt: 2 }}>
            <PieChartCard
              title="Available Books"
              chip="Today"
              data={donutData}
              showLegend
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <BookStatusTable
            title="Live Book Status"
            rows={rows}
            pageSizeOptions={[8, 10]}
          />
        </Grid>
         <Grid item xs={12} md={7}>
          <BookStatusTable
            title="Live Book Status"
            rows={rows}
            onRowsChange={setRows}   // this makes Edit/Delete persist
            pageSizeOptions={[8, 10]}
            enableActions            // shows the Edit/Delete icons
          />
        </Grid>

        <Grid item xs={12}>
          <LineChartCard
            title="Earning Summary"
            rangeLabel="Mar 2022 - Oct 2024"
            legend={[
              { name: "Last 6 months", color: "#60a5fa" },
              { name: "Same period last year", color: "#cbd5e1" },
            ]}
            data={lineData}
            series={[
              { dataKey: "current", label: "This period", color: "#60a5fa" },
              { dataKey: "previous", label: "Last year", color: "#cbd5e1" },
            ]}
            yFormatter={(v) => `${v}k Birr`}
          />
        </Grid>
      </Grid>
    </Box>
  );
}