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
import GrowthDashboard from '@/components/shared/GrowthDashboard';
import { countrySlugToIso2, computeStressScore, stressLevel, type WBValues, type MiseryRow } from '@/lib/apis/worldbank';
import {
  calculatePurchasingPower,
  type MiseryIndex
} from '@/lib/apis/rates';
import {
  generateStressMeterParagraph, generateStressMeterAfter,
  generateMiseryParagraph, generateMiseryAfter,
  generatePopulationParagraph, generatePopulationAfter,
  generateEconomicCoreParagraph, generateEconomicCoreAfter,
  generateInflationParagraph, generateInflationAfter,
  generateEmploymentParagraph, generateEmploymentAfter,
  generateDebtParagraph, generateDebtAfter,
  generateHdiParagraph, generateHdiAfter,
  generateEconomyGrowthParagraph, generateEconomyGrowthAfter,
  generateTradeParagraph, generateTradeAfter,
  generateOpportunityParagraph, generateOpportunityAfter,
} from '@/lib/paragraphs/economy';

// ── Country economy view (World Bank, Batch 3b) ─────────────────────────────
// Every figure comes from the World Bank via the server page (wb prop),
// each with its data year in `years`. A figure the World Bank does not
// publish (or has not updated recently) is null and its card/section is
// hidden. This replaces the static COUNTRY_ECONOMY snapshot table, which
// showed undated stale values as current facts (Pakistan inflation
// "28.3%", policy rate "22%", population "231M") plus an invented
// DEFAULT_ECONOMY row served for every other country.

interface EcoView {
  gdpBillions: number | null;
  gdpGrowth: number | null;
  gdpPerCapita: number | null;
  inflation: number | null;
  unemployment: number | null;
  debtToGdp: number | null;
  gini: number | null;
  fdiBillions: number | null;
  tradeBalanceBillions: number | null;
  populationM: number | null;
  laborForceM: number | null;
  povertyRate: number | null;
  literacyRate: number | null;
  lifeExpectancy: number | null;
  realRate: number | null;
  remittancesBillions: number | null;
  currency: string;
  currencySymbol: string;
  years: Partial<Record<string, number>>;
}

const ISO2_CURRENCY: Record<string, { code: string; symbol: string }> = {
  PK: { code: 'PKR', symbol: '₨' }, IN: { code: 'INR', symbol: '₹' },
  GB: { code: 'GBP', symbol: '£' }, US: { code: 'USD', symbol: '$' },
  AE: { code: 'AED', symbol: 'د.إ' }, SA: { code: 'SAR', symbol: '﷼' },
  TR: { code: 'TRY', symbol: '₺' }, BD: { code: 'BDT', symbol: '৳' },
  DE: { code: 'EUR', symbol: '€' }, JP: { code: 'JPY', symbol: '¥' },
  CN: { code: 'CNY', symbol: '¥' },
};

