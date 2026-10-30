import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedStore,
  onSelectStore,
  sortBy,
  onSelectSort,
  maxPrice,
  onPriceChange,
  onReset
}) {
  const stores = [
    { id: 'all', label: 'All Stores' },
    { id: 'amazon', label: 'Amazon India' },
    { id: 'flipkart', label: 'Flipkart' },
    { id: 'croma', label: 'Croma' },
    { id: 'reliance', label: 'Reliance Digital' }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs sticky top-20">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-sm text-slate-900">Filters & Sort</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 transition font-medium"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSelectSort(e.target.value)}
          className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500"
        >
          <option value="savings_desc">Highest Discount / Savings</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Highest Customer Rating</option>
        </select>
      </div>

      {/* Best Store Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Best Price On Store
        </label>
        <div className="space-y-1.5">
          {stores.map((s) => (
            <label
              key={s.id}
              className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition ${
                selectedStore === s.id
                  ? 'bg-brand-50 font-bold text-brand-800 border border-brand-200'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="storeFilter"
                  checked={selectedStore === s.id}
                  onChange={() => onSelectStore(s.id)}
                  className="text-brand-600 focus:ring-brand-500"
                />
                <span>{s.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Categories
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                selectedCategory === cat.name
                  ? 'bg-brand-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.name ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Max Price Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Max Price
          </label>
          <span className="text-xs font-bold text-brand-600">
            ₹{Number(maxPrice).toLocaleString()}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="200000"
          step="5000"
          value={maxPrice}
          onChange={(e) => onPriceChange(e.target.value)}
          className="w-full accent-brand-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>₹10,000</span>
          <span>₹2,00,000+</span>
        </div>
      </div>
    </div>
  );
}

