import { Router } from 'express';
import { register, login, refreshToken, googleSync, getProfile, logout } from './auth.controller';
import { validate } from '../../shared/middleware/validate.middleware';
import { protect } from '../../shared/middleware/auth.middleware';
import { registerSchema, loginSchema, googleSyncSchema } from './auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/google-sync', validate(googleSyncSchema), googleSync);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);

export default router;
