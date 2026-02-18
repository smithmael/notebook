// server/prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ✅ Fix path resolution for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default defineConfig({
  // ✅ FIX: Go up one level to find the prisma folder
  schema: '../prisma/schema.prisma', 
  
  // This is where your seed is defined for 'prisma db seed'
  seed: 'tsx ./prisma/seed.ts', 
  
  datasource: {
    url: process.env.DATABASE_URL,
  },
} as any);