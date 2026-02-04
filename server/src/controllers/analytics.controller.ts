import { Request, Response } from 'express'
import { getRevenueChart } from '../services/analytics.service'
import { UnauthorizedError } from '../utils/error'
import { Role } from '@prisma/client'

export const getRevenueChartController = async (
  req: Request,
  res: Response
) => {
  if (!req.user)
    throw new UnauthorizedError('Not authenticated')

  const data = await getRevenueChart(
    req.user.id,
    req.user.role as Role
  )

  res.json({
    success: true,
    data
  })
}
