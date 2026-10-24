/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Official CODELIX Contact & Inquiries Banner
 * Faithful interactive replica of the official flyer
 */

import React from 'react';
import {
  Monitor,
  HelpCircle,
  FileText,
  Lightbulb,
  PhoneCall,
  Instagram,
  Twitter,
  Linkedin,
  Globe,
  ShieldCheck,
  Users,
  Cpu,
  Star,
  Send,
} from 'lucide-react';
import { Logo } from './Logo';

interface FlyerBannerProps {
  onSelectAction?: (tab: 'demo' | 'questions' | 'quote' | 'ideas') => void;
}

export const FlyerBanner: React.FC<FlyerBannerProps> = ({ onSelectAction }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B192C] via-[#0F284E] to-[#0A3A6B] text-white shadow-2xl p-6 md:p-10 border border-cyan-500/30">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <Logo size="lg" light={true} />

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/15">
          <span className="text-cyan-300 font-bold tracking-wider text-xs uppercase">
            YOUR DIGITAL PARTNER.
          </span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-white/90 font-medium">Let's Build Together!</span>
        </div>
      </div>

      {/* Hero Headline & Interactive 4 Buttons */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-md mb-4">
          <PhoneCall className="w-3.5 h-3.5" />
          Direct Technical Support
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
          Contact Us <span className="text-cyan-300 font-medium lowercase">for</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
            Demo, Questions, Quotation or Ideas
          </span>
        </h2>

        {/* 4 Interactive Action Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <button
            onClick={() => onSelectAction?.('demo')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
              <Monitor className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-cyan-300">Request a Demo</span>
            <span className="text-[11px] text-slate-300 mt-1">Live software walk-through</span>
          </button>

          <button
            onClick={() => onSelectAction?.('questions')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-cyan-300">Ask Questions</span>
            <span className="text-[11px] text-slate-300 mt-1">Tech advice & consultation</span>
          </button>

          <button
            onClick={() => onSelectAction?.('quote')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-cyan-300">Get a Quotation</span>
            <span className="text-[11px] text-slate-300 mt-1">Free competitive estimate</span>
          </button>

          <button
            onClick={() => onSelectAction?.('ideas')}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-cyan-400 transition-all duration-200 hover:-translate-y-1 shadow-lg text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform">
              <Lightbulb className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white group-hover:text-cyan-300">Share Your Ideas</span>
            <span className="text-[11px] text-slate-300 mt-1">Turn concept into code</span>
          </button>
        </div>
      </div>

      {/* Prominent Direct Call Banner */}
      <div className="relative z-10 max-w-2xl mx-auto bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-600/20 rounded-2xl p-4 sm:p-6 border border-emerald-400/40 text-center mb-8 backdrop-blur-sm">
        <span className="inline-block bg-red-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider mb-2 animate-bounce">
          CONTACT NOW
        </span>
        <div className="flex items-center justify-center gap-3 text-2xl sm:text-4xl font-extrabold text-white">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <a
            href="tel:+19029030717"
            className="hover:text-cyan-300 transition-colors tracking-tight font-black"
          >
            +1 902 903 0717
          </a>
        </div>
        <p className="text-xs sm:text-sm text-cyan-100 mt-2">
          We're here to help you with the best solutions for your business needs.
        </p>
      </div>

      {/* Follow Us Social Media Grid */}
      <div className="relative z-10 bg-white/95 text-slate-900 rounded-2xl p-5 shadow-xl mb-8">
        <div className="text-center mb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Follow Us On Social Platforms
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
          <a
            href="https://instagram.com/codelixhq"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shrink-0">
              <Instagram className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-600">Instagram</div>
              <div className="font-bold text-slate-900 truncate">@codelixhq</div>
            </div>
          </a>

          <a
            href="https://twitter.com/codelixhq"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shrink-0">
              <Twitter className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-600">Twitter (X)</div>
              <div className="font-bold text-slate-900 truncate">@codelixhq</div>
            </div>
          </a>

          <a
            href="https://tiktok.com/@codelixhq"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shrink-0">
              <Send className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-600">TikTok</div>
              <div className="font-bold text-slate-900 truncate">@codelixhq</div>
            </div>
          </a>

          <a
            href="https://linkedin.com/company/codelix"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0077B5] flex items-center justify-center text-white shrink-0">
              <Linkedin className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-600">LinkedIn</div>
              <div className="font-bold text-slate-900 truncate">CODELIX</div>
            </div>
          </a>

          <a
            href="https://codelix.online"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-600">Official Site</div>
              <div className="font-bold text-slate-900 truncate">codelix.online</div>
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Trust Badges Bar */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Fast Response</div>
            <div className="text-slate-300 text-[11px]">Get quick support</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Professional Team</div>
            <div className="text-slate-300 text-[11px]">Dedicated assistance</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Custom Solutions</div>
            <div className="text-slate-300 text-[11px]">As per your requirements</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Reliable Partner</div>
            <div className="text-slate-300 text-[11px]">Your Digital Partner</div>
          </div>
        </div>
      </div>
    </section>
  );
};
