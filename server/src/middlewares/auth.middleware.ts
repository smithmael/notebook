//server/src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { ENV } from '../config/env'
import { UnauthorizedError, ForbiddenError } from '../utils/error'
import prisma from '../config/database'
import { Role, User } from '../generated/client/client';



declare module 'express' {
  interface Request {
    user?: {
      id: number;
      role: Role;
    };
  }
}


// server/src/middleware/auth.ts
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
       return next(new UnauthorizedError('Authentication required'));
    }

    const token = authHeader.split(' ')[1]!;
    
    // Use the secret from your .env via your config
    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as { id: any; role: Role };
    
    // ✅ CRITICAL: Convert to Number because schema says "id Int"
    const userId = Number(decoded.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true }
    });
    
    if (!user) return next(new UnauthorizedError('User no longer exists'));

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    // This catches expired tokens or invalid signatures
    next(new UnauthorizedError('Session invalid or expired'));
  }
};

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