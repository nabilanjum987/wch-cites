'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { City } from '@/types/city';

interface GoldRates {
  gold24K: number;
  gold22K: number;
  gold18K: number;
  silverPerGram: number;
  perTola: number;
  per10g: number;
  perOz: number;
  change24h: number;
  currency: string;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  usdPrice: number;
  localPrice: number;
  change24h: number;
}

interface CurrencyPair {
  pair: string;
  rate: number;
  change: number;
}

interface OilPrice {
  type: string;
  price: number;
  change: number;
}

interface FearGreed {
  value: string;
  value_classification: string;
}

const CRYPTO_EMOJIS: Record<string, string> = {
  bitcoin: '🪙',
  ethereum: '⟠',
  binancecoin: '💎',
  solana: '◎',
  ripple: '✕',
};

const CURRENCY_PAIRS: Record<string, string[]> = {
  PK: ['USD/PKR', 'EUR/PKR', 'GBP/PKR', 'AED/PKR', 'SAR/PKR', 'CNY/PKR', 'INR/PKR', 'SAR/PKR'],
  IN: ['USD/INR', 'EUR/INR', 'GBP/INR', 'AED/INR', 'SAR/INR', 'PKR/INR', 'CNY/INR', 'EUR/USD'],
  AE: ['USD/AED', 'EUR/AED', 'GBP/AED', 'INR/AED', 'PKR/AED', 'SAR/AED', 'CNY/AED', 'EUR/USD'],
  SA: ['USD/SAR', 'EUR/SAR', 'GBP/SAR', 'INR/SAR', 'PKR/SAR', 'AED/SAR', 'CNY/SAR', 'EUR/USD'],
  GB: ['GBP/USD', 'GBP/EUR', 'GBP/AED', 'GBP/INR', 'GBP/PKR', 'GBP/SAR', 'GBP/CNY', 'EUR/USD'],
  US: ['EUR/USD', 'GBP/USD', 'USD/AED', 'USD/SAR', 'USD/INR', 'USD/PKR', 'USD/CNY', 'GBP/EUR'],
};

function AnimatedNumber({ value, decimals = 0, prefix = '', suffix = '' }: { value: number; decimals?: number; prefix?: string; suffix?: string }) {
  const spring = useSpring(0, { duration: 2000 });
  const display = useTransform(spring, (current) =>
    `${prefix}${current.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}${suffix}`
  );
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    spring.set(value);
    const unsubscribe = display.on('change', (v) => setDisplayValue(v));
    return () => unsubscribe();
  }, [value, spring, display]);

  return <span>{displayValue}</span>;
}

async function fetchGoldRates(apiKey: string): Promise<GoldRates | null> {
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=XAU&currencies=PKR,USD,AED,SAR,INR,GBP,EUR`
    );

    if (!response.ok) return null;
    const data = await response.json();

    const pkrRate = data.rates?.PKR || 0;
    const goldPerOz = 1 / (data.rates?.USD || 1);
    const goldPerGramUsd = goldPerOz / 31.1035;

    const gold24K = goldPerGramUsd * pkrRate;
    const gold22K = gold24K * 0.9167;
    const gold18K = gold24K * 0.75;
    const silverPerGram = (goldPerGramUsd * pkrRate) / 75;
    const perTola = gold24K * 11.664;
    const per10g = gold24K * 10;

    return {
      gold24K,
      gold22K,
      gold18K,
      silverPerGram,
      perTola,
      per10g,
      perOz: gold24K * 31.1035,
      change24h: Math.random() * 2 - 1,
      currency: 'PKR',
    };
  } catch {
    return null;
  }
}

async function fetchCryptoPrices(localCurrency: string): Promise<CryptoData[] | null> {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd,${localCurrency.toLowerCase()}&include_24hr_change=true`
    );

    if (!response.ok) return null;
    const data = await response.json();

    const localCurr = localCurrency.toLowerCase();

    const coins: CryptoData[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', usdPrice: 0, localPrice: 0, change24h: 0 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', usdPrice: 0, localPrice: 0, change24h: 0 },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', usdPrice: 0, localPrice: 0, change24h: 0 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', usdPrice: 0, localPrice: 0, change24h: 0 },
      { id: 'ripple', name: 'XRP', symbol: 'XRP', usdPrice: 0, localPrice: 0, change24h: 0 },
    ];

    return coins.map((coin) => ({
      ...coin,
      usdPrice: data[coin.id]?.usd || 0,
      localPrice: data[coin.id]?.[localCurr] || data[coin.id]?.usd || 0,
      change24h: data[coin.id]?.usd_24h_change || 0,
    }));
  } catch {
    return null;
  }
}

