/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Professional Footer for CODELIX Platform
 */

import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Send,
  CheckCircle2,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter Card */}
        <div className="bg-gradient-to-r from-blue-900/60 via-[#0F284E] to-cyan-900/40 rounded-3xl p-6 sm:p-10 border border-cyan-500/20 mb-16 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <span className="text-cyan-400 font-extrabold text-xs tracking-widest uppercase">
                Stay Ahead in Tech
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Subscribe to CODELIX Tech Insights & Promotional Deals
              </h3>
              <p className="text-sm text-slate-300 mt-2">
                Receive exclusive development package discounts, technology architecture guides, and e-commerce growth strategies directly in your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you for subscribing! Check your email for special welcome offers.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your business email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/15 focus:outline-hidden focus:border-cyan-400 text-sm"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-900 font-bold rounded-xl text-sm transition-all shrink-0 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
              <div className="text-[11px] text-slate-600 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" light={true} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CODELIX is your trusted digital engineering partner. From high-converting e-commerce stores and corporate websites to custom PHP enterprise portals, we turn ideas into resilient software at competitive prices.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <a href="tel:+19029030717" className="hover:text-white font-bold font-mono">
                  +1 902 903 0717
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-cyan-400" />
                <a href="mailto:contact@codelix.online" className="hover:text-white font-mono">
                  contact@codelix.online
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM (PKT / EST Support)</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://instagram.com/codelixhq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/codelixhq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-black flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@codelixhq"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-cyan-500 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all shadow-md"
                aria-label="TikTok"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/codelix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-[#0077B5] flex items-center justify-center text-slate-300 hover:text-white transition-all shadow-md"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'PHP Development' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  PHP Development (OOP & MVC)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'Shopify' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Shopify Store Setup & Themes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'WordPress' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  WordPress Websites & Redesigns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'WooCommerce' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  WooCommerce Online Stores
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'Custom Software' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Custom Software & Portals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services', { category: 'HTML, CSS & JavaScript' })}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  HTML5, CSS3 & Responsive UI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('offers')}
                  className="text-cyan-400 font-bold hover:underline transition-colors text-left"
                >
                  Promotional Launch Offers →
                </button>
              </li>
            </ul>
          </div>

          {/* Quick & Support Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Client & Inquiries
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('contact', { tab: 'quote' })} className="hover:text-cyan-400 transition-colors">
                  Get a Free Quotation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact', { tab: 'demo' })} className="hover:text-cyan-400 transition-colors">
                  Request a Software Demo
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact', { tab: 'questions' })} className="hover:text-cyan-400 transition-colors">
                  Ask Technical Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact', { tab: 'ideas' })} className="hover:text-cyan-400 transition-colors">
                  Share Your Project Idea
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customer-dashboard', { tab: 'complaints' })} className="hover:text-cyan-400 transition-colors">
                  Submit or Track Complaint
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track-application')} className="hover:text-cyan-400 transition-colors">
                  Track Job Application Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('careers')} className="hover:text-cyan-400 transition-colors">
                  Careers & Job Vacancies
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Policies */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Policies & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'privacy' })} className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'terms' })} className="hover:text-cyan-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'refund' })} className="hover:text-cyan-400 transition-colors">
                  Refund & Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'scope' })} className="hover:text-cyan-400 transition-colors">
                  Service Scope & Revision Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'delivery' })} className="hover:text-cyan-400 transition-colors">
                  Project Delivery & Timelines
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('legal', { tab: 'recruitment' })} className="hover:text-cyan-400 transition-colors">
                  Recruitment Privacy Notice
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-cyan-400 transition-colors">
                  About CODELIX Team
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Slogan Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div>
            © 2026 CODELIX (https://codelix.online). All rights reserved. Slogan: <span className="text-cyan-400 font-semibold">Building Digital Solutions.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="text-slate-400">Smart Technology. Affordable Solutions.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="text-slate-400">From Idea to Launch.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
