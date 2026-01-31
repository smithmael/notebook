// src/controllers/owner.controller.ts
import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Helper to safely convert query params
const toNumber = (value: any): number => Number(value) || 0;

export const ownerController = {
  async createBook(req: Request, res: Response) {
    try {
      const ownerId = req.user!.id;
      const { title, author, category, rentPrice, totalCopies = 1 } = req.body;

      const book = await prisma.book.create({
        data: {
          title,
          author,
          category,
          rentPrice: parseFloat(rentPrice),
          totalCopies: Number(totalCopies),
          availableCopies: Number(totalCopies),
          ownerId,
        },
      });

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to create book" });
    }
  },

  async getMyBooks(req: Request, res: Response) {
    try {
      const ownerId = req.user!.id;
      const page = toNumber(req.query.page);
      const limit = toNumber(req.query.limit) || 10;

      const where: any = { ownerId };

      if (req.query.status) where.status = req.query.status;
      if (req.query.category) where.category = req.query.category;

      const skip = (page - 1) * limit;

      const [books, total] = await Promise.all([
        prisma.book.findMany({
          where,
          skip,
          take: limit,
          include: {
            rentals: {
              where: { isReturned: false },
              select: { id: true, renter: { select: { name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.book.count({ where }),
      ]);

      res.json({
        success: true,
        data: books,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to fetch books" });
    }
  },

  async getBookById(req: Request, res: Response) {
    try {
      const bookId = toNumber(req.params.id);

      if (isNaN(bookId) || bookId <= 0) {
        return res.status(400).json({ success: false, message: "Invalid book ID" });
      }

      const book = await prisma.book.findFirst({
        where: { id: bookId, ownerId: req.user!.id },
        include: {
          rentals: {
            include: { renter: { select: { name: true, email: true } } },
          },
        },
      });

      if (!book) {
        return res.status(404).json({ success: false, message: "Book not found" });
      }

      res.json({ success: true, data: book });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async updateBook(req: Request, res: Response) {
    try {
      const bookId = toNumber(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ success: false, message: "Invalid book ID" });
      }

      // update logic here
      res.json({ success: true, message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update book" });
    }
  },

  async deleteBook(req: Request, res: Response) {
    try {
      const bookId = toNumber(req.params.id);
      if (isNaN(bookId)) {
        return res.status(400).json({ success: false, message: "Invalid book ID" });
      }

      // delete logic here
      res.json({ success: true, message: "Book deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete book" });
    }
  },

  async getDashboardStats(req: Request, res: Response) {
    try {
      const ownerId = req.user!.id;

      const [totalBooks, activeBooks, totalRentals, activeRentals] =
        await Promise.all([
          prisma.book.count({ where: { ownerId } }),
          prisma.book.count({ where: { ownerId, status: "active" } }),
          prisma.rental.count({ where: { book: { ownerId } } }),
          prisma.rental.count({
            where: { book: { ownerId }, isReturned: false },
          }),
        ]);

      res.json({
        success: true,
        data: { totalBooks, activeBooks, totalRentals, activeRentals },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch stats" });
    }
  },
};

export default ownerController;