function buildEco(wb: WBValues | null, country: string, cityData: City | null): EcoView {
  const iso2 = cityData?.country_code ?? countrySlugToIso2(country);
  const cur = ISO2_CURRENCY[iso2] ?? { code: 'USD', symbol: '$' };
  const val = (k: keyof WBValues) => wb?.[k]?.value ?? null;
  const yrs: Partial<Record<string, number>> = {};
  if (wb) (Object.keys(wb) as (keyof WBValues)[]).forEach(k => { if (wb[k]) yrs[k as string] = wb[k]!.year; });
  const r1 = (x: number | null) => x == null ? null : Math.round(x * 10) / 10;
  const gdpUsd = val('gdpUsd');
  const pop = val('population');
  const labor = val('laborForce');
  const fdi = val('fdiUsd');
  const trade = val('tradeBalanceUsd');
  const remit = val('remittancesUsd');
  return {
    gdpBillions: gdpUsd == null ? null : Math.round(gdpUsd / 1e9),
    gdpGrowth: r1(val('gdpGrowth')),
    gdpPerCapita: val('gdpPerCapita') == null ? null : Math.round(val('gdpPerCapita')!),
    inflation: r1(val('inflation')),
    unemployment: r1(val('unemployment')),
    debtToGdp: r1(val('debtPctGdp')),
    gini: r1(val('gini')),
    fdiBillions: fdi == null ? null : Math.round(fdi / 1e8) / 10,
    tradeBalanceBillions: trade == null ? null : Math.round(trade / 1e8) / 10,
    populationM: pop == null ? null : Math.round(pop / 1e5) / 10,
    laborForceM: labor == null ? null : Math.round(labor / 1e5) / 10,
    povertyRate: r1(val('poverty')),
    literacyRate: r1(val('literacy')),
    lifeExpectancy: r1(val('lifeExpectancy')),
    realRate: r1(val('realRate')),
    remittancesBillions: remit == null ? null : Math.round(remit / 1e8) / 10,
    currency: cur.code,
    currencySymbol: cur.symbol,
    years: yrs,
  };
}

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
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }} className="bg-transparent rounded-2xl border border-white/8 p-4 hover: transition-shadow">

      {/* Dark aurora orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-5"
          style={{ backgroundColor: "#0C7A3D" }} />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-5"
          style={{ backgroundColor: "#0C7A3D" }} />
      </div>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend && <TrendIcon size={14} className={trendColor} />}
      </div>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="text-xl font-bold text-white">{value}</p>
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
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }} className="flex flex-col items-center">
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
    <div className="overflow-x-auto rounded-xl border border-white/8">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-transparent/4 border-b border-white/8">
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
                className={`border-b border-gray-50 transition-colors ${isThis ? 'bg-yellow-500/100/10' : 'hover:bg-transparent/4'}`}>
                <td className="px-4 py-2.5 text-gray-500 font-medium">{i + 1}</td>
                <td className="px-4 py-2.5 font-medium text-white">
                  {row.country}
                  {isThis && <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: primaryColor }}>You</span>}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-semibold ${row.inflation > 20 ? 'text-red-400' : row.inflation > 8 ? 'text-orange-500' : 'text-green-400'}`}>
                    {row.inflation}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right text-gray-300">{row.unemployment}%</td>
                <td className="px-4 py-2.5 text-right">
                  <span className={`font-bold ${row.miseryIndex > 50 ? 'text-red-400' : row.miseryIndex > 20 ? 'text-orange-500' : 'text-green-400'}`}>
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
    <div className="bg-transparent rounded-2xl border border-white/8 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} style={{ color: primaryColor }} />
        <h3 className="font-semibold text-white">Purchasing Power Calculator</h3>
      </div>
      <p className="text-xs text-gray-500 mb-3">How much does your money lose to inflation?</p>
      <div className="flex items-center gap-2 mb-5">
        <span className="text-sm font-medium text-gray-400">{symbol}</span>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="flex-1 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2"
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
                <span className="text-gray-400">{row.label}</span>
                <span className="text-red-500 font-semibold">-{symbol}{Math.round(row.loss).toLocaleString()}</span>
              </div>
              <div className="h-2 bg-transparent/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (row.loss / val) * 100)}%` }} />
              </div>
            </div>
            <span className="text-xs font-semibold text-gray-300 w-24 text-right">
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
        <span className="text-gray-400">{label}</span>
        <span className="font-semibold text-white">{fmt(value)}</span>
      </div>
      <div className="h-2.5 bg-transparent/5 rounded-full overflow-hidden">
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
  wb: WBValues | null;
  miseryData: MiseryRow[] | null;
}

export default function EconomyPageClient({ country, province, citySlug, cityData, wb, miseryData }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const cityName = cityData?.name ?? citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const countryName = cityData?.country ?? country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const primaryColor = cityData?.primary_color ?? '#01411C';

  const eco = buildEco(wb, country, cityData);
  const stressScore = eco.inflation != null && eco.unemployment != null
    ? computeStressScore(eco.inflation, eco.unemployment)
    : null;
  const stress = stressScore != null
    ? { score: stressScore, level: stressLevel(stressScore), inflation: eco.inflation!, unemployment: eco.unemployment!, debtToGdp: eco.debtToGdp }
    : null;
  // World Bank's real interest rate series is years stale for many
  // countries (Pakistan stops at 2020) — only show it when reasonably
  // current, and never label it a central-bank/policy rate.
  const showRealRate = eco.realRate != null && (eco.years.realRate ?? 0) >= 2023;

  const gdpPerCapitaDaily = eco.gdpPerCapita != null ? eco.gdpPerCapita / 365 : null;
  const debtPerCitizen = eco.gdpBillions != null && eco.debtToGdp != null && eco.populationM
    ? Math.round((eco.gdpBillions * 1e9 * eco.debtToGdp / 100) / (eco.populationM * 1e6))
    : null;

  const toggle = (s: string) => setExpandedSection(prev => prev === s ? null : s);

  const sections = [
    {
      id: 'population',
      icon: Users,
      color: '#3B82F6',
      title: 'Population & Demographics',
      enabled: eco.populationM != null,
      summary: [eco.populationM != null ? `${eco.populationM}M people` : null, eco.literacyRate != null ? `${eco.literacyRate}% literacy` : null, eco.lifeExpectancy != null ? `${eco.lifeExpectancy}yr life expectancy` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generatePopulationParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Users} label="Population" value={`${eco.populationM}M`} sub={`World Bank ${eco.years.population ?? ''}`} color="#3B82F6" />
            {eco.laborForceM != null && <StatCard icon={Activity} label="Labor Force" value={`${eco.laborForceM}M`} sub={`Active workers, ${eco.years.laborForce ?? ''}`} color="#3B82F6" />}
            {eco.literacyRate != null && <StatCard icon={Award} label="Literacy Rate" value={`${eco.literacyRate}%`} sub={`Population literate, ${eco.years.literacy ?? ''}`} color="#3B82F6" trend="up" />}
            {eco.lifeExpectancy != null && <StatCard icon={Activity} label="Life Expectancy" value={`${eco.lifeExpectancy} yrs`} sub={`Average at birth, ${eco.years.lifeExpectancy ?? ''}`} color="#3B82F6" />}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generatePopulationAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'economic',
      icon: BarChart3,
      color: primaryColor,
      title: 'Economic Core',
      enabled: eco.gdpBillions != null,
      summary: [eco.gdpBillions != null ? `GDP $${eco.gdpBillions}B` : null, eco.gdpGrowth != null ? `Growth ${eco.gdpGrowth}%` : null, eco.gdpPerCapita != null ? `Per capita $${eco.gdpPerCapita.toLocaleString()}` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateEconomicCoreParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={DollarSign} label="Total GDP" value={`$${eco.gdpBillions}B`} sub={`World Bank ${eco.years.gdpUsd ?? ''}`} color={primaryColor} />
            {eco.gdpGrowth != null && <StatCard icon={TrendingUp} label="GDP Growth" value={`${eco.gdpGrowth}%`} sub={`Annual rate, ${eco.years.gdpGrowth ?? ''}`} color={primaryColor} trend={eco.gdpGrowth > 3 ? 'up' : eco.gdpGrowth > 0 ? 'neutral' : 'down'} />}
            {eco.gdpPerCapita != null && <StatCard icon={DollarSign} label="GDP Per Capita" value={`$${eco.gdpPerCapita.toLocaleString()}`} sub={`$${(gdpPerCapitaDaily ?? 0).toFixed(2)}/day`} color={primaryColor} />}
          </div>
          <div className="bg-transparent/4 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-300 mb-2">What does GDP per capita mean for you?</p>
            <p className="text-sm text-gray-400">
              On average, each person in {countryName} contributes <strong>${(gdpPerCapitaDaily ?? 0).toFixed(2)}</strong> to the economy per day.
              {(eco.gdpGrowth ?? 0) > 4 ? '📈 Growth is strong.' : (eco.gdpGrowth ?? 0) > 1 ? '📊 Growth is moderate.' : '⚠️ Growth needs attention.'}
            </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateEconomicCoreAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'inflation',
      icon: TrendingUp,
      color: '#F97316',
      title: 'Inflation & Prices',
      enabled: eco.inflation != null,
      summary: [`${eco.inflation}% annual inflation (${eco.years.inflation ?? ''})`, showRealRate ? `Real interest rate ${eco.realRate}% (${eco.years.realRate})` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateInflationParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={TrendingUp} label="Inflation Rate" value={`${eco.inflation}%`} sub={`Annual CPI change, World Bank ${eco.years.inflation ?? ''}`} color="#F97316" trend={(eco.inflation ?? 0) > 10 ? 'down' : 'up'} />
            {showRealRate && <StatCard icon={Zap} label="Real Interest Rate" value={`${eco.realRate}%`} sub={`World Bank ${eco.years.realRate} (inflation-adjusted lending rate)`} color="#F97316" />}
          </div>
          <PurchasingPowerCalc
            inflation={eco.inflation ?? 0}
            currency={eco.currency}
            symbol={eco.currencySymbol}
            primaryColor={primaryColor}
          />
          <div className="bg-orange-500/100/10 border border-orange-100 rounded-xl p-4">
            <p className="text-sm font-medium text-orange-300 mb-1">Plain Language: What does {eco.inflation}% inflation mean?</p>
            <p className="text-sm text-orange-400">
              If you bought groceries for {eco.currencySymbol}1,000 last year, the same basket costs approximately <strong>{eco.currencySymbol}{Math.round(1000 * (1 + (eco.inflation ?? 0) / 100)).toLocaleString()}</strong> today.
              Your money loses <strong>{eco.inflation}%</strong> of its purchasing power every year.
              {(eco.inflation ?? 0) > 20 ? ' This is very high — savings in cash are being eroded rapidly.' :
               (eco.inflation ?? 0) > 8 ? ' This is above global average and affects household budgets noticeably.' :
               ' This is within a manageable range.'}
            </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateInflationAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'employment',
      icon: Briefcase,
      color: '#8B5CF6',
      title: 'Employment & Labour',
      enabled: eco.unemployment != null,
      summary: [`${eco.unemployment}% unemployment (${eco.years.unemployment ?? ''})`, eco.povertyRate != null ? `${eco.povertyRate}% poverty rate` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateEmploymentParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={Briefcase} label="Unemployment" value={`${eco.unemployment}%`} sub={`Of labor force, World Bank ${eco.years.unemployment ?? ''}`} color="#8B5CF6" trend={(eco.unemployment ?? 0) > 8 ? 'down' : 'up'} />
            {eco.povertyRate != null && <StatCard icon={Users} label="Poverty Rate" value={`${eco.povertyRate}%`} sub={`Below the international poverty line, ${eco.years.poverty ?? ''}`} color="#8B5CF6" trend={eco.povertyRate > 20 ? 'down' : 'neutral'} />}
          </div>
          <div className="bg-purple-500/100/10 border border-purple-100 rounded-xl p-4">
            <p className="text-sm text-purple-300">
              <strong>{eco.unemployment}%</strong> unemployment{eco.laborForceM != null ? <> means roughly <strong>{Math.round(eco.laborForceM * (eco.unemployment ?? 0) / 100)}M people</strong> in {countryName} are actively seeking work.</> : <> in {countryName}.</>}
              {(eco.unemployment ?? 0) > 10 ? ' High unemployment strains social services and reduces consumer spending.' :
               (eco.unemployment ?? 0) > 5 ? ' Moderate levels suggest the economy is growing but not at full capacity.' :
               ' Near full employment suggests a healthy, active economy.'}
            </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateEmploymentAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'debt',
      icon: AlertTriangle,
      color: '#EF4444',
      title: 'National Debt & Fiscal Health',
      enabled: eco.debtToGdp != null && debtPerCitizen != null,
      summary: `${eco.debtToGdp}% debt-to-GDP (${eco.years.debtPctGdp ?? ''}) • ${eco.currencySymbol}${(debtPerCitizen ?? 0).toLocaleString()} per citizen`,
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateDebtParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard icon={AlertTriangle} label="Debt-to-GDP" value={`${eco.debtToGdp}%`} sub={`Central government debt, World Bank ${eco.years.debtPctGdp ?? ''}`} color="#EF4444" trend={(eco.debtToGdp ?? 0) > 90 ? 'down' : 'neutral'} />
            <StatCard icon={Users} label="Debt Per Citizen" value={`$${(debtPerCitizen ?? 0).toLocaleString()}`} sub="Each person owes" color="#EF4444" />
          </div>
          <div className="bg-red-500/100/10 border border-red-100 rounded-xl p-4">
            <p className="text-sm font-medium text-red-300 mb-1">What does this mean?</p>
            <p className="text-sm text-red-400">
              {countryName}'s national debt is <strong>{eco.debtToGdp}%</strong> of its entire annual GDP.
              Each citizen effectively owes <strong>${(debtPerCitizen ?? 0).toLocaleString()}</strong> as their share of this debt.
              {(eco.debtToGdp ?? 0) > 100 ? ' A debt-to-GDP ratio above 100% is considered very high — it limits government spending on public services.' :
               (eco.debtToGdp ?? 0) > 60 ? ' Above 60% is the EU\'s warning threshold. Servicing this debt consumes a significant portion of the annual budget.' :
               ' This is within manageable levels by global standards.'}
            </p>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateDebtAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'hdi',
      icon: Award,
      color: '#10B981',
      title: 'Human Development & Quality of Life',
      enabled: eco.gini != null || eco.literacyRate != null || eco.lifeExpectancy != null,
      summary: [eco.gini != null ? `Gini ${eco.gini} inequality coefficient` : null, eco.literacyRate != null ? `${eco.literacyRate}% literacy` : null, eco.lifeExpectancy != null ? `${eco.lifeExpectancy}yr life expectancy` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateHdiParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eco.gini != null && <StatCard icon={BarChart3} label="Gini Coefficient" value={eco.gini.toFixed(1)} sub={`${eco.gini > 40 ? 'High Inequality' : eco.gini > 30 ? 'Moderate' : 'Low Inequality'} — World Bank ${eco.years.gini ?? ''}`} color="#10B981" />}
            {eco.literacyRate != null && <StatCard icon={Award} label="Literacy Rate" value={`${eco.literacyRate}%`} sub={`World Bank ${eco.years.literacy ?? ''}`} color="#10B981" trend="up" />}
          </div>
          <div className="space-y-2 bg-transparent rounded-xl border border-white/8 p-4">
            {eco.literacyRate != null && <IndicatorBar label="Literacy Rate" value={eco.literacyRate} max={100} color="#3B82F6" format={v => `${v}%`} />}
            {eco.lifeExpectancy != null && <IndicatorBar label="Life Expectancy (out of 90)" value={eco.lifeExpectancy} max={90} color="#8B5CF6" format={v => `${v} yrs`} />}
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateHdiAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'growth-dashboard',
      icon: TrendingUp,
      color: '#10B981',
      title: '10-Year Growth Trends',
      enabled: true,
      summary: 'GDP, population & exports — World Bank data',
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateEconomyGrowthParagraph(countryName)}
          </p>
          <GrowthDashboard countryCode={countrySlugToIso2(country)} accentColor="#10B981" />
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateEconomyGrowthAfter(countryName)}
          </p>
        </div>
      ),
    },
    {
      id: 'trade',
      icon: Globe,
      color: '#0891B2',
      title: 'Trade & Foreign Investment',
      enabled: eco.tradeBalanceBillions != null || eco.fdiBillions != null || eco.remittancesBillions != null,
      summary: [eco.tradeBalanceBillions != null ? `Trade balance $${eco.tradeBalanceBillions}B` : null, eco.fdiBillions != null ? `FDI $${eco.fdiBillions}B` : null, eco.remittancesBillions != null ? `Remittances $${eco.remittancesBillions}B` : null].filter(Boolean).join(' • '),
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-sm text-gray-300 leading-relaxed">
            {generateTradeParagraph(countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eco.tradeBalanceBillions != null && <StatCard icon={Globe} label="Trade Balance" value={`$${Math.abs(eco.tradeBalanceBillions)}B`} sub={`${eco.tradeBalanceBillions < 0 ? 'Trade deficit' : 'Trade surplus'}, ${eco.years.tradeBalanceUsd ?? ''}`} color="#0891B2" trend={eco.tradeBalanceBillions >= 0 ? 'up' : 'down'} />}
            {eco.fdiBillions != null && <StatCard icon={Building2} label="Foreign Direct Investment" value={`$${eco.fdiBillions}B`} sub={`Annual FDI inflow, ${eco.years.fdiUsd ?? ''}`} color="#0891B2" trend={eco.fdiBillions > 20 ? 'up' : 'neutral'} />}
            {eco.remittancesBillions != null && (
              <StatCard icon={DollarSign} label="Remittances" value={`$${eco.remittancesBillions}B`} sub={`Received from abroad, World Bank ${eco.years.remittancesUsd ?? ''}`} color="#0891B2" />
            )}
          </div>
          {eco.tradeBalanceBillions != null && eco.tradeBalanceBillions < 0 && (
            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
              <p className="text-sm text-cyan-800">
                {countryName} imports <strong>${Math.abs(eco.tradeBalanceBillions)}B more</strong> than it exports annually.
                This trade deficit puts pressure on foreign exchange reserves and the local currency.
                {eco.remittancesBillions != null ? ` However, remittances of $${eco.remittancesBillions}B a year help partially offset this.` : ''}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-400 leading-relaxed">
            {generateTradeAfter(countryName)}
          </p>
        </div>
      ),
    },
  ];

  const visibleSections = sections.filter(sec => sec.enabled !== false);

  return (
    <div className="min-h-screen bg-transparent/4">
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
          <div className="bg-transparent rounded-2xl border border-white/8 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} style={{ color: primaryColor }} />
              <h2 className="font-bold text-white">Financial Stress Meter</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {generateStressMeterParagraph(countryName, cityName)}
            </p>
            {stress ? (
              <>
                <StressMeter score={stress.score} level={stress.level} primaryColor={primaryColor} />
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                  <div><div className="font-bold text-white">{stress.inflation}%</div><div>Inflation ({eco.years.inflation ?? ''})</div></div>
                  <div><div className="font-bold text-white">{stress.unemployment}%</div><div>Unemployment ({eco.years.unemployment ?? ''})</div></div>
                  {stress.debtToGdp != null && <div><div className="font-bold text-white">{stress.debtToGdp}%</div><div>Debt/GDP</div></div>}
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Score computed by WorldCityHub from World Bank inflation & unemployment data.</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Stress score unavailable — current World Bank inflation/unemployment data for {countryName} could not be loaded.</p>
            )}
            <p className="text-sm text-gray-400 leading-relaxed mt-4">
              {generateStressMeterAfter(countryName, cityName)}
            </p>
          </div>

          <div className="bg-transparent rounded-2xl border border-white/8 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target size={18} style={{ color: primaryColor }} />
              <h2 className="font-bold text-white">Global Misery Index</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-4">
              {generateMiseryParagraph(countryName)}
            </p>
            {miseryData ? (
              <MiseryTable data={miseryData} countrySlug={country} primaryColor={primaryColor} />
            ) : (
              <p className="text-sm text-gray-400">Comparison unavailable — World Bank data for the comparison countries could not be loaded.</p>
            )}
            <p className="text-xs text-gray-400 mt-3">Misery Index = Inflation + Unemployment, from the latest World Bank values for each country. Higher = more economic pain.</p>
            <p className="text-sm text-gray-400 leading-relaxed mt-4">
              {generateMiseryAfter(countryName)}
            </p>
          </div>
        </div>

        {!wb && (
          <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-100 rounded-xl p-4">
            <Info size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-400">Live economic indicators from the World Bank are unavailable for {countryName} right now. Figures will appear here when the data service responds — nothing is estimated or filled in.</p>
          </div>
        )}

        {/* Quick stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {eco.gdpBillions != null && <StatCard icon={DollarSign} label="GDP" value={`$${eco.gdpBillions}B`} sub={`World Bank ${eco.years.gdpUsd ?? ''}`} color={primaryColor} />}
          {eco.gdpGrowth != null && <StatCard icon={TrendingUp} label="Growth" value={`${eco.gdpGrowth}%`} sub={`${eco.years.gdpGrowth ?? ''}`} color="#10B981" trend={eco.gdpGrowth > 3 ? 'up' : 'neutral'} />}
          {eco.inflation != null && <StatCard icon={Activity} label="Inflation" value={`${eco.inflation}%`} sub={`${eco.years.inflation ?? ''}`} color="#F97316" trend={eco.inflation > 10 ? 'down' : 'up'} />}
          {eco.unemployment != null && <StatCard icon={Briefcase} label="Unemployment" value={`${eco.unemployment}%`} sub={`${eco.years.unemployment ?? ''}`} color="#8B5CF6" trend={eco.unemployment > 8 ? 'down' : 'up'} />}
        </div>

        {/* Accordion sections */}
        <div className="space-y-3">
          {visibleSections.map(section => (
            <div key={section.id} className="bg-transparent rounded-2xl border border-white/8 overflow-hidden">
              <button
                onClick={() => toggle(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-transparent/4 transition text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: `${section.color}15` }}>
                    <section.icon size={16} style={{ color: section.color }} />
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{section.title}</p>
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
        {stress && eco.gdpGrowth != null && (
        <div className="bg-transparent rounded-2xl border border-white/8 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} style={{ color: primaryColor }} />
            <h2 className="font-bold text-white">Opportunity Index for {cityName}</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            {generateOpportunityParagraph(cityName, countryName)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Business Environment',
                score: Math.max(10, Math.min(100, 100 - stress.score * 0.6 + eco.gdpGrowth * 3)),
                color: '#3B82F6',
                insight: (eco.gdpGrowth ?? 0) > 4 ? 'Growing market, good entry point' : (eco.gdpGrowth ?? 0) > 1 ? 'Stable but cautious investment climate' : 'Challenging business conditions',
              },
              {
                label: 'Real Estate Potential',
                score: Math.max(10, Math.min(100, 70 - (eco.inflation ?? 0) * 0.8 + (eco.gdpGrowth ?? 0) * 5)),
                color: '#10B981',
                insight: (eco.inflation ?? 0) > 15 ? 'High inflation erodes returns' : (eco.gdpGrowth ?? 0) > 4 ? 'Strong demand growth expected' : 'Moderate appreciation potential',
              },
              {
                label: 'Export Opportunity',
                score: Math.max(10, Math.min(100, 60 + ((eco.tradeBalanceBillions ?? 0) < 0 ? 15 : -10) + (eco.fdiBillions ?? 0) * 0.5)),
                color: '#8B5CF6',
                insight: (eco.tradeBalanceBillions ?? 0) < -20 ? 'High import dependency = export gap opportunity' : (eco.fdiBillions ?? 0) > 50 ? 'Foreign confidence is high' : 'Emerging export potential',
              },
            ].map(item => (
              <div key={item.label} className="bg-transparent/4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-300">{item.label}</p>
                  <span className="text-lg font-bold" style={{ color: item.color }}>{Math.round(item.score)}</span>
                </div>
                <div className="h-2 bg-transparent/8 rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
                </div>
                <p className="text-xs text-gray-500">{item.insight}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 mt-3">Scores computed by WorldCityHub from World Bank indicators — an editorial guide, not an official statistic.</p>
          <p className="text-sm text-gray-400 leading-relaxed mt-4">
            {generateOpportunityAfter(cityName, countryName)}
          </p>
        </div>
        )}

        {/* Footer note */}
        <div className="flex items-start gap-2 bg-blue-500/100/10 border border-blue-100 rounded-xl p-4">
          <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-400">
            Data sourced from World Bank, IMF, and national statistics bureaus. Figures are latest available estimates and subject to revision. This page is for informational purposes only and does not constitute financial advice.
          </p>
        </div>

      </div>
    </div>
  );
}
