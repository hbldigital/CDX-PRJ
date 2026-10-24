/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Animated Newsletter & 10% Discount Voucher Subscription Ribbon
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Copy, Check, X, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NewsletterRibbonProps {
  onNavigate?: (view: string, params?: any) => void;
}

export const NewsletterRibbon: React.FC<NewsletterRibbonProps> = ({ onNavigate }) => {
  const { applyCoupon } = useCart();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribedCoupon, setSubscribedCoupon] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success && data.couponCode) {
        setSubscribedCoupon(data.couponCode);
        applyCoupon(data.couponCode); // Automatically apply to their active cart!
      } else {
        setErrorMsg(data.error || 'Subscription failed.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error.');
    }
  };

  const handleCopy = () => {
    if (!subscribedCoupon) return;
    navigator.clipboard.writeText(subscribedCoupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 text-white text-xs py-2 px-4 shadow-sm relative overflow-hidden">
      {/* Decorative pulse glow */}
      <div className="absolute -top-10 left-1/4 w-40 h-20 bg-cyan-400/20 blur-xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Animated Badge & Message */}
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
          </span>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span className="font-extrabold uppercase tracking-wider text-[11px] bg-white/15 px-2 py-0.5 rounded-full">
              Special Gift
            </span>
            <span className="font-bold text-white text-xs sm:text-sm">
              Subscribe to our mailing list & get an instant 10% discount voucher!
            </span>
          </div>
        </div>

        {/* Right: Inline Subscription Box or Success Voucher Display */}
        {subscribedCoupon ? (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="text-white text-xs">Voucher Code:</span>
            <span className="font-mono font-black text-cyan-200 bg-black/30 px-2 py-0.5 rounded">
              {subscribedCoupon}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('cart')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg text-[11px]"
              >
                Go to Cart
              </button>
            )}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-white/60 hover:text-white p-1 ml-1"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto justify-center">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-1.5 bg-white/15 hover:bg-white/20 text-white placeholder-white/70 rounded-xl border border-white/25 focus:outline-hidden focus:bg-white/25 text-xs font-medium w-52 sm:w-64"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md shrink-0 flex items-center gap-1.5"
            >
              <span>{loading ? 'Sending...' : 'Claim 10% Off'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="text-white/60 hover:text-white p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
      {errorMsg && (
        <div className="text-center text-[10px] text-red-200 mt-1">{errorMsg}</div>
      )}
    </div>
  );
};
