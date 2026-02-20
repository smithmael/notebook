import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import * as bookService from '../services/book.service';
import fs from 'fs';
import axios from 'axios';
import prisma from '../config/database'; // Ensure prisma is imported

// ✅ 1. NEW: GET ALL BOOKS (For the User Bookshelf)
// This fixes the "Data format error" by providing the general list
// ✅ 1. FIXED: GET ALL BOOKS


export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true } } }
    });

    res.status(200).json({ 
      status: 'success', 
      data: books 
    });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch' });
  }
};


// ✅ 2. PROXY TO FIX 401 ERROR
export const proxyBookFile = async (req: Request, res: Response) => {
  const fileUrl = req.query.url as string;
  if (!fileUrl) return res.status(400).json({ status: 'fail', message: 'File URL is required' });

  try {
    const response = await axios.get(fileUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline'); 
    response.data.pipe(res);
  } catch (error: any) {
    res.status(500).json({ status: 'fail', message: 'Could not fetch file' });
  }
};

// ✅ 3. CREATE (Upload)
export const uploadBook = async (req: Request, res: Response) => {
  try {
    if (!req.files || typeof req.files !== 'object') {
      return res.status(400).json({ status: 'fail', message: 'No files uploaded.' });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const pdfFile = files['bookFile']?.[0];
    const coverFile = files['coverImage']?.[0];

    if (!pdfFile) return res.status(400).json({ status: 'fail', message: 'PDF file is required' });

    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: 'auto', 
      folder: 'books_storage',
    });

    let coverUrl = null;
    if (coverFile) {
      const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
        resource_type: 'image',
        folder: 'book_covers',
      });
      coverUrl = coverUpload.secure_url;
    }

    const bookData = {
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      rentPrice: Number(req.body.rentPrice) || 0,
      totalCopies: Number(req.body.totalCopies) || 1,
      availableCopies: Number(req.body.totalCopies) || 1,
      coverImage: coverUrl,
      bookFile: pdfUpload.secure_url,
    };

    const book = await bookService.createBook(bookData, Number(req.user!.id));

    if (pdfFile) fs.unlinkSync(pdfFile.path);
    if (coverFile) fs.unlinkSync(coverFile.path);

    res.status(201).json({ status: 'success', data: book });
  } catch (e: any) {
    res.status(500).json({ status: 'fail', message: e.message || 'Upload failed' });
  }
};

// ✅ 4. GET MY BOOKS (Owner Dashboard)
export const getMyBooks = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    const result = await bookService.getBooks({ ownerId: userId });
    // Since service uses pagination, return result.data
    res.json({ status: 'success', data: result.data || [] });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: 'Fetch failed' });
  }
};
// ✅ 5. UPDATE
export const updateBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const updateData = { ...req.body };
    if (req.file) {
      const coverUpload = await cloudinary.uploader.upload(req.file.path, { folder: 'book_covers' });
      updateData.coverImage = coverUpload.secure_url;
      fs.unlinkSync(req.file.path);
    }
    const book = await bookService.updateBook(id, updateData);
    res.json({ status: 'success', data: book });
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: 'Update failed' });
  }
};

// ✅ 6. DELETE
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    await bookService.deleteBook(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: 'Delete failed' });
  }
};

// ✅ 7. EARNINGS STATS
export const getEarningsStats = async (req: Request, res: Response) => {
  try {
    const ownerId = Number(req.user?.id);
    if (!ownerId) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    const stats = await bookService.getEarningsStats(ownerId);
    res.json({ status: 'success', data: stats });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch stats' });
  }
};