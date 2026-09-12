import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService, FIXED_OTP } from '../services/authService';
import { Smartphone, KeyRound, ArrowRight, AlertCircle, Eye, EyeOff, CheckCircle2, ShieldCheck, MessageSquare, RotateCcw, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Input states
  const [mobileNumber, setMobileNumber] = useState('8804640233');
  const [password, setPassword] = useState('rajan123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password / OTP States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Enter Mobile, 2: Enter OTP, 3: Set New Password
  const [resetMobile, setResetMobile] = useState('8804640233');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (resetStep === 2 && otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resetStep, otpTimer]);

  // Handle Standard Login (Mobile Number Only)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await authService.login(mobileNumber, password);
      login(result.user, result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please check your password.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Mobile Number
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!resetMobile || resetMobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authService.sendMobileOTP(resetMobile);
      setResetStep(2);
      setOtpTimer(30);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Entered OTP
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setError('');

    if (enteredOTP.trim() !== FIXED_OTP) {
      setError('Incorrect OTP! Please check your 6-digit code and try again.');
      return;
    }

    setResetStep(3);
  };

  // Step 3: Save New Password & Log In
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match! Please verify both fields.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.verifyOTPAndResetPassword(resetMobile, enteredOTP, newPassword);
      login(res.user, res.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body">
      
      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img
          src="/mahaviri_shishu_vidya_mandir_logo/screen.png"
          alt="School Crest"
          className="mx-auto h-16 w-16 object-contain rounded-xl bg-white p-1 border border-maroon/20 shadow-sm"
        />
        <h2 className="mt-4 font-heading text-2xl font-bold text-maroon">
          {isForgotPassword ? 'Reset Password via Mobile OTP' : 'School Management Login'}
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          {isForgotPassword 
            ? 'Verify mobile number with OTP to set a new password' 
            : 'Sign in using Mobile Number'}
        </p>
      </div>

      {/* Main Login / OTP Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-md border border-gray-200 rounded-2xl sm:px-8">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 font-bold rounded-lg text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!isForgotPassword ? (
            /* Standard Login Form (Phone Number Only) */
            <div className="space-y-5 text-xs">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Enter 10-digit mobile number (e.g. 8804640233)"
                      className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setResetStep(1);
                        setError('');
                        setResetMobile(mobileNumber || '8804640233');
                      }}
                      className="text-xs font-semibold text-maroon hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all flex items-center justify-center gap-2 shadow-sm text-xs mt-2"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* Forgot Password via Mobile OTP Flow */
            <div>
              {/* Step Progress Bar */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                <div className={`flex items-center gap-1.5 text-xs font-bold ${resetStep >= 1 ? 'text-maroon' : 'text-gray-400'}`}>
                  <span className="w-5 h-5 rounded-full bg-maroon/10 flex items-center justify-center text-[10px]">1</span>
                  <span>Enter Mobile</span>
                </div>
                <div className="h-[2px] w-6 bg-gray-200" />
                <div className={`flex items-center gap-1.5 text-xs font-bold ${resetStep >= 2 ? 'text-maroon' : 'text-gray-400'}`}>
                  <span className="w-5 h-5 rounded-full bg-maroon/10 flex items-center justify-center text-[10px]">2</span>
                  <span>Verify OTP</span>
                </div>
                <div className="h-[2px] w-6 bg-gray-200" />
                <div className={`flex items-center gap-1.5 text-xs font-bold ${resetStep >= 3 ? 'text-maroon' : 'text-gray-400'}`}>
                  <span className="w-5 h-5 rounded-full bg-maroon/10 flex items-center justify-center text-[10px]">3</span>
                  <span>New Pass</span>
                </div>
              </div>

              {/* STEP 1: Enter Mobile Number */}
              {resetStep === 1 && (
                <form onSubmit={handleSendOTP} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Registered Mobile Number</label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={resetMobile}
                        onChange={(e) => setResetMobile(e.target.value)}
                        placeholder="Enter 10-digit mobile number (e.g. 8804640233)"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{loading ? 'Sending OTP...' : 'Send OTP to Mobile'}</span>
                  </button>
                </form>
              )}

              {/* STEP 2: Enter & Verify OTP */}
              {resetStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4 text-xs">
                  {/* Sent SMS Alert */}
                  <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl space-y-1 text-center">
                    <p className="font-bold text-xs flex items-center justify-center gap-1.5 text-blue-900">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>SMS OTP Sent to +91 {resetMobile}</span>
                    </p>
                    <p className="text-[11px] text-blue-700">
                      Please enter the 6-digit OTP code sent to your registered mobile number.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-center">Enter 6-Digit OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={enteredOTP}
                      onChange={(e) => setEnteredOTP(e.target.value.replace(/\D/g, ''))}
                      placeholder="••••••"
                      className="w-full text-center tracking-widest text-lg font-bold py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon text-maroon"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-500">
                    <span>Resend code in: <strong className="text-maroon">{otpTimer}s</strong></span>
                    <button
                      type="button"
                      disabled={otpTimer > 0 || loading}
                      onClick={handleSendOTP}
                      className="font-bold text-maroon hover:underline disabled:text-gray-300 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resend OTP</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP Code</span>
                  </button>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {resetStep === 3 && (
                <form onSubmit={handleSaveNewPassword} className="space-y-4 text-xs">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Mobile number verified! Please set your new password below.</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-maroon focus:ring-1 focus:ring-maroon"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-maroon-dark transition-all flex items-center justify-center gap-2 shadow-sm text-xs"
                  >
                    <span>{loading ? 'Updating Password...' : 'Save Password & Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Back to Login Button */}
              <div className="text-center pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                  }}
                  className="text-xs font-semibold text-gray-600 hover:text-maroon hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Login;
