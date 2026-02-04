import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'
import { UnauthorizedError, ForbiddenError } from '../utils/error'
import prisma from '../config/database'
import type { User } from '@prisma/client'
import { Role } from '@prisma/client'



declare module 'express' {
  interface Request {
    user?: {
      id: number;
      role: Role;
    };
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) 
    throw new UnauthorizedError('Authentication required')

  const token = authHeader.split(' ')[1]!
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as {
      id: number
      role: Role
    }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true }
    })
    
    if (!user) throw new UnauthorizedError('User no longer exists')

    req.user = { 
      id: user.id, 
      role: user.role 
    }
    next()
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError || err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Invalid or expired token')
    }
    throw new UnauthorizedError('Authentication failed')
  }
}

export const authorize = (...allowedRoles: Role[]): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) throw new UnauthorizedError('User not authenticated')
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Access denied. Required one of: ${allowedRoles.join(', ')}`
      )
    }
    next()
  }
}

export const isOwner = authorize('OWNER')
export const isAdmin = authorize('ADMIN')
export const isAdminOrOwner = authorize('ADMIN', 'OWNER')