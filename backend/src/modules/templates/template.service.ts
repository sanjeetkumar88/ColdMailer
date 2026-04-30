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
}
