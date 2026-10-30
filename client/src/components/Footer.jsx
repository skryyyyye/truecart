import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, TrendingDown, ArrowUpRight, Heart, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                True<span className="text-brand-400">Cart</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              India's smart multi-store price comparison engine inspired by BuyHatke.
              We track prices, analyze historical charts, and notify you instantly when prices drop on top platforms.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Tracked E-Commerce Stores
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                  Amazon India
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-950/80 text-blue-300 border border-blue-800/60">
                  Flipkart
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  Croma
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-800/60">
                  Reliance Digital
                </span>
              </div>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/?category=Smartphones" className="hover:text-white transition">
                  5G Smartphones & Flagships
                </Link>
              </li>
              <li>
                <Link to="/?category=Fashion" className="hover:text-white transition">
                  Fashion, Sneakers & Denim
                </Link>
              </li>
              <li>
                <Link to="/?category=Kitchen" className="hover:text-white transition">
                  Kitchen, Air Fryers & Mixers
                </Link>
              </li>
              <li>
                <Link to="/?category=Sports" className="hover:text-white transition">
                  Sports Gear & Fitness
                </Link>
              </li>
              <li>
                <Link to="/?category=Hardware+Tools" className="hover:text-white transition">
                  Hardware & Power Tools
                </Link>
              </li>
              <li>
                <Link to="/?category=Packed+Food+Items" className="hover:text-white transition">
                  Packed Foods & Gourmet Grocery
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Price Tools & Savings
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/deals" className="hover:text-white transition flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" /> Today's Biggest Price Drops
                </Link>
              </li>
              <li>
                <Link to="/coupons" className="hover:text-white transition">
                  Verified Store Coupon Codes
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition">
                  Multi-Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition">
                  My Price Drop Alerts
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-amber-400 hover:text-amber-300 font-semibold transition flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Room
                </Link>
              </li>
            </ul>
          </div>

          {/* BuyHatke Promise */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-amber-400 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">TrueCart Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never promote higher-priced links. Our algorithms always highlight the lowest authentic price across all 4 top Indian retailers.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700 text-[11px] text-slate-400">
              Admin Login: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300">admin / admin123</code>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TrueCart. All product names, logos, and brands are property of their respective owners.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian online shoppers
          </p>
        </div>
      </div>
    </footer>
  );
}

