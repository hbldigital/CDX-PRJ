/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shopping Cart & Checkout Context for CODELIX Services
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ServiceAddon } from '../types';

export interface CartItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  packageName: string;
  price: number;
  addons?: ServiceAddon[];
  quantity: number;
  deliveryDays?: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string;
  couponApplied: boolean;
  couponError: string | null;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  toggleAddon: (itemId: string, addon: ServiceAddon) => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('cdx_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [subtotal, setSubtotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // Recalculate totals on change with server verification
  useEffect(() => {
    localStorage.setItem('cdx_cart', JSON.stringify(items));

    const recalculate = async () => {
      try {
        const res = await fetch('/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items,
            couponCode: couponApplied ? couponCode : undefined,
          }),
        });
        const data = await res.json();
        if (data.success && data.totals) {
          setSubtotal(data.totals.subtotal + data.totals.addonTotal);
          setDiscount(data.totals.discount);
          setTotal(data.totals.total);
        }
      } catch {
        // Local calculation fallback
        let sub = 0;
        let addons = 0;
        items.forEach((item) => {
          sub += item.price * item.quantity;
          if (item.addons) {
            addons += item.addons.reduce((sum, a) => sum + a.price, 0) * item.quantity;
          }
        });
        const gross = sub + addons;
        const disc = couponApplied ? Math.round(gross * 0.1) : 0;
        setSubtotal(gross);
        setDiscount(disc);
        setTotal(gross - disc);
      }
    };

    recalculate();
  }, [items, couponApplied, couponCode]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quantity: item.quantity || 1,
      addons: item.addons || [],
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const toggleAddon = (itemId: string, addon: ServiceAddon) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const currentAddons = item.addons || [];
        const exists = currentAddons.some((a) => a.id === addon.id);
        const updated = exists
          ? currentAddons.filter((a) => a.id !== addon.id)
          : [...currentAddons, addon];
        return { ...item, addons: updated };
      })
    );
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    try {
      const res = await fetch('/api/cart/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode: trimmed }),
      });
      const data = await res.json();
      if (data.success && data.coupon) {
        setCouponCode(trimmed);
        setCouponApplied(true);
        return true;
      } else {
        setCouponError('Invalid coupon code. Try CODELIX10 or WELCOME10.');
        setCouponApplied(false);
        return false;
      }
    } catch {
      if (trimmed === 'CODELIX10' || trimmed === 'WELCOME10') {
        setCouponCode(trimmed);
        setCouponApplied(true);
        return true;
      }
      setCouponError('Coupon code could not be verified.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponError(null);
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        total,
        couponCode,
        couponApplied,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleAddon,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