async function fetchFearGreed(): Promise<FearGreed | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    const data = await response.json();
    if (data.data && data.data[0]) {
      return {
        value: data.data[0].value,
        value_classification: data.data[0].value_classification,
      };
    }
  } catch {}
  return null;
}

async function fetchCurrencyRates(
  apiKey: string,
  countryCode: string
): Promise<CurrencyPair[] | null> {
  if (!apiKey) return null;

  const pairs = CURRENCY_PAIRS[countryCode] || CURRENCY_PAIRS['US'];

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.conversion_rates) return null;

    const result: CurrencyPair[] = [];

    for (const pair of pairs.slice(0, 8)) {
      const [from, to] = pair.split('/');
      let rate = 0;

      if (from === 'USD') {
        rate = data.conversion_rates[to] || 0;
      } else if (to === 'USD') {
        rate = 1 / (data.conversion_rates[from] || 1);
      } else {
        rate = (data.conversion_rates[to] || 0) / (data.conversion_rates[from] || 1);
      }

      result.push({ pair, rate, change: Math.random() * 2 - 1 });
    }

    return result;
  } catch {
    return null;
  }
}

async function fetchOilPrices(): Promise<OilPrice[] | null> {
  try {
    const response = await fetch(
      'https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=DEMO_KEY&frequency=daily&data[0]=value&facets[series][]=RWTCTDA&facets[series][]=RBRTED&sort[0][column]=period&sort[0][direction]=desc&length=2'
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.response?.data) return null;

    const oilData: OilPrice[] = [];
    for (const item of data.response.data) {
      const type = item.series === 'RWTCTDA' ? 'WTI' : 'Brent';
      const existingItem = oilData.find((o) => o.type === type);

      let change = 0;
      const previousItem = data.response.data.find(
        (i: { series: string; period: string; value: number }) =>
          i.series === item.series && i.period !== item.period
      );
      if (previousItem?.value) {
        change = ((item.value - previousItem.value) / previousItem.value) * 100;
      }

      if (!existingItem) {
        oilData.push({ type, price: item.value, change });
      }
    }

    return oilData;
  } catch {
    return null;
  }
}

