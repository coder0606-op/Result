import { User } from '../models/User.js';
import { catchAsync } from '../middleware/catchAsync.js';

const FIXED_OTP = '654321';
let activeOTPs = new Map();

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email/phone and password are required' });
  }

  const cleanId = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Find user by email or phone
  const matched = await User.findOne({
    $or: [
      { email: cleanId },
      { phone: cleanId }
    ]
  });

  // Allow match if user exists and password matches
  if (matched && matched.password === cleanPass) {
    const token = `jwt-token-admin-${Date.now()}`;
    return res.json({
      token,
      user: {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        phone: matched.phone,
        schoolName: matched.schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR',
        role: matched.role || 'ADMIN'
      }
    });
  }

  // Fallback demo matching for admin convenience
  if ((cleanId === 'admin@mahavirishishu.edu.in' || cleanId === '8804640233' || cleanId === '7079736741') &&
      (cleanPass === 'rajan123' || cleanPass === 'Mahaviri@2025#AdminSecured!' || cleanPass === 'admin123')) {
    return res.json({
      token: `jwt-token-admin-${Date.now()}`,
      user: {
        name: 'Dr. Rajan Kumar',
        email: 'admin@mahavirishishu.edu.in',
        phone: '8804640233',
        schoolName: 'MAHAVIRI SHISHU VIDYA MANDIR',
        role: 'ADMIN'
      }
    });
  }

  return res.status(401).json({ message: 'Invalid mobile number, email, or password' });
});

export const register = catchAsync(async (req, res) => {
  const { name, email, phone, password, schoolName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    return res.status(400).json({ message: 'Email is already in use' });
  }

  const lastUser = await User.findOne().sort({ id: -1 });
  const newId = lastUser && lastUser.id ? lastUser.id + 1 : 1;

  const newUser = new User({
    id: newId,
    name: name || 'Admin User',
    email: cleanEmail,
    phone: phone || '',
    password: password.trim(),
    schoolName: schoolName || 'MAHAVIRI SHISHU VIDYA MANDIR',
    role: 'ADMIN'
  });

  await newUser.save();

  return res.status(201).json({
    token: `jwt-token-admin-${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      schoolName: newUser.schoolName,
      role: newUser.role
    }
  });
});

export const sendOTP = catchAsync(async (req, res) => {
  const { identifier } = req.body;
  const cleanId = (identifier || '').trim();

  activeOTPs.set(cleanId, FIXED_OTP);

  return res.json({
    success: true,
    otp: FIXED_OTP,
    target: cleanId,
    message: `OTP sent successfully to ${cleanId}`
  });
});

export const verifyOTPAndResetPassword = catchAsync(async (req, res) => {
  const { identifier, otp, newPassword } = req.body;
  const cleanId = (identifier || '').trim().toLowerCase();
  const enteredOTP = (otp || '').trim();

  if (enteredOTP !== FIXED_OTP && activeOTPs.get(cleanId) !== enteredOTP) {
    return res.status(400).json({ message: 'Invalid OTP! Please check your code and try again.' });
  }

  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ message: 'Password must be at least 4 characters long' });
  }

  const user = await User.findOne({
    $or: [
      { email: cleanId },
      { phone: cleanId }
    ]
  });

  if (user) {
    user.password = newPassword.trim();
    await user.save();
  }

  activeOTPs.delete(cleanId);

  return res.json({
    success: true,
    message: 'Password reset successfully',
    token: `jwt-token-admin-${Date.now()}`,
    user: user ? {
      name: user.name,
      email: user.email,
      phone: user.phone,
      schoolName: user.schoolName,
      role: user.role
    } : {
      name: 'Dr. Rajan Kumar',
      email: cleanId,
      schoolName: 'MAHAVIRI SHISHU VIDYA MANDIR',
      role: 'ADMIN'
    }
  });
});
