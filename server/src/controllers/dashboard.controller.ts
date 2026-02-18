import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Ensure userId is a Number for Prisma v7
    const userId = Number(req.user!.id);
    const role = req.user!.role;
    
    // Filter for Books
    const filter = role === 'OWNER' ? { ownerId: userId } : {};

    // 2. Set up date range for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // 3. Parallel Database Queries
    const [categoryStats, books, rentalStats, monthlyRentals] = await Promise.all([
      // Pie Chart Data: Books by Category
      prisma.book.groupBy({
        by: ['category'],
        where: filter,
        _count: { id: true }
      }),

      // Live Book Status Table: Recent books
      prisma.book.findMany({
        where: filter,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true } } }
      }),

      // Total Income Aggregate
      prisma.rental.aggregate({
        where: role === 'OWNER' ? { book: { ownerId: userId } } : {},
        _sum: { price: true }
      }),

      // Monthly Earnings for Line Chart
      prisma.rental.findMany({
        where: {
          createdAt: { gte: sixMonthsAgo },
          ...(role === 'OWNER' ? { book: { ownerId: userId } } : {})
        },
        select: { price: true, createdAt: true }
      })
    ]);

    // 4. Generate the last 6 months labels (e.g., ["Sep", "Oct", ...])
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i)); // Correct order from 5 months ago to now
      return d.toLocaleString('default', { month: 'short' });
    });

    // 5. Map Rental prices to months
    const earningsMap = monthlyRentals.reduce((acc: Record<string, number>, curr) => {
      const monthName = curr.createdAt.toLocaleString('default', { month: 'short' });
      acc[monthName] = (acc[monthName] || 0) + (Number(curr.price) || 0);
      return acc;
    }, {});

    // 6. Format Earnings for the Chart (e.g., Recharts)
    const earningsSummary = months.map(month => ({
      month: month, // ✅ Matches frontend EarningData interface
      amount: Number(earningsMap[month] || 0) 
    }));
    // 7. Send the REAL response
    res.json({
      status: 'success',
      data: {
        income: Number(rentalStats._sum.price || 0),
        earningsSummary, // For Line Chart
        pieChart: categoryStats.map((c) => ({ 
          name: c.category || 'Other', 
          value: c._count.id 
        })),
        liveBooks: books.map((book) => ({
          id: book.id,
          title: book.title,
          owner: book.owner?.name || 'Unknown',
          rentPrice: book.rentPrice,
          availableCopies: book.availableCopies,
          totalCopies: book.totalCopies,
          bookFile: book.bookFile, // This is now the REAL Cloudinary URL
          category: book.category
        })),
      }
    });
  } catch (error) {
    console.error("Dashboard Controller Error:", error);
    next(error);
  }
};