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

  static async getStats(campaignId?: string, userId?: string) {
    let filter: any = {};
    
    if (campaignId) {
      filter.campaignId = campaignId;
    } else if (userId) {
      const { Campaign } = await import('../campaigns/campaign.model');
      const campaigns = await Campaign.find({ userId }).select('_id');
      const campaignIds = campaigns.map(c => c._id);
      filter.campaignId = { $in: campaignIds };
    }

    const stats = await AnalyticsEvent.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalSent: 0,
      totalFailed: 0,
      totalOpened: 0,
      totalClicked: 0,
      totalBounced: 0,
      successRate: 0,
    };

    stats.forEach((s) => {
      if (s._id === 'sent') result.totalSent = s.count;
      if (s._id === 'failed') result.totalFailed = s.count;
      if (s._id === 'opened') result.totalOpened = s.count;
      if (s._id === 'clicked') result.totalClicked = s.count;
      if (s._id === 'bounced') result.totalBounced = s.count;
    });

    if (result.totalSent > 0) {
      result.successRate = ((result.totalSent - result.totalFailed) / result.totalSent) * 100;
    }

    return result;
  }

  static async getEvents(campaignId: string) {
    return await AnalyticsEvent.find({ campaignId })
      .sort({ createdAt: -1 })
      .limit(100);
  }
}
