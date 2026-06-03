import Handlebars from 'handlebars';
import mjml2html from 'mjml';

export const renderTemplate = (template: { html: string; text?: string; subject: string }, variables: Record<string, any>) => {
  const subjectTemplate = Handlebars.compile(template.subject);
  
  // Wrap raw HTML in MJML boilerplate for cross-client compatibility
  const mjmlMarkup = `
<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Arial, Helvetica, sans-serif" />
    </mj-attributes>
  </mj-head>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text font-size="16px" color="#333333" line-height="1.6">
          ${template.html}
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
`;

  // Compile MJML to HTML
  const mjmlResult = mjml2html(mjmlMarkup, {
    validationLevel: 'soft', // ignore minor HTML errors inside mj-text
  });

  if (mjmlResult.errors.length > 0) {
    console.warn('[TemplateEngine] MJML Compilation Warnings:', mjmlResult.errors);
  }

  // Compile with Handlebars to inject dynamic variables like {{name}}
  const htmlTemplate = Handlebars.compile(mjmlResult.html);
  const textTemplate = template.text ? Handlebars.compile(template.text) : null;

  return {
    subject: subjectTemplate(variables),
    html: htmlTemplate(variables),
    text: textTemplate ? textTemplate(variables) : undefined,
  };
};
