import express from 'express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue } from '../../queues/email.queue';
import { campaignQueue } from '../../queues/campaign.queue';
import { dlqQueue } from '../../queues/dlq.queue';

const router = express.Router();

const adminAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.error('[Admin] ADMIN_SECRET not configured.');
    res.status(403).send('Forbidden: Admin not configured');
    return;
  }

  const providedSecret = req.query.secret || req.headers['x-admin-secret'];
  
  if (providedSecret === secret) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(campaignQueue),
    new BullMQAdapter(dlqQueue)
  ],
  serverAdapter: serverAdapter,
});

router.use('/queues', adminAuthMiddleware, serverAdapter.getRouter());

export default router;
