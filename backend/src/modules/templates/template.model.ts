import { Schema, model, Document } from 'mongoose';

export interface ITemplate extends Document {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[]; // List of required variables like {{name}}
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
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', templateSchema);
