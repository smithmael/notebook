// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './auth.routes'
import bookRoutes from './book.routes'
import ownerRoutes from './owner.routes'

const router = Router()

// Mount all your application routes
router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/owner', ownerRoutes)

export default router