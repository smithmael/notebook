//server/src/routes/dashboard.routes.ts

import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// We use '/' because this router will be mounted at '/dashboard' in the index
router.get('/', authenticate, getDashboardData);

export default router;