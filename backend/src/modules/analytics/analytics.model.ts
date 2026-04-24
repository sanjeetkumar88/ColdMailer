import { Schema, model, Document, Types } from 'mongoose';

export interface IAnalyticsEvent extends Document {
  campaignId: Types.ObjectId;
  recipientEmail: string;
  type: 'sent' | 'failed' | 'opened' | 'clicked' | 'bounced';
  error?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

const analyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    recipientEmail: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['sent', 'failed', 'opened', 'clicked', 'bounced'],
      required: true 
    },
    error: { type: String },
    metadata: { type: Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const AnalyticsEvent = model<IAnalyticsEvent>('AnalyticsEvent', analyticsEventSchema);
