import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box, Typography, Paper, Grid, TextField, Button,
  Select, MenuItem, FormControl, InputLabel, Alert, CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Updated Schema to match Backend Validator
const bookFormSchema = z.object({
  bookName: z.string().min(1, { message: 'Book Name is required.' }),
  author: z.string().optional(),
  category: z.string().optional(),
  // Backend expects a number for price
  price: z.coerce.number().min(0, "Price must be positive"),
  // Note: Backend currently ignores quantity/images, so we keep it simple for now
});

const BookUploadPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(bookFormSchema)
  });

  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  
  const onSubmit = async (data) => {
    setApiError('');
    setApiSuccess('');
    
    // Construct JSON Payload (Not FormData)
    const payload = {
      bookName: data.bookName,
      author: data.author,
      category: data.category || "General", // Default if empty
      price: Number(data.price),
    };
    
    try {
      // Token is handled globally by AuthContext now
      await axios.post(`${API_URL}/owner/books`, payload);

      setApiSuccess(`Book "${data.bookName}" uploaded successfully!`);
      reset();
    } catch (err) {
      console.error("Upload Error:", err.response);
      const errorMessage = err.response?.data?.message || 'Upload failed. Please try again.';
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
            
            {/* BOOK NAME */}
            <Grid item xs={12}>
              <TextField 
                label="Book Name" 
                fullWidth 
                required 
                {...register("bookName")} 
                error={!!errors.bookName} 
                helperText={errors.bookName?.message} 
              />
            </Grid>

             {/* AUTHOR */}
             <Grid item xs={12}>
              <TextField 
                label="Author" 
                fullWidth 
                {...register("author")} 
                error={!!errors.author} 
                helperText={errors.author?.message} 
              />
            </Grid>

            {/* CATEGORY (Added this field) */}
            <Grid item xs={12} sm={6}>
              <TextField 
                label="Category" 
                fullWidth 
                placeholder="e.g. Fiction, Business"
                {...register("category")} 
                error={!!errors.category} 
                helperText={errors.category?.message} 
              />
            </Grid>

             {/* PRICE */}
             <Grid item xs={12} sm={6}>
              <TextField 
                label="Rent Price" 
                fullWidth 
                type="number" 
                {...register("price")} 
                error={!!errors.price} 
                helperText={errors.price?.message} 
              />
            </Grid>

          </Grid>
          
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting} sx={{ py: 1.5, px: 6 }}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Book'}
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default BookUploadPage;