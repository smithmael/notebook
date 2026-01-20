import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Button, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = () => {
    axios.get('http://localhost:5000/api/admin/owners')
      .then(res => setOwners(res.data))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this owner?")) {
      axios.delete(`http://localhost:5000/api/admin/owners/${id}`)
        .then(() => fetchOwners()) // Refresh list
        .catch(err => alert("Error deleting"));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { 
      field: "_count", 
      headerName: "Total Books", 
      width: 120,
      valueGetter: (params) => params.row._count?.books || 0 
    },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <Button 
          color="error" 
          size="small" 
          startIcon={<DeleteIcon />} 
          onClick={() => handleDelete(params.row.id)}
        >
          Remove
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Owner Management</Typography>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={owners} columns={columns} pageSize={10} />
        </div>
      </Paper>
    </Box>
  );
}