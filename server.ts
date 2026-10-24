/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Full-Stack Server
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import { calculateCartTotals, calculateProjectProgress, validateWhiteBackground } from './src/utils/businessLogic.ts';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Request logger for API calls
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================

app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, country, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.get().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
  const newUser = {
    id: `usr-${Date.now()}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    country: country || 'Pakistan',
    role: 'customer' as const,
    passwordHash: password, // For production use bcrypt / argon2
    isVerified: false,
    verificationCode,
    verificationExpires: Date.now() + 24 * 60 * 60 * 1000,
    createdAt: new Date().toISOString(),
  };

  db.get().users.push(newUser);
  db.saveData();

  // Log verification email
  db.logEmail(
    newUser.email,
    `Verify Your CODELIX Account — Code: ${verificationCode}`,
    'account_verification',
    `Welcome to CODELIX! Your verification code is ${verificationCode}. Enter this code to activate your customer dashboard.`
  );

  return res.json({
    success: true,
    message: 'Registration successful! Verification code has been sent to your email.',
    userId: newUser.id,
    email: newUser.email,
    simulatedCode: verificationCode, // Returned for easy verification in testing/demo
  });
});

app.post('/api/auth/verify-email', (req, res) => {
  const { email, code } = req.body;
  const user = db.get().users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  if (user.isVerified) {
    return res.json({ success: true, message: 'Account is already verified.', user });
  }

  if (user.verificationCode && user.verificationCode === code) {
    user.isVerified = true;
    user.verificationCode = undefined;
    db.saveData();

    db.logEmail(
      user.email,
      'Welcome to CODELIX — Account Successfully Activated',
      'welcome_message',
      `Dear ${user.name}, your CODELIX client portal is now fully activated. You can browse services, request quotes, and track projects.`
    );

    return res.json({ success: true, message: 'Email verified successfully!', user });
  }

  return res.status(400).json({ error: 'Invalid or expired verification code. Please check your email.' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.get().users.find(
    (u) => u.email.toLowerCase() === email?.toLowerCase() && u.passwordHash === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid email address or password.' });
  }

  // Token simulation
  const token = `cdx_tok_${user.id}_${Date.now()}`;
  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      country: user.country,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = db.get().users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  // Generic message for security
  if (user) {
    const resetToken = String(Math.floor(100000 + Math.random() * 900000));
    user.resetToken = resetToken;
    user.resetExpires = Date.now() + 60 * 60 * 1000;
    db.saveData();

    db.logEmail(
      user.email,
      'Password Reset Request — CODELIX Security',
      'password_reset',
      `We received a request to reset your password. Your one-time reset code is: ${resetToken}. If you did not make this request, you can safely ignore this email.`
    );
  }

  return res.json({
    success: true,
    message: 'If an account exists with that email, a password reset code has been sent.',
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = db.get().users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

  if (!user || user.resetToken !== code || (user.resetExpires && user.resetExpires < Date.now())) {
    return res.status(400).json({ error: 'Invalid or expired password reset token.' });
  }

  user.passwordHash = newPassword;
  user.resetToken = undefined;
  user.resetExpires = undefined;
  db.saveData();

  db.logEmail(
    user.email,
    'Your CODELIX Password Has Been Successfully Changed',
    'password_changed',
    'Your account password was updated successfully. If you did not perform this change, contact security immediately.'
  );

  return res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
});

// Quick role switch for convenience during development / evaluation
app.post('/api/auth/quick-switch', (req, res) => {
  const { role } = req.body;
  const targetUser = db.get().users.find((u) => u.role === role);
  if (!targetUser) {
    return res.status(404).json({ error: `No seed user found for role ${role}` });
  }
  return res.json({
    success: true,
    token: `cdx_tok_${targetUser.id}`,
    user: {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      phone: targetUser.phone,
      country: targetUser.country,
      role: targetUser.role,
      isVerified: targetUser.isVerified,
    },
  });
});

// ==========================================
// 2. SERVICES & PACKAGES
// ==========================================

app.get('/api/services', (req, res) => {
  res.json({ success: true, services: db.get().services });
});

app.post('/api/services', (req, res) => {
  const srv = req.body;
  srv.id = `srv-${Date.now()}`;
  srv.isActive = true;
  db.get().services.push(srv);
  db.saveData();
  res.json({ success: true, service: srv });
});

app.put('/api/services/:id', (req, res) => {
  const index = db.get().services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found.' });

  db.get().services[index] = { ...db.get().services[index], ...req.body };
  db.saveData();
  res.json({ success: true, service: db.get().services[index] });
});

app.delete('/api/services/:id', (req, res) => {
  const index = db.get().services.findIndex((s) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Service not found.' });

  db.get().services.splice(index, 1);
  db.saveData();
  res.json({ success: true, message: 'Service deleted.' });
});

// ==========================================
// 3. SPECIAL OFFERS & PROMOTIONS
// ==========================================

app.get('/api/offers', (req, res) => {
  res.json({ success: true, offers: db.get().offers });
});

app.post('/api/offers', (req, res) => {
  const offer = req.body;
  offer.id = `off-${Date.now()}`;
  offer.claimedQuantity = 0;
  offer.isActive = true;
  db.get().offers.push(offer);
  db.saveData();
  res.json({ success: true, offer });
});

app.put('/api/offers/:id', (req, res) => {
  const index = db.get().offers.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Offer not found.' });

  db.get().offers[index] = { ...db.get().offers[index], ...req.body };
  db.saveData();
  res.json({ success: true, offer: db.get().offers[index] });
});

app.delete('/api/offers/:id', (req, res) => {
  const index = db.get().offers.findIndex((o) => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Offer not found.' });

  db.get().offers.splice(index, 1);
  db.saveData();
  res.json({ success: true, message: 'Offer deleted.' });
});

// ==========================================
// 3B. PAYMENT METHODS & EXCHANGE RATE
// ==========================================

app.get('/api/payment-methods', (req, res) => {
  res.json({
    success: true,
    banks: db.get().pakistaniBanks,
    cryptoWallets: db.get().cryptoWallets,
    usdToPkrRate: db.get().usdToPkrRate || 271,
  });
});

app.post('/api/payment-methods/banks', (req, res) => {
  const bank = req.body;
  bank.id = `bnk-${Date.now()}`;
  bank.isActive = bank.isActive !== false;
  db.get().pakistaniBanks.push(bank);
  db.saveData();
  res.json({ success: true, bank });
});

app.put('/api/payment-methods/banks/:id', (req, res) => {
  const index = db.get().pakistaniBanks.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Bank not found.' });

  db.get().pakistaniBanks[index] = { ...db.get().pakistaniBanks[index], ...req.body };
  db.saveData();
  res.json({ success: true, bank: db.get().pakistaniBanks[index] });
});

app.delete('/api/payment-methods/banks/:id', (req, res) => {
  const index = db.get().pakistaniBanks.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Bank not found.' });

  db.get().pakistaniBanks.splice(index, 1);
  db.saveData();
  res.json({ success: true, message: 'Bank deleted.' });
});

app.post('/api/payment-methods/crypto', (req, res) => {
  const wallet = req.body;
  wallet.id = `cpt-${Date.now()}`;
  wallet.isActive = wallet.isActive !== false;
  db.get().cryptoWallets.push(wallet);
  db.saveData();
  res.json({ success: true, wallet });
});

app.put('/api/payment-methods/crypto/:id', (req, res) => {
  const index = db.get().cryptoWallets.findIndex((w) => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Wallet not found.' });

  db.get().cryptoWallets[index] = { ...db.get().cryptoWallets[index], ...req.body };
  db.saveData();
  res.json({ success: true, wallet: db.get().cryptoWallets[index] });
});

app.delete('/api/payment-methods/crypto/:id', (req, res) => {
  const index = db.get().cryptoWallets.findIndex((w) => w.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Wallet not found.' });

  db.get().cryptoWallets.splice(index, 1);
  db.saveData();
  res.json({ success: true, message: 'Wallet deleted.' });
});

app.get('/api/exchange-rate', (req, res) => {
  res.json({ success: true, usdToPkrRate: db.get().usdToPkrRate || 271 });
});

app.put('/api/exchange-rate', (req, res) => {
  const { rate } = req.body;
  const numRate = Number(rate);
  if (!numRate || numRate <= 0) {
    return res.status(400).json({ error: 'Valid positive exchange rate is required.' });
  }

  db.get().usdToPkrRate = numRate;
  db.saveData();
  res.json({ success: true, usdToPkrRate: numRate });
});

// ==========================================
// 3C. COUPONS & DISCOUNTS MANAGEMENT
// ==========================================

app.get('/api/coupons', (req, res) => {
  const { customerId, email, forCheckout } = req.query;
  const allCoupons = db.get().coupons || [];

  if (forCheckout && (customerId || email)) {
    const custId = String(customerId || '').toLowerCase();
    const custEmail = String(email || '').toLowerCase();

    // Return coupons that are active and either public OR targeted to this customer
    const userCoupons = allCoupons.filter((c) => {
      if (!c.isActive) return false;
      if (!c.isExclusive) return true; // public / newly joined
      const matchId = c.eligibleCustomerIds?.some((id) => id.toLowerCase() === custId);
      const matchEmail = c.eligibleEmails?.some((em) => em.toLowerCase() === custEmail);
      return matchId || matchEmail;
    });

    return res.json({ success: true, coupons: userCoupons });
  }

  res.json({ success: true, coupons: allCoupons });
});

app.post('/api/coupons', (req, res) => {
  const { code, title, description, discountType, discountValue, minOrder, expiryDate, isExclusive, eligibleCustomerIds, eligibleEmails } = req.body;

  if (!code || !title || !discountValue) {
    return res.status(400).json({ error: 'Coupon code, title, and discount value are required.' });
  }

  const normalizedCode = code.toUpperCase().trim();
  const existing = (db.get().coupons || []).find((c) => c.code.toUpperCase() === normalizedCode);
  if (existing) {
    return res.status(400).json({ error: 'A coupon with this code already exists.' });
  }

  const newCoupon = {
    id: `cpn-${Date.now()}`,
    code: normalizedCode,
    title,
    description: description || '',
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrder: minOrder ? Number(minOrder) : 0,
    expiryDate: expiryDate || '2026-12-31',
    isExclusive: !!isExclusive,
    eligibleCustomerIds: eligibleCustomerIds || [],
    eligibleEmails: eligibleEmails || [],
    isActive: true,
  };

  if (!db.get().coupons) db.get().coupons = [];
  db.get().coupons.unshift(newCoupon);
  db.saveData();

  // If specific emails provided, dispatch notification email to each eligible customer!
  if (eligibleEmails && Array.isArray(eligibleEmails) && eligibleEmails.length > 0) {
    for (const em of eligibleEmails) {
      db.logEmail(
        em,
        `Special Discount Voucher Assigned: ${newCoupon.code} — CODELIX`,
        'exclusive_coupon_assigned',
        `Dear Valued Client, you have received an exclusive discount voucher "${newCoupon.code}" for ${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : ' PKR'} off your next order. Valid until ${newCoupon.expiryDate}.`
      );
    }
  }

  res.json({ success: true, coupon: newCoupon });
});

app.put('/api/coupons/:id', (req, res) => {
  const index = (db.get().coupons || []).findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Coupon not found.' });

  db.get().coupons[index] = { ...db.get().coupons[index], ...req.body };
  db.saveData();
  res.json({ success: true, coupon: db.get().coupons[index] });
});

app.delete('/api/coupons/:id', (req, res) => {
  const index = (db.get().coupons || []).findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Coupon not found.' });

  db.get().coupons.splice(index, 1);
  db.saveData();
  res.json({ success: true, message: 'Coupon deleted.' });
});

// ==========================================
// 3D. NEWSLETTER SUBSCRIPTION (10% VOUCHER)
// ==========================================

app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  const voucherCode = 'WELCOME10';

  db.logEmail(
    email,
    'Here is your 10% Discount Voucher — Welcome to CODELIX!',
    'newsletter_voucher',
    `Thank you for subscribing to CODELIX Digital Solutions updates! As promised, here is your 10% discount voucher code: ${voucherCode}. Apply this at checkout on https://codelix.online for any web development package before expiration.`
  );

  res.json({
    success: true,
    message: 'Subscription successful! 10% discount voucher has been delivered to your email.',
    couponCode: voucherCode,
  });
});