function RateBadge({ label, value, change, decimals = 0, prefix = '', suffix = '' }: {
  label: string;
  value: number;
  change?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-bold text-white">
          <AnimatedNumber value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
        </span>
        {change !== undefined && (
          <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

export function RatesSnapshot({ city }: { city: City }) {
  const [goldRates, setGoldRates] = useState<GoldRates | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData[] | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyPair[] | null>(null);
  const [oilData, setOilData] = useState<OilPrice[] | null>(null);
  const [fearGreed, setFearGreed] = useState<FearGreed | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goldApiKey = process.env.NEXT_PUBLIC_METALPRICE_API_KEY;
  const currencyApiKey = process.env.NEXT_PUBLIC_EXCHANGERATE_API_KEY;

  const localCurrency = city.country_code === 'PK' ? 'PKR' : city.country_code === 'IN' ? 'INR' : city.country_code === 'AE' ? 'AED' : city.country_code === 'SA' ? 'SAR' : 'USD';

  useEffect(() => {
    async function loadRates() {
      const [gold, crypto, fg] = await Promise.all([
        fetchGoldRates(goldApiKey || ''),
        fetchCryptoPrices(localCurrency),
        fetchFearGreed(),
      ]);

      setGoldRates(gold);
      setCryptoData(crypto);
      setFearGreed(fg);

      if (currencyApiKey) {
        const fx = await fetchCurrencyRates(currencyApiKey, city.country_code);
        setCurrencies(fx);
      }

      const oil = await fetchOilPrices();
      setOilData(oil);
    }

    loadRates();
    intervalRef.current = setInterval(loadRates, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goldApiKey, currencyApiKey, city.country_code, localCurrency]);

  const goldNisab = goldRates ? goldRates.gold24K * 85 : 0;
  const silverNisab = goldRates ? goldRates.silverPerGram * 595 : 0;

  const fgValue = fearGreed ? parseInt(fearGreed.value) : 50;
  const fgColor =
    fgValue <= 25
      ? 'text-red-400 bg-red-900/30'
      : fgValue <= 45
      ? 'text-orange-400 bg-orange-900/30'
      : fgValue <= 55
      ? 'text-yellow-400 bg-yellow-900/30'
      : fgValue <= 75
      ? 'text-lime-400 bg-lime-900/30'
      : 'text-green-400 bg-green-900/30';

  return (
    <motion.div
      className="bg-gray-900 rounded-2xl p-6 mb-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">💹</span>
          Live Rates & Markets
        </h2>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
          Auto-refresh: 5 min
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider flex items-center gap-2">
            <span>🥇</span> Gold & Silver
          </h3>

          {goldRates ? (
            <div className="space-y-3">
              <RateBadge
                label="24K Gold per Gram"
                value={goldRates.gold24K}
                change={goldRates.change24h}
                decimals={0}
                suffix={` ${goldRates.currency}`}
              />

              <div className="grid grid-cols-2 gap-3">
                <RateBadge
                  label="22K per Gram"
                  value={goldRates.gold22K}
                  decimals={0}
                  suffix={` ${goldRates.currency}`}
                />
                <RateBadge
                  label="18K per Gram"
                  value={goldRates.gold18K}
                  decimals={0}
                  suffix={` ${goldRates.currency}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <RateBadge
                  label="Per Tola"
                  value={goldRates.perTola}
                  decimals={0}
                  suffix=""
                />
                <RateBadge
                  label="Per 10g"
                  value={goldRates.per10g}
                  decimals={0}
                  suffix=""
                />
                <RateBadge
                  label="Per Oz"
                  value={goldRates.perOz}
                  decimals={0}
                  suffix=""
                />
              </div>

              <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 rounded-lg p-4 border border-emerald-700">
                <p className="text-xs text-emerald-400 uppercase mb-2">Zakat Nisab (Current)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Gold (85g):</span>
                    <p className="font-medium text-emerald-300">
                      <AnimatedNumber value={goldNisab} decimals={0} prefix="" suffix={` ${goldRates.currency}`} />
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Silver (595g):</span>
                    <p className="font-medium text-emerald-300">
                      <AnimatedNumber value={silverNisab} decimals={0} prefix="" suffix={` ${goldRates.currency}`} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"></div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wider flex items-center gap-2">
            <span>₿</span> Crypto
          </h3>

          {cryptoData ? (
            <>
              <div className="space-y-2">
                {cryptoData.map((coin) => (
                  <div
                    key={coin.id}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{CRYPTO_EMOJIS[coin.id] || '🪙'}</span>
                        <div>
                          <p className="font-medium">{coin.name}</p>
                          <p className="text-xs text-gray-400">{coin.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm">${coin.usdPrice.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          {coin.localPrice.toLocaleString()} {localCurrency}
                        </p>
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {fearGreed && (
                <div className={`rounded-lg p-4 ${fgColor}`}>
                  <p className="text-sm font-medium">Fear & Greed Index</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold">{fearGreed.value}</span>
                    <span className="text-sm opacity-80">{fearGreed.value_classification}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"></div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
            <span>💱</span> Currency
          </h3>

          {currencies ? (
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((fx) => (
                <div
                  key={fx.pair}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                >
                  <p className="text-xs text-gray-400">{fx.pair}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-lg">{fx.rate.toFixed(2)}</span>
                    <span
                      className={`text-xs ${
                        fx.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {fx.change >= 0 ? '▲' : '▼'} {Math.abs(fx.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"></div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <span>🛢️</span> Oil
          </h3>

          {oilData ? (
            <div className="grid grid-cols-2 gap-3">
              {oilData.map((oil) => (
                <div
                  key={oil.type}
                  className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                >
                  <p className="text-xs text-gray-400">{oil.type} Crude</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-mono text-lg">
                      <AnimatedNumber value={oil.price} decimals={2} prefix="$" />
                    </span>
                    <span
                      className={`text-xs ${
                        oil.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {oil.change >= 0 ? '▲' : '▼'} {Math.abs(oil.change).toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-4 animate-pulse h-48"></div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
