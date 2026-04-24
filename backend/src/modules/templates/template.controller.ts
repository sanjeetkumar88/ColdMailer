import { Request, Response } from 'express';
import { TemplateService } from './template.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const template = await TemplateService.createTemplate(req.body);
  res.status(201).json({ success: true, data: template });
});

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const templates = await TemplateService.getTemplates();
  res.status(200).json({ success: true, data: templates });
});
