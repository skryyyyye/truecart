import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, ShieldCheck } from 'lucide-react';
import CouponCard from '../components/CouponCard';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStore, setActiveStore] = useState('all');

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const url = activeStore === 'all' ? '/api/coupons' : `/api/coupons?store=${activeStore}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setCoupons(data.coupons || []);
        }
      } catch (err) {
        console.error('Fetch coupons error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [activeStore]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-brand-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>Verified Store Promo Codes</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black brand-font tracking-tight">
              Instant Discount Coupons
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We test hundreds of coupons daily across Amazon, Flipkart, Croma, and Reliance Digital. Click any code below to copy and apply directly at store checkout.
            </p>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'amazon', 'flipkart', 'croma', 'reliance'].map(st => (
            <button
              key={st}
              onClick={() => setActiveStore(st)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                activeStore === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'all' ? 'All Stores' : st}
            </button>
          ))}
        </div>

        {/* Coupons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse h-48"></div>
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No active coupon codes listed for this retailer today.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

