/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Unified Inquiries Hub: Quote, Questions, Demo & Ideas
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  HelpCircle,
  Monitor,
  Lightbulb,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';

interface ContactProps {
  initialTab?: 'quote' | 'questions' | 'demo' | 'ideas';
  initialService?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialTab = 'quote', initialService = '' }) => {
  const [activeTab, setActiveTab] = useState<'quote' | 'questions' | 'demo' | 'ideas'>(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Form states
  const [loading, setLoading] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quote form state
  const [qName, setQName] = useState('');
  const [qEmail, setQEmail] = useState('');
  const [qPhone, setQPhone] = useState('');
  const [qCompany, setQCompany] = useState('');
  const [qCategory, setQCategory] = useState(initialService || 'PHP Development');
  const [qDescription, setQDescription] = useState('');
  const [qBudget, setQBudget] = useState('PKR 25,000 - 50,000');
  const [qTimeline, setQTimeline] = useState('Within 2 Weeks');
  const [qUrl, setQUrl] = useState('');

  // Questions form state
  const [askName, setAskName] = useState('');
  const [askEmail, setAskEmail] = useState('');
  const [askPhone, setAskPhone] = useState('');
  const [askCategory, setAskCategory] = useState('Technical Advice');
  const [askSubject, setAskSubject] = useState('');
  const [askMessage, setAskMessage] = useState('');

  // Demo form state
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoService, setDemoService] = useState('Laravel School Management Software');
  const [demoDate, setDemoDate] = useState('2026-03-05');
  const [demoTime, setDemoTime] = useState('02:00 PM');
  const [demoTimezone, setDemoTimezone] = useState('PKT (UTC+5)');
  const [demoNotes, setDemoNotes] = useState('');

  // Ideas form state
  const [ideaName, setIdeaName] = useState('');
  const [ideaEmail, setIdeaEmail] = useState('');
  const [ideaPhone, setIdeaPhone] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaAudience, setIdeaAudience] = useState('');
  const [ideaFeatures, setIdeaFeatures] = useState('');
  const [ideaBudget, setIdeaBudget] = useState('PKR 100,000 - 250,000');
  const [ideaTimeline, setIdeaTimeline] = useState('1 to 2 Months');

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: qName,
          email: qEmail,
          phone: qPhone,
          company: qCompany,
          serviceCategory: qCategory,
          description: qDescription,
          budgetRange: qBudget,
          preferredTimeline: qTimeline,
          referenceUrl: qUrl,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccessRef(data.reference);
        setSuccessMsg('Your quotation request has been received! Our solutions team will review and email your proposal.');
      } else {
        setErrorMsg(data.error || 'Failed to submit quote request.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error. Please try again.');
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: askName,
          email: askEmail,
          phone: askPhone,
          category: askCategory,
          subject: askSubject,
          message: askMessage,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccessRef(data.reference);
        setSuccessMsg('Thank you for asking! Your inquiry reference has been registered and an engineer will reply shortly.');
      } else {
        setErrorMsg(data.error || 'Failed to submit inquiry.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error.');
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: demoName,
          email: demoEmail,
          phone: demoPhone,
          serviceOrProduct: demoService,
          preferredDate: demoDate,
          preferredTime: demoTime,
          timezone: demoTimezone,
          notes: demoNotes,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccessRef(data.reference);
        setSuccessMsg('Demo request scheduled! Check your email for calendar invite and session link.');
      } else {
        setErrorMsg(data.error || 'Failed to request demo.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error.');
    }
  };

  const handleIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ideaName,
          email: ideaEmail,
          phone: ideaPhone,
          ideaTitle,
          targetAudience: ideaAudience,
          desiredFeatures: ideaFeatures,
          budget: ideaBudget,
          timeline: ideaTimeline,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setSuccessRef(data.reference);
        setSuccessMsg('Your project concept has been safely received under our strict NDA policy. Our architect will evaluate feasibility.');
      } else {
        setErrorMsg(data.error || 'Failed to submit idea.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error.');
    }
  };

  const resetSuccess = () => {
    setSuccessRef(null);
    setSuccessMsg(null);
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Direct Technical Engagement
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] mt-2 tracking-tight">
            Contact CODELIX Engineering
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Whether you need an itemized quotation, a software demo, tech advice, or want to pitch a custom business idea, we are ready to build together.
          </p>
        </div>

        {/* 4 Tabs Selector */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setActiveTab('quote');
                resetSuccess();
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'quote'
                  ? 'bg-white text-blue-600 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-cyan-500" />
              <span>Get a Quotation</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('questions');
                resetSuccess();
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'questions'
                  ? 'bg-white text-blue-600 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-500" />
              <span>Ask Questions</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('demo');
                resetSuccess();
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'demo'
                  ? 'bg-white text-blue-600 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-4 h-4 text-cyan-500" />
              <span>Request a Demo</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('ideas');
                resetSuccess();
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'ideas'
                  ? 'bg-white text-blue-600 shadow-md font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Share Your Ideas</span>
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Success Banner */}
          {successRef && (
            <div className="p-8 text-center bg-emerald-50/70 border-b border-emerald-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-900">Request Successfully Registered!</h3>
              <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">{successMsg}</p>
              <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono font-black text-sm text-emerald-800 shadow-xs">
                <span>Unique Reference:</span>
                <span className="text-blue-600 font-bold">{successRef}</span>
              </div>
              <div className="mt-6">
                <button
                  onClick={resetSuccess}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form 1: Get a Quote */}
          {!successRef && activeTab === 'quote' && (
            <form onSubmit={handleQuoteSubmit} className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-[#0B192C]">
                  Request an Official Project Quotation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us about your project requirements to receive a formal itemized proposal.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asif Raza"
                    value={qName}
                    onChange={(e) => setQName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@mail.com"
                    value={qEmail}
                    onChange={(e) => setQEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={qPhone}
                    onChange={(e) => setQPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Nexus Logistics"
                    value={qCompany}
                    onChange={(e) => setQCompany(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Service Domain</label>
                  <select
                    value={qCategory}
                    onChange={(e) => setQCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="PHP Development">PHP Development (OOP & MVC)</option>
                    <option value="Shopify">Shopify Store Setup</option>
                    <option value="WordPress">WordPress Website</option>
                    <option value="WooCommerce">WooCommerce Store</option>
                    <option value="Custom Software">Custom Enterprise Software</option>
                    <option value="HTML, CSS & JS">HTML5 / Responsive UI</option>
                    <option value="Laravel">Laravel Application</option>
                    <option value="Other">Other Custom Solution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Expectation</label>
                  <select
                    value={qBudget}
                    onChange={(e) => setQBudget(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Under PKR 20,000">Under PKR 20,000 (Launch Offers)</option>
                    <option value="PKR 25,000 - 50,000">PKR 25,000 - 50,000</option>
                    <option value="PKR 50,000 - 100,000">PKR 50,000 - 100,000</option>
                    <option value="PKR 100,000 - 250,000">PKR 100,000 - 250,000</option>
                    <option value="Above PKR 250,000">Above PKR 250,000 (Enterprise)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Desired Timeline</label>
                  <select
                    value={qTimeline}
                    onChange={(e) => setQTimeline(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Urgent (1–5 Days)">Urgent (1–5 Days)</option>
                    <option value="Within 2 Weeks">Within 2 Weeks</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="Flexible Schedule">Flexible Schedule</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Description & Specifications *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your requirements, desired pages, functional features, user roles, or integrations..."
                  value={qDescription}
                  onChange={(e) => setQDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reference Website or Competitor Links
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={qUrl}
                  onChange={(e) => setQUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span>Generating Quotation Request...</span> : <span>Submit Quotation Request</span>}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Ask Questions */}
          {!successRef && activeTab === 'questions' && (
            <form onSubmit={handleQuestionSubmit} className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-[#0B192C]">Ask Questions & Technical Advice</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Have doubts regarding tech stacks, server architectures, or e-commerce platforms? Ask our engineers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nadia Parveen"
                    value={askName}
                    onChange={(e) => setAskName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="nadia@mail.com"
                    value={askEmail}
                    onChange={(e) => setAskEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+92 333 1234567"
                    value={askPhone}
                    onChange={(e) => setAskPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={askCategory}
                    onChange={(e) => setAskCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Technical Advice">Technical Advice & Stack Selection</option>
                    <option value="Shopify vs WooCommerce">Shopify vs WooCommerce Comparison</option>
                    <option value="PHP Security & Hosting">PHP Security & Server Hosting</option>
                    <option value="Package Inclusions">Package Inclusions & Invoicing</option>
                    <option value="Other Question">General Question</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Can we integrate local Pakistani payment gateways on Shopify?"
                    value={askSubject}
                    onChange={(e) => setAskSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Question *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask whatever you need help understanding..."
                  value={askMessage}
                  onChange={(e) => setAskMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span>Submitting Question...</span> : <span>Send Question to Technical Lead</span>}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 3: Request a Demo */}
          {!successRef && activeTab === 'demo' && (
            <form onSubmit={handleDemoSubmit} className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-[#0B192C]">Request a Live Software Walkthrough</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Schedule an interactive screen-share demonstration of our enterprise systems with our lead architects.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tariq Aziz"
                    value={demoName}
                    onChange={(e) => setDemoName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="tariq@institution.edu"
                    value={demoEmail}
                    onChange={(e) => setDemoEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 345 1234567"
                    value={demoPhone}
                    onChange={(e) => setDemoPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product / System for Demo</label>
                <select
                  value={demoService}
                  onChange={(e) => setDemoService(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden font-bold text-slate-800"
                >
                  <option value="Laravel School Management Software">Laravel School Management Software</option>
                  <option value="Custom PHP Single-Vendor E-commerce">Custom PHP Single-Vendor E-commerce</option>
                  <option value="Custom Office Management Portal">Custom Office & Employee Operations System</option>
                  <option value="Automated Crypto Trading & Analytics">Automated Crypto Analytics & Trading Software</option>
                  <option value="Shopify High-Scale Architecture">Shopify High-Scale Architecture & Liquid Themes</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={demoDate}
                    onChange={(e) => setDemoDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:30 AM"
                    value={demoTime}
                    onChange={(e) => setDemoTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                  <input
                    type="text"
                    value={demoTimezone}
                    onChange={(e) => setDemoTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Modules or Pain Points</label>
                <textarea
                  rows={3}
                  placeholder="e.g. We have 800 students and need to see fee receipts and online attendance sync..."
                  value={demoNotes}
                  onChange={(e) => setDemoNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span>Scheduling Demo...</span> : <span>Confirm & Schedule Live Demo</span>}
                <Monitor className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 4: Share Your Ideas */}
          {!successRef && activeTab === 'ideas' && (
            <form onSubmit={handleIdeaSubmit} className="p-6 sm:p-10 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-extrabold text-[#0B192C]">Share Your Digital Solution Idea</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Have an innovative app or business portal in mind? Share your concept safely under our NDA policy.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Usman Farooq"
                    value={ideaName}
                    onChange={(e) => setIdeaName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="usman@startup.com"
                    value={ideaEmail}
                    onChange={(e) => setIdeaEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+92 301 1234567"
                    value={ideaPhone}
                    onChange={(e) => setIdeaPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Concept / Working Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. On-Demand B2B Pharmacy Supply Distribution Platform"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Retail pharmacies & medical wholesalers"
                    value={ideaAudience}
                    onChange={(e) => setIdeaAudience(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Budget Range</label>
                  <select
                    value={ideaBudget}
                    onChange={(e) => setIdeaBudget(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                  >
                    <option value="Under PKR 50,000">Under PKR 50,000 (MVP Prototype)</option>
                    <option value="PKR 50,000 - 100,000">PKR 50,000 - 100,000</option>
                    <option value="PKR 100,000 - 250,000">PKR 100,000 - 250,000</option>
                    <option value="Above PKR 250,000">Above PKR 250,000 (Enterprise Scale)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Core Desired Features & Workflows *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the workflow: what happens when users log in, what roles are needed, automated actions..."
                  value={ideaFeatures}
                  onChange={(e) => setIdeaFeatures(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? <span>Submitting Idea...</span> : <span>Submit Idea for Technical Assessment</span>}
                <Lightbulb className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
