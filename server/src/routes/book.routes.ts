import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { upload } from '../middlewares/upload.middleware'; 
import { authenticate, isAdminOrOwner } from '../middlewares/auth.middleware';

const router = Router();

// 🟢 1. PUBLIC ROUTES (Anyone can see the library)
router.get('/view', bookController.proxyBookFile);
router.get('/', bookController.getAllBooks); // Fixed: Points to ALL books

// 🔐 2. SECURE ROUTES (Must be logged in)
router.use(authenticate);

// Owner-specific list
router.get('/owned', bookController.getMyBooks);
router.get('/stats/earnings', bookController.getEarningsStats);

// Management (Create/Update/Delete)
router.post(
  '/',
  isAdminOrOwner, 
  upload.fields([
    { name: 'bookFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  bookController.uploadBook
);

router.patch('/:id', isAdminOrOwner, upload.single('coverImage'), bookController.updateBook);
router.delete('/:id', isAdminOrOwner, bookController.deleteBook);

export default router;