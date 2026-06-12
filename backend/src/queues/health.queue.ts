import { Queue } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';

export const healthQueue = new Queue('sender-health-check', { connection: ioredisClient });

export const addHealthCheckJob = async (senderId: string, email: string) => {
  await healthQueue.add(
    'health-check',
    { senderId, email },
    { jobId: `health:${senderId}`, removeOnComplete: true, removeOnFail: false }
  );
};
