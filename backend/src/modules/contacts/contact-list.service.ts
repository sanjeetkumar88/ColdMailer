import { ContactList, IContactList } from './contact-list.model';

export class ContactListService {
  static async createList(userId: string, data: Partial<IContactList>) {
    return await ContactList.create({ ...data, userId });
  }

  static async getLists(userId: string) {
    return await ContactList.find({ userId }).sort({ createdAt: -1 });
  }

  static async getListById(id: string, userId: string) {
    return await ContactList.findOne({ _id: id, userId });
  }

  static async updateList(id: string, userId: string, data: Partial<IContactList>) {
    return await ContactList.findOneAndUpdate(
      { _id: id, userId },
      { $set: data },
      { new: true }
    );
  }

  static async deleteList(id: string, userId: string) {
    return await ContactList.findOneAndDelete({ _id: id, userId });
  }
}
