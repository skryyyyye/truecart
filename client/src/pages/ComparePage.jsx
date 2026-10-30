import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Scale, X, ExternalLink, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import { handleImageError } from '../utils/imageFallback';

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idsParam = searchParams.get('ids') || '';
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [compRes, allRes] = await Promise.all([
          idsParam ? fetch(`/api/products/compare?ids=${encodeURIComponent(idsParam)}`) : null,
          fetch('/api/products')
        ]);

        if (compRes && compRes.ok) {
          const compData = await compRes.json();
          setProducts(compData.products || []);
        } else {
          setProducts([]);
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          setAllProducts(allData.products || []);
        }
      } catch (err) {
        console.error('Fetch compare error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idsParam]);

  const removeProduct = (id) => {
    const currentIds = idsParam.split(',').filter(Boolean);
    const updated = currentIds.filter(item => item !== id);
    if (updated.length > 0) {
      setSearchParams({ ids: updated.join(',') });
    } else {
      setSearchParams({});
    }
  };

  const addProduct = (id) => {
    const currentIds = idsParam.split(',').filter(Boolean);
    if (currentIds.length >= 4) {
      alert('You can compare a maximum of 4 products at once.');
      return;
    }
    if (!currentIds.includes(id)) {
      currentIds.push(id);
      setSearchParams({ ids: currentIds.join(',') });
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Aggregate all unique specs keys across compared products
  const specKeys = Array.from(
    new Set(
      products.flatMap(p => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" />
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 brand-font">
                Side-by-Side Product Comparison
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Compare specifications, multi-store prices, and ratings across retailers
            </p>
          </div>

          {/* Quick Add Dropdown */}
          {products.length < 4 && (
            <div className="flex items-center gap-2">
              <select
                onChange={(e) => {
                  if (e.target.value) addProduct(e.target.value);
                  e.target.value = '';
                }}
                defaultValue=""
                className="py-2 px-3 text-xs font-semibold bg-white border border-slate-300 rounded-xl shadow-xs text-slate-800"
              >
                <option value="" disabled>+ Add Another Product to Compare</option>
                {allProducts
                  .filter(p => !products.some(cp => cp.id === p.id))
                  .map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title.slice(0, 45)}...
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-500">
            Loading comparison data...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <Scale className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Products Selected for Comparison</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select products from our catalog to compare live prices across Amazon, Flipkart, Croma, and Reliance Digital.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {allProducts.slice(0, 3).map(p => (
                <button
                  key={p.id}
                  onClick={() => addProduct(p.id)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  + Add {p.title.slice(0, 25)}...
                </button>
              ))}
            </div>
            <div className="pt-4">
              <Link to="/" className="px-5 py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold inline-block">
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="p-4 bg-slate-50 font-bold text-slate-700 w-44 min-w-[160px]">
                    Product
                  </th>
                  {products.map(p => (
                    <th key={p.id} className="p-4 min-w-[240px] max-w-[280px] align-top relative">
                      <button
                        onClick={() => removeProduct(p.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100 transition"
                        title="Remove product"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="space-y-3 pt-2">
                        <img
                          src={p.image}
                          alt={p.title}
                          onError={handleImageError}
                          className="h-32 mx-auto object-contain"
                        />
                        <Link
                          to={`/product/${p.id}`}
                          className="font-bold text-slate-900 hover:text-brand-600 block line-clamp-2 text-center"
                        >
                          {p.title}
                        </Link>
                        <div className="text-center">
                          <span className="text-lg font-black text-slate-900">
                            {formatPrice(p.currentLowestPrice)}
                          </span>
                          <span className="block text-[11px] text-emerald-600 font-semibold capitalize">
                            Lowest on {p.bestStore}
                          </span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                
                {/* Store Prices */}
                <tr className="bg-slate-50/80 font-bold text-slate-900">
                  <td colSpan={products.length + 1} className="p-3 uppercase tracking-wider text-[11px] text-brand-700">
                    Live 4-Store Price Comparison
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-amber-700 bg-amber-50/30">Amazon Price</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold">
                      {p.stores?.amazon ? formatPrice(p.stores.amazon.price) : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-blue-700 bg-blue-50/30">Flipkart Price</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold">
                      {p.stores?.flipkart ? formatPrice(p.stores.flipkart.price) : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-teal-700 bg-teal-50/30">Croma Price</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold">
                      {p.stores?.croma ? formatPrice(p.stores.croma.price) : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3.5 font-bold text-rose-700 bg-rose-50/30">Reliance Digital Price</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold">
                      {p.stores?.reliance ? formatPrice(p.stores.reliance.price) : 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Ratings */}
                <tr className="bg-slate-50/80 font-bold text-slate-900">
                  <td colSpan={products.length + 1} className="p-3 uppercase tracking-wider text-[11px] text-brand-700">
                    Ratings & Reviews
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-600">User Rating</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold text-amber-600">
                      ★ {p.rating} / 5 ({p.reviewsCount})
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-600">TrueCart Expert Score</td>
                  {products.map(p => (
                    <td key={p.id} className="p-3.5 text-center font-bold text-brand-600">
                      {p.expertScore ? `${p.expertScore} / 10` : '9.0 / 10'}
                    </td>
                  ))}
                </tr>

                {/* Technical Specifications */}
                <tr className="bg-slate-50/80 font-bold text-slate-900">
                  <td colSpan={products.length + 1} className="p-3 uppercase tracking-wider text-[11px] text-brand-700">
                    Technical Specifications
                  </td>
                </tr>

                {specKeys.map(key => (
                  <tr key={key}>
                    <td className="p-3.5 font-semibold text-slate-600">{key}</td>
                    {products.map(p => (
                      <td key={p.id} className="p-3.5 text-center text-slate-800">
                        {p.specs?.[key] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Actions */}
                <tr>
                  <td className="p-4 font-bold text-slate-700">Checkout</td>
                  {products.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <Link
                        to={`/product/${p.id}`}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs inline-flex items-center gap-1 transition"
                      >
                        <span>View Deal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

