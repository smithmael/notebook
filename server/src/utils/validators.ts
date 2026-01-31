import { z } from 'zod';

// --- User Registration ---
export const userRegistrationSchema = z.object({
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

// Fixes Error at Line 17: Type alias extracted from Zod
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;

// --- User Login ---
export const userLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Fixes Error at Line 28
export type UserLoginInput = z.infer<typeof userLoginSchema>;

// --- Book Creation/Update ---
export const bookSchema = z.object({
  body: z.object({
    bookName: z.string().min(1, 'Book name is required'),
    author: z.string().optional(),
    category: z.string().optional(),
    price: z.number().min(0).optional(),
  }),
});

// Fixes Error at Line 41
export type BookInput = z.infer<typeof bookSchema>;