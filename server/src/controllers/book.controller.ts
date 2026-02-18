import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import * as bookService from '../services/book.service';
import fs from 'fs';

// 1. CREATE (Fixed "undefined reading bookFile" crash)
export const uploadBook = async (req: Request, res: Response) => {
  try {
    // 🛡️ GUARD: If multer fails or no files are sent, req.files is undefined.
    // We check this first to prevent the crash you're seeing.
    if (!req.files || typeof req.files !== 'object') {
      return res.status(400).json({ 
        status: 'fail', 
        message: 'No files uploaded. Ensure your form uses multipart/form-data.' 
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Safely access files now that we know 'files' exists
    const pdfFile = files['bookFile']?.[0];
    const coverFile = files['coverImage']?.[0];

    if (!pdfFile) {
      return res.status(400).json({ status: 'fail', message: 'PDF file (bookFile) is required' });
    }

    // ✅ CLOUD STORE FIX: 'attachment:false' allows the browser to display the PDF directly
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
      resource_type: 'raw',
      folder: 'books_storage',
      flags: "attachment:false", 
    });

    let coverUrl = null;
    if (coverFile) {
      const coverUpload = await cloudinary.uploader.upload(coverFile.path, {
        folder: 'book_covers',
      });
      coverUrl = coverUpload.secure_url;
    }

    // 🛡️ PRISMA V7 TYPE SAFETY: Force conversion to numbers
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

    // Cleanup local temp files
    if (pdfFile) fs.unlinkSync(pdfFile.path);
    if (coverFile) fs.unlinkSync(coverFile.path);

    res.status(201).json({ status: 'success', data: book });
  } catch (e: any) {
    console.error("Cloudinary Upload Error:", e);
    res.status(500).json({ status: 'fail', message: e.message || 'Cloud upload failed' });
  }
};

// 2. GET (Fetch for current owner)
export const getMyBooks = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.user?.id);
    
    if (!userId || isNaN(userId)) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized: Invalid User ID' });
    }

    const result = await bookService.getBooks({ ownerId: userId });
    
    res.json({ 
      status: 'success', 
      data: result || [] 
    });
  } catch (e: any) {
    console.error("PRISMA_FETCH_ERROR:", e); 
    res.status(500).json({ status: 'error', message: 'Database fetch failed' });
  }
};

// 3. UPDATE (Fixed TS Error 2345)
export const updateBook = async (req: Request, res: Response) => {
  try {
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

// 4. DELETE (Fixed TS Error 2345)
export const deleteBook = async (req: Request, res: Response) => {
  try {
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