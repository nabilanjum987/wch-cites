'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Briefcase, Activity, Star, Sparkles,
  Hash, Palette, Smile, Users, Sun, Moon, DollarSign,
  Compass, Clock, Calendar, Globe, Telescope, User, CheckCircle, XCircle
} from 'lucide-react';
import type { ZodiacSign, DailyReading, WeeklyForecast, MonthlyForecast, YearlyForecast } from '../../types/horoscope';
import { ZODIAC_SIGNS, ELEMENT_COLORS, ELEMENT_BG, ELEMENT_TEXT, FAMOUS_PEOPLE } from '../../types/horoscope';
import { fetchDailyReading, fetchWeeklyForecast, fetchMonthlyForecast, fetchYearlyForecast, getSignData } from '../../lib/apis/astro';
import { SIGN_ARTWORK } from '../../lib/horoscope/artwork';
import Link from 'next/link';

interface Props {
  sign: ZodiacSign;
  onBack: () => void;
  primaryColor: string;
  // H1 override: sign pages pass "<Sign> Horoscope Today" for every sign
  // (owner's locked keyword model, 3 Nov 2026). Default preserves the
  // legacy HoroscopePage.tsx usage.
  heading?: string;
}

function StarRating({ rating, color, size = 18 }: { rating: number; color: string; size?: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className={i < rating ? 'fill-current' : ''} style={{ color: i < rating ? color : '#E5E7EB' }} />
      ))}
    </div>
  );
}

const METRIC_CONFIG = [
  { key: 'love' as const, label: 'Love', icon: <Heart size={16} /> },
  { key: 'career' as const, label: 'Career', icon: <Briefcase size={16} /> },
  { key: 'finance' as const, label: 'Finance', icon: <DollarSign size={16} /> },
  { key: 'health' as const, label: 'Health', icon: <Activity size={16} /> },
  { key: 'spirituality' as const, label: 'Spirituality', icon: <Sparkles size={16} /> },
];

