/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Unit tests for CODELIX Business Logic
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  calculateDiscountPercentage,
  calculateProjectProgress,
  generateReference,
  validateWhiteBackground,
  convertPkrToUsd,
  isCustomerEligibleForCoupon,
  type CartItem,
  type Milestone,
} from './businessLogic.ts';

test('calculateDiscountPercentage calculates correct promotion savings', () => {
  // Shopify Store Launch: PKR 7,000 from PKR 29,000
  const discount1 = calculateDiscountPercentage(29000, 7000);
  assert.equal(discount1, 76); // (29000-7000)/29000 = 75.86% -> 76%

  // Single-Vendor: PKR 23,000 from PKR 95,000
  const discount2 = calculateDiscountPercentage(95000, 23000);
  assert.equal(discount2, 76);

  // Construction: PKR 10,000 from PKR 32,000
  const discount3 = calculateDiscountPercentage(32000, 10000);
  assert.equal(discount3, 69);
});

test('calculateCartTotals computes subtotal, add-ons, and coupon discounts correctly', () => {
  const items: CartItem[] = [
    {
      id: 'item-1',
      serviceId: 'srv-shopify',
      serviceTitle: 'Shopify Store Launch',
      packageName: 'Starter Promo',
      price: 7000,
      quantity: 1,
      addons: [
        { id: 'ad-1', name: 'Extra 5 Products Setup', price: 2000 },
        { id: 'ad-2', name: 'Payment Gateway Integration', price: 3000 },
      ],
    },
    {
      id: 'item-2',
      serviceId: 'srv-seo',
      serviceTitle: 'Advanced SEO Setup',
      packageName: 'Standard',
      price: 5000,
      quantity: 2,
    },
  ];

  // Base: 7000*1 + 5000*2 = 17000
  // Addons: (2000 + 3000) * 1 = 5000
  // Gross = 22000
  const totalsWithoutCoupon = calculateCartTotals(items, null);
  assert.equal(totalsWithoutCoupon.subtotal, 17000);
  assert.equal(totalsWithoutCoupon.addonTotal, 5000);
  assert.equal(totalsWithoutCoupon.discount, 0);
  assert.equal(totalsWithoutCoupon.total, 22000);

  // 10% discount coupon
  const totalsWithCoupon = calculateCartTotals(items, {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
  });
  assert.equal(totalsWithCoupon.discount, 2200);
  assert.equal(totalsWithCoupon.total, 19800);
});

test('calculateProjectProgress correctly weights milestone progress and remaining %', () => {
  const milestones: Milestone[] = [
    { id: 'm1', title: 'Project Discovery & Architecture', weight: 20, progress: 100, completed: true },
    { id: 'm2', title: 'UI/UX Design & Prototyping', weight: 25, progress: 100, completed: true },
    { id: 'm3', title: 'Frontend & Backend Development', weight: 35, progress: 60, completed: false },
    { id: 'm4', title: 'Quality Assurance & Security Audit', weight: 10, progress: 20, completed: false },
    { id: 'm5', title: 'Deployment & SMTP Configuration', weight: 10, progress: 0, completed: false },
  ];

  // Weighted progress: 20*100 + 25*100 + 35*60 + 10*20 + 10*0 = 2000 + 2500 + 2100 + 200 + 0 = 6800 / 100 = 68%
  const res = calculateProjectProgress(milestones);
  assert.equal(res.overallProgress, 68);
  assert.equal(res.remainingProgress, 32);
});

test('generateReference generates standardized unique human-readable references', () => {
  assert.equal(generateReference('CDX-ORD', 101, 2026), 'CDX-ORD-2026-000101');
  assert.equal(generateReference('CDX-CMP', 123, 2026), 'CDX-CMP-2026-000123');
  assert.equal(generateReference('CDX-QT', 8, 2026), 'CDX-QT-2026-000008');
  assert.equal(generateReference('CDX-APP', 45, 2026), 'CDX-APP-2026-000045');
});

test('validateWhiteBackground correctly flags compliant white backgrounds vs colored backgrounds', () => {
  // Compliant white background border pixels
  const whitePixels = [
    { r: 255, g: 255, b: 255 },
    { r: 250, g: 250, b: 250 },
    { r: 245, g: 246, b: 247 },
    { r: 240, g: 240, b: 242 },
    { r: 252, g: 253, b: 255 },
  ];
  const passCheck = validateWhiteBackground(whitePixels);
  assert.equal(passCheck.isWhite, true);
  assert.equal(passCheck.score, 100);

  // Colored/dark background pixels (e.g. blue or gray background)
  const coloredPixels = [
    { r: 40, g: 80, b: 160 },
    { r: 50, g: 90, b: 170 },
    { r: 245, g: 246, b: 247 },
    { r: 30, g: 40, b: 50 },
  ];
  const failCheck = validateWhiteBackground(coloredPixels);
  assert.equal(failCheck.isWhite, false);
  assert.equal(failCheck.score, 25);
});

test('convertPkrToUsd converts PKR to USD with admin-set rate (1 USD = 271 PKR)', () => {
  // 7,000 PKR / 271 = 25.83 USD
  const usd1 = convertPkrToUsd(7000, 271);
  assert.equal(usd1, 25.83);

  // 27,100 PKR / 271 = 100.00 USD
  const usd2 = convertPkrToUsd(27100, 271);
  assert.equal(usd2, 100);

  // 23,000 PKR / 271 = 84.87 USD
  const usd3 = convertPkrToUsd(23000, 271);
  assert.equal(usd3, 84.87);
});

test('isCustomerEligibleForCoupon correctly handles public vs targeted exclusive coupons', () => {
  // Public coupon
  const publicCoupon = {
    isExclusive: false,
    isActive: true,
  };
  assert.equal(isCustomerEligibleForCoupon(publicCoupon, 'usr-1', 'client@example.com'), true);
  assert.equal(isCustomerEligibleForCoupon(publicCoupon), true);

  // Exclusive coupon targeted to specific customers
  const exclusiveCoupon = {
    isExclusive: true,
    isActive: true,
    eligibleCustomerIds: ['usr-vip-1', 'usr-vip-2'],
    eligibleEmails: ['vip@codelix.online'],
  };
  // Eligible by ID
  assert.equal(isCustomerEligibleForCoupon(exclusiveCoupon, 'usr-vip-1', 'other@mail.com'), true);
  // Eligible by Email
  assert.equal(isCustomerEligibleForCoupon(exclusiveCoupon, 'usr-unknown', 'vip@codelix.online'), true);
  // Non-eligible customer
  assert.equal(isCustomerEligibleForCoupon(exclusiveCoupon, 'usr-guest', 'guest@mail.com'), false);
});

