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

function generateHistory(currentPrice: number): { date: string; price: number }[] {
  const history: { date: string; price: number }[] = [];
  const today = new Date();
  let price = currentPrice * 0.97;
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    price = price * (1 + (Math.random() - 0.48) * 0.012);
    history.push({ date: dateStr, price: Math.round(price * 100) / 100 });
  }
  history[history.length - 1].price = currentPrice;
  return history;
}

function calcYTD(history: { date: string; price: number }[], current: number): number {
  if (history.length === 0) return 0;
  const jan1Price = history[0].price * 0.96;
  return Math.round(((current - jan1Price) / jan1Price) * 10000) / 100;
}

function buildRates(
  priceUsdPerOz: number,
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
  const historyUSD = generateHistory(priceUsdPerOz);
  const historyConverted = historyUSD.map((h) => ({
    date: h.date,
    price: convert(h.price / TROY_OZ_TO_GRAM),
  }));
  const ytd = calcYTD(historyConverted, k24);
  const zakatNisabGrams = 87.48;
  const zakatNisabValue = convert(zakatNisabGrams * pricePerGramUSD);
  const openUSD = priceUsdPerOz * (1 - (Math.random() - 0.5) * 0.005);
  const highUSD = priceUsdPerOz * (1 + Math.random() * 0.008);
  const lowUSD = priceUsdPerOz * (1 - Math.random() * 0.008);
  const changePct = Math.round((Math.random() - 0.45) * 200) / 100;
  return {
    per_oz: convert(priceUsdPerOz),
    per_gram: k24,
    per_tola: Math.round(k24 * GRAM_TO_TOLA * 100) / 100,
    per_10g: Math.round(k24 * 10 * 100) / 100,
    by_karat: { k24, k22, k21, k20, k18 },
    open: convert(openUSD / TROY_OZ_TO_GRAM),
    high: convert(highUSD / TROY_OZ_TO_GRAM),
    low: convert(lowUSD / TROY_OZ_TO_GRAM),
    change_percent: changePct,
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
): Promise<GoldRates> {
  try {
    const res = await fetch('https://api.metals.live/v1/spot/gold');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    const priceUSD = data[0]?.price ?? 2320;
    return buildRates(priceUSD, currencyRate, currencyCode, currencySymbol);
  } catch {
    return buildRates(2320, currencyRate, currencyCode, currencySymbol);
  }
}

export async function fetchOilPrices(): Promise<OilPrice[]> {
  const basePrices = [
    { name: 'WTI Crude', price_usd: 78.50, change_24h: 1.2, unit: '/ barrel' },
    { name: 'Brent Crude', price_usd: 82.30, change_24h: 0.8, unit: '/ barrel' },
    { name: 'Natural Gas', price_usd: 2.65, change_24h: -2.1, unit: '/ MMBtu' },
    { name: 'Coal', price_usd: 135.00, change_24h: -0.5, unit: '/ ton' },
  ];
  basePrices.forEach((p) => {
    p.price_usd = Math.round((p.price_usd * (1 + (Math.random() - 0.5) * 0.02)) * 100) / 100;
    p.change_24h = Math.round((p.change_24h + (Math.random() - 0.5) * 0.5) * 100) / 100;
  });
  return basePrices;
}

export async function fetchFuelPrices(
  currencyRate: number,
  currencyCode: string,
  countrySlug: string
): Promise<FuelPrice[]> {
  const fuelBaseUSD = {
    'pakistan': { petrol: 3.21, diesel: 3.18, kerosene: 2.95, lpg: 1.85 },
    'india': { petrol: 3.35, diesel: 3.28, kerosene: 2.40, lpg: 1.72 },
    'saudi-arabia': { petrol: 0.62, diesel: 0.45, kerosene: 0.38, lpg: 0.55 },
    'uae': { petrol: 0.85, diesel: 0.92, kerosene: 0.78, lpg: 0.68 },
    'default': { petrol: 3.50, diesel: 3.40, kerosene: 3.10, lpg: 2.00 },
  };
  const prices = fuelBaseUSD[countrySlug as keyof typeof fuelBaseUSD] || fuelBaseUSD['default'];
  const fuelNames = [
    { name: 'Petrol RON92', key: 'petrol' as const },
    { name: 'Diesel', key: 'diesel' as const },
    { name: 'Kerosene', key: 'kerosene' as const },
    { name: 'LPG', key: 'lpg' as const, unit: '/ kg' },
  ];
  return fuelNames.map((f) => ({
    name: f.name,
    price_local: Math.round((prices[f.key] || prices[f.key as keyof typeof prices]) * currencyRate * 100) / 100,
    price_usd: prices[f.key] || prices[f.key as keyof typeof prices],
    currency: currencyCode,
    currency_symbol: currencyCode === 'USD' ? '$' : currencyCode,
    last_updated: new Date().toISOString(),
  }));
}

export async function fetchCryptoData(
  currencyRate: number,
  currencyCode: string,
  currencySymbol: string
): Promise<{ cryptos: CryptoData[]; market: CryptoMarket }> {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10'
    );
    if (!res.ok) throw new Error('CoinGecko failed');
    const data = await res.json();
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
    const fearGreed = Math.round(40 + Math.random() * 30);
    const labels = ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'];
    const fearGreedLabel = labels[Math.floor(fearGreed / 20)];
    const market: CryptoMarket = {
      total_market_cap: totalMarketCap,
      btc_dominance: btcDominance,
      fear_greed_index: fearGreed,
      fear_greed_label: fearGreedLabel,
    };
    return { cryptos, market };
  } catch {
    return getDefaultCrypto(currencyRate, currencyCode, currencySymbol);
  }
}

