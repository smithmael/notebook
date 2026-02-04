import prisma from '../config/database'
import { ForbiddenError } from '../utils/error'

const LATE_FEE_PER_DAY = 10 // birr

export const rentBookService = async (
  userId: number,
  bookId: number,
  dueDate: Date
) => {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { owner: true }
  })

  if (!book || book.status !== 'active')
    throw new ForbiddenError('Book not available')

  if (book.availableCopies <= 0)
    throw new ForbiddenError('No copies available')

  if (book.ownerId === userId)
    throw new ForbiddenError('You cannot rent your own book')

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user || user.wallet < book.rentPrice)
    throw new ForbiddenError('Insufficient wallet balance')

  return prisma.$transaction(async (tx) => {
    const rental = await tx.rental.create({
      data: {
        bookId,
        renterId: userId,
        price: book.rentPrice,
        dueDate
      }
    })

    await tx.book.update({
      where: { id: bookId },
      data: {
        availableCopies: { decrement: 1 }
      }
    })

    await tx.user.update({
      where: { id: userId },
      data: {
        wallet: { decrement: book.rentPrice }
      }
    })

    await tx.user.update({
      where: { id: book.ownerId },
      data: {
        wallet: { increment: book.rentPrice }
      }
    })

    return rental
  })
}

export const returnBookService = async (
  userId: number,
  rentalId: number
) => {
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { book: true }
  })

  if (!rental)
    throw new ForbiddenError('Rental not found')

  if (rental.renterId !== userId)
    throw new ForbiddenError('Unauthorized return attempt')

  if (rental.isReturned)
    throw new ForbiddenError('Book already returned')

  const now = new Date()
  let lateFee = 0

  if (now > rental.dueDate) {
    const daysLate = Math.ceil(
      (now.getTime() - rental.dueDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    lateFee = daysLate * LATE_FEE_PER_DAY
  }

  return prisma.$transaction(async (tx) => {
    await tx.rental.update({
      where: { id: rentalId },
      data: {
        isReturned: true,
        returnDate: now
      }
    })

    await tx.book.update({
      where: { id: rental.bookId },
      data: {
        availableCopies: { increment: 1 }
      }
    })

    if (lateFee > 0) {
      await tx.user.update({
        where: { id: userId },
        data: {
          wallet: { decrement: lateFee }
        }
      })
    }

    return { lateFee }
  })
}
