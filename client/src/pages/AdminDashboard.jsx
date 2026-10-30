import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  TrendingDown,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Tag,
  ExternalLink,
  Layers,
  ShoppingBag,
  Bell,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { handleImageError } from '../utils/imageFallback';

export default function AdminDashboard() {
  const { user, token, adminLogin, logout } = useAuth();

  // Admin login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin dashboard state
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'coupons' | 'alerts'
  const [loading, setLoading] = useState(false);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    brand: '',
    category: 'Smartphones',
    mrp: '',
    image: '',
    description: '',
    amazonPrice: '',
    flipkartPrice: '',
    cromaPrice: '',
    reliancePrice: ''
  });

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    store: 'amazon',
    code: '',
    title: '',
    discountAmount: '',
    minPurchase: '10000',
    expiry: '2026-12-31'
  });

  const isAdmin = user && user.role === 'admin';

  // Load dashboard data if admin
  useEffect(() => {
    if (isAdmin && token) {
      loadAdminData();
    }
  }, [isAdmin, token]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, alertsRes, coupRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/products'),
        fetch('/api/admin/alerts', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/coupons')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData.products || []);
      }
      if (alertsRes.ok) {
        const aData = await alertsRes.json();
        setAlerts(aData.alerts || []);
      }
      if (coupRes.ok) {
        const cData = await coupRes.json();
        setCoupons(cData.coupons || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await adminLogin(username, password);
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fillDefaultAdminCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  // Run BuyHatke Store Crawler Simulator
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setSyncFeedback(data);
        loadAdminData();
      } else {
        alert(data.error || 'Crawler sync failed');
      }
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Product Modal for Add / Edit
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProductId(product.id);
      setProductForm({
        title: product.title,
        brand: product.brand,
        category: product.category,
        mrp: product.mrp,
        image: product.image,
        description: product.description || '',
        amazonPrice: product.stores?.amazon?.price || product.mrp,
        flipkartPrice: product.stores?.flipkart?.price || product.mrp,
        cromaPrice: product.stores?.croma?.price || product.mrp,
        reliancePrice: product.stores?.reliance?.price || product.mrp
      });
    } else {
      setEditingProductId(null);
      setProductForm({
        title: '',
        brand: '',
        category: 'Smartphones',
        mrp: '',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        description: '',
        amazonPrice: '',
        flipkartPrice: '',
        cromaPrice: '',
        reliancePrice: ''
      });
    }
    setIsProductModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      title: productForm.title,
      brand: productForm.brand,
      category: productForm.category,
      mrp: Number(productForm.mrp),
      image: productForm.image,
      description: productForm.description,
      stores: {
        amazon: {
          storeName: "Amazon",
          logo: "amazon",
          price: Number(productForm.amazonPrice || productForm.mrp),
          originalPrice: Number(productForm.mrp),
          discountPercent: Math.round(((productForm.mrp - (productForm.amazonPrice || productForm.mrp)) / productForm.mrp) * 100),
          inStock: true,
          seller: "Appario Retail (Prime)",
          rating: 4.8,
          delivery: "FREE Tomorrow Delivery",
          bankOffer: "Instant Card Discount Available",
          returnDays: "7 Days Replacement",
          url: "https://www.amazon.in"
        },
        flipkart: {
          storeName: "Flipkart",
          logo: "flipkart",
          price: Number(productForm.flipkartPrice || productForm.mrp),
          originalPrice: Number(productForm.mrp),
          discountPercent: Math.round(((productForm.mrp - (productForm.flipkartPrice || productForm.mrp)) / productForm.mrp) * 100),
          inStock: true,
          seller: "IndiFlashMart Assured",
          rating: 4.8,
          delivery: "FREE 2-Day Delivery",
          bankOffer: "₹2,500 off on Axis Bank Cards",
          returnDays: "7 Days Replacement",
          url: "https://www.flipkart.com"
        },
        croma: {
          storeName: "Croma",
          logo: "croma",
          price: Number(productForm.cromaPrice || productForm.mrp),
          originalPrice: Number(productForm.mrp),
          discountPercent: Math.round(((productForm.mrp - (productForm.cromaPrice || productForm.mrp)) / productForm.mrp) * 100),
          inStock: true,
          seller: "Croma Retail",
          rating: 4.7,
          delivery: "In Store Pickup Available",
          bankOffer: "Tata NeuCoins Available",
          returnDays: "15 Days Return",
          url: "https://www.croma.com"
        },
        reliance: {
          storeName: "Reliance Digital",
          logo: "reliance",
          price: Number(productForm.reliancePrice || productForm.mrp),
          originalPrice: Number(productForm.mrp),
          discountPercent: Math.round(((productForm.mrp - (productForm.reliancePrice || productForm.mrp)) / productForm.mrp) * 100),
          inStock: true,
          seller: "Reliance ResQ",
          rating: 4.7,
          delivery: "Express Store Delivery",
          bankOffer: "Instant Cashback with SBI Cards",
          returnDays: "7 Days Replacement",
          url: "https://www.reliancedigital.in"
        }
      }
    };

    try {
      const url = editingProductId ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsProductModalOpen(false);
        loadAdminData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error('Save product error:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product and its 4-store data?')) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  // Save Coupon
  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(couponForm)
      });
      if (res.ok) {
        setIsCouponModalOpen(false);
        setCouponForm({
          store: 'amazon',
          code: '',
          title: '',
          discountAmount: '',
          minPurchase: '10000',
          expiry: '2026-12-31'
        });
        loadAdminData();
      }
    } catch (err) {
      console.error('Save coupon error:', err);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      console.error('Delete coupon error:', err);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // If not logged in as Admin, show Admin Login view
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl sm:text-3xl font-black text-white brand-font">
            TrueCart Admin Portal
          </h2>
          <p className="mt-1 text-center text-xs text-slate-400">
            Authorized administrator credentials required to manage stores, catalog & crawler
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl shadow-2xl border border-slate-700/80 space-y-6">
            
            {loginError && (
              <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin or admin@truecart.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isLoggingIn ? 'Verifying Admin Access...' : 'Login as Admin'}</span>
              </button>
            </form>

            {/* Quick Demo Autofill */}
            <div className="pt-2 border-t border-slate-700/60">
              <button
                type="button"
                onClick={fillDefaultAdminCredentials}
                className="w-full py-2.5 px-3 bg-slate-700/60 hover:bg-slate-700 text-amber-300 border border-slate-600 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill Default Credentials (admin / admin123)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard View
  return (
    <div className="min-h-screen bg-slate-100 py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header Bar */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black brand-font tracking-tight">
                  TrueCart Admin Portal
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                  SuperAdmin Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <strong>{user.name}</strong> ({user.email}) · Tracking Amazon, Flipkart, Croma & Reliance
              </p>
            </div>
          </div>

          {/* Crawler action & Logout */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Crawling Stores...' : 'Run Realtime Price Crawl'}</span>
            </button>

            <button
              onClick={logout}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition border border-slate-700"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Sync Feedback Alert */}
        {syncFeedback && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl shadow-sm flex items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-900">{syncFeedback.message}</p>
                <p className="text-[11px] text-emerald-700">
                  Detected {syncFeedback.priceDropsDetected} price shifts across stores · Evaluated user alerts ({syncFeedback.triggeredAlertsCount} alerts triggered!)
                </p>
              </div>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-xs text-emerald-700 font-bold hover:text-emerald-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Catalog Products</span>
              <ShoppingBag className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats?.totalProducts || products.length}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Across 8 categories</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Tracked Stores</span>
              <Layers className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">4 Stores</div>
            <span className="text-[10px] text-slate-500 font-medium">Amazon, Flipkart, Croma, Reliance</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active User Alerts</span>
              <Bell className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats?.activeAlerts || alerts.filter(a => a.status === 'active').length}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {stats?.triggeredAlerts || alerts.filter(a => a.status === 'triggered').length} drops triggered
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Verified Coupons</span>
              <Tag className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stats?.totalCoupons || coupons.length}
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Tested daily</span>
          </div>
        </div>

        {/* Tab switcher & Actions */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'products'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Products Catalog ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'coupons'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Store Coupons ({coupons.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'alerts'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                User Alerts Monitor ({alerts.length})
              </button>
            </div>

            {/* Action buttons */}
            {activeTab === 'products' && (
              <button
                onClick={() => openProductModal()}
                className="py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Store Coupon</span>
              </button>
            )}
          </div>

          {/* Tab 1: Products Table */}
          {activeTab === 'products' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">MRP</th>
                    <th className="py-3 px-3 text-amber-700 bg-amber-50/50">Amazon</th>
                    <th className="py-3 px-3 text-blue-700 bg-blue-50/50">Flipkart</th>
                    <th className="py-3 px-3 text-teal-700 bg-teal-50/50">Croma</th>
                    <th className="py-3 px-3 text-rose-700 bg-rose-50/50">Reliance</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img
                            src={p.image}
                            alt=""
                            onError={handleImageError}
                            className="w-10 h-10 object-contain rounded-lg border border-slate-200 p-0.5 bg-white flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block line-clamp-1">{p.title}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">{p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-600">{p.category}</td>
                      <td className="py-3 px-3 text-slate-400 line-through">{formatPrice(p.mrp)}</td>
                      
                      {/* 4 Stores */}
                      <td className="py-3 px-3 font-bold bg-amber-50/30">
                        {p.stores?.amazon ? formatPrice(p.stores.amazon.price) : '—'}
                      </td>
                      <td className="py-3 px-3 font-bold bg-blue-50/30">
                        {p.stores?.flipkart ? formatPrice(p.stores.flipkart.price) : '—'}
                      </td>
                      <td className="py-3 px-3 font-bold bg-teal-50/30">
                        {p.stores?.croma ? formatPrice(p.stores.croma.price) : '—'}
                      </td>
                      <td className="py-3 px-3 font-bold bg-rose-50/30">
                        {p.stores?.reliance ? formatPrice(p.stores.reliance.price) : '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openProductModal(p)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Coupons */}
          {activeTab === 'coupons' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Store</th>
                    <th className="py-3 px-3">Promo Code</th>
                    <th className="py-3 px-3">Discount</th>
                    <th className="py-3 px-3">Description</th>
                    <th className="py-3 px-3">Min Order</th>
                    <th className="py-3 px-3">Expiry</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold capitalize">{c.store}</td>
                      <td className="py-3 px-3 font-mono font-bold text-brand-700 bg-brand-50/50 rounded inline-block my-1 px-1.5">
                        {c.code}
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600">{c.discountAmount}</td>
                      <td className="py-3 px-3 text-slate-700">{c.title}</td>
                      <td className="py-3 px-3 text-slate-500">₹{c.minPurchase}</td>
                      <td className="py-3 px-3 text-slate-500">{c.expiry}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Alerts Monitor */}
          {activeTab === 'alerts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Target Price</th>
                    <th className="py-3 px-3">Current Lowest</th>
                    <th className="py-3 px-3">Store</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alerts.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{a.productTitle}</td>
                      <td className="py-3 px-3 font-bold">{formatPrice(a.targetPrice)}</td>
                      <td className="py-3 px-3 font-black text-brand-600">{formatPrice(a.currentLowestPrice)}</td>
                      <td className="py-3 px-3 capitalize font-semibold">{a.store}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'triggered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 brand-font">
                {editingProductId ? 'Edit Product & Multi-Store Pricing' : 'Add New Product with 4-Store Datasets'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    placeholder="e.g. Google Pixel 8 Pro 256GB"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    placeholder="e.g. Google"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Smartphones">Smartphones</option>
                    <option value="Laptops">Laptops</option>
                    <option value="Audio & Headphones">Audio & Headphones</option>
                    <option value="Smartwatches">Smartwatches</option>
                    <option value="Smart TVs">Smart TVs</option>
                    <option value="Tablets">Tablets</option>
                    <option value="Gaming & Consoles">Gaming & Consoles</option>
                    <option value="Home Appliances">Home Appliances</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Sports">Sports</option>
                    <option value="Hardware Tools">Hardware Tools</option>
                    <option value="Packed Food Items">Packed Food Items</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  placeholder="Flagship performance with exceptional display..."
                ></textarea>
              </div>

              {/* 4 Retailer Store Prices */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block mb-2">
                  Live Multi-Store Pricing (₹):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-700 mb-1">Amazon (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.amazonPrice}
                      onChange={(e) => setProductForm({ ...productForm, amazonPrice: e.target.value })}
                      className="w-full p-2 bg-amber-50/50 border border-amber-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-700 mb-1">Flipkart (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.flipkartPrice}
                      onChange={(e) => setProductForm({ ...productForm, flipkartPrice: e.target.value })}
                      className="w-full p-2 bg-blue-50/50 border border-blue-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-teal-700 mb-1">Croma (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.cromaPrice}
                      onChange={(e) => setProductForm({ ...productForm, cromaPrice: e.target.value })}
                      className="w-full p-2 bg-teal-50/50 border border-teal-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rose-700 mb-1">Reliance (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.reliancePrice}
                      onChange={(e) => setProductForm({ ...productForm, reliancePrice: e.target.value })}
                      className="w-full p-2 bg-rose-50/50 border border-rose-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  {editingProductId ? 'Save Product Changes' : 'Publish Product to TrueCart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 brand-font">Add Store Promo Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Retailer</label>
                <select
                  value={couponForm.store}
                  onChange={(e) => setCouponForm({ ...couponForm, store: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                >
                  <option value="amazon">Amazon India</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="croma">Croma</option>
                  <option value="reliance">Reliance Digital</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFC5000"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Discount Amount</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹5,000 or 10% OFF"
                  value={couponForm.discountAmount}
                  onChange={(e) => setCouponForm({ ...couponForm, discountAmount: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Offer Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="Instant discount on select smartphones"
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="py-2 px-3 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