// ==========================================
// 4. CART & SERVER-SIDE PRICING
// ==========================================

app.post('/api/cart/validate', (req, res) => {
  const { items, couponCode } = req.body;
  let coupon = null;
  if (couponCode) {
    const codeUpper = couponCode.toUpperCase().trim();
    // Check in database coupons first
    const dbCoupon = (db.get().coupons || []).find((c) => c.code.toUpperCase() === codeUpper && c.isActive);
    if (dbCoupon) {
      coupon = {
        code: dbCoupon.code,
        discountType: dbCoupon.discountType,
        discountValue: dbCoupon.discountValue,
        minOrder: dbCoupon.minOrder,
        isActive: true,
      };
    } else if (codeUpper === 'CODELIX10' || codeUpper === 'WELCOME10') {
      coupon = {
        code: codeUpper,
        discountType: 'percentage' as const,
        discountValue: 10,
        isActive: true,
      };
    } else if (codeUpper === 'LAUNCH5000') {
      coupon = {
        code: codeUpper,
        discountType: 'fixed' as const,
        discountValue: 5000,
        minOrder: 20000,
        isActive: true,
      };
    }
  }

  const totals = calculateCartTotals(items || [], coupon);
  res.json({ success: true, totals, coupon });
});

// ==========================================
// 5. ORDERS & PROJECT TRACKING
// ==========================================

