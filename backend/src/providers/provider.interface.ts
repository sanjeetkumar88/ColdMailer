export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: any[];
}

export interface IEmailProvider {
  sendEmail(options: EmailOptions): Promise<void>;
}
