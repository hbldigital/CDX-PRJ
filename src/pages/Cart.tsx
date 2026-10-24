/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Shopping Cart, Multi-Payment (PK Pakistani Banks + USDT Crypto) & Checkout Engine
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  Coins,
  Copy,
  Check,
  CreditCard,
  Sparkles,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PrintInvoiceModal } from '../components/PrintInvoiceModal';
import type { PakistaniBank, CryptoWallet, CouponRecord } from '../types';

interface CartProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    discount,
    total,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponApplied,
    couponError,
    clearCart,
  } = useCart();
  const { user } = useAuth();

  // Coupon state
  const [inputCoupon, setInputCoupon] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<CouponRecord[]>([]);

  // Payment states
  const [paymentType, setPaymentType] = useState<'bank' | 'crypto'>('bank');
  const [banks, setBanks] = useState<PakistaniBank[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('');
  const [usdToPkrRate, setUsdToPkrRate] = useState<number>(271);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Verification details
  const [transactionId, setTransactionId] = useState('');
  const [paymentProofDataUrl, setPaymentProofDataUrl] = useState<string | null>(null);
  const [paymentProofFileName, setPaymentProofFileName] = useState<string>('');

  // Requirement remarks & project details
  const [customerRemarks, setCustomerRemarks] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [preferredDeadline, setPreferredDeadline] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; size: string }>>([]);

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Load payment methods and available coupons
  useEffect(() => {
    fetch('/api/payment-methods')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBanks(data.banks || []);
          setCryptoWallets(data.cryptoWallets || []);
          if (data.usdToPkrRate) setUsdToPkrRate(data.usdToPkrRate);

          if (data.banks && data.banks.length > 0) {
            setSelectedBankId(data.banks[0].id);
          }
          if (data.cryptoWallets && data.cryptoWallets.length > 0) {
            setSelectedCryptoId(data.cryptoWallets[0].id);
          }
        }
      })
      .catch(() => {});

    // Fetch user eligible coupons
    const queryParams = new URLSearchParams({
      forCheckout: 'true',
      customerId: user?.id || 'guest',
      email: user?.email || '',
    });

    fetch(`/api/coupons?${queryParams.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.coupons) {
          setAvailableCoupons(data.coupons);
        }
      })
      .catch(() => {});
  }, [user]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon) return;
    await applyCoupon(inputCoupon);
  };

  const handleSelectCouponCard = async (code: string) => {
    setInputCoupon(code);
    await applyCoupon(code);
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPaymentProofFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPaymentProofDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAttachmentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((f) => ({
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const selectedBank = banks.find((b) => b.id === selectedBankId) || banks[0];
  const selectedCrypto = cryptoWallets.find((c) => c.id === selectedCryptoId) || cryptoWallets[0];

  // Dual Currency Calculations (PKR & USDT)
  const effectiveRate = usdToPkrRate > 0 ? usdToPkrRate : 271;
  const subtotalInUsd = (subtotal / effectiveRate).toFixed(2);
  const discountInUsd = (discount / effectiveRate).toFixed(2);
  const totalInUsd = (total / effectiveRate).toFixed(2);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!agreedTerms) {
      setErrorMsg('Please confirm your agreement to package terms and development scope.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const payload = {
        customerId: user?.id || 'guest-1',
        customerName: user?.name || 'Valued Client',
        customerEmail: user?.email || 'client@codelix.online',
        customerPhone: user?.phone || '+92 300 9030717',
        items,
        customerRemarks,
        businessName,
        websiteUrl,
        preferredDeadline,
        attachments,
        couponCode: couponApplied ? couponCode : undefined,
        paymentMethodType: paymentType,
        selectedBankName: paymentType === 'bank' ? selectedBank?.bankName : undefined,
        selectedCryptoNetwork: paymentType === 'crypto' ? `${selectedCrypto?.symbol} (${selectedCrypto?.network})` : undefined,
        transactionId: transactionId.trim(),
        paymentProofScreenshot: paymentProofDataUrl || undefined,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success && data.order) {
        setOrderSuccess(data.order);
        clearCart();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.error || 'Failed to submit order.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Network error while submitting order.');
    }
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-14">
      {/* Invoice modal */}
      {showInvoiceModal && orderSuccess && (
        <PrintInvoiceModal
          order={orderSuccess}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Transparent Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0B192C] mt-2 tracking-tight">
            Review Your Service Cart & Project Scope
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Confirm your selected service packages, choose Pakistani Bank or Crypto USDT settlement, and provide initial project remarks.
          </p>
        </div>

        {/* Order Success State */}
        {orderSuccess ? (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-[#0B192C]">Order Successfully Placed!</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Thank you for ordering with CODELIX. Your project has been registered with initial status{' '}
              <strong className="text-blue-600">"Pending Review"</strong>. Our accounts and engineering leads will verify your payment details and begin scope review.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Order Reference:</span>
                <span className="font-bold text-blue-600">{orderSuccess.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Option:</span>
                <span className="font-bold text-slate-800">
                  {orderSuccess.paymentMethodType === 'crypto'
                    ? `USDT (${orderSuccess.selectedCryptoNetwork || 'Crypto'})`
                    : `Bank (${orderSuccess.selectedBankName || 'Pakistani Bank'})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Billed:</span>
                <span className="font-bold text-slate-900 font-mono">
                  PKR {orderSuccess.total?.toLocaleString()}{' '}
                  {orderSuccess.paymentMethodType === 'crypto' && (
                    <span className="text-emerald-600">(${orderSuccess.amountInUsd} USDT)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                  {orderSuccess.paymentStatus || 'Verification in Progress'}
                </span>
              </div>
              {orderSuccess.transactionId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="text-slate-700">{orderSuccess.transactionId}</span>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('customer-dashboard')}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Track in Customer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full sm:w-auto px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>View / Print Receipt</span>
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Cart */
          <div className="max-w-md mx-auto text-center py-16 px-4 bg-slate-50 rounded-3xl border border-slate-200">
            <div className="w-16 h-16 rounded-full bg-slate-200/70 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Your Cart is Currently Empty</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Explore our special promotional packages or core development services to get started.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onNavigate('offers')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors"
              >
                Explore Promotional Packages (From PKR 7,000)
              </button>
              <button
                onClick={() => onNavigate('services')}
                className="px-6 py-2.5 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
              >
                Browse All Services
              </button>
            </div>
          </div>
        ) : (
          /* Active Cart & Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Items, Scope, & Payment Selection */}
            <div className="lg:col-span-7 space-y-6">
              {/* Selected Packages */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h3 className="text-lg font-black text-[#0B192C] mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-blue-600" />
                  <span>Selected Service Packages ({items.length})</span>
                </h3>

                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{item.serviceTitle}</div>
                        <div className="text-xs text-blue-600 font-semibold">{item.packageName}</div>

                        {item.addons && item.addons.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.addons.map((a, aidx) => (
                              <div key={aidx} className="text-[11px] text-slate-500">
                                + {a.name} (PKR {a.price.toLocaleString()})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-bold text-xs font-mono">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-slate-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right font-mono font-bold text-sm text-slate-900">
                          PKR{' '}
                          {(
                            item.price * item.quantity +
                            (item.addons ? item.addons.reduce((s, a) => s + a.price, 0) * item.quantity : 0)
                          ).toLocaleString()}
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAYMENT OPTIONS: Pakistani Banks OR Crypto USDT */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-[#0B192C] flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                      <span>Select Payment Method</span>
                    </h3>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      Exchange Rate: 1 USD = {usdToPkrRate} PKR
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Pay in PKR via any Pakistani Bank or mobile wallet, or pay in USD via Crypto USDT.
                  </p>
                </div>

                {/* Tabs / Switcher */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPaymentType('bank')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      paymentType === 'bank'
                        ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Pakistani Banks (PKR)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('crypto')}
                    className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      paymentType === 'crypto'
                        ? 'bg-white text-emerald-600 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>Crypto / USDT (USD)</span>
                  </button>
                </div>

                {/* BANK TRANSFER DETAILS */}
                {paymentType === 'bank' && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Choose Pakistani Bank / Microfinance Service
                      </label>
                      <select
                        value={selectedBankId}
                        onChange={(e) => setSelectedBankId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-blue-600 focus:outline-hidden"
                      >
                        {banks.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.bankName} — ({b.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedBank && (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 to-cyan-50/40 rounded-2xl border border-blue-200/70 space-y-3">
                        <div className="flex items-center justify-between border-b border-blue-200/50 pb-2">
                          <span className="font-extrabold text-xs text-[#0B192C]">
                            {selectedBank.bankName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            {selectedBank.category}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] text-slate-500 block">Account Title:</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-slate-800 font-mono">
                                {selectedBank.accountTitle}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedBank.accountTitle, 'title')}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Copy Account Title"
                              >
                                {copiedText === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="text-[11px] text-slate-500 block">Account Number / Raast ID:</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-slate-800 font-mono">
                                {selectedBank.accountNumber}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedBank.accountNumber, 'acc')}
                                className="p-1 text-blue-600 hover:text-blue-800"
                                title="Copy Account Number"
                              >
                                {copiedText === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <span className="text-[11px] text-slate-500 block">IBAN:</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-slate-800 font-mono text-[11px] break-all">
                                {selectedBank.iban}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedBank.iban, 'iban')}
                                className="p-1 text-blue-600 hover:text-blue-800 shrink-0"
                                title="Copy IBAN"
                              >
                                {copiedText === 'iban' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-blue-200/40 text-[11px] text-slate-600">
                          <strong>Transfer Instructions:</strong> {selectedBank.instructions}
                        </div>

                        <div className="p-3 bg-white/95 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs font-mono font-bold">
                          <span className="text-slate-700">Total Payable Amount:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-700 text-sm font-black">PKR {total.toLocaleString()}</span>
                            <span className="text-slate-400">|</span>
                            <span className="text-emerald-700 text-sm font-black">${totalInUsd} USDT</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CRYPTO USDT DETAILS */}
                {paymentType === 'crypto' && (
                  <div className="space-y-4 animate-in fade-in-50 duration-150">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Select Crypto Asset & Network
                      </label>
                      <select
                        value={selectedCryptoId}
                        onChange={(e) => setSelectedCryptoId(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                      >
                        {cryptoWallets.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.symbol} — {c.network}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCrypto && (
                      <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-2xl border border-emerald-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-600 text-white">
                              {selectedCrypto.symbol}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {selectedCrypto.network}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Rate: 1 USD = {usdToPkrRate} PKR
                          </span>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-500 block mb-1">Official Wallet Address:</span>
                          <div className="flex items-center gap-2 p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-mono break-all text-slate-800">
                            <span className="font-bold flex-1 select-all">{selectedCrypto.walletAddress}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(selectedCrypto.walletAddress, 'wallet')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shrink-0 flex items-center gap-1 transition-colors"
                            >
                              {copiedText === 'wallet' ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-emerald-200/50 text-[11px] text-slate-600">
                          <strong>Instructions:</strong> {selectedCrypto.instructions}
                        </div>

                        {/* Automatic Conversion Display */}
                        <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[11px] text-emerald-100 block">Total Converted to USD / USDT:</span>
                            <span className="text-xs font-mono text-emerald-200">
                              PKR {total.toLocaleString()} ÷ {effectiveRate} PKR
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-mono font-black text-white">
                              ${totalInUsd} {selectedCrypto?.symbol || 'USDT'}
                            </span>
                            <span className="text-[10px] block text-emerald-100 font-medium">
                              Equal to PKR {total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* PAYMENT PROOF & VERIFICATION DETAILS */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Payment Verification Details (Recommended)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Transaction ID / Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder={paymentType === 'crypto' ? 'e.g. TxHash 0xabc...' : 'e.g. Bank Ref # 992819'}
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:border-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Upload Payment Screenshot / Receipt
                      </label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleProofUpload}
                        className="block w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                      />
                    </div>
                  </div>

                  {paymentProofDataUrl && (
                    <div className="mt-2 p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={paymentProofDataUrl}
                          alt="Proof preview"
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                        />
                        <span className="text-xs font-mono text-slate-700 font-semibold truncate max-w-[200px]">
                          {paymentProofFileName || 'Screenshot.png'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentProofDataUrl(null);
                          setPaymentProofFileName('');
                        }}
                        className="text-xs text-red-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500">
                    * If you haven't transferred yet, you can also submit your order now and upload or verify payment later in your Customer Dashboard.
                  </p>
                </div>
              </div>

              {/* Requirement Collection Form */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-extrabold text-[#0B192C] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-600" />
                    <span>Project Scope & Specifications</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Help our engineers understand your goals prior to confirmation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Business / Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Hamza Apparel"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Existing Website (If any)</label>
                    <input
                      type="url"
                      placeholder="https://mywebsite.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tell Us What You Need *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your requirements, preferred design, desired features, references, and any special instructions. Our team will review your details before confirming the project."
                    value={customerRemarks}
                    onChange={(e) => setCustomerRemarks(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:border-blue-600 focus:outline-hidden leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-600 mt-1">
                    Describe your requirements, preferred design, desired features, references, and any special instructions. Our team will review your details before confirming the project.
                  </p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Upload Design References / Scope Documents (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleAttachmentsUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                  {attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {attachments.map((att, aidx) => (
                        <div key={aidx} className="text-[11px] text-blue-600 font-mono">
                          ✓ {att.name} ({att.size})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Available Coupons */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md">
                <h3 className="text-base font-extrabold text-[#0B192C] mb-4">Order Summary</h3>

                {/* AVAILABLE COUPONS QUICK SELECT */}
                {availableCoupons.length > 0 && (
                  <div className="mb-5 p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">
                        Available Coupons For You
                      </span>
                    </div>

                    <div className="space-y-2">
                      {availableCoupons.map((c) => {
                        const isSelected = couponCode.toUpperCase() === c.code.toUpperCase() && couponApplied;
                        return (
                          <div
                            key={c.id}
                            onClick={() => handleSelectCouponCard(c.code)}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black">{c.code}</span>
                                {c.isExclusive ? (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                    isSelected ? 'bg-blue-700 text-white' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    Eligible for your account
                                  </span>
                                ) : (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                    isSelected ? 'bg-blue-700 text-white' : 'bg-cyan-100 text-cyan-800'
                                  }`}>
                                    All Newly Joined
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                                {c.title} — Save {c.discountValue}{c.discountType === 'percentage' ? '%' : ' PKR'}
                              </p>
                            </div>
                            <span className="text-xs font-bold underline shrink-0 ml-2">
                              {isSelected ? 'Applied ✓' : 'Use Code'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Manual Coupon Input */}
                <form onSubmit={handleApplyCoupon} className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Promotional Coupon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="CODELIX10 or WELCOME10"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      disabled={couponApplied}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-mono font-bold focus:bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                    {couponApplied ? (
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold shrink-0"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {couponError && <div className="text-[11px] text-red-600 mt-1">{couponError}</div>}
                  {couponApplied && (
                    <div className="text-[11px] text-emerald-600 font-bold mt-1">
                      ✓ Coupon {couponCode} successfully applied!
                    </div>
                  )}
                </form>

                {/* Pricing Breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-800">PKR {subtotal.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-500 ml-1.5">(${subtotalInUsd} USDT)</span>
                    </div>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount ({couponCode}):</span>
                      <div className="text-right font-mono">
                        <span>- PKR {discount.toLocaleString()}</span>
                        <span className="text-[11px] text-emerald-600 ml-1.5">(-${discountInUsd} USDT)</span>
                      </div>
                    </div>
                  )}

                  {/* Fixed Exchange Rate Indicator */}
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Coins className="w-3.5 h-3.5 text-blue-600" />
                      Exchange Rate (Admin Set):
                    </span>
                    <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      1 USD / USDT = {effectiveRate} PKR
                    </span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 space-y-2">
                    <div className="flex justify-between items-baseline font-black text-slate-900 text-base">
                      <span>Grand Total (PKR):</span>
                      <span className="text-2xl font-mono text-blue-600">
                        PKR {total.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs font-mono font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>USDT Total (Crypto):</span>
                      </span>
                      <span className="text-lg text-emerald-700 font-black">${totalInUsd} USDT</span>
                    </div>
                  </div>
                </div>

                {/* Terms agreement */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-slate-600 leading-tight">
                      I understand that project delivery dates are estimates dependent on scope and feedback. I agree to the CODELIX Service Scope & Refund Policy.
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  onClick={handleCheckoutSubmit}
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Recording Order...</span>
                  ) : (
                    <span>Confirm & Submit Order (PKR {total.toLocaleString()} / ${totalInUsd} USDT)</span>
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="mt-4 text-center text-[10px] text-slate-600 space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Manual payment verification — zero unapproved auto-charges.</span>
                  </div>
                  <div>Official Support: +1 902 903 0717 | support@codelix.online</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
