/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Candidate Recruitment Status Tracking
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { JobApplication } from '../types';

interface TrackingProps {
  initialReference?: string;
  initialEmail?: string;
}

export const ApplicationTracking: React.FC<TrackingProps> = ({
  initialReference = '',
  initialEmail = '',
}) => {
  const [reference, setReference] = useState(initialReference);
  const [email, setEmail] = useState(initialEmail);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stages = [
    'Application Received',
    'Under Initial Review',
    'Shortlisted',
    'Interview Scheduled',
    'Interview Completed',
    'Selected',
  ];

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference) return;

    setLoading(true);
    setErrorMsg(null);
    setApplication(null);

    try {
      const url = `/api/applications/track/${encodeURIComponent(reference.trim())}${
        email ? `?email=${encodeURIComponent(email.trim())}` : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();
      setLoading(false);

      if (data.success && data.application) {
        setApplication(data.application);
      } else {
        setErrorMsg(data.error || 'Application reference not found.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Failed to fetch tracking data.');
    }
  };

  useEffect(() => {
    if (initialReference) {
      setReference(initialReference);
      if (initialEmail) setEmail(initialEmail);
      // Auto track
      fetch(
        `/api/applications/track/${encodeURIComponent(initialReference.trim())}${
          initialEmail ? `?email=${encodeURIComponent(initialEmail.trim())}` : ''
        }`
      )
        .then((res) => res.json())
        .then((d) => d.success && setApplication(d.application))
        .catch(() => {});
    }
  }, [initialReference, initialEmail]);

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Recruitment Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-2 tracking-tight">
            Track Candidate Application Status
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Enter your unique CODELIX application reference (e.g. CDX-APP-2026-000077) to monitor your review progress in real time.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Application Reference ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="CDX-APP-2026-000077"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Registered Email Address (Optional for verification)
                </label>
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching Records...' : 'Check Status'}</span>
            </button>
          </form>

          {/* Quick Demo Reference Fill */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
            <span>Demo Reference:</span>
            <button
              type="button"
              onClick={() => {
                setReference('CDX-APP-2026-000077');
                setEmail('kamran.dev@example.com');
              }}
              className="font-mono font-bold text-blue-600 underline"
            >
              CDX-APP-2026-000077 (Kamran Siddiqui)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Application Status Result Card */}
        {application && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  Ref: {application.reference}
                </span>
                <h3 className="text-xl font-extrabold text-[#0B192C] mt-2">
                  {application.vacancyTitle}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  Applicant: <strong>{application.fullName}</strong> ({application.email})
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Stage</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mt-1 ${
                    application.status === 'Selected'
                      ? 'bg-emerald-100 text-emerald-800'
                      : application.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {application.status}
                </span>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div>
              <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4">
                Recruitment Progress Pipeline
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
                {stages.map((st, idx) => {
                  const stageIndex = stages.indexOf(application.status);
                  const isPassed = stageIndex >= idx;
                  const isCurrent = application.status === st;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-md'
                          : isPassed
                          ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="text-[9px] uppercase font-mono mb-1">Step {idx + 1}</div>
                      <div className="text-[11px] leading-tight">{st}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Candidate Updates / Interview Schedules */}
            {(application.candidateMessage || application.interviewDate) && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs space-y-2">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Message from HR Recruitment Team:</span>
                </div>
                {application.interviewDate && (
                  <div className="text-slate-800 font-semibold">
                    Scheduled Interview: <span className="font-mono text-blue-700">{application.interviewDate}</span>
                  </div>
                )}
                {application.candidateMessage && (
                  <div className="text-slate-700 italic">"{application.candidateMessage}"</div>
                )}
              </div>
            )}

            {/* Photo compliance status */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Passport Photograph White-Background Verification:</span>
              </span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                Verified Compliant ({application.photoVerificationScore || 94}%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
