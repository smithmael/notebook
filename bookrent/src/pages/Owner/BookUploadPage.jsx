// src/pages/Owner/BookUploadPage.jsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Typography, Paper, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Alert, FormHelperText, CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

// THIS MUST BE THE FULL, ABSOLUTE URL
const API_URL = 'http://localhost:5000/api';

const bookFormSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters.' }),
  author: z.string().optional(),
  quantity: z.coerce.number().int().positive(),
  rentPrice: z.coerce.number().positive().optional().or(z.literal('')),
  coverImage: z.instanceof(FileList).refine(files => files?.length === 1, 'Cover image is required.'),
});

const BookUploadPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(bookFormSchema)
  });

  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  
  const coverImageFile = watch("coverImage");
  const coverImageName = coverImageFile?.[0]?.name || '';

  const onSubmit = async (data) => {
    setApiError('');
    setApiSuccess('');
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('author', data.author);
    formData.append('quantity', data.quantity);
    formData.append('rentPrice', data.rentPrice);
    formData.append('coverImage', data.coverImage[0]);
    
    try {
      // The 'x-auth-token' header is added automatically by our AuthContext's axios config
      const response = await axios.post(`${API_URL}/books`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setApiSuccess(`Book "${response.data.title}" uploaded successfully!`);
      reset();
    } catch (err) {
      console.error("Upload Error Details:", err.response); // Log the full error
      const errorMessage = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Upload failed. Please try again.';
      setApiError(errorMessage);
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: '12px 24px', mb: 3, borderRadius: '12px', width: 'fit-content' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Owner/Book Upload</Typography>
      </Paper>

      <Paper component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 4, borderRadius: '12px' }}>
        <Box sx={{ maxWidth: '600px', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>Upload New Book</Typography>

          {apiError && <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>{apiError}</Alert>}
          {apiSuccess && <Alert severity="success" sx={{ mb: 2, textAlign: 'left' }}>{apiSuccess}</Alert>}

          <Grid container spacing={3} sx={{ mb: 3, textAlign: 'left' }}>
            <Grid item xs={12}>
              <TextField label="Book Title" fullWidth required {...register("title")} error={!!errors.title} helperText={errors.title?.message} />
            </Grid>
             <Grid item xs={12}>
              <TextField label="Author" fullWidth {...register("author")} error={!!errors.author} helperText={errors.author?.message} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.quantity}>
                <InputLabel>Quantity *</InputLabel>
                <Select label="Quantity *" defaultValue={1} {...register("quantity")}>
                  {[1, 2, 3, 4, 5].map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                </Select>
                 {errors.quantity && <FormHelperText>{errors.quantity.message}</FormHelperText>}
              </FormControl>
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField label="Rent Price" fullWidth type="number" {...register("rentPrice")} error={!!errors.rentPrice} helperText={errors.rentPrice?.message} />
            </Grid>
          </Grid>
          
          <Box sx={{ mb: 4 }}>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
              Upload Book Cover
              <input type="file" hidden accept="image/png, image/jpeg" {...register("coverImage")} />
            </Button>
            {coverImageName && (
              <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">{coverImageName}</Typography>
              </Box>
            )}
            {errors.coverImage && <Typography variant="caption" display="block" color="error.main" mt={1}>{errors.coverImage.message}</Typography>}
          </Box>
          
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ py: 1.5, px: 6 }}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default BookUploadPage;