import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/database'
import { UserRepository } from '../repositories/user.repository'
import { BadRequestError, UnauthorizedError } from '../utils/error'
import { ENV } from '../config/env'

const userRepo = new UserRepository(prisma);

interface RegisterData {
  email: string
  password: string
  name: string
  role?: 'USER' | 'ADMIN' | 'OWNER'
}

export const registerOwner = async (data: RegisterData) => {
  const existing = await userRepo.findByEmail(data.email)
  if (existing) throw new BadRequestError('Email already registered')

  const allUsers = await userRepo.getAll()
  const role = allUsers.length === 0 ? 'OWNER' : 'USER'

  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(data.password, salt)

  const user = await userRepo.create({
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role,
    status: 'active',
    wallet: 0,
  })

  const token = generateToken(user.id, user.role)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  }
}

interface LoginData {
  email: string
  password: string
}

export const login = async (data: LoginData) => {
  const user = await userRepo.findByEmail(data.email)
  if (!user) throw new UnauthorizedError('Invalid credentials')

  const isMatch = await bcrypt.compare(data.password, user.password)
  if (!isMatch) throw new UnauthorizedError('Invalid credentials')

  const token = generateToken(user.id, user.role)
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  }
}

// Helper: Generate JWT
const generateToken = (userId: number, role: 'USER' | 'ADMIN' | 'OWNER') => {
  // Fix: Use process.env directly if ENV.JWT_EXPIRES_IN is missing in types
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn
  } as jwt.SignOptions)
}