import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  TrendingDown,
  Tag,
  Scale,
  Bell,
  Heart,
  User,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

export default function Navbar() {
  const { user, logout, alerts, watchlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Active triggered alerts count
  const triggeredCount = alerts.filter(a => a.status === 'triggered').length;

  // Live search debounced
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.products.slice(0, 5));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStoreBadgeColor = (store) => {
    switch (store) {
      case 'amazon': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'flipkart': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'croma': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'reliance': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">
              Live Price Tracking Active across <strong className="text-white">Amazon</strong>, <strong className="text-white">Flipkart</strong>, <strong className="text-white">Croma</strong> & <strong className="text-white">Reliance Digital</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-300">
            <Link to="/coupons" className="hover:text-white transition flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" /> Verified Coupons
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/deals" className="hover:text-white transition flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Price Drops Today
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/admin" className="hover:text-amber-300 text-amber-400 font-semibold transition flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-slate-900 brand-font">
                  True<span className="text-brand-600">Cart</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  Like BuyHatke
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block -mt-1 font-medium">
                Smartest Price Comparison Engine
              </p>
            </div>
          </Link>

          {/* Search bar with instant autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search phones, laptops, TVs, headphones across 4 stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-24 py-2.5 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Compare
              </button>
            </form>

            {/* Live search dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-12 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 flex justify-between items-center">
                  <span>Price Comparison Matches</span>
                  <span className="text-[11px] text-brand-600">Amazon · Flipkart · Croma · Reliance</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          onError={handleImageError}
                          className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1 flex-shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-500 font-medium">{product.category}</span>
                            <span className="text-slate-300">·</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${getStoreBadgeColor(product.bestStore)}`}>
                              Lowest on {product.bestStore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-slate-900">
                          {formatPrice(product.currentLowestPrice)}
                        </div>
                        <div className="text-xs text-emerald-600 font-medium">
                          Save {formatPrice(product.totalSavingsVsMRP)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div
                  onClick={handleSearchSubmit}
                  className="p-2.5 bg-slate-50 text-center text-xs text-brand-600 hover:text-brand-800 font-semibold cursor-pointer border-t border-slate-100"
                >
                  View all results for "{searchQuery}" →
                </div>
              </div>
            )}
          </div>

          {/* Quick links & user actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Compare Link */}
            <Link
              to="/compare"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
              title="Side-by-side product specs & price compare"
            >
              <Scale className="w-4 h-4 text-slate-500" />
              <span>Compare</span>
            </Link>

            {/* Deals Link */}
            <Link
              to="/deals"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            >
              <TrendingDown className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Deals</span>
            </Link>

            {/* Coupons Link */}
            <Link
              to="/coupons"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition"
            >
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Coupons</span>
            </Link>

            {/* Admin Portal Shortcut Button */}
            <Link
              to="/admin"
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-slate-700 hover:text-brand-700 hover:bg-slate-100 border border-slate-300 rounded-lg transition shadow-xs"
              title="Admin Page (Username & Password)"
            >
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {/* User Account Button or Sign in / Sign up */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[80px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  {triggeredCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  )}
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 uppercase tracking-wide">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-brand-600" /> My Price Alerts
                      </span>
                      {alerts.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-brand-100 text-brand-700 rounded-full font-bold">
                          {alerts.length}
                        </span>
                      )}
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500" /> Saved Products
                      </span>
                      {watchlist.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded-full font-bold">
                          {watchlist.length}
                        </span>
                      )}
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Console
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-brand-600 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="py-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search Amazon, Flipkart, Croma, Reliance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-20 py-2 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 bg-brand-600 text-white rounded-full text-[11px] font-semibold"
            >
              Compare
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
          <Link
            to="/deals"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600" /> Hot Deals & Price Drops
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/coupons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-500" /> Verified Coupons
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/compare"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-semibold text-slate-800"
          >
            <span className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-brand-600" /> Compare Products
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between py-2 text-sm font-semibold text-amber-700 bg-amber-50 px-2 rounded-lg"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" /> Admin Portal Login
            </span>
            <ChevronRight className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      )}
    </header>
  );
}

