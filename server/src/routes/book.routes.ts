import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { upload } from '../middlewares/upload.middleware'; 
import { authenticate, isAdminOrOwner } from '../middlewares/auth.middleware';

const router = Router();

// 🔐 Secure all routes - User must be logged in
router.use(authenticate);

// 1. Create Book
// Field names 'bookFile' and 'coverImage' must match exactly in your Frontend FormData
router.post(
  '/',
  isAdminOrOwner, 
  upload.fields([
    { name: 'bookFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 }
  ]),
  bookController.uploadBook
);

// 2. Get Owner's Books (Filtered by ownerId in controller)
router.get('/', bookController.getMyBooks);

// 3. Update Book
// Handles optional new cover image via upload.single
router.patch(
  '/:id', 
  isAdminOrOwner, 
  upload.single('coverImage'), 
  bookController.updateBook
);

// 4. Delete Book
router.delete('/:id', isAdminOrOwner, bookController.deleteBook);

export default router;