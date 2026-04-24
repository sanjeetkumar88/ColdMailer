import { IEmailProvider } from './provider.interface';
import { ISender } from '../modules/senders/sender.model';
import { GmailProvider } from './gmail.provider';

class MockProvider implements IEmailProvider {
  async sendEmail(options: any): Promise<void> {
    console.log(`[MockProvider] Sending email to ${options.to}`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export const getProvider = (sender: ISender): IEmailProvider => {
  if (sender.provider === 'gmail') {
    return new GmailProvider(sender);
  }
  return new MockProvider();
};
