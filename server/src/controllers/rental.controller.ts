import { Request, Response } from 'express'
import { rentBookSchema } from '../utils/validators'
import {
  rentBookService,
  returnBookService
} from '../services/rental.service'
import prisma from '../config/database'
import { UnauthorizedError } from '../utils/error'

export const rentBook = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError('Not authenticated')

  const payload = rentBookSchema.parse(req.body)

  const rental = await rentBookService(
    req.user.id,
    payload.bookId,
    new Date(payload.dueDate)
  )

  res.status(201).json({
    message: 'Book rented successfully',
    rental
  })
}

export const getMyRentals = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError('Not authenticated')

  const rentals = await prisma.rental.findMany({
    where: { renterId: req.user.id },
    include: { book: true },
    orderBy: { createdAt: 'desc' }
  })

  res.json(rentals)
}

export const getAllRentals = async (_req: Request, res: Response) => {
  const rentals = await prisma.rental.findMany({
    include: {
      book: { include: { owner: true } },
      renter: true
    },
    orderBy: { createdAt: 'desc' }
  })

  res.json(rentals)
}

export const returnBook = async (req: Request, res: Response) => {
  if (!req.user) throw new UnauthorizedError('Not authenticated')

  const result = await returnBookService(
    req.user.id,
    Number(req.params.id)
  )

  res.json({
    message: 'Book returned successfully',
    lateFee: result.lateFee
  })
}
