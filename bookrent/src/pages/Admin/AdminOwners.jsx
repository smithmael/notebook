import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Modal, IconButton,Avatar,Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Toolbar from '../../components/Toolbar';

const API_URL = 'http://localhost:5001/api';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AdminOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search/filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch owners
  const fetchOwners = useCallback(async (search = '', status = 'All') => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (status && status !== 'All') params.status = status.toLowerCase();
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/owners`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setOwners(response.data.map(owner => ({
        ...owner,
        book_count: owner.book_count || 15,
        name: owner.name || owner.email.split('@')[0],
        location: owner.location || 'N/A',
        status: owner.status || 'pending',
      })));
    } catch (error) {
      console.error('Failed to fetch owners:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOwners(searchText, statusFilter);
  }, [fetchOwners, searchText, statusFilter]);

  // Handlers
  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this owner?')) {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/owners/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOwners(searchText, statusFilter);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/owners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOwners(searchText, statusFilter);
    }
  };

  const handleView = (owner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOwner(null);
  };

  // Table columns
  const columns = [
    {
      field: 'no',
      headerName: 'No.',
      renderCell: (row, idx) => String(idx + 1).padStart(2, '0'),
    },
    {
      field: 'owner',
      headerName: 'Owner',
      renderCell: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ width: 32, height: 32, mr: 1.5 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'upload',
      headerName: 'Upload',
      renderCell: (row) => `${row.book_count} Books`,
    },
    {
      field: 'location',
      headerName: 'Location',
      renderCell: (row) => row.location,
    },
    {
      field: 'status',
      headerName: 'Status',
      renderCell: (row) => (
        <Chip
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          color={row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'default'}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin<span style={{ color: '#6B7280', fontWeight: 400 }}>/Owners</span>
      </Typography>
      <Toolbar
        rows={owners}
        columns={columns}
        loading={loading}
        onView={handleView}
        onDelete={handleDelete}
        onApprove={handleApprove}
        getRowId={(row, idx) => row.id}
        getRowApproved={row => row.status === 'approved'}
        filterOptions={['All', 'Pending', 'Approved', 'Suspended']}
        onSearch={setSearchText}
        onFilter={(search, filter) => {
          setSearchText(search);
          setStatusFilter(filter);
        }}
        viewModes={['table', 'grid']}
        onViewModeChange={setViewMode}
        viewMode={viewMode}
        searchPlaceholder="Search by name or email..."
      />
      {/* View Owner Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', top: 8, right: 8 }}><CloseIcon /></IconButton>
          <Typography variant="h6" component="h2" gutterBottom>Owner Details</Typography>
          {selectedOwner && (
            <Box>
              <Typography><strong>ID:</strong> {selectedOwner.id}</Typography>
              <Typography><strong>Name:</strong> {selectedOwner.name}</Typography>
              <Typography><strong>Email:</strong> {selectedOwner.email}</Typography>
              <Typography><strong>Location:</strong> {selectedOwner.location}</Typography>
              <Typography><strong>Status:</strong> {selectedOwner.status}</Typography>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
}