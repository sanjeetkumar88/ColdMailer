import { Request, Response } from 'express';
import { SenderService } from './sender.service';
import nodemailer from 'nodemailer';
import { encrypt } from '../../shared/utils/encryption';
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

export const createSmtpSender = asyncHandler(async (req: any, res: Response) => {
  const { name, email, host, port, user, pass, replyTo, dailyLimit } = req.body;

  if (!name || !email || !host || !port || !user || !pass) {
    res.status(400);
    throw new Error('All fields are required for SMTP setup');
  }

  // Test the connection
  const transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.verify();
  } catch (error: any) {
    res.status(400);
    // Provide better error messages for common auth failures
    if (error.response && error.response.includes('535')) {
      throw new Error(`Authentication failed: Please ensure you are using an App Password or correct OAuth method, not your regular login password. Details: ${error.message}`);
    }
    throw new Error(`SMTP connection failed: ${error.message}`);
  }

  // Encrypt password before saving
  const encrypted = encrypt(pass);

  const sender = await SenderService.createSender({
    name,
    email,
    replyTo: replyTo || undefined,
    dailyLimit: dailyLimit ? Number(dailyLimit) : 500,
    provider: 'smtp',
    credentials: { 
      host, 
      port: Number(port), 
      user, 
      encryptedPassword: encrypted.content,
      iv: encrypted.iv,
      authTag: encrypted.authTag
    },
    userId: req.user.id,
    isActive: true,
  });

  const senderObj = (sender as any).toObject();
  delete senderObj.credentials;

  res.status(201).json({
    success: true,
    data: senderObj,
  });
});
