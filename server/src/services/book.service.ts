import prisma from '../config/database'
import { BookRepository } from '../repositories/book.repository'
import { Book, Prisma } from '@prisma/client'
import { NotFoundError, BadRequestError } from '../utils/error'

const bookRepo = new BookRepository(prisma);

export const createBook = async (
  data: any, 
  ownerId: number
): Promise<Book> => {
  if (!data.bookName) throw new BadRequestError('Book name is required')

  return bookRepo.create({
    title: data.bookName,
    author: data.author || '',
    category: data.category || '',
    rentPrice: data.price ?? 0,
    totalCopies: 1,
    availableCopies: 1, // Default to 1 available
    status: 'active',
    ownerId,
  })
}

export const getBooks = async (
  where: Prisma.BookWhereInput = {}, 
  page: number = 1, 
  pageSize: number = 10
) => {
  const skip = (page - 1) * pageSize;
  
  // Since BaseRepository doesn't have a generic findAll with pagination,
  // we use prisma directly here or extend the repository. 
  // For now, using prisma direct for the query builder pattern:
  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { title: 'asc' }
    }),
    prisma.book.count({ where })
  ]);

  return {
    data: books,
    meta: {
      total,
      page,
      last_page: Math.ceil(total / pageSize)
    }
  }
}

export const updateBook = async (id: number, data: Partial<Book>) => {
  // Note: BaseRepository uses getById, not findById
  const book = await bookRepo.getById(id)
  if (!book) throw new NotFoundError('Book not found')
  return bookRepo.update(id, data)
}

export const deleteBook = async (id: number) => {
  const book = await bookRepo.getById(id)
  if (!book) throw new NotFoundError('Book not found')
  return bookRepo.delete(id)
}