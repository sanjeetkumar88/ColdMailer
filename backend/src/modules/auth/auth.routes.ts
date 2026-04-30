import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { registerSchema, loginSchema } from './auth.schema';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/google-sync', authController.googleSync);
router.get('/profile', protect, authController.getProfile);

export default router;
