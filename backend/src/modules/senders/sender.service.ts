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

  static async upsertSender(data: Partial<ISender>) {
    if (data.credentials) {
      const creds = data.credentials as any;
      if (creds.pass) creds.pass = encrypt(creds.pass);
      if (creds.apiKey) creds.apiKey = encrypt(creds.apiKey);
      if (creds.refreshToken) creds.refreshToken = encrypt(creds.refreshToken);
    }
    
    // Find existing sender by email and userId, and update it. If it doesn't exist, create it.
    const sender = await Sender.findOneAndUpdate(
      { email: data.email, userId: data.userId } as any,
      { $set: data },
      { new: true, upsert: true }
    );
    return sender;
  }

  static async getSenders(userId: string) {
    return await Sender.find({ userId } as any).select('-credentials');
  }

  static async getSenderById(id: string, userId: string) {
    const sender = await Sender.findOne({ _id: id, userId } as any).select('-credentials');
    return sender;
  }

  static async deleteSender(id: string, userId: string) {
    return await Sender.findOneAndDelete({ _id: id, userId } as any);
  }
}