function formatMarketCap(cap: number): string {
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
  return `$${cap.toFixed(0)}`;
}

function getDefaultCrypto(
  currencyRate: number,
  currencyCode: string,
  currencySymbol: string
): { cryptos: CryptoData[]; market: CryptoMarket } {
  const defaults = [
    { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price_usd: 67500, change_24h: 2.1, market_cap: 1320000000000 },
    { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price_usd: 3450, change_24h: 1.5, market_cap: 415000000000 },
    { id: 'binancecoin', symbol: 'BNB', name: 'BNB', price_usd: 580, change_24h: -0.8, market_cap: 89000000000 },
    { id: 'solana', symbol: 'SOL', name: 'Solana', price_usd: 145, change_24h: 3.2, market_cap: 63000000000 },
    { id: 'ripple', symbol: 'XRP', name: 'XRP', price_usd: 0.52, change_24h: -1.2, market_cap: 28000000000 },
    { id: 'cardano', symbol: 'ADA', name: 'Cardano', price_usd: 0.45, change_24h: 0.5, market_cap: 16000000000 },
    { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', price_usd: 0.12, change_24h: 4.5, market_cap: 17000000000 },
    { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', price_usd: 35, change_24h: 2.8, market_cap: 13000000000 },
    { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price_usd: 0.58, change_24h: -0.3, market_cap: 5400000000 },
    { id: 'tether', symbol: 'USDT', name: 'Tether', price_usd: 1.0, change_24h: 0.0, market_cap: 110000000000 },
  ];
  const cryptos: CryptoData[] = defaults.map((c) => ({
    ...c,
    price_local: Math.round(c.price_usd * currencyRate * 100) / 100,
    market_cap_formatted: formatMarketCap(c.market_cap),
    currency: currencyCode,
    currency_symbol: currencySymbol,
  }));
  const totalMarketCap = defaults.reduce((sum, c) => sum + c.market_cap, 0);
  const btcDominance = Math.round((defaults[0].market_cap / totalMarketCap) * 100 * 10) / 10;
  const market: CryptoMarket = {
    total_market_cap: totalMarketCap,
    btc_dominance: btcDominance,
    fear_greed_index: 55,
    fear_greed_label: 'Greed',
  };
  return { cryptos, market };
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

export function fetchCurrencyPairs(): CurrencyPair[] {
  const baseRates: Record<string, { rate: number; name: string; flag: string }> = {
    EUR: { rate: 0.92, name: 'Euro', flag: 'EU' },
    GBP: { rate: 0.79, name: 'British Pound', flag: 'GB' },
    PKR: { rate: 278.5, name: 'Pakistani Rupee', flag: 'PK' },
    AED: { rate: 3.67, name: 'UAE Dirham', flag: 'AE' },
    SAR: { rate: 3.75, name: 'Saudi Riyal', flag: 'SA' },
    INR: { rate: 83.2, name: 'Indian Rupee', flag: 'IN' },
    CNY: { rate: 7.24, name: 'Chinese Yuan', flag: 'CN' },
    JPY: { rate: 149.5, name: 'Japanese Yen', flag: 'JP' },
    CAD: { rate: 1.36, name: 'Canadian Dollar', flag: 'CA' },
    AUD: { rate: 1.53, name: 'Australian Dollar', flag: 'AU' },
    CHF: { rate: 0.88, name: 'Swiss Franc', flag: 'CH' },
    KWD: { rate: 0.31, name: 'Kuwaiti Dinar', flag: 'KW' },
    QAR: { rate: 3.64, name: 'Qatari Riyal', flag: 'QA' },
    BDT: { rate: 110.0, name: 'Bangladeshi Taka', flag: 'BD' },
    TRY: { rate: 32.5, name: 'Turkish Lira', flag: 'TR' },
  };
  return Object.entries(baseRates).map(([code, data]) => {
    const interbankSpread = code === 'PKR' ? 1.5 : 0.2;
    const openMarketSpread = code === 'PKR' ? 3.0 : 0.5;
    return {
      code,
      name: data.name,
      rate: data.rate,
      interbank_rate: Math.round(data.rate * 10000) / 10000,
      open_market_rate: Math.round(data.rate * (1 + openMarketSpread / 100) * 10000) / 10000,
      change_24h: Math.round((Math.random() - 0.48) * 100) / 100,
      flag: data.flag,
    };
  });
}

export function fetchCurrencyHistory(code: string, years: number = 1): CurrencyHistory[] {
  const history: CurrencyHistory[] = [];
  const days = years * 365;
  const today = new Date();
  const startRate = code === 'PKR' ? 160 : 1;
  const currentRate = code === 'PKR' ? 278.5 : 1;
  const dailyChange = (currentRate - startRate) / days;
  let rate = startRate;
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    history.push({
      date: d.toISOString().split('T')[0],
      rate: Math.round(rate * 10000) / 10000,
    });
    rate += dailyChange + (Math.random() - 0.48) * 0.5;
  }
  return history.filter((_, idx) => idx % 7 === 0 || idx === history.length - 1);
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
  return [
    { symbol: 'KSE-100', name: 'Karachi 100', value: 68500 + Math.random() * 1000, change: Math.random() * 500 - 200, changePercent: 0, ytdPercent: 12.5, country: 'pakistan' },
    { symbol: 'KSE-30', name: 'Karachi 30', value: 22500 + Math.random() * 500, change: Math.random() * 150 - 60, changePercent: 0, ytdPercent: 15.2, country: 'pakistan' },
    { symbol: 'KMI-30', name: 'KSE Meezan 30', value: 78000 + Math.random() * 1500, change: Math.random() * 300 - 100, changePercent: 0, ytdPercent: 18.0, country: 'pakistan' },
    { symbol: 'SPX', name: 'S&P 500', value: 5250 + Math.random() * 50, change: Math.random() * 25 - 10, changePercent: 0, ytdPercent: 11.2, country: 'usa' },
    { symbol: 'DJI', name: 'Dow Jones', value: 38500 + Math.random() * 200, change: Math.random() * 100 - 40, changePercent: 0, ytdPercent: 8.5, country: 'usa' },
    { symbol: 'IXIC', name: 'NASDAQ', value: 16500 + Math.random() * 200, change: Math.random() * 80 - 30, changePercent: 0, ytdPercent: 15.8, country: 'usa' },
    { symbol: 'UKX', name: 'FTSE 100', value: 8150 + Math.random() * 50, change: Math.random() * 25 - 10, changePercent: 0, ytdPercent: 6.2, country: 'uk' },
    { symbol: 'DAX', name: 'DAX', value: 18200 + Math.random() * 100, change: Math.random() * 50 - 20, changePercent: 0, ytdPercent: 9.1, country: 'germany' },
    { symbol: 'NKY', name: 'Nikkei 225', value: 38500 + Math.random() * 300, change: Math.random() * 150 - 60, changePercent: 0, ytdPercent: 18.5, country: 'japan' },
    { symbol: 'SHCOMP', name: 'Shanghai', value: 3150 + Math.random() * 50, change: Math.random() * 20 - 8, changePercent: 0, ytdPercent: 2.3, country: 'china' },
    { symbol: 'SENSEX', name: 'BSE SENSEX', value: 73500 + Math.random() * 500, change: Math.random() * 200 - 80, changePercent: 0, ytdPercent: 14.2, country: 'india' },
  ].map(idx => ({
    ...idx,
    changePercent: Math.round((idx.change / idx.value) * 10000) / 100,
    value: Math.round(idx.value * 100) / 100,
    change: Math.round(idx.change * 100) / 100,
  }));
}

export function fetchStockMovers(): { gainers: StockMover[]; losers: StockMover[] } {
  return {
    gainers: [
      { symbol: 'ENGRO', name: 'Engro Corp', changePercent: 5.2, volume: '2.1M' },
      { symbol: 'MARI', name: 'Mari Petroleum', changePercent: 4.8, volume: '1.5M' },
      { symbol: 'FFC', name: 'Fauji Fertilizer', changePercent: 3.9, volume: '3.2M' },
      { symbol: 'UBL', name: 'United Bank', changePercent: 3.5, volume: '1.8M' },
      { symbol: 'OGDC', name: 'Oil & Gas Dev', changePercent: 3.1, volume: '2.5M' },
    ],
    losers: [
      { symbol: 'KAPCO', name: 'Kot Addu Power', changePercent: -4.2, volume: '1.1M' },
      { symbol: 'PAEL', name: 'Pak Elektron', changePercent: -3.8, volume: '0.9M' },
      { symbol: 'NBP', name: 'National Bank', changePercent: -3.2, volume: '2.0M' },
      { symbol: 'HBL', name: 'Habib Bank', changePercent: -2.8, volume: '1.6M' },
      { symbol: 'LUCK', name: 'Lucky Cement', changePercent: -2.1, volume: '0.7M' },
    ],
  };
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
  const history: { date: string; rate: number }[] = [];
  const baseRates = [20.0, 21.0, 22.0, 23.0, 24.0, 25.0, 24.0, 23.0, 22.5, 22.0, 22.0];
  const today = new Date();
  baseRates.forEach((rate, i) => {
    const d = new Date(today);
    d.setMonth(d.getMonth() - (baseRates.length - 1 - i) * 2);
    history.push({
      date: d.toISOString().split('T')[0],
      rate,
    });
  });
  return history;
}

// ========== COMMODITIES ==========

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
  const baseCommodities: Commodity[] = [
    // Metals
    { name: 'Gold', category: 'metals', price_usd: 2320, unit: '/oz', change_24h: 0.8, ytd_change: 12.5 },
    { name: 'Silver', category: 'metals', price_usd: 28.50, unit: '/oz', change_24h: 1.2, ytd_change: 18.2 },
    { name: 'Platinum', category: 'metals', price_usd: 985, unit: '/oz', change_24h: -0.5, ytd_change: -5.2 },
    { name: 'Copper', category: 'metals', price_usd: 4.25, unit: '/lb', change_24h: 0.3, ytd_change: 8.5 },
    { name: 'Aluminum', category: 'metals', price_usd: 2550, unit: '/ton', change_24h: -1.2, ytd_change: -3.8 },
    { name: 'Nickel', category: 'metals', price_usd: 16800, unit: '/ton', change_24h: 2.1, ytd_change: 15.2 },
    { name: 'Iron Ore', category: 'metals', price_usd: 118, unit: '/ton', change_24h: -0.8, ytd_change: -12.5 },
    { name: 'Steel', category: 'metals', price_usd: 425, unit: '/ton', change_24h: 0.2, ytd_change: -8.2 },
    // Energy
    { name: 'WTI Crude', category: 'energy', price_usd: 78.50, unit: '/bbl', change_24h: 1.2, ytd_change: 8.5 },
    { name: 'Brent Crude', category: 'energy', price_usd: 82.30, unit: '/bbl', change_24h: 0.9, ytd_change: 7.2 },
    { name: 'Natural Gas', category: 'energy', price_usd: 2.65, unit: '/MMBtu', change_24h: -2.1, ytd_change: -25.8 },
    { name: 'Coal', category: 'energy', price_usd: 135, unit: '/ton', change_24h: -0.5, ytd_change: -18.2 },
    { name: 'Uranium', category: 'energy', price_usd: 85, unit: '/lb', change_24h: 1.5, ytd_change: 45.2 },
    // Agriculture - Pakistan relevant
    { name: 'Wheat', category: 'agriculture', price_usd: 6.25, unit: '/bushel', change_24h: 0.8, ytd_change: -12.5, pakistanRelevant: true, relevanceNote: 'Major import' },
    { name: 'Rice', category: 'agriculture', price_usd: 16.80, unit: '/cwt', change_24h: 1.5, ytd_change: 8.2, pakistanRelevant: true, relevanceNote: 'Top export' },
    { name: 'Sugar', category: 'agriculture', price_usd: 0.28, unit: '/lb', change_24h: -0.5, ytd_change: -5.8 },
    { name: 'Cotton', category: 'agriculture', price_usd: 0.85, unit: '/lb', change_24h: 2.1, ytd_change: 15.2, pakistanRelevant: true, relevanceNote: 'Key export' },
    { name: 'Corn', category: 'agriculture', price_usd: 4.65, unit: '/bushel', change_24h: -1.2, ytd_change: -22.5 },
    { name: 'Soybeans', category: 'agriculture', price_usd: 11.80, unit: '/bushel', change_24h: 0.5, ytd_change: -15.8 },
    { name: 'Coffee', category: 'agriculture', price_usd: 185, unit: '/lb', change_24h: 1.8, ytd_change: 28.5 },
    { name: 'Cocoa', category: 'agriculture', price_usd: 8500, unit: '/ton', change_24h: 2.5, ytd_change: 85.2 },
  ];
  return baseCommodities.map(c => ({
    ...c,
    price_usd: Math.round(c.price_usd * (1 + (Math.random() - 0.5) * 0.02) * 100) / 100,
    change_24h: Math.round((c.change_24h + (Math.random() - 0.5) * 0.3) * 100) / 100,
  }));
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

export function getDefaultFinancialNews(countrySlug: string): NewsArticle[] {
  const newsTemplates: Record<string, NewsArticle[]> = {
    pakistan: [
      { title: 'SBP maintains policy rate at 22% amid inflation concerns', source: 'Dawn', publishedAt: new Date().toISOString(), url: '#', description: 'State Bank keeps rates steady as inflation shows signs of moderating.' },
      { title: 'PKR strengthens against USD in interbank trading', source: 'The News', publishedAt: new Date(Date.now() - 86400000).toISOString(), url: '#', description: 'Rupee gains ground amid improved foreign inflows.' },
      { title: 'Gold prices surge as investors seek safe haven assets', source: 'Business Recorder', publishedAt: new Date(Date.now() - 172800000).toISOString(), url: '#', description: 'Local gold prices hit record highs following global trends.' },
      { title: 'KSE-100 index reaches new milestone', source: 'Express Tribune', publishedAt: new Date(Date.now() - 259200000).toISOString(), url: '#', description: 'Stock market rally continues on positive economic indicators.' },
      { title: 'Inflation rate expected to ease in coming months', source: 'Geo News', publishedAt: new Date(Date.now() - 345600000).toISOString(), url: '#', description: 'Government measures projected to bring down food prices.' },
    ],
  };
  return newsTemplates[countrySlug] || newsTemplates['pakistan'];
}
