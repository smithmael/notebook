// =================================================================
//                      IMPORTS AND CONFIG
// =================================================================

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// --- Local Module Imports ---
const db = require('./db');
const authMiddleware = require('./middleware/auth');
const validate = require('./middleware/validate');
const { signupSchema, loginSchema, bookSchema } = require('./utils/validators');

// =================================================================
//                      EXPRESS APP SETUP
// =================================================================

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =================================================================
//                      MULTER FILE UPLOAD SETUP
// =================================================================

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});


// =================================================================
//                    CUSTOM MIDDLEWARES
// =================================================================

const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

// =================================================================
//                            API ROUTES
// =================================================================

// --- 1. AUTHENTICATION ROUTES (Public) ---
app.post('/api/auth/signup', validate(signupSchema), async (req, res) => {
  const { email, password, location, phone, name } = req.body;
  try {
    const userCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ errors: [{ message: 'User with this email already exists.' }] });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const result = await db.query(
      'INSERT INTO users (email, password_hash, role, location, phone_number, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, role',
      [email, passwordHash, 'owner', location, phone, name]
    );
    res.status(201).json({ message: 'User created successfully! Awaiting admin approval.', user: result.rows[0] });
  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).json({ errors: [{ message: 'Server error during user registration.' }] });
  }
});

app.post('/api/auth/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ errors: [{ message: 'Invalid credentials.' }] });
    }
    const user = userResult.rows[0];
    if (user.role === 'owner' && user.status !== 'approved') {
        return res.status(403).json({ errors: [{ message: `Your account is currently ${user.status}. Please wait for admin approval.`}] });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ errors: [{ message: 'Invalid credentials.' }] });
    }
    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ errors: [{ message: 'Server error during login.' }] });
  }
});


// --- 2. OWNER MANAGEMENT ROUTES (Admin Only) ---
app.get('/api/owners', [authMiddleware, adminMiddleware], async (req, res) => {
    const { search, status } = req.query; // Changed from req.body to req.query
    try {
        let ownersQuery = "SELECT id, email, name, location, phone_number, status, created_at FROM users WHERE role = 'owner'";
        const queryParams = [];
        let paramIndex = 1;
        if (search) {
            ownersQuery += ` AND (email ILIKE $${paramIndex} OR name ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }
        if (status && ['pending', 'approved', 'suspended'].includes(status)) {
            ownersQuery += ` AND status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        ownersQuery += " ORDER BY created_at DESC";
        const { rows } = await db.query(ownersQuery, queryParams);
        res.json(rows);
    } catch (err) {
        console.error('Get Owners Error:', err.message);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});

app.patch('/api/owners/:id/approve', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query( "UPDATE users SET status = 'approved' WHERE id = $1 AND role = 'owner' RETURNING id, status", [id] );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Owner not found.' });
        }
        res.json({ message: 'Owner approved successfully', owner: result.rows[0] });
    } catch (err) {
        console.error('Approve Owner Error:', err.message);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});

app.delete('/api/owners/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM users WHERE id = $1 AND role = 'owner'", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Owner not found.' });
        }
        res.json({ message: 'Owner deleted successfully' });
    } catch (err) {
        console.error('Delete Owner Error:', err.message);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});


// --- 3. BOOK MANAGEMENT ROUTES ---
app.post( '/api/books', [authMiddleware, upload.single('coverImage')], async (req, res) => {
    const { title, author, quantity, rentPrice } = req.body;
    const ownerId = req.user.id;
    try {
      const dataToValidate = {
        title, author, 
        quantity: quantity ? parseInt(quantity, 10) : undefined,
        rent_price: rentPrice ? parseFloat(rentPrice) : undefined
      };
      
      const validation = bookSchema.safeParse({ body: dataToValidate });
      if (!validation.success) {
          if (req.file) { fs.unlinkSync(req.file.path); }
          return res.status(400).json({ errors: validation.error.errors });
      }

      if (!req.file) {
        return res.status(400).json({ errors: [{ message: 'Book cover image is required.' }] });
      }

      const coverImageUrl = `/uploads/${req.file.filename}`;

      const result = await db.query(
        'INSERT INTO books (title, author, quantity, rent_price, cover_image_url, owner_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, author, dataToValidate.quantity, dataToValidate.rent_price, coverImageUrl, ownerId]
      );
      
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Book Upload Error:', err.message);
      res.status(500).json({ errors: [{ message: 'Server error while creating book.' }] });
    }
  }
);
// in book-rent-api/server.js
// ...
app.post(
  '/api/books', // The path MUST be this
  [authMiddleware, upload.single('coverImage')], // 'coverImage' MUST match FormData
  async (req, res) => {
    // ... your logic
  }
);
// ...

// =================================================================
//                      SIMPLE UPLOAD TEST ROUTE
// =================================================================
app.post('/api/upload-test', [authMiddleware, upload.single('coverImage')], (req, res) => {
  console.log('--- UPLOAD TEST ROUTE HIT ---');
  console.log('Request Body:', req.body); // Should show text fields
  console.log('Request File:', req.file); // Should show file info

  if (!req.file) {
    console.error('ERROR: No file was received by the server.');
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // If we get here, the file was received and saved by multer.
  console.log(`SUCCESS: File "${req.file.originalname}" uploaded successfully.`);
  res.status(200).json({ 
    message: 'Test upload successful!',
    filename: req.file.filename,
    path: req.file.path 
  });
});
// For demo: return all books (in-memory array)
app.get('/api/books', async (req, res) => {
  const result = await db.query('SELECT * FROM books');
  res.json(result.rows);
});
// in book-rent-api/server.js

// ... after your GET /api/books-admin route ...

/**
 * @route   PATCH /api/books-admin/:id/status
 * @desc    Admin updates a book's status (e.g., active/inactive)
 * @access  Private (Admin only)
 */
app.patch('/api/books-admin/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expecting { "status": "inactive" } or { "status": "active" }

    if (!status || !['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const result = await db.query(
            "UPDATE books SET status = $1 WHERE id = $2 RETURNING id, status",
            [status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        res.json({ message: 'Book status updated successfully', book: result.rows[0] });
    } catch (err) {
        console.error('Update Book Status Error:', err.message);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});


/**
 * @route   DELETE /api/books-admin/:id
 * @desc    Admin deletes any book
 * @access  Private (Admin only)
 */
app.delete('/api/books-admin/:id', [authMiddleware, adminMiddleware], async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("DELETE FROM books WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Book not found.' });
        }
        res.json({ message: 'Book deleted successfully by admin' });
    } catch (err) {
        console.error('Admin Delete Book Error:', err.message);
        res.status(500).json({ errors: [{ message: 'Server error' }] });
    }
});

// NOTE: A PUT /api/books-admin/:id route for editing all book details would go here as well.
// =================================================================
//                      SERVER STARTUP
// =================================================================

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Node.js API server is running on http://localhost:${PORT}`);
});