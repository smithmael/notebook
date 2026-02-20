import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast'; // For those "Payment Success" popups
import App from './App';
import './index.css';

// 1. Create a "Real" Brand Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00A3FF', // Your brand blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#171B36', // Your brand navy
    },
    background: {
      default: '#F8F9FA', // Subtle grey for the app background
    },
  },
  typography: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    h3: { fontWeight: 900 },
    h4: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: {
    borderRadius: 12, // Modern rounded corners for your cards & skeletons
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,163,255,0.2)',
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. ThemeProvider: Ensures Skeletons and Buttons use your colors */}
    <ThemeProvider theme={theme}>
      {/* 3. CssBaseline: Fixes browser margin issues and sets background color */}
      <CssBaseline />
      
      {/* 4. Toaster: Shows floating success/error messages */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#171B36',
            color: '#fff',
          },
        }} 
      />

      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);