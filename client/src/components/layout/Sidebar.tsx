import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Typography, Button, Divider 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  CloudUpload as UploadIcon, 
  MenuBook as BooksIcon, 
  Group as PeopleIcon, 
  Notifications as NotifyIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon 
} from '@mui/icons-material';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useAuthStore((state) => state.userRole);
  const logout = useAuthStore((state) => state.logout);

  const roleUpper = userRole?.toUpperCase();

  // ✅ PATHS MUST MATCH YOUR App.tsx EXACTLY
  const menuItems = [
    { 
      id: 'dash', 
      text: 'Dashboard', 
      path: roleUpper === 'ADMIN' ? '/admin/dashboard' : '/owner/dashboard', 
      icon: <DashboardIcon />, 
      roles: ['ADMIN', 'OWNER'] 
    },
    { 
      id: 'upload', 
      text: 'Book Upload', 
      path: '/owner/upload', 
      icon: <UploadIcon />, 
      roles: ['OWNER'] 
    },
    { 
      id: 'books', 
      text: 'Books', 
      path: '/admin/books', 
      icon: <BooksIcon />, 
      roles: ['ADMIN'] 
    },
    { 
      id: 'owners', 
      text: 'Owners', 
      path: '/admin/owners', 
      icon: <PeopleIcon />, 
      roles: ['ADMIN'] 
    },
    { 
      id: 'other1', 
      text: 'Other', 
      path: '/other-1', 
      icon: <Box sx={{ width: 14, height: 14, border: '2px solid white', transform: 'rotate(45deg)', opacity: 0.7 }} />, 
      roles: ['ADMIN', 'OWNER'] 
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ width: 240, height: '100vh', bgcolor: '#171B36', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', zIndex: 1200 }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ bgcolor: '#00A3FF', borderRadius: 1, p: 0.5, display: 'flex' }}>
          <BooksIcon sx={{ color: 'white', fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#00A3FF', fontSize: '1.1rem' }}>Book Rent</Typography>
      </Box>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems
          .filter(item => item.roles.includes(roleUpper || ''))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: '8px',
                    bgcolor: isActive ? '#00A3FF' : 'transparent',
                    '&:hover': { bgcolor: isActive ? '#00A3FF' : 'rgba(255,255,255,0.05)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 35 }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ sx: { fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 } }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}

        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)', mx: 1 }} />
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/notifications')}>
            <ListItemIcon sx={{ color: 'white', minWidth: 35 }}><NotifyIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Notification" primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/settings')}>
            <ListItemIcon sx={{ color: 'white', minWidth: 35 }}><SettingsIcon sx={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Setting" primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }} />
          </ListItemButton>
        </ListItem>
      </List>

      <Box sx={{ p: 2, mb: 2 }}>
        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<LogoutIcon />} 
          onClick={handleLogout}
          sx={{ bgcolor: '#333752', color: 'white', borderRadius: '8px', py: 1.2, textTransform: 'none', '&:hover': { bgcolor: '#444868' } }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Sidebar;