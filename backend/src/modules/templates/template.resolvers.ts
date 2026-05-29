import { TemplateService } from './template.service';
import { GraphQLContext } from '../../shared/graphql/context';
import { GraphQLError } from 'graphql';

const checkAuth = (context: GraphQLContext) => {
  if (!context.user) {
    throw new GraphQLError('You are not logged in. Please log in to get access.', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
  return context.user;
};

export const templateResolvers = {
  Query: {
    templates: async (_: any, __: any, context: GraphQLContext) => {
      const user = checkAuth(context);
      return await TemplateService.getTemplates(user.id);
    },
    template: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = checkAuth(context);
      const template = await TemplateService.getTemplateById(id, user.id);
      if (!template) {
        throw new GraphQLError('Template not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return template;
    },
  },
  Mutation: {
    createTemplate: async (_: any, { input }: { input: any }, context: GraphQLContext) => {
      const user = checkAuth(context);
      return await TemplateService.createTemplate({ ...input, userId: user.id });
    },
    updateTemplate: async (_: any, { id, input }: { id: string; input: any }, context: GraphQLContext) => {
      const user = checkAuth(context);
      const template = await TemplateService.updateTemplate(id, user.id, input);
      if (!template) {
        throw new GraphQLError('Template not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return template;
    },
    deleteTemplate: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      const user = checkAuth(context);
      const template = await TemplateService.deleteTemplate(id, user.id);
      if (!template) {
        throw new GraphQLError('Template not found or unauthorized', {
          extensions: { code: 'NOT_FOUND' },
        });
      }
      return template;
    },
  },
  Template: {
    id: (parent: any) => parent._id.toString(),
  },
};
