import { Worker, Job } from 'bullmq';
import { redisClient } from '../cache/redis.client';
import { getProvider } from '../providers';
import { Sender } from '../modules/senders/sender.model';
import { Template } from '../modules/templates/template.model';
import { renderTemplate } from '../shared/utils/template.engine';
import { emitter } from '../events/emitter';
import { EmailEvent } from '../events/events.enum';
import { cacheService } from '../cache/cache.service';
import { CacheKeys } from '../cache/keys';

export const emailWorker = new Worker(
  'email',
  async (job: Job) => {
    const { campaignId, recipientEmail, senderId, templateId, variables, attachments } = job.data;

    // Cache sender
    let sender = await cacheService.get<any>(CacheKeys.sender(senderId));
    if (!sender) {
      sender = await Sender.findById(senderId).lean();
      if (sender) await cacheService.set(CacheKeys.sender(senderId), sender, 300);
    }

    if (!sender) throw new Error(`Sender ${senderId} not found`);

    // Cache template
    let template = await cacheService.get<any>(CacheKeys.template(templateId));
    if (!template) {
      template = await Template.findById(templateId).lean();
      if (template) await cacheService.set(CacheKeys.template(templateId), template, 300);
    }

    if (!template) throw new Error(`Template ${templateId} not found`);

    // Render template
    const { subject, html, text } = renderTemplate(template, {
      ...variables,
      email: recipientEmail,
    });

    const provider = getProvider(sender);

    await provider.sendEmail({
      from: sender.email,
      to: recipientEmail,
      subject,
      html,
      text,
      attachments,
    });

    // Emit event
    emitter.emit(EmailEvent.SENT, { campaignId, recipientEmail, senderId });

    // Increment progress in Redis
    await redisClient.hincrby(CacheKeys.campaignProgress(campaignId), 'sent', 1);
  },
  {
    connection: redisClient,
    concurrency: 20,
    limiter: {
      max: 100,
      duration: 1000,
    },
  }
);

emailWorker.on('failed', (job, err) => {
  if (job) {
    emitter.emit(EmailEvent.FAILED, {
      campaignId: job.data.campaignId,
      recipientEmail: job.data.recipientEmail,
      error: err.message,
    });
  }
});
