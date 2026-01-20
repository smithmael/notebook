// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // from your package-lock
const { PrismaClient } = require('@prisma/client');

const validate = require('./middleware/validate');
const auth = require('./middleware/auth');
const { signupSchema, loginSchema, bookSchema } = require('./utils/validators');
const defineAbilityFor = require('./utils/ability'); // you must create this file

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// ------------------------------------------------------
// AUTH ROUTES
// ------------------------------------------------------

// OWNER SIGNUP
app.post('/api/auth/signup-owner', validate(signupSchema), async (req, res) => {
  try {
    // Zod validated shape: { body: {...}, query, params }
    const { email, password, confirmPassword, location, phone, name } = req.validated.body;

    // (confirmPassword was already checked by Zod refine – if mismatched, Zod 400'd)
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'owner',
        name: name || '',
        location: location || '',
        phone: phone || '',
        status: 'pending', // must be approved by admin
        wallet: 0,
      },
    });

    return res.status(201).json({
      message: 'Owner created, waiting for approval',
      user,
    });
  } catch (err) {
    console.error('Signup-owner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGIN
app.post('/api/auth/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validated.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------------------------------------------
// OWNER BOOK ROUTES (protected by JWT & CASL)
// ------------------------------------------------------

// Upload book (Owner)
app.post('/api/owner/books', auth, validate(bookSchema), async (req, res) => {
  try {
    const currentUser = req.user; // { id, role } from auth.js
    const ability = defineAbilityFor(currentUser);
    if (!ability.can('create', 'Book')) {
      return res.status(403).json({ message: "You can't upload books" });
    }

    const { bookName, author, category, price } = req.validated.body;

    // ensure owner exists
    const owner = await prisma.user.findUnique({ where: { id: currentUser.id } });
    if (!owner) return res.status(404).json({ message: 'Owner not found' });

    // assume schema: title, author, category, totalCopies, availableCopies, rentPrice, status, ownerId
    const book = await prisma.book.create({
      data: {
        title: bookName,
        author: author || '',
        category: category || '',
        totalCopies: 1,
        availableCopies: 1,
        rentPrice: price ?? 0,
        status: 'pending', // must be approved by admin
        ownerId: currentUser.id,
      },
    });

    return res.status(201).json(book);
  } catch (err) {
    console.error('Create book error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Owner: list own books (server-side filtering)
app.get('/api/owner/books', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const ability = defineAbilityFor(currentUser);
    if (!ability.can('read', 'Book')) {
      return res.status(403).json({ message: "You can't view books" });
    }

    const { page = 1, pageSize = 10, search = '' } = req.query;
    const p = Number(page);
    const s = Number(pageSize);

    const where = {
      ownerId: currentUser.id,
      OR: search
        ? [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    };

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (p - 1) * s,
        take: s,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    return res.json({ data, total, page: p, pageSize: s });
  } catch (err) {
    console.error('Owner list books error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Owner: update own book (status / copies)
app.patch('/api/owner/books/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const bookId = Number(req.params.id);

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const ability = defineAbilityFor(currentUser);
    if (!ability.can('update', book)) {
      return res.status(403).json({ message: "You can't update this book" });
    }

    const { totalCopies, availableCopies, status } = req.body;

    const updated = await prisma.book.update({
      where: { id: bookId },
      data: {
        totalCopies: totalCopies ?? book.totalCopies,
        availableCopies: availableCopies ?? book.availableCopies,
        status: status ?? book.status,
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Update book error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Owner: delete own book
app.delete('/api/owner/books/:id', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const bookId = Number(req.params.id);

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const ability = defineAbilityFor(currentUser);
    if (!ability.can('delete', book)) {
      return res.status(403).json({ message: "You can't delete this book" });
    }

    await prisma.book.delete({ where: { id: bookId } });
    return res.json({ message: 'Book deleted' });
  } catch (err) {
    console.error('Delete book error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Owner: revenue summary
app.get('/api/owner/revenue', auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const ability = defineAbilityFor(currentUser);
    if (!ability.can('read', 'OwnerRevenue', { ownerId: currentUser.id })) {
      return res.status(403).json({ message: "You can't see this revenue" });
    }

    const rentals = await prisma.rental.findMany({
      where: { ownerId: currentUser.id },
    });

    const revenue = rentals.reduce((sum, r) => sum + r.price, 0);
    return res.json({ revenue, rentalsCount: rentals.length });
  } catch (err) {
    console.error('Owner revenue error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------------------------------------------
// ADMIN ROUTES (examples)
// ------------------------------------------------------

// Admin: list owners with filters
app.get('/api/admin/owners', auth, async (req, res) => {
  try {
    const ability = defineAbilityFor(req.user);
    if (!ability.can('manage', 'all')) {
      return res.status(403).json({ message: 'Only admins can view owners' });
    }

    const { search = '', status, location } = req.query;
    const where = {
      role: 'owner',
      AND: [
        status ? { status } : {},
        location ? { location: { contains: location, mode: 'insensitive' } } : {},
        search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const owners = await prisma.user.findMany({ where });
    return res.json(owners);
  } catch (err) {
    console.error('Admin owners error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: approve owner
app.post('/api/admin/owners/:id/approve', auth, async (req, res) => {
  try {
    const ability = defineAbilityFor(req.user);
    if (!ability.can('manage', 'all')) {
      return res.status(403).json({ message: 'Only admins can approve owners' });
    }

    const id = Number(req.params.id);
    const updated = await prisma.user.update({
      where: { id },
      data: { status: 'approved' },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Approve owner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: disable owner
app.post('/api/admin/owners/:id/disable', auth, async (req, res) => {
  try {
    const ability = defineAbilityFor(req.user);
    if (!ability.can('manage', 'all')) {
      return res.status(403).json({ message: 'Only admins can disable owners' });
    }

    const id = Number(req.params.id);
    const updatedOwner = await prisma.user.update({
      where: { id },
      data: { status: 'disabled' },
    });

    await prisma.book.updateMany({
      where: { ownerId: id },
      data: { status: 'disabled' },
    });

    return res.json(updatedOwner);
  } catch (err) {
    console.error('Disable owner error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: list books with filters (server-side for MRT)
app.get('/api/admin/books', auth, async (req, res) => {
  try {
    const ability = defineAbilityFor(req.user);
    if (!ability.can('manage', 'all')) {
      return res.status(403).json({ message: 'Only admins can view all books' });
    }

    const {
      page = 1,
      pageSize = 10,
      search = '',
      category,
      author,
      ownerId,
      ownerLocation,
      status,
    } = req.query;

    const p = Number(page);
    const s = Number(pageSize);

    const where = {
      AND: [
        category ? { category } : {},
        author ? { author: { contains: author, mode: 'insensitive' } } : {},
        ownerId ? { ownerId: Number(ownerId) } : {},
        ownerLocation ? { owner: { location: { contains: ownerLocation, mode: 'insensitive' } } } : {},
        status ? { status } : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { owner: { email: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {},
      ],
    };

    const [data, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: { owner: true },
        skip: (p - 1) * s,
        take: s,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    return res.json({ data, total, page: p, pageSize: s });
  } catch (err) {
    console.error('Admin books error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin: approve book
app.post('/api/admin/books/:id/approve', auth, async (req, res) => {
  try {
    const ability = defineAbilityFor(req.user);
    if (!ability.can('manage', 'all')) {
      return res.status(403).json({ message: 'Only admins can approve books' });
    }

    const id = Number(req.params.id);
    const updated = await prisma.book.update({
      where: { id },
      data: { status: 'approved' },
    });

    return res.json(updated);
  } catch (err) {
    console.error('Approve book error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------
app.get('/', (_req, res) => {
  res.send('Book Rent API is running');
});

// ------------------------------------------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));