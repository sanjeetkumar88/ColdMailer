import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  originalName: { type: String, required: true },
  format: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

// Avoid re-compiling the model if it already exists
export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
