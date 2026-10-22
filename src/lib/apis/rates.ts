export interface GoldRates {
  per_oz: number;
  per_gram: number;
  per_tola: number;
  per_10g: number;
  by_karat: {
    k24: number;
    k22: number;
    k21: number;
    k20: number;
    k18: number;
  };
  open: number;
  high: number;
  low: number;
  change_percent: number;
  ytd_change_percent: number;
  zakat_nisab_grams: number;
  zakat_nisab_value: number;
  history: { date: string; price: number }[];
  currency: string;
  currency_symbol: string;
  last_updated: string;
}

export interface OilPrice {
  name: string;
  price_usd: number;
  change_24h: number;
  unit: string;
}

export interface FuelPrice {
  name: string;
  price_local: number;
  price_usd: number;
  currency: string;
  currency_symbol: string;
  last_updated: string;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price_usd: number;
  price_local: number;
  change_24h: number;
  market_cap: number;
  market_cap_formatted: string;
  currency: string;
  currency_symbol: string;
}

export interface CryptoMarket {
  total_market_cap: number;
  btc_dominance: number;
  fear_greed_index: number;
  fear_greed_label: string;
}

const TROY_OZ_TO_GRAM = 31.1035;
const GRAM_TO_TOLA = 11.664;

// Gold history + YTD are computed from the REAL CoinGecko market chart
// for PAX Gold (tokenized gold tracking spot). The previous version
// generated a Math.random() price history, random open/high/low and a
// random daily change, and priced everything off a hardcoded $2,320
// fallback when its defunct metals API failed — all fabrication, removed.
function calcYTD(history: { date: string; price: number }[], current: number): number {
  if (history.length === 0) return 0;
  const year = new Date().getFullYear();
  const jan = history.find((h) => h.date >= `${year}-01-01`) ?? history[0];
  if (!jan.price) return 0;
  return Math.round(((current - jan.price) / jan.price) * 10000) / 100;
}

function buildRates(
  priceUsdPerOz: number,
  changePct24h: number,
  high24hUsd: number,
  low24hUsd: number,
  historyUsdPerOz: { date: string; price: number }[],
  currencyRate: number,
  currencyCode: string,
  currencySymbol: string
): GoldRates {
  const convert = (usd: number) => Math.round(usd * currencyRate * 100) / 100;
  const pricePerGramUSD = priceUsdPerOz / TROY_OZ_TO_GRAM;
  const k24 = convert(pricePerGramUSD);
  const k22 = convert(pricePerGramUSD * (22 / 24));
  const k21 = convert(pricePerGramUSD * (21 / 24));
  const k20 = convert(pricePerGramUSD * (20 / 24));
  const k18 = convert(pricePerGramUSD * (18 / 24));
  const historyConverted = historyUsdPerOz.map((h) => ({
    date: h.date,
    price: convert(h.price / TROY_OZ_TO_GRAM),
  }));
  const ytd = calcYTD(historyUsdPerOz, priceUsdPerOz);
  const zakatNisabGrams = 87.48;
  const zakatNisabValue = convert(zakatNisabGrams * pricePerGramUSD);
  const openUsd = changePct24h > -100 ? priceUsdPerOz / (1 + changePct24h / 100) : priceUsdPerOz;
  return {
    per_oz: convert(priceUsdPerOz),
    per_gram: k24,
    per_tola: Math.round(k24 * GRAM_TO_TOLA * 100) / 100,
    per_10g: Math.round(k24 * 10 * 100) / 100,
    by_karat: { k24, k22, k21, k20, k18 },
    open: convert(openUsd / TROY_OZ_TO_GRAM),
    high: convert((high24hUsd || priceUsdPerOz) / TROY_OZ_TO_GRAM),
    low: convert((low24hUsd || priceUsdPerOz) / TROY_OZ_TO_GRAM),
    change_percent: Math.round(changePct24h * 100) / 100,
    ytd_change_percent: ytd,
    zakat_nisab_grams: zakatNisabGrams,
    zakat_nisab_value: zakatNisabValue,
    history: historyConverted,
    currency: currencyCode,
    currency_symbol: currencySymbol,
    last_updated: new Date().toISOString(),
  };
}

