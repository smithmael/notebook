// config/env.ts
import dotenv from 'dotenv';
import path from 'path';

// Load .env from root (since prisma is outside server folder)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '5000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5000',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  // Add other env vars you need
} as const;