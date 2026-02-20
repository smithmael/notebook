import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, MenuItem, 
  Dialog, DialogContent, DialogActions, Backdrop, Skeleton, Stack, Fade, Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

const BookUpload = () => {
  const [open, setOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false); 
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting }, watch } = useForm();

  // Watch the title to show it in the skeleton
  const bookTitle = watch('title') || "Your New Book";

  const onSubmit = async (data: any) => {
    try {
      if (!coverFile || !bookFile) {
        alert("Please upload both the cover image and the book file.");
        return;
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('author', data.author);
      formData.append('category', data.category);
      formData.append('rentPrice', data.price);
      formData.append('totalCopies', data.quantity);
      formData.append('coverImage', coverFile);
      formData.append('bookFile', bookFile);

      const response = await api.post('/books', formData);
      
      if (response.status === 201 || response.status === 200) {
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setOpen(true);
          reset();
          setCoverFile(null);
          setBookFile(null);
        }, 2000);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      
      {/* 🚀 THEMATIC UPLOAD SKELETON OVERLAY */}
      <Backdrop
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1, 
          bgcolor: uploadSuccess ? 'rgba(76, 175, 80, 0.98)' : 'rgba(248, 249, 250, 0.98)', 
          flexDirection: 'column',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.5s ease'
        }}
        open={isSubmitting || uploadSuccess}
      >
        <Container maxWidth="md">
          {!uploadSuccess ? (
            <Fade in>
              <Box>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Typography variant="h5" fontWeight="900" sx={{ color: '#171B36', mb: 1 }}>
                    Processing "{bookTitle}"
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Optimizing assets and securing your files...
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Skeleton variant="rectangular" height={450} sx={{ borderRadius: 6 }} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }}>
                    <Stack spacing={3}>
                      <Skeleton variant="text" width="80%" height={60} />
                      <Skeleton variant="text" width="40%" height={30} />
                      <Divider />
                      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 4 }} />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                         <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: 3 }} />
                         <Skeleton variant="rectangular" width="50%" height={50} sx={{ borderRadius: 3 }} />
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Fade>
          ) : (
            <Fade in>
              <Box sx={{ textAlign: 'center', color: 'white' }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 120, mb: 2 }} />
                <Typography variant="h3" fontWeight="900">PUBLISHED!</Typography>
                <Typography variant="h6">Your book is now live in the library.</Typography>
              </Box>
            </Fade>
          )}
        </Container>
      </Backdrop>

      {/* --- Main Upload Form --- */}
      <Paper elevation={0} sx={{ p: 6, maxWidth: 700, width: '100%', borderRadius: 4, border: '1px solid #E0E4EC' }}>
        <Typography variant="h4" fontWeight="800" textAlign="center" sx={{ mb: 6 }}>Upload New Book</Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Book Title" {...register('title', { required: true })} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Author" {...register('author', { required: true })} /></Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField select fullWidth label="Category" defaultValue="Fiction" {...register('category')}>
                {['Fiction', 'Self-Help', 'Business', 'Technology'].map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid size={{ xs: 6 }}><TextField fullWidth type="number" label="Quantity" {...register('quantity', { required: true })} /></Grid>
            <Grid size={{ xs: 6 }}><TextField fullWidth type="number" label="Rent Price" {...register('price', { required: true })} /></Grid>

            {/* ✅ FIXED BUTTONS: Removed 'animated', ensured proper 'component="label"' usage */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Button 
                component="label" 
                variant="outlined" 
                startIcon={<CloudUploadIcon />} 
                fullWidth 
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {coverFile ? "Cover Added" : "Upload Cover"}
                <input type="file" hidden accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              </Button>
              {coverFile && <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'primary.main', fontWeight: 600 }}>{coverFile.name}</Typography>}
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Button 
                component="label" 
                variant="outlined" 
                color="secondary" 
                startIcon={<PictureAsPdfIcon />} 
                fullWidth 
                sx={{ py: 1.5, borderRadius: 2 }}
              >
                {bookFile ? "File Added" : "Upload PDF/EPUB"}
                <input type="file" hidden accept=".pdf,.epub" onChange={(e) => setBookFile(e.target.files?.[0] || null)} />
              </Button>
              {bookFile && <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'secondary.main', fontWeight: 600 }}>{bookFile.name}</Typography>}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button 
                type="submit" 
                fullWidth 
                variant="contained" 
                disabled={isSubmitting || uploadSuccess} 
                sx={{ bgcolor: '#171B36', height: 60, fontWeight: 900, borderRadius: 3, mt: 2, '&:hover': { bgcolor: '#00A3FF' } }}
              >
                SUBMIT BOOK
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 80, color: '#4CAF50', mb: 2 }} />
          <Typography variant="h5" fontWeight="800">Book Published!</Typography>
          <Typography color="text.secondary">Your book is now available for rent.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setOpen(false)} variant="contained" sx={{ px: 4, borderRadius: 2 }}>Great</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Simple internal Container since it was missing from original imports
const Container = ({ children, maxWidth }: { children: React.ReactNode, maxWidth: string }) => (
  <Box sx={{ width: '100%', maxWidth: maxWidth === 'md' ? 900 : 1200, mx: 'auto' }}>
    {children}
  </Box>
);

export default BookUpload;