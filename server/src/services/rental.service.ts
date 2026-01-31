import prisma from '../config/database';
import { RentalRepository } from '../repositories/rental.repository';
import { BookRepository } from '../repositories/book.repository';
import { Rental } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../utils/error';

const rentalRepo = new RentalRepository(prisma);
const bookRepo = new BookRepository(prisma);

/**
 * Rent a book
 */
export const createRental = async (data: {
  renterId: number;
  bookId: number;
  durationDays?: number;
}) => {
  const book = await bookRepo.getById(data.bookId);

  if (!book) throw new NotFoundError('Book not found');
  if (book.availableCopies < 1) throw new BadRequestError('Book is out of stock');

  const duration = data.durationDays || 7;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + duration);

  // Use a transaction to ensure stock is updated only if rental succeeds
  return prisma.$transaction(async (tx) => {
    // 1. Decrement stock
    await tx.book.update({
      where: { id: data.bookId },
      data: { availableCopies: { decrement: 1 } }
    });

    // 2. Create Rental
    return tx.rental.create({
      data: {
        renterId: data.renterId,
        bookId: data.bookId,
        price: book.rentPrice,
        dueDate: dueDate,
        // REMOVED: status: 'active' (field does not exist in schema)
      }
    });
  });
};

/**
 * Get rentals for a specific user (Renter)
 */
export const getMyRentals = async (userId: number): Promise<Rental[]> => {
  return rentalRepo.getRentalsByUserId(userId);
};

/**
 * Get rentals for an Owner (books owned by this user)
 */
export const getOwnerRentals = async (ownerId: number) => {
  return prisma.rental.findMany({
    where: {
      book: {
        ownerId: ownerId
      }
    },
    include: {
      book: true,
      renter: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * Get Rental Statistics (Admin/Owner)
 */
export const getRentalAnalytics = async () => {
  return rentalRepo.getRentalStats();
};