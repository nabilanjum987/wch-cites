'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import type { City } from '@/types/city';
import {
  generatePrayerIntroductionParagraph,
  generatePrayerTimingsParagraph,
  generateQiblaParagraph,
  generateWeeklyTimetableParagraph,
  generateMosquesFacilitiesParagraph,
  generateHijriCalendarParagraph,
  generateSpiritualSignificanceParagraph,
} from '@/lib/paragraphs/prayerParagraphs';
import { generatePrayerMeta, generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

export const revalidate = 3600;

interface PrayerTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  Sunset: string;
}

interface HijriDate {
  date: string;
  month: { en: string };
  year: string;
  weekday: { en: string };
}

interface ApiResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTimings;
    date: {
      hijri: HijriDate;
      gregorian: {
        date: string;
        month: { en: string };
        year: string;
      };
    };
  };
}

// Hadith database
const HADITHS = [
  { arabic: 'الصلاة عمود الدين', english: 'Prayer is the pillar of religion' },
  { arabic: 'من ترك الصلاة متعمدا فقد كفر', english: 'Whoever intentionally misses prayers has disbelieved' },
  { arabic: 'أحب الأعمال إلى الله الصلاة على وقتها', english: 'The best deed is prayer performed on time' },
  { arabic: 'إن الصلاة تنهى عن الفحشاء والمنكر', english: 'Prayer prevents immorality and wrongdoing' },
  { arabic: 'بين العبد وبين الكفر ترك الصلاة', english: 'The covenant between us and them is prayer' },
];

// Famous mosques in Lahore
const LAHORE_MOSQUES = [
  {
    name: 'Badshahi Mosque',
    description: 'Iconic Mughal monument built in 1673, one of the largest mosques in the world',
    year: '1673',
  },
  {
    name: 'Data Darbar',
    description: 'Sufi shrine of Data Ganj Baksh, spiritual hub of Lahore',
    year: '11th Century',
  },
  {
    name: 'Masjid Wazir Khan',
    description: 'Ornate Mughal mosque with intricate tile work and calligraphy',
    year: '1634',
  },
  {
    name: 'Jamia Masjid',
    description: 'Historic mosque in the Old City of Lahore',
    year: '1627',
  },
];

const PRAYER_NAMES = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_LABELS = ['Dawn', 'Midday', 'Afternoon', 'Sunset', 'Night'];
const FAITH_TABS = [
  { icon: '☪️', label: 'Islam', religion: 'Islam' },
  { icon: '✝️', label: 'Christian', religion: 'Christian' },
  { icon: '🕉️', label: 'Hindu', religion: 'Hindu' },
  { icon: '✡️', label: 'Jewish', religion: 'Jewish' },
  { icon: '☸️', label: 'Buddhist', religion: 'Buddhist' },
  { icon: '🙏', label: 'Sikh', religion: 'Sikh' },
];

