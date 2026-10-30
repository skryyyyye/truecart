import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Heart,
  User,
  Trash2,
  ExternalLink,
  CheckCircle,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { handleImageError } from '../utils/imageFallback';

export default function ProfilePage() {
  const { user, alerts, watchlist, removeAlert } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'wishlist'

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <User className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign In Required</h2>
        <p className="text-xs text-slate-500">Please sign in to view your saved price alerts and wishlist.</p>
        <Link to="/login" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
          Sign In Now
        </Link>
      </div>
    );
  }

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-blue-500 text-white flex items-center justify-center text-2xl font-black uppercase shadow-md shadow-brand-500/20">
              {user.name ? user.name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 brand-font">
                  {user.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 uppercase">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Price Alerts
              </span>
              <span className="text-lg font-black text-brand-600">
                {alerts.length}
              </span>
            </div>

            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Saved Items
              </span>
              <span className="text-lg font-black text-rose-600">
                {watchlist.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Price Drop Alerts ({alerts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Products ({watchlist.length})</span>
          </button>
        </div>

        {/* Alerts Tab Content */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Bell className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No active price drop alerts</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse any product and click "Set Price Drop Alert" to track when prices drop below your desired amount.
                </p>
                <Link to="/" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map(alert => {
                  const isTriggered = alert.status === 'triggered' || alert.currentLowestPrice <= alert.targetPrice;
                  return (
                    <div
                      key={alert.id}
                      className={`bg-white rounded-2xl border p-5 shadow-xs transition flex flex-col justify-between space-y-4 ${
                        isTriggered ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={alert.productImage}
                            alt=""
                            onError={handleImageError}
                            className="w-14 h-14 object-contain rounded-xl border border-slate-200 bg-white p-1 flex-shrink-0"
                          />
                          <div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${
                              isTriggered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isTriggered ? '🎉 PRICE DROPPED!' : 'Tracking Live'}
                            </span>
                            <Link
                              to={`/product/${alert.productId}`}
                              className="text-xs font-bold text-slate-900 hover:text-brand-600 block line-clamp-1"
                            >
                              {alert.productTitle}
                            </Link>
                          </div>
                        </div>

                        <button
                          onClick={() => removeAlert(alert.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                          title="Delete alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                        <div className="bg-slate-50 p-2.5 rounded-xl">
                          <span className="text-[10px] text-slate-500 block">Your Target Price</span>
                          <span className="font-bold text-slate-800">{formatPrice(alert.targetPrice)}</span>
                        </div>
                        <div className={`p-2.5 rounded-xl ${isTriggered ? 'bg-emerald-100/60' : 'bg-slate-50'}`}>
                          <span className="text-[10px] text-slate-500 block">Current Lowest Price</span>
                          <span className={`font-black ${isTriggered ? 'text-emerald-700' : 'text-slate-900'}`}>
                            {formatPrice(alert.currentLowestPrice)}
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Lowest on <strong className="text-slate-700 capitalize">{alert.store || 'store'}</strong>
                        </span>
                        <Link
                          to={`/product/${alert.productId}`}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-brand-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1"
                        >
                          <span>View Deal</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab Content */}
        {activeTab === 'wishlist' && (
          <div>
            {watchlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Your wishlist is empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the heart icon on any product card to save it for easy price watching later.
                </p>
                <Link to="/" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
                  Explore Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

