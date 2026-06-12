import { Schema, model, Document, Types } from 'mongoose';

export interface IInboxMessage extends Document {
  senderId: Types.ObjectId;
  gmailMessageId: string;
  threadId: string;
  historyId?: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    email: string;
  };
  snippet?: string;
  body?: string;
  receivedAt: Date;
  isRead: boolean;
  labels: string[];
  threadState?: {
    hasUnread: boolean;
    lastMessageAt: Date;
    participantEmails: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const inboxMessageSchema = new Schema<IInboxMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'Sender', required: true },
    gmailMessageId: { type: String, required: true },
    threadId: { type: String, required: true },
    historyId: { type: String },
    subject: { type: String, default: '' },
    from: {
      name: { type: String, default: '' },
      email: { type: String, required: true }
    },
    to: {
      email: { type: String, required: true }
    },
    snippet: { type: String, default: '' },
    body: { type: String, default: '' },
    receivedAt: { type: Date, required: true },
    isRead: { type: Boolean, default: false },
    labels: { type: [String], default: [] },
    threadState: {
      hasUnread: { type: Boolean, default: false },
      lastMessageAt: { type: Date },
      participantEmails: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

// Indexes for high performance querying
inboxMessageSchema.index({ senderId: 1, gmailMessageId: 1 }, { unique: true });
inboxMessageSchema.index({ senderId: 1, receivedAt: -1 });
inboxMessageSchema.index({ threadId: 1 });

export const InboxMessage = model<IInboxMessage>('InboxMessage', inboxMessageSchema);
