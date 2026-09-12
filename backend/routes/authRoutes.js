import { Router } from 'express';
import {
  login,
  register,
  sendOTP,
  verifyOTPAndResetPassword
} from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPAndResetPassword);

export default router;
