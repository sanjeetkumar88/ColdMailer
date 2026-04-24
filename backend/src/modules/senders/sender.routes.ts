import { Router, Request, Response } from 'express';
import { SenderAuthService } from './sender.auth.service';
import * as senderController from './sender.controller';
import { asyncHandler } from '../../shared/utils/asyncHandler';

const router = Router();

router.get('/', senderController.getSenders);

router.get('/google/auth', (req: Request, res: Response) => {
  const url = SenderAuthService.getAuthUrl();
  res.redirect(url);
});

router.get('/google/callback', asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) throw new Error('Authorization code missing');

  const sender = await SenderAuthService.handleCallback(code);
  
  res.status(200).json({
    success: true,
    message: 'Google account linked successfully',
    data: {
      id: sender._id,
      email: sender.email,
    }
  });
}));

export default router;
