import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../modules/auth/auth.model';
import { GraphQLError } from 'graphql';

export interface GraphQLContext {
  user?: any;
}

export const context = async ({ req }: { req: Request }): Promise<GraphQLContext> => {
  let token;
  
  // 1. Check cookies first
  if (req.cookies && (req.cookies.token || req.cookies.accessToken)) {
    token = req.cookies.token || req.cookies.accessToken;
  }
  // 2. Check Authorization header
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 3. Check query string
  else if (req.query?.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return {}; // Not authenticated
  }

  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new GraphQLError('User no longer exists', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    }

    return { user: currentUser };
  } catch (err: any) {
    throw new GraphQLError('Invalid or expired token', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }
};
