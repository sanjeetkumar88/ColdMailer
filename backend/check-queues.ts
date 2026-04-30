import { Queue } from 'bullmq';
import { ioredisClient } from './src/cache/redis.client';

async function checkQueues() {
  const emailQueue = new Queue('email', { connection: ioredisClient });

  const failedJobs = await emailQueue.getFailed();
  
  console.log(`Found ${failedJobs.length} failed jobs in email queue:`);
  
  failedJobs.forEach(job => {
    console.log(`- Job ID: ${job.id}`);
    console.log(`  Recipient: ${job.data.recipientEmail}`);
    console.log(`  Failed Reason: ${job.failedReason}`);
  });

  process.exit(0);
}

checkQueues().catch(err => {
  console.error(err);
  process.exit(1);
});
