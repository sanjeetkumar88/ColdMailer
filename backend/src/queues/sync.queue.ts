import { Queue } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';

export const syncQueue = new Queue('sender-sync', { connection: ioredisClient });

export const addSyncJob = async (senderId: string) => {
  await syncQueue.add(
    'sync-mailbox',
    { senderId },
    { removeOnComplete: true, removeOnFail: false } // One-off job!
  );
};
