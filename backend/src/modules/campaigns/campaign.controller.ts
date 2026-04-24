import { Request, Response } from 'express';
import { CampaignService } from './campaign.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await CampaignService.createCampaign(req.body);
  res.status(201).json({
    success: true,
    data: campaign,
  });
});

export const launchCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = await CampaignService.launchCampaign(id as string);
  res.status(200).json({
    success: true,
    message: 'Campaign launched successfully',
    data: campaign,
  });
});

export const getCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const campaigns = await CampaignService.getCampaigns();
  res.status(200).json({
    success: true,
    data: campaigns,
  });
});
