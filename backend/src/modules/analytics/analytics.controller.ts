import { Request, Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const getStats = asyncHandler(async (req: any, res: Response) => {
  const { campaignId } = req.query;
  const stats = await AnalyticsService.getStats(campaignId as string, req.user.id);
  res.status(200).json({
    success: true,
    data: stats,
  });
});

export const getEvents = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId } = req.params;
  const events = await AnalyticsService.getEvents(campaignId as string);
  res.status(200).json({
    success: true,
    data: events,
  });
});

export const trackOpen = asyncHandler(async (req: Request, res: Response) => {
  const { campaignId, recipientEmail } = req.params;
  
  // Record the open event
  await AnalyticsService.recordEvent({
    campaignId: campaignId as string,
    recipientEmail: recipientEmail as string,
    type: 'opened'
  });

  // Also update the campaign's openedCount
  const { Campaign } = await import('../campaigns/campaign.model');
  await Campaign.findByIdAndUpdate(campaignId, { $inc: { openedCount: 1 } });

  // Return a transparent 1x1 pixel GIF
  const pixel = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );
  
  res.set({
    'Content-Type': 'image/gif',
    'Content-Length': pixel.length,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
  
  res.status(200).send(pixel);
});
