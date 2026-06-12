import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import senderRoutes from './modules/senders/sender.routes';
import campaignRoutes from './modules/campaigns/campaign.routes';
import contactRoutes from './modules/contacts/contact.routes';
import contactListRoutes from './modules/contacts/contact-list.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import mediaRoutes from './modules/media/media.routes';
import adminRoutes from './modules/admin/admin.routes';
import { inboxRoutes } from './modules/inbox/inbox.route';

import mongoose from 'mongoose';
import { redisClient } from './cache/redis.client';

import helmet from 'helmet';
import { apiRateLimiter, authRateLimiter } from './shared/middleware/rate-limiter.middleware';
import { protect } from './shared/middleware/auth.middleware';

// Bull Board imports
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';

// Queues
import { healthQueue } from './queues/health.queue';
import { syncQueue } from './queues/sync.queue';
import { campaignQueue } from './queues/campaign.queue';
import { emailQueue } from './queues/email.queue';
import { dlqQueue } from './queues/dlq.queue';

// Bull Board Setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/api/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(healthQueue),
    new BullMQAdapter(syncQueue),
    new BullMQAdapter(campaignQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(dlqQueue),
  ],
  serverAdapter: serverAdapter,
});


const app = express();

app.set('trust proxy', 1); // Trust first proxy (Next.js frontend)

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Apply general rate limiting to all routes
app.use('/api', apiRateLimiter);

// Routes
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/senders', senderRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/contact-lists', contactListRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inbox', inboxRoutes);

// Bull Board UI (Secured)
app.use('/api/admin/queues', protect, serverAdapter.getRouter());

// Health check
app.get('/health', async (req: express.Request, res: express.Response) => {
  try {
    const mongoState = mongoose.connection.readyState;
    const isMongoHealthy = mongoState === 1; // 1 = connected
    const isRedisHealthy = redisClient.isReady;

    if (isMongoHealthy && isRedisHealthy) {
      res.status(200).json({ status: 'ok', mongo: 'connected', redis: 'ready' });
    } else {
      res.status(503).json({ 
        status: 'error', 
        mongo: isMongoHealthy ? 'connected' : 'disconnected', 
        redis: isRedisHealthy ? 'ready' : 'disconnected'
      });
    }
  } catch (error) {
    res.status(503).json({ status: 'error', message: 'Health check failed' });
  }
});

// 404 Handler
app.use((req, res, next) => {
  if (req.path === '/graphql' || req.path.startsWith('/graphql')) {
    return next();
  }
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handling
app.use(errorMiddleware);

export default app;
