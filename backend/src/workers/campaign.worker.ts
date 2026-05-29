import { Worker, Job } from 'bullmq';
import { ioredisClient, redisClient } from '../cache/redis.client';
import { emailQueue } from '../queues/email.queue';
import { Campaign } from '../modules/campaigns/campaign.model';
import { cacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/keys';

const CHUNK_SIZE = 100;

export const campaignWorker = new Worker(
  'campaign',
  async (job: Job) => {
    const { campaignId, recipientsOverride } = job.data;
    console.log(`[CampaignWorker] Processing campaign: ${campaignId}`);

    const campaign = await Campaign.findById(campaignId)
      .populate('sender')
      .populate('template');

    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);
    if (!campaign?.sender) {
      const errorMsg = `Sender not found for campaign ${campaignId}. The sender might have been disconnected.`;
      console.error(`[CampaignWorker] Job ${job.id} failed: ${errorMsg}`);
      
      // Update campaign status to failed in DB
      await Campaign.findByIdAndUpdate(campaignId, { status: 'failed' });
      
      return;
    }
    if (!campaign.template) throw new Error(`Template not found for campaign ${campaignId}.`);

    const recipients: string[] = recipientsOverride || campaign.recipients;

    // Mark campaign as processing
    await Campaign.findByIdAndUpdate(campaignId, { status: 'processing' });

    const totalChunks = Math.ceil(recipients.length / CHUNK_SIZE);
    let cumulativeDelay = 0;

    for (let i = 0; i < totalChunks; i++) {
      const chunk = recipients.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      const jobs = chunk.map((email) => {
        // Random gap between 30 seconds and 90 seconds to simulate human sending
        const randomGap = Math.floor(Math.random() * (90000 - 30000 + 1)) + 30000;
        cumulativeDelay += randomGap;

        return {
          name: 'send-email',
          data: {
            campaignId,
            recipientEmail: email,
            senderId: campaign.sender._id,
            templateId: campaign.template._id,
            variables: campaign.variables ?? {},
            attachments: campaign.attachments ?? [],
          },
          opts: {
            delay: cumulativeDelay, // Human-like staggered sending
          },
        };
      });

      await emailQueue.addBulk(jobs);
    }

    // Initialize progress in Redis as a Hash
    const progressKey = CacheKeys.campaignProgress(campaignId);
    await redisClient.del(progressKey); // Clear any existing string key
    await redisClient.hSet(progressKey, {
      total: recipients.length.toString(),
      sent: '0',
      failed: '0'
    });
    await redisClient.expire(progressKey, 3600);

    console.log(`[CampaignWorker] Fanned out ${recipients.length} emails for campaign ${campaignId}`);
  },
  {
    connection: ioredisClient,
    concurrency: 1,
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 100,
    },
    removeOnFail: {
      age: 24 * 3600, // 24 hours
      count: 500,
    }
  }
);

campaignWorker.on('error', (err) => {
  console.error('[CampaignWorker] Global error:', err);
});

campaignWorker.on('failed', (job, err) => {
  console.error(`[CampaignWorker] Job ${job?.id} failed:`, err);
});
