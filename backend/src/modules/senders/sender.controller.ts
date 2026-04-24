import { Request, Response } from 'express';
import { SenderService } from './sender.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const getSenders = asyncHandler(async (req: Request, res: Response) => {
  const senders = await SenderService.getSenders();
  res.status(200).json({
    success: true,
    data: senders,
  });
});

export const getSenderById = asyncHandler(async (req: Request, res: Response) => {
  const sender = await SenderService.getSenderById(req.params.id as string);
  res.status(200).json({
    success: true,
    data: sender,
  });
});
