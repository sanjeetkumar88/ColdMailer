import { Request, Response } from 'express';
import { InboxService } from './inbox.service';

export class InboxController {
  static async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const { messages, notConnected, hasAuthError, hasMore } = await InboxService.getMessages(userId, page, limit);
      res.json({ success: true, messages, notConnected, hasAuthError, hasMore });
    } catch (error: any) {
      console.error('Error fetching inbox:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch inbox messages' });
    }
  }
}
