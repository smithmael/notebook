// src/routes/owner.routes.ts
import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import validate from '../middlewares/validate';
import { bookSchema } from '../utils/validators';
import ownerController from '../controllers/owner.controller';     // ← Default import is important!

const router = Router();

router.post(
  '/books',
  authenticate,
  validate({ body: bookSchema }),                    // ← Fixed validate
  ownerController.createBook
);

router.get('/books', authenticate, ownerController.getMyBooks);
router.get('/books/:id', authenticate, ownerController.getBookById);
router.patch('/books/:id', authenticate, ownerController.updateBook);
router.delete('/books/:id', authenticate, ownerController.deleteBook);
router.get('/revenue-chart', authenticate, ownerController.getDashboardStats);

export default router;