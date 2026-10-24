/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Complete Administration Portal & Website CMS
 * Full control over Pakistani Banks, Crypto USDT, Exchange Rate, Coupons & Targeted Emails,
 * Services CRUD, Offers CRUD, Orders Payment Verification, Careers Scrutiny & Contract Dispatch,
 * Timezone & Helpdesk Emails, and SMTP Gateway Settings.
 */

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  ShoppingBag,
  FileText,
  Users,
  Briefcase,
  MessageSquare,
  Globe,
  Mail,
  Settings,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Printer,
  Search,
  ExternalLink,
  Save,
  Send,
  Camera,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  HelpCircle,
  Building2,
  Coins,
  Copy,
  Check,
  CreditCard,
  Sparkles,
  Tag,
  Clock,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { EmailModal } from '../../components/EmailModal';
import { PrintInvoiceModal } from '../../components/PrintInvoiceModal';
import type {
  Order,
  Service,
  Offer,
  Complaint,
  Quotation,
  Inquiry,
  JobApplication,
  JobVacancy,
  Employee,
  EmailLog,
  SmtpSettings,
  CmsContent,
  PakistaniBank,
  CryptoWallet,
  CouponRecord,
  User,
} from '../../types';

interface AdminDashboardProps {
  onNavigate: (view: string, params?: any) => void;
  initialTab?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, initialTab = 'overview' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Data states
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [smtp, setSmtp] = useState<SmtpSettings | null>(null);
  const [cms, setCms] = useState<CmsContent | null>(null);
  const [customers, setCustomers] = useState<User[]>([]);

  // Payment & Currency states
  const [banks, setBanks] = useState<PakistaniBank[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [usdToPkrRate, setUsdToPkrRate] = useState<number>(271);
  const [newRateInput, setNewRateInput] = useState<number>(271);

  // Coupons state
  const [coupons, setCoupons] = useState<CouponRecord[]>([]);

  // Modals & Drawers
  const [selectedEmailForPreview, setSelectedEmailForPreview] = useState<EmailLog | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedProofOrder, setSelectedProofOrder] = useState<Order | null>(null);

  // Service Edit / Create Modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  // Offer Edit / Create Modal
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  // Bank Edit / Create Modal
  const [editingBank, setEditingBank] = useState<PakistaniBank | null>(null);
  const [isCreatingBank, setIsCreatingBank] = useState(false);

  // Crypto Edit / Create Modal
  const [editingCrypto, setEditingCrypto] = useState<CryptoWallet | null>(null);
  const [isCreatingCrypto, setIsCreatingCrypto] = useState(false);

