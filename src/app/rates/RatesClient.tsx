'use client';
import { useState, useEffect, useCallback } from 'react';
import { DirectAnswer, FaqBlock, type AeoFaq } from '@/components/aeo/AnswerLayer';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, Globe, Calculator, Info, Droplet, Coins, DollarSign, TrendingUp as TrendUp, TrendingDown as TrendDown, BarChart3, Percent, ArrowUpRight, ArrowDownRight, Banknote, PiggyBank, Home, Wheat, Flame, Factory, Newspaper, AlertTriangle } from 'lucide-react';
import { fetchGoldRates, fetchSilverRates, fetchOilPrices, fetchCryptoData, fetchCurrencyPairs, fetchStockIndices, fetchCommodities, calculateLoan, calculateSavings, type GoldRates, type SilverRates, type OilPrice, type CryptoData, type CryptoMarket, type CurrencyPair, type StockIndex, type Commodity, type FinancialStressData, type MiseryIndex } from '../../lib/apis/rates';
import { fetchWorldBankLatest, buildMiseryIndex, computeStressScore, stressLevel, MISERY_META, type WBValues } from '../../lib/apis/worldbank';

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

function fmt(val: number, symbol = '$') {
  return `${symbol}${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-5" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl" />
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
  const color = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' }[level];
  const bgColor = { low: 'bg-emerald-50', medium: 'bg-amber-50', high: 'bg-orange-50', critical: 'bg-red-50' }[level];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-700">{country} Financial Stress</h3>
        <span className={`badge ${level === 'low' ? 'badge-success' : level === 'medium' ? 'badge-warning' : 'badge-danger'}`}>
          {level.toUpperCase()}
        </span>
      </div>
      <div className="flex justify-center py-4">
        <svg viewBox="0 0 200 120" className="w-full max-w-xs">
          <defs>
            <linearGradient id="stressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="60%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#stressGrad)" strokeWidth="18" strokeLinecap="round" />
          <g transform={`rotate(${rotation} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="25" stroke={color} strokeWidth="4" strokeLinecap="round" />
            <circle cx="100" cy="100" r="10" fill={color} />
          </g>
          <text x="20" y="118" fontSize="10" fill="#9ca3af">Low</text>
          <text x="85" y="118" fontSize="10" fill="#9ca3af">Med</text>
          <text x="140" y="118" fontSize="10" fill="#9ca3af">High</text>
          <text x="170" y="118" fontSize="10" fill="#9ca3af">Crit</text>
        </svg>
      </div>
      <div className="text-center py-2">
        <span className="text-5xl font-bold tabular-nums" style={{ color }}>{score}</span>
        <span className="text-xl text-gray-400 ml-1">/100</span>
      </div>
      <div className={`mt-4 grid grid-cols-3 gap-3 text-center p-3 rounded-xl ${bgColor}`}>
        <div>
          <p className="data-label">Inflation</p>
          <p className="data-value mt-1">{inflation}%</p>
        </div>
        <div>
          <p className="data-label">Unemployment</p>
          <p className="data-value mt-1">{unemployment}%</p>
        </div>
        {debtToGdp > 0 && (
          <div>
            <p className="data-label">Debt/GDP</p>
            <p className="data-value mt-1">{debtToGdp}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ZakatCalculatorProps {
  nisabValue: number;
  nisabGrams: number;
  symbol: string;
  perGram: number;
}

function ZakatCalculator({ nisabValue, nisabGrams, symbol, perGram }: ZakatCalculatorProps) {
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
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Zakat Calculator</h2>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-5 max-w-2xl">
        Zakat is charged at 2.5% on qualifying wealth held above the nisab threshold. This calculator values
        your gold at the live price on this page and compares your total against the nisab — shown in the box
        below — before working out what is due.
      </p>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-5">
        <p className="text-sm font-bold text-amber-900">
          Nisab: {fmt(nisabValue, symbol)}
        </p>
        <p className="text-xs text-amber-700 mt-1">
          {nisabGrams}g of gold · 2.5% Zakat rate
        </p>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="data-label mb-2 block">Total Wealth ({symbol})</label>
          <input
            type="number"
            value={wealth}
            onChange={(e) => setWealth(e.target.value)}
            placeholder="0.00"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-0 transition-colors"
          />
        </div>
        <div>
          <label className="data-label mb-2 block">Gold Owned (grams)</label>
          <input
            type="number"
            value={goldGrams}
            onChange={(e) => setGoldGrams(e.target.value)}
            placeholder="0"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-0 transition-colors"
          />
        </div>
      </div>

      <button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm shadow-sm hover:shadow-md"
      >
        Calculate Zakat
      </button>

      {result !== null && (
        <div
          className={`mt-5 p-4 rounded-xl border-2 ${
            result.owes
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          {result.owes ? (
            <>
              <p className="font-bold text-emerald-800">Zakat is due</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{fmt(result.amount, symbol)}</p>
            </>
          ) : (
            <p className="font-medium text-gray-600">Wealth below nisab threshold</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function WorldRatesPage({ initialRates, initialSilver, initialCrypto, initialPairs }: {
  // Real data fetched on the server (CoinGecko + ExchangeRate-API) so the
  // raw HTML carries live rates instead of a loading skeleton.
  initialRates?: GoldRates | null;
  initialSilver?: SilverRates | null;
  initialCrypto?: { cryptos: CryptoData[]; market: CryptoMarket } | null;
  initialPairs?: CurrencyPair[];
} = {}) {
  const [rates, setRates] = useState<GoldRates | null>(initialRates ?? null);
  const [silver, setSilver] = useState<SilverRates | null>(initialSilver ?? null);
  // World Bank real data (Batch 3b) — replaces the static INTEREST_RATES /
  // FINANCIAL_STRESS_DATA / MISERY_INDEX_DATA tables (undated snapshots
  // presented as current). Sections hide until real data arrives.
  const [wbMap, setWbMap] = useState<Record<string, WBValues> | null>(null);
  useEffect(() => {
    let on = true;
    fetchWorldBankLatest(MISERY_META.map(m => m.iso2))
      .then(m => { if (on) setWbMap(m); })
      .catch(() => {});
    return () => { on = false; };
  }, []);
  const wbMisery = wbMap ? buildMiseryIndex(wbMap) : [];
  const wbStress: FinancialStressData[] = wbMap ? MISERY_META.flatMap(m => {
    const v = wbMap[m.iso2];
    if (!v?.inflation || !v?.unemployment) return [];
    const score = computeStressScore(v.inflation.value, v.unemployment.value);
    return [{
      country: m.name,
      inflation: Math.round(v.inflation.value * 10) / 10,
      unemployment: Math.round(v.unemployment.value * 10) / 10,
      debtToGdp: v.debtPctGdp ? Math.round(v.debtPctGdp.value * 10) / 10 : 0,
      score,
      level: stressLevel(score),
    }];
  }) : [];
  const wbRates = wbMap ? MISERY_META.flatMap(m => {
    const v = wbMap[m.iso2]?.realRate;
    // Only reasonably current real rates (older series, e.g. Pakistan's
    // stops at 2020, would mislead as "current" rates).
    if (!v || v.year < 2023) return [];
    return [{ slug: m.slug, country: m.name, rate: Math.round(v.value * 100) / 100, year: v.year }];
  }) : [];
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [cryptoData, setCryptoData] = useState<{ cryptos: CryptoData[]; market: CryptoMarket } | null>(initialCrypto ?? null);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>(initialPairs ?? []);
  const [stockIndices, setStockIndices] = useState<StockIndex[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [loading, setLoading] = useState(!initialRates);
  const [activeUnit, setActiveUnit] = useState<'per_gram' | 'per_tola' | 'per_10g' | 'per_oz'>('per_gram');
  const [refreshing, setRefreshing] = useState(false);

  const loadRates = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const [goldData, silverData, oilData, crypto, currencies, stocks, commods] = await Promise.all([
        fetchGoldRates(1, 'USD', '$'),
        fetchSilverRates(1, 'USD', '$'),
        fetchOilPrices(),
        fetchCryptoData(1, 'USD', '$'),
        fetchCurrencyPairs(),
        Promise.resolve(fetchStockIndices()),
        Promise.resolve(fetchCommodities()),
      ]);
      setRates(goldData);
      setSilver(silverData);
      setOilPrices(oilData);
      setCryptoData(crypto);
      setCurrencyPairs(currencies);
      setStockIndices(stocks);
      setCommodities(commods);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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

  // ── Batch 4 Item 2: AEO answer layer ────────────────────────────────────
  // Direct-answer block + FAQ block for the rates template. Questions are
  // the mined competitor-FAQ phrasings (see evidence/batch4-item2/
  // question-bank.md). Every PKR figure is computed from THIS page's own
  // two live inputs — the gold spot feed and the USD/PKR pair in the FX
  // table below — never hard-coded; the answers say so, and distinguish
  // the spot-derived figure from the APSGJA Sarafa bazaar rate, exactly
  // as the mined sources do. Rendered only when both live inputs exist.
  const pkrPair = currencyPairs.find((pr) => pr.code === 'PKR') ?? null;
  const pkrOf = (usd: number) => (pkrPair ? Math.round(usd * pkrPair.rate).toLocaleString('en-US') : '');
  const usdOz = rates ? `$${Math.round(rates.per_oz).toLocaleString('en-US')}` : '';
  const fxText = pkrPair ? pkrPair.rate.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const ratesAeoSource = `Spot gold: this page's live feed (gold-api.com) · Conversion: this page's USD/PKR pair (ExchangeRate-API) · Live, ${todayStr} · The APSGJA Sarafa bazaar rate is announced separately and can differ`;
  const ratesDirectAnswer =
    rates && pkrPair
      ? `The gold rate in Pakistan today is about PKR ${pkrOf(rates.per_tola)} per tola for 24-karat gold — the live international spot price converted at this page's USD to PKR rate of ${fxText}. Gold is ${usdOz} per troy ounce and PKR ${pkrOf(rates.per_gram)} per gram right now. The Sarafa bazaar rate announced by the APSGJA can differ slightly, and jewellers add making charges on top.`
      : null;
  const ratesFaqs: AeoFaq[] =
    rates && pkrPair
      ? [
          {
            q: 'What is the gold rate in Pakistan today?',
            a: `Gold in Pakistan today is about PKR ${pkrOf(rates.per_tola)} per tola for 24-karat gold — the live spot price of ${usdOz} per troy ounce converted at this page's USD to PKR rate of ${fxText}, the same two live figures published in the tables below. That works out to PKR ${pkrOf(rates.per_gram)} per gram.${silver ? ` Silver is $${Math.round(silver.per_oz).toLocaleString('en-US')} per ounce.` : ''} The Sarafa bazaar rate announced by the APSGJA is set separately and can differ.`,
          },
          {
            q: 'What is the 22K gold price per tola in Pakistan?',
            a: `The 22-karat gold rate in Pakistan today is about PKR ${pkrOf(rates.by_karat.k22 * 11.664)} per tola, converted from the live spot price at USD to PKR ${fxText}. 22K gold is 91.7% pure — 22 parts gold in 24 — against 99.9% for 24K, which is why it costs less per tola. Jewellers favour 22K for jewellery because the alloyed metal is harder and holds stones and designs better than soft, pure gold.`,
          },
          {
            q: 'How many grams are in 1 tola of gold?',
            a: `One tola equals 11.664 grams — the traditional South Asian unit in which gold is weighed and priced across Pakistan's Sarafa bazaars. A troy ounce, the international unit, is 31.1035 grams, so one tola is 0.375 troy ounces. This page prices gold per gram, per 10 grams and per tola side by side, and the converters on it switch between the units at the live rate.`,
          },
          {
            q: 'What is the difference between 24K and 22K gold?',
            a: `24-karat gold is 99.9% pure gold; 22-karat is 91.7% pure, with the remaining share made of alloy metals such as copper or silver. That is why 24K costs more per gram — today about PKR ${pkrOf(rates.by_karat.k24)} against PKR ${pkrOf(rates.by_karat.k22)} — and why jewellers prefer 22K for jewellery: the alloy makes it harder and more durable, while 24K is the standard for investment bars and coins.`,
          },
          {
            q: 'How is the Pakistani gold rate calculated?',
            a: `Pakistan's gold rate follows the international market: the spot price in US dollars per troy ounce is converted into rupees at the USD to PKR exchange rate, then into grams and tolas — 31.1035 grams to the ounce, 11.664 grams to the tola. On this page that works out to about PKR ${pkrOf(rates.per_tola)} per tola today. Local premiums and jewellers' making charges are added on top of the bullion rate.`,
          },
          {
            q: 'How much is 1 gram of gold in Pakistan?',
            a: `One gram of 24-karat gold in Pakistan costs about PKR ${pkrOf(rates.per_gram)} right now — the live spot price converted at USD to PKR ${fxText}. Ten grams cost about PKR ${pkrOf(rates.per_10g)}, and one tola (11.664 grams) about PKR ${pkrOf(rates.per_tola)}. These are bullion rates before jewellers' making charges; the tables on this page also price the same gold in dollars and other currencies.`,
          },
        ]
      : [];

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh" }}>
      {/* Hero Header */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, #0a0f1e 60%)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-amber-400 text-sm font-bold uppercase tracking-widest">
                  World Gold Rates
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                Gold Price Today
              </h1>
              <p className="text-gray-400 mt-3 text-base">
                Live prices in USD · All karats · Updated every 5 minutes
              </p>
              <p className="text-gray-400 mt-3 max-w-2xl leading-relaxed">
                One page for the numbers people check every day: the live gold price in every karat, oil and
                the wider commodity board, the top cryptocurrencies, exchange rates for the currencies
                Pakistan trades and remits in, world stock indices and the World Bank&apos;s country
                indicators. Every figure is fetched from a named public source —{' '}
                <a href="/sources" className="text-amber-300 underline">the full list is published here</a> — and when a
                feed is down, its section is left out or reports itself unavailable instead of showing
                yesterday&apos;s number as today&apos;s.
              </p>
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

          {/* Batch 4 Item 2: direct-answer block, directly under the heading */}
          {ratesDirectAnswer && (
            <div className="mt-8">
              <DirectAnswer answer={ratesDirectAnswer} source={ratesAeoSource} />
            </div>
          )}

          {/* Live Price Strip */}
          {rates && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
              {[
                { label: 'Current (24K/oz)', value: fmt(rates.per_oz), highlight: true },
                { label: "Today's High", value: fmt(rates.high * 31.1035) },
                { label: "Today's Low", value: fmt(rates.low * 31.1035) },
                { label: 'Open', value: fmt(rates.open * 31.1035) },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-2xl px-5 py-4 ${
                    item.highlight
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/10 text-gray-200 border border-white/10 backdrop-blur-sm'
                  }`}
                >
                  <p className={`text-xs uppercase tracking-wide mb-2 font-medium ${item.highlight ? 'text-amber-100' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                  <p className="text-xl font-bold font-mono">{item.value}</p>
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
          <div id="gold" className="grid grid-cols-1 lg:grid-cols-3 gap-8 scroll-mt-28">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              <p className="text-sm leading-relaxed text-gray-600 max-w-3xl">
                Pure gold is 24 karat. Every lower karat is an alloy, and its price is the same live spot
                price scaled by its purity — 22K is 22/24 pure, 21K is 21/24 and 18K is 18/24. The table
                below converts the spot price into per-ounce, per-gram and per-tola figures (one tola =
                11.664 grams), so the number matches the unit your jeweller or bullion dealer quotes. Retail
                jewellery prices will differ: making charges are added on top, as the notes beside the table
                explain.
              </p>
              {/* Karat Price Table */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Gold Rates by Karat</h2>
                  <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                    {UNITS.map((u) => (
                      <button
                        key={u.key}
                        onClick={() => setActiveUnit(u.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                          activeUnit === u.key
                            ? 'bg-white shadow-sm text-amber-700 font-bold'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {u.label.split(' ')[1] || u.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {KARATS.map((k) => {
                    const val = getUnitValue(k.key);
                    const isK24 = k.key === 'k24';
                    return (
                      <div
                        key={k.key}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl transition-all ${
                          isK24
                            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200'
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${
                              isK24
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {k.label}
                          </div>
                          <div>
                            <p className="text-base font-bold text-gray-900">{k.label} Gold</p>
                            <p className="text-xs text-gray-500">Purity {k.purity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold font-mono ${isK24 ? 'text-amber-700' : 'text-gray-900'}`}>
                            {fmt(val, '$')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {UNITS.find((u) => u.key === activeUnit)?.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Chart */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">30-Day Price History</h2>
                    <p className="text-sm text-gray-500 mt-1">24K gold per gram · USD</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-xl">
                      Thirty daily closes from the same live feed, so one day&apos;s spike can be judged
                      against the month&apos;s trend. The badge in the corner tracks the change across the
                      year to date.
                    </p>
                  </div>
                  <div
                    className={`badge ${isYTDPositive ? 'badge-success' : 'badge-danger'}`}
                  >
                    {isYTDPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span className="ml-1">YTD: {isYTDPositive ? '+' : ''}{rates.ytd_change_percent}%</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={rates.history} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
                      tickFormatter={(v) => `$${v.toFixed(0)}`}
                      width={55}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1f2937',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#f9fafb',
                        fontSize: '13px',
                        padding: '12px',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '24K/gram']}
                      labelFormatter={(label) => formatDate(label)}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fill="url(#goldGrad)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Today's Range Detail */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-5">Today's Market Summary</h2>
                <p className="text-sm text-gray-500 leading-relaxed -mt-3 mb-5 max-w-2xl">
                  The day&apos;s trading range for 24K gold at a glance — open, current, high and low. A
                  narrow range means a quiet market; a wide one means the price moved hard during the day.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Open', value: fmt(rates.open), sub: 'per gram' },
                    { label: 'Current', value: fmt(rates.per_gram), sub: 'per gram', highlight: true },
                    { label: 'High', value: fmt(rates.high), sub: 'per gram' },
                    { label: 'Low', value: fmt(rates.low), sub: 'per gram' },
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
                      <p className={`text-lg font-bold font-mono ${item.highlight ? 'text-white' : 'text-gray-800'}`}>
                        {item.value}
                      </p>
                      <p className={`text-xs mt-1 ${item.highlight ? 'text-amber-200' : 'text-gray-400'}`}>
                        {item.sub}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Range bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Low {fmt(rates.low)}</span>
                    <span>High {fmt(rates.high)}</span>
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
              {/* Quick units card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">24K Quick Reference</h2>
                <div className="space-y-3">
                  {[
                    { label: 'Per Gram', value: fmt(rates.per_gram) },
                    { label: 'Per Tola (11.664g)', value: fmt(rates.per_tola) },
                    { label: 'Per 10 Grams', value: fmt(rates.per_10g) },
                    { label: 'Per Troy Ounce', value: fmt(rates.per_oz) },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-500">{item.label}</span>
                      <span className="text-sm font-bold text-gray-900 font-mono">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zakat Calculator */}
              <ZakatCalculator
                nisabValue={rates.zakat_nisab_value}
                nisabGrams={rates.zakat_nisab_grams}
                symbol="$"
                perGram={rates.per_gram}
              />

              {/* Info card */}
              <div className="bg-gray-900 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-white">About Gold Pricing</h3>
                </div>
                <div className="space-y-2 text-xs text-gray-400 leading-relaxed">
                  <p>1 Troy Oz = 31.1035 grams</p>
                  <p>1 Tola (South Asian unit) = 11.664 grams</p>
                  <p>Zakat Nisab = 87.48g of gold (Hanafi)</p>
                  <p>Prices shown include live spot rates. Jewelry retail prices include making charges (typically 8-15%).</p>
                </div>
              </div>

              {/* Last updated */}
              <p className="text-xs text-gray-600 text-center">
                Last updated: {new Date(rates.last_updated).toLocaleTimeString()} UTC
              </p>
            </div>
          </div>

          {/* SECTION 1B — SILVER (anchor target of Ticker 1's silver item) */}
          {silver && (
            <div id="silver" className="mt-10 scroll-mt-28">
              <div className="section-title">
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-slate-600" />
                </div>
                Silver Rates — Live Spot (XAG)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
                <div className="card card-hover p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Spot — per Troy Oz</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(silver.per_oz, silver.currency_symbol)}</p>
                  <p className="text-xs text-gray-500 mt-1">Fine silver (.999), live spot</p>
                </div>
                <div className="card card-hover p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Per Gram</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(silver.per_gram, silver.currency_symbol)}</p>
                  <p className="text-xs text-gray-500 mt-1">Fine silver (.999)</p>
                </div>
                <div className="card card-hover p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Per Tola (11.664g)</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(silver.per_tola, silver.currency_symbol)}</p>
                  <p className="text-xs text-gray-500 mt-1">The unit Pakistani jewellers quote</p>
                </div>
                <div className="card card-hover p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Per Kilogram</p>
                  <p className="text-2xl font-bold text-gray-900 tabular-nums">{fmt(silver.per_kg, silver.currency_symbol)}</p>
                  <p className="text-xs text-gray-500 mt-1">Fine silver (.999)</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="card p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Sterling Silver (.925) — per Gram</p>
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{fmt(silver.sterling_per_gram, silver.currency_symbol)}</p>
                  <p className="text-xs text-gray-500 mt-1">Derived from the live spot price at .925 fineness — the melt value of sterling jewellery and tableware before any making charges.</p>
                </div>
                {rates && (
                  <div className="card p-5">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Gold : Silver Ratio</p>
                    <p className="text-xl font-bold text-gray-900 tabular-nums">{(rates.per_oz / silver.per_oz).toFixed(1)} : 1</p>
                    <p className="text-xs text-gray-500 mt-1">Computed from the two live spot prices on this page — how many ounces of silver one ounce of gold buys right now.</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Spot silver (XAG) via gold-api.com — the same source as the homepage ticker — updated {new Date(silver.last_updated).toLocaleTimeString()} UTC. The source publishes spot only, so no daily-change figure is shown rather than an invented one.
              </p>
            </div>
          )}

          {/* SECTION 2 — OIL & ENERGY */}
          <div className="mt-10">
            <div className="section-title">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Droplet className="w-5 h-5 text-orange-600" />
              </div>
              Oil & Energy Prices
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mt-4">
              These are the benchmark prices the world&apos;s fuel costs are built on — when crude moves,
              petrol, transport and eventually food prices follow. Each card shows its unit (a barrel for
              crude oils) with the day&apos;s change beside the price.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {oilPrices.map((oil) => {
                const isUp = oil.change_24h >= 0;
                return (
                  <div key={oil.name} className="card card-hover p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">{oil.name}</span>
                      <span className={`badge ${isUp ? 'badge-success' : 'badge-danger'}`}>
                        {isUp ? '+' : ''}{oil.change_24h}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tabular-nums">${oil.price_usd.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">{oil.unit}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 3 — CRYPTOCURRENCY */}
          {cryptoData && (
            <div id="crypto" className="mt-10 scroll-mt-28">
              <div className="flex items-center justify-between mb-5">
                <div className="section-title">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-blue-600" />
                  </div>
                  Top 10 Cryptocurrencies
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xs text-gray-500">
                    Market Cap: <span className="font-bold text-gray-700">${(cryptoData.market.total_market_cap / 1e12).toFixed(2)}T</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    BTC Dominance: <span className="font-semibold text-amber-600">{cryptoData.market.btc_dominance}%</span>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    cryptoData.market.fear_greed_index >= 60 ? 'bg-green-100 text-green-700' :
                    cryptoData.market.fear_greed_index >= 40 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {cryptoData.market.fear_greed_label ? `${cryptoData.market.fear_greed_index} - ${cryptoData.market.fear_greed_label}` : 'Fear & Greed unavailable'}
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
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Price (USD)</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">24h Change</th>
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
                              ${crypto.price_usd < 1 ? crypto.price_usd.toFixed(4) : crypto.price_usd.toLocaleString()}
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
              <p className="text-sm text-gray-600 leading-relaxed mt-4 max-w-3xl">
                The ten largest cryptocurrencies by market capitalisation, priced live from CoinGecko, with
                the total size of the crypto market and Bitcoin&apos;s share of it shown above the table. The
                Fear &amp; Greed badge summarises market sentiment — useful context for the mood of the
                market, never a signal to buy or sell.
              </p>
              <p className="text-xs text-gray-400 mt-2 text-right">
                Data from CoinGecko · Fear & Greed Index measures market sentiment
              </p>
            </div>
          )}

          {/* SECTION 4 — CURRENCY EXCHANGE */}
          {currencyPairs.length > 0 && (
            <div id="forex" className="mt-10 scroll-mt-28">
              <div className="section-title">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                Currency Exchange Rates
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mt-4">
                Two rates are shown side by side because they answer two different questions. The interbank
                rate is what banks trade at between themselves; the open-market rate, set by money changers,
                is the one that decides what a remittance actually arrives as. A dash in the 24h column means
                no reliable change figure was published — not that the rate stood still.
              </p>
              <div className="card overflow-hidden mt-5">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-5 font-semibold text-gray-600">Currency</th>
                        <th className="text-right py-4 px-5 font-semibold text-gray-600">Interbank</th>
                        <th className="text-right py-4 px-5 font-semibold text-gray-600">Open Market</th>
                        <th className="text-right py-4 px-5 font-semibold text-gray-600">24h</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currencyPairs.map((pair) => {
                        const isUp = (pair.change_24h ?? 0) >= 0;
                        return (
                          <tr key={pair.code} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-gray-900">{pair.code}</span>
                                <span className="text-gray-500 text-xs">{pair.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 text-right font-mono font-medium text-gray-900">
                              {pair.interbank_rate.toLocaleString()}
                            </td>
                            <td className="py-4 px-5 text-right font-mono text-gray-700">
                              {pair.open_market_rate.toLocaleString()}
                            </td>
                            <td className="py-4 px-5 text-right">
                              {pair.change_24h != null ? (
                                <span className={`font-bold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {isUp ? '+' : ''}{pair.change_24h}%
                                </span>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5 — STOCK MARKET */}
          {stockIndices.length > 0 && (
            <div id="indices" className="mt-10 scroll-mt-28">
              <div className="section-title">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                Global Stock Market Indices
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mt-4">
                The headline index of each major market, with the day&apos;s points and percentage change. An
                index is a weighted average of its market&apos;s leading companies, so one number tells you
                the direction of a whole exchange.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                {stockIndices.map((idx) => {
                  const isUp = idx.change >= 0;
                  return (
                    <div key={idx.symbol} className="card card-hover p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="badge badge-info">{idx.country?.toUpperCase() || 'GLOBAL'}</span>
                        <span className={`flex items-center gap-1 text-xs font-bold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-base font-bold text-gray-900">{idx.symbol}</p>
                      <p className="text-xs text-gray-500 mb-3">{idx.name}</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900 tabular-nums">{idx.value.toLocaleString()}</span>
                        <span className={`text-xs font-medium ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                          {isUp ? '+' : ''}{idx.change.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <span className="text-gray-400">YTD:</span>
                        <span className={idx.ytdPercent >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {idx.ytdPercent >= 0 ? '+' : ''}{idx.ytdPercent}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 6 — INTEREST RATES */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Interest Rates — World Bank Real Rates</h2>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mb-4">
              Central-bank policy rates are not published as a free, machine-readable feed, so this section
              shows the closest honest equivalent: the World Bank&apos;s real interest rate for each country
              — the lending rate adjusted for inflation, with its data year on every card.
            </p>
            {wbRates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wbRates.slice(0, 6).map((ir) => (
                <div key={ir.slug} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{ir.country}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">{ir.year}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{ir.rate}%</span>
                    <span className="text-xs text-gray-500">Real interest rate</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Lending rate adjusted for inflation — World Bank {ir.year}. Policy rates are not published as a free data feed, so this comparable real rate is shown instead.</p>
                </div>
              ))}
            </div>
            ) : (
              <p className="text-sm text-gray-500">Loading World Bank interest-rate data…</p>
            )}
          </div>

          {/* SECTION 7 — COMMODITIES TABLE */}
          {commodities.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Global Commodity Prices</h2>
              </div>
              <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mb-4">
                Metals, energy and agricultural staples at their latest published prices — the raw-material
                costs behind everything from flour to fuel. Each card names its unit, and prices are the spot
                price or the latest exchange close the feed publishes.
              </p>

              {/* Metals */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Metals</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {commodities.filter(c => c.category === 'metals').map((commod) => {
                    const isUp = commod.change_24h >= 0;
                    return (
                      <div key={commod.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">{commod.name}</p>
                        <p className="text-lg font-bold text-gray-900">${commod.price_usd.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{commod.unit}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                            {isUp ? '+' : ''}{commod.change_24h}%
                          </span>
                          <span className="text-xs text-gray-400">| YTD: {commod.ytd_change >= 0 ? '+' : ''}{commod.ytd_change}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Energy */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Energy</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {commodities.filter(c => c.category === 'energy').map((commod) => {
                    const isUp = commod.change_24h >= 0;
                    return (
                      <div key={commod.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs font-medium text-gray-500 mb-1">{commod.name}</p>
                        <p className="text-lg font-bold text-gray-900">${commod.price_usd.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{commod.unit}</p>
                        <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? '+' : ''}{commod.change_24h}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Agriculture */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wheat className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-gray-700">Agriculture</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {commodities.filter(c => c.category === 'agriculture').map((commod) => {
                    const isUp = commod.change_24h >= 0;
                    return (
                      <div key={commod.name} className={`bg-white rounded-xl shadow-sm border p-4 ${commod.pakistanRelevant ? 'border-green-300 bg-green-50' : 'border-gray-100'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-500">{commod.name}</p>
                          {commod.pakistanRelevant && (
                            <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">{commod.relevanceNote}</span>
                          )}
                        </div>
                        <p className="text-lg font-bold text-gray-900">${commod.price_usd.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">{commod.unit}</p>
                        <span className={`text-xs font-semibold ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                          {isUp ? '+' : ''}{commod.change_24h}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8 — FINANCIAL STRESS METER */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Financial Stress Comparison</h2>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mb-4">
              A simple comparative score, computed by WorldCityHub from two World Bank series — inflation and
              unemployment — using the formula noted under the chart. It is a comparison aid, not an official
              statistic: the same two inputs, weighted the same way, for every country.
            </p>
            {wbStress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FinancialStressMeter data={wbStress.find(d => d.country === 'Pakistan') ?? wbStress[0]} />
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Country Comparison</h3>
                <div className="space-y-3">
                  {[...wbStress].sort((a, b) => b.score - a.score).slice(0, 6).map((data) => {
                    const levelColor = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' };
                    return (
                      <div key={data.country} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{data.country}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${data.score >= 80 ? 'bg-red-500' : data.score >= 60 ? 'bg-orange-500' : data.score >= 30 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${data.score}%` }} />
                          </div>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${levelColor[data.level]}`}>{data.score}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-400 mt-3">Score computed by WorldCityHub from World Bank inflation & unemployment (inflation × 1.6 + unemployment × 3.2, capped at 100).</p>
              </div>
            </div>
            ) : (
              <p className="text-sm text-gray-500">Loading World Bank data…</p>
            )}
          </div>

          {/* SECTION 9 — MISERY INDEX */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Misery Index by Country</h2>
            </div>
            <p className="max-w-3xl text-sm leading-relaxed text-gray-600 mb-4">
              The classic Misery Index adds a country&apos;s inflation rate to its unemployment rate — the
              two figures households feel most directly. Both inputs are the World Bank&apos;s latest
              published values for each country, as the note under the table states.
            </p>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Rank</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Country</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Inflation</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Unemployment</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">Misery Index</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wbMisery.map((item, idx) => (
                      <tr key={item.countrySlug} className={`border-b border-gray-50 last:border-0 ${item.countrySlug === 'pakistan' ? 'bg-amber-50' : ''}`}>
                        <td className="py-3 px-4">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx < 3 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">{item.country}</td>
                        <td className="py-3 px-4 text-right text-gray-700">{item.inflation}%</td>
                        <td className="py-3 px-4 text-right text-gray-700">{item.unemployment}%</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-bold ${item.miseryIndex >= 30 ? 'text-red-600' : item.miseryIndex >= 15 ? 'text-orange-600' : 'text-green-600'}`}>
                            {item.miseryIndex}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Misery Index = Inflation Rate + Unemployment Rate — latest World Bank values for each country.</p>
          </div>
          {/* Batch 4 Item 2: FAQ block + FAQPage schema (this template had none before) */}
          {ratesFaqs.length > 0 && (
            <div className="mt-12">
              <FaqBlock faqs={ratesFaqs} source={ratesAeoSource} emitSchema />
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
