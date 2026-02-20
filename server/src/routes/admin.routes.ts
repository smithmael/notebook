import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { authenticate, isAdmin } from '../middlewares/auth.middleware';
// ... existing imports
const router = Router();

router.use(authenticate, isAdmin);

// 🚀 ADD THIS LINE - This is what the AdminDashboard calls
router.get('/stats', adminController.getAdminStats); 

router.get('/owners', adminController.getAllOwners);
router.patch('/owners/:id/approve', adminController.approveOwner);
router.patch('/books/:id/approve', adminController.approveBook);

export default router;