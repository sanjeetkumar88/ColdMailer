import { Campaign } from './campaign.model';
import { GraphQLContext } from '../../shared/graphql/context';
import { GraphQLError } from 'graphql';

export const campaignResolvers = {
  Query: {
    recentCampaigns: async (_: any, { limit = 10 }: { limit?: number }, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const campaigns = await Campaign.find({ userId: context.user.id })
        .populate('sender template')
        .sort({ createdAt: -1 })
        .limit(limit);
        
      return campaigns.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        subject: c.subject,
        recipients: c.recipients,
        status: c.status,
        sentCount: c.sentCount,
        failedCount: c.failedCount,
        openedCount: c.openedCount,
        sender: c.sender ? { id: c.sender._id.toString(), email: c.sender.email } : null,
        template: c.template ? { id: c.template._id.toString(), name: c.template.name } : null,
        createdAt: c.createdAt?.toISOString(),
        updatedAt: c.updatedAt?.toISOString(),
      }));
    },
    paginatedCampaigns: async (_: any, { page = 1, limit = 10, status = 'all' }: { page?: number, limit?: number, status?: string }, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const query: any = { userId: context.user.id };
      if (status !== 'all') {
        query.status = status;
      }
      
      const skip = (page - 1) * limit;
      
      const [campaigns, total] = await Promise.all([
        Campaign.find(query)
          .populate('sender template')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Campaign.countDocuments(query)
      ]);
      
      const mappedCampaigns = campaigns.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        subject: c.subject,
        recipients: c.recipients,
        status: c.status,
        sentCount: c.sentCount,
        failedCount: c.failedCount,
        openedCount: c.openedCount,
        sender: c.sender ? { id: c.sender._id.toString(), email: c.sender.email } : null,
        template: c.template ? { id: c.template._id.toString(), name: c.template.name } : null,
        createdAt: c.createdAt?.toISOString(),
        updatedAt: c.updatedAt?.toISOString(),
      }));

      return {
        campaigns: mappedCampaigns,
        totalPages: Math.ceil(total / limit)
      };
    },
    campaign: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const campaign = await Campaign.findOne({ _id: id, userId: context.user.id })
        .populate('sender template');
        
      if (!campaign) return null;
      
      return {
        id: campaign._id.toString(),
        name: campaign.name,
        subject: campaign.subject,
        recipients: campaign.recipients,
        status: campaign.status,
        sentCount: campaign.sentCount,
        failedCount: campaign.failedCount,
        openedCount: campaign.openedCount,
        sender: campaign.sender ? { id: (campaign.sender as any)._id.toString(), email: (campaign.sender as any).email } : null,
        template: campaign.template ? { id: (campaign.template as any)._id.toString(), name: (campaign.template as any).name } : null,
        createdAt: campaign.createdAt?.toISOString(),
        updatedAt: campaign.updatedAt?.toISOString(),
        variables: (campaign as any).variables,
      };
    },
  },
};
