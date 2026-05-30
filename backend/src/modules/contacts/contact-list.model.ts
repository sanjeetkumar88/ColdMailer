import { Schema, model, Document, Types } from 'mongoose';

export interface IContactList extends Document {
  name: string;
  columns: string[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contactListSchema = new Schema<IContactList>(
  {
    name: { type: String, required: true },
    columns: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const ContactList = model<IContactList>('ContactList', contactListSchema);
