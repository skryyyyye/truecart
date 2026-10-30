import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Bell, Heart, ExternalLink, ArrowRight, Check, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PriceAlertModal from './PriceAlertModal';
import { handleImageError } from '../utils/imageFallback';

export default function ProductCard({ product, onCompareToggle, isCompared }) {
  const { watchlist, toggleWatch } = useAuth();
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  const isSaved = watchlist.some(item => item.id === product.id);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStoreBadge = (storeKey) => {
    switch (storeKey) {
      case 'amazon':
        return <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Amazon</span>;
      case 'flipkart':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">Flipkart</span>;
      case 'croma':
        return <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">Croma</span>;
      case 'reliance':
        return <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Reliance</span>;
      default:
        return null;
    }
  };

  const stores = product.stores || {};
  const currentLowest = product.currentLowestPrice;

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-400 hover:shadow-xl hover:shadow-brand-500/5 transition-all duration-300 flex flex-col overflow-hidden relative">
        
        {/* Top Badges & Wishlist */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white">
              {product.badge}
            </span>
          ) : <span></span>}

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare checkbox icon */}
            {onCompareToggle && (
              <button
                onClick={() => onCompareToggle(product)}
                title="Add to side-by-side comparison"
                className={`p-1.5 rounded-full border transition ${
                  isCompared
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white/90 backdrop-blur-xs text-slate-500 border-slate-200 hover:text-brand-600'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Price Alert button */}
            <button
              onClick={() => setAlertModalOpen(true)}
              title="Set Price Drop Alert"
              className="p-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-slate-500 hover:text-amber-500 hover:border-amber-300 transition"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist button */}
            <button
              onClick={() => toggleWatch(product.id)}
              title="Save to Wishlist"
              className={`p-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 transition ${
                isSaved ? 'text-rose-500 border-rose-300' : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Image */}
        <Link
          to={`/product/${product.id}`}
          className="relative pt-12 pb-4 px-6 bg-gradient-to-b from-slate-50/60 to-white flex items-center justify-center h-52 overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.title}
            onError={handleImageError}
            className="h-44 w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Details section */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-400">{product.brand}</span>
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <Link
              to={`/product/${product.id}`}
              className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug"
            >
              {product.title}
            </Link>
          </div>

          {/* 4-Store Quick Price Matrix */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
              Live Store Prices:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {stores.amazon && (
                <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  product.bestStore === 'amazon' ? 'bg-amber-50/80 border-amber-300 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <span className="text-[10px] text-amber-800">Amazon</span>
                  <span>{formatPrice(stores.amazon.price)}</span>
                </div>
              )}
              {stores.flipkart && (
                <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  product.bestStore === 'flipkart' ? 'bg-blue-50/80 border-blue-300 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <span className="text-[10px] text-blue-800">Flipkart</span>
                  <span>{formatPrice(stores.flipkart.price)}</span>
                </div>
              )}
              {stores.croma && (
                <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  product.bestStore === 'croma' ? 'bg-emerald-50/80 border-emerald-300 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <span className="text-[10px] text-emerald-800">Croma</span>
                  <span>{formatPrice(stores.croma.price)}</span>
                </div>
              )}
              {stores.reliance && (
                <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                  product.bestStore === 'reliance' ? 'bg-rose-50/80 border-rose-300 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <span className="text-[10px] text-rose-800">Reliance</span>
                  <span>{formatPrice(stores.reliance.price)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Highlight & CTA */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Lowest Available Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900">
                    {formatPrice(currentLowest)}
                  </span>
                  {product.mrp && product.mrp > currentLowest && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                </div>
              </div>

              {product.totalSavingsVsMRP > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Save {formatPrice(product.totalSavingsVsMRP)}
                </span>
              )}
            </div>

            {/* Direct action button */}
            <div className="mt-3 flex items-center gap-2">
              <Link
                to={`/product/${product.id}`}
                className="flex-1 py-2 text-center text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 rounded-xl transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Compare Prices</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Alert modal */}
      <PriceAlertModal
        product={product}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </>
  );
}

