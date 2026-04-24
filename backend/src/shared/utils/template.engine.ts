import Handlebars from 'handlebars';

export const renderTemplate = (template: { html: string; text?: string; subject: string }, variables: Record<string, any>) => {
  const htmlTemplate = Handlebars.compile(template.html);
  const textTemplate = template.text ? Handlebars.compile(template.text) : null;
  const subjectTemplate = Handlebars.compile(template.subject);

  return {
    subject: subjectTemplate(variables),
    html: htmlTemplate(variables),
    text: textTemplate ? textTemplate(variables) : undefined,
  };
};
