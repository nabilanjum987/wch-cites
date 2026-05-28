'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface WorldBankData {
  gdpTotal: number;
  gdpPerCapita: number;
  gdpGrowth: number;
  year: number;
  currency: string;
}

interface EconomicIndicator {
  label: string;
  value: number | string;
  unit: string;
  change?: number;
}

const INDUSTRY_EMOJIS: Record<string, string> = {
  agriculture: '🌾',
  industry: '🏭',
  services: '🏢',
  manufacturing: '🔧',
  technology: '💻',
  finance: '🏦',
  retail: '🛒',
  tourism: '🏖️',
  mining: '⛏️',
  construction: '🏗️',
};

const COUNTRY_INDUSTRIES: Record<string, Array<{ name: string; percent: number }>> = {
  PK: [
    { name: 'Agriculture', percent: 22 },
    { name: 'Industry', percent: 29 },
    { name: 'Services', percent: 49 },
  ],
  IN: [
    { name: 'Services', percent: 54 },
    { name: 'Industry', percent: 30 },
    { name: 'Agriculture', percent: 16 },
  ],
  AE: [
    { name: 'Services', percent: 65 },
    { name: 'Industry', percent: 32 },
    { name: 'Agriculture', percent: 3 },
  ],
  SA: [
    { name: 'Industry', percent: 55 },
    { name: 'Services', percent: 40 },
    { name: 'Agriculture', percent: 5 },
  ],
  US: [
    { name: 'Services', percent: 78 },
    { name: 'Industry', percent: 20 },
    { name: 'Agriculture', percent: 2 },
  ],
  GB: [
    { name: 'Services', percent: 82 },
    { name: 'Industry', percent: 16 },
    { name: 'Agriculture', percent: 2 },
  ],
};

const INFLATION_RATES: Record<string, number> = {
  PK: 29.5,
  IN: 5.7,
  AE: 2.3,
  SA: 2.1,
  US: 3.4,
  GB: 4.0,
};

const UNEMPLOYMENT_RATES: Record<string, number> = {
  PK: 8.5,
  IN: 4.2,
  AE: 2.7,
  SA: 11.2,
  US: 3.7,
  GB: 4.2,
};

const POPULATION: Record<string, number> = {
  PK: 230000000,
  IN: 1380000000,
  AE: 9900000,
  SA: 35000000,
  US: 331000000,
  GB: 67000000,
};

