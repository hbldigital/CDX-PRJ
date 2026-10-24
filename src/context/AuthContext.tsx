/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Authentication Context for CODELIX Platform
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployee: boolean;
  isCustomer: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; phone: string; country: string; password: string }) => Promise<{ success: boolean; simulatedCode?: string; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  quickSwitchRole: (role: 'customer' | 'employee' | 'admin') => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('cdx_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('cdx_token') || null;
  });

  useEffect(() => {
    // If no user is logged in, initialize with Hamza Khan (Customer) so the user can immediately experience the interactive portal
    if (!user) {
      quickSwitchRole('customer');
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('cdx_user', JSON.stringify(data.user));
      localStorage.setItem('cdx_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during login.' };
    }
  };

  const register = async (data: { name: string; email: string; phone: string; country: string; password: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'Registration failed.' };
      }
      return { success: true, simulatedCode: resData.simulatedCode };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error during registration.' };
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }
      if (user && user.email === email) {
        const updated = { ...user, isVerified: true };
        setUser(updated);
        localStorage.setItem('cdx_user', JSON.stringify(updated));
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification error.' };
    }
  };

  const quickSwitchRole = async (role: 'customer' | 'employee' | 'admin') => {
    try {
      const res = await fetch('/api/auth/quick-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('cdx_user', JSON.stringify(data.user));
        localStorage.setItem('cdx_token', data.token);
      }
    } catch (err) {
      console.error('Role quick switch failed:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cdx_user');
    localStorage.removeItem('cdx_token');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('cdx_user', JSON.stringify(updated));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isEmployee = user?.role === 'employee' || user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isEmployee,
        isCustomer,
        login,
        register,
        verifyEmail,
        quickSwitchRole,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
