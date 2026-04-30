import { Schema, model, Document, Types } from 'mongoose';

export interface IContact extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  tags: string[];
  metadata: Record<string, any>;
  isActive: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    tags: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Contact = model<IContact>('Contact', contactSchema);
