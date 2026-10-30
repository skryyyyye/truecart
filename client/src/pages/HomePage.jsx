import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  TrendingDown,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  Bell,
  Scale,
  Search,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { handleImageError } from '../utils/imageFallback';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedStore = searchParams.get('store') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'savings_desc';
  const maxPrice = searchParams.get('maxPrice') || '200000';

  // Compare tray state (stored in session)
  const [comparedProducts, setComparedProducts] = useState(() => {
    try {
      const saved = sessionStorage.getItem('truecart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleCompare = (product) => {
    setComparedProducts((prev) => {
      let updated;
      if (prev.some(p => p.id === product.id)) {
        updated = prev.filter(p => p.id !== product.id);
      } else {
        if (prev.length >= 4) {
          alert('You can compare a maximum of 4 products at once.');
          return prev;
        }
        updated = [...prev, product];
      }
      sessionStorage.setItem('truecart_compare', JSON.stringify(updated));
      return updated;
    });
  };

  // Fetch products & categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);
        if (selectedStore !== 'all') queryParams.set('store', selectedStore);
        if (searchQuery) queryParams.set('search', searchQuery);
        if (sortBy) queryParams.set('sortBy', sortBy);
        if (maxPrice) queryParams.set('maxPrice', maxPrice);

        const [prodRes, catRes, dealsRes] = await Promise.all([
          fetch(`/api/products?${queryParams.toString()}`),
          fetch('/api/products/categories'),
          fetch('/api/products/deals')
        ]);

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.products || []);
        }

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }

        if (dealsRes.ok) {
          const dealsData = await dealsRes.json();
          setDeals((dealsData.deals || []).slice(0, 4));
        }
      } catch (err) {
        console.error('Fetch home data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, selectedStore, searchQuery, sortBy, maxPrice]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Store Realtime Deal Intelligence (Amazon · Flipkart · Croma · Reliance Digital)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight brand-font">
            Never Overpay Online Again. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-blue-300 to-emerald-400">
              We Find The Guaranteed Lowest Price.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            TrueCart checks live inventories and historical price trends across India's biggest tech retailers so you always checkout at the absolute lowest cost.
          </p>

          {/* Quick Store Pill Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs text-slate-400 font-medium">Tracking 4 Official Platforms:</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-amber-300 border border-white/15 text-xs font-bold">
                Amazon India
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-blue-300 border border-white/15 text-xs font-bold">
                Flipkart
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-emerald-300 border border-white/15 text-xs font-bold">
                Croma
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-rose-300 border border-white/15 text-xs font-bold">
                Reliance Digital
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BuyHatke 4 Key Superpowers Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">4-Store Price Matrix</h4>
              <p className="text-xs text-slate-500 mt-0.5">Real-time side-by-side pricing from Amazon, Flipkart, Croma & Reliance.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Price History Graph</h4>
              <p className="text-xs text-slate-500 mt-0.5">Know whether current price is truly the lowest ever or an artificial hike.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Price Drop Alerts</h4>
              <p className="text-xs text-slate-500 mt-0.5">Set target price thresholds and receive alerts the moment prices crash.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Verified Coupons</h4>
              <p className="text-xs text-slate-500 mt-0.5">Exclusive instant discount bank codes tested daily on checkout.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Category Browser Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Popular Product Categories:
          </span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => updateParam('category', 'All')}
              className="text-xs font-bold text-brand-600 hover:text-brand-800"
            >
              Reset to All Categories
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {[
            { name: 'All', icon: '⚡', label: 'All Products' },
            { name: 'Fashion', icon: '👟', label: 'Fashion & Shoes' },
            { name: 'Kitchen', icon: '🍳', label: 'Kitchen & Cooking' },
            { name: 'Sports', icon: '🏸', label: 'Sports & Fitness' },
            { name: 'Hardware Tools', icon: '🛠️', label: 'Hardware & Tools' },
            { name: 'Packed Food Items', icon: '🍫', label: 'Packed Foods' },
            { name: 'Smartphones', icon: '📱', label: 'Smartphones' },
            { name: 'Laptops', icon: '💻', label: 'Laptops' },
            { name: 'Audio & Headphones', icon: '🎧', label: 'Audio' },
            { name: 'Smart TVs', icon: '📺', label: 'Smart TVs' },
            { name: 'Gaming & Consoles', icon: '🎮', label: 'Gaming' },
            { name: 'Home Appliances', icon: '🏠', label: 'Appliances' }
          ].map(c => (
            <button
              key={c.name}
              onClick={() => updateParam('category', c.name)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 ${
                selectedCategory === c.name
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals of the Day */}
      {deals.length > 0 && !searchQuery && selectedCategory === 'All' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-rose-100 text-rose-600">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 brand-font">
                  Today's Biggest Price Drops
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Handpicked products currently selling near all-time historical lows
              </p>
            </div>

            <Link
              to="/deals"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 transition"
            >
              <span>View All Hot Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {deals.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onCompareToggle={toggleCompare}
                isCompared={comparedProducts.some(p => p.id === product.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Catalog with Filter Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black text-slate-900 brand-font">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory !== 'All' ? `${selectedCategory} Price Tracker` : 'Compare All Products Across Stores'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {products.length} verified tech products with 4-store comparison
            </p>
          </div>

          {searchQuery && (
            <button
              onClick={() => updateParam('search', '')}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Clear Search "{searchQuery}"
            </button>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filter Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => updateParam('category', cat)}
              selectedStore={selectedStore}
              onSelectStore={(st) => updateParam('store', st)}
              sortBy={sortBy}
              onSelectSort={(sb) => updateParam('sortBy', sb)}
              maxPrice={maxPrice}
              onPriceChange={(pr) => updateParam('maxPrice', pr)}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Column: Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 animate-pulse space-y-4">
                    <div className="h-44 bg-slate-100 rounded-xl"></div>
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                    <div className="h-10 bg-slate-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <Search className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No products matched your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clearing your category, store or price filters to explore the full catalog.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onCompareToggle={toggleCompare}
                    isCompared={comparedProducts.some(p => p.id === product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Compare Tray if products selected */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700 p-3 sm:px-5 sm:py-3.5 flex items-center gap-4 max-w-xl w-[92%] animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-bold">Compare ({comparedProducts.length}/4)</span>
          </div>

          <div className="flex items-center gap-2 flex-1 overflow-x-auto py-1">
            {comparedProducts.map(p => (
              <div key={p.id} className="relative group flex-shrink-0">
                <img
                  src={p.image}
                  alt={p.title}
                  onError={handleImageError}
                  className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain border border-slate-600"
                />
                <button
                  onClick={() => toggleCompare(p)}
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <Link
            to={`/compare?ids=${comparedProducts.map(p => p.id).join(',')}`}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition flex-shrink-0"
          >
            Compare Now →
          </Link>
        </div>
      )}
    </div>
  );
}

