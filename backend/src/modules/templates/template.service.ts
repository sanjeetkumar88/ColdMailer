import { Template, ITemplate } from './template.model';

export class TemplateService {
  static async createTemplate(data: Partial<ITemplate>) {
    return await Template.create(data);
  }

  static async getTemplates() {
    return await Template.find();
  }

  static async getTemplateById(id: string) {
    return await Template.findById(id);
  }
}
