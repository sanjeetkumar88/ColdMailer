import { Schema, model, Document, Types } from 'mongoose';

export interface ITemplateVersion {
  versionNumber: number;
  html: string;
  mjml?: string;
  text?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

export interface ITemplate extends Document {
  name: string;
  subject: string;
  html: string;
  text?: string;
  variables: string[]; // List of required variables like {{name}}
  userId: Types.ObjectId;
  versions: ITemplateVersion[];
  currentVersion: number;
  createdAt: Date;
  updatedAt: Date;
}

const templateVersionSchema = new Schema<ITemplateVersion>(
  {
    versionNumber: { type: Number, required: true },
    html: { type: String, required: true },
    mjml: { type: String },
    text: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const templateSchema = new Schema<ITemplate>(
  {
    name: { type: String, required: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    text: { type: String },
    variables: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    versions: [templateVersionSchema],
    currentVersion: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const Template = model<ITemplate>('Template', templateSchema);
