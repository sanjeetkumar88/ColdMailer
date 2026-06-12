import { Worker, Job } from 'bullmq';
import { ioredisClient } from '../cache/redis.client';
import { Sender } from '../modules/senders/sender.model';
import { InboxMessage } from '../modules/inbox/inbox-message.model';
import { google } from 'googleapis';
import { env } from '../config/env';
import { decrypt } from '../shared/utils/encrypt';
import pLimit from 'p-limit'; // Assuming we have it or will install it, otherwise we can chunk

const limit = pLimit(5); // Concurrency limit for messages.get()

export const syncWorker = new Worker(
  'sender-sync',
  async (job: Job) => {
    const { senderId } = job.data;
    console.log(`[Sync Worker] Starting sync for sender ${senderId} (Job: ${job.id})`);

    const sender = await Sender.findById(senderId);
    if (!sender || !sender.credentials || sender.provider !== 'gmail') {
      await releaseLock(senderId, 'failed');
      return;
    }

    try {
      const oauth2Client = new google.auth.OAuth2(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        access_token: decrypt(sender.credentials.accessToken!),
        refresh_token: decrypt(sender.credentials.refreshToken!),
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const currentHistoryId = sender.syncState?.historyId;

      if (!currentHistoryId) {
        // --- INITIAL SYNC ---
        console.log(`[Sync Worker] Performing Initial Sync for ${sender.email}`);
        
        // 1. Get exact current historyId from profile to prevent gap
        const profile = await gmail.users.getProfile({ userId: 'me' });
        const initialHistoryId = profile.data.historyId;

        // 2. Fetch last 7 days of inbox
        const listRes = await gmail.users.messages.list({
          userId: 'me',
          maxResults: 50,
          q: 'in:inbox newer_than:7d'
        });

        const messages = listRes.data.messages || [];
        await processMessages(gmail, messages, senderId);

        // 3. Save initialHistoryId
        await Sender.findByIdAndUpdate(senderId, {
          $set: {
            'syncState.historyId': initialHistoryId,
            'syncState.status': 'active'
          }
        });

      } else {
        // --- ONGOING SYNC ---
        console.log(`[Sync Worker] Performing Ongoing Sync for ${sender.email} from historyId ${currentHistoryId}`);
        
        try {
          const historyRes = await gmail.users.history.list({
            userId: 'me',
            startHistoryId: currentHistoryId
          });

          const historyRecords = historyRes.data.history || [];
          let latestHistoryId = historyRes.data.historyId || currentHistoryId;

          const messagesToFetch: { id: string, threadId: string }[] = [];

          for (const record of historyRecords) {
            if (record.messagesAdded) {
              for (const added of record.messagesAdded) {
                if (added.message && added.message.id) {
                  messagesToFetch.push({ id: added.message.id, threadId: added.message.threadId! });
                }
              }
            }
            // Could also handle labelsAdded (e.g. UNREAD changes) here
          }

          if (messagesToFetch.length > 0) {
            console.log(`[Sync Worker] Found ${messagesToFetch.length} new messages in history.`);
            await processMessages(gmail, messagesToFetch, senderId);
          } else {
            console.log(`[Sync Worker] No new messages for ${sender.email}.`);
          }

          // Update historyId
          await Sender.findByIdAndUpdate(senderId, {
            $set: {
              'syncState.historyId': latestHistoryId,
              'syncState.status': 'active'
            }
          });

        } catch (historyErr: any) {
          if (historyErr.code === 404 || historyErr.message?.includes('historyId is out of date')) {
            console.warn(`[Sync Worker] historyId expired for ${sender.email}, resetting to trigger Initial Sync next run.`);
            await Sender.findByIdAndUpdate(senderId, {
              $unset: { 'syncState.historyId': "" }
            });
          } else {
            throw historyErr;
          }
        }
      }

      await releaseLock(senderId, 'active');
      console.log(`[Sync Worker] Sync completed for ${sender.email}`);

    } catch (err) {
      console.error(`[Sync Worker] Sync failed for ${sender.email}:`, err);
      await releaseLock(senderId, 'failed');
    }
  },
  { connection: ioredisClient }
);

async function processMessages(gmail: any, messages: any[], senderId: string) {
  await Promise.all(
    messages.map(msg => limit(async () => {
      try {
        const msgData = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });

        const payload = msgData.data.payload;
        const headers = payload?.headers || [];
        const subjectHeader = headers.find((h: any) => h.name === 'Subject');
        const fromHeader = headers.find((h: any) => h.name === 'From');
        const toHeader = headers.find((h: any) => h.name === 'To');
        const dateHeader = headers.find((h: any) => h.name === 'Date');

        // Extract body
        let body = '';
        const getBody = (part: any): string => {
          if (!part) return '';
          if (part.mimeType === 'text/html' && part.body?.data) {
            return Buffer.from(part.body.data, 'base64url').toString('utf8');
          } else if (part.mimeType === 'text/plain' && part.body?.data) {
            return Buffer.from(part.body.data, 'base64url').toString('utf8');
          } else if (part.parts) {
            for (const p of part.parts) {
              const b = getBody(p);
              if (b) return b;
            }
          }
          return '';
        };

        if (payload?.body?.data) {
          body = Buffer.from(payload.body.data, 'base64url').toString('utf8');
        } else if (payload?.parts) {
          body = getBody(payload);
        }

        let fromName = fromHeader?.value || 'Unknown';
        let fromEmail = fromName;
        const fromMatch = fromName.match(/(.*)<(.*)>/);
        if (fromMatch) {
          fromName = fromMatch[1].replace(/"/g, '').trim();
          fromEmail = fromMatch[2].trim();
        }

        const receivedAt = dateHeader?.value ? new Date(dateHeader.value) : new Date();
        const isRead = !msgData.data.labelIds?.includes('UNREAD');

        await InboxMessage.findOneAndUpdate(
          { senderId, gmailMessageId: msg.id },
          {
            $set: {
              threadId: msgData.data.threadId,
              historyId: msgData.data.historyId,
              subject: subjectHeader?.value || '(No Subject)',
              from: { name: fromName, email: fromEmail },
              to: { email: toHeader?.value || '' },
              snippet: msgData.data.snippet,
              body: body,
              receivedAt,
              isRead,
              labels: msgData.data.labelIds || []
            }
          },
          { upsert: true }
        );
      } catch (err) {
        console.error(`[Sync Worker] Failed to fetch/save msg ${msg.id}`, err);
      }
    }))
  );
}

async function releaseLock(senderId: string, status: string) {
  await Sender.findByIdAndUpdate(senderId, {
    $set: {
      'syncState.isSyncing': false,
      'syncState.status': status
    }
  });
}

syncWorker.on('failed', (job, err) => {
  console.error(`[Sync Worker] Job ${job?.id} failed:`, err);
});
