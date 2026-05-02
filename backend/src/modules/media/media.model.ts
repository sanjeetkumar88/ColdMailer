import { Schema, model, Document, Types } from 'mongoose';

export interface IMedia extends Document {
  userId: Types.ObjectId;
  url: string;
  publicId: string;
  originalName: string;
  format: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    originalName: { type: String, required: true },
    format: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Media = model<IMedia>('Media', mediaSchema);
