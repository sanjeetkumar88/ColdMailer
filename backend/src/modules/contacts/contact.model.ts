import { Schema, model, Document, Types } from 'mongoose';

export interface IContact extends Document {
  email: string;
  name?: string;
  tags: string[];
  metadata: Record<string, any>;
  isActive: boolean;
  listId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    tags: [{ type: String }],
    metadata: { type: Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    listId: { type: Schema.Types.ObjectId, ref: 'ContactList', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Contact = model<IContact>('Contact', contactSchema);
