import { Request, Response } from 'express';
import { ContactListService } from './contact-list.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const createList = asyncHandler(async (req: any, res: Response) => {
  const list = await ContactListService.createList(req.user.id, req.body);
  res.status(201).json({ success: true, data: list });
});

export const getLists = asyncHandler(async (req: any, res: Response) => {
  const lists = await ContactListService.getLists(req.user.id);
  res.status(200).json({ success: true, data: lists });
});

export const getListById = asyncHandler(async (req: any, res: Response) => {
  const list = await ContactListService.getListById(req.params.id, req.user.id);
  if (!list) {
    return res.status(404).json({ success: false, message: 'List not found' });
  }
  res.status(200).json({ success: true, data: list });
});

export const updateList = asyncHandler(async (req: any, res: Response) => {
  const list = await ContactListService.updateList(req.params.id, req.user.id, req.body);
  if (!list) {
    return res.status(404).json({ success: false, message: 'List not found' });
  }
  res.status(200).json({ success: true, data: list });
});

export const deleteList = asyncHandler(async (req: any, res: Response) => {
  const list = await ContactListService.deleteList(req.params.id, req.user.id);
  if (!list) {
    return res.status(404).json({ success: false, message: 'List not found' });
  }
  res.status(200).json({ success: true, data: {} });
});
