import { Campaign, ICampaign } from './campaign.model';
import { campaignQueue } from '../../queues/campaign.queue';

export class CampaignService {
  static async createCampaign(data: Partial<ICampaign>) {
    return await Campaign.create(data);
  }

  static async launchCampaign(campaignId: string, userId: string, recipientsOverride?: string[]) {
    const campaign = await Campaign.findOne({ _id: campaignId, userId });
    if (!campaign) throw new Error('Campaign not found or unauthorized');

    // Add job to campaign queue
    await campaignQueue.add('launch-campaign', { 
      campaignId, 
      recipientsOverride 
    });

    // Update status
    campaign.status = 'scheduled';
    if (recipientsOverride) {
       // If retrying, reset the failed count for those specific retries
       campaign.failedCount = Math.max(0, campaign.failedCount - recipientsOverride.length);
    }
    await campaign.save();

    return campaign;
  }

  static async deleteCampaign(id: string, userId: string) {
    const campaign = await Campaign.findOneAndDelete({ _id: id, userId });
    if (!campaign) throw new Error('Campaign not found');
    
    // Cleanup related analytics
    const { AnalyticsEvent } = await import('../analytics/analytics.model');
    await AnalyticsEvent.deleteMany({ campaignId: id });
    
    return campaign;
  }

  static async getCampaigns(userId: string, query: any = {}) {
    const { status, limit = 10, page = 1 } = query;
    const filter: any = { userId };
    if (status && status !== 'all') filter.status = status;

    const campaigns = await Campaign.find(filter)
      .populate('sender template')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Campaign.countDocuments(filter);

    return { 
      campaigns, 
      total, 
      page: Number(page), 
      totalPages: Math.ceil(total / Number(limit)) 
    };
  }

  static async getCampaignById(id: string, userId: string) {
    return await Campaign.findOne({ _id: id, userId }).populate('sender template');
  }
}
