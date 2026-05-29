import { AnalyticsService } from './analytics.service';
import { AnalyticsEvent } from './analytics.model';
import { GraphQLContext } from '../../shared/graphql/context';
import { GraphQLError } from 'graphql';

export const analyticsResolvers = {
  Query: {
    dashboardStats: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      return await AnalyticsService.getStats(undefined, context.user.id);
    },
    campaignStats: async (_: any, { campaignId }: { campaignId: string }, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      return await AnalyticsService.getStats(campaignId, context.user.id);
    },
    campaignEvents: async (_: any, { campaignId }: { campaignId: string }, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      const events = await AnalyticsEvent.find({ campaignId })
        .sort({ timestamp: -1 })
        .limit(100);
      return events.map((e: any) => ({
        id: e._id.toString(),
        recipientEmail: e.recipientEmail,
        type: e.type,
        error: e.error,
        createdAt: e.timestamp?.toISOString(),
      }));
    },
  },
};
