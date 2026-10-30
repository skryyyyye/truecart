import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Bell,
  Heart,
  Share2,
  CheckCircle2,
  XCircle,
  Award,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Check,
  Scale
} from 'lucide-react';
import StoreComparisonTable from '../components/StoreComparisonTable';
import PriceHistoryChart from '../components/PriceHistoryChart';
import PriceAlertModal from '../components/PriceAlertModal';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { watchlist, toggleWatch } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const isSaved = product && watchlist.some(item => item.id === product.id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setRelated(data.related || []);
          setSelectedImage(data.product.image);
        }
      } catch (err) {
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium text-sm">Gathering live prices from Amazon, Flipkart, Croma & Reliance Digital...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 text-sm">The requested product could not be located in our multi-store catalog.</p>
        <Link to="/" className="inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Return to Price Search
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Top Product Overview Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Gallery (Left: 5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex items-center justify-center h-80 relative">
                <img
                  src={selectedImage || product.image}
                  alt={product.title}
                  onError={handleImageError}
                  className="max-h-72 max-w-full object-contain"
                />
                {product.badge && (
                  <span className="absolute top-4 left-4 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {product.gallery.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-16 rounded-xl border p-1 bg-white flex-shrink-0 transition ${
                        selectedImage === imgUrl
                          ? 'border-brand-600 ring-2 ring-brand-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        onError={handleImageError}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info & Best Deal Summary (Right: 7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Brand & Title */}
              <div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
                  {product.brand} Official Listing
                </span>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 brand-font leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Ratings & Expert Score */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-3 py-1 rounded-lg border border-amber-200 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{product.rating} / 5</span>
                  <span className="text-amber-600 font-normal">({product.reviewsCount} user reviews)</span>
                </div>

                {product.expertScore && (
                  <div className="flex items-center gap-1.5 bg-brand-50 text-brand-800 px-3 py-1 rounded-lg border border-brand-200 font-bold">
                    <Award className="w-4 h-4 text-brand-600" />
                    <span>TrueCart Expert Score: {product.expertScore}/10</span>
                  </div>
                )}
              </div>

              {/* Lowest Price Spotlight Card */}
              <div className="p-5 bg-gradient-to-br from-emerald-50 via-emerald-50/40 to-white rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Lowest Verified Price Online
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white capitalize">
                    Cheapest on {product.bestStore}
                  </span>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    {formatPrice(product.currentLowestPrice)}
                  </span>
                  {product.mrp && product.mrp > product.currentLowestPrice && (
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.mrp)}
                    </span>
                  )}
                  {product.totalSavingsVsMRP > 0 && (
                    <span className="text-sm font-bold text-emerald-600">
                      Save {formatPrice(product.totalSavingsVsMRP)} ({Math.round((product.totalSavingsVsMRP / product.mrp) * 100)}% OFF)
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-800">
                  {product.priceDropNotice}
                </p>
              </div>

              {/* Action Buttons: Set Alert, Wishlist, Compare */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setAlertModalOpen(true)}
                  className="flex-1 min-w-[170px] py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4 fill-white" />
                  <span>Set Price Drop Alert</span>
                </button>

                <button
                  onClick={() => toggleWatch(product.id)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
                    isSaved
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Wishlist'}</span>
                </button>

                <Link
                  to={`/compare?ids=${product.id}`}
                  className="py-3 px-4 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition flex items-center gap-2"
                >
                  <Scale className="w-4 h-4 text-brand-600" />
                  <span>Compare</span>
                </Link>

                <button
                  onClick={handleCopyLink}
                  className="py-3 px-3 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition"
                  title="Share link"
                >
                  {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Description excerpt */}
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Store Comparison Matrix */}
        <section id="compare-stores">
          <StoreComparisonTable product={product} />
        </section>

        {/* BuyHatke Price History Tracker Graph */}
        <section id="price-history">
          <PriceHistoryChart product={product} />
        </section>

        {/* Specs & Pros/Cons Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Specifications */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4 brand-font">
              Detailed Specifications
            </h3>
            <div className="divide-y divide-slate-100 text-xs">
              {product.specs && Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="py-2.5 flex items-start justify-between gap-4">
                  <span className="font-semibold text-slate-500 w-1/3">{key}</span>
                  <span className="font-medium text-slate-900 w-2/3 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="space-y-6">
            {/* Pros */}
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Reasons to Buy (TrueCart Review)</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {product.pros && product.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-xs">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>Points to Consider Before Buying</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {product.cons && product.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <section className="pt-6">
            <h3 className="text-xl font-black text-slate-900 mb-6 brand-font">
              Compare More in {product.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Alert modal */}
      <PriceAlertModal
        product={product}
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
      />
    </div>
  );
}

