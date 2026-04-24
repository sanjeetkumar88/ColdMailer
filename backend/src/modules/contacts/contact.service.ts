import { Contact, IContact } from './contact.model';

export class ContactService {
  static async createContact(data: Partial<IContact>) {
    return await Contact.create(data);
  }

  static async getContacts() {
    return await Contact.find();
  }

  static async getContactByEmail(email: string) {
    return await Contact.findOne({ email });
  }

  static async bulkCreate(contacts: Partial<IContact>[]) {
    return await Contact.insertMany(contacts, { ordered: false });
  }
}
