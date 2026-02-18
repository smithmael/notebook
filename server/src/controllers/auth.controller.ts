import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'; 
import { ENV } from '../config/env'
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/error'

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 🛡️ Handle validation results safely
    const data = req.body;
    const { email, password, name, role } = data;

    // 1. Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ConflictError('User already exists');

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userStatus = role === 'OWNER' ? 'pending' : 'active';

    // 3. Create user AND Starter Data in a Transaction
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || 'USER',
          status: userStatus,
          wallet: 0
        }
      });

      // ✅ AUTO-SEED: Fixed to include required fields for your schema
      if (role === 'OWNER') {
        await tx.book.createMany({
          data: [
            { 
              title: 'The Great Gatsby', 
              author: 'F. Scott Fitzgerald', 
              category: 'Fiction',
              rentPrice: 150, 
              ownerId: newUser.id, 
              totalCopies: 10, 
              availableCopies: 10,
              // ⚠️ REAL FIX: You must provide these if they are required in schema.prisma
              coverImage: 'https://res.cloudinary.com/bookstore/image/upload/v1/default_cover.jpg',
              bookFile: 'https://res.cloudinary.com/bookstore/raw/upload/v1/default_pdf.pdf'
            }
          ]
        });
      }

      return newUser;
    });

    // 4. Generate Token
    const token = jwt.sign(
      { id: result.id, role: result.role },
      ENV.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { password: _, ...userResponse } = result;

    res.status(201).json({
      status: 'success', // Keep format consistent with frontend services
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error("SIGNUP_CONTROLLER_ERROR:", error); // Logs real Prisma errors to terminal
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};