import { Queue } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';

export const campaignQueue = new Queue('campaign', {
  connection: ioredisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});
