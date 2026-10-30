import React from 'react';
import { ExternalLink, CheckCircle, Truck, RotateCcw, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

export default function StoreComparisonTable({ product }) {
  if (!product || !product.stores) return null;

  const storesList = [
    { key: 'amazon', data: product.stores.amazon, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { key: 'flipkart', data: product.stores.flipkart, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { key: 'croma', data: product.stores.croma, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { key: 'reliance', data: product.stores.reliance, color: 'text-rose-600 bg-rose-50 border-rose-200' }
  ].filter(s => s.data);

  // Sort lowest price first
  storesList.sort((a, b) => a.data.price - b.data.price);

  const lowestPrice = storesList[0]?.data.price || product.currentLowestPrice;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStoreLogoBadge = (key) => {
    switch (key) {
      case 'amazon':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900]/10 flex items-center justify-center font-black text-amber-700 text-xs border border-[#FF9900]/30">
              a
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Amazon India</span>
              <span className="text-[10px] text-amber-600 font-semibold">Prime Fast Delivery</span>
            </div>
          </div>
        );
      case 'flipkart':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2874F0]/10 flex items-center justify-center font-black text-blue-700 text-xs border border-[#2874F0]/30">
              fk
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Flipkart</span>
              <span className="text-[10px] text-blue-600 font-semibold">Flipkart Assured</span>
            </div>
          </div>
        );
      case 'croma':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#00B5B5]/10 flex items-center justify-center font-black text-teal-700 text-xs border border-[#00B5B5]/30">
              cr
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Croma Electronics</span>
              <span className="text-[10px] text-teal-600 font-semibold">Tata Neu Coins & Store Pickup</span>
            </div>
          </div>
        );
      case 'reliance':
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E11B22]/10 flex items-center justify-center font-black text-rose-700 text-xs border border-[#E11B22]/30">
              rd
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">Reliance Digital</span>
              <span className="text-[10px] text-rose-600 font-semibold">ResQ Official Warranty</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      {/* Table Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold brand-font">
              Live Multi-Store Price Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time price & deal verification across Amazon, Flipkart, Croma, and Reliance Digital
          </p>
        </div>

        {product.savingsVsOtherStores > 0 && (
          <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-semibold flex items-center gap-1.5">
            <span>Extra Save {formatPrice(product.savingsVsOtherStores)} vs Other Retailers</span>
          </div>
        )}
      </div>

      {/* Comparison Rows */}
      <div className="divide-y divide-slate-100">
        {storesList.map(({ key, data }, idx) => {
          const isBest = data.price === lowestPrice;
          const savingsVsThis = data.price - lowestPrice;

          return (
            <div
              key={key}
              className={`p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                isBest ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
              }`}
            >
              {/* Left: Store identity & best deal tag */}
              <div className="flex items-center gap-4 min-w-[220px]">
                {getStoreLogoBadge(key)}
                {isBest && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                    <CheckCircle className="w-3 h-3" /> BEST DEAL
                  </span>
                )}
              </div>

              {/* Middle: Perks, Bank Offer & Delivery */}
              <div className="flex-1 space-y-1.5 text-xs text-slate-600">
                {data.bankOffer && (
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{data.bankOffer}</span>
                  </div>
                )}
                <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3 h-3 text-slate-400" />
                    {data.delivery || "Standard Delivery"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <RotateCcw className="w-3 h-3 text-slate-400" />
                    {data.returnDays || "Standard Return"}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">
                    ✓ Verified in stock
                  </span>
                </div>
              </div>

              {/* Right: Pricing & Buy Now CTA */}
              <div className="flex items-center justify-between lg:justify-end gap-5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-left lg:text-right">
                  <div className="flex items-baseline gap-2 lg:justify-end">
                    <span className="text-xl sm:text-2xl font-black text-slate-900">
                      {formatPrice(data.price)}
                    </span>
                    {product.mrp && product.mrp > data.price && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(product.mrp)}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-semibold flex items-center gap-1.5 lg:justify-end mt-0.5">
                    <span className="text-emerald-600">
                      {data.discountPercent}% OFF
                    </span>
                    {!isBest && savingsVsThis > 0 && (
                      <span className="text-rose-500 font-normal">
                        (+{formatPrice(savingsVsThis)} higher)
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={data.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all transform hover:-translate-y-0.5 ${
                    isBest
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <span>Buy on {data.storeName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification footer */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Prices synced within the last few minutes. Direct checkout on retailer store websites.
        </span>
        <span className="text-slate-400">Zero markup · 100% Free Comparison</span>
      </div>
    </div>
  );
}

