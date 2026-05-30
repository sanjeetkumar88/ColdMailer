import { Request, Response } from 'express';
import { CampaignService } from './campaign.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { TemplateService } from '../templates/template.service';

export const createCampaign = asyncHandler(async (req: any, res: Response) => {
  let templateId = req.body.template;

  // If no template is provided, but we have subject and html, create an ad-hoc template
  if (!templateId && req.body.subject && req.body.html) {
    const adhocTemplate = await TemplateService.createTemplate({
      name: `Ad-hoc Template for ${req.body.name}`,
      subject: req.body.subject,
      html: req.body.html,
      text: req.body.html.replace(/<[^>]*>?/gm, ''), // Basic html to text fallback
      userId: req.user.id
    });
    templateId = adhocTemplate._id;
  }

  if (!templateId) {
    return res.status(400).json({ success: false, message: 'Template or Subject+HTML is required' });
  }

  const campaign = await CampaignService.createCampaign({ ...req.body, template: templateId, userId: req.user.id });
  res.status(201).json({
    success: true,
    data: campaign,
  });
});

export const launchCampaign = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const campaign = await CampaignService.launchCampaign(id as string, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Campaign launched successfully',
    data: campaign,
  });
});

export const retryCampaign = asyncHandler(async (req: any, res: Response) => {
  const { emails } = req.body; // Support individual emails to retry
  
  let targetEmails: string[] = [];
  
  if (emails && Array.isArray(emails) && emails.length > 0) {
    targetEmails = emails;
  } else {
    // Default: retry all failed
    const { AnalyticsEvent } = await import('../analytics/analytics.model');
    const failedEvents = await AnalyticsEvent.find({ 
      campaignId: req.params.id, 
      type: 'failed' 
    });
    targetEmails = [...new Set(failedEvents.map(e => e.recipientEmail))];
  }
  
  if (targetEmails.length === 0) {
    return res.status(400).json({ success: false, message: 'No emails to retry' });
  }

  const campaign = await CampaignService.launchCampaign(req.params.id, req.user.id, targetEmails);
  res.status(200).json({
    success: true,
    data: campaign,
    retryingCount: targetEmails.length
  });
});

export const deleteCampaign = asyncHandler(async (req: any, res: Response) => {
  await CampaignService.deleteCampaign(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Campaign deleted successfully',
  });
});

export const getCampaignById = asyncHandler(async (req: any, res: Response) => {
  const { id } = req.params;
  const campaign = await CampaignService.getCampaignById(id as string, req.user.id);
  if (!campaign) {
    return res.status(404).json({
      success: false,
      message: 'Campaign not found',
    });
  }
  res.status(200).json({
    success: true,
    data: campaign,
  });
});

export const getCampaigns = asyncHandler(async (req: any, res: Response) => {
  const result = await CampaignService.getCampaigns(req.user.id, req.query);
  res.status(200).json({
    success: true,
    ...result,
  });
});
