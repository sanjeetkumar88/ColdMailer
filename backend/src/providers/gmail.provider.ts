import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { IEmailProvider, EmailOptions } from './provider.interface';
import { ISender } from '../modules/senders/sender.model';
import { env } from '../config/env';
import { decrypt } from '../shared/utils/encrypt';

export class GmailProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(sender: ISender) {
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    // Decrypt refresh token if it exists
    const refreshToken = sender.credentials.refreshToken 
      ? decrypt(sender.credentials.refreshToken) 
      : undefined;

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: sender.email,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        refreshToken: refreshToken,
      },
    } as nodemailer.TransportOptions);
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }
}