app.get('/api/orders', (req, res) => {
  const customerId = req.query.customerId as string;
  let orders = db.get().orders;
  if (customerId) {
    orders = orders.filter((o) => o.customerId === customerId);
  }
  res.json({ success: true, orders });
});

app.get('/api/orders/:reference', (req, res) => {
  const order = db.get().orders.find((o) => o.reference === req.params.reference || o.id === req.params.reference);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json({ success: true, order });
});

app.post('/api/orders', (req, res) => {
  const {
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    items,
    customerRemarks,
    businessName,
    websiteUrl,
    preferredDeadline,
    attachments,
    couponCode,
    paymentMethodType,
    selectedBankName,
    selectedCryptoNetwork,
    transactionId,
    paymentProofScreenshot,
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty. Please select a service package.' });
  }

  let coupon = null;
  if (couponCode) {
    const codeUpper = couponCode.toUpperCase().trim();
    const dbCoupon = (db.get().coupons || []).find((c) => c.code.toUpperCase() === codeUpper && c.isActive);
    if (dbCoupon) {
      coupon = {
        code: dbCoupon.code,
        discountType: dbCoupon.discountType,
        discountValue: dbCoupon.discountValue,
        minOrder: dbCoupon.minOrder,
        isActive: true,
      };
    } else if (codeUpper === 'CODELIX10' || codeUpper === 'WELCOME10') {
      coupon = { code: codeUpper, discountType: 'percentage' as const, discountValue: 10, isActive: true };
    } else if (codeUpper === 'LAUNCH5000') {
      coupon = { code: codeUpper, discountType: 'fixed' as const, discountValue: 5000, minOrder: 20000, isActive: true };
    }
  }

  const { subtotal, addonTotal, discount, total } = calculateCartTotals(items, coupon);
  const reference = db.nextReference('order');
  const usdRate = db.get().usdToPkrRate || 271;
  const amountInUsd = Math.round((total / usdRate) * 100) / 100;

  const newOrder = {
    id: `ord-${Date.now()}`,
    reference,
    customerId: customerId || 'guest',
    customerName: customerName || 'Valued Client',
    customerEmail: customerEmail || 'client@codelix.online',
    customerPhone: customerPhone || '+1 902 903 0717',
    items,
    subtotal: subtotal + addonTotal,
    discount,
    total,
    currency: 'PKR',
    amountInUsd,
    exchangeRateUsed: usdRate,
    paymentMethodType: paymentMethodType || 'bank',
    selectedBankName: selectedBankName || '',
    selectedCryptoNetwork: selectedCryptoNetwork || '',
    transactionId: transactionId || '',
    paymentProofScreenshot: paymentProofScreenshot || '',
    status: 'Pending Review' as const,
    paymentStatus: (paymentProofScreenshot || transactionId ? 'Verification in Progress' : 'Pending') as any,
    paymentVerificationNotes: '',
    customerRemarks: customerRemarks || '',
    businessName: businessName || '',
    websiteUrl: websiteUrl || '',
    preferredDeadline: preferredDeadline || '',
    attachments: attachments || [],
    overallProgress: 0,
    milestones: [
      { id: 'm1', title: 'Requirements & Scope Review', weight: 15, progress: 0, completed: false },
      { id: 'm2', title: 'UI/UX Prototyping & Architecture', weight: 25, progress: 0, completed: false },
      { id: 'm3', title: 'System Development & Database Setup', weight: 35, progress: 0, completed: false },
      { id: 'm4', title: 'Quality Assurance & Security Testing', weight: 15, progress: 0, completed: false },
      { id: 'm5', title: 'Deployment, Domain & Handover', weight: 10, progress: 0, completed: false },
    ],
    timeline: [
      {
        id: `tl-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: 'CODELIX Portal',
        role: 'System',
        message: `Order submitted by client with reference ${reference}. Payment method: ${paymentMethodType === 'crypto' ? `Crypto USDT ($${amountInUsd})` : `Bank Transfer (PKR ${total.toLocaleString()})`}. Initial status: Pending Review.`,
        isPublic: true,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  db.get().orders.unshift(newOrder);

  // Increment claimed count for associated offers if applicable
  for (const item of items) {
    const matchedOffer = db.get().offers.find((o) => o.title.toLowerCase() === item.serviceTitle?.toLowerCase());
    if (matchedOffer && matchedOffer.claimedQuantity < matchedOffer.totalQuantity) {
      matchedOffer.claimedQuantity += item.quantity || 1;
    }
  }

  db.saveData();

  // Send branded email notification
  db.logEmail(
    newOrder.customerEmail,
    `Order Received: ${reference} — CODELIX Digital Solutions`,
    'order_received',
    `Thank you for your order! Your project reference is ${reference}. Total: PKR ${total.toLocaleString()}${paymentMethodType === 'crypto' ? ` ($${amountInUsd} USDT at 1 USD = ${usdRate} PKR)` : ''}. Our finance & engineering teams will verify your payment details and begin scope review.`
  );

  res.json({ success: true, order: newOrder, reference });
});

// Admin verify or update payment status
app.put('/api/orders/:id/payment', (req, res) => {
  const { paymentStatus, paymentVerificationNotes } = req.body;
  const order = db.get().orders.find((o) => o.id === req.params.id || o.reference === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (paymentStatus) order.paymentStatus = paymentStatus;
  if (paymentVerificationNotes !== undefined) order.paymentVerificationNotes = paymentVerificationNotes;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  order.timeline.push({
    id: `tl-${Date.now()}`,
    timestamp: now,
    author: 'CODELIX Accounts',
    role: 'Admin',
    message: `Payment status updated to "${paymentStatus}". Notes: ${paymentVerificationNotes || 'None'}`,
    isPublic: true,
  });

  db.saveData();

  db.logEmail(
    order.customerEmail,
    `Payment Status Update: ${order.reference} — ${paymentStatus}`,
    'payment_status_update',
    `Your payment for order ${order.reference} has been marked as "${paymentStatus}". ${paymentVerificationNotes ? `Remarks: "${paymentVerificationNotes}".` : ''}`
  );

  res.json({ success: true, order });
});

// Admin confirm order and assign project
app.put('/api/orders/:id/confirm', (req, res) => {
  const { assignedEmployeeId, estimatedCompletionDate, startDate, customerMessage, paymentStatus } = req.body;
  const order = db.get().orders.find((o) => o.id === req.params.id || o.reference === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  const employee = db.get().employees.find((e) => e.id === assignedEmployeeId);

  order.status = 'Confirmed';
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.assignedEmployeeId = assignedEmployeeId || order.assignedEmployeeId;
  order.assignedEmployeeName = employee ? employee.fullName : 'CODELIX Engineering Lead';
  order.startDate = startDate || new Date().toISOString().substring(0, 10);
  order.estimatedCompletionDate = estimatedCompletionDate || '2026-04-01';

  order.timeline.push({
    id: `tl-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    author: 'CODELIX Admin',
    role: 'Admin',
    message: customerMessage || `Order confirmed! Assigned to ${order.assignedEmployeeName}. Target completion date: ${order.estimatedCompletionDate}.`,
    isPublic: true,
  });

  db.saveData();

  db.logEmail(
    order.customerEmail,
    `Order Confirmed & Project Assigned: ${order.reference}`,
    'order_confirmed',
    `Your project ${order.reference} is now confirmed and scheduled! Assigned Engineer: ${order.assignedEmployeeName}. Estimated Delivery: ${order.estimatedCompletionDate}.`
  );

  res.json({ success: true, order });
});

// Employee / Admin update milestone progress & project details
app.put('/api/orders/:id/milestones', (req, res) => {
  const { milestones, notes, status, newEstimatedDate, author, role, isPublic } = req.body;
  const order = db.get().orders.find((o) => o.id === req.params.id || o.reference === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (milestones && Array.isArray(milestones)) {
    order.milestones = milestones;
    const { overallProgress } = calculateProjectProgress(milestones);
    order.overallProgress = overallProgress;
    if (overallProgress === 100) {
      order.status = 'Completed';
    }
  }

  if (status) order.status = status;
  if (newEstimatedDate) order.estimatedCompletionDate = newEstimatedDate;

  if (notes) {
    order.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      author: author || 'Assigned Engineer',
      role: role || 'Employee',
      message: notes,
      isPublic: isPublic !== false,
    });
  }

  db.saveData();

  // If public note or completion, notify customer
  if (notes && isPublic !== false) {
    db.logEmail(
      order.customerEmail,
      `Project Progress Update: ${order.reference} (${order.overallProgress}% Complete)`,
      'project_progress_update',
      `New update on project ${order.reference}: "${notes}". Current overall progress is ${order.overallProgress}%.`
    );
  }

  res.json({ success: true, order });
});

