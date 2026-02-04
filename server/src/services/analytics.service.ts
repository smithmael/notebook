import prisma from '../config/database'
import { Prisma, Role } from '@prisma/client'



export const getRevenueChart = async (
  userId: number,
  role: Role
) => {
  /**
   * OWNER → only their books
   * ADMIN → all books
   */
  const whereSql =
    role === 'OWNER'
      ? Prisma.sql`
          WHERE b."ownerId" = ${userId}
        `
      : Prisma.sql``

  /**
   * rentals table is mapped as "rentals"
   * books table is mapped as "books"
   */
  const rows: Array<{
    name: string
    current: number
    previous: number | null
  }> = await prisma.$queryRaw`
    WITH monthly_revenue AS (
      SELECT
        DATE_TRUNC('month', r."createdAt") AS month,
        SUM(r.price) AS total
      FROM "rentals" r
      JOIN "books" b ON b.id = r."bookId"
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
  `

  return rows
    .reverse()
    .map(r => ({
      name: r.name,
      current: Number(r.current),
      previous: r.previous ? Number(r.previous) : 0
    }))
}
