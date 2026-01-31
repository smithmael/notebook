import { PrismaClient, Book } from '@prisma/client';
import { BaseRepository } from './base.repository';

export class BookRepository extends BaseRepository<Book, PrismaClient['book']> {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient, prismaClient.book);
  }

  /**
   * Find a book by title (using findFirst because title is not @unique)
   */
  async findByTitle(title: string): Promise<Book | null> {
    return this.model.findFirst({
      where: { title },
    });
  }

  /**
   * Get books that still have available copies
   */
  async getAvailableBooks(): Promise<Book[]> {
    return this.model.findMany({
      where: { availableCopies: { gt: 0 } },
      orderBy: { title: 'asc' },
    });
  }

  /**
   * Increment / decrement available copies
   */
  async updateStock(bookId: number, change: number): Promise<Book> {
    return this.model.update({
      where: { id: bookId },
      data: {
        availableCopies: { increment: change },
      },
    });
  }
}