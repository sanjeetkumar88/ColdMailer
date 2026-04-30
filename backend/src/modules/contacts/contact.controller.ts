import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';

export const createContact = asyncHandler(async (req: any, res: Response) => {
  const contact = await ContactService.createContact({ ...req.body, userId: req.user.id });
  res.status(201).json({ success: true, data: contact });
});

export const getContacts = asyncHandler(async (req: any, res: Response) => {
  const contacts = await ContactService.getContacts(req.user.id);
  res.status(200).json({ success: true, data: contacts });
});

export const bulkUpload = asyncHandler(async (req: any, res: Response) => {
  const contactsData = req.body.contacts.map((c: any) => ({ ...c, userId: req.user.id }));
  const contacts = await ContactService.bulkCreate(contactsData);
  res.status(201).json({ success: true, data: contacts });
});
