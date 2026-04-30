import { Queue } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';

export const emailQueue = new Queue('email', {
  connection: ioredisClient,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 2000 },
  },
});
