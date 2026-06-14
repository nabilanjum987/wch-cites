import { TrendingUp, ArrowRight, Coins, Droplet, BarChart3 } from 'lucide-react';

const marketData = {
  gold: { price: 88.50, change: 0.8, unit: '/gram' },
  bitcoin: { price: 67420, change: 2.3, unit: 'USD' },
  oil: { price: 82.30, change: 1.1, unit: 'WTI' }
};

const currencies = [
  { pair: 'EUR/USD', rate: 1.0845, change: -0.12 },
  { pair: 'GBP/USD', rate: 1.2651, change: 0.18 },
  { pair: 'USD/JPY', rate: 154.82, change: -0.25 },
  { pair: 'USD/CHF', rate: 0.8965, change: 0.08 },
  { pair: 'AUD/USD', rate: 0.6542, change: -0.15 },
  { pair: 'USD/CAD', rate: 1.3645, change: 0.22 },
  { pair: 'USD/INR', rate: 83.42, change: 0.05 },
  { pair: 'USD/PKR', rate: 278.25, change: 0.12 }
];

const fearGreedIndex = 62;

export default function GlobalMarketSnapshot() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Global Market Snapshot</h2>
        </div>
        <button className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
          <span>Full rates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-xl p-5 border border-yellow-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-white">Gold</span>
            </div>
            <span className={`text-sm font-medium ${marketData.gold.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.gold.change > 0 ? '▲' : '▼'} {Math.abs(marketData.gold.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${marketData.gold.price.toFixed(2)}
            <span className="text-gray-400 text-sm ml-1">{marketData.gold.unit}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-5 border border-orange-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              <span className="font-semibold text-white">Bitcoin</span>
            </div>
            <span className={`text-sm font-medium ${marketData.bitcoin.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.bitcoin.change > 0 ? '▲' : '▼'} {Math.abs(marketData.bitcoin.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${marketData.bitcoin.price.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-500/20 to-gray-500/20 backdrop-blur-sm rounded-xl p-5 border border-slate-400/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-slate-400" />
              <span className="font-semibold text-white">Oil WTI</span>
            </div>
            <span className={`text-sm font-medium ${marketData.oil.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {marketData.oil.change > 0 ? '▲' : '▼'} {Math.abs(marketData.oil.change)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white">
            ${marketData.oil.price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
        {currencies.map((currency) => (
          <div
            key={currency.pair}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
          >
            <div className="text-gray-400 text-xs font-medium mb-1">{currency.pair}</div>
            <div className="text-white font-bold">{currency.rate.toFixed(4)}</div>
            <div className={`text-xs ${currency.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {currency.change >= 0 ? '+' : ''}{currency.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-gray-400 text-xs mb-1">Fear & Greed Index</div>
            <div className={`text-3xl font-bold ${fearGreedIndex > 50 ? 'text-green-400' : 'text-red-400'}`}>
              {fearGreedIndex}
            </div>
          </div>
          <div className="h-12 w-px bg-white/20"></div>
          <div className="text-gray-300 text-sm">
            {fearGreedIndex > 80 ? 'Extreme Greed' : fearGreedIndex > 60 ? 'Greed' : fearGreedIndex > 40 ? 'Fear' : 'Extreme Fear'}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className={`h-6 w-1 rounded-sm ${i < fearGreedIndex
                ? i < 25
                  ? 'bg-red-500'
                  : i < 50
                    ? 'bg-orange-500'
                    : i < 75
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                : 'bg-gray-700'
                } opacity-30`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
