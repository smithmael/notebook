import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book'; 
import PeopleIcon from '@mui/icons-material/People'; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile'; 

// Define menus
const adminNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Books', icon: <BookIcon />, path: '/admin/books' },
  { text: 'Owners', icon: <PeopleIcon />, path: '/admin/owners' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/admin/notifications' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

const ownerNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
  { text: 'Book Upload', icon: <UploadFileIcon />, path: '/owner/upload' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/owner/notifications' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/owner/settings' },
];

const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth(); // GET LOGOUT FUNCTION

  // Determine items based on role (normalize to lowercase comparison)
  const role = userRole?.toLowerCase() || '';
  const navItems = role === 'admin' ? adminNavItems : ownerNavItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1C2536',
          color: 'white',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
         <BookIcon sx={{ color: '#3B82F6', fontSize: '2rem' }} /> 
         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Book Rent</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {navItems.map(({ text, icon, path }) => (
            <ListItem key={path} disablePadding sx={{ my: 1 }}>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
                sx={{
                  margin: '0 12px',
                  borderRadius: '8px',
                  '&.Mui-selected': { backgroundColor: '#007BFF' },
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={logout} // Call logout context
          sx={{
            backgroundColor: '#374151',
            color: 'white',
            '&:hover': { backgroundColor: '#4B5563' }
          }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
};
export default Sidebar;