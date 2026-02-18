import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { upload } from '../middlewares/upload.middleware'; 
import { authenticate, isAdminOrOwner } from '../middlewares/auth.middleware';

const router = Router();

// ✅ NEW: Proxy route to bypass browser-level 401 errors
// This must be ABOVE the /:id routes
router.get('/view', bookController.proxyBookFile);


// 🔐 Secure all routes - User must be logged in
router.use(authenticate);


// 1. Create Book
router.post(
  '/',
  isAdminOrOwner, 
  upload.fields([
    { name: 'bookFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  bookController.uploadBook
);

router.get('/', bookController.getMyBooks);

router.patch(
  '/:id', 
  isAdminOrOwner, 
  upload.single('coverImage'), 
  bookController.updateBook
);

router.delete('/:id', isAdminOrOwner, bookController.deleteBook);

export default router;