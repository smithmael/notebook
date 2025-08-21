import React, { useState, useRef } from 'react';
import {
  Box, TextField, InputAdornment, IconButton, Menu, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Chip, Avatar, Typography, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Toolbar({
  rows,
  columns,
  loading,
  onView,
  onDelete,
  onApprove,
  getRowId,
  getRowApproved,
  filterOptions = [],
  onSearch,
  onFilter,
  viewModes = ['table', 'grid'],
  onViewModeChange,
  viewMode = 'table',
  searchPlaceholder = "Search...",
}) {
  // Local state for search/filter UI
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0] || '');
  const searchInputRef = useRef();

  // Handlers
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    onSearch && onSearch(e.target.value, selectedFilter);
  };

  const handleFilterClick = (e) => setAnchorEl(e.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);
  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setAnchorEl(null);
    onFilter && onFilter(searchText, filter);
  };

  const handleViewMode = (mode) => {
    onViewModeChange && onViewModeChange(mode);
  };

  // Table head style
  const tableHeadCellStyle = { fontWeight: 'bold', color: '#6B7280', borderBottom: '2px solid #E5E7EB' };

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <TextField
          inputRef={searchInputRef}
          variant="outlined"
          size="small"
          placeholder={searchPlaceholder}
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
            sx: { borderRadius: 2 }
          }}
          sx={{ width: 300, background: '#fff' }}
        />
        <IconButton onClick={() => searchInputRef.current && searchInputRef.current.focus()}>
          <SearchIcon />
        </IconButton>
        {viewModes.includes('table') && (
          <IconButton onClick={() => handleViewMode('table')}>
            <ViewListIcon color={viewMode === 'table' ? 'primary' : 'inherit'} />
          </IconButton>
        )}
        {viewModes.includes('grid') && (
          <IconButton onClick={() => handleViewMode('grid')}>
            <ViewModuleIcon color={viewMode === 'grid' ? 'primary' : 'inherit'} />
          </IconButton>
        )}
        {filterOptions.length > 0 && (
          <>
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
              {filterOptions.map(opt => (
                <MenuItem key={opt} onClick={() => handleFilterSelect(opt)}>{opt}</MenuItem>
              ))}
            </Menu>
          </>
        )}
      </Box>

      {/* Table or Grid */}
      {viewMode === 'table' ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.field} sx={col.sx || tableHeadCellStyle}>
                    {col.headerName}
                  </TableCell>
                ))}
                <TableCell align="center" sx={tableHeadCellStyle}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">Loading...</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">No data found.</TableCell>
                </TableRow>
              ) : (
                rows.map((row, idx) => (
                  <TableRow key={getRowId(row, idx)} hover>
                    {columns.map(col => (
                      <TableCell key={col.field}>
                        {col.renderCell
                          ? col.renderCell(row, idx)
                          : row[col.field]}
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      {onView && (
                        <IconButton size="small" onClick={() => onView(row)} sx={{ color: '#555', mx: 0.5 }}>
                          <VisibilityIcon />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton size="small" onClick={() => onDelete(getRowId(row, idx))} sx={{ color: '#F44336', mx: 0.5 }}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                      {onApprove && (
                        <Button
                          variant={getRowApproved && getRowApproved(row) ? "contained" : "outlined"}
                          size="small"
                          onClick={() => onApprove(getRowId(row, idx))}
                          disabled={getRowApproved && getRowApproved(row)}
                          sx={{
                            ml: 1,
                            fontWeight: 700,
                            borderRadius: 2,
                            textTransform: 'uppercase',
                            color: getRowApproved && getRowApproved(row) ? '#fff' : '#0099ff',
                            backgroundColor: getRowApproved && getRowApproved(row) ? '#0099ff' : '#fff',
                            borderColor: '#0099ff',
                            '&:hover': {
                              backgroundColor: getRowApproved && getRowApproved(row) ? '#007acc' : '#e3f2fd',
                              borderColor: '#007acc',
                            },
                            minWidth: 100,
                          }}
                        >
                          {getRowApproved && getRowApproved(row) ? 'APPROVED' : 'APPROVE'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={2}>
          {rows.map((row, idx) => (
            <Grid item xs={12} sm={6} md={4} key={getRowId(row, idx)}>
              <Paper sx={{ p: 2, borderRadius: 2 }}>
                {columns.map(col => (
                  <Box key={col.field} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{col.headerName}:</Typography>
                    {col.renderCell
                      ? col.renderCell(row, idx)
                      : row[col.field]}
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {onView && (
                    <IconButton size="small" onClick={() => onView(row)} sx={{ color: '#555' }}>
                      <VisibilityIcon />
                    </IconButton>
                  )}
                  {onDelete && (
                    <IconButton size="small" onClick={() => onDelete(getRowId(row, idx))} sx={{ color: '#F44336' }}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                  {onApprove && (
                    <Button
                      variant={getRowApproved && getRowApproved(row) ? "contained" : "outlined"}
                      size="small"
                      onClick={() => onApprove(getRowId(row, idx))}
                      disabled={getRowApproved && getRowApproved(row)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        textTransform: 'uppercase',
                        color: getRowApproved && getRowApproved(row) ? '#fff' : '#0099ff',
                        backgroundColor: getRowApproved && getRowApproved(row) ? '#0099ff' : '#fff',
                        borderColor: '#0099ff',
                        '&:hover': {
                          backgroundColor: getRowApproved && getRowApproved(row) ? '#007acc' : '#e3f2fd',
                          borderColor: '#007acc',
                        },
                        minWidth: 100,
                      }}
                    >
                      {getRowApproved && getRowApproved(row) ? 'APPROVED' : 'APPROVE'}
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}