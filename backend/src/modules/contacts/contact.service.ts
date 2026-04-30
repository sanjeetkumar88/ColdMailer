import { Contact, IContact } from './contact.model';

export class ContactService {
  static async createContact(data: Partial<IContact>) {
    return await Contact.create(data);
  }

  static async getContacts(userId: string) {
    return await Contact.find({ userId });
  }

  static async getContactByEmail(email: string, userId: string) {
    return await Contact.findOne({ email, userId });
  }

  static async bulkCreate(contacts: Partial<IContact>[]) {
    return await Contact.insertMany(contacts, { ordered: false });
  }
}
