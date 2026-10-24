/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Official Authentication & Portal Access Page
 * Dedicated live working pages & buttons for Admin, Client, and Employee Login/Logout.
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Briefcase,
  User as UserIcon,
  Lock,
  Mail,
  ArrowRight,
  LogOut,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  Globe,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginPortalProps {
  initialRole?: 'admin' | 'client' | 'employee' | 'register';
  onNavigate: (view: string, params?: any) => void;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ initialRole = 'client', onNavigate }) => {
  const {
    user,
    isAuthenticated,
    isAdmin,
    isEmployee,
    login,
    register,
    logout,
    quickSwitchRole,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'admin' | 'client' | 'employee' | 'register' | 'forgot'>(
    initialRole === 'register' ? 'register' : initialRole
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCountry, setRegCountry] = useState('Pakistan');
  const [regPassword, setRegPassword] = useState('');

  // Sync initial tab when props change
  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole === 'register' ? 'register' : initialRole);
    }
  }, [initialRole]);

  // Set default demo credentials when tab changes
  useEffect(() => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (activeTab === 'admin') {
      setEmail('admin@codelix.online');
      setPassword('admin123');
    } else if (activeTab === 'employee') {
      setEmail('zubair@codelix.online');
      setPassword('employee123');
    } else if (activeTab === 'client') {
      setEmail('hamza.client@example.com');
      setPassword('client123');
    }
  }, [activeTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      setLoading(false);
      if (res.success) {
        setSuccessMsg('Authentication successful! Directing to your workspace...');
        setTimeout(() => {
          if (activeTab === 'admin') {
            onNavigate('admin-dashboard');
          } else if (activeTab === 'employee') {
            onNavigate('employee-dashboard');
          } else {
            onNavigate('customer-dashboard');
          }
        }, 600);
      } else {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error while logging in.');
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'employee' | 'customer') => {
    setLoading(true);
    await quickSwitchRole(role);
    setLoading(false);
    setSuccessMsg(`Logged in successfully as ${role.toUpperCase()}!`);
    setTimeout(() => {
      if (role === 'admin') onNavigate('admin-dashboard');
      else if (role === 'employee') onNavigate('employee-dashboard');
      else onNavigate('customer-dashboard');
    }, 400);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      country: regCountry,
      password: regPassword,
    });

    setLoading(false);
    if (res.success) {
      setSuccessMsg('Account created! Verification code has been sent. You can now log in.');
      setActiveTab('client');
      setEmail(regEmail);
      setPassword(regPassword);
    } else {
      setErrorMsg(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Lock className="w-3.5 h-3.5" />
            <span>CODELIX Secure Access Gateway</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Portal Authentication
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Select your portal to sign in, manage projects, or access the administrative CMS.
          </p>
        </div>

        {/* Current Authenticated Banner with Quick Logout */}
        {isAuthenticated && user && (
          <div className="mb-6 p-4 bg-white rounded-2xl border-2 border-cyan-500/30 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black flex items-center justify-center text-sm shadow-sm">
                {user.role === 'admin' ? 'A' : user.role === 'employee' ? 'E' : 'C'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300">
                    {user.role}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => onNavigate('admin-dashboard')}
                  className="flex-1 sm:flex-none px-3 py-2 bg-slate-900 text-cyan-300 hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Admin CMS
                </button>
              )}
              {isEmployee && (
                <button
                  type="button"
                  onClick={() => onNavigate('employee-dashboard')}
                  className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Workspace
                </button>
              )}
              {!isAdmin && !isEmployee && (
                <button
                  type="button"
                  onClick={() => onNavigate('customer-dashboard')}
                  className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold transition-colors"
                >
                  My Portal
                </button>
              )}

              {/* Direct Logout Button */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setSuccessMsg('You have been logged out safely.');
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
                title="Log Out of this session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs for Roles */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'client'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Client</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('employee')}
              className={`py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'employee'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Employee</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-cyan-300 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2.5 px-2 rounded-2xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Register</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Status alerts */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORMS (Client / Employee / Admin) */}
            {activeTab !== 'register' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {activeTab === 'admin'
                      ? 'Administrator CMS Access'
                      : activeTab === 'employee'
                      ? 'Employee Workspace Access'
                      : 'Client Customer Portal'}
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                    Secure HTTPS
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={
                        activeTab === 'admin'
                          ? 'admin@codelix.online'
                          : activeTab === 'employee'
                          ? 'zubair@codelix.online'
                          : 'client@example.com'
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('client@codelix.online');
                        alert('Password reset link sent to registered email.');
                      }}
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 ${
                    activeTab === 'admin'
                      ? 'bg-slate-900 hover:bg-slate-800'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600'
                  }`}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>
                        Sign In as {activeTab === 'admin' ? 'Administrator' : activeTab === 'employee' ? 'Employee' : 'Client'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 1-Click Demo Login Shortcuts */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700">1-Click Instant Login:</span>
                    <span className="text-[10px] text-slate-600">Pre-loaded active demo personas</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('customer')}
                      className={`p-2 rounded-xl border text-[11px] text-center font-bold transition-all ${
                        activeTab === 'client'
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Client Login
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('employee')}
                      className={`p-2 rounded-xl border text-[11px] text-center font-bold transition-all ${
                        activeTab === 'employee'
                          ? 'border-blue-300 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Employee Login
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin')}
                      className={`p-2 rounded-xl border text-[11px] text-center font-bold transition-all ${
                        activeTab === 'admin'
                          ? 'border-slate-900 bg-slate-900 text-cyan-300'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      Admin CMS Login
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  New Client Account Registration
                </span>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aaqib Hussain"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span>Creating Account...</span> : <span>Create Client Account</span>}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-[11px] text-slate-500 mt-2">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('client')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Sign In here
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
