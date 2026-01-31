import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { ENV } from '../config/env'
import { ConflictError, UnauthorizedError, BadRequestError } from '../utils/error' // Assuming you have BadRequestError

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body

    // 1. Validation
    if (!email || !password || !name) {
      throw new BadRequestError('Please provide email, password, and name')
    }

    // 2. Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new ConflictError('User already exists')
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER'
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    // 5. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      user,
      token
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body

    // 1. Validation
    if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
    }

    // 2. Find user (DO NOT select password here to save bandwidth)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true // We need it for comparison
      }
    })

    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    // 3. Compare password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials')
    }

    // 4. Remove password from response object
    const { password: _, ...userWithoutPassword } = user

    // 5. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    next(error)
  }
}