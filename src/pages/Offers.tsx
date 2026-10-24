/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CODELIX Special Promotional Offers (7 Core Packages)
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  ShoppingCart,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Globe,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Offer } from '../types';

interface OffersProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Offers: React.FC<OffersProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((d) => d.success && setOffers(d.offers))
      .catch((e) => console.error(e));
  }, []);

  const handleAddOffer = (offer: Offer) => {
    addToCart({
      serviceId: offer.id,
      serviceTitle: offer.title,
      packageName: 'Promotional Launch Offer',
      price: offer.promotionalPrice,
      quantity: 1,
      deliveryDays: 7,
    });
    setToastMsg(`Added "${offer.title}" to cart at PKR ${offer.promotionalPrice.toLocaleString()}!`);
    setTimeout(() => setToastMsg(null), 3000);
  };

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
            Checkout
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 text-red-700 font-extrabold text-xs uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Limited Seat Launch Promotions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight">
            Official CODELIX Promotional Packages
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Take advantage of heavily subsidized development packages with free 1-year domains, hosting inclusions, premium scripts, and complete SMTP setup.
          </p>

          <div className="mt-4 text-xs text-slate-500 font-medium">
            * All promotional packages are strictly allocated by real reservation count. Disclosed inclusions are subject to package terms.
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, idx) => {
            const remaining = offer.totalQuantity - offer.claimedQuantity;
            const isAlmostGone = remaining <= 5;

            return (
              <div
                key={offer.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group hover:border-blue-400"
              >
                {/* Discount Badge */}
                <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  SAVE {offer.discountPercentage}%
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                      Offer #{idx + 1} • {offer.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#0B192C] mt-2 group-hover:text-blue-600 transition-colors">
                    {offer.title}
                  </h3>

                  {/* Pricing Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] text-slate-600 font-bold uppercase">Promotional Price</div>
                      <div className="text-2xl sm:text-3xl font-black text-[#0B192C] font-mono">
                        PKR {offer.promotionalPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-600 font-bold uppercase">Standard Price</div>
                      <div className="text-sm text-slate-600 line-through font-mono">
                        PKR {offer.originalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Scarcity Counter */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600">Availability:</span>
                      <span className={isAlmostGone ? 'text-red-600 font-bold' : 'text-slate-700 font-bold'}>
                        {remaining} of {offer.totalQuantity} Remaining
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-red-500 to-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(offer.claimedQuantity / offer.totalQuantity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Domain Extensions If applicable */}
                  {offer.domainExtensions && offer.domainExtensions.length > 0 && (
                    <div className="mt-4 p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900">
                      <span className="font-bold flex items-center gap-1 mb-1">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        Eligible Domain Extensions:
                      </span>
                      <div className="flex flex-wrap gap-1 font-mono text-[10px]">
                        {offer.domainExtensions.map((ext, eidx) => (
                          <span key={eidx} className="bg-white px-1.5 py-0.5 rounded-sm border border-blue-200 font-bold">
                            {ext}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="mt-5 space-y-2">
                    <div className="text-xs font-bold text-slate-700 uppercase">Package Includes:</div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {offer.features.map((feat, fidx) => (
                        <li key={fidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer if present */}
                  {offer.disclaimer && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{offer.disclaimer}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleAddOffer(offer)}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Claim Package for PKR {offer.promotionalPrice.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
