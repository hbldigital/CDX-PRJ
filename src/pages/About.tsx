/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX About Us & Corporate Philosophy
 */

import React from 'react';
import {
  ShieldCheck,
  Zap,
  Users,
  Target,
  HeartHandshake,
  Cpu,
  ArrowRight,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from '../components/Logo';

interface AboutProps {
  onNavigate: (view: string, params?: any) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            About CODELIX
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] mt-2 tracking-tight">
            Building Digital Solutions for Modern Enterprises
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-4 leading-relaxed">
            CODELIX was founded to solve a persistent dilemma in software development: businesses were forced to choose between overpriced agencies or unreliable freelancers. We bridge that divide with world-class engineering at competitive, affordable prices.
          </p>
        </div>

        {/* 2-Column Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Our Vision & Philosophy</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] leading-snug">
              Every Line of Code Must Serve Your Business Growth
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              At CODELIX (https://codelix.online), we don't build generic templates or bloated software. Whether we are engineering a multi-role school management portal in Laravel, setting up a high-converting Shopify store, or developing a custom PHP 8.3 MVC application, our focus is uncompromising: performance, security, and measurable ROI.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              We believe in complete transparency. That is why every client receives real-time milestone project tracking updated directly by assigned engineers—never simulated progress or vague excuses.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('contact', { tab: 'quote' })}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Work With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
              >
                Explore Services
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-[#0B192C] via-[#0F284E] to-[#0A3A6B] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-cyan-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

            <Logo size="lg" light={true} />

            <div className="mt-8 space-y-4">
              <div className="border-l-2 border-cyan-400 pl-4">
                <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">Our Mission</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  Empower businesses of all sizes with secure, reliable, and affordable digital products that convert visitors into lifelong clients.
                </div>
              </div>

              <div className="border-l-2 border-cyan-400 pl-4">
                <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">Official Tagline</div>
                <div className="text-lg font-black text-white mt-1">
                  Building Digital Solutions.
                </div>
              </div>

              <div className="border-l-2 border-cyan-400 pl-4">
                <div className="text-xs uppercase tracking-widest text-cyan-300 font-bold">Core Brand Values</div>
                <div className="text-xs text-slate-300 mt-1">
                  Integrity, Object-Oriented Craftsmanship, Transparent Project Tracking, and Relentless Post-Deployment Support.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-[#0B192C]">Why Businesses Trust CODELIX</h3>
            <p className="text-xs text-slate-500 mt-1">Our engineering standards guarantee peace of mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">Clean & Secure Code</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prepared statements, CSRF protection, input sanitation, and modular MVC architecture standard on all projects.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">Sub-Second Speed</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimized asset bundling, lightweight CSS, database indexing, and browser caching for fast loading.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">Affordable Packages</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Subsidized promotional tiers, fair transparent rates, and domain/hosting packages with zero hidden fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm mb-1">Full Accountability</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unique order references, transparent complaint resolution tracking, and client portal milestones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
