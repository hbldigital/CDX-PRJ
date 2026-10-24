/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Portfolio & Case Studies Showcase
 */

import React, { useState } from 'react';
import {
  ExternalLink,
  Code2,
  Layers,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface PortfolioProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState('All');

  const projects = [
    {
      id: 'p1',
      title: 'Hamza Apparel & Co. — Modern E-Commerce',
      category: 'Shopify',
      imageBg: 'from-blue-600 to-cyan-700',
      description: 'High-conversion minimalist Shopify store for an organic clothing brand featuring product bundles, multi-currency display, and accelerated checkout.',
      techStack: ['Shopify Liquid', 'Tailwind CSS', 'Alpine.js', 'Payment Gateway'],
      impact: '72% increase in mobile conversion rate; sub-2s page load.',
      scope: 'Theme customization, product taxonomy, and checkout security.',
    },
    {
      id: 'p2',
      title: 'Apex Supply Chain & Inventory Portal',
      category: 'PHP Development',
      imageBg: 'from-slate-800 to-indigo-900',
      description: 'Custom object-oriented PHP 8.3 & MySQL management portal with automated waybill PDF generation, role permissions, and warehouse audit logging.',
      techStack: ['PHP 8.3 OOP', 'MySQL PDO', 'Bootstrap 5.3', 'PHPMailer', 'FPDF'],
      impact: 'Replaced manual paperwork with real-time barcode tracking for 15,000 SKUs.',
      scope: 'Custom MVC architecture, administrative controls, and daily automated backups.',
    },
    {
      id: 'p3',
      title: 'EduTrack — School Management System',
      category: 'Custom Software',
      imageBg: 'from-cyan-700 to-blue-900',
      description: 'Multi-branch school administration software managing 2,400 students with fee collections, exam scheduling, teacher gradebooks, and parent portals.',
      techStack: ['Laravel', 'MySQL', 'REST APIs', 'Chart.js', 'SMS Gateway'],
      impact: '99.4% timely fee reconciliation and automated WhatsApp/SMS alerts.',
      scope: 'Role-based access control, grade calculation engine, and printable ID cards.',
    },
    {
      id: 'p4',
      title: 'Al-Madina News & Digital Magazine',
      category: 'PHP Development',
      imageBg: 'from-teal-700 to-slate-900',
      description: 'High-volume news portal handling 50k daily readers with sub-second page delivery, categorization, ad spaces, and social sharing.',
      techStack: ['PHP 8.3', 'Redis Cache', 'Semantic HTML5', 'SEO Structured Data'],
      impact: 'Grade A Core Web Vitals score across mobile and desktop devices.',
      scope: 'Full news CMS, editorial roles, media asset manager, and sitemap automation.',
    },
    {
      id: 'p5',
      title: 'Artisan Gourmet — WooCommerce Store',
      category: 'WooCommerce',
      imageBg: 'from-amber-700 to-stone-900',
      description: 'Bespoke WooCommerce online store for gourmet baked goods with delivery date scheduling, ingredient filter pills, and instant WhatsApp ordering.',
      techStack: ['WordPress', 'WooCommerce', 'Custom Theme', 'Stripe / Bank Transfer'],
      impact: '100% zero-drop checkout reliability during holiday traffic surges.',
      scope: 'Custom delivery radius calculation, email order receipts, and coupon rules.',
    },
    {
      id: 'p6',
      title: 'BuildCraft Renovation & Architecture',
      category: 'Website Development',
      imageBg: 'from-blue-700 to-sky-900',
      description: 'Corporate portfolio and estimate calculator for an interior design and general contracting firm with before/after visual sliders.',
      techStack: ['HTML5', 'Modern CSS3', 'JavaScript ES6+', 'Interactive Sliders'],
      impact: '3x increase in weekly customer estimate requests.',
      scope: 'Lead capture forms, service showcase, and Google Maps integration.',
    },
  ];

  const categories = ['All', 'Shopify', 'PHP Development', 'Custom Software', 'WooCommerce', 'Website Development'];

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Proven Digital Craftsmanship
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] mt-2 tracking-tight">
            Featured Projects & Client Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Explore how CODELIX delivers measurable business value through high-performance software, custom databases, and high-conversion e-commerce storefronts.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-blue-400"
            >
              <div>
                {/* Visual Header Banner */}
                <div className={`h-48 bg-gradient-to-br ${proj.imageBg} p-6 flex flex-col justify-between text-white relative`}>
                  <div className="flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-white/20">
                      {proj.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                      <Code2 className="w-4 h-4 text-cyan-200" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-xs">
                      {proj.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs">
                    <span className="font-bold text-blue-900 block mb-0.5">Key Result:</span>
                    <span className="text-blue-800 text-[11px] font-medium">{proj.impact}</span>
                  </div>

                  {/* Tech stack tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech, tidx) => (
                      <span
                        key={tidx}
                        className="bg-slate-100 text-slate-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onNavigate('contact', { tab: 'quote', service: proj.title })}
                  className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 text-slate-800 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200 group-hover:border-blue-600"
                >
                  <span>Build Something Similar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#0B192C] to-[#0A3A6B] rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Build Your Digital Solution?</h3>
            <p className="text-sm text-cyan-100 mt-2">
              Let's discuss your project scope, architecture, and timeline. Get an honest estimate with no obligations.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('contact', { tab: 'quote' })}
                className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all"
              >
                Get a Free Quotation
              </button>
              <button
                onClick={() => onNavigate('contact', { tab: 'demo' })}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
              >
                Request a Software Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
