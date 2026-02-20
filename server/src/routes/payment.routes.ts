import { Router } from 'express';
import { initializePayment } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint: POST /api/payments/initialize
router.post('/initialize', authenticate, initializePayment);

export default router;