import { Template, ITemplate } from './template.model';

export class TemplateService {
  static async createTemplate(data: Partial<ITemplate>) {
    return await Template.create(data);
  }

  static async getTemplates(userId: string) {
    return await Template.find({ userId });
  }

  static async getTemplateById(id: string, userId: string) {
    return await Template.findOne({ _id: id, userId });
  }

  static async updateTemplate(id: string, userId: string, data: Partial<ITemplate>) {
    return await Template.findOneAndUpdate({ _id: id, userId }, data, { new: true });
  }

  static async deleteTemplate(id: string, userId: string) {
    return await Template.findOneAndDelete({ _id: id, userId });
  }
}
