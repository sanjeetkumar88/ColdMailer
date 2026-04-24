import { google } from 'googleapis';
import { env } from '../../config/env';
import { SenderService } from './sender.service';
import { encrypt } from '../../shared/utils/encrypt';

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export class SenderAuthService {
  static getAuthUrl(state?: string) {
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state,
    });
  }

  static async handleCallback(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: profile } = await oauth2.userinfo.get();

    if (!profile.email) throw new Error('Could not retrieve email from Google');

    // Save or update sender
    const senderData = {
      name: profile.name || profile.email,
      email: profile.email,
      provider: 'gmail' as const,
      credentials: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
      },
      isActive: true,
    };

    // Note: SenderService.createSender already handles encryption if we pass credentials
    return await SenderService.createSender(senderData);
  }
}
