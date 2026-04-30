import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './shared/middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import senderRoutes from './modules/senders/sender.routes';
import campaignRoutes from './modules/campaigns/campaign.routes';
import templateRoutes from './modules/templates/template.routes';
import contactRoutes from './modules/contacts/contact.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import mediaRoutes from './modules/media/media.routes';

import { apiRateLimiter, authRateLimiter } from './shared/middleware/rate-limiter.middleware';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Apply general rate limiting to all routes
app.use('/api', apiRateLimiter);

// Routes
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/senders', senderRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handling
app.use(errorMiddleware);

export default app;
