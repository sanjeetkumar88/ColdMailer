import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const setTokenCookies = (res: Response, accessToken: string, refreshToken?: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
  };

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
};
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.status(201).json({
    success: true,
    data: { user: result.user },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json({
    success: true,
    data: { user: result.user },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  const result = await AuthService.refreshAccessToken(token);
  setTokenCookies(res, result.accessToken);
  res.status(200).json({
    success: true,
    data: { message: 'Token refreshed' },
  });
});

export const googleSync = asyncHandler(async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const result = await AuthService.googleSync({ email, name });
  setTokenCookies(res, result.accessToken, result.refreshToken);
  res.status(200).json({
    success: true,
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
});

export const getProfile = asyncHandler(async (req: any, res: Response) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