export async function fetchGoldRates(
  currencyRate = 1,
  currencyCode = 'USD',
  currencySymbol = '$'
): Promise<GoldRates | null> {
  try {
    const [marketsRes, chartRes] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=pax-gold'),
      fetch('https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=365'),
    ]);
    if (marketsRes.status !== 'fulfilled' || !marketsRes.value.ok) return null;
    const markets = await marketsRes.value.json();
    const m = markets?.[0];
    if (!m?.current_price) return null;
    let history: { date: string; price: number }[] = [];
    if (chartRes.status === 'fulfilled' && chartRes.value.ok) {
      const chart = await chartRes.value.json();
      const byDay = new Map<string, number>();
      for (const [ts, price] of (chart?.prices ?? []) as [number, number][]) {
        byDay.set(new Date(ts).toISOString().split('T')[0], price);
      }
      history = [...byDay.entries()].map(([date, price]) => ({ date, price }));
    }
    return buildRates(
      m.current_price,
      m.price_change_percentage_24h ?? 0,
      m.high_24h ?? m.current_price,
      m.low_24h ?? m.current_price,
      history,
      currencyRate,
      currencyCode,
      currencySymbol
    );
  } catch {
    return null;
  }
}

export async function fetchOilPrices(): Promise<OilPrice[]> {
  // No free, keyless, reliable oil price feed exists. The old version
  // returned invented base prices jittered with Math.random() and
  // presented them as live — removed. The oil section stays hidden
  // until a real feed is connected.
  return [];
}

export async function fetchFuelPrices(
  currencyRate: number,
  currencyCode: string,
  countrySlug: string
): Promise<FuelPrice[]> {
  // The old version returned static invented per-country fuel prices
  // stamped with today's date as if freshly updated — removed. No free
  // fuel-price API exists; the section stays hidden until a real source
  // (e.g. OGRA postings for Pakistan) is connected.
  void currencyRate; void currencyCode; void countrySlug;
  return [];
}

