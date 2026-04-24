import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { User } from '../../modules/auth/auth.model';
import { AppError } from '../errors/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in. Please log in to get access.', 401);
  }

  const decoded: any = jwt.verify(token, env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  req.user = currentUser;
  next();
});
