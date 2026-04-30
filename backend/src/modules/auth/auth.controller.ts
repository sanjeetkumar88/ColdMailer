import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken: token } = req.body;
  const result = await AuthService.refreshAccessToken(token);
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const googleSync = asyncHandler(async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const result = await AuthService.googleSync({ email, name });
  res.status(200).json({
    success: true,
    data: result,
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
