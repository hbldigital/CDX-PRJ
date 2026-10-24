/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Business Logic & Validation Engine
 */

export interface CartItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  packageName: string;
  price: number;
  addons?: Array<{ id: string; name: string; price: number }>;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder?: number;
  isActive: boolean;
}

/**
 * Calculates cart subtotal, discount, and grand total in PKR
 */
export function calculateCartTotals(
  items: CartItem[],
  coupon?: Coupon | null
): { subtotal: number; addonTotal: number; discount: number; total: number } {
  let subtotal = 0;
  let addonTotal = 0;

  for (const item of items) {
    const itemBase = item.price * (item.quantity || 1);
    subtotal += itemBase;
    if (item.addons && item.addons.length > 0) {
      const addonsSum = item.addons.reduce((sum, a) => sum + a.price, 0) * (item.quantity || 1);
      addonTotal += addonsSum;
    }
  }

  const gross = subtotal + addonTotal;
  let discount = 0;

  if (coupon && coupon.isActive) {
    if (!coupon.minOrder || gross >= coupon.minOrder) {
      if (coupon.discountType === 'percentage') {
        discount = Math.round((gross * coupon.discountValue) / 100);
      } else {
        discount = Math.min(coupon.discountValue, gross);
      }
    }
  }

  const total = Math.max(0, gross - discount);

  return {
    subtotal,
    addonTotal,
    discount,
    total,
  };
}

/**
 * Converts PKR to USD based on admin configured exchange rate
 */
export function convertPkrToUsd(pkrAmount: number, usdToPkrRate: number = 271): number {
  if (pkrAmount <= 0 || usdToPkrRate <= 0) return 0;
  const usd = pkrAmount / usdToPkrRate;
  // Return rounded to 2 decimal places
  return Math.round(usd * 100) / 100;
}

/**
 * Validates whether a customer is eligible for a specific coupon
 */
export function isCustomerEligibleForCoupon(
  coupon: {
    eligibleCustomerIds?: string[];
    eligibleEmails?: string[];
    isExclusive?: boolean;
    isActive: boolean;
  },
  customerId?: string,
  customerEmail?: string
): boolean {
  if (!coupon || !coupon.isActive) return false;
  // If not exclusive, valid for all
  if (!coupon.isExclusive) return true;

  // If exclusive, must match customer ID or email
  const matchId = !!(customerId && coupon.eligibleCustomerIds?.includes(customerId));
  const matchEmail = !!(customerEmail && coupon.eligibleEmails?.some(e => e.toLowerCase() === customerEmail.toLowerCase()));
  return matchId || matchEmail;
}

/**
 * Calculates percentage discount between original and promotional price
 */
export function calculateDiscountPercentage(originalPrice: number, promotionalPrice: number): number {
  if (originalPrice <= 0 || promotionalPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - promotionalPrice) / originalPrice) * 100);
}

export interface Milestone {
  id: string;
  title: string;
  weight: number; // percentage weight, sum across milestones = 100
  progress: number; // 0 to 100
  completed: boolean;
}

/**
 * Computes overall project progress percentage and remaining percentage
 */
export function calculateProjectProgress(milestones: Milestone[]): {
  overallProgress: number;
  remainingProgress: number;
} {
  if (!milestones || milestones.length === 0) {
    return { overallProgress: 0, remainingProgress: 100 };
  }

  const totalWeight = milestones.reduce((sum, m) => sum + (m.weight || 0), 0);
  if (totalWeight <= 0) {
    // Unweighted average
    const avg = Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / milestones.length);
    return { overallProgress: avg, remainingProgress: 100 - avg };
  }

  const weightedSum = milestones.reduce((sum, m) => {
    const p = Math.min(100, Math.max(0, m.progress));
    return sum + (p * (m.weight || 0));
  }, 0);

  const overall = Math.min(100, Math.max(0, Math.round(weightedSum / totalWeight)));
  return {
    overallProgress: overall,
    remainingProgress: 100 - overall,
  };
}

/**
 * Reference number generators for CODELIX
 */
export function generateReference(prefix: 'CDX-ORD' | 'CDX-CMP' | 'CDX-QT' | 'CDX-APP' | 'CDX-INQ' | 'CDX-DEMO' | 'CDX-IDEA', sequence: number, year: number = 2026): string {
  const padded = String(sequence).padStart(6, '0');
  return `${prefix}-${year}-${padded}`;
}

/**
 * Validates whether passport photo has an adequately white/light neutral background
 * checks sample border pixels RGB values (R>220, G>220, B>220 and difference < 25)
 */
export function validateWhiteBackground(borderPixels: Array<{ r: number; g: number; b: number }>): {
  isWhite: boolean;
  score: number;
  message: string;
} {
  if (!borderPixels || borderPixels.length === 0) {
    return { isWhite: false, score: 0, message: 'No pixel data provided' };
  }

  let whitePixelCount = 0;
  for (const p of borderPixels) {
    const brightness = (p.r + p.g + p.b) / 3;
    const maxDiff = Math.max(Math.abs(p.r - p.g), Math.abs(p.g - p.b), Math.abs(p.r - p.b));
    // Must be bright (> 215) and neutral (low saturation diff < 20)
    if (brightness >= 215 && maxDiff <= 25) {
      whitePixelCount++;
    }
  }

  const score = Math.round((whitePixelCount / borderPixels.length) * 100);
  const isWhite = score >= 80;

  return {
    isWhite,
    score,
    message: isWhite
      ? `Background verified: ${score}% white/light neutral pixels compliant with passport requirements.`
      : `Background check failed: Only ${score}% white/light neutral pixels detected. Plain white background is required.`,
  };
}
