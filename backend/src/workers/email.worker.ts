import { Worker, Job } from 'bullmq';
import { redisClient, ioredisClient } from '../cache/redis.client';
import { getProvider } from '../providers';
import { Sender } from '../modules/senders/sender.model';
import { Template } from '../modules/templates/template.model';
import { Contact } from '../modules/contacts/contact.model';
import { renderTemplate } from '../shared/utils/template.engine';
import { emitter } from '../events/emitter';
import { EmailEvent } from '../events/events.enum';
import { cacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/keys';

const luaRateLimitScript = `
  local current = redis.call("INCR", KEYS[1])
  if current == 1 then
    redis.call("PEXPIREAT", KEYS[1], tonumber(ARGV[2]))
  end
  if current > tonumber(ARGV[1]) then
    redis.call("DECR", KEYS[1])
    return -1
  end
  return current
`;

export const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    const { campaignId, recipientEmail, senderId, templateId, contactList, variables, attachments } = job.data;

    // Cache sender
    let sender = await cacheService.get<any>(CacheKeys.sender(senderId));
    if (!sender) {
      sender = await Sender.findById(senderId).lean();
      if (sender) await cacheService.set(CacheKeys.sender(senderId), sender, 300);
    }

    if (!sender) throw new Error(`Sender ${senderId} not found`);

    // --- RATE LIMITER LOGIC ---
    const dailyLimit = sender.dailyLimit || 500;
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    // Key format: rate_limit:senderId:YYYY-MM-DD
    const dateStr = now.toISOString().split('T')[0];
    const rateLimitKey = `rate_limit:${senderId}:${dateStr}`;

    const result = await ioredisClient.eval(
      luaRateLimitScript,
      1,
      rateLimitKey,
      dailyLimit,
      midnight.getTime()
    );

    if (result === -1) {
      console.log(`[EmailWorker] Rate limit exceeded for sender ${senderId}. Delaying job until midnight.`);
      await job.moveToDelayed(Date.now() + msUntilMidnight);
      return; // Stop processing and return cleanly (doesn't fail the job, just pauses it)
    }
    // --------------------------

    // Cache template
    let template = await cacheService.get<any>(CacheKeys.template(templateId));
    if (!template) {
      template = await Template.findById(templateId).lean();
      if (template) await cacheService.set(CacheKeys.template(templateId), template, 300);
    }

    if (!template) throw new Error(`Template ${templateId} not found`);

    // Fetch contact for personalization
    const query: any = { email: recipientEmail };
    if (contactList) {
      query.listId = contactList;
    }
    const contact = await Contact.findOne(query).lean();

    // Render template
    const { subject, html, text } = renderTemplate(template, {
      ...variables,
      email: recipientEmail,
      name: contact?.name || '',
      ...(contact?.metadata || {}) // Spread any custom fields like company, role
    });

    // Inject tracking pixel
    const API_URL = process.env.API_URL || 'http://localhost:5000/api';
    const trackingUrl = `${API_URL}/analytics/track/${campaignId}/${recipientEmail}`;
    const trackingPixel = `<img src="${trackingUrl}" width="1" height="1" style="display:none !important;" />`;
    const trackedHtml = html + trackingPixel;

    const provider = getProvider(sender);

    await provider.sendEmail({
      from: sender.email,
      to: recipientEmail,
      subject,
      html: trackedHtml,
      text,
      attachments,
    });

    // Emit event
    emitter.emit(EmailEvent.SENT, { campaignId, recipientEmail, senderId });
    console.log(`[EmailWorker] Successfully sent email to ${recipientEmail} for campaign ${campaignId}`);

    // Increment progress in Redis and MongoDB
    const campaignIdStr = campaignId.toString();
    const updatedCampaign = await import('../modules/campaigns/campaign.model').then(({ Campaign }) => 
      Campaign.findByIdAndUpdate(campaignId, { $inc: { sentCount: 1 } }, { new: true })
    );

    await redisClient.hIncrBy(CacheKeys.campaignProgress(campaignIdStr), 'sent', 1);

    // Check if campaign is finished
    if (updatedCampaign) {
      const totalProcessed = (updatedCampaign.sentCount || 0) + (updatedCampaign.failedCount || 0);
      const totalExpected = updatedCampaign.recipients?.length || 0;
      
      if (totalProcessed >= totalExpected && updatedCampaign.status === 'processing') {
        updatedCampaign.status = 'completed';
        await updatedCampaign.save();
        console.log(`[EmailWorker] Campaign ${campaignId} marked as COMPLETED`);
      }
    }

    console.log(`[EmailWorker] Incremented progress for campaign ${campaignId}`);
  },
  {
    connection: ioredisClient,
    concurrency: 20,
    limiter: {
      max: 100,
      duration: 1000,
    },
    removeOnComplete: {
      age: 3600, // 1 hour
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600, // 24 hours
      count: 5000,
    }
  }
);

emailWorker.on('failed', async (job, err) => {
  if (job) {
    // Check if job exhausted all attempts
    if (job.attemptsMade >= (job.opts.attempts || 5)) {
      console.log(`[EmailWorker] Job ${job.id} exhausted all attempts. Sending to DLQ.`);
      await import('../queues/dlq.queue').then(({ dlqQueue }) => {
        return dlqQueue.add('dead-email', { ...job.data, failureReason: err.message, failedAt: new Date() });
      }).catch(e => console.error('Failed to push to DLQ:', e));
    }

    emitter.emit(EmailEvent.FAILED, {
      campaignId: job.data.campaignId,
      recipientEmail: job.data.recipientEmail,
      error: err.message,
    });
    
    // Increment failed count in Redis and MongoDB
    const campaignIdStr = job.data.campaignId.toString();
    const campaignId = job.data.campaignId;
    
    Promise.all([
      redisClient.hIncrBy(CacheKeys.campaignProgress(campaignIdStr), 'failed', 1),
      import('../modules/campaigns/campaign.model').then(({ Campaign }) => 
        Campaign.findByIdAndUpdate(campaignId, { $inc: { failedCount: 1 } }, { new: true })
      )
    ]).then(async ([_, updatedCampaign]) => {
      // Check if campaign is finished
      if (updatedCampaign) {
        const totalProcessed = (updatedCampaign.sentCount || 0) + (updatedCampaign.failedCount || 0);
        const totalExpected = updatedCampaign.recipients?.length || 0;
        
        if (totalProcessed >= totalExpected && updatedCampaign.status === 'processing') {
          updatedCampaign.status = 'completed';
          await updatedCampaign.save();
          console.log(`[EmailWorker] Campaign ${campaignId} marked as COMPLETED (with failures)`);
        }
      }
    }).catch(e => console.error('Failed to increment error count:', e));
  }
});
