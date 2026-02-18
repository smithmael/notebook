// src/config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env'; 

cloudinary.config({
  cloud_name: ENV.CLOUDINARY_NAME, // Dynamic from .env
  api_key: ENV.CLOUDINARY_API_KEY,
  api_secret: ENV.CLOUDINARY_API_SECRET,
});

export default cloudinary;