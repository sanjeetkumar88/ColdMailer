import { Queue } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';

export const dlqQueue = new Queue('deadLetterQueue', {
  connection: ioredisClient,
});
