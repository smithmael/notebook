import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Paper, Stack, Typography, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function OwnerBooks() {
  const [rows, setRows] = useState([]);
  const OWNER_ID = 1; // Hardcoded for now

  useEffect(() => {
    axios.get(`http://localhost:5000/api/owner/${OWNER_ID}/books`)
      .then(res => setRows(res.data))
      .catch(err => console.error(err));
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "bookName", headerName: "Book Name", flex: 1 },
    { field: "author", headerName: "Author", width: 150 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "price", headerName: "Price", width: 100 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={2}>My Books</Typography>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>
      </Paper>
    </Box>
  );
}