import './campaign.worker';
import './email.worker';
import './health.worker';
import './sync.worker';
import { startGlobalScheduler } from './scheduler.worker';

console.log('👷 Workers initialized');
startGlobalScheduler();
