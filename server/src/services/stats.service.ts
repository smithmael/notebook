import prisma from '../config/database';
import { Prisma } from '@prisma/client'; // Import Prisma namespace

export const getRevenueChart = async (userId: number, role: string) => {
  // Use Prisma.sql helper, not prisma.sql instance method
  const whereSql = role === 'OWNER' 
    ? Prisma.sql`WHERE "ownerId" = ${userId}` 
    : Prisma.sql``;

  // Ensure table name case matches your DB (usually "Rental" or "rentals")
  const data: any[] = await prisma.$queryRaw`
    SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon') as name, SUM(price) as "current"
    FROM "Rental" ${whereSql}
    GROUP BY 1, DATE_TRUNC('month', "createdAt")
    ORDER BY DATE_TRUNC('month', "createdAt") LIMIT 6;
  `;
  
  return data.map(d => ({ 
    ...d, 
    current: Number(d.current),
    // Mocking previous data for chart comparison
    previous: Number(d.current) * (Math.random() * 0.5 + 0.6) 
  }));
};