export async function fetchCryptoData(
  currencyRate: number,
  currencyCode: string,
  currencySymbol: string
): Promise<{ cryptos: CryptoData[]; market: CryptoMarket } | null> {
  try {
    const [coinsRes, fngRes] = await Promise.allSettled([
      fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10'
      ),
      fetch('https://api.alternative.me/fng/?limit=1'),
    ]);
    if (coinsRes.status !== 'fulfilled' || !coinsRes.value.ok) return null;
    const data = await coinsRes.value.json();
    const cryptos: CryptoData[] = data.slice(0, 10).map((coin: { id: string; symbol: string; name: string; current_price: number; price_change_percentage_24h: number; market_cap: number }) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      price_usd: coin.current_price,
      price_local: Math.round(coin.current_price * currencyRate * 100) / 100,
      change_24h: Math.round(coin.price_change_percentage_24h * 100) / 100,
      market_cap: coin.market_cap,
      market_cap_formatted: formatMarketCap(coin.market_cap),
      currency: currencyCode,
      currency_symbol: currencySymbol,
    }));
    const totalMarketCap = data.reduce((sum: number, c: { market_cap: number }) => sum + c.market_cap, 0);
    const btcCap = data.find((c: { id: string }) => c.id === 'bitcoin')?.market_cap || 0;
    const btcDominance = Math.round((btcCap / totalMarketCap) * 100 * 10) / 10;
    // Fear & Greed is Alternative.me's real published index. The old code
    // invented it with Math.random(), and invented an entire default
    // price table when CoinGecko failed — both removed (failure = null,
    // and an unavailable index renders as an empty label the UI hides).
    let fearGreed = 0;
    let fearGreedLabel = '';
    if (fngRes.status === 'fulfilled' && fngRes.value.ok) {
      const fng = await fngRes.value.json();
      const f = fng?.data?.[0];
      if (f?.value) {
        fearGreed = Number(f.value);
        fearGreedLabel = f.value_classification ?? '';
      }
    }
    const market: CryptoMarket = {
      total_market_cap: totalMarketCap,
      btc_dominance: btcDominance,
      fear_greed_index: fearGreed,
      fear_greed_label: fearGreedLabel,
    };
    return { cryptos, market };
  } catch {
    return null;
  }
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toFixed(0)}`;
}

export function generateOilAffectParagraph(country: string): string {
  const paragraphs: Record<string, string> = {
    pakistan: 'Oil prices directly impact Pakistan\'s economy as the country imports over 80% of its petroleum needs. Rising crude prices increase the trade deficit, weaken the rupee, and raise inflation. The government frequently adjusts fuel prices, affecting transportation costs and commodity prices nationwide.',
    india: 'India imports nearly 85% of its crude oil, making it highly sensitive to global oil price fluctuations. Higher oil prices increase India\'s import bill, pressure the rupee, and contribute to inflation. Fuel taxes provide significant government revenue, but price hikes impact consumer spending and manufacturing costs.',
    'saudi-arabia': 'As the world\'s largest oil exporter, Saudi Arabia benefits from higher crude prices. Oil revenue accounts for approximately 70% of government income and 40% of GDP. Rising prices boost fiscal surplus and enable increased public spending, while lower prices pressure the budget and economic diversification efforts.',
    uae: 'The UAE\'s economy remains closely tied to hydrocarbon exports, though diversification efforts have reduced oil\'s share of GDP to about 30%. Higher oil prices support government spending and economic growth, while the country\'s refining capacity also benefits from increased crude availability.',
    turkey: 'Turkey imports nearly all its energy needs, making it vulnerable to oil price increases. Higher crude prices widen the current account deficit, weaken the lira, and drive inflation. The government subsidizes some fuel costs, straining fiscal accounts when prices rise.',
  };
  return paragraphs[country] || `Oil price changes significantly impact ${country}'s economy through fuel costs, transportation expenses, and related inflation. Higher prices strain trade balances for oil-importing nations while benefiting exporters.`;
}

// ========== CURRENCY EXCHANGE ==========

export interface CurrencyPair {
  code: string;
  name: string;
  rate: number;
  interbank_rate: number;
  open_market_rate: number;
  // Day change computed from dated snapshots of the published currency
  // dataset; null when the previous day's snapshot is unavailable —
  // the UI hides the change chip instead of showing a fabricated 0%.
  change_24h: number | null;
  flag: string;
}

export interface CurrencyHistory {
  date: string;
  rate: number;
}

const PAIR_META: Record<string, { name: string; flag: string }> = {
  EUR: { name: 'Euro', flag: 'EU' },
  GBP: { name: 'British Pound', flag: 'GB' },
  PKR: { name: 'Pakistani Rupee', flag: 'PK' },
  AED: { name: 'UAE Dirham', flag: 'AE' },
  SAR: { name: 'Saudi Riyal', flag: 'SA' },
  INR: { name: 'Indian Rupee', flag: 'IN' },
  CNY: { name: 'Chinese Yuan', flag: 'CN' },
  JPY: { name: 'Japanese Yen', flag: 'JP' },
  CAD: { name: 'Canadian Dollar', flag: 'CA' },
  AUD: { name: 'Australian Dollar', flag: 'AU' },
  CHF: { name: 'Swiss Franc', flag: 'CH' },
  KWD: { name: 'Kuwaiti Dinar', flag: 'KW' },
  QAR: { name: 'Qatari Riyal', flag: 'QA' },
  BDT: { name: 'Bangladeshi Taka', flag: 'BD' },
  TRY: { name: 'Turkish Lira', flag: 'TR' },
};

