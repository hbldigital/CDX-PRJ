/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Customer Registration, Login & Email Verification Modal
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Globe,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  RotateCcw,
} from 'lucide-react';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register' | 'verify';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { login, register, verifyEmail, quickSwitchRole } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'verify' | 'forgot'>(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Pakistan');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Verification state
  const [verifyTargetEmail, setVerifyTargetEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [simulatedCodeHelper, setSimulatedCodeHelper] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Status message
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await login(loginEmail, loginPass);
    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Login failed.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (regPass !== regConfirmPass) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!termsAgreed) {
      setErrorMsg('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      country: regCountry,
      password: regPass,
    });
    setLoading(false);

    if (res.success) {
      setVerifyTargetEmail(regEmail);
      if (res.simulatedCode) {
        setSimulatedCodeHelper(res.simulatedCode);
        setVerifyCode(res.simulatedCode); // pre-populate code for seamless user experience
      }
      setTab('verify');
      setSuccessMsg('Account created! Enter the 6-digit verification code sent to your email.');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const res = await verifyEmail(verifyTargetEmail, verifyCode);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Email successfully verified! Welcome to CODELIX.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setErrorMsg(res.error || 'Verification failed.');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setLoading(false);
      setForgotSent(true);
      setSuccessMsg(data.message);
    } catch {
      setLoading(false);
      setErrorMsg('Failed to process password recovery request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-b from-blue-50/50 to-white border-b border-slate-100 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tab === 'login' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Customer Login
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tab === 'register' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => {
              setTab('verify');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl transition-all ${
              tab === 'verify' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
            }`}
          >
            Verify Email
          </button>
        </div>

        {/* Notification Banners */}
        <div className="p-6 pb-2 space-y-3">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Tab 1: Customer Login */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 pt-2 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="client@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Assistant */}
            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700 block mb-1.5">Quick Evaluation Login:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('hamza.client@example.com');
                    setLoginPass('client123');
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-center font-medium text-slate-800"
                >
                  Client Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('zubair@codelix.online');
                    setLoginPass('employee123');
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-center font-medium text-slate-800"
                >
                  Employee Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@codelix.online');
                    setLoginPass('admin123');
                  }}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-center font-medium text-slate-800"
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Create Account */}
        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 pt-2 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Ullah"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="client@mail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+92 300 1234567"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
              <select
                value={regCountry}
                onChange={(e) => setRegCountry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Australia">Australia</option>
                <option value="Other">Other Country</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regConfirmPass}
                  onChange={(e) => setRegConfirmPass(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[11px] text-slate-600">
                I agree to the CODELIX Terms of Service, Refund Policy & Privacy Notice.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <span>Creating Account...</span> : <span>Register & Send Verification Code</span>}
            </button>
          </form>
        )}

        {/* Tab 3: Email Verification */}
        {tab === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="p-6 pt-2 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Email Verification</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit code dispatched to your registered address.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Email</label>
              <input
                type="email"
                required
                placeholder="client@mail.com"
                value={verifyTargetEmail}
                onChange={(e) => setVerifyTargetEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="w-full px-3 py-3 text-center tracking-[0.5em] font-mono text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            {simulatedCodeHelper && (
              <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-[11px] text-cyan-800 flex items-center justify-between">
                <span>Verification code logged: <strong>{simulatedCodeHelper}</strong></span>
                <button
                  type="button"
                  onClick={() => setVerifyCode(simulatedCodeHelper)}
                  className="font-bold underline text-blue-600"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <span>Verifying...</span> : <span>Verify & Activate Account</span>}
            </button>
          </form>
        )}

        {/* Tab 4: Forgot Password */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="p-6 pt-2 space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">Reset Your Password</h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter your account email to receive a secure one-time reset code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Account Email</label>
              <input
                type="email"
                required
                placeholder="client@mail.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? <span>Sending...</span> : <span>Send Reset Instructions</span>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
