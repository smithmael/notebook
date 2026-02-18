import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/error';

export const getAllOwners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owners = await prisma.user.findMany({
      where: { role: 'OWNER' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        location: true,
        createdAt: true,
        _count: { select: { books: true } }
      }
    });
    res.json(owners);
  } catch (error) {
    next(error);
  }
};

export const approveOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const owner = await prisma.user.update({
      where: { id: Number(id) },
      data: { status: 'active' }
    });
    res.json({ message: 'Owner approved successfully', owner });
  } catch (error) {
    next(error);
  }
};

export const approveBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: { status: 'active' }
    });
    res.json({ message: 'Book approved successfully', book });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllOwners,
  approveOwner,
  approveBook
};