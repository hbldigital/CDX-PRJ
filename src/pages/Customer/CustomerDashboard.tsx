/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Customer Dashboard & Real-Time Project Tracking Portal
 */

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  Printer,
  ChevronRight,
  Plus,
  Send,
  ExternalLink,
  HelpCircle,
  Calendar,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrintInvoiceModal } from '../../components/PrintInvoiceModal';
import type { Order, Complaint, Quotation, Inquiry, DemoRequest, IdeaSubmission } from '../../types';

interface CustomerDashboardProps {
  onNavigate: (view: string, params?: any) => void;
  initialTab?: string;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ onNavigate, initialTab = 'overview' }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([]);

  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState<Order | null>(null);

  // New complaint form state
  const [showNewComplaintModal, setShowNewComplaintModal] = useState(false);
  const [cmpSubject, setCmpSubject] = useState('');
  const [cmpCategory, setCmpCategory] = useState('Project delay');
  const [cmpDescription, setCmpDescription] = useState('');
  const [cmpOrderRef, setCmpOrderRef] = useState('');
  const [cmpPriority, setCmpPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [cmpSuccess, setCmpSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.orders) {
          setOrders(d.orders);
          if (d.orders.length > 0 && !selectedProjectForView) {
            setSelectedProjectForView(d.orders[0]);
          }
        }
      })
      .catch((e) => console.error(e));

    fetch('/api/complaints')
      .then((res) => res.json())
      .then((d) => d.success && setComplaints(d.complaints))
      .catch((e) => console.error(e));

    fetch('/api/quotations')
      .then((res) => res.json())
      .then((d) => d.success && setQuotations(d.quotations))
      .catch((e) => console.error(e));

    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((d) => d.success && setInquiries(d.inquiries))
      .catch((e) => console.error(e));

    fetch('/api/demo-requests')
      .then((res) => res.json())
      .then((d) => d.success && setDemoRequests(d.demoRequests))
      .catch((e) => console.error(e));

    fetch('/api/ideas')
      .then((res) => res.json())
      .then((d) => d.success && setIdeas(d.ideas))
      .catch((e) => console.error(e));
  }, []);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpSubject || !cmpDescription) return;

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id,
          customerName: user?.name,
          customerEmail: user?.email,
          orderReference: cmpOrderRef,
          category: cmpCategory,
          subject: cmpSubject,
          description: cmpDescription,
          priority: cmpPriority,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCmpSuccess(data.reference);
        setComplaints((prev) => [data.complaint, ...prev]);
        setTimeout(() => {
          setShowNewComplaintModal(false);
          setCmpSuccess(null);
          setCmpSubject('');
          setCmpDescription('');
        }, 1500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Layers },
    { id: 'projects', label: 'Running Projects', count: orders.filter((o) => o.status === 'In Progress' || o.status === 'Confirmed').length, icon: TrendingUp },
    { id: 'orders', label: 'My Orders & Invoices', count: orders.length, icon: FileText },
    { id: 'complaints', label: 'Complaints & Support', count: complaints.length, icon: MessageSquare },
    { id: 'quotations', label: 'Quotations & Inquiries', count: quotations.length + inquiries.length, icon: HelpCircle },
    { id: 'profile', label: 'Profile & Security', icon: UserIcon },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      {/* Printable Invoice Modal */}
      {selectedOrderForInvoice && (
        <PrintInvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Greeting Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                Client Portal
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Account Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] mt-1">
              Welcome Back, {user?.name || 'Valued Client'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Registered Email: <span className="font-mono text-slate-700 font-semibold">{user?.email || 'hamza.client@example.com'}</span> | Official Slogan: <em>Building Digital Solutions.</em>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('services')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors"
            >
              Order New Service
            </button>
            <button
              onClick={() => {
                setShowNewComplaintModal(true);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors"
            >
              Submit Complaint
            </button>
          </div>
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Contact Box */}
            <div className="bg-gradient-to-br from-[#0B192C] to-[#0A3A6B] text-white p-5 rounded-2xl border border-cyan-500/20 shadow-sm text-xs space-y-2">
              <div className="text-cyan-300 font-extrabold uppercase text-[10px] tracking-wider">
                Dedicated Support
              </div>
              <div className="font-bold text-sm">Need Direct Assistance?</div>
              <p className="text-slate-300 text-[11px]">
                Call our technical desk directly or submit an official complaint ticket.
              </p>
              <div className="pt-2 font-mono font-bold text-cyan-200 text-sm">
                +1 902 903 0717
              </div>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* VIEW 1: OVERVIEW METRICS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Orders</span>
                    <div className="text-2xl font-black text-slate-900 mt-1 font-mono">{orders.length}</div>
                    <span className="text-[11px] text-blue-600 font-semibold">Active Client History</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Running Projects</span>
                    <div className="text-2xl font-black text-blue-600 mt-1 font-mono">
                      {orders.filter((o) => o.status === 'In Progress' || o.status === 'Confirmed').length}
                    </div>
                    <span className="text-[11px] text-slate-500">Live Milestones Tracked</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Open Complaints</span>
                    <div className="text-2xl font-black text-amber-600 mt-1 font-mono">
                      {complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length}
                    </div>
                    <span className="text-[11px] text-slate-500">Under Investigation</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Quotations & Demos</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                      {quotations.length + demoRequests.length}
                    </div>
                    <span className="text-[11px] text-slate-500">Proposals on File</span>
                  </div>
                </div>

                {/* Active Project Highlight Banner */}
                {selectedProjectForView && (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                            {selectedProjectForView.reference}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {selectedProjectForView.status}
                          </span>
                        </div>
                        <h3 className="text-xl font-extrabold text-[#0B192C] mt-1">
                          {selectedProjectForView.items[0]?.serviceTitle}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Assigned Lead: <strong>{selectedProjectForView.assignedEmployeeName || 'CODELIX Engineer'}</strong> | Estimated Completion:{' '}
                          <strong>{selectedProjectForView.estimatedCompletionDate || 'Under Schedule'}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-black text-blue-600 font-mono">
                          {selectedProjectForView.overallProgress}%
                        </div>
                        <span className="text-xs text-slate-400 font-bold uppercase">
                          {100 - selectedProjectForView.overallProgress}% Remaining
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-700"
                          style={{ width: `${selectedProjectForView.overallProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones Breakdown */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Milestone Schedule & Employee Updates
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProjectForView.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-3.5 rounded-xl border text-xs transition-colors ${
                              m.completed
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-slate-900">{m.title}</span>
                              <span className="font-mono font-bold text-[11px] text-blue-600">
                                {m.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full"
                                style={{ width: `${m.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chronological Timeline Audit */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Chronological Project Timeline
                      </h4>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedProjectForView.timeline
                          .filter((tl) => tl.isPublic !== false)
                          .map((tl) => (
                            <div key={tl.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                              <div className="flex justify-between items-center text-slate-400 font-mono text-[10px] mb-1">
                                <span className="font-bold text-blue-600">{tl.author} ({tl.role})</span>
                                <span>{tl.timestamp}</span>
                              </div>
                              <p className="text-slate-700 font-medium">{tl.message}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: RUNNING PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-black text-[#0B192C] mb-4">Live Project Status & Milestone Breakdown</h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400">
                      No active projects. Place a service order to begin!
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((ord) => (
                        <div key={ord.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                            <div>
                              <span className="font-mono text-xs font-bold text-blue-600">{ord.reference}</span>
                              <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                                {ord.items[0]?.serviceTitle}
                              </h4>
                              <div className="text-xs text-slate-500">
                                Assigned: {ord.assignedEmployeeName || 'Engineering Team'} | Target Delivery: {ord.estimatedCompletionDate || 'Scheduling'}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-2xl font-black font-mono text-blue-600">{ord.overallProgress}%</span>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">{ord.status}</div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full"
                              style={{ width: `${ord.overallProgress}%` }}
                            />
                          </div>

                          {/* Milestones list */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            {ord.milestones.map((m) => (
                              <div key={m.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                                <div className="flex justify-between font-semibold text-[11px]">
                                  <span className="truncate">{m.title}</span>
                                  <span className="font-mono text-blue-600">{m.progress}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 3: MY ORDERS & INVOICES */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black text-[#0B192C]">My Order History & Receipts</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Review all past orders, submitted requirements, and generate official printable PDF receipts.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="py-3">Order Ref</th>
                        <th className="py-3">Service Package</th>
                        <th className="py-3">Date</th>
                        <th className="py-3">Total Billed</th>
                        <th className="py-3">Payment Method</th>
                        <th className="py-3">Payment Status</th>
                        <th className="py-3">Project Status</th>
                        <th className="py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-bold text-blue-600">{ord.reference}</td>
                          <td className="py-3 font-semibold text-slate-800">
                            {ord.items[0]?.serviceTitle}
                            <span className="block text-[11px] text-slate-500 font-normal">
                              {ord.items[0]?.packageName}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">{ord.createdAt.substring(0, 10)}</td>
                          <td className="py-3 font-mono font-bold text-slate-900">
                            {ord.currency} {ord.total.toLocaleString()}
                            {ord.amountInUsd && (
                              <span className="block text-[11px] text-emerald-600 font-semibold">
                                (${ord.amountInUsd} USDT)
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-slate-700">
                            <span className="font-semibold block">
                              {ord.paymentMethodType === 'crypto' ? 'USDT Crypto' : 'Pakistani Bank'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {ord.paymentMethodType === 'crypto'
                                ? ord.selectedCryptoNetwork || 'TRC20'
                                : ord.selectedBankName || 'Meezan / HBL'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.paymentStatus === 'Rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.paymentStatus || 'Pending'}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrderForInvoice(ord)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors"
                            >
                              <Printer className="w-3 h-3 text-blue-600" />
                              <span>Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW 4: COMPLAINTS & SUPPORT */}
            {activeTab === 'complaints' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-black text-[#0B192C]">Complaints & Dispute Resolution</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Track open cases with guaranteed unique reference IDs and audit response logs.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowNewComplaintModal(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Submit New Complaint</span>
                    </button>
                  </div>

                  {complaints.length === 0 ? (
                    <div className="text-center py-12 text-xs text-slate-400">
                      No complaints registered. All services operating normally!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {complaints.map((c) => (
                        <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                                  {c.reference}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {c.category}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                                  Priority: {c.priority}
                                </span>
                              </div>
                              <h4 className="text-base font-extrabold text-slate-900 mt-1">{c.subject}</h4>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                c.status === 'Resolved' || c.status === 'Closed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>

                          {/* Responses history */}
                          {c.publicNotes && c.publicNotes.length > 0 && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                Resolution Updates:
                              </span>
                              {c.publicNotes.map((note, nidx) => (
                                <div key={nidx} className="text-xs text-slate-700">
                                  <span className="font-bold text-blue-600">{note.author}</span>{' '}
                                  <span className="text-[10px] text-slate-400">({note.timestamp}):</span>
                                  <div className="mt-0.5 pl-2 border-l-2 border-blue-400">{note.message}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 5: QUOTATIONS, INQUIRIES, DEMOS */}
            {activeTab === 'quotations' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-black text-[#0B192C] mb-4">Official Quotations & Inquiries</h3>

                  <div className="space-y-4">
                    {quotations.map((q) => (
                      <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-xs font-bold text-blue-600">{q.reference}</span>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                            {q.status}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900">{q.serviceCategory}</h4>
                        <p className="text-xs text-slate-600">{q.description}</p>
                        {q.quoteAmount && (
                          <div className="font-mono text-sm font-bold text-emerald-600">
                            Quote Amount: PKR {q.quoteAmount.toLocaleString()} (Valid until {q.validUntil})
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: PROFILE & SECURITY */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="text-lg font-black text-[#0B192C]">Client Account & Security Settings</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      disabled
                      value={user?.name || 'Hamza Khan'}
                      className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Registered Email</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || 'hamza.client@example.com'}
                      className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Contact Phone</label>
                    <input
                      type="text"
                      disabled
                      value={user?.phone || '+92 300 1234567'}
                      className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value={user?.country || 'Pakistan'}
                      className="w-full px-3 py-2 bg-slate-100 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-500">
                    Need to update your email or primary phone? Submit a ticket under{' '}
                    <button
                      onClick={() => setActiveTab('complaints')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Complaints & Support
                    </button>
                    .
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Complaint Modal */}
      {showNewComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200">
            <h3 className="text-lg font-extrabold text-[#0B192C] mb-1">Submit an Official Complaint</h3>
            <p className="text-xs text-slate-500 mb-4">
              A unique reference number (e.g. CDX-CMP-2026-XXXXXX) will be generated and tracked.
            </p>

            {cmpSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-800 text-center font-bold text-xs space-y-1">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600 mb-1" />
                <div>Complaint Logged: {cmpSuccess}</div>
                <div className="text-[11px] font-normal">Notification dispatched to support team.</div>
              </div>
            ) : (
              <form onSubmit={handleCreateComplaint} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Complaint Category</label>
                  <select
                    value={cmpCategory}
                    onChange={(e) => setCmpCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  >
                    <option value="Project delay">Project delay</option>
                    <option value="Quality issue">Quality issue</option>
                    <option value="Communication issue">Communication issue</option>
                    <option value="Billing or payment">Billing or payment</option>
                    <option value="Incorrect deliverables">Incorrect deliverables</option>
                    <option value="Technical problem">Technical problem</option>
                    <option value="Scope disagreement">Scope disagreement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Related Order Ref (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. CDX-ORD-2026-000101"
                    value={cmpOrderRef}
                    onChange={(e) => setCmpOrderRef(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="Brief summary of the issue"
                    value={cmpSubject}
                    onChange={(e) => setCmpSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the complaint with relevant dates or milestones..."
                    value={cmpDescription}
                    onChange={(e) => setCmpDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewComplaintModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Register Complaint
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
