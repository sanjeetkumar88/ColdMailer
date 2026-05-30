import { Contact, IContact } from './contact.model';

export class ContactService {
  static async createContact(data: Partial<IContact>) {
    return await Contact.create(data);
  }

  static async getContacts(filter: any) {
    return await Contact.find(filter).sort({ createdAt: -1 });
  }

  static async getContactByEmail(email: string, userId: string) {
    return await Contact.findOne({ email, userId });
  }

  static async bulkCreate(contacts: Partial<IContact>[]) {
    return await Contact.insertMany(contacts, { ordered: false });
  }

  static async updateContact(id: string, userId: string, data: Partial<IContact>) {
    return await Contact.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  static async deleteContact(id: string, userId: string) {
    const result = await Contact.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }
}
