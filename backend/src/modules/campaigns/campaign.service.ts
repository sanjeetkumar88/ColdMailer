import { Campaign, ICampaign } from './campaign.model';
import { campaignQueue } from '../../queues/campaign.queue';

export class CampaignService {
  static async createCampaign(data: Partial<ICampaign>) {
    return await Campaign.create(data);
  }

  static async launchCampaign(campaignId: string) {
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) throw new Error('Campaign not found');

    // Add job to campaign queue
    await campaignQueue.add('launch-campaign', { campaignId });

    // Update status
    campaign.status = 'scheduled';
    await campaign.save();

    return campaign;
  }

  static async getCampaigns() {
    return await Campaign.find().populate('sender template');
  }
}
