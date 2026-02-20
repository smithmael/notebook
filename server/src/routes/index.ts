// src/routes/index.ts
import { Router } from 'express'
import authRoutes from './auth.routes'
import bookRoutes from './book.routes'
import ownerRoutes from './owner.routes'
import dashboardRoutes from './dashboard.routes';
import paymentRoutes from '../routes/payment.routes'; // 1. Import your payment routes
import adminRoutes from './admin.routes';
const router = Router()

// Mount all your application routes
router.use('/auth', authRoutes)
router.use('/books', bookRoutes)
router.use('/admin', adminRoutes);
router.use('/owner', ownerRoutes)
router.use('/dashboard', dashboardRoutes);
router.use('/payments', paymentRoutes); // 2. Mount here! ✅ 
// Final URL for frontend: /api/payments/initialize

export default router