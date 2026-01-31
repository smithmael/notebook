import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const API_URL = "http://localhost:5000/api";

export default function AdminBooks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all books for admin
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/admin/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend: { data, total, page, pageSize }
        setRows(res.data.data || []);
      } catch (err) {
        console.error("Admin books fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this book?")) return;

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${API_URL}/admin/books/${id}/approve`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = res.data;

      setRows((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    } catch (err) {
      console.error("Approve book error:", err);
      alert("Failed to approve book.");
    }
  };

  const columns = [
    { field: "id", headerName: "No.", width: 60 },
    { field: "title", headerName: "Book Name", flex: 1 },
    {
      field: "owner",
      headerName: "Owner",
      width: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 24, height: 24 }}>
            {params.value?.email?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="body2">
            {params.value?.email || "Unknown"}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "approved"
              ? "success"
              : params.value === "disabled"
              ? "default"
              : "warning"
          }
          size="small"
        />
      ),
    },
    { field: "rentPrice", headerName: "Price", width: 100 },
    {
      field: "actions",
      headerName: "Action",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          color="success"
          disabled={params.row.status === "approved"}
          onClick={() => handleApprove(params.row.id)}
        >
          {params.row.status === "approved" ? "Approved" : "Approve"}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          All Books (Admin View)
        </Typography>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        </div>
      </Paper>
    </Box>
  );
}