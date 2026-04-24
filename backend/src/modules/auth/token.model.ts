import { Schema, model, Document, Types } from 'mongoose';

export interface IToken extends Document {
  user: Types.ObjectId;
  token: string;
  type: 'refresh' | 'reset' | 'verify';
  expiresAt: Date;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['refresh', 'reset', 'verify'], 
      required: true 
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Token = model<IToken>('Token', tokenSchema);
