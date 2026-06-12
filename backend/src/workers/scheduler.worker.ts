import { Sender } from '../modules/senders/sender.model';
import { addSyncJob } from '../queues/sync.queue';

let schedulerInterval: NodeJS.Timeout;

export const startGlobalScheduler = () => {
  console.log('🕒 Starting Global Scheduler (Sync) - Heartbeat every 1m');
  
  // Initial run delay slightly to let DB connect
  setTimeout(runScheduler, 5000);

  // Run every 1 minute
  schedulerInterval = setInterval(runScheduler, 60 * 1000);
};

const runScheduler = async () => {
  try {
    const now = new Date();
    // Find senders due for sync and NOT currently syncing
    const dueSenders = await Sender.find({
      isActive: true,
      provider: 'gmail',
      $and: [
        {
          $or: [
            { nextSyncAt: { $lte: now } },
            { nextSyncAt: { $exists: false } }
          ]
        },
        {
          $or: [
            { 'syncState.isSyncing': false },
            { 'syncState.isSyncing': { $exists: false } }
          ]
        }
      ]
    });

    for (const sender of dueSenders) {
      // Claim optimistic lock
      const lockedSender = await Sender.findOneAndUpdate(
        { _id: sender._id },
        { 
          $set: { 
            'syncState.isSyncing': true,
            nextSyncAt: new Date(Date.now() + 5 * 60 * 1000) // Next sync in 5 mins
          } 
        },
        { new: true }
      );

      if (lockedSender) {
        console.log(`[Scheduler] Enqueuing sync job for sender ${lockedSender.email}`);
        await addSyncJob(lockedSender._id.toString());
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error in global scheduler run:', error);
  }
};

export const stopGlobalScheduler = () => {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }
};
