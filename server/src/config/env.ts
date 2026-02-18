// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  
  // ✅ ADD THESE TO FIX THE TS ERRORS:
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // ✅ CLOUDINARY KEYS (Ensuring these match your .env) [cite: 2026-02-17]
  CLOUDINARY_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'bookstore',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
} as const;