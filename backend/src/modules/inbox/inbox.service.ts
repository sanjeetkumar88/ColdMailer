import { SenderService } from '../senders/sender.service';
import { InboxMessage } from './inbox-message.model';

export class InboxService {
  static async getMessages(userId: string, page: number = 1, limit: number = 20) {
    const senders = await SenderService.getSendersWithCredentials(userId);
    const gmailSenders = senders.filter((s: any) => s.provider === 'gmail' && s.isActive);

    if (gmailSenders.length === 0) {
      return { messages: [], notConnected: true, hasAuthError: false, hasMore: false };
    }

    const senderIds = gmailSenders.map((s: any) => s._id);

    // Look for any sender that has syncState.status === 'failed' due to auth errors
    const hasAuthError = gmailSenders.some((s: any) => s.syncState?.status === 'failed');

    const threads = await InboxMessage.aggregate([
      // Match messages belonging to our active senders
      { $match: { senderId: { $in: senderIds } } },
      
      // Sort globally by date descending so the newest messages are processed first
      { $sort: { receivedAt: -1 } },
      
      // Group by threadId
      { 
        $group: {
          _id: '$threadId',
          latestMessage: { $first: '$$ROOT' }, // The newest message in the thread
          messages: { $push: '$$ROOT' }, // All messages in this thread
          hasUnread: { $max: { $cond: [{ $eq: ['$isRead', false] }, true, false] } },
          lastMessageAt: { $max: '$receivedAt' }
        } 
      },
      
      // Sort threads by the latest message date
      { $sort: { lastMessageAt: -1 } },
      
      // Pagination skip and limit
      { $skip: (page - 1) * limit },
      { $limit: limit },
      
      // Lookup the sender details (for receiverEmail)
      {
        $lookup: {
          from: 'senders',
          localField: 'latestMessage.senderId',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      { $unwind: '$senderInfo' }
    ]);

    const messages = threads.map(thread => ({
      id: thread.latestMessage.gmailMessageId,
      threadId: thread._id,
      senderAccountId: thread.senderInfo._id,
      receiverEmail: thread.senderInfo.email,
      sender: {
        name: thread.latestMessage.from.name,
        email: thread.latestMessage.from.email,
        avatar: ""
      },
      subject: thread.latestMessage.subject,
      snippet: thread.latestMessage.snippet,
      date: thread.lastMessageAt,
      isRead: !thread.hasUnread, // If it doesn't have unread, it is read
      sentiment: "neutral",
      thread: thread.messages.map((msg: any) => ({
        id: msg.gmailMessageId,
        subject: msg.subject,
        snippet: msg.snippet,
        body: msg.body,
        date: msg.receivedAt,
        from: msg.from,
        to: msg.to,
        isRead: msg.isRead
      }))
    }));

    return { messages, notConnected: false, hasAuthError, hasMore: messages.length === limit };
  }
}
