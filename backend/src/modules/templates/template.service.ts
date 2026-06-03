import { Template, ITemplate, ITemplateVersion } from './template.model';

export class TemplateService {
  static async createTemplate(data: Partial<ITemplate>) {
    const version: Partial<ITemplateVersion> = {
      versionNumber: 1,
      html: data.html || '',
      text: data.text || '',
      createdBy: data.userId as any,
    };
    data.versions = [version as any];
    data.currentVersion = 1;
    return await Template.create(data);
  }

  static async getTemplates(userId: string) {
    return await Template.find({ userId });
  }

  static async getTemplateById(id: string, userId: string) {
    return await Template.findOne({ _id: id, userId });
  }

  static async updateTemplate(id: string, userId: string, data: Partial<ITemplate>) {
    const template = await Template.findOne({ _id: id, userId });
    if (!template) return null;

    const newVersionNumber = (template.currentVersion || 0) + 1;
    const version: Partial<ITemplateVersion> = {
      versionNumber: newVersionNumber,
      html: data.html !== undefined ? data.html : template.html,
      text: data.text !== undefined ? data.text : template.text,
      createdBy: userId as any,
    };

    template.versions.push(version as any);
    template.currentVersion = newVersionNumber;
    
    if (data.name !== undefined) template.name = data.name;
    if (data.subject !== undefined) template.subject = data.subject;
    if (data.html !== undefined) template.html = data.html;
    if (data.text !== undefined) template.text = data.text;
    if (data.variables !== undefined) template.variables = data.variables;

    return await template.save();
  }

  static async deleteTemplate(id: string, userId: string) {
    return await Template.findOneAndDelete({ _id: id, userId });
  }
}
