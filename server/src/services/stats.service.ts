// server/src/services/stats.service.ts
import prisma from '../lib/prisma';

export const getMonthlyEarnings = async (userId: number, role: string) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

  // ✅ FIX: If no rentals exist, let's at least show book values for the chart
  const books = await prisma.book.findMany({
    where: {
      ownerId: userId,
      createdAt: { gte: sixMonthsAgo }
    },
    select: { rentPrice: true, createdAt: true }
  });

  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'short' });
  }).reverse();

  const earningsMap = books.reduce((acc: any, curr) => {
    const month = curr.createdAt.toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(curr.rentPrice);
    return acc;
  }, {});

  return months.map(month => ({
    month,
    amount: earningsMap[month] || 0 
  }));
};