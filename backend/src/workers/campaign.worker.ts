import { Worker, Job } from 'bullmq';
import { redisClient } from '../cache/redis.client';
import { emailQueue } from '../queues/email.queue';
import { Campaign } from '../modules/campaigns/campaign.model';
import { cacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/keys';

const CHUNK_SIZE = 100;

export const campaignWorker = new Worker(
  'campaign',
  async (job: Job) => {
    const { campaignId } = job.data;

    const campaign = await Campaign.findById(campaignId)
      .populate('sender')
      .populate('template');

    if (!campaign) throw new Error(`Campaign ${campaignId} not found`);

    // Mark campaign as processing
    await Campaign.findByIdAndUpdate(campaignId, { status: 'processing' });

    const recipients: string[] = campaign.recipients;
    const totalChunks = Math.ceil(recipients.length / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const chunk = recipients.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);

      const jobs = chunk.map((email) => ({
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
          delay: i * 1000, // Stagger sends
        },
      }));

      await emailQueue.addBulk(jobs);
    }

    // Cache total count for progress tracking
    await cacheService.set(
      CacheKeys.campaignProgress(campaignId),
      { total: recipients.length, sent: 0, failed: 0 },
      3600
    );

    console.log(`[CampaignWorker] Fanned out ${recipients.length} emails for campaign ${campaignId}`);
  },
  { connection: redisClient, concurrency: 5 }
);
