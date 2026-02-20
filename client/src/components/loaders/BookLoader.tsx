import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const BookLoader = () => (
  <Box sx={{ 
    height: '60vh', display: 'flex', flexDirection: 'column', 
    alignItems: 'center', justifyContent: 'center' 
  }}>
    <Box sx={{ position: 'relative', width: 60, height: 45, display: 'flex', justifyContent: 'center' }}>
      
      {/* Left Page Outline */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: -160 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '50%', height: '100%', border: '2.5px solid #00A3FF',
          borderRight: 'none', borderRadius: '4px 0 0 4px', 
          originX: '100%', position: 'absolute', left: 0,
          backgroundColor: 'transparent' // ✅ Transparent feel
        }}
      />

      {/* Right Page Outline */}
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 160 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '50%', height: '100%', border: '2.5px solid #00A3FF',
          borderLeft: 'none', borderRadius: '0 4px 4px 0', 
          originX: '0%', position: 'absolute', right: 0,
          backgroundColor: 'transparent' // ✅ Transparent feel
        }}
      />

      {/* Spine */}
      <Box sx={{ width: 2, height: '100%', bgcolor: '#171B36', opacity: 0.3, borderRadius: 2, zIndex: 2 }} />
    </Box>

    <Typography sx={{ 
      mt: 3, color: '#171B36', fontWeight: 700, letterSpacing: 2, 
      fontSize: '0.75rem', opacity: 0.4, textTransform: 'uppercase'
    }}>
      Loading Content
    </Typography>
  </Box>
);

export default BookLoader;