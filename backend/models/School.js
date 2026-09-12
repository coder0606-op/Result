import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  schoolName: { type: String, required: true },
  schoolLogo: { type: String },
  secondLogo: { type: String },
  affiliationNumber: { type: String },
  address: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  principalName: { type: String },
  academicSession: { type: String }
}, { timestamps: true });

export const School = mongoose.model('School', schoolSchema);
