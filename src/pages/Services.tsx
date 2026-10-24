/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Services & Package Catalog
 */

import React, { useState, useEffect } from 'react';
import {
  Code2,
  ShoppingBag,
  Globe,
  ShoppingCart,
  Layers,
  Layout,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Plus,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Service, ServicePackage, ServiceAddon } from '../types';

interface ServicesProps {
  onNavigate: (view: string, params?: any) => void;
  initialCategory?: string;
}

export const Services: React.FC<ServicesProps> = ({ onNavigate, initialCategory }) => {
  const { addToCart } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedAddons, setSelectedAddons] = useState<Record<string, ServiceAddon[]>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((d) => d.success && setServices(d.services))
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'All',
    'PHP Development',
    'Shopify',
    'WordPress',
    'WooCommerce',
    'Custom Software',
    'HTML, CSS & JavaScript',
  ];

  const handleToggleAddon = (packageKey: string, addon: ServiceAddon) => {
    setSelectedAddons((prev) => {
      const current = prev[packageKey] || [];
      const exists = current.some((a) => a.id === addon.id);
      const updated = exists ? current.filter((a) => a.id !== addon.id) : [...current, addon];
      return { ...prev, [packageKey]: updated };
    });
  };

  const handleOrderPackage = (service: Service, pkg: ServicePackage) => {
    const packageKey = `${service.id}-${pkg.name}`;
    const addonsForPkg = selectedAddons[packageKey] || [];

    addToCart({
      serviceId: service.id,
      serviceTitle: service.title,
      packageName: pkg.name,
      price: pkg.price,
      quantity: 1,
      deliveryDays: pkg.deliveryDays,
      addons: addonsForPkg,
    });

    setToastMsg(`Added "${service.title} — ${pkg.name}" to cart!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="bg-white min-h-screen py-12">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold">{toastMsg}</span>
          <button
            onClick={() => onNavigate('cart')}
            className="text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-3 py-1 rounded-xl font-black uppercase ml-2"
          >
            Go to Cart
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
            Transparent Pricing & Real Deliverables
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] mt-2 tracking-tight">
            Comprehensive Web & Software Solutions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Every service includes object-oriented clean code, mobile-first responsive design, administrative controls, and transparent milestone tracking.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services List with Package Cards */}
        <div className="space-y-16">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10"
            >
              {/* Service Header Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-8 mb-8">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {service.category}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Estimated Turnaround: 3–25 Working Days
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B192C] mt-2">
                    {service.title}
                  </h2>

                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('contact', { tab: 'quote', service: service.title })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Request Custom Quote</span>
                </button>
              </div>

              {/* Service Features Checklist */}
              <div className="mb-8 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-3">
                  Included in all {service.category} Projects:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {service.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Package Tiers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.packages.map((pkg, pidx) => {
                  const packageKey = `${service.id}-${pkg.name}`;
                  const currentSelectedAddons = selectedAddons[packageKey] || [];
                  const addonsPrice = currentSelectedAddons.reduce((sum, a) => sum + a.price, 0);
                  const totalPrice = pkg.price + addonsPrice;

                  return (
                    <div
                      key={pidx}
                      className="rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-blue-500 transition-all hover:shadow-lg bg-gradient-to-b from-white to-slate-50/30"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-extrabold text-base text-slate-900">{pkg.name}</h3>
                          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            Tier {pidx + 1}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-[#0B192C] font-mono">
                            PKR {pkg.price.toLocaleString()}
                          </span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-slate-600 line-through font-mono">
                              PKR {pkg.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Meta delivery details */}
                        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            <span>{pkg.deliveryDays} Days Delivery</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5 text-cyan-500" />
                            <span>{pkg.revisions}</span>
                          </div>
                        </div>

                        {/* Package Features */}
                        <ul className="mt-4 space-y-2 text-xs text-slate-600">
                          {pkg.features.map((f, fidx) => (
                            <li key={fidx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Add-ons checkboxes */}
                        {service.addons && service.addons.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-700 uppercase block mb-2">
                              Optional Add-ons:
                            </span>
                            <div className="space-y-1.5">
                              {service.addons.map((addon) => {
                                const isChecked = currentSelectedAddons.some((a) => a.id === addon.id);
                                return (
                                  <label
                                    key={addon.id}
                                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                                      isChecked
                                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleToggleAddon(packageKey, addon)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-[11px] font-medium">{addon.name}</span>
                                    </div>
                                    <span className="font-mono font-bold text-[11px]">
                                      +PKR {addon.price.toLocaleString()}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {addonsPrice > 0 && (
                          <div className="text-xs text-slate-600 flex justify-between font-bold mb-2">
                            <span>Total with Add-ons:</span>
                            <span className="font-mono text-blue-600">
                              PKR {totalPrice.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleOrderPackage(service, pkg)}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Order This Package</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
