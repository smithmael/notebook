// src/components/BookStatusTable.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Popover,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:5000/api";

export default function BookStatusTable({
  title = "Live Book Status",
  rows = [],
  onRowsChange,
}) {
  const [search, setSearch] = useState("");
  const [anchorSearch, setAnchorSearch] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredRows = useMemo(() => {
    let result = rows;

    if (search) {
      result = result.filter((r) =>
        r.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      result = result.filter((r) => r.status === filterStatus);
    }

    return result;
  }, [rows, search, filterStatus]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this book?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${API_URL}/admin/books/${id}/approve`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onRowsChange?.(
        rows.map((b) => (b.id === res.data.id ? res.data : b))
      );
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this book?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/admin/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onRowsChange?.(rows.filter((b) => b.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const columns = [
    { field: "id", headerName: "No.", width: 80 },
    { field: "title", headerName: "Book Name", flex: 1 },
    { field: "author", headerName: "Author", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = params.value;
        const color =
          status === "approved"
            ? "#4caf50"
            : status === "pending"
            ? "#ff9800"
            : status === "rented"
            ? "#2196f3"
            : "#f44336";
        return (
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: color,
              display: "inline-block",
              mr: 1,
            }}
          />
        );
      },
    },
    {
      field: "rentPrice",
      headerName: "Price",
      width: 100,
      renderCell: (params) => `${Number(params.value || 0).toFixed(2)} Birr`,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        return (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="View">
              <IconButton size="small" onClick={() => alert(JSON.stringify(row, null, 2))}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => handleDelete(row.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* Search */}
          <Tooltip title="Search">
            <IconButton onClick={(e) => setAnchorSearch(e.currentTarget)}>
              <SearchOutlinedIcon />
            </IconButton>
          </Tooltip>

          {/* Filter */}
          <Tooltip title="Filter by status">
            <IconButton onClick={(e) => setAnchorFilter(e.currentTarget)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          pageSizeOptions={[8, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>

      {/* Search Popover */}
      <Popover
        open={Boolean(anchorSearch)}
        anchorEl={anchorSearch}
        onClose={() => setAnchorSearch(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </Box>
      </Popover>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorFilter}
        open={Boolean(anchorFilter)}
        onClose={() => setAnchorFilter(null)}
      >
        <MenuItem onClick={() => { setFilterStatus("all"); setAnchorFilter(null); }}>
          All
        </MenuItem>
        <MenuItem onClick={() => { setFilterStatus("pending"); setAnchorFilter(null); }}>
          Pending
        </MenuItem>
        <MenuItem onClick={() => { setFilterStatus("approved"); setAnchorFilter(null); }}>
          Approved
        </MenuItem>
        <MenuItem onClick={() => { setFilterStatus("rented"); setAnchorFilter(null); }}>
          Rented
        </MenuItem>
      </Menu>
    </Paper>
  );
}