import { Media } from './media.model';
import { GraphQLContext } from '../../shared/graphql/context';
import { GraphQLError } from 'graphql';

export const mediaResolvers = {
  Query: {
    mediaFiles: async (_: any, __: any, context: GraphQLContext) => {
      if (!context.user) throw new GraphQLError('You are not logged in. Please log in to get access.', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const files = await Media.find({ userId: context.user.id }).sort({ createdAt: -1 });
      return files.map((f: any) => ({
        id: f._id.toString(),
        originalName: f.originalName,
        size: f.size,
        url: f.url,
        createdAt: f.createdAt?.toISOString(),
      }));
    },
  },
};
