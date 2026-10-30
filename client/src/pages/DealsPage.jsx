import React, { useState, useEffect } from 'react';
import { TrendingDown, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStore, setActiveStore] = useState('all');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products/deals');
        if (res.ok) {
          const data = await res.json();
          setDeals(data.deals || []);
        }
      } catch (err) {
        console.error('Fetch deals error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const filteredDeals = activeStore === 'all'
    ? deals
    : deals.filter(d => d.bestStore === activeStore);

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Verified Price Drops Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black brand-font tracking-tight">
              Today's Hottest Tech Deals
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every deal here has been verified by our price tracking engine against the 90-day pricing history. These products are currently at or very close to their all-time lowest price.
            </p>
          </div>
        </div>

        {/* Store Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveStore('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeStore === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Deals ({deals.length})
          </button>
          <button
            onClick={() => setActiveStore('amazon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeStore === 'amazon'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Amazon Deals
          </button>
          <button
            onClick={() => setActiveStore('flipkart')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeStore === 'flipkart'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Flipkart Deals
          </button>
          <button
            onClick={() => setActiveStore('croma')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeStore === 'croma'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Croma Deals
          </button>
          <button
            onClick={() => setActiveStore('reliance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeStore === 'reliance'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Reliance Deals
          </button>
        </div>

        {/* Deals Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse h-80"></div>
            ))}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No active deals found for the selected retailer right now. Check back shortly!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

