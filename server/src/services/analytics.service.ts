// server/src/services/analytics.service.ts
import prisma from '../lib/prisma'; // Stick to your fixed singleton
import { Prisma } from '../generated/client'; // Use your custom path

export const getRevenueChart = async (
  userId: number,
  role: string // Using string to be safe with role checks
) => {
  /**
   * 🛡️ REAL FIX: Table Names
   * In Prisma, if your model is 'Rental', the SQL table is usually 'Rental'
   * unless you used @@map("rentals"). I've adjusted to match standard Prisma naming.
   */
  const whereSql =
    role === 'OWNER'
      ? Prisma.sql`WHERE b."ownerId" = ${userId}`
      : Prisma.sql``;

  try {
    const rows: Array<{
      name: string;
      current: number;
      previous: any;
    }> = await prisma.$queryRaw`
      WITH monthly_revenue AS (
        SELECT
          DATE_TRUNC('month', r."createdAt") AS month,
          SUM(r.price) AS total
        FROM "Rental" r
        JOIN "Book" b ON b.id = r."bookId"
        ${whereSql}
        GROUP BY 1
      )
      SELECT
        TO_CHAR(month, 'Mon') AS name,
        total AS current,
        LAG(total) OVER (ORDER BY month) AS previous
      FROM monthly_revenue
      ORDER BY month DESC
      LIMIT 6;
    `;

    // If no data exists yet, return a "Zero" state so the chart doesn't look broken
    if (rows.length === 0) {
      return [{ name: new Date().toLocaleString('default', { month: 'short' }), current: 0, previous: 0 }];
    }

    return rows
      .reverse()
      .map(r => ({
        name: r.name,
        current: Number(r.current || 0),
        previous: r.previous ? Number(r.previous) : 0
      }));
  } catch (error) {
    console.error("Chart SQL Error:", error);
    // Return empty data instead of crashing the whole dashboard
    return [];
  }
};