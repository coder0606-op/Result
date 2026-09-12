import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true, uppercase: true },
  code: { type: String, required: true, uppercase: true }
}, { timestamps: true });

export const Subject = mongoose.model('Subject', subjectSchema);
