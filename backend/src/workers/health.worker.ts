import { Worker, Job } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';
import { promises as dns } from 'dns';
import { Sender } from '../modules/senders/sender.model';

export const healthWorker = new Worker(
  'sender-health-check',
  async (job: Job) => {
    const { senderId, email } = job.data;
    console.log(`[Health Worker] Checking DNS health for ${email} (Job: ${job.id})`);

    const domain = email.split('@')[1];
    if (!domain) {
      throw new Error(`Invalid email address: ${email}`);
    }

    let spf = false;
    let dmarc = false;

    try {
      const txtRecords = await dns.resolveTxt(domain);
      for (const record of txtRecords) {
        const recordStr = record.join('');
        if (recordStr.includes('v=spf1')) {
          spf = true;
        }
      }
    } catch (err: any) {
      console.log(`[Health Worker] SPF check failed or no records found for ${domain}`);
    }

    try {
      const dmarcRecords = await dns.resolveTxt(`_dmarc.${domain}`);
      for (const record of dmarcRecords) {
        const recordStr = record.join('');
        if (recordStr.includes('v=DMARC1')) {
          dmarc = true;
        }
      }
    } catch (err: any) {
      console.log(`[Health Worker] DMARC check failed or no records found for _dmarc.${domain}`);
    }

    // Calculate score
    let score = 0;
    if (spf) score += 40;
    if (dmarc) score += 40;


    const healthStatus = {
      spf,
      dmarc,
      dkim: { status: 'unknown' as const, source: 'dns' as const },
      score
    };

    // Update Sender status
    await Sender.findByIdAndUpdate(senderId, {
      $set: {
        healthStatus
      }
    });

    console.log(`[Health Worker] Finished checks for ${domain}. Score: ${score}.`);
  },
  { connection: ioredisClient }
);

healthWorker.on('completed', (job) => {
  console.log(`[Health Worker] Job ${job.id} completed successfully`);
});

healthWorker.on('failed', (job, err) => {
  console.error(`[Health Worker] Job ${job?.id} failed:`, err);
});