  // Coupon Create Modal
  const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrder: 0,
    expiryDate: '2026-12-31',
    isExclusive: false,
    selectedCustomerEmails: [] as string[],
  });

  // Application Scrutiny Modal
  const [scrutinyApp, setScrutinyApp] = useState<JobApplication | null>(null);
  const [scrutinyForm, setScrutinyForm] = useState({
    status: 'Screening / Under Initial Review' as any,
    cvRemarks: '',
    backgroundRemarks: '',
    technicalRemarks: '',
    hrRemarks: '',
    candidateMessage: '',
    interviewDate: '',
  });

  // Hiring Form
  const [hiringForm, setHiringForm] = useState({
    employeeId: '',
    designation: '',
    department: 'Engineering',
    officeLocation: 'Islamabad Headquarters / Remote',
    salary: 'PKR 140,000 / month',
    joiningDate: '2026-04-01',
    contractText: 'Official CODELIX Software Engineering Employment Contract & Intellectual Property Non-Disclosure Agreement.',
  });

  // Order Confirmation modal state
  const [confirmingOrder, setConfirmingOrder] = useState<Order | null>(null);
  const [assignedEmpId, setAssignedEmpId] = useState('');
  const [targetEstDate, setTargetEstDate] = useState('2026-04-01');
  const [orderConfirmMsg, setOrderConfirmMsg] = useState('');

  // Payment Verification modal state
  const [verifyingOrder, setVerifyingOrder] = useState<Order | null>(null);
  const [paymentStatusOption, setPaymentStatusOption] = useState<'Verified' | 'Paid' | 'Rejected' | 'Verification in Progress'>('Verified');
  const [paymentVerificationNotes, setPaymentVerificationNotes] = useState('');

  // Toast & notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [smtpTestResult, setSmtpTestResult] = useState<string | null>(null);
  const [testEmailAddress, setTestEmailAddress] = useState('admin@codelix.online');
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  // Quote preparation state
  const [preparingQuote, setPreparingQuote] = useState<Quotation | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<number>(35000);
  const [quoteValidUntil, setQuoteValidUntil] = useState('2026-04-15');

  const loadAllData = () => {
    fetch('/api/metrics').then((r) => r.json()).then((d) => d.success && setMetrics(d.stats)).catch(() => {});
    fetch('/api/orders').then((r) => r.json()).then((d) => d.success && setOrders(d.orders)).catch(() => {});
    fetch('/api/services').then((r) => r.json()).then((d) => d.success && setServices(d.services)).catch(() => {});
    fetch('/api/offers').then((r) => r.json()).then((d) => d.success && setOffers(d.offers)).catch(() => {});
    fetch('/api/complaints').then((r) => r.json()).then((d) => d.success && setComplaints(d.complaints)).catch(() => {});
    fetch('/api/quotations').then((r) => r.json()).then((d) => d.success && setQuotations(d.quotations)).catch(() => {});
    fetch('/api/inquiries').then((r) => r.json()).then((d) => d.success && setInquiries(d.inquiries)).catch(() => {});
    fetch('/api/applications').then((r) => r.json()).then((d) => d.success && setApplications(d.applications)).catch(() => {});
    fetch('/api/vacancies').then((r) => r.json()).then((d) => d.success && setVacancies(d.vacancies)).catch(() => {});
    fetch('/api/employees').then((r) => r.json()).then((d) => d.success && setEmployees(d.employees)).catch(() => {});
    fetch('/api/customers').then((r) => r.json()).then((d) => d.success && setCustomers(d.customers)).catch(() => {});
    fetch('/api/emails').then((r) => r.json()).then((d) => d.success && setEmails(d.emails)).catch(() => {});
    fetch('/api/smtp').then((r) => r.json()).then((d) => d.success && setSmtp(d.smtp)).catch(() => {});
    fetch('/api/cms').then((r) => r.json()).then((d) => d.success && setCms(d.cms)).catch(() => {});
    fetch('/api/payment-methods').then((r) => r.json()).then((d) => {
      if (d.success) {
        setBanks(d.banks || []);
        setCryptoWallets(d.cryptoWallets || []);
        if (d.usdToPkrRate) {
          setUsdToPkrRate(d.usdToPkrRate);
          setNewRateInput(d.usdToPkrRate);
        }
      }
    }).catch(() => {});
    fetch('/api/coupons').then((r) => r.json()).then((d) => d.success && setCoupons(d.coupons)).catch(() => {});
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. UPDATE EXCHANGE RATE
  const handleUpdateExchangeRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/exchange-rate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: newRateInput }),
      });
      const data = await res.json();
      if (data.success) {
        setUsdToPkrRate(data.usdToPkrRate);
        showToast(`Exchange rate updated: 1 USD = ${data.usdToPkrRate} PKR (Locked for checkout automatic conversion).`);
      }
    } catch {
      showToast('Error updating exchange rate.');
    }
  };

  // 2. BANK MANAGEMENT
  const handleSaveBank = async (bankData: Partial<PakistaniBank>) => {
    try {
      const isNew = !editingBank?.id;
      const url = isNew ? '/api/payment-methods/banks' : `/api/payment-methods/banks/${editingBank.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingBank(false);
        setEditingBank(null);
        showToast(`Bank ${bankData.bankName} successfully saved!`);
        loadAllData();
      }
    } catch {
      showToast('Failed to save bank information.');
    }
  };

  const handleDeleteBank = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/payment-methods/banks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Bank ${name} deleted.`);
        loadAllData();
      }
    } catch {
      showToast('Error deleting bank.');
    }
  };

  // 3. CRYPTO WALLET MANAGEMENT
  const handleSaveCrypto = async (walletData: Partial<CryptoWallet>) => {
    try {
      const isNew = !editingCrypto?.id;
      const url = isNew ? '/api/payment-methods/crypto' : `/api/payment-methods/crypto/${editingCrypto.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(walletData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingCrypto(false);
        setEditingCrypto(null);
        showToast(`Crypto wallet ${walletData.network} saved!`);
        loadAllData();
      }
    } catch {
      showToast('Failed to save crypto wallet.');
    }
  };

  const handleDeleteCrypto = async (id: string, network: string) => {
    if (!confirm(`Delete wallet address for ${network}?`)) return;
    try {
      const res = await fetch(`/api/payment-methods/crypto/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Wallet for ${network} deleted.`);
        loadAllData();
      }
    } catch {
      showToast('Error deleting wallet.');
    }
  };

  // 4. COUPON CREATION & TARGETING
  const handleCreateCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCouponForm.code,
          title: newCouponForm.title,
          description: newCouponForm.description,
          discountType: newCouponForm.discountType,
          discountValue: Number(newCouponForm.discountValue),
          minOrder: Number(newCouponForm.minOrder),
          expiryDate: newCouponForm.expiryDate,
          isExclusive: newCouponForm.isExclusive,
          eligibleEmails: newCouponForm.isExclusive ? newCouponForm.selectedCustomerEmails : [],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingCoupon(false);
        setNewCouponForm({
          code: '',
          title: '',
          description: '',
          discountType: 'percentage',
          discountValue: 10,
          minOrder: 0,
          expiryDate: '2026-12-31',
          isExclusive: false,
          selectedCustomerEmails: [],
        });
        showToast(
          `Coupon ${data.coupon.code} created! ${
            data.coupon.isExclusive ? 'Notification emails dispatched to selected customers.' : 'Visible to all newly joined customers.'
          }`
        );
        loadAllData();
      } else {
        showToast(data.error || 'Failed to create coupon.');
      }
    } catch {
      showToast('Error submitting coupon.');
    }
  };

  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Coupon ${code} removed.`);
        loadAllData();
      }
    } catch {
      showToast('Error deleting coupon.');
    }
  };

  // 5. SERVICES CRUD
  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      const isNew = !editingService?.id;
      const url = isNew ? '/api/services' : `/api/services/${editingService.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingService(false);
        setEditingService(null);
        showToast(`Service "${serviceData.title}" saved successfully!`);
        loadAllData();
      }
    } catch {
      showToast('Error saving service.');
    }
  };

  const handleDeleteService = async (id: string, title: string) => {
    if (!confirm(`Delete service "${title}" and all its package tiers?`)) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Service "${title}" deleted.`);
        loadAllData();
      }
    } catch {
      showToast('Error deleting service.');
    }
  };

  // 6. OFFERS CRUD
  const handleSaveOffer = async (offerData: Partial<Offer>) => {
    try {
      const isNew = !editingOffer?.id;
      const url = isNew ? '/api/offers' : `/api/offers/${editingOffer.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });
      const data = await res.json();
      if (data.success) {
        setIsCreatingOffer(false);
        setEditingOffer(null);
        showToast(`Promotional offer "${offerData.title}" saved!`);
        loadAllData();
      }
    } catch {
      showToast('Error saving offer.');
    }
  };

  const handleDeleteOffer = async (id: string, title: string) => {
    if (!confirm(`Delete promotional package "${title}"?`)) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Offer "${title}" deleted.`);
        loadAllData();
      }
    } catch {
      showToast('Error deleting offer.');
    }
  };

  // 7. PAYMENT VERIFICATION
  const handlePaymentVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingOrder) return;

    try {
      const res = await fetch(`/api/orders/${verifyingOrder.id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: paymentStatusOption,
          paymentVerificationNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifyingOrder(null);
        showToast(`Order ${verifyingOrder.reference} marked as "${paymentStatusOption}". Client notified.`);
        loadAllData();
      }
    } catch {
      showToast('Error updating payment status.');
    }
  };

  // 8. CAREERS SCRUTINY & HIRING
  const handleScrutinyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrutinyApp) return;

    try {
      const res = await fetch(`/api/applications/${scrutinyApp.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scrutinyForm),
      });
      const data = await res.json();
      if (data.success) {
        setScrutinyApp(null);
        showToast(`Candidate status updated to "${scrutinyForm.status}". Email dispatched.`);
        loadAllData();
      }
    } catch {
      showToast('Error updating application remarks.');
    }
  };

  const handleHireCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrutinyApp) return;

    try {
      const res = await fetch(`/api/applications/${scrutinyApp.id}/hire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hiringForm),
      });
      const data = await res.json();
      if (data.success) {
        setScrutinyApp(null);
        showToast(`Official contract sent! Employee ID ${data.employee.employeeCode} enrolled in staff roster.`);
        loadAllData();
      }
    } catch {
      showToast('Error processing contract dispatch.');
    }
  };

  // 9. CMS CONTENT SAVE
  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;

    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Website content, timezone, and official helpdesk channels updated successfully!');
      }
    } catch {
      showToast('Failed to save CMS settings.');
    }
  };

  // 10. SMTP TEST & SAVE
  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtp) return;

    try {
      const res = await fetch('/api/smtp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtp),
      });
      const data = await res.json();
      if (data.success) {
        showToast('SMTP credentials and sender profile saved!');
      }
    } catch {
      showToast('Failed to save SMTP settings.');
    }
  };

  const handleTestSmtp = async () => {
    if (!smtp) return;
    setSmtpTestResult('Initiating handshake with ' + smtp.host + ':' + smtp.port + '...');

    try {
      const res = await fetch('/api/smtp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtp),
      });
      const data = await res.json();
      setSmtpTestResult(data.message || 'SMTP Handshake Verified');
    } catch {
      setSmtpTestResult('Connection failed. Verify host and port accessibility.');
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const res = await fetch('/api/smtp/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testRecipient: testEmailAddress }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message);
        loadAllData();
      }
    } catch {
      showToast('Failed to dispatch test email.');
    }
  };

  const adminNav = [
    { id: 'overview', label: 'Executive Dashboard', icon: Layers },
    { id: 'orders', label: 'Orders & Payments', count: orders.length, icon: TrendingUp },
    { id: 'payments', label: 'Payment Options & FX', count: banks.length + cryptoWallets.length, icon: CreditCard },
    { id: 'coupons', label: 'Coupons & Targeting', count: coupons.length, icon: Tag },
    { id: 'services', label: 'Services CMS', count: services.length, icon: ShoppingBag },
    { id: 'offers', label: 'Promotional Offers', count: offers.length, icon: FileText },
    { id: 'employees', label: 'Employee Roster', count: employees.length, icon: Users },
    { id: 'complaints', label: 'Complaints Center', count: complaints.length, icon: MessageSquare },
    { id: 'quotations', label: 'Quotes & Inquiries', count: quotations.length + inquiries.length, icon: HelpCircle },
    { id: 'careers', label: 'Careers & Scrutiny', count: applications.length, icon: Briefcase },
    { id: 'cms', label: 'Website Content & CMS', icon: Globe },
    { id: 'smtp', label: 'SMTP & Email Delivery', count: emails.length, icon: Mail },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      {/* Modals */}
      {selectedEmailForPreview && (
        <EmailModal
          email={selectedEmailForPreview}
          onClose={() => setSelectedEmailForPreview(null)}
        />
      )}

      {selectedOrderForInvoice && (
        <PrintInvoiceModal
          order={selectedOrderForInvoice}
          onClose={() => setSelectedOrderForInvoice(null)}
        />
      )}

      {/* Screenshot Preview Modal */}
      {selectedProofOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#0B192C]">
                  Payment Proof Screenshot — {selectedProofOrder.reference}
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  {selectedProofOrder.paymentMethodType === 'crypto'
                    ? `USDT (${selectedProofOrder.selectedCryptoNetwork}) - $${selectedProofOrder.amountInUsd}`
                    : `Pakistani Bank: ${selectedProofOrder.selectedBankName || 'Bank Transfer'}`}
                </span>
              </div>
              <button
                onClick={() => setSelectedProofOrder(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {selectedProofOrder.paymentProofScreenshot ? (
              <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[400px] flex items-center justify-center bg-slate-900">
                <img
                  src={selectedProofOrder.paymentProofScreenshot}
                  alt="Proof Screenshot"
                  className="max-h-[380px] w-auto object-contain"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No screenshot uploaded by client. Reference ID: {selectedProofOrder.transactionId || 'None'}
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-600 font-mono">
                Transaction ID: <strong>{selectedProofOrder.transactionId || 'Pending Input'}</strong>
              </span>
              <button
                onClick={() => {
                  setVerifyingOrder(selectedProofOrder);
                  setPaymentStatusOption('Verified');
                  setSelectedProofOrder(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                Verify Payment Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B192C] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="bg-[#0B192C] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-cyan-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-cyan-400 px-2.5 py-0.5 rounded-md">
                Super Administrator
              </span>
              <span className="text-xs text-cyan-200">CODELIX Central Governance</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                FX: 1 USD = {usdToPkrRate} PKR
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              CODELIX Master Management Platform
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Full control over Pakistani bank accounts, crypto wallets, coupons, services, offers, careers scrutiny, and SMTP delivery.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors border border-white/15"
            >
              Public Website
            </button>
            <button
              onClick={() => onNavigate('customer-dashboard')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors shadow-xs"
            >
              Client Portal
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-[#0B192C] text-cyan-300 shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          isActive ? 'bg-cyan-900/60 text-cyan-200' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Management Surface */}
          <div className="lg:col-span-9 space-y-6">
            {/* TAB 1: EXECUTIVE OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 6 Top Key Performance Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Total Orders</span>
                    <div className="text-3xl font-black text-slate-900 mt-1 font-mono">
                      {metrics?.totalOrders || orders.length}
                    </div>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      {orders.filter((o) => o.status === 'In Progress').length} In Progress
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Gross Revenue</span>
                    <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                      PKR {(metrics?.totalRevenue || 145000).toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ~${Math.round((metrics?.totalRevenue || 145000) / usdToPkrRate)} USD
                    </span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Pakistani Banks</span>
                    <div className="text-3xl font-black text-blue-600 mt-1 font-mono">
                      {banks.length}
                    </div>
                    <span className="text-[11px] text-slate-500">{cryptoWallets.length} Crypto Wallets</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Active Coupons</span>
                    <div className="text-3xl font-black text-purple-600 mt-1 font-mono">
                      {coupons.filter((c) => c.isActive).length}
                    </div>
                    <span className="text-[11px] text-slate-500">Vouchers & Target Lists</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Open Complaints</span>
                    <div className="text-3xl font-black text-amber-600 mt-1 font-mono">
                      {complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length}
                    </div>
                    <span className="text-[11px] text-slate-500">Resolution Pipeline</span>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Job Candidates</span>
                    <div className="text-3xl font-black text-indigo-600 mt-1 font-mono">
                      {applications.length}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {applications.filter((a) => a.status === 'Shortlisted').length} Shortlisted
                    </span>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-extrabold text-[#0B192C]">Recent Orders & Proofs</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                          <th className="py-2.5">Reference</th>
                          <th className="py-2.5">Client</th>
                          <th className="py-2.5">Method</th>
                          <th className="py-2.5">Total</th>
                          <th className="py-2.5">Payment</th>
                          <th className="py-2.5 text-right">Proof</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-50">
                            <td className="py-3 font-mono font-bold text-blue-600">{ord.reference}</td>
                            <td className="py-3 font-semibold text-slate-800">{ord.customerName}</td>
                            <td className="py-3 text-slate-600">
                              {ord.paymentMethodType === 'crypto' ? 'USDT Crypto' : 'Pakistani Bank'}
                            </td>
                            <td className="py-3 font-mono font-bold text-slate-900">
                              PKR {ord.total.toLocaleString()}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.paymentStatus === 'Rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {ord.paymentStatus || 'Pending'}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              {ord.paymentProofScreenshot ? (
                                <button
                                  onClick={() => setSelectedProofOrder(ord)}
                                  className="text-blue-600 hover:underline font-bold"
                                >
                                  View Screenshot
                                </button>
                              ) : (
                                <span className="text-slate-400">No upload</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ORDERS & PAYMENTS VERIFICATION */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0B192C]">Orders & Payment Verification</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verify bank transfer slips, USDT transaction hashes, assign engineers, and update milestones.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {ord.reference}
                          </span>
                          <span className="ml-2 font-bold text-slate-800">{ord.customerName}</span>
                          <span className="text-slate-500 text-[11px]"> ({ord.customerEmail})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            ord.paymentStatus === 'Paid' || ord.paymentStatus === 'Verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.paymentStatus === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            Payment: {ord.paymentStatus || 'Pending'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                            Project: {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Payment Details Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                          <span className="font-bold text-slate-800">
                            {ord.paymentMethodType === 'crypto'
                              ? `USDT (${ord.selectedCryptoNetwork || 'TRC20'})`
                              : `Pakistani Bank: ${ord.selectedBankName || 'Meezan / HBL'}`}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed Total</span>
                          <span className="font-mono font-black text-slate-900">
                            PKR {ord.total.toLocaleString()}{' '}
                            {ord.amountInUsd && <span className="text-emerald-600 font-bold">(${ord.amountInUsd} USD)</span>}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Transaction Reference</span>
                          <span className="font-mono text-slate-700 font-semibold break-all">
                            {ord.transactionId || 'None provided yet'}
                          </span>
                        </div>
                      </div>

                      {/* Customer remarks */}
                      {ord.customerRemarks && (
                        <div className="text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                          <strong>Client Requirements:</strong> "{ord.customerRemarks}"
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {ord.paymentProofScreenshot && (
                          <button
                            onClick={() => setSelectedProofOrder(ord)}
                            className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800"
                          >
                            Inspect Screenshot Slip
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setVerifyingOrder(ord);
                            setPaymentStatusOption('Verified');
                            setPaymentVerificationNotes(ord.paymentVerificationNotes || '');
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          Verify / Update Payment
                        </button>

                        <button
                          onClick={() => {
                            setConfirmingOrder(ord);
                            setAssignedEmpId(employees[0]?.id || '');
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                        >
                          Confirm & Assign Project
                        </button>

                        <button
                          onClick={() => setSelectedOrderForInvoice(ord)}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs"
                        >
                          Print Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: PAYMENT OPTIONS & FX RATE */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8">
                {/* 1 USD to PKR Exchange Rate Editor */}
                <div className="p-6 bg-gradient-to-r from-blue-900 via-slate-900 to-cyan-900 rounded-2xl text-white shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                        Real-Time Currency Conversion Engine
                      </span>
                      <h3 className="text-xl font-black text-white mt-0.5">
                        USD to PKR Exchange Rate (Currently: 1 USD = {usdToPkrRate} PKR)
                      </h3>
                      <p className="text-xs text-slate-300">
                        When clients pay via USDT / Crypto, this rate automatically calculates the exact USD charge. Clients cannot edit this rate.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateExchangeRate} className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 bg-white/10 p-1 rounded-xl border border-white/20">
                      <span className="px-3 text-xs font-bold text-slate-300">1 USD =</span>
                      <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={newRateInput}
                        onChange={(e) => setNewRateInput(Number(e.target.value))}
                        className="w-28 px-3 py-1.5 bg-white text-slate-900 font-mono font-black text-sm rounded-lg focus:outline-hidden"
                      />
                      <span className="pr-3 text-xs font-bold text-slate-300">PKR</span>
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Lock Exchange Rate</span>
                    </button>
                  </form>
                </div>

                {/* Pakistani Banks Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0B192C]">
                        Pakistani Commercial & Islamic Bank Accounts ({banks.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configure all Pakistani banks where clients can transfer PKR funds.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingBank({
                          id: '',
                          bankName: '',
                          accountTitle: 'CODELIX DIGITAL SOLUTIONS',
                          accountNumber: '',
                          iban: 'PK00XXXX0000000000000000',
                          category: 'Commercial Bank',
                          instructions: 'Transfer funds via Mobile App / Raast. Attach payment screenshot.',
                          isActive: true,
                        });
                        setIsCreatingBank(true);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Bank Account</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banks.map((b) => (
                      <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-slate-900 text-sm">{b.bankName}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                            {b.category}
                          </span>
                        </div>

                        <div className="space-y-1 font-mono text-[11px] text-slate-700">
                          <div>Title: <strong>{b.accountTitle}</strong></div>
                          <div>Acc #: <strong>{b.accountNumber}</strong></div>
                          <div className="break-all">IBAN: <strong>{b.iban}</strong></div>
                        </div>

                        <div className="text-[11px] text-slate-500">
                          {b.instructions}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                          <button
                            onClick={() => {
                              setEditingBank(b);
                              setIsCreatingBank(false);
                            }}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[11px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBank(b.id, b.bankName)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crypto Wallets Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0B192C]">
                        Crypto Wallets & USDT Networks ({cryptoWallets.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Admin USDT, BTC, and Ethereum deposit wallet addresses.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCrypto({
                          id: '',
                          symbol: 'USDT',
                          network: 'TRC20 (Tron Network - Low Gas)',
                          walletAddress: '',
                          instructions: 'Send USDT on TRC20 network. Price converted at 1 USD = 271 PKR.',
                          isActive: true,
                        });
                        setIsCreatingCrypto(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Crypto Wallet</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cryptoWallets.map((c) => (
                      <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-emerald-50/40 text-xs space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs px-2 py-0.5 rounded bg-emerald-600 text-white font-mono">
                              {c.symbol}
                            </span>
                            <span className="font-extrabold text-slate-900">{c.network}</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        </div>

                        <div className="p-2 bg-white rounded-lg border border-emerald-200 text-slate-800 font-mono text-[11px] break-all font-bold">
                          {c.walletAddress}
                        </div>

                        <div className="text-[11px] text-slate-600">
                          {c.instructions}
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200/50">
                          <button
                            onClick={() => {
                              setEditingCrypto(c);
                              setIsCreatingCrypto(false);
                            }}
                            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-[11px]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCrypto(c.id, c.network)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COUPONS & CUSTOMER TARGETING */}
            {activeTab === 'coupons' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0B192C]">Coupons, Discounts & Customer Targeting</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create public welcome vouchers or select specific customers to receive exclusive discount emails.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsCreatingCoupon(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create & Target Coupon</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="py-2.5">Code</th>
                        <th className="py-2.5">Title</th>
                        <th className="py-2.5">Discount</th>
                        <th className="py-2.5">Eligibility</th>
                        <th className="py-2.5">Expiry</th>
                        <th className="py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="py-3 font-mono font-black text-blue-600 text-sm">{c.code}</td>
                          <td className="py-3 font-semibold text-slate-800">{c.title}</td>
                          <td className="py-3 font-mono font-bold text-emerald-600">
                            {c.discountValue}{c.discountType === 'percentage' ? '%' : ' PKR'} OFF
                          </td>
                          <td className="py-3">
                            {c.isExclusive ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                                {c.eligibleEmails?.length || 0} Targeted Clients Only
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                                All Newly Joined Clients
                              </span>
                            )}
                          </td>
                          <td className="py-3 font-mono text-slate-500">{c.expiryDate}</td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c.id, c.code)}
                              className="text-red-600 hover:text-red-800 font-bold ml-2"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: SERVICES CMS */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0B192C]">Services Catalog & Pricing Packages</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Create, update, or remove core development offerings, descriptions, features, and package tiers.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingService({
                        id: '',
                        title: '',
                        slug: '',
                        category: 'Custom Software',
                        description: '',
                        icon: 'Code2',
                        features: ['Responsive UI', 'Database Integration', '1 Month Free Support'],
                        packages: [
                          { name: 'Starter', price: 15000, originalPrice: 22000, deliveryDays: 5, revisions: '3 Revisions', features: ['Core Pages', 'Responsive UI'] },
                          { name: 'Professional', price: 35000, originalPrice: 50000, deliveryDays: 10, revisions: '5 Revisions', features: ['Full Database', 'Admin Portal', 'Payment Setup'] },
                          { name: 'Enterprise', price: 75000, originalPrice: 110000, deliveryDays: 20, revisions: 'Unlimited', features: ['Custom Architecture', 'Mobile Apps Ready', 'VIP Support'] },
                        ],
                        addons: [
                          { id: 'a1', name: 'Priority Express Delivery (3 Days)', price: 8000 },
                          { id: 'a2', name: 'SEO & Google Schema Setup', price: 5000 },
                        ],
                        isActive: true,
                      });
                      setIsCreatingService(true);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Service</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                            {srv.category}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 mt-1">{srv.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{srv.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingService(srv);
                              setIsCreatingService(false);
                            }}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs"
                          >
                            Edit Service
                          </button>
                          <button
                            onClick={() => handleDeleteService(srv.id, srv.title)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Packages Table */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="bg-slate-100 text-slate-500 font-bold text-[10px] uppercase">
                              <th className="p-3">Package Tier</th>
                              <th className="p-3">Price (PKR)</th>
                              <th className="p-3">Delivery Days</th>
                              <th className="p-3">Revisions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {srv.packages.map((pkg, pidx) => (
                              <tr key={pidx}>
                                <td className="p-3 font-bold text-slate-800">{pkg.name}</td>
                                <td className="p-3 font-mono font-bold text-blue-600">
                                  PKR {pkg.price.toLocaleString()}
                                </td>
                                <td className="p-3 font-mono">{pkg.deliveryDays} Days</td>
                                <td className="p-3">{pkg.revisions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: PROMOTIONAL OFFERS */}
            {activeTab === 'offers' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-[#0B192C]">Promotional Offers & Slot Allocations</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Full rights to update promotional titles, prices, remaining seats/slots, and validity dates.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingOffer({
                        id: '',
                        title: 'Shopify Flash Launch Offer',
                        category: 'Shopify',
                        promotionalPrice: 7000,
                        originalPrice: 28000,
                        discountPercentage: 75,
                        totalQuantity: 20,
                        claimedQuantity: 5,
                        domainExtensions: ['.com', '.online', '.pk'],
                        features: ['Full Store Setup', 'Payment Gateway Integration', '30 Days Support'],
                        startDate: '2026-03-01',
                        endDate: '2026-12-31',
                        isActive: true,
                      });
                      setIsCreatingOffer(true);
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Offer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offers.map((off) => (
                    <div key={off.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md">
                            {off.category}
                          </span>
                          <h4 className="text-sm font-extrabold text-slate-900 mt-1">{off.title}</h4>
                        </div>
                        <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-mono">
                          {off.discountPercentage}% OFF
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 font-mono">
                        <span className="text-xl font-black text-slate-900">
                          PKR {off.promotionalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          PKR {off.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Slots Claimed: <strong>{off.claimedQuantity}</strong> / <strong>{off.totalQuantity}</strong></span>
                        <span className="font-bold text-red-600">{off.totalQuantity - off.claimedQuantity} Remaining</span>
                      </div>

                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (off.claimedQuantity / off.totalQuantity) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => {
                            setEditingOffer(off);
                            setIsCreatingOffer(false);
                          }}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
                        >
                          Edit Slots & Price
                        </button>
                        <button
                          onClick={() => handleDeleteOffer(off.id, off.title)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: EMPLOYEES ROSTER */}
            {activeTab === 'employees' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B192C]">Authorized Employee Roster ({employees.length})</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Engineers and leads with role-based access to update milestone percentages and execute project tasks.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {employees.map((emp) => (
                    <div key={emp.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <div className="flex justify-between items-center font-mono text-[10px] font-bold">
                        <span className="text-blue-600">{emp.employeeCode}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {emp.status}
                        </span>
                      </div>
                      <div className="font-extrabold text-slate-900 text-sm">{emp.fullName}</div>
                      <div className="text-slate-600 font-semibold">{emp.designation}</div>
                      <div className="text-slate-500">{emp.department}</div>
                      <div className="text-slate-600 font-mono text-[11px]">{emp.workEmail}</div>
                      {emp.officeLocation && (
                        <div className="text-slate-500 text-[10px]">Location: {emp.officeLocation}</div>
                      )}
                      <div className="pt-2 flex flex-wrap gap-1">
                        {emp.skills?.map((s, idx) => (
                          <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-[10px] border border-slate-200 font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: COMPLAINTS CENTER */}
            {activeTab === 'complaints' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="text-lg font-black text-[#0B192C]">Client Complaints Resolution Desk</h3>

                <div className="space-y-4">
                  {complaints.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-blue-600">{c.reference}</span>
                        <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                          {c.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{c.subject}</h4>
                      <p className="text-slate-600">"{c.description}"</p>
                      <div className="text-slate-500">
                        Client: {c.customerName} ({c.customerEmail}) | Priority: <strong>{c.priority}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: QUOTES & INQUIRIES */}
            {activeTab === 'quotations' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <h3 className="text-lg font-black text-[#0B192C]">Customer Quotation Requests</h3>

                <div className="space-y-4">
                  {quotations.map((q) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-3">
                      <div className="flex justify-between items-center font-mono">
                        <span className="font-bold text-blue-600">{q.reference}</span>
                        <span className="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800">
                          {q.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900">{q.serviceCategory}</h4>
                      <p className="text-slate-600 leading-relaxed">{q.description}</p>
                      <div className="text-slate-500 font-semibold">
                        Prospect: {q.name} ({q.email} | {q.phone}) | Budget: {q.budgetRange}
                      </div>

                      {q.status === 'Received' && (
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              setPreparingQuote(q);
                              setQuoteAmount(45000);
                            }}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs"
                          >
                            Prepare Formal Quotation
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 10: CAREERS & SCRUTINY PIPELINE */}
            {activeTab === 'careers' && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B192C]">Candidate Applications & Scrutiny Engine</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-stage evaluation: Screening, Rounds (Technical, Operational, HR), Candidate remarks, and automatic Employee ID contract dispatch.
                  </p>
                </div>

                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-3">
                        <div>
                          <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {app.reference}
                          </span>
                          <h4 className="text-base font-extrabold text-slate-900 mt-1">{app.vacancyTitle}</h4>
                          <div className="text-slate-600 mt-0.5">
                            Candidate: <strong>{app.fullName}</strong> ({app.email} | {app.phone})
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-blue-100 text-blue-800">
                          {app.status}
                        </span>
                      </div>

                      {/* Photo verification badge */}
                      <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                        <div className="w-12 h-14 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-400 shrink-0">
                          <Camera className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">
                            Passport Photo: {app.photoFileName}
                          </div>
                          <div className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>
                              Plain White Background Verified (Compliance Score:{' '}
                              {app.photoVerificationScore || 95}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remarks if any */}
                      {(app.cvRemarks || app.backgroundRemarks || app.technicalRemarks || app.hrRemarks) && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 space-y-1">
                          <span className="font-bold text-[11px] text-slate-800 uppercase block">Scrutiny Remarks:</span>
                          {app.cvRemarks && <div>CV: {app.cvRemarks}</div>}
                          {app.backgroundRemarks && <div>Background: {app.backgroundRemarks}</div>}
                          {app.technicalRemarks && <div>Technical: {app.technicalRemarks}</div>}
                          {app.hrRemarks && <div>HR: {app.hrRemarks}</div>}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            setScrutinyApp(app);
                            setScrutinyForm({
                              status: app.status || 'Screening / Under Initial Review',
                              cvRemarks: app.cvRemarks || '',
                              backgroundRemarks: app.backgroundRemarks || '',
                              technicalRemarks: app.technicalRemarks || '',
                              hrRemarks: app.hrRemarks || '',
                              candidateMessage: app.candidateMessage || '',
                              interviewDate: app.interviewDate || '',
                            });
                            setHiringForm({
                              employeeId: `CDX-EMP-${String(employees.length + 1).padStart(3, '0')}`,
                              designation: app.vacancyTitle,
                              department: 'Engineering',
                              officeLocation: 'Islamabad HQ / Remote',
                              salary: 'PKR 140,000 / month',
                              joiningDate: '2026-04-01',
                              contractText: 'Official CODELIX Software Engineering Employment Contract & Intellectual Property Non-Disclosure Agreement.',
                            });
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-xs flex items-center gap-1.5"
                        >
                          <UserCheck className="w-4 h-4" />
                          <span>Detailed Scrutiny & Status Pipeline</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 11: WEBSITE CONTENT CMS & TIMEPK */}
            {activeTab === 'cms' && cms && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B192C]">Live Website Content Management</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Edit brand copy, Timezone (PK +5), official helpdesk emails, and founder profiles.
                  </p>
                </div>

                <form onSubmit={handleSaveCms} className="space-y-6 text-xs">
                  {/* Timezone Selection (PKT +5 etc) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                      Website Timezone Configuration
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Timezone Region</label>
                        <select
                          value={cms.timezone?.code || 'PKT'}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'PKT') {
                              setCms({ ...cms, timezone: { code: 'PKT', offset: '+05:00', label: 'PKT (UTC+5 Pakistan Standard Time)' } });
                            } else if (val === 'GST') {
                              setCms({ ...cms, timezone: { code: 'GST', offset: '+04:00', label: 'GST (UTC+4 Gulf Standard Time)' } });
                            } else if (val === 'UTC') {
                              setCms({ ...cms, timezone: { code: 'UTC', offset: '+00:00', label: 'UTC (GMT London Time)' } });
                            } else if (val === 'EST') {
                              setCms({ ...cms, timezone: { code: 'EST', offset: '-05:00', label: 'EST (UTC-5 Eastern Standard Time)' } });
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                        >
                          <option value="PKT">Pakistan Standard Time (PKT / UTC+5)</option>
                          <option value="GST">Gulf Standard Time (GST / UTC+4 Dubai)</option>
                          <option value="UTC">Universal Time (UTC / GMT London)</option>
                          <option value="EST">Eastern Standard Time (EST / UTC-5 New York)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Active Timezone Label</label>
                        <input
                          type="text"
                          value={cms.timezone?.label || 'PKT (UTC+5 Pakistan Standard Time)'}
                          onChange={(e) => setCms({ ...cms, timezone: { ...(cms.timezone || { code: 'PKT', offset: '+05:00' }), label: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Official Helpdesk Emails */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                      Official Departmental Emails & Cybersecurity Escalation
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">1. Support Email</label>
                        <input
                          type="email"
                          value={cms.helpdeskEmails?.support || 'support@codelix.online'}
                          onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), support: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">2. Business & Other Email</label>
                        <input
                          type="email"
                          value={cms.helpdeskEmails?.business || 'business@codelix.online'}
                          onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), business: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">3. CEO Office Email</label>
                        <input
                          type="email"
                          value={cms.helpdeskEmails?.ceo || 'ceo@codelix.online'}
                          onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), ceo: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">4. Complaints Email</label>
                        <input
                          type="email"
                          value={cms.helpdeskEmails?.complaints || 'complaints@codelix.online'}
                          onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), complaints: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Cybersecurity Emergency Email</label>
                        <input
                          type="email"
                          value={cms.helpdeskEmails?.cybersecurity || 'cybersecurity@codelix.online'}
                          onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), cybersecurity: e.target.value } })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Escalation Backup Gmail 1 & 2</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={cms.helpdeskEmails?.escalationGmail1 || 'codelixhq@gmail.com'}
                            onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), escalationGmail1: e.target.value } })}
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                          />
                          <input
                            type="email"
                            value={cms.helpdeskEmails?.escalationGmail2 || 'codelixceo@gmail.com'}
                            onChange={(e) => setCms({ ...cms, helpdeskEmails: { ...(cms.helpdeskEmails || {} as any), escalationGmail2: e.target.value } })}
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand & Copy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Website Brand Name</label>
                      <input
                        type="text"
                        value={cms.websiteName}
                        onChange={(e) => setCms({ ...cms, websiteName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Tagline</label>
                      <input
                        type="text"
                        value={cms.tagline}
                        onChange={(e) => setCms({ ...cms, tagline: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hero Section Headline</label>
                    <input
                      type="text"
                      value={cms.heroHeadline}
                      onChange={(e) => setCms({ ...cms, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Hero Section Description</label>
                    <textarea
                      rows={3}
                      value={cms.heroDescription}
                      onChange={(e) => setCms({ ...cms, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Website Content Updates</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 12: SMTP CONFIG & EMAIL LOGS */}
            {activeTab === 'smtp' && smtp && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-lg font-black text-[#0B192C]">SMTP Server Configuration & Audit Logs</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Input your custom SMTP host, ports, username, and password credentials for authentic live delivery.
                  </p>
                </div>

                <form onSubmit={handleSaveSmtp} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  <span className="font-extrabold text-slate-800 uppercase tracking-wider block">
                    Active SMTP Gateway Settings
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={smtp.host}
                        onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Port</label>
                      <input
                        type="number"
                        value={smtp.port}
                        onChange={(e) => setSmtp({ ...smtp, port: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Encryption</label>
                      <select
                        value={smtp.encryption}
                        onChange={(e) => setSmtp({ ...smtp, encryption: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                      >
                        <option value="TLS">TLS (Port 587)</option>
                        <option value="SSL">SSL (Port 465)</option>
                        <option value="None">None (Port 25)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Username / Account</label>
                      <input
                        type="text"
                        value={smtp.username}
                        onChange={(e) => setSmtp({ ...smtp, username: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SMTP Password</label>
                      <div className="relative">
                        <input
                          type={showSmtpPassword ? 'text' : 'password'}
                          value={smtp.password || ''}
                          onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 pr-10 bg-white border border-slate-200 rounded-xl font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showSmtpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">From Name (Sender Title)</label>
                      <input
                        type="text"
                        value={smtp.fromName}
                        onChange={(e) => setSmtp({ ...smtp, fromName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">From Email</label>
                      <input
                        type="email"
                        value={smtp.fromEmail}
                        onChange={(e) => setSmtp({ ...smtp, fromEmail: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Reply-To Email</label>
                      <input
                        type="email"
                        value={smtp.replyTo}
                        onChange={(e) => setSmtp({ ...smtp, replyTo: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save SMTP Settings</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestSmtp}
                      className="px-4 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow-xs"
                    >
                      Test Connection Handshake
                    </button>

                    <div className="flex items-center gap-2">
                      <input
                        type="email"
                        placeholder="recipient@example.com"
                        value={testEmailAddress}
                        onChange={(e) => setTestEmailAddress(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs"
                      >
                        Dispatch Test Email
                      </button>
                    </div>
                  </div>

                  {smtpTestResult && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-mono">
                      {smtpTestResult}
                    </div>
                  )}
                </form>

                {/* Audit Email Logs */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      Dispatched Transactional Emails Log ({emails.length})
                    </h4>
                    <span className="text-[10px] text-slate-500">Click any row to view branded HTML template</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                    {emails.map((em) => (
                      <div
                        key={em.id}
                        onClick={() => setSelectedEmailForPreview(em)}
                        className="p-3.5 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div>
                            <div className="font-extrabold text-slate-900">{em.subject}</div>
                            <div className="text-[11px] text-slate-500">To: {em.recipient}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                            {em.templateType}
                          </span>
                          <span className="text-slate-400">{em.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT BANK MODAL */}
      {(isCreatingBank || editingBank) && editingBank && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <h3 className="font-black text-base text-[#0B192C]">
              {isCreatingBank ? 'Add Pakistani Bank Option' : `Edit ${editingBank.bankName}`}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={editingBank.bankName}
                  onChange={(e) => setEditingBank({ ...editingBank, bankName: e.target.value })}
                  placeholder="e.g. Meezan Bank Limited"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={editingBank.category}
                  onChange={(e) => setEditingBank({ ...editingBank, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Commercial Bank">Commercial Bank</option>
                  <option value="Islamic Bank">Islamic Bank</option>
                  <option value="Microfinance / Digital Wallet">Microfinance / Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Title</label>
                <input
                  type="text"
                  value={editingBank.accountTitle}
                  onChange={(e) => setEditingBank({ ...editingBank, accountTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number / Raast ID</label>
                  <input
                    type="text"
                    value={editingBank.accountNumber}
                    onChange={(e) => setEditingBank({ ...editingBank, accountNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Branch Code (Optional)</label>
                  <input
                    type="text"
                    value={editingBank.branchCode || ''}
                    onChange={(e) => setEditingBank({ ...editingBank, branchCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IBAN</label>
                <input
                  type="text"
                  value={editingBank.iban}
                  onChange={(e) => setEditingBank({ ...editingBank, iban: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Transfer Instructions</label>
                <textarea
                  rows={2}
                  value={editingBank.instructions}
                  onChange={(e) => setEditingBank({ ...editingBank, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsCreatingBank(false);
                  setEditingBank(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveBank(editingBank)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT CRYPTO WALLET MODAL */}
      {(isCreatingCrypto || editingCrypto) && editingCrypto && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <h3 className="font-black text-base text-[#0B192C]">
              {isCreatingCrypto ? 'Add Crypto Wallet Address' : `Edit ${editingCrypto.network}`}
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Asset Symbol</label>
                  <input
                    type="text"
                    value={editingCrypto.symbol}
                    onChange={(e) => setEditingCrypto({ ...editingCrypto, symbol: e.target.value.toUpperCase() })}
                    placeholder="USDT"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Network</label>
                  <input
                    type="text"
                    value={editingCrypto.network}
                    onChange={(e) => setEditingCrypto({ ...editingCrypto, network: e.target.value })}
                    placeholder="TRC20, BEP20, ERC20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={editingCrypto.walletAddress}
                  onChange={(e) => setEditingCrypto({ ...editingCrypto, walletAddress: e.target.value })}
                  placeholder="TYx78..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs break-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Client Deposit Instructions</label>
                <textarea
                  rows={2}
                  value={editingCrypto.instructions}
                  onChange={(e) => setEditingCrypto({ ...editingCrypto, instructions: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setIsCreatingCrypto(false);
                  setEditingCrypto(null);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveCrypto(editingCrypto)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Save Crypto Wallet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & TARGET COUPON MODAL */}
      {isCreatingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-base text-[#0B192C]">
              Create Coupon & Select Eligible Customers
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponForm.code}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIP25"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={newCouponForm.discountType}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed PKR Off</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCouponForm.discountValue}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, discountValue: Number(e.target.value) })}
                    placeholder="e.g. 15"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={newCouponForm.expiryDate}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Voucher Title</label>
                <input
                  type="text"
                  required
                  value={newCouponForm.title}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, title: e.target.value })}
                  placeholder="e.g. Valued Client Exclusive 25% Off"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newCouponForm.description}
                  onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                  placeholder="Special discount assigned by management"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* TARGETING CHECKBOX */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={newCouponForm.isExclusive}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, isExclusive: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Target Specific Registered Customers (Notification Email Sent Automatically)</span>
                </label>

                {newCouponForm.isExclusive ? (
                  <div className="mt-2 space-y-1.5 pl-6">
                    <span className="text-[11px] text-slate-500 block">
                      Select customers who will receive this coupon in email and see it at checkout:
                    </span>
                    <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-white space-y-1">
                      {customers.map((c) => {
                        const checked = newCouponForm.selectedCustomerEmails.includes(c.email);
                        return (
                          <label key={c.id} className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-slate-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewCouponForm({
                                    ...newCouponForm,
                                    selectedCustomerEmails: [...newCouponForm.selectedCustomerEmails, c.email],
                                  });
                                } else {
                                  setNewCouponForm({
                                    ...newCouponForm,
                                    selectedCustomerEmails: newCouponForm.selectedCustomerEmails.filter((em) => em !== c.email),
                                  });
                                }
                              }}
                            />
                            <span className="font-semibold">{c.name}</span>
                            <span className="text-slate-400 font-mono">({c.email})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-500 pl-6">
                    * If left unchecked, this coupon will be visible to all newly joined customers at checkout.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsCreatingCoupon(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCouponSubmit}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
              >
                Create & Dispatch Voucher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT STATUS VERIFICATION MODAL */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={handlePaymentVerificationSubmit} className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs">
            <h3 className="font-black text-base text-[#0B192C]">
              Verify Payment for {verifyingOrder.reference}
            </h3>

            <div>
              <span className="text-[11px] text-slate-500 block">Client:</span>
              <span className="font-bold text-slate-800">{verifyingOrder.customerName} ({verifyingOrder.customerEmail})</span>
            </div>

            <div>
              <span className="text-[11px] text-slate-500 block">Total Due:</span>
              <span className="font-mono font-bold text-slate-900">
                PKR {verifyingOrder.total.toLocaleString()}{' '}
                {verifyingOrder.amountInUsd && <span>(${verifyingOrder.amountInUsd} USDT)</span>}
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Set Payment Status</label>
              <select
                value={paymentStatusOption}
                onChange={(e) => setPaymentStatusOption(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
              >
                <option value="Verified">Verified (Proof Confirmed)</option>
                <option value="Paid">Paid (Full Funds Received)</option>
                <option value="Verification in Progress">Verification in Progress</option>
                <option value="Rejected">Rejected (Invalid Slip / Resubmit Requested)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Verification Remarks / Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Funds verified in Meezan Bank via 1Link reference #99281. Project cleared for assignment."
                value={paymentVerificationNotes}
                onChange={(e) => setPaymentVerificationNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setVerifyingOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
              >
                Save & Notify Client
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CANDIDATE SCRUTINY & PIPELINE MODAL */}
      {scrutinyApp && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-black text-base text-[#0B192C]">
                  Recruitment Scrutiny — {scrutinyApp.fullName}
                </h3>
                <span className="text-xs text-blue-600 font-mono">
                  {scrutinyApp.reference} | {scrutinyApp.vacancyTitle}
                </span>
              </div>
              <button
                onClick={() => setScrutinyApp(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Candidate summary */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>Email: <strong>{scrutinyApp.email}</strong></div>
              <div>Phone: <strong>{scrutinyApp.phone}</strong></div>
              <div>City: <strong>{scrutinyApp.city}, {scrutinyApp.country}</strong></div>
              <div>Education: <strong>{scrutinyApp.education}</strong></div>
            </div>

            {/* Scrutiny Form */}
            <form onSubmit={handleScrutinyUpdate} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Recruitment Pipeline Stage
                </label>
                <select
                  value={scrutinyForm.status}
                  onChange={(e) => setScrutinyForm({ ...scrutinyForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs"
                >
                  <option value="Application Submitted">Application Submitted</option>
                  <option value="Screening / Under Initial Review">Screening / Under Initial Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Selected for Interview">Selected for Interview</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="Operational Round">Operational Round</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Interview Completed">Interview Completed</option>
                  <option value="Selected">Selected</option>
                  <option value="Contract Sent / Hired">Contract Sent / Hired (Employee Onboarding)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CV & Portfolio Remarks</label>
                  <textarea
                    rows={2}
                    value={scrutinyForm.cvRemarks}
                    onChange={(e) => setScrutinyForm({ ...scrutinyForm, cvRemarks: e.target.value })}
                    placeholder="Evaluations on resume, projects, code architecture..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Background Check Remarks</label>
                  <textarea
                    rows={2}
                    value={scrutinyForm.backgroundRemarks}
                    onChange={(e) => setScrutinyForm({ ...scrutinyForm, backgroundRemarks: e.target.value })}
                    placeholder="Identity verification, academic background, reference check..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Technical Round Remarks</label>
                  <textarea
                    rows={2}
                    value={scrutinyForm.technicalRemarks}
                    onChange={(e) => setScrutinyForm({ ...scrutinyForm, technicalRemarks: e.target.value })}
                    placeholder="Code challenge results, system design, algorithm scores..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">HR & Cultural Fit Remarks</label>
                  <textarea
                    rows={2}
                    value={scrutinyForm.hrRemarks}
                    onChange={(e) => setScrutinyForm({ ...scrutinyForm, hrRemarks: e.target.value })}
                    placeholder="Communication, team collaboration, compensation alignment..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message to Candidate (Included in Notification Email)</label>
                <textarea
                  rows={2}
                  value={scrutinyForm.candidateMessage}
                  onChange={(e) => setScrutinyForm({ ...scrutinyForm, candidateMessage: e.target.value })}
                  placeholder="Official instructions for next steps..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* IF HIRED: ONBOARDING FIELDS */}
              {scrutinyForm.status === 'Contract Sent / Hired' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <span className="font-extrabold text-emerald-900 uppercase tracking-wider block">
                    Employee Onboarding & Contract Generation
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Assign Employee ID</label>
                      <input
                        type="text"
                        value={hiringForm.employeeId}
                        onChange={(e) => setHiringForm({ ...hiringForm, employeeId: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Official Designation</label>
                      <input
                        type="text"
                        value={hiringForm.designation}
                        onChange={(e) => setHiringForm({ ...hiringForm, designation: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Department</label>
                      <input
                        type="text"
                        value={hiringForm.department}
                        onChange={(e) => setHiringForm({ ...hiringForm, department: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Office Location</label>
                      <input
                        type="text"
                        value={hiringForm.officeLocation}
                        onChange={(e) => setHiringForm({ ...hiringForm, officeLocation: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Monthly Salary</label>
                      <input
                        type="text"
                        value={hiringForm.salary}
                        onChange={(e) => setHiringForm({ ...hiringForm, salary: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleHireCandidate}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Issue Employment Contract & Add to Employee Roster</span>
                  </button>
                </div>
              )}

              {scrutinyForm.status !== 'Contract Sent / Hired' && (
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setScrutinyApp(null)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                  >
                    Save Remarks & Update Candidate
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
