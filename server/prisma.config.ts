// server/prisma.config.ts
import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma', 
  
  // ✅ Top level for some v7 versions
  seed: 'tsx ./prisma/seed.ts', 

  migrations: {
    // ✅ Nested for other v7 versions (the one your terminal wants)
    seed: 'tsx ./prisma/seed.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL,
  },
} as any);