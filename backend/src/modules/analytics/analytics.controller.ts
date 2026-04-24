import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.query;
  const stats = await AnalyticsService.getStats(campaignId as string);
  res.status(200).json({
    success: true,
    data: stats,
  });
});
