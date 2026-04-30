import { Request, Response } from 'express';
import { SenderService } from './sender.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const getSenders = asyncHandler(async (req: any, res: Response) => {
  const senders = await SenderService.getSenders(req.user.id);
  res.status(200).json({
    success: true,
    data: senders,
  });
});

export const getSenderById = asyncHandler(async (req: any, res: Response) => {
  const sender = await SenderService.getSenderById(req.params.id as string, req.user.id);
  res.status(200).json({
    success: true,
    data: sender,
  });
});

export const deleteSender = asyncHandler(async (req: any, res: Response) => {
  await SenderService.deleteSender(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Sender disconnected successfully',
  });
});
