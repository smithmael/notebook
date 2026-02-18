import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import * as bookService from '../services/book.service';
import fs from 'fs';

// 1. CREATE
export const uploadBook = async (req: Request, res: Response) => {
  try {
    if (!req.files || typeof req.files !== 'object') {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'No files uploaded.' 
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const pdfFile = files['bookFile']?.[0];
    const coverFile = files['coverImage']?.[0];

    if (!pdfFile) {
      return res.status(400).json({ status: 'fail', message: 'PDF file is required' });
    }

    // ✅ FIX: Set type to 'upload' to prevent 401 Unauthorized errors on 'Read'
   const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
  resource_type: 'auto', 
  type: 'upload', 
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
    console.error("Upload Error:", e);
    res.status(500).json({ status: 'fail', message: e.message || 'Upload failed' });
  }
};

// 2. GET MY BOOKS
export const getMyBooks = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    const result = await bookService.getBooks({ ownerId: userId });
    res.json({ status: 'success', data: result || [] });
  } catch (e: any) {
    res.status(500).json({ status: 'error', message: 'Database fetch failed' });
  }
};

// 3. UPDATE (Fixed TS2345)
export const updateBook = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Cast req.params.id to string to satisfy parseInt
    const id = parseInt(req.params.id as string, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Book ID' });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const coverUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: 'book_covers',
      });
      updateData.coverImage = coverUpload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    if (updateData.rentPrice) updateData.rentPrice = Number(updateData.rentPrice);
    if (updateData.totalCopies) updateData.totalCopies = Number(updateData.totalCopies);

    const book = await bookService.updateBook(id, updateData);
    res.json({ status: 'success', data: book });
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: e.message || 'Update failed' });
  }
};

// 4. DELETE (Fixed TS2345)
export const deleteBook = async (req: Request, res: Response) => {
  try {
    // ✅ FIX: Cast req.params.id to string to satisfy parseInt
    const id = parseInt(req.params.id as string, 10);
    
    if (isNaN(id)) {
      return res.status(400).json({ status: 'fail', message: 'Invalid Book ID' });
    }

    await bookService.deleteBook(id);
    res.status(204).send();
  } catch (e: any) {
    res.status(404).json({ status: 'fail', message: 'Delete failed' });
  }
};