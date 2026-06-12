import { Request, Response } from 'express';
import { ContactService } from './contact.service';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import fs from 'fs';
import csv from 'csv-parser';
import { Contact } from './contact.model';
import dns from 'dns/promises';
import validator from 'validator';

async function hasMX(domain: string): Promise<boolean> {
  try {
    const records = await dns.resolveMx(domain);
    return records && records.length > 0;
  } catch (error) {
    return false;
  }
}

async function validateEmailAndMX(email: string): Promise<boolean> {
  if (!validator.isEmail(email)) return false;
  const domain = email.split('@')[1];
  if (!domain) return false;
  return await hasMX(domain);
}
export const createContact = asyncHandler(async (req: any, res: Response) => {
  const { email, name, tags, isActive, listId, ...metadata } = req.body;
  
  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  const domain = email.split('@')[1];
  const hasValidMX = await hasMX(domain);
  if (!hasValidMX) {
    res.status(400);
    throw new Error('Invalid email domain (no MX records found)');
  }

  const contact = await ContactService.createContact({ 
    email, 
    name, 
    tags, 
    isActive, 
    listId,
    metadata, 
    userId: req.user.id 
  });
  res.status(201).json({ success: true, data: contact });
});

export const getContacts = asyncHandler(async (req: any, res: Response) => {
  const listId = req.query.listId as string;
  const filter: any = { userId: req.user.id };
  if (listId) filter.listId = listId;

  const contacts = await ContactService.getContacts(filter);
  res.status(200).json({ success: true, data: contacts });
});

export const bulkUpload = asyncHandler(async (req: any, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const { listId, mappingConfig } = req.body;
  
  if (!listId) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ success: false, message: 'listId is required' });
  }

  const mapping = typeof mappingConfig === 'string' ? JSON.parse(mappingConfig) : mappingConfig || {};
  const contactsToInsert: any[] = [];
  const BATCH_SIZE = 1000;
  let insertedCount = 0;

  const processBatch = async (batch: any[]) => {
    if (batch.length > 0) {
      // Validate emails and MX records in parallel
      const validationResults = await Promise.all(
        batch.map(contact => validateEmailAndMX(contact.email))
      );
      
      const validBatch = batch.filter((_, index) => validationResults[index]);
      
      if (validBatch.length > 0) {
        await Contact.insertMany(validBatch, { ordered: false }).catch(err => {
          // Ignore duplicate key errors for emails
        });
        insertedCount += validBatch.length;
      }
    }
  };

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => {
      // Find which CSV headers map to email and name
      let emailCol = 'email';
      let nameCol = 'name';
      
      for (const [csvHeader, listColumn] of Object.entries(mapping)) {
        if (listColumn === 'email') emailCol = csvHeader;
        if (listColumn === 'name') nameCol = csvHeader;
      }
      
      if (!row[emailCol]) return; // Skip rows without email

      const contact: any = {
        email: row[emailCol].toLowerCase().trim(),
        name: row[nameCol] ? row[nameCol].trim() : '',
        listId,
        userId: req.user.id,
        metadata: {}
      };

      // Map other custom columns
      for (const [csvHeader, listColumn] of Object.entries(mapping)) {
        if (listColumn !== 'email' && listColumn !== 'name' && typeof listColumn === 'string') {
          contact.metadata[listColumn] = row[csvHeader] ? row[csvHeader].trim() : '';
        }
      }

      contactsToInsert.push(contact);
    })
    .on('end', async () => {
      // Process remaining in batches
      for (let i = 0; i < contactsToInsert.length; i += BATCH_SIZE) {
        await processBatch(contactsToInsert.slice(i, i + BATCH_SIZE));
      }
      
      // Cleanup file
      fs.unlinkSync(req.file.path);

      res.status(201).json({ success: true, count: insertedCount });
    })
    .on('error', (error) => {
      fs.unlinkSync(req.file.path);
      res.status(500).json({ success: false, message: 'Error processing CSV' });
    });
});

export const updateContact = asyncHandler(async (req: any, res: Response) => {
  const { email, name, tags, isActive, listId, ...metadata } = req.body;
  const contact = await ContactService.updateContact(req.params.id, req.user.id, {
    ...(email && { email }),
    ...(name !== undefined && { name }),
    ...(tags && { tags }),
    ...(isActive !== undefined && { isActive }),
    ...(listId !== undefined && { listId }),
    ...(Object.keys(metadata).length > 0 && { metadata })
  });
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  res.status(200).json({ success: true, data: contact });
});

export const deleteContact = asyncHandler(async (req: any, res: Response) => {
  const success = await ContactService.deleteContact(req.params.id, req.user.id);
  
  if (!success) {
    res.status(404);
    throw new Error('Contact not found');
  }
  
  res.status(200).json({ success: true, message: 'Contact removed' });
});
