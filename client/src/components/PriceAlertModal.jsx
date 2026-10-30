import React, { useState } from 'react';
import { Bell, X, CheckCircle, TrendingDown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { handleImageError } from '../utils/imageFallback';

export default function PriceAlertModal({ product, isOpen, onClose }) {
  const { user, addAlert } = useAuth();
  const navigate = useNavigate();

  const currentPrice = product?.currentLowestPrice || product?.mrp || 10000;
  const [targetPrice, setTargetPrice] = useState(Math.round(currentPrice * 0.95));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen || !product) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePresetClick = (percent) => {
    const discounted = Math.round(currentPrice * (1 - percent / 100));
    setTargetPrice(discounted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onClose();
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (targetPrice >= currentPrice) {
      setErrorMessage(`Target price should be lower than current lowest price (${formatPrice(currentPrice)})`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await addAlert(product.id, targetPrice);
    setIsSubmitting(false);

    if (result.success) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
      setSuccessMessage(`Alert set! We will notify you when price drops below ${formatPrice(targetPrice)}.`);
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2500);
    } else {
      setErrorMessage(result.error || 'Failed to create price alert');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-600 to-blue-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-300 fill-amber-300" />
            <h3 className="font-bold text-base brand-font">Set Price Drop Alert</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* Product summary */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <img
              src={product.image}
              alt={product.title}
              onError={handleImageError}
              className="w-14 h-14 object-contain rounded-lg bg-white border border-slate-200 p-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {product.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Current Best: <strong className="text-slate-900">{formatPrice(currentPrice)}</strong> on <span className="capitalize">{product.bestStore}</span>
              </p>
            </div>
          </div>

          {successMessage ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-sm font-bold text-emerald-900">Price Drop Alert Active!</p>
              <p className="text-xs text-emerald-700">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notify me when price drops below:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="100"
                    max={currentPrice}
                    step="50"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Quick preset buttons */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-1.5 font-medium">
                  Quick Drop Targets:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetClick(5)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 transition"
                  >
                    -5% ({formatPrice(Math.round(currentPrice * 0.95))})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(10)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 transition"
                  >
                    -10% ({formatPrice(Math.round(currentPrice * 0.9))})
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetClick(15)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 transition"
                  >
                    -15% ({formatPrice(Math.round(currentPrice * 0.85))})
                  </button>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-800 leading-relaxed">
                💡 <strong>TrueCart Tracker:</strong> We continuously scan Amazon, Flipkart, Croma & Reliance Digital. The moment any store drops below your target, you'll receive an instant alert!
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving Alert...' : 'Activate Alert'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

