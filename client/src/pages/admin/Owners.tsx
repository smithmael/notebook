import React, { useEffect, useState } from 'react';
import { 
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Switch, IconButton, Button, Avatar, Typography, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../api/axios';

const Owners = () => {
  const [owners, setOwners] = useState<any[]>([]);

  const fetchOwners = async () => {
    try {
      const res = await api.get('/admin/owners');
      setOwners(res.data.data || []);
    } catch (err) {
      console.error("Failed to load owners:", err);
    }
  };

  useEffect(() => { fetchOwners(); }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/admin/owners/${id}/approve`, { status: newStatus });
      fetchOwners(); 
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      try {
        await api.delete(`/admin/owners/${id}`);
        setOwners(prev => prev.filter(o => o.id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <Box 
      sx={{ 
        p: 4, bgcolor: '#F8F9FA', minHeight: '100vh',
        // Smooth entrance for the actual content
        '@keyframes pageEntrance': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        },
        animation: 'pageEntrance 0.4s ease-out forwards'
      }}
    >
      <Typography variant="h5" fontWeight="900" sx={{ mb: 3, color: '#171B36' }}>
        List of Owners
      </Typography>
      
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 4, 
          boxShadow: 'none', 
          border: '1px solid #E0E0E0', 
          overflow: 'hidden' 
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#F1F3F5' }}>
            <TableRow>
              {['No.', 'Owner', 'Upload', 'Location', 'Status', 'Action'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: '800', color: '#171B36' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {owners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                   <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                     No owners found in the system.
                   </Typography>
                </TableCell>
              </TableRow>
            ) : (
              owners.map((owner, index) => (
                <TableRow 
                  key={owner.id} 
                  sx={{ '&:hover': { bgcolor: '#fbfbfb' }, transition: '0.2s' }}
                >
                  <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        src={owner.avatar} 
                        sx={{ width: 36, height: 36, bgcolor: '#171B36', fontSize: '14px', fontWeight: 700 }}
                      >
                        {owner.name?.charAt(0)}
                      </Avatar> 
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#171B36' }}>
                        {owner.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 24, height: 24, bgcolor: '#00A3FF', borderRadius: '6px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <Typography sx={{ color: 'white', fontSize: '12px' }}>📚</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {owner._count?.books || 0} Books
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {owner.location || 'Addis Ababa'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={owner.status === 'active' ? 'Active' : 'Inactive'} 
                        sx={{ 
                          height: 24, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                          bgcolor: owner.status === 'active' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: owner.status === 'active' ? '#2e7d32' : '#757575',
                        }}
                      />
                      <Switch 
                        size="small"
                        checked={owner.status === 'active'} 
                        onChange={() => handleToggleStatus(owner.id, owner.status)}
                        color="success"
                      />
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton size="small" sx={{ bgcolor: '#F1F3F5' }} onClick={() => console.log("View", owner.id)}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)' }} 
                        onClick={() => handleDelete(owner.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      <Button 
                        variant="contained" 
                        size="small" 
                        disabled={owner.status === 'active'}
                        onClick={() => handleToggleStatus(owner.id, owner.status)}
                        sx={{ 
                          ml: 1, borderRadius: 2, textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 800,
                          boxShadow: 'none',
                          bgcolor: owner.status === 'active' ? '#E0E0E0' : '#00A3FF',
                          '&:hover': { bgcolor: '#0086D1', boxShadow: 'none' }
                        }}
                      >
                        {owner.status === 'active' ? 'Approved' : 'Approve'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Owners;