async function fetchWorldBankData(
  countryCode: string
): Promise<WorldBankData | null> {
  try {
    const response = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&mrv=5`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2 || !data[1]) return null;

    const gdpData = data[1].find((item: { value: number }) => item.value);

    if (!gdpData) return null;

    const gdpTotal = gdpData.value;

    let gdpPerCapita = 0;
    if (POPULATION[countryCode] && countryCode !== 'US') {
      gdpPerCapita = (gdpTotal * 1000000) / (POPULATION[countryCode] * 365);
    } else {
      gdpPerCapita = gdpTotal / (GDP_PER_CAPITA_APPROX[countryCode] || 100);
    }

    const population = POPULATION[countryCode] || 100000000;
    gdpPerCapita = (gdpTotal / population / 365) * 1000000;

    let gdpGrowth = 0;
    const growthResponse = await fetch(
      `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.KD.ZG?format=json&mrv=1`
    );
    if (growthResponse.ok) {
      const growthData = await growthResponse.json();
      if (Array.isArray(growthData) && growthData[1]?.[0]?.value) {
        gdpGrowth = growthData[1][0].value;
      }
    }

    return {
      gdpTotal,
      gdpPerCapita,
      gdpGrowth,
      year: gdpData.date,
      currency: 'USD',
    };
  } catch {
    return null;
  }
}

const GDP_PER_CAPITA_APPROX: Record<string, number> = {
  PK: 1500,
  IN: 2200,
  AE: 43000,
  SA: 23000,
  US: 76000,
  GB: 42000,
};

function Speedometer({ value, max = 50 }: { value: number; max?: number }) {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;

  const colorClass =
    percentage <= 33
      ? 'stroke-green-400'
      : percentage <= 66
      ? 'stroke-yellow-400'
      : 'stroke-red-500';

  return (
    <div className="relative w-32 h-24 mx-auto">
      <svg viewBox="0 0 100 60" className="w-full h-full">
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          className="stroke-gray-700"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <motion.path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          className={colorClass}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="125.6"
          initial={{ strokeDashoffset: 125.6 }}
          animate={{ strokeDashoffset: 125.6 * (1 - percentage / 100) }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
        <motion.line
          x1="50"
          y1="55"
          x2="50"
          y2="20"
          className={colorClass}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ rotate: -90 }}
          animate={{ rotate: angle }}
          transition={{ delay: 0.2, duration: 2, ease: 'easeOut' }}
          style={{ transformOrigin: '50px 55px' }}
        />
        <circle cx="50" cy="55" r="4" className="fill-gray-600" />
      </svg>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-16 text-xs">
        <span className="text-green-400">0</span>
        <span className="text-red-400">{max}</span>
      </div>
    </div>
  );
}

function formatNumber(num: number, decimals: number = 0): string {
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(decimals);
}

export function EconomySection({ city }: { city: City }) {
  const [economyData, setEconomyData] = useState<WorldBankData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchWorldBankData(city.country_code);
      setEconomyData(data);
      setLoading(false);
    }
    load();
  }, [city.country_code]);

  const inflation = INFLATION_RATES[city.country_code] || 5;
  const unemployment = UNEMPLOYMENT_RATES[city.country_code] || 5;
  const miseryIndex = inflation + unemployment;
  const topIndustries = COUNTRY_INDUSTRIES[city.country_code] || COUNTRY_INDUSTRIES['US'];
  const population = POPULATION[city.country_code] || 100000000;

  const gdpPerCapitaDaily = economyData ? economyData.gdpPerCapita : 0;
  const citizenLabel = city.country_code === 'PK'
    ? 'Pakistani'
    : city.country_code === 'IN'
    ? 'Indian'
    : city.country_code === 'AE'
    ? 'Emirati'
    : city.country_code === 'SA'
    ? 'Saudi'
    : city.country_code === 'GB'
    ? 'Briton'
    : 'citizen';

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        Economy at a Glance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {loading ? (
          <>
            <div className="bg-gray-50 rounded-lg p-4 animate-pulse h-24"></div>
            <div className="bg-gray-50 rounded-lg p-4 animate-pulse h-24"></div>
            <div className="bg-gray-50 rounded-lg p-4 animate-pulse h-24"></div>
          </>
        ) : economyData ? (
          <>
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-xs text-blue-600 uppercase tracking-wider mb-2">
                GDP Total ({economyData.year})
              </p>
              <p className="text-3xl font-bold text-blue-900">
                ${formatNumber(economyData.gdpTotal)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <span className={`${economyData.gdpGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {economyData.gdpGrowth >= 0 ? '↑' : '↓'} {Math.abs(economyData.gdpGrowth).toFixed(1)}%
                </span>
                <span className="text-gray-500">growth</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <p className="text-xs text-emerald-600 uppercase tracking-wider mb-2">
                GDP Per Capita (Annual)
              </p>
              <p className="text-3xl font-bold text-emerald-900">
                ${formatNumber(economyData.gdpPerCapita * 365, 0)}
              </p>
              <p className="text-xs text-emerald-600 mt-2">
                ≈ ${(economyData.gdpPerCapita / 12).toFixed(2)}/month
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="text-xs text-purple-600 uppercase tracking-wider mb-2">
                Your Daily Share
              </p>
              <p className="text-2xl font-bold text-purple-900">
                Every {citizenLabel}'s share
              </p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                ${gdpPerCapitaDaily > 0 ? gdpPerCapitaDaily.toFixed(2) : '—'}<span className="text-lg">/day</span>
              </p>
            </motion.div>
          </>
        ) : null}
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Misery Index (Inflation + Unemployment)
        </h3>

        <div className="flex items-center gap-6">
          <Speedometer value={miseryIndex} max={50} />

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Inflation Rate</span>
              <span className="font-mono font-semibold text-red-600">
                {inflation.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unemployment Rate</span>
              <span className="font-mono font-semibold text-orange-600">
                {unemployment.toFixed(1)}%
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex items-center justify-between">
              <span className="font-medium text-gray-700">Misery Index</span>
              <span className="font-mono font-bold text-xl text-gray-900">
                {miseryIndex.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
          Top Industries by GDP Share
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topIndustries.slice(0, 3).map((industry, idx) => (
            <motion.div
              key={industry.name}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-shadow"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">
                  {INDUSTRY_EMOJIS[industry.name.toLowerCase()] || '🏢'}
                </span>
                <div>
                  <p className="font-medium text-gray-900">#{idx + 1}</p>
                  <p className="text-sm text-gray-600">{industry.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${industry.percent}%` }}
                    transition={{ delay: 0.3 + idx * 0.1, duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="ml-3 text-sm font-semibold text-gray-700">
                  {industry.percent}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
