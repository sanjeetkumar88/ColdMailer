import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { IEmailProvider, EmailOptions } from './provider.interface';
import { ISender } from '../modules/senders/sender.model';
import { env } from '../config/env';
import { decrypt } from '../shared/utils/encrypt';

export class GmailProvider implements IEmailProvider {
  private oauth2Client: any;

  constructor(private sender: ISender) {
    this.oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    const refreshToken = sender.credentials.refreshToken 
      ? decrypt(sender.credentials.refreshToken) 
      : undefined;

    console.log(`[GmailProvider] Initialized for ${sender.email}. Refresh token present: ${!!refreshToken}`);
    if (refreshToken) {
      console.log(`[GmailProvider] Refresh token starts with: ${refreshToken.substring(0, 5)}...`);
    }

    this.oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    console.log(`[GmailProvider] Attempting to send via Gmail API for ${this.sender.email}`);
    const { token } = await this.oauth2Client.getAccessToken();
    
    if (!token) {
      console.error(`[GmailProvider] Failed to get access token for ${this.sender.email}`);
      throw new Error('Failed to refresh access token from Google');
    }

    const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

    // Construct the email in RFC 5322 format
    const utf8Subject = `=?utf-8?B?${Buffer.from(options.subject).toString('base64')}?=`;
    const messageParts = [
      `From: ${options.from}`,
      `To: ${options.to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      options.html || options.text || '',
    ];
    const message = messageParts.join('\n');

    // The body needs to be base64url encoded
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`[GmailProvider] Successfully sent email via Gmail API to ${options.to}`);
  }
}
