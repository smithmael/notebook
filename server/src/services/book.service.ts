import prisma from '../lib/prisma';
import { NotFoundError } from '../utils/error';
import cloudinary from '../config/cloudinary';

/**
 * Helper to extract Public ID from a Cloudinary URL
 * Example: https://res.cloudinary.com/.../books_storage/filename.pdf -> books_storage/filename
 */
const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/');
  const fileNameWithExtension = parts.pop() || '';
  const folder = parts.pop() || '';
  const publicId = fileNameWithExtension.split('.')[0];
  return `${folder}/${publicId}`;
};

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
      coverImage: bookData.coverImage,
      bookFile: bookData.bookFile,
      owner: { connect: { id: ownerId } }
    }
  });
};

// server/src/services/book.service.ts

/**
 * ✅ Fetches books with pagination (Standardized for User Library)
 */
export const getBooks = async (where: any = {}, page: number = 1, pageSize: number = 12) => {
  const skip = (page - 1) * pageSize;
  const filter = { ...where };
  
  // Ensure ownerId is a number if it exists
  if (filter.ownerId) filter.ownerId = Number(filter.ownerId);

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where: filter,
      skip: Number(skip),
      take: Number(pageSize),
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true } } }
    }),
    prisma.book.count({ where: filter })
  ]);

  // ✅ This returns an OBJECT, not an ARRAY. 
  // The Frontend must map over result.data
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
 * ✅ Updates book details (Cleans Cloudinary if files change)
 */
export const updateBook = async (id: number, data: any) => {
  const oldBook = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!oldBook) throw new NotFoundError('Book not found');

  const updatePayload: any = {};
  if (data.title) updatePayload.title = data.title;
  if (data.author) updatePayload.author = data.author;
  if (data.category) updatePayload.category = data.category;
  if (data.rentPrice) updatePayload.rentPrice = Number(data.rentPrice);
  if (data.totalCopies) {
    updatePayload.totalCopies = Number(data.totalCopies);
    updatePayload.availableCopies = Number(data.totalCopies);
  }

  // If a new cover is uploaded, delete the old one from Cloudinary
  if (data.coverImage && oldBook.coverImage) {
    const oldPublicId = getPublicIdFromUrl(oldBook.coverImage);
    await cloudinary.uploader.destroy(oldPublicId).catch(console.error);
    updatePayload.coverImage = data.coverImage;
  }

  // If a new PDF is uploaded, delete the old one from Cloudinary
  if (data.bookFile && oldBook.bookFile) {
    const oldPublicId = getPublicIdFromUrl(oldBook.bookFile);
    await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' }).catch(console.error);
    updatePayload.bookFile = data.bookFile;
  }

  return await prisma.book.update({
    where: { id: Number(id) },
    data: updatePayload
  });
};

/**
 * ✅ Deletes a book & removes its files from Cloudinary
 */
export const deleteBook = async (id: number) => {
  const book = await prisma.book.findUnique({ where: { id: Number(id) } });
  if (!book) throw new NotFoundError('Book not found');

  // 1. Delete Cover Image from Cloudinary
  if (book.coverImage) {
    const imageId = getPublicIdFromUrl(book.coverImage);
    await cloudinary.uploader.destroy(imageId).catch(console.error);
  }

  // 2. Delete PDF File from Cloudinary (requires resource_type: 'raw')
  if (book.bookFile) {
    const pdfId = getPublicIdFromUrl(book.bookFile);
    await cloudinary.uploader.destroy(pdfId, { resource_type: 'raw' }).catch(console.error);
  }
  
  // 3. Delete from DB
  return await prisma.book.delete({ 
    where: { id: Number(id) } 
  });
};

/**
 * ✅ Fetches real monthly earnings for the chart
 */
export const getEarningsStats = async (ownerId: number) => {
  const rentals = await prisma.rental.findMany({
    where: {
      book: { ownerId: Number(ownerId) }
    },
    select: {
      price: true,
      createdAt: true
    },
    orderBy: { createdAt: 'asc' }
  });

  const monthlyMap: { [key: string]: number } = {};
  
  rentals.forEach(rental => {
    // Format: "Jan", "Feb", etc.
    const monthName = rental.createdAt.toLocaleString('en-US', { month: 'short' });
    monthlyMap[monthName] = (monthlyMap[monthName] || 0) + rental.price;
  });

  return Object.keys(monthlyMap).map(month => ({
    month,
    amount: monthlyMap[month]
  }));
};