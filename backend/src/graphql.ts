import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { Express } from 'express';
import { templateTypeDefs } from './modules/templates/template.schema';
import { templateResolvers } from './modules/templates/template.resolvers';
import { analyticsTypeDefs } from './modules/analytics/analytics.schema';
import { analyticsResolvers } from './modules/analytics/analytics.resolvers';
import { campaignTypeDefs } from './modules/campaigns/campaign.schema';
import { campaignResolvers } from './modules/campaigns/campaign.resolvers';
import { mediaTypeDefs } from './modules/media/media.schema';
import { mediaResolvers } from './modules/media/media.resolvers';
import { context, GraphQLContext } from './shared/graphql/context';

export const typeDefs = [templateTypeDefs, analyticsTypeDefs, campaignTypeDefs, mediaTypeDefs];
export const resolvers = [templateResolvers, analyticsResolvers, campaignResolvers, mediaResolvers];

export const setupGraphQL = async (app: Express) => {
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use('/graphql', expressMiddleware(server, { context }));
  console.log('🚀 GraphQL Server ready at /graphql');
};
