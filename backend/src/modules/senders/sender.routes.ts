import { Router, Request, Response } from 'express';
import { SenderAuthService } from './sender.auth.service';
import * as senderController from './sender.controller';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { protect } from '../../shared/middleware/auth.middleware';

const router = Router();

router.get('/', protect, senderController.getSenders);
router.get('/:id', protect, senderController.getSenderById);
router.delete('/:id', protect, senderController.deleteSender);

router.get('/google/auth', protect, (req: any, res: Response) => {
  const url = SenderAuthService.getAuthUrl(req.user.id);
  res.redirect(url);
});

router.get('/google/callback', asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const userId = req.query.state as string;
  
  if (!code) throw new Error('Authorization code missing');
  if (!userId) throw new Error('User ID missing in state');

  await SenderAuthService.handleCallback(code, userId);
  
  // Redirect back to frontend settings
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/settings?success=true`);
}));

export default router;
