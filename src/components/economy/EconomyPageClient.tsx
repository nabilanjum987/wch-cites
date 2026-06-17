'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, AlertTriangle, Activity,
  DollarSign, Users, BarChart3, Globe, Building2,
  Briefcase, ShoppingCart, Home, Zap, ArrowLeft,
  ChevronDown, ChevronUp, Info, Calculator, Target,
  Award, Minus
} from 'lucide-react';
import type { City } from '@/types/city';
import {
  FINANCIAL_STRESS_DATA, MISERY_INDEX_DATA, INTEREST_RATES,
  calculatePurchasingPower, calculateMiseryImpact,
  type FinancialStressData, type MiseryIndex
} from '@/lib/apis/rates';

// ── Country economy data ──────────────────────────────────────────────────────

interface EconomyData {
  gdpBillions: number;
  gdpGrowth: number;
  gdpPerCapita: number;
  inflation: number;
  unemployment: number;
  debtToGdp: number;
  hdi: number;
  gini: number;
  fdi: number;
  tradeBalance: number;
  population: number;
  laborForce: number;
  povertyRate: number;
  literacyRate: number;
  lifeExpectancy: number;
  currency: string;
  currencySymbol: string;
  interestRate: number;
  remittanceGdp: number;
}

const COUNTRY_ECONOMY: Record<string, EconomyData> = {
  pakistan: {
    gdpBillions: 338, gdpGrowth: 2.4, gdpPerCapita: 1505,
    inflation: 28.3, unemployment: 8.5, debtToGdp: 72.1,
    hdi: 0.540, gini: 31.6, fdi: 1.9, tradeBalance: -27.5,
    population: 231, laborForce: 72, povertyRate: 21.9, literacyRate: 58,
    lifeExpectancy: 67.1, currency: 'PKR', currencySymbol: '₨',
    interestRate: 22, remittanceGdp: 8.9,
  },
  india: {
    gdpBillions: 3750, gdpGrowth: 6.3, gdpPerCapita: 2601,
    inflation: 5.1, unemployment: 5.4, debtToGdp: 58.2,
    hdi: 0.633, gini: 35.7, fdi: 71, tradeBalance: -88,
    population: 1441, laborForce: 559, povertyRate: 10.2, literacyRate: 74.4,
    lifeExpectancy: 70.8, currency: 'INR', currencySymbol: '₹',
    interestRate: 6.5, remittanceGdp: 3.1,
  },
  'united-kingdom': {
    gdpBillions: 3079, gdpGrowth: 0.4, gdpPerCapita: 45295,
    inflation: 4.2, unemployment: 4.2, debtToGdp: 98.5,
    hdi: 0.929, gini: 35.1, fdi: 58, tradeBalance: -45,
    population: 68, laborForce: 33, povertyRate: 18.6, literacyRate: 99,
    lifeExpectancy: 81.2, currency: 'GBP', currencySymbol: '£',
    interestRate: 5.25, remittanceGdp: 0.4,
  },
  'united-states': {
    gdpBillions: 27360, gdpGrowth: 2.8, gdpPerCapita: 81695,
    inflation: 3.4, unemployment: 3.8, debtToGdp: 122.1,
    hdi: 0.921, gini: 41.4, fdi: 285, tradeBalance: -773,
    population: 335, laborForce: 168, povertyRate: 11.6, literacyRate: 99,
    lifeExpectancy: 77.5, currency: 'USD', currencySymbol: '$',
    interestRate: 5.5, remittanceGdp: 0.1,
  },
};

const DEFAULT_ECONOMY: EconomyData = {
  gdpBillions: 500, gdpGrowth: 3.2, gdpPerCapita: 8000,
  inflation: 5.0, unemployment: 5.0, debtToGdp: 60,
  hdi: 0.700, gini: 38, fdi: 10, tradeBalance: -5,
  population: 50, laborForce: 25, povertyRate: 12, literacyRate: 85,
  lifeExpectancy: 73, currency: 'USD', currencySymbol: '$',
  interestRate: 5, remittanceGdp: 1.5,
};

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, sub, color, trend, tooltip
}: {
  icon: React.ElementType; label: string; value: string;
  sub?: string; color: string; trend?: 'up' | 'down' | 'neutral'; tooltip?: string;
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend && <TrendIcon size={14} className={trendColor} />}
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function StressMeter({ score, level, primaryColor }: {
  score: number; level: string; primaryColor: string;
}) {
  const angle = (score / 100) * 180 - 90;
  const levelColors = { low: '#22c55e', medium: '#eab308', high: '#f97316', critical: '#ef4444' };
  const needleColor = levelColors[level as keyof typeof levelColors] ?? primaryColor;
  const levelLabel = { low: 'Low Stress', medium: 'Moderate', high: 'High Stress', critical: 'Critical' };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-48">
        <defs>
          <linearGradient id="meterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="33%" stopColor="#eab308" />
            <stop offset="66%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f3f4f6" strokeWidth="16" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#meterGrad)" strokeWidth="16" strokeLinecap="round" />
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="32" stroke={needleColor} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill={needleColor} />
        </g>
        <text x="100" y="95" textAnchor="middle" className="text-2xl font-bold" fontSize="22" fill="#111827" fontWeight="bold">{score}</text>
      </svg>
      <span className="text-sm font-semibold mt-1" style={{ color: needleColor }}>
        {levelLabel[level as keyof typeof levelLabel] ?? level}
      </span>
      <span className="text-xs text-gray-400 mt-0.5">Financial Stress Score / 100</span>
    </div>
  );
}

