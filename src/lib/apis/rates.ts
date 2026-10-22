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
  change_24h: number;
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

// Real exchange rates from Frankfurter (European Central Bank data,
// free, no key). The old version returned a static rate table with a
// Math.random() daily change and a modeled "open market" spread
// presented as real — removed. Interbank and open-market are the same
// published rate until a real open-market feed exists.
export async function fetchCurrencyPairs(): Promise<CurrencyPair[]> {
  try {
    const codes = Object.keys(PAIR_META).join(',');
    const end = new Date();
    const startD = new Date(end);
    startD.setDate(startD.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const res = await fetch(
      `https://api.frankfurter.app/${fmt(startD)}..${fmt(end)}?from=USD&to=${codes}`
    );
    if (!res.ok) return [];
    const json = await res.json();
    const days = Object.keys(json?.rates ?? {}).sort();
    if (!days.length) return [];
    const latest = json.rates[days[days.length - 1]];
    const prev = days.length > 1 ? json.rates[days[days.length - 2]] : null;
    return Object.entries(PAIR_META).flatMap(([code, meta]) => {
      const rate = latest?.[code];
      if (typeof rate !== 'number') return [];
      const prevRate = prev?.[code];
      const change = typeof prevRate === 'number' && prevRate > 0
        ? Math.round(((rate - prevRate) / prevRate) * 10000) / 100
        : 0;
      return [{
        code,
        name: meta.name,
        rate,
        interbank_rate: rate,
        open_market_rate: rate,
        change_24h: change,
        flag: meta.flag,
      }];
    });
  } catch {
    return [];
  }
}

export async function fetchCurrencyHistory(code: string, years: number = 1): Promise<CurrencyHistory[]> {
  // Real historical rates from Frankfurter (ECB). The old version
  // generated a Math.random() walk and presented it as the currency's
  // actual history — removed.
  try {
    if (code === 'USD') return [];
    const end = new Date();
    const startD = new Date(end);
    startD.setDate(startD.getDate() - Math.round(years * 365));
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    const res = await fetch(
      `https://api.frankfurter.app/${fmt(startD)}..${fmt(end)}?from=USD&to=${code}`
    );
    if (!res.ok) return [];
    const json = await res.json();
    const days = Object.keys(json?.rates ?? {}).sort();
    return days.flatMap((date) => {
      const rate = json.rates[date]?.[code];
      return typeof rate === 'number' ? [{ date, rate }] : [];
    });
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

export const INTEREST_RATES: Record<string, InterestRate> = {
  pakistan: { country: 'Pakistan', countrySlug: 'pakistan', rate: 22.0, name: 'SBP Policy Rate', lastChange: 'Jun 2024', changeDirection: 'hold', nextMeeting: 'Jul 2024' },
  india: { country: 'India', countrySlug: 'india', rate: 6.5, name: 'RBI Repo Rate', lastChange: 'Feb 2024', changeDirection: 'hold', nextMeeting: 'Jun 2024' },
  usa: { country: 'USA', countrySlug: 'usa', rate: 5.5, name: 'Fed Funds Rate', lastChange: 'Jul 2023', changeDirection: 'hold', nextMeeting: 'Jun 2024' },
  uk: { country: 'UK', countrySlug: 'uk', rate: 5.25, name: 'Bank Rate', lastChange: 'Aug 2023', changeDirection: 'hold', nextMeeting: 'Jun 2024' },
  'saudi-arabia': { country: 'Saudi Arabia', countrySlug: 'saudi-arabia', rate: 5.5, name: 'SAMA Repo Rate', lastChange: 'Jul 2023', changeDirection: 'hold', nextMeeting: 'N/A' },
  uae: { country: 'UAE', countrySlug: 'uae', rate: 5.15, name: 'CBUAE Base Rate', lastChange: 'Mar 2024', changeDirection: 'hold', nextMeeting: 'N/A' },
  turkey: { country: 'Turkey', countrySlug: 'turkey', rate: 50.0, name: 'CBRT Policy Rate', lastChange: 'May 2024', changeDirection: 'hike', nextMeeting: 'Jun 2024' },
  japan: { country: 'Japan', countrySlug: 'japan', rate: 0.1, name: 'BOJ Policy Rate', lastChange: 'Mar 2024', changeDirection: 'hike', nextMeeting: 'Jun 2024' },
  china: { country: 'China', countrySlug: 'china', rate: 3.45, name: 'PBOC 1-Yr LPR', lastChange: 'Aug 2023', changeDirection: 'cut', nextMeeting: 'N/A' },
};

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

export const FINANCIAL_STRESS_DATA: Record<string, FinancialStressData> = {
  pakistan: { country: 'Pakistan', inflation: 28.3, unemployment: 8.5, debtToGdp: 72.1, score: 72, level: 'high' },
  india: { country: 'India', inflation: 5.1, unemployment: 5.4, debtToGdp: 58.2, score: 35, level: 'medium' },
  bangladesh: { country: 'Bangladesh', inflation: 9.8, unemployment: 5.2, debtToGdp: 42.5, score: 42, level: 'medium' },
  uae: { country: 'UAE', inflation: 2.5, unemployment: 2.8, debtToGdp: 32.1, score: 18, level: 'low' },
  turkey: { country: 'Turkey', inflation: 68.5, unemployment: 9.2, debtToGdp: 35.5, score: 85, level: 'critical' },
  germany: { country: 'Germany', inflation: 2.8, unemployment: 5.8, debtToGdp: 62.5, score: 32, level: 'medium' },
  usa: { country: 'USA', inflation: 3.4, unemployment: 3.8, debtToGdp: 122.1, score: 55, level: 'medium' },
  uk: { country: 'UK', inflation: 4.2, unemployment: 4.2, debtToGdp: 98.5, score: 48, level: 'medium' },
  japan: { country: 'Japan', inflation: 2.5, unemployment: 2.6, debtToGdp: 264.0, score: 58, level: 'medium' },
  china: { country: 'China', inflation: 0.3, unemployment: 5.1, debtToGdp: 82.5, score: 38, level: 'medium' },
};

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

export const MISERY_INDEX_DATA: MiseryIndex[] = [
  { country: 'Turkey', countrySlug: 'turkey', inflation: 68.5, unemployment: 9.2, miseryIndex: 77.7, rank: 1 },
  { country: 'Pakistan', countrySlug: 'pakistan', inflation: 28.3, unemployment: 8.5, miseryIndex: 36.8, rank: 2 },
  { country: 'Bangladesh', countrySlug: 'bangladesh', inflation: 9.8, unemployment: 5.2, miseryIndex: 15.0, rank: 3 },
  { country: 'UK', countrySlug: 'uk', inflation: 4.2, unemployment: 4.2, miseryIndex: 8.4, rank: 4 },
  { country: 'India', countrySlug: 'india', inflation: 5.1, unemployment: 5.4, miseryIndex: 10.5, rank: 5 },
  { country: 'USA', countrySlug: 'usa', inflation: 3.4, unemployment: 3.8, miseryIndex: 7.2, rank: 6 },
  { country: 'Germany', countrySlug: 'germany', inflation: 2.8, unemployment: 5.8, miseryIndex: 8.6, rank: 7 },
  { country: 'UAE', countrySlug: 'uae', inflation: 2.5, unemployment: 2.8, miseryIndex: 5.3, rank: 8 },
  { country: 'Japan', countrySlug: 'japan', inflation: 2.5, unemployment: 2.6, miseryIndex: 5.1, rank: 9 },
  { country: 'China', countrySlug: 'china', inflation: 0.3, unemployment: 5.1, miseryIndex: 5.4, rank: 10 },
].sort((a, b) => b.miseryIndex - a.miseryIndex);

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
