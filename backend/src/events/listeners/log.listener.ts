import { emitter } from '../emitter';
import { EmailEvent } from '../events.enum';

export const registerLogListener = () => {
  emitter.on(EmailEvent.FAILED, ({ campaignId, recipientEmail, error }) => {
    console.error(`❌ Email Failed: ${recipientEmail} (Campaign: ${campaignId}) - Error: ${error}`);
  });
};
