/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Legal Policies, Business Governance & Official Help Desk Directory
 * Point-by-point clauses with designated team emails and emergency escalations
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Clock,
  AlertTriangle,
  Users,
  Mail,
  ShieldAlert,
  Building,
  PhoneCall,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

interface LegalPageProps {
  initialTab?: string;
  onNavigate: (view: string, params?: any) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'refund', label: 'Refund & Cancellation Policy', icon: RotateCcw },
    { id: 'scope', label: 'Service Scope & Revisions', icon: Clock },
    { id: 'delivery', label: 'Project Delivery & Timelines', icon: AlertTriangle },
    { id: 'recruitment', label: 'Recruitment Privacy Notice', icon: Users },
  ];

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Legal & Governance Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-2 tracking-tight">
            CODELIX Policies & Help Desk Directory
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Official business disclosures, point-by-point service standards, and verified channels for client assistance and cybersecurity escalation.
          </p>
        </div>

        {/* OFFICIAL HELPDESK & TEAM EMAILS BANNER */}
        <div className="bg-gradient-to-br from-[#0B192C] to-[#1E3E62] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-cyan-500/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/80 pb-5">
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>Official Contact & Help Desk Channels</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Reach the Right CODELIX Department
              </h2>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              Website: <a href="https://codelix.online" className="text-cyan-400 hover:underline">https://codelix.online</a>
            </div>
          </div>

          {/* Department Mail Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-colors">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">1. Customer Support</span>
              <p className="text-xs text-slate-300 mt-1">For general service help, order inquiries, and technical support.</p>
              <a
                href="mailto:support@codelix.online"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>support@codelix.online</span>
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-colors">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">2. Business & Enterprise</span>
              <p className="text-xs text-slate-300 mt-1">For B2B contracts, corporate partnerships, and bulk quotations.</p>
              <a
                href="mailto:business@codelix.online"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>business@codelix.online</span>
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-colors">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">3. Office of the CEO</span>
              <p className="text-xs text-slate-300 mt-1">Direct escalation to executive leadership and strategic matters.</p>
              <a
                href="mailto:ceo@codelix.online"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>ceo@codelix.online</span>
              </a>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-cyan-400/50 transition-colors">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">4. Complaints Center</span>
              <p className="text-xs text-slate-300 mt-1">For unresolved tickets, quality disputes, or service complaints.</p>
              <a
                href="mailto:complaints@codelix.online"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>complaints@codelix.online</span>
              </a>
            </div>
          </div>

          {/* CRITICAL & CYBERSECURITY ESCALATION */}
          <div className="mt-6 p-4 sm:p-5 bg-red-950/40 rounded-2xl border border-red-500/40 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-extrabold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>Immediate Escalation & Cybersecurity Incident Response</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              For critical service disruptions, server emergencies, or reporting cybersecurity vulnerabilities, contact our emergency escalation addresses monitored 24/7/365:
            </p>
            <div className="mt-3 flex flex-wrap gap-3 font-mono text-xs font-bold">
              <a
                href="mailto:cybersecurity@codelix.online"
                className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg border border-red-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>cybersecurity@codelix.online</span>
              </a>
              <a
                href="mailto:codelixhq@gmail.com"
                className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg border border-red-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>codelixhq@gmail.com</span>
              </a>
              <a
                href="mailto:codelixceo@gmail.com"
                className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900 text-red-200 rounded-lg border border-red-500/40 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>codelixceo@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTab(t.id);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* POINT-WISE CLAUSES BOX */}
        <div className="bg-slate-50/70 rounded-3xl border border-slate-200 p-8 sm:p-12 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-8">
          {/* 1. PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-PRV-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  CODELIX Comprehensive Privacy Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Applicable to all visitors, registered clients, applicants, and enterprise partners of https://codelix.online.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Principles & Information Governance
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Lawful Collection:</strong> CODELIX collects client contact details (full name, email address, WhatsApp/phone number, company name, and country) solely for contract execution, account authentication, project tracking, and quotation fulfillment.
                  </p>
                  <p>
                    <strong>1.2 Scope Attachments:</strong> Design references, PDFs, specifications, and architecture files uploaded through checkout or contact forms are stored securely with encrypted access tokens and processed only by authorized engineering leads.
                  </p>
                  <p>
                    <strong>1.3 Absolute Non-Disclosure:</strong> Under no circumstance does CODELIX sell, rent, monetize, or trade client contact numbers, email lists, or project specifications to external advertising networks or brokers.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  2. Payment & Financial Privacy
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>2.1 Pakistani Banking Data:</strong> When transferring funds via Pakistani banks (e.g., Meezan Bank, HBL, UBL, Bank Alfalah, Raast, SadaPay, NayaPay), client-provided transaction reference numbers and payment proof screenshots are verified manually by accounts personnel and never shared with unauthorized parties.
                  </p>
                  <p>
                    <strong>2.2 Crypto / USDT Transactions:</strong> Crypto wallet addresses and public blockchain transaction hashes submitted for verification are logged solely to confirm order settlement and prevent duplicate voucher claims.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  3. Client Rights & Data Erasure
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>3.1 Data Access & Correction:</strong> Registered clients may request a full export or correction of their portal records by emailing <strong>support@codelix.online</strong>.
                  </p>
                  <p>
                    <strong>3.2 Erasure Requests:</strong> Clients may request deletion of inactive accounts and completed project attachments upon full settlement of all obligations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-TRM-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  Terms & Conditions of Service
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Governance standard governing service orders, software delivery, and customer obligations on CODELIX.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Engagement & Project Initiation
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Binding Acceptance:</strong> Placing an order via our online checkout, accepting a quotation, or transferring funds constitutes a legally binding agreement under these terms.
                  </p>
                  <p>
                    <strong>1.2 Scope Definition:</strong> Each project is strictly bound to the features, package deliverables, and add-ons recorded in the confirmed order specification. Additional features outside the initial agreement will be billed as separate milestones.
                  </p>
                  <p>
                    <strong>1.3 Client Feedback Obligation:</strong> Timely project completion depends on client feedback. Delays in approving design drafts or providing text and media assets will proportionally extend the estimated completion date.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  2. Intellectual Property & Source Code Ownership
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>2.1 Full Ownership Transfer:</strong> Upon 100% settlement of all invoiced fees, complete ownership of custom bespoke code, frontend markup, database structures, and website assets is formally transferred to the customer.
                  </p>
                  <p>
                    <strong>2.2 Third-Party Licenses:</strong> Any open-source libraries, Shopify apps, WordPress plugins, or font licenses utilized remain subject to their respective vendor licenses.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  3. Ethical Usage & Cyber Safety
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>3.1 Prohibited Deployments:</strong> CODELIX strictly refuses to develop platforms associated with phishing, fraudulent schemes, malware distribution, or unlicensed gambling.
                  </p>
                  <p>
                    <strong>3.2 Immediate Termination:</strong> Violations of cyber safety laws will result in immediate termination of services without refund, and escalation to <strong>cybersecurity@codelix.online</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 3. REFUND POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-REF-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  Refund & Cancellation Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Clear, equitable guidelines regarding financial settlements, pre-development cancellations, and milestone billing.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Pre-Development Cancellations
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Pending Review Phase:</strong> If an order is cancelled while in "Pending Review" status before system architecture or design prototyping has begun, the client is entitled to a 100% full refund of all project fees.
                  </p>
                  <p>
                    <strong>1.2 Processing Period:</strong> Approved refunds will be reversed to the original Pakistani Bank account or USDT wallet within 3 to 5 business days.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  2. In-Progress Milestone Cancellations
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>2.1 Proportional Settlement:</strong> Because custom software development incurs non-recoverable engineering hours, cancellations requested after development has commenced are refunded proportionally based on unstarted milestones.
                  </p>
                  <p>
                    <strong>2.2 Third-Party Registrars:</strong> Domain name registrations (.com, .online, .pk) and third-party cloud hosting fees paid to external registrars are non-refundable once activated.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  3. Dispute Resolution & Escalation
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>3.1 Direct Review:</strong> If you believe a refund determination was made in error, submit a formal dispute with your order reference directly to <strong>complaints@codelix.online</strong> or escalate to <strong>ceo@codelix.online</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. SERVICE SCOPE & REVISIONS */}
          {activeTab === 'scope' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-SCP-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  Service Scope & Revision Policy
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Standards governing layout revisions, bug fixes, and change request procedures.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Included Revision Allowances
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Package Allotments:</strong> Every package states its specific revision count (e.g. 3 Revisions for Starter, 5 for Professional, or Unlimited Revisions for Enterprise tiers).
                  </p>
                  <p>
                    <strong>1.2 What Revisions Cover:</strong> Revisions cover design adjustments, typography corrections, color tweaks, content replacements, and responsive mobile alignment within the originally approved wireframes.
                  </p>
                  <p>
                    <strong>1.3 Bug Fix Guarantee:</strong> Any functional defects or code bugs identified within 30 days of deployment are rectified by CODELIX engineers free of charge, independent of revision counts.
                  </p>
                </div>

                <h3 className="text-sm font-extrabold text-[#0B192C] pt-2">
                  2. Scope Expansions & Add-Ons
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>2.1 New Modules:</strong> Requests for new database entities, custom payment gateways, or third-party CRM integrations not stated in the original order will be quoted transparently as supplemental add-on milestones.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. DELIVERY & TIMELINES */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-DLV-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  Project Delivery & Timeline Standards
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  How project timelines, milestone updates, and final server handovers are managed.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Transparent Scheduling
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Realistic Delivery Dates:</strong> Completion dates visible in the Customer Dashboard are calibrated upon order confirmation by the assigned project engineer.
                  </p>
                  <p>
                    <strong>1.2 Live Progress Tracking:</strong> The five milestone percentages (Requirements, UI/UX, Development, QA & Testing, Handover) are updated in real time as tasks clear staging environments.
                  </p>
                  <p>
                    <strong>1.3 Server Handover:</strong> Upon completion, full administrator credentials, cPanel/FTP access, Git repository access, and database dumps are delivered to the client's verified email address.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. RECRUITMENT PRIVACY NOTICE */}
          {activeTab === 'recruitment' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest">
                  Compliance Document #CDX-REC-2026
                </span>
                <h2 className="text-2xl font-black text-[#0B192C] mt-1">
                  Recruitment Privacy & Candidate Scrutiny Notice
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Candidate evaluation, white-background passport photo verification, and interview protocols.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-extrabold text-[#0B192C]">
                  1. Candidate Data Protection
                </h3>
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  <p>
                    <strong>1.1 Purpose of Processing:</strong> Candidate resumes, portfolio links, academic histories, and passport-size photographs submitted via our Careers portal are used strictly by the CODELIX Human Resources committee for recruitment qualification, identity confirmation, and technical interview scheduling.
                  </p>
                  <p>
                    <strong>1.2 Mandatory White-Background Photo:</strong> In accordance with CODELIX international hiring standards, candidate photographs must be on a plain white background for official employee identity card and NDA credential generation.
                  </p>
                  <p>
                    <strong>1.3 Recruitment Scrutiny Rounds:</strong> Candidate applications advance through structured scrutiny stages: Screening, Shortlisted, Selected for Interview, Technical Round, Operational Round, HR Round, Interview Completed, and Contract Dispatch. Candidates can track their progress using their application reference number.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Support Actions */}
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Have Questions Regarding Our Policies?</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Our legal and client support teams respond to inquiries within 24 business hours.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('contact', { tab: 'quote' })}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Get a Free Quote
            </button>
            <a
              href="mailto:support@codelix.online"
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-all"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
