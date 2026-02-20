import { Role } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    user: {
      id: number;
      role: Role;
      status: string;
      email: string; // ✅ Fixed line 30
      name: string;  // ✅ Fixed line 31
    };
    validated?: any;
  }
}