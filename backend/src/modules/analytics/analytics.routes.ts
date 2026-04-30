import { Router } from 'express';
import * as analyticsController from './analytics.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

// Public route for tracking pixels
router.get('/track/:campaignId/:recipientEmail', analyticsController.trackOpen);

router.use(protect);

router.get('/stats', analyticsController.getStats);
router.get('/:campaignId/events', analyticsController.getEvents);

export default router;
