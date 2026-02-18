import React, { useState } from 'react';
import { 
  Box, Button, Modal, TextField, Typography, Stack, IconButton 
} from '@mui/material';
import { Close as CloseIcon, CloudUpload as UploadIcon } from '@mui/icons-material';
import api from '../../api/axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

const AddBookModal = ({ open, handleClose, onRefresh }: any) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{ bookFile: File | null; coverImage: File | null }>({
    bookFile: null,
    coverImage: null
  });

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const target = e.target as any;
  
  if (!files.bookFile) return alert("Please upload the PDF file.");

  setLoading(true);

  const formData = new FormData();
  
  // 1. Append Text Data (Prisma v7 will handle these as numbers in the backend)
  formData.append('title', target.title.value);
  formData.append('author', target.author.value);
  formData.append('category', target.category.value);
  formData.append('rentPrice', target.rentPrice.value);
  formData.append('totalCopies', target.totalCopies.value);
  
  // 2. Append Binary Files (Keys must match the router)
  formData.append('bookFile', files.bookFile); 
  if (files.coverImage) {
    formData.append('coverImage', files.coverImage);
  }

  try {
    // 🚀 POST call without manual Content-Type header
    await api.post('/books', formData);
    
    onRefresh(); 
    handleClose();
    alert("Book uploaded successfully!");
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">Add New Book</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField name="title" label="Book Title" fullWidth required size="small" />
            <TextField name="author" label="Author" fullWidth required size="small" />
            <TextField name="category" label="Category" fullWidth required size="small" />
            
            <Stack direction="row" spacing={2}>
              <TextField name="rentPrice" label="Rent Price" type="number" fullWidth required size="small" />
              <TextField name="totalCopies" label="Total Copies" type="number" fullWidth required size="small" />
            </Stack>

            <Button variant="outlined" component="label" startIcon={<UploadIcon />} fullWidth>
              {files.bookFile ? `PDF: ${files.bookFile.name.substring(0, 15)}...` : "Upload PDF (Required)"}
              <input type="file" hidden accept=".pdf" 
                onChange={(e) => setFiles({...files, bookFile: e.target.files?.[0] || null})} />
            </Button>

            <Button variant="outlined" component="label" color="secondary" startIcon={<UploadIcon />} fullWidth>
              {files.coverImage ? `Cover: ${files.coverImage.name.substring(0, 15)}...` : "Upload Cover Image"}
              <input type="file" hidden accept="image/*" 
                onChange={(e) => setFiles({...files, coverImage: e.target.files?.[0] || null})} />
            </Button>

            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 2 }}>
              {loading ? "Uploading to Cloud..." : "Create Book"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default AddBookModal;