const { z } = require('zod');

// Schema for user signup
const signupSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('Not a valid email address'),
    
    password: z.string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long'),

    // Added: Frontend sends this, so we must allow/validate it
    confirmPassword: z.string({ required_error: 'Confirm Password is required' }),

    location: z.string().optional(), 
    phone: z.string().optional(),
    
    // Changed: Made optional because your signup form might not have a "Name" field yet
    name: z.string().optional(),
  })
  // Added: Logic to check if passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});


// Schema for user login
const loginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' })
      .email('A valid email is required'), // <--- Make sure you type a real email!
    
    password: z.string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
  }),
});


// Schema for book upload
const bookSchema = z.object({
    body: z.object({
        // Updated keys to match database (bookName vs title)
        bookName: z.string({ required_error: 'Book Name is required' }).min(1),
        author: z.string().optional(),
        category: z.string().optional(),
        price: z.number().positive().optional(),
    }),
});


module.exports = {
  signupSchema,
  loginSchema,
  bookSchema,
};