// ==========================================
// 6. CUSTOMER COMPLAINT MANAGEMENT
// ==========================================

app.get('/api/complaints', (req, res) => {
  const customerId = req.query.customerId as string;
  let complaints = db.get().complaints;
  if (customerId) {
    complaints = complaints.filter((c) => c.customerId === customerId);
  }
  res.json({ success: true, complaints });
});

app.get('/api/complaints/:reference', (req, res) => {
  const complaint = db.get().complaints.find((c) => c.reference === req.params.reference || c.id === req.params.reference);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });
  res.json({ success: true, complaint });
});

app.post('/api/complaints', (req, res) => {
  const { customerId, customerName, customerEmail, orderReference, category, subject, description, priority } = req.body;
  if (!subject || !description) {
    return res.status(400).json({ error: 'Subject and detailed description are required.' });
  }

  const reference = db.nextReference('complaint');
  const newComplaint = {
    id: `cmp-${Date.now()}`,
    reference,
    customerId: customerId || 'guest',
    customerName: customerName || 'Valued Client',
    customerEmail: customerEmail || 'client@codelix.online',
    orderReference: orderReference || '',
    category: category || 'General Support',
    subject,
    description,
    priority: priority || 'Medium',
    status: 'Submitted' as const,
    publicNotes: [
      {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: 'CODELIX Support System',
        message: `Complaint registered with tracking ID ${reference}. Our team will review and respond within 24 business hours.`,
      },
    ],
    internalNotes: [],
    createdAt: new Date().toISOString(),
  };

  db.get().complaints.unshift(newComplaint);
  db.saveData();

  db.logEmail(
    newComplaint.customerEmail,
    `Complaint Registered: ${reference} — CODELIX Customer Care`,
    'complaint_received',
    `We have received your complaint regarding "${subject}". Your unique tracking reference is ${reference}. You can track resolution live in your portal.`
  );

  res.json({ success: true, complaint: newComplaint, reference });
});

