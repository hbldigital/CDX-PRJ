/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Official Homepage
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  ShoppingBag,
  Globe,
  ShoppingCart,
  Layers,
  Layout,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  ExternalLink,
  Laptop,
  Server,
  Database,
  Flame,
} from 'lucide-react';
import { FlyerBanner } from '../components/FlyerBanner';
import { useCart } from '../context/CartContext';
import type { Service, Offer } from '../types';

interface HomeProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('All');
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((d) => d.success && setServices(d.services))
      .catch((e) => console.error(e));

    fetch('/api/offers')
      .then((res) => res.json())
      .then((d) => d.success && setOffers(d.offers))
      .catch((e) => console.error(e));
  }, []);

  const handleAddOfferToCart = (offer: Offer) => {
    addToCart({
      serviceId: offer.id,
      serviceTitle: offer.title,
      packageName: 'Promotional Launch Offer',
      price: offer.promotionalPrice,
      quantity: 1,
      deliveryDays: 7,
    });
    setAddedItemToast(`${offer.title} added to cart!`);
    setTimeout(() => setAddedItemToast(null), 3000);
  };

  const slogans = [
    'Building Digital Solutions.',
    'Smart Technology. Affordable Solutions.',
    'Your Digital Partner for Business Growth.',
    'From Idea to Launch.',
    'Professional Websites. Powerful Software. Fair Prices.',
  ];

  const faqs = [
    {
      q: 'What types of development does CODELIX specialize in?',
      a: 'We specialize in custom PHP applications, Laravel systems, Shopify theme customization, WordPress & WooCommerce e-commerce stores, responsive HTML5/CSS3/JavaScript frontends, and bespoke enterprise management software (school management, office automation, and customer portals).',
    },
    {
      q: 'How does CODELIX track project progress in real time?',
      a: 'Every confirmed client project is assigned to an authorized lead engineer and given an interactive dashboard. You can view weighted milestone progress percentages (0–100%), remaining work, timeline updates, customer action requests, and revised delivery dates updated by real engineers.',
    },
    {
      q: 'Are the promotional prices genuine and what is included?',
      a: 'Yes, our launch promotional packages (such as Shopify Store Launch at PKR 7,000 or PHP E-commerce at PKR 23,000) are offered on a first-come, first-served basis for the advertised seat counts. They include domains, themes, or installation as detailed in each package description.',
    },
    {
      q: 'Can I request a custom quotation before placing an order?',
      a: 'Absolutely! Click "Get a Quote" or use our contact section. You can provide your requirements, preferred timeline, budget range, and reference links. Our technical team will prepare an itemized quote that you can review and approve directly.',
    },
    {
      q: 'How does the customer complaint system work?',
      a: 'Any client can submit a complaint linked to their order or project. The system generates a unique reference (e.g. CDX-CMP-2026-000123) and sends an acknowledgment email. Support staff investigate, post public updates, and resolve the issue transparently.',
    },
  ];

  const filteredServices =
    activeCategoryTab === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase().includes(activeCategoryTab.toLowerCase()));

  return (
    <div className="bg-white min-h-screen">
      {/* Toast Notification */}
      {addedItemToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold">{addedItemToast}</span>
          <button
            onClick={() => onNavigate('cart')}
            className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-3 py-1 rounded-xl font-black uppercase ml-2"
          >
            Checkout
          </button>
        </div>
      )}

      {/* ========================================================
          1. HERO SECTION
          ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 via-white to-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f4f8_1px,transparent_1px),linear-gradient(to_bottom,#f0f4f8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-6 shadow-xs animate-in fade-in duration-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
              <span>CODELIX Official Digital Solutions Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              <span className="text-slate-500">codelix.online</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0B192C] leading-[1.12]">
              Your Ideas. Our Technology.{' '}
              <span className="gradient-text">Your Digital Growth.</span>
            </h1>

            {/* Sub-headline description */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
              From business websites and e-commerce stores to custom PHP applications and advanced software solutions, CODELIX helps turn your ideas into reliable digital products at competitive prices.
            </p>

            {/* Slogans ticker */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-blue-600 font-bold">Official Slogans:</span>
              {slogans.slice(0, 3).map((s, i) => (
                <span
                  key={i}
                  className="bg-slate-100/90 text-slate-700 px-3 py-1 rounded-full border border-slate-200"
                >
                  "{s}"
                </span>
              ))}
            </div>

            {/* CTA Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('contact', { tab: 'quote' })}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Get a Free Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('services')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Browse Services</span>
              </button>

              <button
                onClick={() => onNavigate('offers')}
                className="w-full sm:w-auto px-6 py-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-sm rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-red-600" />
                <span>Special Offers (Up to 76% Off)</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
                <div className="text-blue-600 font-extrabold text-lg">100%</div>
                <div className="text-xs text-slate-500 font-medium">Real-Time Project Tracking</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
                <div className="text-cyan-600 font-extrabold text-lg">PKR 7,000</div>
                <div className="text-xs text-slate-500 font-medium">Promotional Packages From</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
                <div className="text-emerald-600 font-extrabold text-lg">24/7</div>
                <div className="text-xs text-slate-500 font-medium">Customer Support & Care</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-100 shadow-xs">
                <div className="text-indigo-600 font-extrabold text-lg">Clean Code</div>
                <div className="text-xs text-slate-500 font-medium">PHP 8.3 & Modern Web Stack</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. SPECIAL PROMOTIONAL PACKAGES (7 INITIAL OFFERS)
          ======================================================== */}
      <section className="py-16 bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-red-600 font-bold text-xs uppercase tracking-wider bg-red-100/70 px-3 py-1 rounded-full mb-2">
                <Flame className="w-3.5 h-3.5" />
                Limited Promotional Availability
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B192C]">
                Affordable Launch Packages & Offers
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Competitive pricing for ambitious businesses. Real seat counters, full transparency, and no hidden charges.
              </p>
            </div>

            <button
              onClick={() => onNavigate('offers')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>View All 7 Special Packages</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.slice(0, 3).map((offer) => {
              const remaining = offer.totalQuantity - offer.claimedQuantity;
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top discount ribbon */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-amber-500 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm">
                    SAVE {offer.discountPercentage}%
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {offer.category}
                    </span>

                    <h3 className="text-lg font-extrabold text-[#0B192C] mt-3">
                      {offer.title}
                    </h3>

                    {/* Pricing */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#0B192C] font-mono">
                        PKR {offer.promotionalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-600 line-through font-mono">
                        PKR {offer.originalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Scarcity counter */}
                    <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Remaining Slots:</span>
                        <span className="text-red-600 font-bold">{remaining} of {offer.totalQuantity} Left</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all"
                          style={{ width: `${(offer.claimedQuantity / offer.totalQuantity) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Inclusions */}
                    <ul className="mt-4 space-y-2 text-xs text-slate-600">
                      {offer.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleAddOfferToCart(offer)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Order This Package</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. CORE SERVICES SHOWCASE WITH TABS
          ======================================================== */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Full-Spectrum Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] mt-2">
              Our Professional Development Services
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From ground-up bespoke PHP web applications to modern Shopify stores and enterprise systems, CODELIX delivers bulletproof digital products.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {['All', 'PHP', 'Shopify', 'WordPress', 'WooCommerce', 'Custom Software', 'HTML'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCategoryTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeCategoryTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tab === 'All' ? 'All Services' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-blue-400"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    {service.category.includes('PHP') ? (
                      <Code2 className="w-6 h-6 text-blue-600" />
                    ) : service.category.includes('Shopify') ? (
                      <ShoppingBag className="w-6 h-6 text-cyan-600" />
                    ) : service.category.includes('WordPress') ? (
                      <Globe className="w-6 h-6 text-indigo-600" />
                    ) : service.category.includes('WooCommerce') ? (
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    ) : service.category.includes('Custom') ? (
                      <Layers className="w-6 h-6 text-cyan-600" />
                    ) : (
                      <Layout className="w-6 h-6 text-blue-600" />
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    {service.category}
                  </span>

                  <h3 className="text-xl font-extrabold text-[#0B192C] mt-1 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase mb-2">Key Features:</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-600 block uppercase font-bold">Packages From</span>
                    <span className="text-lg font-black text-[#0B192C] font-mono">
                      PKR {service.packages[0]?.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('services', { category: service.category })}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white text-xs font-bold rounded-xl transition-all"
                  >
                    <span>View Packages</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. OFFICIAL CONTACT & INQUIRIES FLYER BANNER
          ======================================================== */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FlyerBanner
            onSelectAction={(tab) => {
              onNavigate('contact', { tab });
            }}
          />
        </div>
      </section>

      {/* ========================================================
          5. DEVELOPMENT TECH STACK & PROCESS
          ======================================================== */}
      <section className="py-16 bg-[#F8FAFC] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Production Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B192C] mt-2">
              Technology Stack & 5-Step Delivery Process
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              We engineer maintainable software using proven technologies and transparent project governance.
            </p>
          </div>

          {/* 5-Step Process */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {[
              {
                step: '01',
                title: 'Discovery & Scope',
                desc: 'Detailed requirements gathering, wireframes, and formal quotation preparation.',
              },
              {
                step: '02',
                title: 'UI/UX & Architecture',
                desc: 'Clean typography, responsive layout designs, and normalized MySQL schemas.',
              },
              {
                step: '03',
                title: 'Development',
                desc: 'Object-oriented clean code, role-based access control, and third-party APIs.',
              },
              {
                step: '04',
                title: 'QA & Security',
                desc: 'Rigorous validation against XSS/CSRF/SQLi, cross-browser compatibility, and speed testing.',
              },
              {
                step: '05',
                title: 'Deployment & Support',
                desc: 'Domain setup, SMTP automated notification configuration, and source delivery.',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative"
              >
                <div className="text-2xl font-black text-blue-600/30 mb-2 font-mono">{p.step}</div>
                <h4 className="text-sm font-extrabold text-slate-900 mb-1">{p.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Technology Badges */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center">
            <h3 className="text-base font-extrabold text-slate-900 mb-6 uppercase tracking-wider text-xs">
              Technologies & Frameworks Deployed by CODELIX
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'PHP 8.3 OOP & MVC', tag: 'Backend' },
                { name: 'Laravel Framework', tag: 'Web App' },
                { name: 'MySQL / MariaDB', tag: 'Database' },
                { name: 'Shopify Liquid', tag: 'E-Commerce' },
                { name: 'WordPress & WooCommerce', tag: 'CMS' },
                { name: 'HTML5 Semantic', tag: 'Structure' },
                { name: 'CSS3 & Tailwind CSS', tag: 'Styling' },
                { name: 'JavaScript ES6+', tag: 'Frontend' },
                { name: 'REST APIs & Webhooks', tag: 'Integration' },
                { name: 'SMTP & PHPMailer', tag: 'Email' },
                { name: 'cPanel & Linux', tag: 'Hosting' },
              ].map((tech, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span>{tech.name}</span>
                  <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded-sm border border-slate-200">
                    {tech.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. FAQS ACCORDION
          ======================================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Got Questions?
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B192C] mt-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Everything you need to know about working with CODELIX, pricing, and project workflows.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50/50 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8 text-xs text-slate-500">
            Still have a question?{' '}
            <button
              onClick={() => onNavigate('contact', { tab: 'questions' })}
              className="text-blue-600 font-bold hover:underline"
            >
              Ask our engineers directly →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
