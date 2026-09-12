import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  password: { type: String, required: true },
  schoolName: { type: String, default: 'MAHAVIRI SHISHU VIDYA MANDIR' },
  role: { type: String, default: 'ADMIN' }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
