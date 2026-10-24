/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Employee Workspace & Project Milestone Progress Editor
 */

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Clock,
  MessageSquare,
  Save,
  Send,
  AlertCircle,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculateProjectProgress } from '../../utils/businessLogic';
import type { Order, Complaint, Milestone } from '../../types';

interface EmployeeDashboardProps {
  onNavigate: (view: string, params?: any) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Milestone edit state
  const [editingMilestones, setEditingMilestones] = useState<Milestone[]>([]);
  const [progressNote, setProgressNote] = useState('');
  const [isPublicNote, setIsPublicNote] = useState(true);
  const [newEstDate, setNewEstDate] = useState('');
  const [newStatus, setNewStatus] = useState<any>('');

  const [saving, setSaving] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Complaints reply state
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [cmpReply, setCmpReply] = useState('');
  const [cmpInternalNote, setCmpInternalNote] = useState('');
  const [cmpStatus, setCmpStatus] = useState<any>('Investigation in Progress');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.orders) {
          setOrders(d.orders);
          if (d.orders.length > 0) {
            setSelectedOrder(d.orders[0]);
            setEditingMilestones(d.orders[0].milestones || []);
            setNewEstDate(d.orders[0].estimatedCompletionDate || '');
            setNewStatus(d.orders[0].status);
          }
        }
      })
      .catch((e) => console.error(e));

    fetch('/api/complaints')
      .then((res) => res.json())
      .then((d) => {
        if (d.success && d.complaints) {
          setComplaints(d.complaints);
          if (d.complaints.length > 0) {
            setSelectedComplaint(d.complaints[0]);
            setCmpStatus(d.complaints[0].status);
          }
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditingMilestones(JSON.parse(JSON.stringify(order.milestones || [])));
    setNewEstDate(order.estimatedCompletionDate || '');
    setNewStatus(order.status);
    setProgressNote('');
  };

  const handleMilestoneProgressChange = (idx: number, progressVal: number) => {
    const val = Math.max(0, Math.min(100, Number(progressVal) || 0));
    setEditingMilestones((prev) => {
      const copy = [...prev];
      copy[idx] = {
        ...copy[idx],
        progress: val,
        completed: val === 100,
      };
      return copy;
    });
  };

  const handleSaveProjectUpdates = async () => {
    if (!selectedOrder) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}/milestones`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestones: editingMilestones,
          notes: progressNote.trim() || undefined,
          status: newStatus,
          newEstimatedDate: newEstDate || undefined,
          author: user?.name || 'Zubair Ahmed',
          role: 'Employee / Engineer',
          isPublic: isPublicNote,
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (data.success && data.order) {
        setSelectedOrder(data.order);
        setOrders((prev) => prev.map((o) => (o.id === data.order.id ? data.order : o)));
        setProgressNote('');
        setSuccessToast('Milestone progress and project updates saved! Client notified.');
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch {
      setSaving(false);
    }
  };

  const handleSaveComplaintReply = async () => {
    if (!selectedComplaint) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: cmpStatus,
          publicNote: cmpReply.trim() || undefined,
          internalNote: cmpInternalNote.trim() || undefined,
          author: user?.name || 'Engineer Zubair Ahmed',
        }),
      });

      const data = await res.json();
      setSaving(false);

      if (data.success && data.complaint) {
        setSelectedComplaint(data.complaint);
        setComplaints((prev) => prev.map((c) => (c.id === data.complaint.id ? data.complaint : c)));
        setCmpReply('');
        setCmpInternalNote('');
        setSuccessToast('Complaint updated and response logged.');
        setTimeout(() => setSuccessToast(null), 3000);
      }
    } catch {
      setSaving(false);
    }
  };

  const calculated = calculateProjectProgress(editingMilestones);

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      {/* Toast Alert */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Workspace Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-white bg-blue-600 px-2.5 py-0.5 rounded-md">
                Employee Workspace
              </span>
              <span className="text-xs text-slate-500 font-mono">Code: CDX-EMP-001</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] mt-1">
              Staff Portal: {user?.name || 'Zubair Ahmed'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Designation: <strong>Lead Full Stack & PHP Architect</strong> | Active Assigned Projects:{' '}
              <strong className="text-blue-600 font-mono">{orders.length}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('customer-dashboard')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors"
            >
              View Client's Perspective
            </button>
          </div>
        </div>

        {/* 2-Column Work Surface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Assigned Project Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Assigned Projects & Work Orders ({orders.length})
              </h3>

              <div className="space-y-2">
                {orders.map((ord) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      onClick={() => handleSelectOrder(ord)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-400 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-mono font-bold text-blue-600">{ord.reference}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {ord.status}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900 line-clamp-1">
                        {ord.items[0]?.serviceTitle}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Client: {ord.customerName} ({ord.customerPhone})
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Progress:</span>
                        <span className="font-bold text-blue-600">{ord.overallProgress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Assigned Complaints Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
                Assigned Support Tickets ({complaints.length})
              </h3>
              <div className="space-y-2">
                {complaints.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedComplaint(c);
                      setCmpStatus(c.status);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedComplaint?.id === c.id
                        ? 'bg-amber-50/80 border-amber-400'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between font-mono text-[10px] font-bold text-slate-500">
                      <span>{c.reference}</span>
                      <span className="text-amber-700">{c.status}</span>
                    </div>
                    <div className="font-bold text-slate-900 mt-1 line-clamp-1">{c.subject}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Milestone Editor */}
          <div className="lg:col-span-8 space-y-6">
            {selectedOrder && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      {selectedOrder.reference}
                    </span>
                    <h2 className="text-xl font-black text-[#0B192C] mt-1">
                      {selectedOrder.items[0]?.serviceTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Client: <strong>{selectedOrder.customerName}</strong> | Remarks: "{selectedOrder.customerRemarks}"
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Calculated Weighted Progress
                    </span>
                    <div className="text-3xl font-black text-blue-600 font-mono">
                      {calculated.overallProgress}%
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">
                      {calculated.remainingProgress}% Remaining
                    </span>
                  </div>
                </div>

                {/* Milestone Sliders */}
                <div className="space-y-4">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Milestone Progress Percentages</span>
                    <span className="text-[11px] text-blue-600 lowercase font-medium">
                      Percentages directly affect client dashboard
                    </span>
                  </h3>

                  <div className="space-y-3">
                    {editingMilestones.map((m, idx) => (
                      <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{m.title}</span>
                            <span className="text-slate-500 text-[11px] ml-2 font-mono">
                              (Weight: {m.weight}%)
                            </span>
                          </div>
                          <span className="font-mono font-bold text-sm text-blue-600">
                            {m.progress}%
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={m.progress}
                            onChange={(e) => handleMilestoneProgressChange(idx, Number(e.target.value))}
                            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={m.progress}
                            onChange={(e) => handleMilestoneProgressChange(idx, Number(e.target.value))}
                            className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status & Deadline adjustments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Awaiting Customer Feedback">Awaiting Customer Feedback</option>
                      <option value="Revision in Progress">Revision in Progress</option>
                      <option value="Completed">Completed (100%)</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Delivery Date
                    </label>
                    <input
                      type="date"
                      value={newEstDate}
                      onChange={(e) => setNewEstDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Progress Update Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Add Chronological Progress Note / Client Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Completed initial layout design and database schema. Now beginning API endpoint integration..."
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={isPublicNote}
                        onChange={(e) => setIsPublicNote(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-600">
                        Visible to customer in portal and logged via automated email update
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Save Button */}
                <div className="pt-2">
                  <button
                    onClick={handleSaveProjectUpdates}
                    disabled={saving}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Publishing Updates...' : 'Publish Project Milestone Updates'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Complaint Reply Box */}
            {selectedComplaint && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-bold text-amber-600">
                    {selectedComplaint.reference}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B192C] mt-0.5">
                    Resolve Support Case: {selectedComplaint.subject}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Client: {selectedComplaint.customerName} ({selectedComplaint.customerEmail})
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700">
                  <strong>Client Message:</strong> "{selectedComplaint.description}"
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ticket Status</label>
                    <select
                      value={cmpStatus}
                      onChange={(e) => setCmpStatus(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    >
                      <option value="Investigation in Progress">Investigation in Progress</option>
                      <option value="Resolution Proposed">Resolution Proposed</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Public Response (Visible to client & emailed)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detail the actions taken to address the client's concern..."
                    value={cmpReply}
                    onChange={(e) => setCmpReply(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Private Staff Internal Note (Hidden from client)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Internal technical details for engineering team only..."
                    value={cmpInternalNote}
                    onChange={(e) => setCmpInternalNote(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <button
                  onClick={handleSaveComplaintReply}
                  disabled={saving}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-colors"
                >
                  Save Ticket Response
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
