import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowLeft,
  Calculator,
  Info,
  DollarSign,
  Droplet,
  Coins,
  Fuel,
  BarChart3,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  PiggyBank,
  Home,
  Send,
  TrendingUp as TrendUp,
  Wheat,
  Flame,
  Factory,
  Newspaper,
  AlertTriangle,
  Wallet,
  Clock,
} from 'lucide-react';
import { fetchGoldRates, fetchOilPrices, fetchFuelPrices, fetchCryptoData, fetchCurrencyPairs, fetchCurrencyHistory, fetchStockIndices, fetchStockMovers, fetchCommodities, FINANCIAL_STRESS_DATA, MISERY_INDEX_DATA, calculateCurrencyLoss, calculateRemittance, calculateLoan, calculateSavings, calculatePurchasingPower, calculateMiseryImpact, INTEREST_RATES, generateInterestRateHistory, generateOilAffectParagraph, getDefaultFinancialNews, type GoldRates, type OilPrice, type FuelPrice, type CryptoData, type CryptoMarket, type CurrencyPair, type CurrencyHistory, type StockIndex, type StockMover, type Commodity, type FinancialStressData, type MiseryIndex, type NewsArticle } from '../../lib/apis/rates';
import {
  COUNTRY_CURRENCIES,
  FLAG_COLORS,
  type CurrencyInfo,
} from '../../types/city';

const KARATS = [
  { label: '24K', key: 'k24' as const, purity: '99.9%' },
  { label: '22K', key: 'k22' as const, purity: '91.7%' },
  { label: '21K', key: 'k21' as const, purity: '87.5%' },
  { label: '20K', key: 'k20' as const, purity: '83.3%' },
  { label: '18K', key: 'k18' as const, purity: '75.0%' },
];

const UNITS = [
  { label: 'Per Gram', key: 'per_gram' as const },
  { label: 'Per Tola (11.664g)', key: 'per_tola' as const },
  { label: 'Per 10g', key: 'per_10g' as const },
  { label: 'Per Troy Oz', key: 'per_oz' as const },
];

