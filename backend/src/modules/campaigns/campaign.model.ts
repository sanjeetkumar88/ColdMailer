import { Schema, model, Document, Types } from 'mongoose';

export interface ICampaign extends Document {
  name: string;
  sender: Types.ObjectId;
  template: Types.ObjectId;
  recipients: string[];
  attachments?: string[]; // URLs or paths to files
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'paused' | 'failed';
  variables?: Record<string, string>; // Global variables for the campaign
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'Sender', required: true },
    template: { type: Schema.Types.ObjectId, ref: 'Template', required: true },
    recipients: [{ type: String }],
    attachments: [{ type: String }],
    status: { 
      type: String, 
      enum: ['draft', 'scheduled', 'processing', 'completed', 'paused', 'failed'],
      default: 'draft'
    },
    variables: { type: Map, of: String },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

export const Campaign = model<ICampaign>('Campaign', campaignSchema);
