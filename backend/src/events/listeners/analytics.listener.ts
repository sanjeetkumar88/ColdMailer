import { emitter } from '../emitter';
import { EmailEvent } from '../events.enum';
import { AnalyticsService } from '../../modules/analytics/analytics.service';

export const registerAnalyticsListener = () => {
  emitter.on(EmailEvent.SENT, async ({ campaignId, recipientEmail }) => {
    await AnalyticsService.recordEvent({ campaignId, recipientEmail, type: 'sent' });
  });

  emitter.on(EmailEvent.FAILED, async ({ campaignId, recipientEmail, error }) => {
    await AnalyticsService.recordEvent({ campaignId, recipientEmail, type: 'failed', error });
  });
};
