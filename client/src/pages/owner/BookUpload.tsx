// client/src/pages/owner/BookUpload.tsx
import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Paper, MenuItem, 
  Dialog, DialogContent, DialogActions 
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';

const BookUpload = () => {
  const [open, setOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

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
      
      // ✅ Real Files
      formData.append('coverImage', coverFile);
      formData.append('bookFile', bookFile);

      const response = await api.post('/books', formData);
      
      if (response.status === 201 || response.status === 200) {
        setOpen(true);
        reset();
        setCoverFile(null);
        setBookFile(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Upload failed. Check console.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
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

            {/* COVER IMAGE UPLOAD */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth sx={{ py: 1.5 }}>
                {coverFile ? "Cover Added" : "Upload Cover"}
                <input type="file" hidden accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
              </Button>
              {coverFile && <Typography variant="caption">{coverFile.name}</Typography>}
            </Grid>

            {/* ACTUAL BOOK UPLOAD */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
              <Button component="label" variant="outlined" color="secondary" startIcon={<PictureAsPdfIcon />} fullWidth sx={{ py: 1.5 }}>
                {bookFile ? "Book File Added" : "Upload PDF/EPUB"}
                <input type="file" hidden accept=".pdf,.epub" onChange={(e) => setBookFile(e.target.files?.[0] || null)} />
              </Button>
              {bookFile && <Typography variant="caption">{bookFile.name}</Typography>}
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ bgcolor: '#00A3FF', height: 60, fontWeight: 900 }}>
                {isSubmitting ? 'PROCESSING...' : 'SUBMIT BOOK'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ textAlign: 'center', p: 4 }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#4CAF50' }} />
          <Typography variant="h5" fontWeight="700">Book Published!</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setOpen(false)} variant="contained">Great</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookUpload;
