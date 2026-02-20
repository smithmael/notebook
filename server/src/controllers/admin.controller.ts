import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export const getAllOwners = async (req: Request, res: Response) => {
  try {
    // 💡 Being real: Double check if your DB uses 'OWNER' or 'owner'
    const owners = await prisma.user.findMany({
      where: {
        role: 'OWNER', 
      },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        location: true,
        createdAt: true,
        _count: {
          select: { books: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: owners });
  } catch (error) {
    console.error("Fetch Owners Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const approveOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Accept 'active' or 'inactive' from frontend

    const owner = await prisma.user.update({
      where: { id: Number(id) },
      data: { status: status || 'active' }
    });
    res.json({ success: true, message: 'Owner status updated successfully', owner });
  } catch (error) {
    next(error);
  }
};

export const approveBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.update({
      where: { id: Number(id) },
      data: { status: 'active' }
    });
    res.json({ success: true, message: 'Book approved successfully', book });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalRevenue, totalBooks, activeRentals, liveBooks] = await Promise.all([
      prisma.rental.aggregate({ _sum: { price: true } }),
      prisma.book.count(),
      prisma.rental.count({ where: { isReturned: false } }),
      prisma.book.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { owner: { select: { name: true } } }
      })
    ]);

    const income = totalRevenue._sum.price || 0;

    res.json({
      success: true,
      data: {
        income: income,
        liveBooks: liveBooks,
        pieChart: [
          { name: 'Total Available', value: Math.max(0, totalBooks - activeRentals) },
          { name: 'Total Rented', value: activeRentals }
        ],
        earningsSummary: [
          { name: 'Total Revenue', income: income }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Admin stats failed" });
  }
};

// ✅ Export everything correctly as an object
export default { 
  getAdminStats, 
  getAllOwners,
  approveOwner,
  approveBook
};