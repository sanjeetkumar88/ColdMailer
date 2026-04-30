import { Sender, ISender } from './sender.model';
import { encrypt, decrypt } from '../../shared/utils/encrypt';

export class SenderService {
  static async createSender(data: Partial<ISender>) {
    if (data.credentials) {
      // Encrypt sensitive fields
      const creds = data.credentials as any;
      if (creds.pass) creds.pass = encrypt(creds.pass);
      if (creds.apiKey) creds.apiKey = encrypt(creds.apiKey);
      if (creds.refreshToken) creds.refreshToken = encrypt(creds.refreshToken);
    }
    return await Sender.create(data);
  }

  static async getSenders(userId: string) {
    return await Sender.find({ userId } as any);
  }

  static async getSenderById(id: string, userId: string) {
    const sender = await Sender.findOne({ _id: id, userId } as any);
    if (sender && sender.credentials) {
      // Decrypt for internal use if needed, but usually we do it in the worker
    }
    return sender;
  }

  static async deleteSender(id: string, userId: string) {
    return await Sender.findOneAndDelete({ _id: id, userId } as any);
  }
}
