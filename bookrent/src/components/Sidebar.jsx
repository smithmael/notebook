import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

// Import all the icons you need
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookIcon from '@mui/icons-material/Book'; // For Admin "Books"
import GroupIcon from '@mui/icons-material/Group'; // For Admin "Owners"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'; // For "Other"
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // For Owner "Book Upload"
import LoginIcon from '@mui/icons-material/Login'; // For "Login as Book Owner"

// Define navigation items for each role
const adminNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Books', icon: <BookIcon />, path: '/admin/books' },
  { text: 'Owners', icon: <GroupIcon />, path: '/admin/owners' },
  { text: 'Other', icon: <HelpOutlineIcon />, path: '/admin/other1' },
  { text: 'Other', icon: <HelpOutlineIcon />, path: '/admin/other2' },
];

const ownerNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/owner/dashboard' },
  { text: 'Book Upload', icon: <UploadFileIcon />, path: '/owner/upload' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/owner/notifications' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/owner/settings' },
  { text: 'Login as Admin', icon: <LoginIcon />, path: '/login' }, // Path to a login page
];

// Reusable settings/notification items if they are common
const commonBottomItems = [
    { text: 'Notification', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Setting', icon: <SettingsIcon />, path: '/settings' },
];


const Sidebar = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Select the navigation items based on the userRole prop
  const navItems = userRole === 'Admin' ? adminNavItems : ownerNavItems;
  const loginItemText = userRole === 'Admin' ? 'Login as Book Owner' : 'Login as Admin';
  const loginItemPath = userRole === 'Admin' ? '/owner-login' : '/admin-login'; // Example paths


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1C2536', // Dark blue from your screenshot
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
         <BookIcon sx={{ color: '#3B82F6', fontSize: '2rem' }} /> {/* Example logo */}
         <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
           Book Rent
         </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {navItems.map(({ text, icon, path }) => (
            <ListItem key={`${text}-${path}`} disablePadding sx={{ my: 1 }}>
              <ListItemButton
                selected={location.pathname === path}
                onClick={() => navigate(path)}
                sx={{
                  margin: '0 12px',
                  borderRadius: '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#007BFF', // Active blue color from your screenshot
                    '&:hover': {
                      backgroundColor: '#006AEF',
                    },
                  },
                   '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom section for settings and logout */}
      <Box>
         <List>
            {/* You can map common items here if needed */}
            <ListItem key="Login As" disablePadding>
                <ListItemButton onClick={() => navigate(loginItemPath)} sx={{ color: '#9CA3AF' }}>
                    <ListItemIcon sx={{ color: '#9CA3AF', minWidth: '40px' }}><LoginIcon /></ListItemIcon>
                    <ListItemText primary={loginItemText} />
                </ListItemButton>
            </ListItem>
            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LogoutIcon />}
                    onClick={() => { /* Handle logout logic */ navigate('/login'); }}
                    sx={{
                        backgroundColor: '#374151',
                        color: 'white',
                        textTransform: 'none',
                        '&:hover': {
                           backgroundColor: '#4B5563',
                        }
                    }}
                >
                    Logout
                </Button>
            </Box>
         </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;