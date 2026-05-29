import nodemailer from 'nodemailer';
import { IEmailProvider } from './provider.interface';
import { ISender } from '../modules/senders/sender.model';

export class SmtpProvider implements IEmailProvider {
  private transporter: nodemailer.Transporter;

  constructor(private sender: ISender) {
    if (!sender.credentials) {
      throw new Error('SMTP credentials are required');
    }

    const { host, port, user, pass } = sender.credentials;
    
    if (!host || !port || !user || !pass) {
      throw new Error('Incomplete SMTP credentials');
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
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
      // You could also map replyTo, headers, etc. if provided in options
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error: any) {
      console.error(`[SmtpProvider] Failed to send email to ${options.to}:`, error);
      throw error;
    }
  }
}
