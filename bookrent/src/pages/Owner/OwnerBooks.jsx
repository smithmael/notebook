import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ActionButtons from "../../components/ActionButtons"; // adjust path if needed

const API_URL = "http://localhost:5000/api";

export default function OwnerBooks() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch owner's books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_URL}/owner/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend returns: { data, total, page, pageSize }
        setRows(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // --- Action handlers ---

  const handleView = (row) => {
    alert(`Book Details:\n\n${JSON.stringify(row, null, 2)}`);
  };

  const handleEdit = async (row) => {
    // Simple prompt-based edit for copies
    const newTotal = window.prompt(
      "Enter total copies:",
      String(row.totalCopies ?? 1)
    );
    if (newTotal === null) return; // cancel

    const newAvailable = window.prompt(
      "Enter available copies:",
      String(row.availableCopies ?? 1)
    );
    if (newAvailable === null) return; // cancel

    const token = localStorage.getItem("token");

    try {
      const res = await axios.patch(
        `${API_URL}/owner/books/${row.id}`,
        {
          totalCopies: Number(newTotal),
          availableCopies: Number(newAvailable),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = res.data;

      setRows((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update book.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${API_URL}/owner/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRows((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete book.");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Book Name", flex: 1 },
    { field: "author", headerName: "Author", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (p) => (
        <Chip
          label={p.value}
          size="small"
          color={p.value === "approved" ? "success" : "warning"}
        />
      ),
    },
    { field: "rentPrice", headerName: "Price", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtons
          row={params.row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          My Books
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
        />
      </Paper>
    </Box>
  );
}