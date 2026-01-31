// src/routes/book.routes.ts
import { Router } from 'express';
import * as bookController from '../controllers/book.controller';
import { authenticate, isAdminOrOwner } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { bookSchema } from '../utils/validators';

const router = Router(); // ✅ no generics

// ✅ no RequestWithUser interface here

router.use(authenticate, isAdminOrOwner);

router.post('/', validate(bookSchema), bookController.uploadBook);
router.get('/', bookController.getMyBooks);
router.patch('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

export default router;