import { Schema, model, Document, Types } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[]; // List of required variables like {{name}}
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    text: { type: String },
    variables: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', templateSchema);
