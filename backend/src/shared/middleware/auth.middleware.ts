import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../modules/auth/auth.model';
import { AppError } from '../errors/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.cookies && (req.cookies.token || req.cookies.accessToken)) {
    token = req.cookies.token || req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    throw new AppError('You are not logged in. Please log in to get access.', 401);
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired. Please log in again.', 401);
    }
    throw new AppError('Invalid token. Please log in again.', 401);
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = currentUser;
  next();
});
