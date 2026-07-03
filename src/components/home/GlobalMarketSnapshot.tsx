'use client';
import Link from 'next/link';
import { ArrowRight, Coins, Droplet, BarChart3 } from 'lucide-react';

const marketData = {
  gold:    { price: 88.50,  change: 0.8,  unit: '/gram' },
  bitcoin: { price: 67420,  change: 2.3,  unit: 'USD'   },
  oil:     { price: 82.30,  change: 1.1,  unit: 'WTI'   },
};

const currencies = [
  { pair: 'EUR/USD', rate: 1.0845,  change: -0.12 },
  { pair: 'GBP/USD', rate: 1.2651,  change:  0.18 },
  { pair: 'USD/JPY', rate: 154.82,  change: -0.25 },
  { pair: 'USD/CHF', rate: 0.8965,  change:  0.08 },
  { pair: 'USD/INR', rate: 83.42,   change:  0.05 },
  { pair: 'USD/PKR', rate: 278.25,  change:  0.12 },
  { pair: 'USD/SAR', rate: 3.75,    change:  0.00 },
  { pair: 'USD/AED', rate: 3.67,    change:  0.00 },
];

const fearGreedIndex = 62;

export default function GlobalMarketSnapshot() {
  return (
    <div className="mb-4">
      {/* Explore link — no duplicate title */}
      <div className="flex justify-end mb-4">
        <Link href="/rates" className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors no-underline">
          Full rates page <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 3 commodity cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-5 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Coins className="w-5 h-5 text-yellow-400" /><span className="font-semibold text-white">Gold</span></div>
            <span className={`text-sm font-medium ${marketData.gold.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.gold.change > 0 ? '▲' : '▼'} {Math.abs(marketData.gold.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">${marketData.gold.price.toFixed(2)}<span className="text-gray-400 text-sm ml-1">{marketData.gold.unit}</span></div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-5 border border-orange-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-orange-400" /><span className="font-semibold text-white">Bitcoin</span></div>
            <span className={`text-sm font-medium ${marketData.bitcoin.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.bitcoin.change > 0 ? '▲' : '▼'} {Math.abs(marketData.bitcoin.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">${marketData.bitcoin.price.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-500/20 to-gray-500/20 backdrop-blur-sm rounded-xl p-5 border border-slate-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><Droplet className="w-5 h-5 text-slate-400" /><span className="font-semibold text-white">Oil WTI</span></div>
            <span className={`text-sm font-medium ${marketData.oil.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.oil.change > 0 ? '▲' : '▼'} {Math.abs(marketData.oil.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">${marketData.oil.price}</div>
        </div>
      </div>

      {/* Currency table */}
      <div className="rounded-xl border border-white/8 overflow-hidden mb-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {currencies.map((c) => (
            <div key={c.pair} className="p-3 border-b border-r border-white/6 last:border-r-0">
              <div className="text-gray-400 text-xs mb-1">{c.pair}</div>
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">{c.rate.toFixed(c.rate > 10 ? 2 : 4)}</span>
                <span className={`text-xs ${c.change > 0 ? 'text-green-400' : c.change < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                  {c.change > 0 ? '+' : ''}{c.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fear & Greed */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-white/8">
        <div className="text-gray-400 text-sm">Fear & Greed Index</div>
        <div className={`text-2xl font-bold ${fearGreedIndex > 50 ? 'text-green-400' : 'text-red-400'}`}>{fearGreedIndex}</div>
        <div className="text-gray-400 text-sm">{fearGreedIndex > 60 ? 'Greed' : fearGreedIndex > 40 ? 'Neutral' : 'Fear'}</div>
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: `${fearGreedIndex}%` }} />
        </div>
      </div>
    </div>
  );
}
