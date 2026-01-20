import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Typography, Avatar, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function AdminBooks() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/books')
      .then(res => setRows(res.data))
      .catch(err => console.error(err));
  }, []);

  const columns = [
    { field: "id", headerName: "No.", width: 60 },
    { field: "bookName", headerName: "Book Name", flex: 1 },
    { 
      field: "owner", 
      headerName: "Owner", 
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
           {/* If owner exists, show name, else 'Unknown' */}
           <Avatar sx={{ width: 24, height: 24 }}>{params.value?.name?.[0]}</Avatar>
           <Typography variant="body2">{params.value?.name || "Unknown"}</Typography>
        </Stack>
      )
    },
    { field: "status", headerName: "Status", width: 120 },
    { field: "price", headerName: "Price", width: 100 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>All Books (Admin View)</Typography>
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} />
        </div>
      </Paper>
    </Box>
  );
}