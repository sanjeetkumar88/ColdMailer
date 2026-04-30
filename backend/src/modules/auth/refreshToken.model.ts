import { Schema, model, Document, Types } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<IRefreshToken>('RefreshToken', refreshTokenSchema);
