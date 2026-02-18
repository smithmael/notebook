//server/src/utils/validators.ts

import { z } from 'zod';

// --- User Registration ---
export const userSignupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be 8+ characters'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name is required'),
    role: z.enum(['ADMIN', 'OWNER', 'USER']).default('USER'),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }),
});

export type UserSignupInput = z.infer<typeof userSignupSchema>;

// --- User Login ---
export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

// --- Book Creation/Update ---
export const bookSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    category: z.string().min(1, 'Category is required'),
    // ✅ Coerce converts "10" (string) to 10 (number) automatically
    rentPrice: z.coerce.number().min(0, 'Price must be positive'),
    totalCopies: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export type BookInput = z.infer<typeof bookSchema>;

// --- Rental ---
export const rentBookSchema = z.object({
  body: z.object({
    bookId: z.number().int().positive(),
    dueDate: z.string().datetime()
  })
});

export const returnBookSchema = z.object({
  body: z.object({
    rentalId: z.number().int().positive()
  })
});