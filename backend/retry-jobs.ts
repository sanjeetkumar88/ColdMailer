import { Queue } from 'bullmq';
import { ioredisClient } from './src/cache/redis.client';

async function retryFailed() {
  const emailQueue = new Queue('email', { connection: ioredisClient });

  const failedJobs = await emailQueue.getFailed();
  console.log(`Retrying ${failedJobs.length} failed jobs...`);
  
  for (const job of failedJobs) {
    await job.retry();
    console.log(`- Retried job ${job.id}`);
  }

  process.exit(0);
}

retryFailed().catch(err => {
  console.error(err);
  process.exit(1);
});
