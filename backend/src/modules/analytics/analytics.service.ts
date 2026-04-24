import { AnalyticsEvent } from './analytics.model';

export class AnalyticsService {
  static async recordEvent(data: { 
    campaignId: string; 
    recipientEmail: string; 
    type: 'sent' | 'failed' | 'opened' | 'clicked' | 'bounced'; 
    error?: string;
  }) {
    try {
      await AnalyticsEvent.create({
        campaignId: data.campaignId,
        recipientEmail: data.recipientEmail,
        type: data.type,
        error: data.error,
      });
      console.log(`[Analytics] Recorded ${data.type} for ${data.recipientEmail}`);
    } catch (error) {
      console.error('[Analytics] Failed to record event:', error);
    }
  }

  static async getStats(campaignId?: string) {
    const filter = campaignId ? { campaignId } : {};
    const stats = await AnalyticsEvent.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    // Format into a nicer object
    const result: Record<string, number> = {
      sent: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
    };

    stats.forEach((s) => {
      result[s._id] = s.count;
    });

    return result;
  }
}