export default function SignDetailPage({ sign, onBack, primaryColor, heading }: Props) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const signData = useMemo(() => getSignData(sign), [sign]);
  const reading: DailyReading = useMemo(() => fetchDailyReading(sign), [sign]);
  const weekly: WeeklyForecast = useMemo(() => fetchWeeklyForecast(sign), [sign]);
  const monthly: MonthlyForecast = useMemo(() => fetchMonthlyForecast(sign), [sign]);
  const yearly: YearlyForecast = useMemo(() => fetchYearlyForecast(sign), [sign]);
  const artwork = SIGN_ARTWORK[sign];
  const compatSignData = ZODIAC_SIGNS.find(s => s.key === reading.compatibility);
  const challengingSignData = ZODIAC_SIGNS.find(s => s.key === reading.challenging);
  const elemColor = ELEMENT_COLORS[signData.element];
  const famousPeople = FAMOUS_PEOPLE[sign] ?? [];

  const allSigns = ZODIAC_SIGNS;
  const currentIndex = allSigns.findIndex(s => s.key === sign);
  const prevSign = allSigns[(currentIndex - 1 + 12) % 12];
  const nextSign = allSigns[(currentIndex + 1) % 12];

  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh" }} className="font-[Inter,sans-serif]">
      {/* Header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 60%), radial-gradient(circle at 70% 20%, white 0%, transparent 50%)' }} />
        <div className="relative max-w-3xl mx-auto px-4 pt-5 pb-7">
          <button onClick={onBack} className="flex items-center gap-1.5 text-white/80 text-sm font-medium mb-4 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            All Signs
          </button>

          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 rounded-2xl overflow-hidden shrink-0"
              style={{ backgroundColor: `${elemColor}25` }}
            >
              {/* The sign's own classical plate (Sidney Hall, Urania's
                  Mirror, 1825), shown as artwork; credited below the
                  header and again in Sources and Method. */}
              <img src={artwork.src} alt={artwork.alt} className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">{heading ?? signData.name}</h1>
              <p className="text-white/70 text-sm mt-0.5">{signData.dates}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${ELEMENT_BG[signData.element]} ${ELEMENT_TEXT[signData.element]}`}>
                  {signData.element}
                </span>
                <span className="text-xs text-white/60">Ruled by {signData.ruling_planet}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Artwork credit, as a caption below the header artwork (never
            written on the image itself). */}
        <p className="text-[11px] text-gray-500 mb-4">
          Artwork: &ldquo;{artwork.plate}&rdquo; by {artwork.credit}.
        </p>

        {/* Tab Navigation: the four reading periods */}
        <div className="flex gap-1 p-1 bg-white rounded-xl shadow-sm border border-gray-100 mb-5">
          {[
            { key: 'daily' as const, label: 'Daily', icon: <Sun size={14} /> },
            { key: 'weekly' as const, label: 'Weekly', icon: <Calendar size={14} /> },
            { key: 'monthly' as const, label: 'Monthly', icon: <Globe size={14} /> },
            { key: 'yearly' as const, label: 'Yearly', icon: <Telescope size={14} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key ? 'text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={activeTab === tab.key ? { backgroundColor: primaryColor } : {}}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* DAILY TAB */}
          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Overall Rating */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} style={{ color: primaryColor }} />
                    <h2 className="font-bold text-gray-900 text-sm">Today's Horoscope</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Overall</span>
                    <StarRating rating={reading.overall} color={primaryColor} />
                  </div>
                </div>

                {/* Narrative */}
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{reading.narrative}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mb-5">
                  Basis: today&apos;s computed planetary positions (Schlyter&apos;s Keplerian method); the narrative and meters are composed from the aspects those positions form, as set out in the transits card below.
                </p>

                {/* All Metrics */}
                <div className="grid grid-cols-5 gap-2">
                  {METRIC_CONFIG.map((m) => (
                    <div key={m.key} className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <div className="flex items-center justify-center mb-1.5">
                        <span style={{ color: elemColor }}>{m.icon}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-gray-500 mb-1">{m.label}</p>
                      <div className="flex justify-center">
                        <StarRating rating={reading[m.key]} color={elemColor} size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lucky Elements */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <Hash size={18} style={{ color: primaryColor }} />
                  <h2 className="font-bold text-gray-900 text-sm">Lucky Today</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Hash size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Number</p>
                    <p className="text-lg font-bold text-gray-900">{reading.lucky_number}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Palette size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Color</p>
                    <p className="text-sm font-bold text-gray-900">{reading.lucky_color}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Sparkles size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Gemstone</p>
                    <p className="text-sm font-bold text-gray-900">{reading.lucky_gemstone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Compass size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Direction</p>
                    <p className="text-sm font-bold text-gray-900">{reading.lucky_direction}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <Clock size={16} className="mx-auto mb-1 text-gray-400" />
                    <p className="text-[10px] text-gray-500">Best Time</p>
                    <p className="text-sm font-bold text-gray-900">{reading.best_time}</p>
                  </div>
                </div>
              </div>

              {/* Today's Computed Transits (R8) */}
              {reading.transits && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={18} style={{ color: primaryColor }} />
                    <h2 className="font-bold text-gray-900 text-sm">Today's Computed Transits</h2>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Real planetary positions for today (12:00 UTC), computed, not generated text. Your lucky
                    number, colour, time, direction and the meters above are derived from these longitudes and
                    their aspects by the fixed rules noted below.
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                    {reading.transits.map((t) => (
                      <div key={t.planet} className="bg-gray-50 rounded-xl p-2 text-center">
                        <p className="text-[10px] font-semibold text-gray-500">{t.planet}{t.retrograde ? ' ℞' : ''}</p>
                        <p className="text-xs font-bold text-gray-900">{t.sign}</p>
                        <p className="text-[10px] text-gray-500">{t.degree.toFixed(1)}°</p>
                      </div>
                    ))}
                  </div>
                  {reading.transit_aspects && reading.transit_aspects.length > 0 && (
                    <p className="text-xs text-gray-600 mb-2">
                      <span className="font-semibold">Key aspects to your ruler:</span>{' '}
                      {reading.transit_aspects.join(' · ')}
                    </p>
                  )}
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    {reading.transit_method} Lucky number from the Moon's and your ruler's longitudes; lucky
                    colour from the planet in tightest aspect to your ruler; best time from the Moon's elongation
                    from the Sun; meters from harmonious vs tense aspect strength per life area. Horoscope
                    readings are for entertainment.
                  </p>
                </div>
              )}

              {/* Compatibility Today */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={18} style={{ color: primaryColor }} />
                  <h2 className="font-bold text-gray-900 text-sm">Today's Compatibility</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3.5 flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-600 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Best Match</p>
                      <p className="font-bold text-gray-900">
                        {compatSignData?.symbol} {compatSignData?.name}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3.5 flex items-center gap-3">
                    <XCircle size={20} className="text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Challenging</p>
                      <p className="font-bold text-gray-900">
                        {challengingSignData?.symbol} {challengingSignData?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* WEEKLY TAB */}
          {activeTab === 'weekly' && (
            <motion.div key="weekly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} style={{ color: primaryColor }} />
                    <h2 className="font-bold text-gray-900 text-sm">Weekly Forecast</h2>
                  </div>
                  <span className="text-xs text-gray-500">{weekly.week_start} - {weekly.week_end}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-500">Overall</span>
                  <StarRating rating={weekly.overall} color={primaryColor} />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{weekly.summary}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mb-4">{weekly.basis}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-green-700 mb-1">Best Days</p>
                    <p className="text-sm font-bold text-gray-900">{weekly.best_days.join(', ')}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-red-600 mb-1">Challenging Days</p>
                    <p className="text-sm font-bold text-gray-900">{weekly.challenging_days.length > 0 ? weekly.challenging_days.join(', ') : 'None'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* MONTHLY TAB */}
          {activeTab === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe size={18} style={{ color: primaryColor }} />
                    <h2 className="font-bold text-gray-900 text-sm">{monthly.month_name} Forecast</h2>
                  </div>
                  <StarRating rating={monthly.overall} color={primaryColor} />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{monthly.summary}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mb-4">{monthly.basis}</p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-gray-500">Key dates:</p>
                  {monthly.highlight_dates.map((d) => (
                    <span key={d} className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-medium">{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* YEARLY TAB */}
          {activeTab === 'yearly' && (
            <motion.div key="yearly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Telescope size={18} style={{ color: primaryColor }} />
                    <h2 className="font-bold text-gray-900 text-sm">{yearly.year} Yearly Forecast</h2>
                  </div>
                  <StarRating rating={yearly.overall} color={primaryColor} />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1">Your Season</p>
                    <p className="text-xs font-bold text-gray-900">{yearly.season_start} to {yearly.season_end}</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-semibold text-green-700 mb-1">Strongest Month</p>
                    <p className="text-xs font-bold text-gray-900">{yearly.best_month}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] font-semibold text-red-600 mb-1">Quietest Month</p>
                    <p className="text-xs font-bold text-gray-900">{yearly.quietest_month}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">{yearly.summary}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mb-4">{yearly.basis}</p>
                <div className="flex flex-wrap gap-2">
                  <p className="text-xs text-gray-500">Strongest days:</p>
                  {yearly.highlight_dates.map((d) => (
                    <span key={d} className="text-xs bg-gray-100 px-2 py-0.5 rounded-lg font-medium">{d}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} style={{ color: primaryColor }} />
            <h2 className="font-bold text-gray-900 text-sm">Sign Profile</h2>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Element', value: signData.element.charAt(0).toUpperCase() + signData.element.slice(1) },
              { label: 'Ruling Planet', value: signData.ruling_planet },
              { label: 'Quality', value: ['Cardinal', 'Fixed', 'Mutable'][currentIndex % 3] },
              { label: 'Polarity', value: currentIndex % 2 === 0 ? 'Positive (Yang)' : 'Negative (Yin)' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-semibold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Famous {signData.name}s</p>
            <div className="flex flex-wrap gap-2">
              {famousPeople.map((person) => (
                <span key={person} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg">{person}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigate Signs */}
        <div className="grid grid-cols-2 gap-3">
          <Link href={`/horoscope/${prevSign.key}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md transition-shadow group block">
            <p className="text-xs text-gray-400 mb-1">Previous</p>
            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">{prevSign.symbol} {prevSign.name}</p>
          </Link>
          <Link href={`/horoscope/${nextSign.key}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md transition-shadow group block">
            <p className="text-xs text-gray-400 mb-1">Next</p>
            <p className="font-bold text-gray-900 text-sm flex items-center gap-2">{nextSign.symbol} {nextSign.name}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
