import { Sender, ISender } from './sender.model';
import { encrypt, decrypt } from '../../shared/utils/encrypt';

export class SenderService {
  static async createSender(data: Partial<ISender>) {
    if (data.credentials) {
      // Encrypt sensitive fields
      const creds = data.credentials as any;
      if (creds.pass) creds.pass = encrypt(creds.pass);
      if (creds.apiKey) creds.apiKey = encrypt(creds.apiKey);
    }
    return await Sender.create(data);
  }

  static async getSenders() {
    return await Sender.find();
  }

  static async getSenderById(id: string) {
    const sender = await Sender.findById(id);
    if (sender && sender.credentials) {
      // Decrypt for internal use if needed, but usually we do it in the worker
    }
    return sender;
  }
}
