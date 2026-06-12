import { Router } from 'express';
import { InboxController } from './inbox.controller';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', InboxController.getMessages);

export const inboxRoutes = router;
