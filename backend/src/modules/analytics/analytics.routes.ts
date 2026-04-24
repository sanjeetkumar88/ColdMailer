import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/stats', analyticsController.getStats);

export default router;
