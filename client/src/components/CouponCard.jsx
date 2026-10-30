import React, { useState } from 'react';
import { Copy, Check, Tag, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CouponCard({ coupon }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const getStoreStyles = (store) => {
    switch (store) {
      case 'amazon':
        return {
          name: 'Amazon India',
          border: 'border-amber-200',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          link: 'https://www.amazon.in'
        };
      case 'flipkart':
        return {
          name: 'Flipkart',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          link: 'https://www.flipkart.com'
        };
      case 'croma':
        return {
          name: 'Croma',
          border: 'border-teal-200',
          badge: 'bg-teal-100 text-teal-800 border-teal-300',
          link: 'https://www.croma.com'
        };
      case 'reliance':
        return {
          name: 'Reliance Digital',
          border: 'border-rose-200',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          link: 'https://www.reliancedigital.in'
        };
      default:
        return {
          name: 'Store',
          border: 'border-slate-200',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          link: '#'
        };
    }
  };

  const s = getStoreStyles(coupon.store);

  return (
    <div className={`bg-white rounded-2xl border ${s.border} p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4 relative overflow-hidden`}>
      {/* Top store badge & verified */}
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${s.badge}`}>
          {s.name}
        </span>
        {coupon.verified && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Today
          </span>
        )}
      </div>

      {/* Coupon details */}
      <div className="space-y-1.5">
        <div className="text-xl font-black text-slate-900 brand-font">
          {coupon.discountAmount}
        </div>
        <h4 className="text-sm font-semibold text-slate-800 line-clamp-2">
          {coupon.title}
        </h4>
        <p className="text-xs text-slate-500">
          Min. Order: ₹{coupon.minPurchase.toLocaleString()} · Valid till {coupon.expiry}
        </p>
      </div>

      {/* Code copy block */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <div className="flex-1 bg-slate-50 border border-dashed border-slate-300 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="font-mono text-sm font-bold tracking-wider text-slate-900">
            {coupon.code}
          </span>
          <button
            onClick={copyToClipboard}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition flex items-center gap-1 ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-white hover:bg-brand-600'
            }`}
          >
            {copied ? (
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

        <a
          href={s.link}
          target="_blank"
          rel="noopener noreferrer"
          title={`Go to ${s.name}`}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