// Real exchange rates from the ExchangeRate-API open endpoint
// (open.er-api.com — free, keyless), migrated off Frankfurter in Q8:
// Frankfurter's new host (frankfurter.dev) returns only ECB currencies,
// so PKR, AED and SAR silently vanished from this table. The open
// endpoint publishes one USD-based snapshot covering every pair here;
// conversions between two non-USD currencies cross-divide through USD
// (see calculateRemittance), exactly as the homepage tickers do.
// The day change is computed from dated snapshots of the published
// currency dataset (cdn.jsdelivr.net/npm/@fawazahmed0/currency-api),
// comparing its latest date with the day before; when that dataset
// does not answer, change_24h is null and the UI hides the chip.
const OPEN_FX_URL = 'https://open.er-api.com/v6/latest/USD';
const DATED_FX_BASE = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api';

async function fetchDatedUsdFile(dateOrLatest: string): Promise<{ date?: string; usd?: Record<string, number> } | null> {
  try {
    const res = await fetch(`${DATED_FX_BASE}@${dateOrLatest}/v1/currencies/usd.json`, {
      next: { revalidate: 86400 },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCurrencyPairs(): Promise<CurrencyPair[]> {
  try {
    const res = await fetch(OPEN_FX_URL, { next: { revalidate: 3600 } } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    const rates = json?.rates as Record<string, number> | undefined;
    if (!rates) return [];

    // Previous-day reference for the change chip (same per-USD basis).
    const changeByCode: Record<string, number | null> = {};
    try {
      const latestFile = await fetchDatedUsdFile('latest');
      const latestDate = latestFile?.date;
      const latestRates = latestFile?.usd;
      if (latestDate && latestRates) {
        const prevDate = new Date(`${latestDate}T00:00:00Z`);
        prevDate.setUTCDate(prevDate.getUTCDate() - 1);
        const prevRates = (await fetchDatedUsdFile(prevDate.toISOString().split('T')[0]))?.usd;
        if (prevRates) {
          for (const code of Object.keys(PAIR_META)) {
            const cur = latestRates[code.toLowerCase()];
            const old = prevRates[code.toLowerCase()];
            changeByCode[code] = typeof cur === 'number' && typeof old === 'number' && old > 0
              ? Math.round(((cur - old) / old) * 10000) / 100
              : null;
          }
        }
      }
    } catch { /* change chips stay hidden; the rates themselves are live */ }

    return Object.entries(PAIR_META).flatMap(([code, meta]) => {
      const rate = rates[code];
      if (typeof rate !== 'number') return [];
      return [{
        code,
        name: meta.name,
        rate,
        interbank_rate: rate,
        open_market_rate: rate,
        change_24h: changeByCode[code] ?? null,
        flag: meta.flag,
      }];
    });
  } catch {
    return [];
  }
}

export async function fetchCurrencyHistory(code: string, years: number = 1): Promise<CurrencyHistory[]> {
  // Real historical rates, migrated off Frankfurter in Q8 (the
  // ExchangeRate-API open endpoint publishes only the latest snapshot,
  // no history). History is sampled from dated snapshots of the
  // published currency dataset (one immutable file per day), at ~52
  // evenly spaced points across the requested range; each point is
  // that day's real published rate. A day whose file is missing is
  // skipped — the series is never interpolated or invented.
  try {
    if (code === 'USD') return [];
    const key = code.toLowerCase();
    const totalDays = Math.round(years * 365);
    const points = 52;
    const step = Math.max(1, Math.floor(totalDays / points));
    const dates: string[] = [];
    const end = new Date();
    for (let back = totalDays; back >= 0; back -= step) {
      const d = new Date(end);
      d.setUTCDate(d.getUTCDate() - back);
      dates.push(d.toISOString().split('T')[0]);
    }
    const results = await Promise.all(dates.map(async (date) => {
      const file = await fetchDatedUsdFile(date);
      const rate = file?.usd?.[key];
      return typeof rate === 'number' ? { date: file?.date ?? date, rate } : null;
    }));
    return results
      .filter((r): r is CurrencyHistory => r !== null)
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function calculateCurrencyLoss(history: CurrencyHistory[]): { percentLost: number; yearsAgo: number } {
  if (history.length < 2) return { percentLost: 0, yearsAgo: 0 };
  const oldRate = history[0].rate;
  const newRate = history[history.length - 1].rate;
  const percentLost = Math.round(((newRate - oldRate) / oldRate) * 10000) / 100;
  const yearsAgo = Math.round(history.length / 52);
  return { percentLost, yearsAgo };
}

export function calculateRemittance(amount: number, fromCode: string, toCode: string, pairs: CurrencyPair[]): {
  convertedAmount: number;
  wiseRate: number;
  remitlyRate: number;
} {
  const fromRate = fromCode === 'USD' ? 1 : pairs.find(p => p.code === fromCode)?.rate ?? 1;
  const toRate = toCode === 'USD' ? 1 : pairs.find(p => p.code === toCode)?.rate ?? 1;
  const usdAmount = amount / fromRate;
  const baseConverted = usdAmount * toRate;
  return {
    convertedAmount: Math.round(baseConverted * 100) / 100,
    wiseRate: Math.round(baseConverted * 0.985 * 100) / 100,
    remitlyRate: Math.round(baseConverted * 0.98 * 100) / 100,
  };
}

// ========== STOCK MARKET ==========

export interface StockIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  ytdPercent: number;
  country?: string;
}

export interface StockMover {
  symbol: string;
  name: string;
  changePercent: number;
  volume: string;
}

export function fetchStockIndices(): StockIndex[] {
  // The old version returned static index values (KSE-100 etc.) jittered
  // with Math.random() as if live — removed. No free keyless PSX/global
  // index feed is connected yet, so the section stays hidden.
  return [];
}

export function fetchStockMovers(): { gainers: StockMover[]; losers: StockMover[] } {
  // Was an invented gainers/losers table — removed (see fetchStockIndices).
  return { gainers: [], losers: [] };
}

// ========== INTEREST RATES ==========

export interface InterestRate {
  country: string;
  countrySlug: string;
  rate: number;
  name: string;
  lastChange: string;
  changeDirection: 'cut' | 'hike' | 'hold';
  nextMeeting: string;
}

export interface LoanCalculation {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

export interface SavingsCalculation {
  annualReturn: number;
  monthlyReturn: number;
}

// INTEREST_RATES table removed (Batch 3b): undated static policy rates
// ("SBP 22%, next meeting Jul 2024") presented as current. Pages now show
// the World Bank real interest rate (src/lib/apis/worldbank.ts) when
// reasonably current, and no policy rate otherwise.

export function calculateLoan(principal: number, annualRate: number, years: number): LoanCalculation {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalAmount = monthlyPayment * numPayments;
  const totalInterest = totalAmount - principal;
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}

export function calculateSavings(principal: number, annualRate: number): SavingsCalculation {
  const annualReturn = principal * (annualRate / 100);
  return {
    annualReturn: Math.round(annualReturn * 100) / 100,
    monthlyReturn: Math.round((annualReturn / 12) * 100) / 100,
  };
}

export function generateInterestRateHistory(): { date: string; rate: number }[] {
  // Was a synthetic monthly series generated around the static rate —
  // removed. A real policy-rate history needs a real source (central
  // bank postings); until then the chart stays hidden.
  return [];
}

export interface Commodity {
  name: string;
  category: 'metals' | 'energy' | 'agriculture';
  price_usd: number;
  unit: string;
  change_24h: number;
  ytd_change: number;
  pakistanRelevant?: boolean;
  relevanceNote?: string;
}

export function fetchCommodities(): Commodity[] {
  // Was a fully static invented price table (gold $2,320, Brent $82.30,
  // wheat, cocoa...) with jitter — removed. Gold and crypto on this page
  // are real (CoinGecko); the broader commodities board stays hidden
  // until a real feed is connected.
  return [];
}


// ========== FINANCIAL STRESS METER ==========

export interface FinancialStressData {
  country: string;
  inflation: number;
  unemployment: number;
  debtToGdp: number;
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

// FINANCIAL_STRESS_DATA table removed (Batch 3b): static snapshot
// scores/inputs presented as current. Stress is now computed from real
// World Bank inflation & unemployment (computeStressScore in
// src/lib/apis/worldbank.ts).

export function getStressLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score < 30) return 'low';
  if (score < 60) return 'medium';
  if (score < 80) return 'high';
  return 'critical';
}

export function getStressColor(level: 'low' | 'medium' | 'high' | 'critical'): string {
  const colors = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' };
  return colors[level];
}

// ========== MISERY INDEX ==========

export interface MiseryIndex {
  country: string;
  countrySlug: string;
  inflation: number;
  unemployment: number;
  miseryIndex: number;
  rank: number;
}

// MISERY_INDEX_DATA table removed (Batch 3b): static snapshot presented
// as current. The misery index is now computed live from World Bank
// inflation + unemployment (buildMiseryIndex in src/lib/apis/worldbank.ts).

export function calculateMiseryImpact(miseryIndex: number, budget: number, inflation: number): {
  yearlyLoss: number;
  monthlyIncrease: number;
  valueOneYearAgo: number;
} {
  const yearlyLoss = Math.round(budget * (inflation / 100) * 12 * 100) / 100;
  const monthlyIncrease = Math.round(budget * (inflation / 100) * 100) / 100;
  const valueOneYearAgo = Math.round(budget / (1 + inflation / 100) * 100) / 100;
  return { yearlyLoss, monthlyIncrease, valueOneYearAgo };
}

// ========== PURCHASING POWER ==========

export interface PurchasingPowerResult {
  oneYearAgo: number;
  threeYearsAgo: number;
  fiveYearsAgo: number;
  goldGrams: number;
  bitcoinAmount: number;
  usdAmount: number;
}

export function calculatePurchasingPower(
  amount: number,
  inflationRate: number,
  currencyRate: number,
  goldPricePerGram: number,
  bitcoinPrice: number
): PurchasingPowerResult {
  const compound = (years: number) => amount / Math.pow(1 + inflationRate / 100, years);
  return {
    oneYearAgo: Math.round(compound(1) * 100) / 100,
    threeYearsAgo: Math.round(compound(3) * 100) / 100,
    fiveYearsAgo: Math.round(compound(5) * 100) / 100,
    goldGrams: Math.round((amount / currencyRate / goldPricePerGram) * 1000) / 1000,
    bitcoinAmount: Math.round((amount / currencyRate / bitcoinPrice) * 1000000) / 1000000,
    usdAmount: Math.round(amount / currencyRate * 100) / 100,
  };
}

// ========== FINANCIAL NEWS ==========

export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  url: string;
  description: string;
}

// Real financial headlines from GNews (the project's news provider).
// This replaces getDefaultFinancialNews, which returned five INVENTED
// headlines attributed to real outlets (Dawn, The News, Business
// Recorder, Express Tribune, Geo News) with '#' links and rolling fake
// timestamps — including a stale "SBP maintains policy rate at 22%"
// claim. Fabrication removed; on any failure the section simply hides.
export async function fetchFinancialNews(countrySlug: string): Promise<NewsArticle[]> {
  const key = process.env.NEXT_PUBLIC_GNEWS_KEY ?? '';
  if (!key) return [];
  try {
    const countryName = countrySlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    const params = new URLSearchParams({
      q: `${countryName} economy finance business`,
      lang: 'en',
      max: '5',
      sortby: 'publishedAt',
    });
    params.set('apikey', key);
    const res = await fetch(`https://gnews.io/api/v4/search?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.articles) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.articles.map((a: any): NewsArticle => ({
      title: a.title ?? '',
      source: a.source?.name ?? 'Unknown',
      publishedAt: a.publishedAt ?? new Date().toISOString(),
      url: a.url ?? '#',
      description: a.description ?? '',
    }));
  } catch {
    return [];
  }
}
