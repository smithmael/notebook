import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/error';

/**
 * ✅ Creates a book linked to an owner
 */
export const createBook = async (bookData: any, ownerId: number) => {
  return await prisma.book.create({
    data: {
      title: bookData.title,
      author: bookData.author,
      category: bookData.category,
      rentPrice: Number(bookData.rentPrice),
      totalCopies: Number(bookData.totalCopies),
      availableCopies: Number(bookData.totalCopies),
      coverImage: bookData.coverImage, // Cloudinary URL
      bookFile: bookData.bookFile,     // Cloudinary URL
      owner: { connect: { id: ownerId } }
    }
  });
};

/**
 * ✅ Fetches books with pagination (Used by Admin & Owners)
 */
export const getBooks = async (where: any = {}, page: number = 1, pageSize: number = 10) => {
  const skip = (page - 1) * pageSize;
  
  // Clean up 'where' to avoid Prisma v7 filter errors
  const filter = { ...where };
  if (filter.ownerId) filter.ownerId = Number(filter.ownerId);

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where: filter,
      skip,
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true } } }
    }),
    prisma.book.count({ where: filter })
  ]);

  return {
    data: books,
    meta: { 
      total, 
      page: Number(page), 
      last_page: Math.ceil(total / pageSize) 
    }
  };
};

/**
 * ✅ Updates book details (Strictly filtered for Prisma v7)
 */
export const updateBook = async (id: number, data: any) => {
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!book) throw new NotFoundError('Book not found');

  // 🛡️ REAL FIX: Explicitly pick only fields that exist in the DB schema
  // This prevents Prisma from crashing if 'data' contains extra request info
  const updatePayload: any = {};
  if (data.title) updatePayload.title = data.title;
  if (data.author) updatePayload.author = data.author;
  if (data.category) updatePayload.category = data.category;
  if (data.rentPrice) updatePayload.rentPrice = Number(data.rentPrice);
  if (data.totalCopies) {
    updatePayload.totalCopies = Number(data.totalCopies);
    // Adjust available copies based on the new total if needed
    updatePayload.availableCopies = Number(data.totalCopies);
  }
  if (data.coverImage) updatePayload.coverImage = data.coverImage;
  if (data.bookFile) updatePayload.bookFile = data.bookFile;

  return await prisma.book.update({
    where: { id: Number(id) },
    data: updatePayload
  });
};

/**
 * ✅ Deletes a book
 */
export const deleteBook = async (id: number) => {
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!book) throw new NotFoundError('Book not found');
  
  return await prisma.book.delete({ 
    where: { id: Number(id) } 
  });
};