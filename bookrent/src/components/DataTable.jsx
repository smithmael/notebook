import React, { useState } from 'react';
import {
  Box, Typography, IconButton, TextField, Collapse,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, CircularProgress, Drawer, Button, InputAdornment
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import ViewList from '@mui/icons-material/ViewList';
import ViewModule from '@mui/icons-material/ViewModule';
import FilterList from '@mui/icons-material/FilterList';

const DataTable = ({
  title,
  columns,
  data,
  loading,
  searchText,
  onSearchChange,
  filterDrawerContent, // Pass JSX for the filter drawer from the parent page
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', backgroundColor: '#ffffff' }}>
      {/* --- Toolbar --- */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        <Box>
          <IconButton onClick={() => setShowSearch(p => !p)}><Search /></IconButton>
          <IconButton onClick={() => setViewMode(p => (p === 'list' ? 'grid' : 'list'))}>
            {viewMode === 'list' ? <ViewList /> : <ViewModule />}
          </IconButton>
          {filterDrawerContent && <IconButton onClick={() => setIsFilterDrawerOpen(true)}><FilterList /></IconButton>}
        </Box>
      </Box>

      {/* --- Search Bar --- */}
      <Collapse in={showSearch}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><Search /></InputAdornment>),
          }}
        />
      </Collapse>

      {/* --- Table View --- */}
      {viewMode === 'list' ? (
        <TableContainer>
          <Table sx={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field} sx={{ fontWeight: 'bold', color: '#6B7280', border: 'none' }}>
                    {col.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length} align="center"><CircularProgress /></TableCell></TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography color="text.secondary">No data available.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={row.id || index} sx={{ backgroundColor: '#F9FAFB', '& td, & th': { border: 0 } }}>
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={`${row.id}-${col.field}`}
                        sx={{
                          py: 1,
                          borderTopLeftRadius: colIndex === 0 ? '8px' : 0,
                          borderBottomLeftRadius: colIndex === 0 ? '8px' : 0,
                          borderTopRightRadius: colIndex === columns.length - 1 ? '8px' : 0,
                          borderBottomRightRadius: colIndex === columns.length - 1 ? '8px' : 0,
                        }}
                      >
                        {col.renderCell ? col.renderCell({ row }) : row[col.field]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ mt: 2, p: 4, border: '2px dashed #E0E0E0', borderRadius: '8px', textAlign: 'center' }}>
          <Typography color="text.secondary">Grid View would be displayed here.</Typography>
        </Box>
      )}

      {/* --- Filter Drawer --- */}
      {filterDrawerContent && (
        <Drawer anchor="right" open={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)}>
            {/* The parent page (e.g., AdminOwners) provides the content for the drawer */}
            {filterDrawerContent}
        </Drawer>
      )}
    </Paper>
  );
};

export default DataTable;