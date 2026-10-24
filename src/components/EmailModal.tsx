/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Branded HTML Email Preview Modal
 */

import React from 'react';
import { X, Mail, CheckCircle2, Shield, Calendar, ExternalLink } from 'lucide-react';
import { Logo } from './Logo';
import type { EmailLog } from '../types';

interface EmailModalProps {
  email: EmailLog | null;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-sm text-slate-800">CODELIX Automated SMTP Email Preview</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Meta Bar */}
        <div className="p-4 px-6 bg-slate-100/70 border-b border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">To:</span>
            <span className="font-bold text-slate-800 font-mono">{email.recipient}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Subject:</span>
            <span className="font-bold text-slate-900">{email.subject}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Sent At:</span>
            <span className="text-slate-600">{email.timestamp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Status:</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              {email.status}
            </span>
          </div>
        </div>

        {/* Email Body Template */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            {/* Template Header */}
            <div className="text-center pb-4 border-b border-slate-100">
              <Logo size="md" variant="vertical" />
            </div>

            {/* Template Heading */}
            <div>
              <h2 className="text-lg font-extrabold text-[#0B192C]">{email.subject}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Official Transactional Notification from CODELIX Solutions
              </p>
            </div>

            {/* Template Message Content */}
            <div className="text-sm text-slate-700 leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-100/80 font-sans">
              {email.contentPreview}
            </div>

            {/* Call to action simulation */}
            <div className="text-center pt-2">
              <span className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm uppercase tracking-wider">
                Access Client Portal
              </span>
            </div>

            {/* Template Footer */}
            <div className="pt-6 border-t border-slate-100 text-center space-y-2 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-600">
                CODELIX — Building Digital Solutions
              </div>
              <div>Official Website: https://codelix.online | Support: +1 902 903 0717</div>
              <div>Social: @codelixhq (Instagram, X, TikTok) | LinkedIn: CODELIX</div>
              <div className="text-[10px] text-slate-400">
                This is an automated message sent securely. Please do not reply directly with sensitive passwords.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 px-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
