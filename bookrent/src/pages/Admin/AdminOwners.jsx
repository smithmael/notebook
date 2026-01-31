import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Button, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const API_URL = "http://localhost:5000/api";

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/admin/owners`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOwners(res.data);
    } catch (err) {
      console.error("Fetch owners error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === "approved" ? "disable" : "approve";
    if (
      !window.confirm(`Are you sure you want to ${action} this owner?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/admin/owners/${id}/${action}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh list
      fetchOwners();
    } catch (err) {
      console.error("Toggle owner status error:", err);
      alert("Action failed");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "approved" ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          color={params.row.status === "approved" ? "error" : "success"}
          size="small"
          startIcon={
            params.row.status === "approved" ? (
              <BlockIcon />
            ) : (
              <CheckCircleIcon />
            )
          }
          onClick={() =>
            handleToggleStatus(params.row.id, params.row.status)
          }
        >
          {params.row.status === "approved" ? "Disable" : "Approve"}
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Owner Management
        </Typography>
        <DataGrid
          rows={owners}
          columns={columns}
          loading={loading}
          autoHeight
          pageSizeOptions={[10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Paper>
    </Box>
  );
}