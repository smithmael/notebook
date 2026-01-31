import { PrismaClient, Rental } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class RentalRepository extends BaseRepository<Rental, PrismaClient['rental']> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, prismaClient.rental);
  }

  /**
   * Get all rentals for a specific user
   */
  async getRentalsByUserId(renterId: number): Promise<Rental[]> {
    return this.model.findMany({
      where: { renterId },
      include: {
        book: true,
        renter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get ALL rentals (temporary - will update when schema has return fields)
   */
  async getActiveRentals(): Promise<Rental[]> {
    return this.model.findMany({
      include: {
        renter: true,
        book: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create a new rental
   */
  async createRental(data: { 
    renterId: number; 
    bookId: number; 
    price: number;
    dueDate: Date; // <--- Added this
  }): Promise<Rental> {
    return this.model.create({
      data: {
        renterId: data.renterId,
        bookId: data.bookId,
        price: data.price,
        dueDate: data.dueDate, // <--- Added this
      },
    });
  }

  /**
   * Get rentals by book ID
   */
  async getRentalsByBookId(bookId: number): Promise<Rental[]> {
    return this.model.findMany({
      where: { bookId },
      include: {
        renter: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get rental statistics
   */
  async getRentalStats(): Promise<{
    totalRentals: number;
    totalRevenue: number;
  }> {
    const [totalRentals, revenueResult] = await Promise.all([
      this.model.count(),
      this.model.aggregate({
        _sum: { price: true },
      }),
    ]);

    return {
      totalRentals,
      totalRevenue: revenueResult._sum.price || 0,
    };
  }
}