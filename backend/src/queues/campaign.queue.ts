import { Queue } from 'bullmq';
import { redisClient } from '../cache/redis.client';

export const campaignQueue = new Queue('campaign', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});
