import { Router } from 'express'
import { getRevenueChartController } from '../controllers/analytics.controller'
import {
  authenticate,
  isAdminOrOwner
} from '../middlewares/auth.middleware'

const router = Router()

router.get(
  '/revenue',
  authenticate,
  isAdminOrOwner,
  getRevenueChartController
)

export default router
