import { Schema, model, Document, Types } from 'mongoose';

export interface ISender extends Document {
  name: string;
  email: string;
  replyTo?: string;
  dailyLimit: number;
  provider: 'gmail' | 'ses' | 'sendgrid' | 'smtp';
  credentials: {
    apiKey?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    user?: string | null;
    pass?: string | null; // For legacy or unencrypted temporarily
    encryptedPassword?: string | null;
    iv?: string | null;
    authTag?: string | null;
    host?: string | null;
    port?: number | null;
    region?: string | null;
    expiryDate?: number | null;
  };
  userId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const senderSchema = new Schema<ISender>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    replyTo: { type: String },
    dailyLimit: { type: Number, default: 500 },
    provider: { 
      type: String, 
      required: true, 
      enum: ['gmail', 'ses', 'sendgrid', 'smtp'] 
    },
    credentials: {
      type: Schema.Types.Mixed,
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Sender = model<ISender>('Sender', senderSchema);
