import { Router } from 'express'
import {
  rentBook,
  getMyRentals,
  getAllRentals,
  returnBook
} from '../controllers/rental.controller'
import {
  authenticate,
  authorize,
  isAdminOrOwner
} from '../middlewares/auth.middleware'

const router = Router()

router.post(
  '/',
  authenticate,
  authorize('USER'),
  rentBook
)

router.get(
  '/me',
  authenticate,
  authorize('USER'),
  getMyRentals
)

router.patch(
  '/:id/return',
  authenticate,
  authorize('USER'),
  returnBook
)

router.get(
  '/',
  authenticate,
  isAdminOrOwner,
  getAllRentals
)

export default router
