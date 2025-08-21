// book-rent-api/utils/validators.js

const { z } = require('zod');

// Schema for user signup
const signupSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('Not a valid email address'),
    
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),

    location: z.string().optional(), // .optional() means it doesn't have to be provided
    phone: z.string().optional(),
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name is too short'),
  
  }),
});


// Schema for user login
const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('A valid email is required'),
    
    password: z.string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'), // A simple check for login
  }),
});


// Schema for book upload
const bookSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),
        author: z.string().optional(),
        quantity: z.number({ required_error: 'Quantity is required' }).int().positive('Quantity must be a positive number'),
        rent_price: z.number().positive('Rent price must be positive').optional(),
    }),
});


module.exports = {
  signupSchema,
  loginSchema,
  bookSchema,
};