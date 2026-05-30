import nodemailer from 'nodemailer';
import { IEmailProvider } from './provider.interface';
import { ISender } from '../modules/senders/sender.model';
import { decrypt } from '../shared/utils/encryption';

export class SmtpProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(private sender: ISender) {
    if (!sender.credentials) {
      throw new Error('SMTP credentials are required');
    }

    const { host, port, user, pass, encryptedPassword, iv, authTag } = sender.credentials;
    
    if (!host || !port || !user) {
      throw new Error('Incomplete SMTP credentials');
    }

    let actualPass = pass;
    if (encryptedPassword && iv && authTag) {
      try {
        actualPass = decrypt({ content: encryptedPassword, iv, authTag });
      } catch (err) {
        throw new Error('Failed to decrypt SMTP password');
      }
    }

    if (!actualPass) {
      throw new Error('No SMTP password available');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass: actualPass,
      },
    });
  }

  async sendEmail(options: any): Promise<void> {
    const mailOptions = {
      from: `"${this.sender.name}" <${this.sender.email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: this.sender.replyTo || undefined,
      // You could also map headers, etc. if provided in options
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.error(`[SmtpProvider] Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }
}
