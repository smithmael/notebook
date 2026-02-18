//server/src/routes/auth.routes.ts
import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import validate from '../middlewares/validate';
import { userSignupSchema, userLoginSchema } from '../utils/validators';
const router = Router()


router.post('/signup', validate({ body: userSignupSchema.shape.body }), signup);
router.post('/login', validate({ body: userLoginSchema.shape.body }), login);

// THIS LINE IS THE FIX
export default router