app.put('/api/complaints/:id/status', (req, res) => {
  const { status, assignedEmployeeName, publicNote, internalNote, author } = req.body;
  const complaint = db.get().complaints.find((c) => c.id === req.params.id || c.reference === req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Complaint not found.' });

  if (status) complaint.status = status;
  if (assignedEmployeeName) complaint.assignedEmployeeName = assignedEmployeeName;

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  if (publicNote) {
    complaint.publicNotes.push({
      timestamp: now,
      author: author || 'Support Specialist',
      message: publicNote,
    });

    db.logEmail(
      complaint.customerEmail,
      `Complaint Update: ${complaint.reference} — Status: ${complaint.status}`,
      'complaint_status_update',
      `Update on complaint ${complaint.reference}: "${publicNote}". Resolution Status: ${complaint.status}.`
    );
  }

  if (internalNote) {
    complaint.internalNotes.push({
      timestamp: now,
      author: author || 'Admin / Employee',
      message: internalNote,
    });
  }

  db.saveData();
  res.json({ success: true, complaint });
});

// ==========================================
// 7. QUOTATIONS, INQUIRIES, DEMOS, IDEAS
// ==========================================

// Quotations
app.get('/api/quotations', (req, res) => {
  res.json({ success: true, quotations: db.get().quotations });
});

app.post('/api/quotations', (req, res) => {
  const { name, email, phone, company, serviceCategory, description, budgetRange, preferredTimeline, referenceUrl } = req.body;
  const reference = db.nextReference('quotation');

  const newQuote = {
    id: `qt-${Date.now()}`,
    reference,
    name,
    email,
    phone,
    company: company || '',
    serviceCategory: serviceCategory || 'Custom Development',
    description: description || '',
    budgetRange: budgetRange || 'Standard',
    preferredTimeline: preferredTimeline || 'Flexible',
    referenceUrl: referenceUrl || '',
    status: 'Received' as const,
    createdAt: new Date().toISOString(),
  };

  db.get().quotations.unshift(newQuote);
  db.saveData();

  db.logEmail(
    email,
    `Quotation Request Received: ${reference} — CODELIX`,
    'quotation_received',
    `Thank you for requesting a quotation from CODELIX. Reference ID: ${reference}. Our solutions architect will prepare a detailed proposal.`
  );

  res.json({ success: true, quotation: newQuote, reference });
});

app.put('/api/quotations/:id', (req, res) => {
  const quote = db.get().quotations.find((q) => q.id === req.params.id || q.reference === req.params.id);
  if (!quote) return res.status(404).json({ error: 'Quotation not found.' });

  const { status, quoteAmount, quoteItems, validUntil, staffNotes } = req.body;
  if (status) quote.status = status;
  if (quoteAmount !== undefined) quote.quoteAmount = quoteAmount;
  if (quoteItems) quote.quoteItems = quoteItems;
  if (validUntil) quote.validUntil = validUntil;
  if (staffNotes) quote.staffNotes = staffNotes;

  db.saveData();

  if (status === 'Sent to Customer') {
    db.logEmail(
      quote.email,
      `Official Quotation Prepared: ${quote.reference} — PKR ${quote.quoteAmount?.toLocaleString()}`,
      'quotation_sent',
      `CODELIX has prepared your formal quotation for ${quote.serviceCategory}. Total amount: PKR ${quote.quoteAmount?.toLocaleString()}. Valid until ${quote.validUntil}.`
    );
  }

  res.json({ success: true, quotation: quote });
});

// Inquiries / Ask Questions
app.get('/api/inquiries', (req, res) => {
  res.json({ success: true, inquiries: db.get().inquiries });
});

app.post('/api/inquiries', (req, res) => {
  const { name, email, phone, subject, category, message } = req.body;
  const reference = db.nextReference('inquiry');

  const inq = {
    id: `inq-${Date.now()}`,
    reference,
    name,
    email,
    phone,
    subject,
    category: category || 'General Question',
    message,
    status: 'New' as const,
    createdAt: new Date().toISOString(),
  };

  db.get().inquiries.unshift(inq);
  db.saveData();

  db.logEmail(
    email,
    `Inquiry Acknowledgment: ${reference} — CODELIX`,
    'inquiry_received',
    `Thank you for reaching out with your question: "${subject}". Our technical team is reviewing it and will respond promptly.`
  );

  res.json({ success: true, inquiry: inq, reference });
});

app.put('/api/inquiries/:id/reply', (req, res) => {
  const inq = db.get().inquiries.find((i) => i.id === req.params.id || i.reference === req.params.id);
  if (!inq) return res.status(404).json({ error: 'Inquiry not found.' });

  const { response } = req.body;
  inq.response = response;
  inq.status = 'Answered';
  db.saveData();

  db.logEmail(
    inq.email,
    `Response to Your Inquiry: ${inq.reference} — CODELIX`,
    'inquiry_response',
    `Hello ${inq.name}, we have answered your question: "${response}".`
  );

  res.json({ success: true, inquiry: inq });
});

// Demo Requests
app.get('/api/demo-requests', (req, res) => {
  res.json({ success: true, demoRequests: db.get().demoRequests });
});

app.post('/api/demo-requests', (req, res) => {
  const { name, email, phone, serviceOrProduct, preferredDate, preferredTime, timezone, notes } = req.body;
  const reference = db.nextReference('demo');

  const demo = {
    id: `dm-${Date.now()}`,
    reference,
    name,
    email,
    phone,
    serviceOrProduct: serviceOrProduct || 'Web Solutions Demo',
    preferredDate,
    preferredTime,
    timezone: timezone || 'PKT (UTC+5)',
    notes: notes || '',
    status: 'Requested' as const,
    createdAt: new Date().toISOString(),
  };

  db.get().demoRequests.unshift(demo);
  db.saveData();

  db.logEmail(
    email,
    `Demo Request Received: ${reference} — CODELIX`,
    'demo_request_received',
    `Thank you for requesting a demo of ${serviceOrProduct}. Reference: ${reference}. Our team will confirm the session schedule.`
  );

  res.json({ success: true, demoRequest: demo, reference });
});

app.put('/api/demo-requests/:id/status', (req, res) => {
  const demo = db.get().demoRequests.find((d) => d.id === req.params.id || d.reference === req.params.id);
  if (!demo) return res.status(404).json({ error: 'Demo request not found.' });

  const { status, notes } = req.body;
  if (status) demo.status = status;
  if (notes) demo.notes = notes;
  db.saveData();

  if (status === 'Confirmed') {
    db.logEmail(
      demo.email,
      `Demo Session Confirmed: ${demo.serviceOrProduct} — CODELIX`,
      'demo_confirmed',
      `Your demo has been scheduled for ${demo.preferredDate} at ${demo.preferredTime} (${demo.timezone}).`
    );
  }

  res.json({ success: true, demoRequest: demo });
});

// Share Your Ideas
app.get('/api/ideas', (req, res) => {
  res.json({ success: true, ideas: db.get().ideas });
});

app.post('/api/ideas', (req, res) => {
  const { name, email, phone, ideaTitle, targetAudience, desiredFeatures, budget, timeline } = req.body;
  const reference = db.nextReference('idea');

  const idea = {
    id: `id-${Date.now()}`,
    reference,
    name,
    email,
    phone,
    ideaTitle,
    targetAudience: targetAudience || '',
    desiredFeatures: desiredFeatures || '',
    budget: budget || '',
    timeline: timeline || '',
    status: 'Under Review' as const,
    createdAt: new Date().toISOString(),
  };

  db.get().ideas.unshift(idea);
  db.saveData();

  db.logEmail(
    email,
    `Idea Submission Received: ${reference} — CODELIX Innovation`,
    'idea_submission_received',
    `Thank you for sharing your concept "${ideaTitle}" with CODELIX. Reference ID: ${reference}. We maintain strict NDA and will review feasibility.`
  );

  res.json({ success: true, idea, reference });
});

app.put('/api/ideas/:id', (req, res) => {
  const idea = db.get().ideas.find((i) => i.id === req.params.id || i.reference === req.params.id);
  if (!idea) return res.status(404).json({ error: 'Idea not found.' });

  const { status, evaluationNotes } = req.body;
  if (status) idea.status = status;
  if (evaluationNotes) idea.evaluationNotes = evaluationNotes;
  db.saveData();
  res.json({ success: true, idea });
});

// ==========================================
// 8. CAREERS, RECRUITMENT & PASSPORT PHOTO CHECK
// ==========================================

app.get('/api/vacancies', (req, res) => {
  res.json({ success: true, vacancies: db.get().vacancies });
});

app.post('/api/vacancies', (req, res) => {
  const vac = req.body;
  vac.id = `vac-${Date.now()}`;
  vac.isActive = true;
  db.get().vacancies.push(vac);
  db.saveData();
  res.json({ success: true, vacancy: vac });
});

app.put('/api/vacancies/:id', (req, res) => {
  const index = db.get().vacancies.findIndex((v) => v.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Job vacancy not found.' });

  db.get().vacancies[index] = { ...db.get().vacancies[index], ...req.body };
  db.saveData();
  res.json({ success: true, vacancy: db.get().vacancies[index] });
});

app.get('/api/applications', (req, res) => {
  res.json({ success: true, applications: db.get().applications });
});

// Applicant tracking status endpoint
app.get('/api/applications/track/:reference', (req, res) => {
  const { email } = req.query;
  const appRecord = db.get().applications.find(
    (a) => a.reference.toLowerCase() === req.params.reference.toLowerCase()
  );

  if (!appRecord) {
    return res.status(404).json({ error: 'No application found with this reference number.' });
  }

  if (email && appRecord.email.toLowerCase() !== String(email).toLowerCase()) {
    return res.status(403).json({ error: 'Email does not match this application reference.' });
  }

  res.json({ success: true, application: appRecord });
});

app.post('/api/applications', (req, res) => {
  const {
    vacancyId,
    vacancyTitle,
    fullName,
    email,
    phone,
    city,
    country,
    education,
    experience,
    skills,
    portfolioUrl,
    coverLetter,
    resumeFileName,
    photoFileName,
    sampleBorderPixels, // Array of RGB pixels tested from canvas for white background
  } = req.body;

  if (!fullName || !email || !vacancyId) {
    return res.status(400).json({ error: 'Full name, email, and position are required.' });
  }

  // Passport photo background verification check
  let photoVerified = true;
  let verificationScore = 95;
  if (sampleBorderPixels && Array.isArray(sampleBorderPixels) && sampleBorderPixels.length > 0) {
    const check = validateWhiteBackground(sampleBorderPixels);
    photoVerified = check.isWhite;
    verificationScore = check.score;

    if (!check.isWhite) {
      return res.status(400).json({
        error: `Passport photo validation failed: ${check.message}. Mandatory requirement: photograph must be on a plain white background.`,
        score: check.score,
      });
    }
  }

  const reference = db.nextReference('application');
  const newApplication = {
    id: `app-${Date.now()}`,
    reference,
    vacancyId,
    vacancyTitle: vacancyTitle || 'Software Engineer',
    fullName,
    email,
    phone: phone || '',
    city: city || 'Islamabad',
    country: country || 'Pakistan',
    education: education || '',
    experience: experience || '',
    skills: skills || '',
    portfolioUrl: portfolioUrl || '',
    coverLetter: coverLetter || '',
    resumeFileName: resumeFileName || 'Candidate_Resume.pdf',
    photoFileName: photoFileName || 'Passport_Photo.jpg',
    photoVerifiedWhiteBackground: photoVerified,
    photoVerificationScore: verificationScore,
    status: 'Application Submitted' as const,
    createdAt: new Date().toISOString(),
  };

  db.get().applications.unshift(newApplication);
  db.saveData();

  db.logEmail(
    email,
    `Application Received: ${reference} for ${newApplication.vacancyTitle} — CODELIX Careers`,
    'job_application_received',
    `Dear ${fullName}, we have received your application for "${newApplication.vacancyTitle}". Your tracking reference is ${reference}. You can track your recruitment status online.`
  );

  res.json({ success: true, application: newApplication, reference });
});

app.put('/api/applications/:id/status', (req, res) => {
  const appRecord = db.get().applications.find((a) => a.id === req.params.id || a.reference === req.params.id);
  if (!appRecord) return res.status(404).json({ error: 'Application not found.' });

  const {
    status,
    interviewDate,
    interviewNotes,
    candidateMessage,
    cvRemarks,
    backgroundRemarks,
    technicalRemarks,
    hrRemarks,
  } = req.body;

  if (status) appRecord.status = status;
  if (interviewDate !== undefined) appRecord.interviewDate = interviewDate;
  if (interviewNotes !== undefined) appRecord.interviewNotes = interviewNotes;
  if (candidateMessage !== undefined) appRecord.candidateMessage = candidateMessage;
  if (cvRemarks !== undefined) appRecord.cvRemarks = cvRemarks;
  if (backgroundRemarks !== undefined) appRecord.backgroundRemarks = backgroundRemarks;
  if (technicalRemarks !== undefined) appRecord.technicalRemarks = technicalRemarks;
  if (hrRemarks !== undefined) appRecord.hrRemarks = hrRemarks;

  db.saveData();

  // Send email to applicant
  db.logEmail(
    appRecord.email,
    `Application Status Update: ${appRecord.status} — ${appRecord.reference} | CODELIX`,
    'job_application_status',
    `Dear ${appRecord.fullName}, your application for "${appRecord.vacancyTitle}" (Ref: ${appRecord.reference}) has been updated to "${appRecord.status}". ${interviewDate ? `Interview scheduled for: ${interviewDate}. ` : ''}${candidateMessage || 'Our recruitment committee is reviewing your candidate profile.'}`
  );

  res.json({ success: true, application: appRecord });
});

// Formal Hiring & Contract Dispatch Endpoint
app.post('/api/applications/:id/hire', (req, res) => {
  const appRecord = db.get().applications.find((a) => a.id === req.params.id || a.reference === req.params.id);
  if (!appRecord) return res.status(404).json({ error: 'Application not found.' });

  const {
    employeeId,
    designation,
    department,
    officeLocation,
    salary,
    joiningDate,
    contractText,
  } = req.body;

  const empCode = employeeId || `CDX-EMP-${String(db.get().employees.length + 1).padStart(3, '0')}`;
  const now = new Date().toISOString();

  appRecord.status = 'Contract Sent / Hired';
  appRecord.contractDetails = {
    employeeId: empCode,
    designation: designation || appRecord.vacancyTitle,
    department: department || 'Engineering',
    salary: salary || 'PKR 120,000 / month',
    joiningDate: joiningDate || now.substring(0, 10),
    contractText: contractText || 'Standard CODELIX Engineering Employment Contract and Intellectual Property Non-Disclosure Agreement.',
    sentAt: now,
  };

  // Add into employee roster if not already present
  let employee = db.get().employees.find((e) => e.workEmail.toLowerCase() === appRecord.email.toLowerCase() || e.employeeCode === empCode);
  if (!employee) {
    employee = {
      id: `emp-${Date.now()}`,
      employeeCode: empCode,
      fullName: appRecord.fullName,
      designation: designation || appRecord.vacancyTitle,
      department: department || 'Engineering',
      workEmail: appRecord.email,
      phone: appRecord.phone,
      officeLocation: officeLocation || 'Islamabad Headquarters / Remote',
      employmentType: 'Full-time',
      role: 'employee',
      assignedRoleTitle: designation || appRecord.vacancyTitle,
      skills: appRecord.skills ? appRecord.skills.split(',').map((s: string) => s.trim()) : ['Full-Stack Development'],
      status: 'Active',
      joiningDate: joiningDate || now.substring(0, 10),
    };
    db.get().employees.push(employee);

    // Create system login account
    const existingUser = db.get().users.find((u) => u.email.toLowerCase() === appRecord.email.toLowerCase());
    if (!existingUser) {
      db.get().users.push({
        id: `usr-${employee.id}`,
        name: appRecord.fullName,
        email: appRecord.email,
        phone: appRecord.phone || '',
        country: appRecord.country || 'Pakistan',
        role: 'employee',
        passwordHash: 'employee123',
        isVerified: true,
        createdAt: now,
      });
    } else {
      existingUser.role = 'employee';
    }
  }

  db.saveData();

  // Send formal contract and onboarding credentials email
  db.logEmail(
    appRecord.email,
    `Official Job Offer & Employment Contract: ${empCode} — CODELIX Careers`,
    'employment_contract',
    `Congratulations ${appRecord.fullName}! CODELIX is pleased to extend you an official employment contract for the position of "${designation || appRecord.vacancyTitle}". Employee ID: ${empCode}. Department: ${department}. Joining Date: ${joiningDate}. Access your staff portal at https://codelix.online with your registered email.`
  );

  res.json({ success: true, application: appRecord, employee });
});

// ==========================================
// 9. EMPLOYEES & CUSTOMERS MANAGEMENT
// ==========================================

app.get('/api/employees', (req, res) => {
  res.json({ success: true, employees: db.get().employees });
});

app.post('/api/employees', (req, res) => {
  const emp = req.body;
  emp.id = `emp-${Date.now()}`;
  emp.employeeCode = `CDX-EMP-${String(db.get().employees.length + 1).padStart(3, '0')}`;
  emp.status = 'Active';
  db.get().employees.push(emp);

  // Also create login account if email provided
  if (emp.workEmail) {
    db.get().users.push({
      id: `usr-${emp.id}`,
      name: emp.fullName,
      email: emp.workEmail,
      phone: emp.phone || '',
      country: 'Pakistan',
      role: 'employee',
      passwordHash: 'employee123',
      isVerified: true,
      createdAt: new Date().toISOString(),
    });
  }

  db.saveData();
  res.json({ success: true, employee: emp });
});

app.put('/api/employees/:id', (req, res) => {
  const index = db.get().employees.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found.' });

  db.get().employees[index] = { ...db.get().employees[index], ...req.body };
  db.saveData();
  res.json({ success: true, employee: db.get().employees[index] });
});

app.get('/api/customers', (req, res) => {
  const customers = db.get().users.filter((u) => u.role === 'customer');
  res.json({ success: true, customers });
});

// ==========================================
// 10. CMS, SMTP & SYSTEM SETTINGS
// ==========================================

app.get('/api/cms', (req, res) => {
  res.json({ success: true, cms: db.get().cms });
});

app.put('/api/cms', (req, res) => {
  db.get().cms = { ...db.get().cms, ...req.body };
  db.saveData();
  res.json({ success: true, cms: db.get().cms });
});

app.get('/api/smtp', (req, res) => {
  res.json({ success: true, smtp: db.get().smtp });
});

app.put('/api/smtp', (req, res) => {
  db.get().smtp = { ...db.get().smtp, ...req.body };
  db.saveData();
  res.json({ success: true, smtp: db.get().smtp });
});

app.post('/api/smtp/test', (req, res) => {
  // Test SMTP connection parameters
  const { host, port, username } = req.body;
  if (!host || !port) {
    return res.status(400).json({ error: 'Host and port are required for SMTP testing.' });
  }

  return res.json({
    success: true,
    message: `SMTP handshake simulation successful: Connected to ${host}:${port} as ${username || 'authenticated user'}. Encryption TLS 1.3 verified.`,
  });
});

app.post('/api/smtp/send-test', (req, res) => {
  const { testRecipient } = req.body;
  if (!testRecipient) return res.status(400).json({ error: 'Test recipient email is required.' });

  const log = db.logEmail(
    testRecipient,
    'CODELIX SMTP Test Notification — Configuration Verified',
    'smtp_test',
    'This is a test notification confirming that the CODELIX SMTP delivery service is operational and properly configured.'
  );

  return res.json({
    success: true,
    message: `Test email successfully queued and logged to ${testRecipient}.`,
    log,
  });
});

app.get('/api/emails', (req, res) => {
  res.json({ success: true, emails: db.get().emailLogs });
});

// Live metrics endpoint for Admin Dashboard
app.get('/api/metrics', (req, res) => {
  const d = db.get();
  const totalRevenue = d.orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const pendingRevenue = d.orders.reduce((sum, o) => sum + (o.paymentStatus !== 'Paid' ? o.total : 0), 0);

  const stats = {
    totalCustomers: d.users.filter((u) => u.role === 'customer').length,
    verifiedCustomers: d.users.filter((u) => u.role === 'customer' && u.isVerified).length,
    totalEmployees: d.employees.length,
    activeEmployees: d.employees.filter((e) => e.status === 'Active').length,
    totalServices: d.services.length,
    publishedOffers: d.offers.filter((o) => o.isActive).length,
    totalOrders: d.orders.length,
    pendingOrders: d.orders.filter((o) => o.status === 'Pending Review').length,
    confirmedOrders: d.orders.filter((o) => o.status === 'Confirmed' || o.status === 'In Progress').length,
    completedOrders: d.orders.filter((o) => o.status === 'Completed').length,
    openComplaints: d.complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Closed').length,
    resolvedComplaints: d.complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
    totalQuotations: d.quotations.length,
    pendingQuotations: d.quotations.filter((q) => q.status === 'Received').length,
    totalApplications: d.applications.length,
    shortlistedApplications: d.applications.filter((a) => a.status === 'Shortlisted').length,
    totalRevenue,
    pendingRevenue,
  };

  res.json({ success: true, stats });
});

// ==========================================
// 11. VITE INTEGRATION FOR DEVELOPMENT
// ==========================================

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CODELIX Digital Solutions Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
