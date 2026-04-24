import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const contact = await ContactService.createContact(req.body);
  res.status(201).json({ success: true, data: contact });
});

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await ContactService.getContacts();
  res.status(200).json({ success: true, data: contacts });
});

export const bulkUpload = asyncHandler(async (req: Request, res: Response) => {
  const contacts = await ContactService.bulkCreate(req.body.contacts);
  res.status(201).json({ success: true, data: contacts });
});