export default function PrayerTimesPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [prayerData, setPrayerData] = useState<PrayerTimings | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ prayer: string; timeLeft: string; seconds: number }>({
    prayer: '',
    timeLeft: '',
    seconds: 0,
  });
  const [selectedFaith, setSelectedFaith] = useState<string>('Islam');
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [hadith, setHadith] = useState(HADITHS[0]);

  // Parse time string HH:MM to minutes
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Get next prayer info
  const getNextPrayer = () => {
    if (!prayerData) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: 'Fajr', time: prayerData.Fajr },
      { name: 'Dhuhr', time: prayerData.Dhuhr },
      { name: 'Asr', time: prayerData.Asr },
      { name: 'Maghrib', time: prayerData.Maghrib },
      { name: 'Isha', time: prayerData.Isha },
    ];

    for (let prayer of prayers) {
      const prayerMinutes = timeToMinutes(prayer.time);
      if (prayerMinutes > currentMinutes) {
        const diffSeconds = (prayerMinutes - currentMinutes) * 60;
        return {
          name: prayer.name,
          time: prayer.time,
          secondsLeft: diffSeconds,
        };
      }
    }

    // If no prayer found today, next is Fajr tomorrow
    const tomorrowFajrMinutes = timeToMinutes(prayerData.Fajr);
    const secondsUntilMidnight = (24 * 60 - currentMinutes) * 60;
    const diffSeconds = secondsUntilMidnight + tomorrowFajrMinutes * 60;

    return {
      name: 'Fajr (Tomorrow)',
      time: prayerData.Fajr,
      secondsLeft: diffSeconds,
    };
  };

  // Format seconds to readable countdown
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const next = getNextPrayer();
      if (next) {
        const newSeconds = next.secondsLeft - 1;
        setCountdown({
          prayer: next.name,
          timeLeft: formatCountdown(newSeconds),
          seconds: newSeconds,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerData]);

  // Load prayer times and other data
  useEffect(() => {
    const loadData = async () => {
      try {
        const country = Array.isArray(params.country) ? params.country[0] : params.country;
        const province = Array.isArray(params.province) ? params.province[0] : params.province;
        const citySlug = Array.isArray(params.city) ? params.city[0] : params.city;

        const cityData = await getCityData(country, province, citySlug);
        if (!cityData) {
          setError('City not found');
          setLoading(false);
          return;
        }

        setCity(cityData);

        // Fetch prayer times
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const dateString = `${dd}-${mm}-${yyyy}`;

        const response = await fetch(
          `https://api.aladhan.com/v1/timings/${dateString}?latitude=${cityData.lat}&longitude=${cityData.lng}&method=1`
        );

        const apiData: ApiResponse = await response.json();

        if (apiData.code === 200 && apiData.data) {
          setPrayerData(apiData.data.timings);
          setHijriDate(apiData.data.date.hijri);

          // Initialize countdown
          const next = getNextPrayer();
          if (next) {
            setCountdown({
              prayer: next.name,
              timeLeft: formatCountdown(next.secondsLeft),
              seconds: next.secondsLeft,
            });
          }

          // Load weekly data (7 days)
          const weekData = [];
          for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            const dateStr = `${d}-${m}-${y}`;

            try {
              const weekResponse = await fetch(
                `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${cityData.lat}&longitude=${cityData.lng}&method=1`
              );
              const weekApiData: ApiResponse = await weekResponse.json();
              if (weekApiData.code === 200) {
                weekData.push({
                  date: new Date(date),
                  timings: weekApiData.data.timings,
                });
              }
            } catch (e) {
              console.error('Error fetching weekly data', e);
            }
          }
          setWeeklyData(weekData);
        }

        // Set random hadith
        setHadith(HADITHS[Math.floor(Math.random() * HADITHS.length)]);
      } catch (err) {
        console.error(err);
        setError('Error loading prayer times data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

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
    if (!city || !prayerData) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-prayer';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'prayer-times'));
    document.head.appendChild(breadcrumbScript);

    // Update meta tags
    document.title = `${city.name} Prayer Times Today — Namaz Timings Fajr ${prayerData.Fajr}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `${city.name} prayer times: Fajr ${prayerData.Fajr}, Dhuhr ${prayerData.Dhuhr}, Asr ${prayerData.Asr}, Maghrib ${prayerData.Maghrib}, Isha ${prayerData.Isha}. Qibla 262°.`
      );
    }

    return () => {
      breadcrumbScript.remove();
    };
  }, [city, prayerData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#01411C] via-[#030712] to-[#030712]">
      {/* HERO SECTION */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full py-12 px-4 md:py-20 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            🕌 Prayer Times
          </h1>
          <p className="text-xl text-gray-300">
            {city?.name}, {city?.province}, {city?.country}
          </p>
          {hijriDate && (
            <p className="text-lg text-emerald-400 mt-2 font-medium">
              {hijriDate.date} {hijriDate.month.en} {hijriDate.year} AH
            </p>
          )}
        </div>
      </motion.header>

      <div className="w-full px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {loading ? (
            <div className="text-center text-gray-400">Loading prayer times...</div>
          ) : error ? (
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : (
            <>
              {/* NEXT PRAYER COUNTDOWN */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-cyan-600/20 blur-2xl" />
                  <GlassCard variant="premium" glowColor="green" className="relative p-8 md:p-12">
                    <div className="text-center space-y-4">
                      <p className="text-emerald-300 text-lg font-semibold">NEXT PRAYER</p>
                      <h2 className="text-5xl md:text-6xl font-bold text-white">{countdown.prayer}</h2>
                      <p className="text-gray-400 text-lg">Prayer time at: {prayerData && PRAYER_NAMES.includes(countdown.prayer.split(' ')[0]) && prayerData[countdown.prayer.split(' ')[0] as keyof PrayerTimings]}</p>

                      {/* CIRCULAR COUNTDOWN TIMER */}
                      <div className="flex justify-center py-8">
                        <motion.div
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="relative w-32 h-32 md:w-48 md:h-48"
                        >
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="rgba(16, 185, 129, 0.2)"
                              strokeWidth="2"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="url(#grad1)"
                              strokeWidth="3"
                              strokeDasharray={`${(countdown.seconds / (24 * 3600)) * 283} 283`}
                              strokeLinecap="round"
                              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                            />
                            <defs>
                              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#06b6d4" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-3xl md:text-5xl font-bold text-white font-mono">
                              {countdown.timeLeft}
                            </p>
                            <p className="text-sm text-gray-400 mt-2">until {countdown.prayer}</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>

              {/* ALL 5 PRAYERS CARDS */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">Today's Prayer Schedule</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {PRAYER_NAMES.map((prayer, idx) => (
                    <motion.div key={prayer} variants={itemVariants}>
                      <GlassCard
                        variant="premium"
                        glowColor="green"
                        className="h-full p-6 flex flex-col justify-between hover:bg-emerald-500/15 transition-colors"
                      >
                        <div>
                          <p className="text-emerald-300 text-xs uppercase tracking-widest font-bold">
                            {PRAYER_LABELS[idx]}
                          </p>
                          <h4 className="text-2xl font-bold text-white mt-2">{prayer}</h4>
                        </div>
                        <div className="mt-6 space-y-3">
                          <p className="text-3xl font-mono font-bold text-emerald-400">
                            {prayerData?.[prayer as keyof PrayerTimings] || '--:--'}
                          </p>
                          <div className="pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-400">
                              {countdown.prayer === prayer ? '🟢 Current' : '⏳ Upcoming'}
                            </p>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* QIBLA DIRECTION */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <GlassCard variant="default" className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-white mb-4">🧭 Qibla Direction</h3>
                      <p className="text-4xl font-bold text-emerald-400 mb-2">262°</p>
                      <p className="text-xl text-gray-300">West-Southwest toward Mecca</p>
                      <p className="text-gray-400 mt-2">
                        Located {city?.name} is approximately <span className="font-semibold text-white">4,452 km</span> from Mecca
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <motion.svg
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="w-32 h-32"
                        viewBox="0 0 100 100"
                      >
                        <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(16, 185, 129, 0.3)" strokeWidth="1" />
                        <line x1="50" y1="50" x2="50" y2="10" stroke="#10b981" strokeWidth="2" />
                        <polygon points="50,10 47,18 53,18" fill="#10b981" />
                        <text x="50" y="95" textAnchor="middle" fill="#10b981" fontSize="8">
                          MECCA
                        </text>
                      </motion.svg>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* WEEKLY TIMETABLE */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">📅 Weekly Prayer Times</h3>
                <GlassCard variant="default" className="p-6 overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2 text-emerald-400 font-bold">Day</th>
                        <th className="text-center py-3 px-2 text-emerald-400 font-bold">Fajr</th>
                        <th className="text-center py-3 px-2 text-emerald-400 font-bold">Dhuhr</th>
                        <th className="text-center py-3 px-2 text-emerald-400 font-bold">Asr</th>
                        <th className="text-center py-3 px-2 text-emerald-400 font-bold">Maghrib</th>
                        <th className="text-center py-3 px-2 text-emerald-400 font-bold">Isha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {weeklyData.map((day, idx) => {
                        const dayName = day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                        return (
                          <tr key={idx} className={`border-b border-white/10 ${idx === 0 ? 'bg-emerald-500/10' : ''}`}>
                            <td className="py-3 px-2 font-semibold text-white">{dayName}</td>
                            <td className="text-center py-3 px-2 font-mono text-gray-300">{day.timings.Fajr}</td>
                            <td className="text-center py-3 px-2 font-mono text-gray-300">{day.timings.Dhuhr}</td>
                            <td className="text-center py-3 px-2 font-mono text-gray-300">{day.timings.Asr}</td>
                            <td className="text-center py-3 px-2 font-mono text-gray-300">{day.timings.Maghrib}</td>
                            <td className="text-center py-3 px-2 font-mono text-gray-300">{day.timings.Isha}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </GlassCard>
              </motion.div>

              {/* FAITH TABS */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">🙏 Religious Diversity in {city?.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {FAITH_TABS.map((faith) => (
                    <button
                      key={faith.religion}
                      onClick={() => setSelectedFaith(faith.religion)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedFaith === faith.religion
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {faith.icon} {faith.label}
                    </button>
                  ))}
                </div>
                {selectedFaith === 'Islam' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <GlassCard variant="premium" glowColor="green" className="p-6">
                      <p className="text-gray-300">
                        Islam is the predominant religion in {city?.name}, practiced by approximately {city?.religion_percent}% of the population.
                      </p>
                    </GlassCard>
                  </motion.div>
                )}
              </motion.div>

              {/* FAMOUS MOSQUES */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">🕌 Famous Mosques in {city?.name}</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LAHORE_MOSQUES.map((mosque) => (
                    <motion.div key={mosque.name} variants={itemVariants}>
                      <GlassCard variant="default" className="p-6 h-full hover:bg-emerald-500/10 transition-colors">
                        <p className="text-emerald-400 text-sm font-bold mb-1">Est. {mosque.year}</p>
                        <h4 className="text-xl font-bold text-white mb-3">{mosque.name}</h4>
                        <p className="text-gray-300">{mosque.description}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* HADITH OF THE DAY */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">📖 Hadith of the Day</h3>
                <GlassCard variant="premium" glowColor="green" className="p-8 text-center">
                  <p className="text-emerald-400 font-amiri text-2xl mb-4 font-bold" style={{ fontFamily: 'Amiri, serif' }}>
                    {hadith.arabic}
                  </p>
                  <p className="text-white text-xl italic mb-4">"{hadith.english}"</p>
                  <p className="text-gray-400 text-sm">Refresh page to see different hadith</p>
                </GlassCard>
              </motion.div>

              {/* SEO CONTENT SECTIONS */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-16 border-t border-white/10 pt-12">
                <div className="space-y-12">
                  {/* Prayer Introduction */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h2 className="text-3xl font-bold text-white mb-6">Prayer Times in {city?.name}: A Comprehensive Guide</h2>
                    {city && prayerData && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generatePrayerIntroductionParagraph(city, prayerData),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Prayer Timings */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Daily Prayer Schedule</h3>
                    {city && prayerData && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generatePrayerTimingsParagraph(city, prayerData),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Qibla Direction */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Qibla Direction and Orientation</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateQiblaParagraph(city),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Weekly Timetable */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Weekly Prayer Timetable</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateWeeklyTimetableParagraph(city),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Mosques and Facilities */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Mosques and Prayer Facilities</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateMosquesFacilitiesParagraph(city),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Hijri Calendar */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Islamic Lunar Calendar</h3>
                    {city && hijriDate && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateHijriCalendarParagraph(city, hijriDate),
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Spiritual Significance */}
                  <motion.div variants={itemVariants} className="prose prose-invert max-w-none">
                    <h3 className="text-2xl font-bold text-white mb-4">Spiritual Significance of Prayer</h3>
                    {city && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: generateSpiritualSignificanceParagraph(city),
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