function toTitleCase(s: string) {
  return s
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function fmt(val: number, symbol: string) {
  if (val >= 1000000) {
    return `${symbol}${(val / 1000000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  }
  if (val >= 100000) {
    return `${symbol}${val.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

interface ZakatCalculatorProps {
  nisabValue: number;
  nisabGrams: number;
  currency: CurrencyInfo;
  perGram: number;
}

function ZakatCalculator({ nisabValue, nisabGrams, currency, perGram }: ZakatCalculatorProps) {
  const [wealth, setWealth] = useState('');
  const [goldGrams, setGoldGrams] = useState('');
  const [result, setResult] = useState<null | { owes: boolean; amount: number }>(null);

  const calculate = useCallback(() => {
    const wealthVal = parseFloat(wealth) || 0;
    const goldVal = parseFloat(goldGrams) || 0;
    const goldValue = goldVal * perGram;
    const total = wealthVal + goldValue;
    if (total >= nisabValue) {
      setResult({ owes: true, amount: Math.round(total * 0.025 * 100) / 100 });
    } else {
      setResult({ owes: false, amount: 0 });
    }
  }, [wealth, goldGrams, perGram, nisabValue]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-5">
        <Calculator className="w-5 h-5 text-amber-600" />
        <h2 className="text-lg font-semibold text-gray-900">Zakat Nisab Calculator</h2>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
        <p className="text-sm text-amber-800 font-medium">
          Nisab: {fmt(nisabValue, currency.symbol)} {currency.code}
        </p>
        <p className="text-xs text-amber-600 mt-1">
          Based on {nisabGrams}g of gold · 2.5% Zakat rate
        </p>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
            Total Wealth ({currency.code})
          </label>
          <input
            type="number"
            value={wealth}
            onChange={(e) => setWealth(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
            Gold Owned (grams)
          </label>
          <input
            type="number"
            value={goldGrams}
            onChange={(e) => setGoldGrams(e.target.value)}
            placeholder="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
      >
        Calculate Zakat
      </button>

      {result !== null && (
        <div
          className={`mt-4 p-4 rounded-xl border ${
            result.owes
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-gray-50 border-gray-200 text-gray-600'
          }`}
        >
          {result.owes ? (
            <>
              <p className="font-semibold">Zakat is due</p>
              <p className="text-lg font-bold mt-1">
                {fmt(result.amount, currency.symbol)} {currency.code}
              </p>
            </>
          ) : (
            <p className="font-medium">Zakat not yet due — wealth is below nisab threshold.</p>
          )}
        </div>
      )}
    </div>
  );
}

interface CurrencyConverterProps {
  rates: GoldRates;
  currency: CurrencyInfo;
  rateToUsd: number;
}

function CurrencyConverter({ rates, currency, rateToUsd }: CurrencyConverterProps) {
  const [usdAmount, setUsdAmount] = useState('100');
  const converted = (parseFloat(usdAmount) || 0) * rateToUsd;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <DollarSign className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Currency Converter</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
        <p className="text-xs text-blue-700 font-medium">
          1 USD = {rateToUsd.toLocaleString()} {currency.code}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
            Amount (USD)
          </label>
          <input
            type="number"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">{currency.name}</p>
          <p className="text-xl font-bold text-gray-900 font-mono">
            {fmt(converted, currency.symbol)} {currency.code}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Gold equivalent</p>
        {[
          { label: '1 gram 24K', value: rates.per_gram },
          { label: '1 tola 24K', value: rates.per_tola },
          { label: '1 oz 24K', value: rates.per_oz },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-semibold text-gray-800 font-mono">
              {fmt(item.value, currency.symbol)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface FinancialStressMeterProps {
  data: FinancialStressData;
}

function FinancialStressMeter({ data }: FinancialStressMeterProps) {
  const { score, level, inflation, unemployment, debtToGdp, country } = data;
  const rotation = (score / 100) * 180 - 90;
  const color = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' }[level];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{country} Financial Stress</h3>
      <div className="flex justify-center">
        <svg viewBox="0 0 200 120" className="w-full max-w-xs">
          <defs>
            <linearGradient id="stressGradC" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="30%" stopColor="#eab308" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#stressGradC)" strokeWidth="16" strokeLinecap="round" />
          <g transform={`rotate(${rotation} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="8" fill={color} />
          </g>
        </svg>
      </div>
      <div className="text-center mt-2">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-lg text-gray-500">/ 100</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div><p className="text-gray-500">Inflation</p><p className="font-bold">{inflation}%</p></div>
        <div><p className="text-gray-500">Unemp.</p><p className="font-bold">{unemployment}%</p></div>
        <div><p className="text-gray-500">Debt</p><p className="font-bold">{debtToGdp}%</p></div>
      </div>
    </div>
  );
}

interface PurchasingPowerCalculatorProps {
  inflation: number;
  currencyRate: number;
  currencySymbol: string;
  goldPricePerGram: number;
  bitcoinPrice: number;
}

function PurchasingPowerCalculator({ inflation, currencyRate, currencySymbol, goldPricePerGram, bitcoinPrice }: PurchasingPowerCalculatorProps) {
  const [amount, setAmount] = useState('50000');
  const result = calculatePurchasingPower(parseFloat(amount) || 0, inflation, currencyRate, goldPricePerGram, bitcoinPrice);
  const sym = currencySymbol === '$' ? '$' : currencySymbol;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">Purchasing Power Calculator</h3>
      </div>
      <div className="mb-4">
        <label className="text-xs text-gray-500 mb-1 block">Amount in local currency</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
      </div>
      <div className="space-y-3">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-xs text-red-600 font-medium mb-1">What {sym}{parseFloat(amount).toLocaleString()} was worth:</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div><span className="text-gray-500">1 yr ago</span><p className="font-bold">{sym}{result.oneYearAgo.toLocaleString()}</p></div>
            <div><span className="text-gray-500">3 yr ago</span><p className="font-bold">{sym}{result.threeYearsAgo.toLocaleString()}</p></div>
            <div><span className="text-gray-500">5 yr ago</span><p className="font-bold">{sym}{result.fiveYearsAgo.toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-600 font-medium mb-1">Today's {sym}{parseFloat(amount).toLocaleString()} equals:</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div><span className="text-gray-500">Gold</span><p className="font-bold">{result.goldGrams.toFixed(3)}g</p></div>
            <div><span className="text-gray-500">BTC</span><p className="font-bold">{result.bitcoinAmount.toFixed(6)}</p></div>
            <div><span className="text-gray-500">USD</span><p className="font-bold">${result.usdAmount.toLocaleString()}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RemittanceCalculatorProps {
  currency: CurrencyInfo;
  currencyPairs: CurrencyPair[];
}

function RemittanceCalculator({ currency, currencyPairs }: RemittanceCalculatorProps) {
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState(currency.code);
  const result = calculateRemittance(parseFloat(amount) || 0, fromCurrency, toCurrency, currencyPairs);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Send className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">Remittance Calculator</h3>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              <option value="USD">USD</option>
              {currencyPairs.filter(p => p.code !== 'USD').slice(0, 5).map(p => (
                <option key={p.code} value={p.code}>{p.code}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
              {currencyPairs.filter(p => p.code !== fromCurrency).slice(0, 6).map(p => (
                <option key={p.code} value={p.code}>{p.code}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">You receive</p>
          <p className="text-xl font-bold text-gray-900">{result.convertedAmount.toLocaleString()} {toCurrency}</p>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-blue-600">Wise</span>
            <span className="font-medium">{result.wiseRate.toLocaleString()} {toCurrency}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-purple-600">Remitly</span>
            <span className="font-medium">{result.remitlyRate.toLocaleString()} {toCurrency}</span>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <a href="https://wise.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg text-center transition-colors">Send with Wise</a>
          <a href="https://remitly.com" target="_blank" rel="noopener noreferrer" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 rounded-lg text-center transition-colors">Send with Remitly</a>
        </div>
      </div>
    </div>
  );
}

interface CountryRatesPageProps {
  countrySlug?: string;
}

export default function CountryRatesPage({ countrySlug = 'pakistan' }: CountryRatesPageProps) {
  const [rates, setRates] = useState<GoldRates | null>(null);
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[]>([]);
  const [cryptoData, setCryptoData] = useState<{ cryptos: CryptoData[]; market: CryptoMarket } | null>(null);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  const [currencyHistory, setCurrencyHistory] = useState<CurrencyHistory[]>([]);
  const [stockIndices, setStockIndices] = useState<StockIndex[]>([]);
  const [stockMovers, setStockMovers] = useState<{ gainers: StockMover[]; losers: StockMover[] } | null>(null);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [financialNews, setFinancialNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeUnit, setActiveUnit] = useState<'per_gram' | 'per_tola' | 'per_10g' | 'per_oz'>('per_gram');
  const [refreshing, setRefreshing] = useState(false);
  const [stressData] = useState(FINANCIAL_STRESS_DATA[countrySlug] || FINANCIAL_STRESS_DATA['pakistan']);
  const [miseryData] = useState(MISERY_INDEX_DATA.find(m => m.countrySlug === countrySlug) || MISERY_INDEX_DATA[0]);

  const currency = COUNTRY_CURRENCIES[countrySlug] ?? {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate_to_usd: 1,
    flag: 'US',
  };

  const headerColor = FLAG_COLORS[countrySlug] ?? '#1e3a5f';
  const countryName = toTitleCase(countrySlug);
  const interestRate = INTEREST_RATES[countrySlug];

  const loadRates = useCallback(
    async (showRefreshing = false) => {
      if (showRefreshing) setRefreshing(true);
      try {
        const [goldData, oilData, fuelData, crypto, currencies, history, stocks, movers, commods, news] = await Promise.all([
          fetchGoldRates(currency.rate_to_usd, currency.code, currency.symbol),
          fetchOilPrices(),
          fetchFuelPrices(currency.rate_to_usd, currency.code, countrySlug),
          fetchCryptoData(currency.rate_to_usd, currency.code, currency.symbol),
          Promise.resolve(fetchCurrencyPairs()),
          Promise.resolve(fetchCurrencyHistory(currency.code, 1)),
          Promise.resolve(fetchStockIndices()),
          Promise.resolve(fetchStockMovers()),
          Promise.resolve(fetchCommodities()),
          Promise.resolve(getDefaultFinancialNews(countrySlug)),
        ]);
        setRates(goldData);
        setOilPrices(oilData);
        setFuelPrices(fuelData);
        setCryptoData(crypto);
        setCurrencyPairs(currencies);
        setCurrencyHistory(history);
        setStockIndices(stocks.filter(s => s.country === countrySlug || !s.country));
        setStockMovers(movers);
        setCommodities(commods);
        setFinancialNews(news);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currency.rate_to_usd, currency.code, currency.symbol, countrySlug]
  );

  useEffect(() => {
    loadRates();
    const interval = setInterval(() => loadRates(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadRates]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getUnitValue = (karat: 'k24' | 'k22' | 'k21' | 'k20' | 'k18') => {
    if (!rates) return 0;
    const gramPrice = rates.by_karat[karat];
    if (activeUnit === 'per_gram') return gramPrice;
    if (activeUnit === 'per_tola') return Math.round(gramPrice * 11.664 * 100) / 100;
    if (activeUnit === 'per_10g') return Math.round(gramPrice * 10 * 100) / 100;
    return Math.round(gramPrice * 31.1035 * 100) / 100;
  };

  const isPositive = rates ? rates.change_percent >= 0 : true;
  const isYTDPositive = rates ? rates.ytd_change_percent >= 0 : true;

  const sym = currency.symbol;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Header */}
      <div className="gradient-hero border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:border-white/20">
              <ArrowLeft className="w-4 h-4" />
              World Rates
            </button>
            <span className="text-gray-600">/</span>
            <span className="text-gray-300 text-sm font-medium">{countryName}</span>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-5 mb-4">
                <span className="text-6xl">{currency.flag}</span>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                    {countryName} Gold Rates
                  </h1>
                  <p className="text-gray-400 text-base mt-2">
                    Prices in {currency.name} ({currency.code}) · Updated every 5 min
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {rates && (
                <div
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${
                    isPositive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  {isPositive ? '+' : ''}{rates.change_percent}% today
                </div>
              )}
              <button
                onClick={() => loadRates(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-medium border border-white/20 transition-all backdrop-blur-sm"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Live Price Strip */}
          {rates && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: `Current 24K/gram`, value: fmt(rates.per_gram, sym), highlight: true },
                { label: "Today's High", value: fmt(rates.high, sym) },
                { label: "Today's Low", value: fmt(rates.low, sym) },
                { label: 'Open', value: fmt(rates.open, sym) },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl px-5 py-4 ${
                    item.highlight
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/10 text-white border border-white/10 backdrop-blur-sm'
                  }`}
                >
                  <p className={`text-xs uppercase tracking-wide mb-2 font-medium ${item.highlight ? 'text-amber-100' : 'text-gray-400'}`}>
                    {item.label}
                  </p>
                  <p className="text-xl font-bold font-mono">
                    {item.value} <span className="text-xs font-normal opacity-70">{currency.code}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-10">
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <div className="space-y-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : rates ? (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Karat Table */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {countryName} Gold Rates by Karat
                    </h2>
                    <p className="text-sm text-gray-400">All prices in {currency.name}</p>
                  </div>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {UNITS.map((u) => (
                      <button
                        key={u.key}
                        onClick={() => setActiveUnit(u.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          activeUnit === u.key
                            ? 'bg-white shadow-sm text-amber-700 font-semibold'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {u.label.split(' ')[1] || u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {KARATS.map((k) => {
                    const val = getUnitValue(k.key);
                    const isK24 = k.key === 'k24';
                    return (
                      <div
                        key={k.key}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl ${
                          isK24 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50 border border-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                              isK24 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {k.label}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{k.label} Gold</p>
                            <p className="text-xs text-gray-400">Purity {k.purity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-bold font-mono ${isK24 ? 'text-amber-700' : 'text-gray-800'}`}>
                            {fmt(val, sym)}
                          </p>
                          <p className="text-xs text-gray-400">{currency.code} / {UNITS.find((u) => u.key === activeUnit)?.label.split(' ').slice(1).join(' ')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">30-Day Price History</h2>
                    <p className="text-sm text-gray-400">
                      24K gold per gram · {currency.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        isYTDPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isYTDPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      YTD: {isYTDPositive ? '+' : ''}{rates.ytd_change_percent}%
                    </div>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={rates.history} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`grad-${countrySlug}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatDate}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={false}
                      interval={6}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => {
                        if (v >= 1000) return `${sym}${(v / 1000).toFixed(1)}k`;
                        return `${sym}${v.toFixed(0)}`;
                      }}
                      width={65}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1f2937',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#f9fafb',
                        fontSize: '13px',
                      }}
                      formatter={(value: number) => [
                        `${sym}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.code}`,
                        '24K/gram',
                      ]}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#d97706"
                      strokeWidth={2}
                      fill={`url(#grad-${countrySlug})`}
                      dot={false}
                      activeDot={{ r: 4, fill: '#d97706', strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Today's Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">
                  Today's Market Summary ({currency.code})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Open', value: fmt(rates.open, sym), sub: currency.code },
                    { label: 'Current', value: fmt(rates.per_gram, sym), sub: currency.code, highlight: true },
                    { label: 'High', value: fmt(rates.high, sym), sub: currency.code },
                    { label: 'Low', value: fmt(rates.low, sym), sub: currency.code },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl p-4 text-center ${
                        item.highlight
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <p className={`text-xs uppercase tracking-wide mb-2 ${item.highlight ? 'text-amber-100' : 'text-gray-400'}`}>
                        {item.label}
                      </p>
                      <p className={`text-base font-bold font-mono ${item.highlight ? 'text-white' : 'text-gray-800'}`}>
                        {item.value}
                      </p>
                      <p className={`text-xs mt-1 ${item.highlight ? 'text-amber-200' : 'text-gray-400'}`}>
                        {item.sub}/gram
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Low {fmt(rates.low, sym)}</span>
                    <span>High {fmt(rates.high, sym)}</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-300 to-amber-600 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(5, ((rates.per_gram - rates.low) / Math.max(0.01, rates.high - rates.low)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Quick Reference */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  24K Quick Reference
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'Per Gram', value: fmt(rates.per_gram, sym) },
                    { label: 'Per Tola (11.664g)', value: fmt(rates.per_tola, sym) },
                    { label: 'Per 10 Grams', value: fmt(rates.per_10g, sym) },
                    { label: 'Per Troy Ounce', value: fmt(rates.per_oz, sym) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900 font-mono">{item.value}</span>
                        <span className="text-xs text-gray-400 ml-1">{currency.code}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Converter */}
              <CurrencyConverter
                rates={rates}
                currency={currency}
                rateToUsd={currency.rate_to_usd}
              />

              {/* Zakat Calculator */}
              <ZakatCalculator
                nisabValue={rates.zakat_nisab_value}
                nisabGrams={rates.zakat_nisab_grams}
                currency={currency}
                perGram={rates.per_gram}
              />

              {/* Info */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">Reference</h3>
                </div>
                <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                  <p>1 Troy Oz = 31.1035 grams</p>
                  <p>1 Tola = 11.664 grams</p>
                  <p>Zakat Nisab = 87.48g gold</p>
                  <p>
                    Exchange rate: 1 USD = {currency.rate_to_usd.toLocaleString()} {currency.code}
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Updated: {new Date(rates.last_updated).toLocaleTimeString()} UTC
              </p>
            </div>
          </div>

          {/* SECTION 2 — OIL & ENERGY */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Droplet className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Oil & Energy Prices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {oilPrices.map((oil) => {
                const isUp = oil.change_24h >= 0;
                return (
                  <div key={oil.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600">{oil.name}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {isUp ? '+' : ''}{oil.change_24h}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${oil.price_usd.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-1">{oil.unit}</p>
                  </div>
                );
              })}
            </div>

            {/* How oil affects country */}
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900 leading-relaxed">{generateOilAffectParagraph(countrySlug)}</p>
            </div>

            {/* Local Fuel Prices */}
            {fuelPrices.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Fuel className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">{countryName} Fuel Prices</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fuelPrices.map((fuel) => (
                    <div key={fuel.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{fuel.name}</p>
                      <p className="text-lg font-bold text-gray-900 font-mono">{fuel.currency_symbol === '$' ? '' : fuel.currency_symbol}{fuel.price_local.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">per liter{fuel.name === 'LPG' ? '/kg' : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3 — CRYPTOCURRENCY */}
          {cryptoData && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Top 10 Cryptocurrencies</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    BTC Dominance: <span className="font-semibold text-amber-600">{cryptoData.market.btc_dominance}%</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    cryptoData.market.fear_greed_index >= 60 ? 'bg-green-100 text-green-700' :
                    cryptoData.market.fear_greed_index >= 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {cryptoData.market.fear_greed_index} - {cryptoData.market.fear_greed_label}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">#</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Coin</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Price ({currency.code})</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">24h</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptoData.cryptos.map((crypto, idx) => {
                        const isUp = crypto.change_24h >= 0;
                        return (
                          <tr key={crypto.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-gray-400">{idx + 1}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">{crypto.symbol}</span>
                                <span className="text-gray-500">{crypto.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900">
                              {sym}{crypto.price_local < 1 ? crypto.price_local.toFixed(4) : crypto.price_local.toLocaleString()}
                            </td>
                            <td className={`py-3 px-4 text-right font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                              {isUp ? '+' : ''}{crypto.change_24h}%
                            </td>
                            <td className="py-3 px-4 text-right text-gray-600">{crypto.market_cap_formatted}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Prices in {currency.name} · Fear & Greed Index measures market sentiment
              </p>
            </div>
          )}

          {/* SECTION 4 — CURRENCY EXCHANGE with Remittance Calculator */}
          {currencyPairs.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Currency Exchange Rates (vs USD)</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Currency</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Interbank</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">Open Market</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-500">24h</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currencyPairs.slice(0, 10).map((pair) => {
                          const isUp = pair.change_24h >= 0;
                          return (
                            <tr key={pair.code} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-gray-900">{pair.code}</span>
                                  <span className="text-gray-500">{pair.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right font-mono text-gray-900">{pair.interbank_rate.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right font-mono text-gray-700">{pair.open_market_rate.toLocaleString()}</td>
                              <td className={`py-3 px-4 text-right font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                                {isUp ? '+' : ''}{pair.change_24h}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-4">
                  <RemittanceCalculator currency={currency} currencyPairs={currencyPairs} />
                </div>
              </div>

              {/* Currency History Chart */}
              {currencyHistory.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{currency.code}/USD 1-Year History</h3>
                      <p className="text-sm text-gray-500">
                        {currency.code} has lost {calculateCurrencyLoss(currencyHistory).percentLost}% vs USD in {calculateCurrencyLoss(currencyHistory).yearsAgo} years
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={currencyHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="currencyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short' })} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} interval={6} />
                      <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} width={60} />
                      <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#f9fafb', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={2} fill="url(#currencyGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* SECTION 5 — STOCK MARKET */}
          {stockIndices.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">{countryName} Stock Market</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stockIndices.filter(s => s.country === countrySlug).map((idx) => {
                  const isUp = idx.change >= 0;
                  return (
                    <div key={idx.symbol} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">{idx.name}</span>
                        <span className={`flex items-center gap-1 text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-gray-900 font-mono">{idx.value.toLocaleString()}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-gray-400">YTD:</span>
                        <span className={idx.ytdPercent >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {idx.ytdPercent >= 0 ? '+' : ''}{idx.ytdPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Global Indices Summary */}
              <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Global Markets Snapshot</h3>
                <div className="flex flex-wrap gap-2">
                  {stockIndices.filter(s => s.country !== countrySlug).slice(0, 8).map((idx) => {
                    const isUp = idx.change >= 0;
                    return (
                      <span key={idx.symbol} className="text-xs bg-gray-50 px-2 py-1 rounded">
                        {idx.symbol} <span className={isUp ? 'text-green-600' : 'text-red-600'}>
                          {isUp ? '+' : ''}{idx.changePercent.toFixed(1)}%
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Top Movers */}
              {stockMovers && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Top Gainers Today
                    </h3>
                    <div className="space-y-2">
                      {stockMovers.gainers.slice(0, 5).map((stock) => (
                        <div key={stock.symbol} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-900">{stock.symbol}</span>
                            <span className="text-gray-500 ml-2">{stock.name}</span>
                          </div>
                          <span className="text-green-600 font-semibold">+{stock.changePercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" /> Top Losers Today
                    </h3>
                    <div className="space-y-2">
                      {stockMovers.losers.slice(0, 5).map((stock) => (
                        <div key={stock.symbol} className="flex justify-between text-sm">
                          <div>
                            <span className="font-medium text-gray-900">{stock.symbol}</span>
                            <span className="text-gray-500 ml-2">{stock.name}</span>
                          </div>
                          <span className="text-red-600 font-semibold">{stock.changePercent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 6 — INTEREST RATES with Loan Calculator */}
          {interestRate && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Percent className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">{interestRate.country} Interest Rates</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-600">{interestRate.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      interestRate.changeDirection === 'hike' ? 'bg-red-100 text-red-700' :
                      interestRate.changeDirection === 'cut' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {interestRate.changeDirection.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">{interestRate.rate}%</p>
                  <p className="text-xs text-gray-500">Last change: {interestRate.lastChange}</p>
                  <p className="text-xs text-gray-500">Next meeting: {interestRate.nextMeeting}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Home className="w-5 h-5 text-amber-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Home Loan Calculator</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">If you borrow {sym}5M for 20 years:</p>
                  <p className="text-sm text-gray-700">Monthly payment: <span className="font-bold text-gray-900">{sym}{calculateLoan(5000000, interestRate.rate, 20).monthlyPayment.toLocaleString()}</span></p>
                  <p className="text-xs text-gray-500 mt-2">Total interest: {sym}{calculateLoan(5000000, interestRate.rate, 20).totalInterest.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <PiggyBank className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-semibold text-gray-900">Savings Calculator</h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">If you save {sym}100K for 1 year:</p>
                  <p className="text-sm text-gray-700">Annual return: <span className="font-bold text-gray-900">{sym}{calculateSavings(100000, interestRate.rate).annualReturn.toLocaleString()}</span></p>
                  <p className="text-xs text-gray-500 mt-2">Per month: {sym}{calculateSavings(100000, interestRate.rate).monthlyReturn.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7 — COMMODITIES (Pakistan Relevant Highlighted) */}
          {commodities.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Commodity Prices</h2>
              </div>

              {/* Pakistan Relevant */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-700">{countryName} Relevant</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {commodities.filter(c => c.pakistanRelevant).map((commod) => {
                    const isUp = commod.change_24h >= 0;
                    const localPrice = Math.round(commod.price_usd * currency.rate_to_usd * 100) / 100;
                    return (
                      <div key={commod.name} className="bg-green-50 rounded-xl border-2 border-green-300 p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-green-800">{commod.name}</p>
                          <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">{commod.relevanceNote}</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">${commod.price_usd.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mb-1">{commod.unit}</p>
                        <p className="text-sm text-green-700 font-medium">{sym}{localPrice.toLocaleString()}</p>
                        <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? '+' : ''}{commod.change_24h}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metals */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <h3 className="text-xs font-semibold text-gray-600">Metals</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commodities.filter(c => c.category === 'metals').slice(0, 4).map((commod) => (
                    <span key={commod.name} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">
                      {commod.name}: ${commod.price_usd.toLocaleString()}
                      <span className={commod.change_24h >= 0 ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                        {commod.change_24h >= 0 ? '+' : ''}{commod.change_24h}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Agriculture */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wheat className="w-4 h-4 text-green-600" />
                  <h3 className="text-xs font-semibold text-gray-600">Agriculture</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {commodities.filter(c => c.category === 'agriculture' && !c.pakistanRelevant).slice(0, 4).map((commod) => (
                    <span key={commod.name} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded">
                      {commod.name}: ${commod.price_usd.toLocaleString()}
                      <span className={commod.change_24h >= 0 ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
                        {commod.change_24h >= 0 ? '+' : ''}{commod.change_24h}%
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8 — FINANCIAL STRESS METER */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Financial Stress & Misery Index</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialStressMeter data={stressData} />
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h3 className="text-sm font-semibold text-gray-900">Misery Index: {miseryData.miseryIndex}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">Misery Index = Inflation + Unemployment</p>
                <div className="space-y-3">
                  {MISERY_INDEX_DATA.slice(0, 5).map((item, idx) => (
                    <div key={item.countrySlug} className={`flex items-center justify-between text-sm ${item.countrySlug === countrySlug ? 'bg-amber-50 -mx-2 px-2 py-1 rounded' : ''}`}>
                      <span className="font-medium text-gray-700">#{idx + 1} {item.country}</span>
                      <span className={`font-bold ${item.miseryIndex >= 30 ? 'text-red-600' : item.miseryIndex >= 15 ? 'text-orange-600' : 'text-green-600'}`}>
                        {item.miseryIndex}
                      </span>
                    </div>
                  ))}
                </div>

                {/* What this means for you */}
                {miseryData && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">What this means for you:</p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      At {miseryData.inflation}% inflation, your {sym}1,000 today was worth {sym}{Math.round(1000 / (1 + miseryData.inflation / 100) * 100) / 100} one year ago.
                    </p>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Your {sym}50,000 monthly budget needs {sym}{Math.round(50000 * miseryData.inflation / 100).toLocaleString()} more to maintain the same lifestyle.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 9 — PURCHASING POWER CALCULATOR */}
          {rates && cryptoData && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Purchasing Power Over Time</h2>
              </div>
              <PurchasingPowerCalculator
                inflation={miseryData?.inflation || 10}
                currencyRate={currency.rate_to_usd}
                currencySymbol={sym}
                goldPricePerGram={rates.per_gram}
                bitcoinPrice={cryptoData.cryptos.find(c => c.id === 'bitcoin')?.price_usd || 67000}
              />
            </div>
          )}

          {/* SECTION 10 — FINANCIAL NEWS */}
          {financialNews.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Newspaper className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">{countryName} Financial News</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialNews.map((article, idx) => (
                  <a key={idx} href={article.url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{article.title}</p>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{article.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                      <span className="font-medium">{article.source}</span>
                      <span>|</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          </>
        ) : (
          <div className="flex items-center justify-center py-24">
            <p className="text-gray-500">Failed to load rates. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}
