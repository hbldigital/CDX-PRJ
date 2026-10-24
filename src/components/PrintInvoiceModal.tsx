/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Printable Order Invoice / Project Receipt Modal
 */

import React from 'react';
import { X, Printer, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import type { Order } from '../types';

interface PrintInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">CODELIX Official Service Receipt</span>
            <span className="text-xs bg-blue-100 text-blue-700 font-mono px-2 py-0.5 rounded-full font-bold">
              {order.reference}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 bg-white text-slate-900 font-sans">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <Logo size="md" />
              <div className="text-xs text-slate-500 mt-3 space-y-0.5">
                <div>https://codelix.online</div>
                <div>+1 902 903 0717 | contact@codelix.online</div>
                <div>Social: @codelixhq | LinkedIn: CODELIX</div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-2xl font-black text-[#0B192C] tracking-tight">SERVICE INVOICE</div>
              <div className="text-xs font-mono font-bold text-blue-600 mt-1">
                Ref: {order.reference}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Date: {order.createdAt.substring(0, 10)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Payment: {order.paymentStatus.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To</div>
              <div className="font-extrabold text-slate-900 text-sm">{order.customerName}</div>
              <div className="text-slate-600">{order.customerEmail}</div>
              <div className="text-slate-600">{order.customerPhone}</div>
              {order.businessName && (
                <div className="font-semibold text-blue-600 mt-1">Company: {order.businessName}</div>
              )}
            </div>

            <div className="sm:text-right">
              <div className="font-bold text-slate-400 uppercase tracking-wider mb-1">Project Particulars</div>
              <div className="text-slate-700">Status: <span className="font-bold text-slate-900">{order.status}</span></div>
              <div className="text-slate-700">Assigned Team: <span className="font-bold">{order.assignedEmployeeName || 'CODELIX Core Team'}</span></div>
              {order.estimatedCompletionDate && (
                <div className="text-slate-700">Target Delivery: <span className="font-bold">{order.estimatedCompletionDate}</span></div>
              )}
              {order.websiteUrl && (
                <div className="text-slate-600 truncate">Website: {order.websiteUrl}</div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2">Service & Package Specification</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-3">
                    <td className="py-3">
                      <div className="font-bold text-slate-900 text-sm">{item.serviceTitle}</div>
                      <div className="text-slate-500 font-medium">{item.packageName}</div>
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-1 space-y-0.5 text-slate-600">
                          {item.addons.map((a, aidx) => (
                            <div key={aidx} className="flex items-center gap-1 text-[11px] text-blue-600">
                              <span>+ Add-on: {a.name}</span>
                              <span className="font-mono">({order.currency} {a.price.toLocaleString()})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-slate-700">
                      {order.currency} {item.price.toLocaleString()}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900">
                      {order.currency}{' '}
                      {(
                        item.price * item.quantity +
                        (item.addons ? item.addons.reduce((s, a) => s + a.price, 0) * item.quantity : 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-slate-500 max-w-sm">
              <div className="font-bold text-slate-700 mb-1">Customer Instructions / Remarks:</div>
              <div className="italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                "{order.customerRemarks || 'Standard development according to package specification.'}"
              </div>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{order.currency} {order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promotional Discount:</span>
                  <span className="font-mono">- {order.currency} {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Amount:</span>
                <span className="font-mono text-blue-600">
                  {order.currency} {order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-slate-700">
              Thank you for trusting CODELIX — Building Digital Solutions
            </div>
            <div>
              Computer-generated official receipt. For questions or adjustments, contact us at contact@codelix.online or +1 902 903 0717.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
