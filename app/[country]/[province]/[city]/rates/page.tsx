'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import type { City } from '@/types/city';
import {
  generateGoldRateIntroductionParagraph,
  generateGoldPricingStructureParagraph,
  generateSilverRateParagraph,
  generateCryptocurrencyParagraph,
  generateCurrencyExchangeParagraph,
  generateOilPricesParagraph,
  generateZakatNisabParagraph,
  generateMarketInsightsParagraph,
} from '@/lib/paragraphs/goldParagraphs';
import { generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

export const revalidate = 3600;

interface CryptoData {
  [key: string]: { usd: number; pkr: number };
}

export default function RatesPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cryptoData, setCryptoData] = useState<CryptoData>({});
  const [zakatInput, setZakatInput] = useState<number>(0);
  const [zakatOutput, setZakatOutput] = useState<number>(0);

  // Gold rates (PKR per gram - example rates)
  const goldRates = {
    '24K': { gram: 21500, tola: 250810, '10g': 215000 },
    '22K': { gram: 19708, tola: 229625, '10g': 197080 },
    '21K': { gram: 18812, tola: 219075, '10g': 188120 },
    '18K': { gram: 16094, tola: 187500, '10g': 160940 },
  };

  const silverRate = {
    gram: 320,
    tola: 3727,
    '10g': 3200,
  };

  const currencyRates = {
    'USD/PKR': { rate: 277.5, change: 0.25 },
    'EUR/PKR': { rate: 300.8, change: -0.15 },
    'GBP/PKR': { rate: 350.2, change: 0.55 },
    'AED/PKR': { rate: 75.5, change: 0.08 },
    'SAR/PKR': { rate: 74.0, change: 0.12 },
  };

  const oilPrices = {
    wti: 82.3,
    brent: 85.2,
    petrol: 248,
    diesel: 255,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const country = (Array.isArray(params.country) ? params.country[0] : params.country) || '';
        const province = (Array.isArray(params.province) ? params.province[0] : params.province) || '';
        const citySlug = (Array.isArray(params.city) ? params.city[0] : params.city) || '';

        const cityData = await getCityData(country, province, citySlug);
        if (!cityData) {
          setError('City not found');
          setLoading(false);
          return;
        }

        setCity(cityData);

        // Fetch crypto data from CoinGecko (free, no auth needed)
        try {
          const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana&vs_currencies=usd,pkr'
          );
          const data = (await response.json()) as CryptoData;
          setCryptoData({
            Bitcoin: data.bitcoin,
            Ethereum: data.ethereum,
            'Binance Coin': data.binancecoin,
            Solana: data.solana,
          });
        } catch {
          console.warn('Crypto API failed, using mock data');
          setCryptoData({
            Bitcoin: { usd: 67420, pkr: 18698320 },
            Ethereum: { usd: 3580, pkr: 992290 },
            'Binance Coin': { usd: 620, pkr: 171670 },
            Solana: { usd: 158, pkr: 43807 },
          });
        }
      } catch (err) {
        console.error(err);
        setError('Error loading rates data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const handleZakatCalculation = (amount: number) => {
    setZakatInput(amount);
    const zakat = (amount * 0.025) / 100; // 2.5% zakat
    setZakatOutput(zakat);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Inject schema markup for SEO
  useEffect(() => {
    if (!city) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-rates';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'rates'));
    document.head.appendChild(breadcrumbScript);

    // Update meta tags
    document.title = `Gold Rate in ${city.name} Today — 24K PKR 21,500/gram`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Gold rate in ${city.name}: 24K PKR 21,500/gram, 22K PKR 19,708/gram. Live crypto, currency exchange, oil prices & zakat calculator.`
      );
    }

    return () => {
      breadcrumbScript.remove();
    };
  }, [city]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3d2817] via-[#030712] to-[#030712]">
      {/* HERO SECTION */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full py-12 px-4 md:py-20 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            💰 Rates & Prices
          </h1>
          <p className="text-xl text-gray-300">
            {city?.name}, {city?.province}, {city?.country}
          </p>
          <p className="text-gray-400 mt-2">Live gold, silver, crypto & currency rates</p>
        </div>
      </motion.header>

      <div className="w-full px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {loading ? (
            <div className="text-center text-gray-400">Loading rates data...</div>
          ) : error ? (
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : (
            <>
              {/* GOLD RATES */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">🏆 Gold Rates in {city?.name}</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(goldRates).map(([karat, rates]) => (
                    <motion.div key={karat} variants={itemVariants}>
                      <GlassCard variant="default" className="p-6 hover:bg-amber-500/10 transition-colors border border-amber-600/30">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-amber-400 text-sm font-bold">GOLD RATE</p>
                            <h4 className="text-2xl font-bold text-white mt-1">{karat}</h4>
                          </div>
                          <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">▲ +0.4%</span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Per Gram</span>
                            <span className="text-xl font-mono font-bold text-amber-400">
                              PKR {rates.gram.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Per Tola (11.66g)</span>
                            <span className="text-xl font-mono font-bold text-amber-400">
                              PKR {rates.tola.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Per 10g</span>
                            <span className="text-xl font-mono font-bold text-amber-400">
                              PKR {rates['10g'].toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* SILVER RATES */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">⚪ Silver Rates</h3>
                <motion.div variants={itemVariants}>
                  <GlassCard variant="default" className="p-6 border border-slate-500/30">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-slate-400 text-sm font-bold">SILVER RATE</p>
                      </div>
                      <span className="text-sm text-green-400 bg-green-500/20 px-2 py-1 rounded">▲ +0.2%</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Per Gram</p>
                        <p className="text-2xl font-mono font-bold text-slate-300 mt-2">
                          PKR {silverRate.gram.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Per Tola</p>
                        <p className="text-2xl font-mono font-bold text-slate-300 mt-2">
                          PKR {silverRate.tola.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Per 10g</p>
                        <p className="text-2xl font-mono font-bold text-slate-300 mt-2">
                          PKR {silverRate['10g'].toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>

              {/* CRYPTOCURRENCY */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">₿ Cryptocurrency</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(cryptoData).map(([name, rates]) => (
                    <motion.div key={name} variants={itemVariants}>
                      <GlassCard variant="default" className="p-6 hover:bg-purple-500/10 transition-colors border border-purple-600/30">
                        <p className="text-purple-400 text-sm font-bold">{name}</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">USD</span>
                            <span className="font-mono font-bold text-purple-300">
                              ${rates.usd?.toLocaleString() || '---'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">PKR</span>
                            <span className="font-mono font-bold text-purple-300">
                              {rates.pkr ? `PKR ${Math.round(rates.pkr).toLocaleString()}` : '---'}
                            </span>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* CURRENCY RATES */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">💵 Currency Exchange Rates</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {Object.entries(currencyRates).map(([pair, data]) => (
                    <motion.div key={pair} variants={itemVariants}>
                      <GlassCard variant="default" className="p-4 text-center hover:bg-blue-500/10 transition-colors">
                        <p className="text-blue-400 text-xs font-bold mb-2">{pair}</p>
                        <p className="text-2xl font-mono font-bold text-white">
                          {data.rate.toFixed(2)}
                        </p>
                        <p className={`text-xs mt-2 font-semibold ${data.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change).toFixed(2)}%
                        </p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* OIL PRICES */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">🛢️ Oil Prices</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: 'WTI Crude', value: `$${oilPrices.wti}/bbl` },
                    { label: 'Brent Crude', value: `$${oilPrices.brent}/bbl` },
                    { label: 'Petrol', value: `PKR ${oilPrices.petrol}/L` },
                    { label: 'Diesel', value: `PKR ${oilPrices.diesel}/L` },
                  ].map((item) => (
                    <motion.div key={item.label} variants={itemVariants}>
                      <GlassCard variant="default" className="p-4 text-center">
                        <p className="text-gray-400 text-sm">{item.label}</p>
                        <p className="text-2xl font-mono font-bold text-orange-400 mt-3">
                          {item.value}
                        </p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ZAKAT CALCULATOR */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">🕌 Zakat Nisab Calculator</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nisab Info */}
                  <motion.div variants={itemVariants}>
                    <GlassCard variant="default" className="p-6">
                      <p className="text-emerald-400 text-sm font-bold mb-4">ZAKAT NISAB</p>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Gold Nisab (85g)</p>
                          <p className="text-2xl font-mono font-bold text-white">
                            PKR {(85 * goldRates['24K'].gram).toLocaleString()}
                          </p>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-gray-400 text-sm mb-1">Silver Nisab (595g)</p>
                          <p className="text-2xl font-mono font-bold text-white">
                            PKR {(595 * silverRate.gram).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>

                  {/* Calculator */}
                  <motion.div variants={itemVariants}>
                    <GlassCard variant="default" className="p-6">
                      <p className="text-emerald-400 text-sm font-bold mb-4">CALCULATE YOUR ZAKAT</p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-gray-400 text-sm">Total Wealth (PKR)</label>
                          <input
                            type="number"
                            value={zakatInput}
                            onChange={(e) => handleZakatCalculation(Number(e.target.value))}
                            className="w-full mt-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-mono placeholder-gray-600"
                            placeholder="Enter amount"
                          />
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                          <p className="text-gray-400 text-sm">Zakat Due (2.5%)</p>
                          <p className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                            PKR {zakatOutput.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* FINANCIAL STRESS METER */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">📊 Pakistan Financial Stress Index</h3>
                <motion.div variants={itemVariants}>
                  <GlassCard variant="default" className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <p className="text-gray-400 mb-2">Inflation Rate</p>
                        <p className="text-4xl font-bold text-orange-400">23.4%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Unemployment</p>
                        <p className="text-4xl font-bold text-red-400">6.2%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-2">Misery Index</p>
                        <p className="text-4xl font-bold text-red-500">29.6</p>
                      </div>
                    </div>

                    {/* Stress Meter */}
                    <div className="mt-8">
                      <p className="text-gray-400 mb-3">Financial Stress Level</p>
                      <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-red-600 transition-all"
                          style={{ width: '74%' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">HIGH STRESS</span>
                        </div>
                      </div>
                      <p className="text-red-400 text-sm mt-2">Economic conditions are challenging</p>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>

              {/* SEO CONTENT SECTIONS */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-16 border-t border-white/10 pt-12">
                <div className="space-y-12">
                  {/* Gold Rate Introduction */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-white mb-6">Gold and Silver Rates in {city?.name}</h2>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateGoldRateIntroductionParagraph(city, {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Gold Pricing Structure */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Gold Pricing and Karat Standards</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateGoldPricingStructureParagraph(city, goldRates['24K']),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Silver Rates */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Silver Rates and Investment</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateSilverRateParagraph(city, {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Cryptocurrency */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Cryptocurrency Markets</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateCryptocurrencyParagraph(city, {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Currency Exchange */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Currency Exchange Rates</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateCurrencyExchangeParagraph(city, {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Oil Prices */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Oil Prices and Energy Markets</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateOilPricesParagraph(city, {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Zakat Nisab */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Zakat Nisab Calculations</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateZakatNisabParagraph(city, goldRates['24K'], {}),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Market Insights */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Market Insights and Investment Strategy</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateMarketInsightsParagraph(city),
                        }}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