function MiseryTable({ data, countrySlug, primaryColor }: {
  data: MiseryIndex[]; countrySlug: string; primaryColor: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Rank</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Country</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Inflation %</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Unemployment %</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500">Misery Index</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const isThis = row.countrySlug === countrySlug || row.countrySlug === countrySlug.replace(/-/g, '');
            return (
              <tr key={row.country}
                className={`border-b border-gray-50 transition-colors ${isThis ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}>
                <td className="px-4 py-2.5 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-gray-900">
                  {row.country}
                  {isThis && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>You</span>}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-semibold ${row.inflation > 20 ? 'text-red-600' : row.inflation > 8 ? 'text-orange-500' : 'text-green-600'}`}>
                    {row.inflation}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-700">{row.unemployment}%</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-bold ${row.miseryIndex > 50 ? 'text-red-600' : row.miseryIndex > 20 ? 'text-orange-500' : 'text-green-600'}`}>
                    {row.miseryIndex.toFixed(1)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PurchasingPowerCalc({ inflation, currency, symbol, primaryColor }: {
  inflation: number; currency: string; symbol: string; primaryColor: string;
}) {
  const [amount, setAmount] = useState('10000');
  const val = parseFloat(amount) || 10000;
  const loss1y = val - val / (1 + inflation / 100);
  const loss3y = val - val / Math.pow(1 + inflation / 100, 3);
  const loss5y = val - val / Math.pow(1 + inflation / 100, 5);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} style={{ color: primaryColor }} />
        <h3 className="font-semibold text-gray-900">Purchasing Power Calculator</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">How much does your money lose to inflation?</p>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-sm font-medium text-gray-600">{symbol}</span>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
          placeholder="Enter amount"
        />
      </div>
      <div className="space-y-3">
        {[
          { label: 'Lost in 1 year', loss: loss1y, remaining: val - loss1y },
          { label: 'Lost in 3 years', loss: loss3y, remaining: val - loss3y },
          { label: 'Lost in 5 years', loss: loss5y, remaining: val - loss5y },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{row.label}</span>
                <span className="text-red-500 font-semibold">-{symbol}{Math.round(row.loss).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (row.loss / val) * 100)}%` }} />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-700 w-24 text-right">
              {symbol}{Math.round(row.remaining).toLocaleString()} left
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">Based on current {inflation}% annual inflation rate.</p>
    </div>
  );
}

function IndicatorBar({ label, value, max, color, format }: {
  label: string; value: number; max: number; color: string; format?: (v: number) => string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const fmt = format ?? (v => v.toFixed(1));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">{fmt(value)}</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

interface Props {
  country: string;
  province: string;
  citySlug: string;
  cityData: City | null;
}

export default function EconomyPageClient({ country, province, citySlug, cityData }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const cityName = cityData?.name ?? citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const primaryColor = cityData?.primary_color ?? '#01411C';

  const eco = COUNTRY_ECONOMY[country] ?? COUNTRY_ECONOMY[country.replace(/-/g, '')] ?? DEFAULT_ECONOMY;
  const stress = FINANCIAL_STRESS_DATA[country] ?? FINANCIAL_STRESS_DATA[country.replace(/-/g, '')] ?? { score: 50, level: 'medium', inflation: eco.inflation, unemployment: eco.unemployment, debtToGdp: eco.debtToGdp, country: countryName };
  const misery = MISERY_INDEX_DATA.find(m => m.countrySlug === country || m.countrySlug === country.replace(/-/g, '')) ?? MISERY_INDEX_DATA[0];
  const interest = INTEREST_RATES[country] ?? INTEREST_RATES[country.replace(/-/g, '')] ?? { rate: eco.interestRate, country: countryName, currency: eco.currency };

  const gdpPerCapitaDaily = eco.gdpPerCapita / 365;
  const debtPerCitizen = Math.round((eco.gdpBillions * eco.debtToGdp / 100 * 1000) / (eco.population * 1000));

  const toggle = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  const sections = [
    {
      id: 'population',
      icon: Users,
      color: '#3B82F6',
      title: 'Population & Demographics',
      summary: `${eco.population}M people • ${eco.literacyRate}% literacy • ${eco.lifeExpectancy}yr life expectancy`,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <StatCard icon={Users} label="Population" value={`${eco.population}M`} sub="Total population" color="#3B82F6" />
          <StatCard icon={Activity} label="Labor Force" value={`${eco.laborForce}M`} sub="Active workers" color="#3B82F6" />
          <StatCard icon={Award} label="Literacy Rate" value={`${eco.literacyRate}%`} sub="Population literate" color="#3B82F6" trend="up" />
          <StatCard icon={Activity} label="Life Expectancy" value={`${eco.lifeExpectancy} yrs`} sub="Average at birth" color="#3B82F6" />
        </div>
      ),
    },
    {
      id: 'economic',
      icon: BarChart3,
      color: primaryColor,
      title: 'Economic Core',
      summary: `GDP $${eco.gdpBillions}B • Growth ${eco.gdpGrowth}% • Per capita $${eco.gdpPerCapita.toLocaleString()}`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={DollarSign} label="Total GDP" value={`$${eco.gdpBillions}B`} sub="USD billions" color={primaryColor} />
            <StatCard icon={TrendingUp} label="GDP Growth" value={`${eco.gdpGrowth}%`} sub="Annual rate" color={primaryColor} trend={eco.gdpGrowth > 3 ? 'up' : eco.gdpGrowth > 0 ? 'neutral' : 'down'} />
            <StatCard icon={DollarSign} label="GDP Per Capita" value={`$${eco.gdpPerCapita.toLocaleString()}`} sub={`$${gdpPerCapitaDaily.toFixed(2)}/day`} color={primaryColor} />
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">What does GDP per capita mean for you?</p>
            <p className="text-sm text-gray-600">
              On average, each person in {countryName} contributes <strong>${gdpPerCapitaDaily.toFixed(2)}</strong> to the economy per day.
              Compare that to the USA ($223/day) or Germany ($170/day). {eco.gdpGrowth > 4 ? '📈 Growth is strong.' : eco.gdpGrowth > 1 ? '📊 Growth is moderate.' : '⚠️ Growth needs attention.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'inflation',
      icon: TrendingUp,
      color: '#F97316',
      title: 'Inflation & Prices',
      summary: `${eco.inflation}% annual inflation • Interest rate ${eco.interestRate}%`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={TrendingUp} label="Inflation Rate" value={`${eco.inflation}%`} sub="Annual CPI change" color="#F97316" trend={eco.inflation > 10 ? 'down' : 'up'} />
            <StatCard icon={Zap} label="Interest Rate" value={`${eco.interestRate}%`} sub="Central bank rate" color="#F97316" />
          </div>
          <PurchasingPowerCalc
            inflation={eco.inflation}
            currency={eco.currency}
            symbol={eco.currencySymbol}
            primaryColor={primaryColor}
          />
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-sm font-medium text-orange-800 mb-1">Plain Language: What does {eco.inflation}% inflation mean?</p>
            <p className="text-sm text-orange-700">
              If you bought groceries for {eco.currencySymbol}1,000 last year, the same basket costs approximately <strong>{eco.currencySymbol}{Math.round(1000 * (1 + eco.inflation / 100)).toLocaleString()}</strong> today.
              Your money loses <strong>{eco.inflation}%</strong> of its purchasing power every year.
              {eco.inflation > 20 ? ' This is very high — savings in cash are being eroded rapidly.' :
               eco.inflation > 8 ? ' This is above global average and affects household budgets noticeably.' :
               ' This is within a manageable range.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'employment',
      icon: Briefcase,
      color: '#8B5CF6',
      title: 'Employment & Labour',
      summary: `${eco.unemployment}% unemployment • ${eco.povertyRate}% poverty rate`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Briefcase} label="Unemployment" value={`${eco.unemployment}%`} sub="Of labor force" color="#8B5CF6" trend={eco.unemployment > 8 ? 'down' : 'up'} />
            <StatCard icon={Users} label="Poverty Rate" value={`${eco.povertyRate}%`} sub="Below poverty line" color="#8B5CF6" trend={eco.povertyRate > 20 ? 'down' : 'neutral'} />
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-sm text-purple-800">
              <strong>{eco.unemployment}%</strong> unemployment means roughly <strong>{Math.round(eco.laborForce * eco.unemployment / 100)}M people</strong> in {countryName} are actively seeking work.
              {eco.unemployment > 10 ? ' High unemployment strains social services and reduces consumer spending.' :
               eco.unemployment > 5 ? ' Moderate levels suggest the economy is growing but not at full capacity.' :
               ' Near full employment suggests a healthy, active economy.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'debt',
      icon: AlertTriangle,
      color: '#EF4444',
      title: 'National Debt & Fiscal Health',
      summary: `${eco.debtToGdp}% debt-to-GDP • ${eco.currencySymbol}${debtPerCitizen.toLocaleString()} per citizen`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={AlertTriangle} label="Debt-to-GDP" value={`${eco.debtToGdp}%`} sub="National debt ratio" color="#EF4444" trend={eco.debtToGdp > 90 ? 'down' : 'neutral'} />
            <StatCard icon={Users} label="Debt Per Citizen" value={`$${debtPerCitizen.toLocaleString()}`} sub="Each person owes" color="#EF4444" />
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-sm font-medium text-red-800 mb-1">What does this mean?</p>
            <p className="text-sm text-red-700">
              {countryName}'s national debt is <strong>{eco.debtToGdp}%</strong> of its entire annual GDP.
              Each citizen effectively owes <strong>${debtPerCitizen.toLocaleString()}</strong> as their share of this debt.
              {eco.debtToGdp > 100 ? ' A debt-to-GDP ratio above 100% is considered very high — it limits government spending on public services.' :
               eco.debtToGdp > 60 ? ' Above 60% is the EU\'s warning threshold. Servicing this debt consumes a significant portion of the annual budget.' :
               ' This is within manageable levels by global standards.'}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'hdi',
      icon: Award,
      color: '#10B981',
      title: 'Human Development & Quality of Life',
      summary: `HDI ${eco.hdi} • Gini ${eco.gini} inequality coefficient`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Award} label="HDI Score" value={eco.hdi.toFixed(3)} sub={eco.hdi > 0.8 ? 'Very High' : eco.hdi > 0.7 ? 'High' : eco.hdi > 0.55 ? 'Medium' : 'Low'} color="#10B981" trend={eco.hdi > 0.7 ? 'up' : 'neutral'} />
            <StatCard icon={BarChart3} label="Gini Coefficient" value={eco.gini.toFixed(1)} sub={eco.gini > 40 ? 'High Inequality' : eco.gini > 30 ? 'Moderate' : 'Low Inequality'} color="#10B981" />
          </div>
          <div className="space-y-2 bg-white rounded-xl border border-gray-100 p-4">
            <IndicatorBar label="Human Development Index" value={eco.hdi} max={1} color="#10B981" format={v => v.toFixed(3)} />
            <IndicatorBar label="Literacy Rate" value={eco.literacyRate} max={100} color="#3B82F6" format={v => `${v}%`} />
            <IndicatorBar label="Life Expectancy (out of 90)" value={eco.lifeExpectancy} max={90} color="#8B5CF6" format={v => `${v} yrs`} />
          </div>
        </div>
      ),
    },
    {
      id: 'trade',
      icon: Globe,
      color: '#0891B2',
      title: 'Trade & Foreign Investment',
      summary: `Trade balance $${eco.tradeBalance}B • FDI $${eco.fdi}B`,
      content: (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Globe} label="Trade Balance" value={`$${Math.abs(eco.tradeBalance)}B`} sub={eco.tradeBalance < 0 ? 'Trade deficit' : 'Trade surplus'} color="#0891B2" trend={eco.tradeBalance >= 0 ? 'up' : 'down'} />
            <StatCard icon={Building2} label="Foreign Direct Investment" value={`$${eco.fdi}B`} sub="Annual FDI inflow" color="#0891B2" trend={eco.fdi > 20 ? 'up' : 'neutral'} />
            {eco.remittanceGdp > 0 && (
              <StatCard icon={DollarSign} label="Remittances (% GDP)" value={`${eco.remittanceGdp}%`} sub="Diaspora money sent home" color="#0891B2" />
            )}
          </div>
          {eco.tradeBalance < 0 && (
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
              <p className="text-sm text-cyan-800">
                {countryName} imports <strong>${Math.abs(eco.tradeBalance)}B more</strong> than it exports annually.
                This trade deficit puts pressure on foreign exchange reserves and the local currency.
                {eco.remittanceGdp > 3 ? ` However, remittances of ${eco.remittanceGdp}% of GDP help partially offset this.` : ''}
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)` }} className="text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href={`/${country}/${province}/${citySlug}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-4 transition">
            <ArrowLeft size={14} /> Back to {cityName}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 size={28} className="opacity-80" />
            <h1 className="text-3xl font-bold">{countryName} Economy</h1>
          </div>
          <p className="text-white/80 text-sm">Economic intelligence for {cityName} — data-driven, plain language</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Financial Stress Meter + Misery Index side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} style={{ color: primaryColor }} />
              <h2 className="font-bold text-gray-900">Financial Stress Meter</h2>
            </div>
            <StressMeter score={stress.score} level={stress.level} primaryColor={primaryColor} />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
              <div><div className="font-bold text-gray-800">{stress.inflation}%</div><div>Inflation</div></div>
              <div><div className="font-bold text-gray-800">{stress.unemployment}%</div><div>Unemployment</div></div>
              <div><div className="font-bold text-gray-800">{stress.debtToGdp}%</div><div>Debt/GDP</div></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} style={{ color: primaryColor }} />
              <h2 className="font-bold text-gray-900">Global Misery Index</h2>
            </div>
            <MiseryTable data={MISERY_INDEX_DATA} countrySlug={country} primaryColor={primaryColor} />
            <p className="text-xs text-gray-400 mt-3">Misery Index = Inflation + Unemployment. Higher = more economic pain.</p>
          </div>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={DollarSign} label="GDP" value={`$${eco.gdpBillions}B`} color={primaryColor} />
          <StatCard icon={TrendingUp} label="Growth" value={`${eco.gdpGrowth}%`} color="#10B981" trend={eco.gdpGrowth > 3 ? 'up' : 'neutral'} />
          <StatCard icon={Activity} label="Inflation" value={`${eco.inflation}%`} color="#F97316" trend={eco.inflation > 10 ? 'down' : 'up'} />
          <StatCard icon={Briefcase} label="Unemployment" value={`${eco.unemployment}%`} color="#8B5CF6" trend={eco.unemployment > 8 ? 'down' : 'up'} />
        </div>

        {/* Accordion sections */}
        <div className="space-y-3">
          {sections.map(section => (
            <div key={section.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${section.color}15` }}>
                    <section.icon size={16} style={{ color: section.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{section.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{section.summary}</p>
                  </div>
                </div>
                {expandedSection === section.id
                  ? <ChevronUp size={18} className="text-gray-400 flex-shrink-0" />
                  : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
              </button>
              {expandedSection === section.id && (
                <div className="px-5 pb-5 border-t border-gray-50">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Opportunity Index */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} style={{ color: primaryColor }} />
            <h2 className="font-bold text-gray-900">Opportunity Index for {cityName}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Business Environment',
                score: Math.max(10, Math.min(100, 100 - stress.score * 0.6 + eco.gdpGrowth * 3)),
                color: '#3B82F6',
                insight: eco.gdpGrowth > 4 ? 'Growing market, good entry point' : eco.gdpGrowth > 1 ? 'Stable but cautious investment climate' : 'Challenging business conditions',
              },
              {
                label: 'Real Estate Potential',
                score: Math.max(10, Math.min(100, 70 - eco.inflation * 0.8 + eco.gdpGrowth * 5)),
                color: '#10B981',
                insight: eco.inflation > 15 ? 'High inflation erodes returns' : eco.gdpGrowth > 4 ? 'Strong demand growth expected' : 'Moderate appreciation potential',
              },
              {
                label: 'Export Opportunity',
                score: Math.max(10, Math.min(100, 60 + (eco.tradeBalance < 0 ? 15 : -10) + eco.fdi * 0.5)),
                color: '#8B5CF6',
                insight: eco.tradeBalance < -20 ? 'High import dependency = export gap opportunity' : eco.fdi > 50 ? 'Foreign confidence is high' : 'Emerging export potential',
              },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <span className="text-lg font-bold" style={{ color: item.color }}>{Math.round(item.score)}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                </div>
                <p className="text-xs text-gray-500">{item.insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Data sourced from World Bank, IMF, and national statistics bureaus. Figures are latest available estimates and subject to revision. This page is for informational purposes only and does not constitute financial advice.
          </p>
        </div>

      </div>
    </div>
  );
}
