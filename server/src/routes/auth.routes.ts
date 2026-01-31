import { Router } from 'express'
import { signup, login } from '../controllers/auth.controller'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)

// THIS LINE IS THE FIX
export default router