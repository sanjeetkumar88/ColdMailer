import { registerAnalyticsListener } from './analytics.listener';
import { registerLogListener } from './log.listener';

export const registerAllListeners = () => {
  registerAnalyticsListener();
  registerLogListener();
  // registerWebhookListener();
};
