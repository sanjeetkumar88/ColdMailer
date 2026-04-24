import { Queue } from 'bullmq';
import { redisClient } from '../cache/redis.client';

export const emailQueue = new Queue('email', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 2000 },
  },
});
