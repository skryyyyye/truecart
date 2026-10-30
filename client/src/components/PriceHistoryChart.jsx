import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, History, Award } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceHistoryChart({ product }) {
  const [range, setRange] = useState('all'); // '1m', '3m', 'all'
  const [visibleStore, setVisibleStore] = useState('all'); // 'all', 'amazon', 'flipkart', 'croma', 'reliance'

  if (!product || !product.priceHistory || product.priceHistory.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
        No price history points recorded yet for this product.
      </div>
    );
  }

  // Filter history based on range
  let historyData = [...product.priceHistory];
  if (range === '1m' && historyData.length > 2) {
    historyData = historyData.slice(-3);
  } else if (range === '3m' && historyData.length > 4) {
    historyData = historyData.slice(-5);
  }

  const labels = historyData.map(h => {
    const d = new Date(h.date);
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  });

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Determine datasets
  const datasets = [];

  if (visibleStore === 'all' || visibleStore === 'lowest') {
    datasets.push({
      label: 'Lowest Market Price',
      data: historyData.map(h => h.lowest),
      borderColor: '#0284c7', // brand blue
      backgroundColor: 'rgba(2, 132, 199, 0.08)',
      fill: true,
      tension: 0.3,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#0284c7'
    });
  }

  if (visibleStore === 'all' || visibleStore === 'amazon') {
    datasets.push({
      label: 'Amazon',
      data: historyData.map(h => h.amazon),
      borderColor: '#f59e0b', // amazon amber
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: visibleStore === 'all' ? [4, 4] : [],
      pointRadius: 3,
      tension: 0.2
    });
  }

  if (visibleStore === 'all' || visibleStore === 'flipkart') {
    datasets.push({
      label: 'Flipkart',
      data: historyData.map(h => h.flipkart),
      borderColor: '#2563eb', // flipkart blue
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: visibleStore === 'all' ? [4, 4] : [],
      pointRadius: 3,
      tension: 0.2
    });
  }

  if (visibleStore === 'all' || visibleStore === 'croma') {
    datasets.push({
      label: 'Croma',
      data: historyData.map(h => h.croma),
      borderColor: '#059669', // croma emerald
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: visibleStore === 'all' ? [4, 4] : [],
      pointRadius: 3,
      tension: 0.2
    });
  }

  if (visibleStore === 'all' || visibleStore === 'reliance') {
    datasets.push({
      label: 'Reliance Digital',
      data: historyData.map(h => h.reliance),
      borderColor: '#dc2626', // reliance red
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderDash: visibleStore === 'all' ? [4, 4] : [],
      pointRadius: 3,
      tension: 0.2
    });
  }

  const chartData = {
    labels,
    datasets
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 10,
        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: ${formatPrice(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 10, family: 'Inter, sans-serif' } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { size: 10, family: 'Inter, sans-serif' },
          callback: function (val) {
            return `₹${(val / 1000).toFixed(0)}k`;
          }
        }
      }
    }
  };

  // BuyHatke Price Decision Advice
  const currentLowest = product.currentLowestPrice;
  const avg = product.averagePrice || currentLowest;
  const lowestEver = product.lowestPriceEver?.price || currentLowest;
  const isGoodTimeToBuy = currentLowest <= avg;
  const isLowestEver = currentLowest <= lowestEver;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900 brand-font">
              Price History Tracker (BuyHatke Engine)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare past price movements across Amazon, Flipkart, Croma & Reliance Digital
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setRange('1m')}
            className={`px-3 py-1 rounded-lg transition ${
              range === '1m' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1 Month
          </button>
          <button
            onClick={() => setRange('3m')}
            className={`px-3 py-1 rounded-lg transition ${
              range === '3m' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setRange('all')}
            className={`px-3 py-1 rounded-lg transition ${
              range === 'all' ? 'bg-white text-brand-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {/* BuyHatke Recommendation Banner */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isLowestEver
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : isGoodTimeToBuy
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        {isLowestEver ? (
          <Award className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
        ) : isGoodTimeToBuy ? (
          <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="text-xs">
          <div className="font-bold text-sm">
            {isLowestEver
              ? '🔥 ALL-TIME LOWEST PRICE EVER! DEFINITELY BUY NOW!'
              : isGoodTimeToBuy
              ? '👍 GOOD TIME TO BUY: Lower Than 90-Day Market Average'
              : '⏳ FAIR PRICE: Price Expected To Drop In Upcoming Festival Sale'}
          </div>
          <p className="mt-1 opacity-90 leading-relaxed">
            {product.priceDropNotice ||
              `Current best price is ${formatPrice(currentLowest)} on ${product.bestStore}. Lowest ever was ${formatPrice(lowestEver)}.`}
          </p>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Lowest Ever Recorded
          </span>
          <div className="text-base font-bold text-emerald-600 mt-0.5">
            {formatPrice(product.lowestPriceEver?.price || currentLowest)}
          </div>
          <span className="text-[10px] text-slate-400 capitalize">
            on {product.lowestPriceEver?.store || 'Flipkart'}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            Highest Ever Recorded
          </span>
          <div className="text-base font-bold text-rose-600 mt-0.5">
            {formatPrice(product.highestPriceEver?.price || product.mrp)}
          </div>
          <span className="text-[10px] text-slate-400 capitalize">
            on {product.highestPriceEver?.store || 'Amazon'}
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            90-Day Average
          </span>
          <div className="text-base font-bold text-slate-700 mt-0.5">
            {formatPrice(product.averagePrice || currentLowest)}
          </div>
          <span className="text-[10px] text-slate-400">across 4 retailers</span>
        </div>

        <div className="bg-brand-50 border border-brand-100 p-3 rounded-xl">
          <span className="text-[11px] font-medium text-brand-700 uppercase tracking-wider block">
            Current Best Price
          </span>
          <div className="text-base font-bold text-brand-900 mt-0.5">
            {formatPrice(currentLowest)}
          </div>
          <span className="text-[10px] text-brand-600 font-semibold capitalize">
            Lowest on {product.bestStore}
          </span>
        </div>
      </div>

      {/* Store Isolation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 text-[11px] mr-1">Show line:</span>
        <button
          onClick={() => setVisibleStore('all')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Stores
        </button>
        <button
          onClick={() => setVisibleStore('lowest')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'lowest' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Lowest Only
        </button>
        <button
          onClick={() => setVisibleStore('amazon')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'amazon' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Amazon
        </button>
        <button
          onClick={() => setVisibleStore('flipkart')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'flipkart' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Flipkart
        </button>
        <button
          onClick={() => setVisibleStore('croma')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'croma' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Croma
        </button>
        <button
          onClick={() => setVisibleStore('reliance')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition ${
            visibleStore === 'reliance' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Reliance Digital
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

