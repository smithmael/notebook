import React, { useState } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, TextField, Typography,
  Menu, MenuItem, Grid, Card, CardContent, Button 
} from '@mui/material'; 
import { 
  Search as SearchIcon, FilterList as FilterIcon, 
  ViewHeadline as ViewIcon, ViewModule as GridViewIcon, 
  Delete as DeleteIcon, FiberManualRecord as DotIcon,
  AutoStories as ReadIcon 
} from '@mui/icons-material';
import api from '../../api/axios';

const LiveBookStatus = ({ books, role, onRefresh }: { books: any[], role: 'ADMIN' | 'OWNER', onRefresh: () => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Rented' | 'Free'>('ALL');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getBookUrl = (book: any) => {
  if (!book?.bookFile) return "#";
  
  const originalUrl = book.bookFile.startsWith('http') 
    ? book.bookFile 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${book.bookFile}`;

  // ✅ Route it through your own server
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  return `${apiBase}/books/view?url=${encodeURIComponent(originalUrl)}`;
};
  /**
   * ✅ THE "CLEAN" REDIRECT
   * This bypasses all your browser's "sticky" 401 memory.
   */
  const handleRead = (url: string) => {
    if (!url || url === "#") return;
    
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    // 'noreferrer' is the magic word that stops your 401 error
    link.rel = 'noreferrer noopener'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayBooks = (books || []).filter(b => {
    const bookStatus = b.availableCopies < b.totalCopies ? 'Rented' : 'Free';
    const matchesSearch = (b.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || bookStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await api.delete(`/books/${id}`);
        onRefresh(); 
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Live Book Status</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField 
            size="small" placeholder="Search..." 
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} /> }}
          />
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><FilterIcon /></IconButton>
          <IconButton onClick={() => setViewMode(viewMode === 'TABLE' ? 'GRID' : 'TABLE')}>
            {viewMode === 'TABLE' ? <GridViewIcon /> : <ViewIcon />}
          </IconButton>
        </Box>
      </Box>

      {viewMode === 'TABLE' ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F9FAFB' }}>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Book Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayBooks?.map((book, i) => (
                <TableRow key={book?.id || i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{book?.title || "Unknown"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: (book?.availableCopies || 0) < (book?.totalCopies || 0) ? '#FF4842' : '#00A3FF' }}>
                      <DotIcon sx={{ fontSize: 10 }} /> 
                      {(book?.availableCopies || 0) < (book?.totalCopies || 0) ? 'Rented' : 'Free'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleRead(getBookUrl(book))}
                      disabled={!book?.bookFile}
                    >
                      <ReadIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(book?.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {displayBooks?.map((book) => (
            <Grid key={book?.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography fontWeight="bold" noWrap>{book?.title || "Unknown"}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      startIcon={<ReadIcon />} 
                      onClick={() => handleRead(getBookUrl(book))}
                      disabled={!book?.bookFile}
                    >
                      Read
                    </Button>
                    <IconButton color="error" size="small" onClick={() => handleDelete(book?.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
         <MenuItem onClick={() => { setStatusFilter('ALL'); setAnchorEl(null); }}>All</MenuItem>
         <MenuItem onClick={() => { setStatusFilter('Free'); setAnchorEl(null); }}>Available</MenuItem>
         <MenuItem onClick={() => { setStatusFilter('Rented'); setAnchorEl(null); }}>Rented</MenuItem>
      </Menu>
    </Paper>
  );
};

export default LiveBookStatus;