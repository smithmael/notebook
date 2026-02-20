import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Typography, Card, CardMedia, CardContent, 
  Button, Container, Skeleton, Backdrop, Stack, Paper 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import api from '../../api/axios';

const Bookshelf = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await api.get('/books');
        const incomingData = res.data?.data;
        if (Array.isArray(incomingData)) setBooks(incomingData);
      } catch (err) {
        console.error("Library failed to load:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleRent = async (bookId: number) => {
    try {
      setIsInitializingPayment(true);
      const res = await api.post('/payments/initialize', { bookId });
      
      if (res.data?.checkout_url) {
        // Redirecting to Chapa
        window.location.href = res.data.checkout_url;
      }
    } catch (err) {
      alert("Failed to initialize payment. Please try again.");
      setIsInitializingPayment(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      
      {/* 🚀 PAYMENT INITIALIZATION SKELETON OVERLAY */}
      <Backdrop
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          bgcolor: 'rgba(248, 249, 250, 0.98)', 
          flexDirection: 'column',
          backdropFilter: 'blur(8px)'
        }}
        open={isInitializingPayment}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="900" sx={{ mb: 1, color: '#171B36' }}>
              Securing your rental...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to Chapa Secure Gateway
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #E0E0E0' }}>
                <Skeleton variant="text" width="60%" height={30} sx={{ mb: 3 }} />
                <Stack spacing={2}>
                  <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 2 }} />
                </Stack>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#171B36' }}>
                <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Skeleton variant="text" width="30%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    <Skeleton variant="text" width="20%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  </Box>
                  <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  <Skeleton variant="rectangular" height={50} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.2)', mt: 2 }} />
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Backdrop>

      {/* --- Main Bookshelf UI --- */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" color="#171B36">The Library</Typography>
        <Typography color="text.secondary">Select a title to rent via Chapa.</Typography>
      </Box>

      <Grid container spacing={4}>
        {loading ? [...Array(8)].map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 6 }} />
          </Grid>
        )) : (
          books.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
              <Card sx={{ 
                borderRadius: 6, transition: '0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 12px 30px rgba(0,163,255,0.15)' } 
              }}>
                <CardMedia 
                  component="img" 
                  height="280" 
                  image={book.coverImage || 'https://via.placeholder.com/280x400?text=No+Cover'} 
                  sx={{ objectFit: 'cover' }} 
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="800" noWrap>{book.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{book.author}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="900" color="#171B36">
                      {book.rentPrice} <small style={{ fontSize: '12px' }}>ETB</small>
                    </Typography>
                    
                    <Button 
                      variant="contained" 
                      startIcon={<ShoppingCartIcon />} 
                      sx={{ 
                        bgcolor: '#171B36', 
                        borderRadius: 3, 
                        px: 3, 
                        fontWeight: 800,
                        '&:hover': { bgcolor: '#00A3FF' } 
                      }}
                      onClick={() => handleRent(book.id)}
                    >
                      Rent
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

const Divider = ({ sx }: { sx?: any }) => <Box sx={{ height: '1px', width: '100%', my: 1, ...sx }} />;

export default Bookshelf;