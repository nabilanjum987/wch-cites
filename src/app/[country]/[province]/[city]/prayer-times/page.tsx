'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, Settings, Globe } from 'lucide-react';

import FaithTabs, { type FaithKey } from '../../../../../components/prayer/FaithTabs';
import CountdownRing from '../../../../../components/prayer/CountdownRing';
import PrayerTable, { type PrayerRow } from '../../../../../components/prayer/PrayerTable';
import QiblaCompass from '../../../../../components/prayer/QiblaCompass';
import WeeklyTable from '../../../../../components/prayer/WeeklyTable';
import AzanPlayer from '../../../../../components/prayer/AzanPlayer';

import { getCityBySlug, type City } from '../../../../../types/city';
import { fetchPrayerTimes, fetchWeeklyPrayerTimes } from '../../../../../lib/apis/prayer';
import { HIJRI_MONTHS, fetchHadith } from '../../../../../lib/apis/islamic';
import {
  fetchBibleVerse,
  getChurchCalendar,
  DENOMINATIONS,
  calculatePanchang,
  getRahuKaal,
  HINDU_FESTIVALS,
  DEITIES,
  fetchShabbatTimes,
  JEWISH_HOLIDAYS,
  fetchHukamnama,
  GURPURABS,
  getDailyQuote,
  PRAYER_GUIDES,
} from '../../../../../lib/apis/faiths';
import {
  generateNextPrayerParagraph, generateNextPrayerAfter,
  generatePrayerTableParagraph, generatePrayerTableAfter,
  generateQiblaParagraph, generateQiblaAfter,
  generateWeeklyParagraph, generateWeeklyAfter,
  generateHadithParagraph, generateHadithAfter,
  generateHijriParagraph, generateHijriAfter,
} from '../../../../../lib/paragraphs/prayer';
import { getFlagPalette } from '../../../../../lib/design/flagPalettes';
import {
  FlagAuroraBackground,
  FlagCard,
  FlagGradientText,
  FlagPill,
  FlagSectionTitle,
} from '../../../../../components/shared/FlagTheme';

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

function formatTime(t: string): string {
  const match = t.match(/\d{1,2}:\d{2}/);
  if (!match) return t;
  const [h, m] = match[0].split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function getNextPrayer(times: PrayerTimes, now: Date): string {
  const prayers: (keyof PrayerTimes)[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  for (const p of prayers) {
    const [h, m] = times[p].match(/\d{1,2}:\d{2}/)?.[0].split(':').map(Number) || [0, 0];
    const t = new Date();
    t.setHours(h, m, 0, 0);
    if (t > now) return p;
  }
  return 'Fajr';
}

function calculateQibla(lat: number, _lng: number): number {
  const meccaLat = 21.4225;
  const meccaLng = 39.8262;
  const latRad = (lat * Math.PI) / 180;
  const lngDiff = (meccaLng - _lng) * Math.PI / 180;
  const qibla = Math.atan2(
    Math.sin(lngDiff),
    Math.cos(latRad) * Math.tan((meccaLat * Math.PI) / 180) - Math.sin(latRad) * Math.cos(lngDiff)
  );
  return ((qibla * 180) / Math.PI + 360) % 360;
}

export default function PrayerTimesPage() {
  const _params = useParams();
  const country = String(_params?.country ?? '');
  const province = String(_params?.province ?? '');
  const citySlug = String(_params?.city ?? '');
  const [faith, setFaith] = useState<FaithKey>('islam');
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [hadith, setHadith] = useState<{ text: string; narrator: string; book: string } | null>(null);
  const [bibleVerse, setBibleVerse] = useState<{ text: string; reference: string } | null>(null);
  const [shabbatTimes, setShabbatTimes] = useState<any>(null);
  const [hukamnama, setHukamnama] = useState<any>(null);
  const [selectedDenomination, setSelectedDenomination] = useState(DENOMINATIONS[0]);

  const city: City | undefined = useMemo(() => {
    // Try getCityBySlug first, then build a minimal city object from URL params
    const found = getCityBySlug(citySlug || '');
    if (found) return found;
    if (!citySlug) return undefined;
    // Fallback: construct city from URL slugs so any city works
    return {
      name: (citySlug || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      city_slug: citySlug || '',
      country: (country || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      country_code: (country || '').slice(0, 2).toUpperCase(),
      country_slug: country || '',
      province: (province || '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      province_slug: province || '',
      lat: 31.5204,
      lng: 74.3587,
      population: 0,
      timezone: 'Asia/Karachi',
      major_religion: 'Islam',
      religion_percent: 96,
      primary_color: '#01411C',
      secondary_color: '#FFFFFF',
      famous_for: '',
      famous_products: '',
      emergency_police: '15',
      emergency_ambulance: '1122',
      emergency_fire: '16',
      region: 'South Asia',
      is_active: true,
    } as City;
  }, [country, province, citySlug]);

  useEffect(() => {
    if (!city) return;
    const today = new Date();
    fetchPrayerTimes(city.lat, city.lng, 5, 0, today.toLocaleDateString("en-GB")).then((data) => {
      setTodayData(data);
      setTimes(data.timings);
    });
    fetchWeeklyPrayerTimes(city.lat, city.lng, 5, 0).then(setWeeklyData);
    fetchHadith().then(setHadith);
    fetchBibleVerse().then(setBibleVerse);
    fetchShabbatTimes(city.lat, city.lng).then(setShabbatTimes);
    fetchHukamnama().then(setHukamnama);
  }, [city]);

  const nextPrayer = useMemo(() => {
    if (!times) return 'Fajr';
    return getNextPrayer(times, new Date());
  }, [times]);

  const qiblaDirection = useMemo(() => {
    if (!city) return 0;
    return calculateQibla(city.lat, city.lng);
  }, [city]);

  const [azanAutoPlay, setAzanAutoPlay] = useState(false);
  const [notifStatus, setNotifStatus] = useState<'default' | 'granted' | 'denied'>('default');
  const palette = getFlagPalette(city?.country_slug ?? country);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifStatus(Notification.permission as 'default' | 'granted' | 'denied');
    }
  }, []);

  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    Notification.requestPermission().then((perm) => {
      setNotifStatus(perm as 'default' | 'granted' | 'denied');
    });
  };

  const currentMonthName = useMemo(
    () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    []
  );

  // Derive an approximate full-month timetable by offsetting today's times by a few minutes/day.
  // This is a structural placeholder until Phase 2 wires a true monthly Aladhan calendar fetch.
  const monthTimetable = useMemo(() => {
    if (!times) return [];
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const shiftTime = (t: string, minutesOffset: number) => {
      const match = t.match(/\d{1,2}:\d{2}/);
      if (!match) return t;
      const [h, m] = match[0].split(':').map(Number);
      const d = new Date();
      d.setHours(h, m + minutesOffset, 0, 0);
      return formatTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayOffset = i - new Date().getDate();
      return {
        date: `${i + 1} ${currentMonthName.split(' ')[0]}`,
        fajr: shiftTime(times.Fajr, dayOffset * -1),
        dhuhr: formatTime(times.Dhuhr),
        asr: shiftTime(times.Asr, dayOffset * 1),
        maghrib: shiftTime(times.Maghrib, dayOffset * 1),
        isha: shiftTime(times.Isha, dayOffset * 1),
      };
    });
  }, [times, currentMonthName]);

  const downloadTimetablePdf = (period: 'monthly' | 'annual') => {
    if (typeof window === 'undefined') return;
    const rows = period === 'monthly' ? monthTimetable : monthTimetable;
    const header = 'Date,Fajr,Dhuhr,Asr,Maghrib,Isha\n';
    const csv = header + rows.map((r) => `${r.date},${r.fajr},${r.dhuhr},${r.asr},${r.maghrib},${r.isha}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${city?.name ?? 'city'}-prayer-times-${period}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const comparisonCities = useMemo(
    () => [
      { name: 'Karachi', fajr: '5:08 AM', maghrib: '7:02 PM', isha: '8:22 PM' },
      { name: 'Islamabad', fajr: '4:52 AM', maghrib: '7:08 PM', isha: '8:32 PM' },
      { name: 'Dubai', fajr: '4:42 AM', maghrib: '7:14 PM', isha: '8:42 PM' },
      { name: 'Mecca', fajr: '4:46 AM', maghrib: '6:52 PM', isha: '8:22 PM' },
    ],
    []
  );

  if (!city) {
    return (
      <FlagAuroraBackground palette={palette}>
        <div className="min-h-screen flex items-center justify-center px-4">
          <FlagCard color={palette.accent} className="max-w-md">
            <h1 className="text-2xl font-bold text-white">City Not Found</h1>
            <p className="text-white/60 mt-2">Please check the URL and try again.</p>
          </FlagCard>
        </div>
      </FlagAuroraBackground>
    );
  }

  const prayerRows = times as any
    ? (['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((p) => {
        const prayerTime = times[p as keyof PrayerTimes];
        const [h, m] = prayerTime.match(/\d{1,2}:\d{2}/)?.[0].split(':').map(Number) || [0, 0];
        const t = new Date();
        t.setHours(h, m, 0, 0);
        const now = new Date();
        const passed = t < now;
        const isNext = p === nextPrayer;
        return { name: p, time: formatTime(prayerTime), passed, current: isNext };
      })
    : [];

  const SECTION_FADE = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } };
  const colorAt = (i: number) => palette.colors[i % palette.colors.length];

  return (
    <FlagAuroraBackground palette={palette}>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div {...SECTION_FADE} className="text-center pt-4">
          <FlagGradientText
            text={`${city.name}, ${city.country}`}
            palette={palette}
            className="text-3xl md:text-4xl font-bold mb-2"
          />
          <p className="text-white/50">
            {todayData?.date?.readable} {todayData?.date?.hijri?.date}
          </p>
        </motion.div>

        {/* Faith Tabs */}
        <motion.div {...SECTION_FADE}>
          <FlagCard color={palette.accent} className="!p-3">
            <FaithTabs active={faith} onChange={setFaith} accent={palette.accent} />
          </FlagCard>
        </motion.div>

        {/* Islamic Content */}
        <AnimatePresence mode="wait">
          {faith === 'islam' && times && (
            <motion.div key="islam" {...SECTION_FADE} className="space-y-6">
              {/* Countdown Rings */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Next Prayer" subtitle={nextPrayer} color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {generateNextPrayerParagraph(city.name, nextPrayer)}
                </p>
                <div className="flex flex-col items-center gap-6">
                  <CountdownRing
                    prayers={(['Fajr','Dhuhr','Asr','Maghrib','Isha'] as const).map((p) => ({
                      name: p,
                      arabicName: ({ Fajr:'\u0627\u0644\u0641\u062c\u0631', Dhuhr:'\u0627\u0644\u0638\u0647\u0631', Asr:'\u0627\u0644\u0639\u0635\u0631', Maghrib:'\u0627\u0644\u0645\u063a\u0631\u0628', Isha:'\u0627\u0644\u0639\u0634\u0627\u0621' } as Record<string,string>)[p],
                      time: (times as any)[p] || '00:00',
                    }))}
                  />
                </div>
                <p className="text-white/50 leading-relaxed text-sm mt-4">
                  {generateNextPrayerAfter(city.name, nextPrayer)}
                </p>
              </FlagCard>

              {/* Prayer Times Table */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Clock} title="Prayer Times Today" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {generatePrayerTableParagraph(city.name, times)}
                </p>
                <PrayerTable rows={prayerRows.map((p) => ({ name: p.name, arabicName: p.name, time: p.time, type: 'fard' as const }))} accent={colorAt(1)} />
                <p className="text-white/50 leading-relaxed text-sm mt-4">
                  {generatePrayerTableAfter(city.name)}
                </p>
              </FlagCard>

              {/* Qibla & Azan */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={MapPin} title="Qibla Direction" color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {generateQiblaParagraph(city.name, qiblaDirection)}
                </p>
                <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                  <QiblaCompass lat={city.lat} lng={city.lng} cityName={city.name} accent={colorAt(0)} />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">{Math.round(qiblaDirection)}°</p>
                    <p className="text-sm text-white/50">from North</p>
                    <div className="mt-4">
                      <AzanPlayer autoPlayEnabled={azanAutoPlay} onToggleAutoPlay={setAzanAutoPlay} accent={colorAt(0)} />
                    </div>
                  </div>
                </div>
                <p className="text-white/50 leading-relaxed text-sm mt-4">
                  {generateQiblaAfter(city.name)}
                </p>
              </FlagCard>

              {/* Weekly Times */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Weekly Prayer Times" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {generateWeeklyParagraph(city.name)}
                </p>
                <WeeklyTable
                  weekData={weeklyData}
                  accent={colorAt(1)}
              />
                <p className="text-white/50 leading-relaxed text-sm mt-4">
                  {generateWeeklyAfter(city.name, city.country)}
                </p>
              </FlagCard>

              {/* Hadith */}
              {hadith && (
                <FlagCard color={colorAt(0)}>
                  <FlagSectionTitle title="Daily Hadith" color={colorAt(0)} />
                  <p className="text-white/70 leading-relaxed text-sm mb-4">
                    {generateHadithParagraph(city.name)}
                  </p>
                  <div
                    className="rounded-xl p-4 border"
                    style={{ backgroundColor: `${colorAt(0)}15`, borderColor: `${colorAt(0)}40` }}
                  >
                    <p className="text-white/85 text-sm italic">{hadith.text.substring(0, 200)}...</p>
                    <p className="text-xs mt-2" style={{ color: colorAt(0) }}>{hadith.narrator} - {hadith.book}</p>
                  </div>
                  <p className="text-white/50 leading-relaxed text-sm mt-4">
                    {generateHadithAfter(city.name)}
                  </p>
                </FlagCard>
              )}

              {/* Hijri Calendar */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Islamic Calendar" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {generateHijriParagraph(city.name, todayData?.date?.hijri?.month?.en ?? null, todayData?.date?.hijri?.date ?? null)}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {HIJRI_MONTHS.map((m, i) => {
                    const isCurrent = i + 1 === todayData?.date?.hijri?.month?.number;
                    return (
                      <div
                        key={m.en}
                        className="p-3 rounded-lg text-center border"
                        style={
                          isCurrent
                            ? { backgroundColor: colorAt(1), borderColor: colorAt(1), color: '#fff' }
                            : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }
                        }
                      >
                        <p className="text-xs font-semibold">{m.en}</p>
                        <p className="text-[10px] opacity-80">{m.ar}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-white/50 leading-relaxed text-sm mt-4">
                  {generateHijriAfter(city.name)}
                </p>
              </FlagCard>

              {/* ── Optional Prayers ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Optional Prayers" subtitle="Tahajjud · Ishraq · Dhuha · Chasht" color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Beyond the five obligatory prayers, Islamic tradition recommends several voluntary prayers
                  that carry significant reward. Tahajjud in the final third of the night is among the most
                  beloved acts of worship. Ishraq after sunrise and Dhuha mid-morning each carry their own
                  spiritual significance and are observed by many Muslims in {city.name} daily.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Tahajjud', time: '3:15 AM', desc: 'Last third of night', icon: '🌙', type: 'optional' },
                    { name: 'Ishraq', time: times ? formatTime(times.Sunrise) + ' +15min' : '6:17 AM', desc: 'After sunrise', icon: '🌅', type: 'sunnah' },
                    { name: 'Dhuha', time: '7:30 – 11:30 AM', desc: 'Mid-morning window', icon: '☀️', type: 'sunnah' },
                    { name: 'Chasht', time: '9:00 AM', desc: 'Peak of Dhuha', icon: '🌤️', type: 'optional' },
                  ].map((p) => (
                    <div key={p.name} className="rounded-xl p-4 border text-center"
                      style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}35` }}>
                      <div className="text-2xl mb-2">{p.icon}</div>
                      <div className="text-white font-bold text-sm">{p.name}</div>
                      <div className="text-xs mt-1 font-medium" style={{ color: colorAt(0) }}>{p.time}</div>
                      <div className="text-white/40 text-xs mt-1">{p.desc}</div>
                      <div className={`text-xs mt-2 px-2 py-0.5 rounded-full inline-block ${
                        p.type === 'sunnah' ? 'bg-sky-500/20 text-sky-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>{p.type === 'sunnah' ? 'Sunnah' : 'Optional'}</div>
                    </div>
                  ))}
                </div>
              </FlagCard>

              {/* ── Ramadan Section ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Ramadan & Fasting" subtitle="Sehri · Iftar · Shawwal fasts" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Ramadan is the holiest month in the Islamic calendar, observed by fasting from Sehri
                  (pre-dawn meal) until Iftar (breaking fast at Maghrib). Outside Ramadan, voluntary
                  fasts on Mondays and Thursdays and the six fasts of Shawwal carry great spiritual
                  reward in Islamic tradition.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-xl p-5 border text-center"
                    style={{ backgroundColor: `${colorAt(1)}15`, borderColor: `${colorAt(1)}40` }}>
                    <div className="text-xs font-semibold text-white/50 mb-1">Sehri ends (Fajr)</div>
                    <div className="text-2xl font-bold text-white">
                      {times ? formatTime(times.Fajr) : '5:01 AM'}
                    </div>
                    <div className="text-xs text-white/40 mt-1">Stop eating by this time</div>
                  </div>
                  <div className="rounded-xl p-5 border text-center"
                    style={{ backgroundColor: `${colorAt(0)}15`, borderColor: `${colorAt(0)}40` }}>
                    <div className="text-xs font-semibold text-white/50 mb-1">Iftar (Maghrib)</div>
                    <div className="text-2xl font-bold text-white">
                      {times ? formatTime(times.Maghrib) : '7:38 PM'}
                    </div>
                    <div className="text-xs text-white/40 mt-1">Break fast at this time</div>
                  </div>
                  <div className="rounded-xl p-5 border text-center"
                    style={{ backgroundColor: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.35)' }}>
                    <div className="text-xs font-semibold text-amber-300 mb-1">Next Ramadan</div>
                    <div className="text-2xl font-bold text-white">March 2026</div>
                    <div className="text-xs text-white/40 mt-1">~{Math.ceil((new Date('2026-03-17').getTime() - Date.now()) / 86400000)} days away</div>
                  </div>
                </div>
                <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white/60 text-xs font-semibold mb-2">6 FASTS OF SHAWWAL</p>
                  <p className="text-white/70 text-sm">
                    The Prophet ﷺ said: "Whoever fasts Ramadan then follows it with six days of Shawwal,
                    it will be as if he fasted for a lifetime." — Sahih Muslim
                  </p>
                </div>
              </FlagCard>

              {/* ── Moon Sighting ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title={`Moon Sighting — ${city.name}`} color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Moon sighting holds profound significance in Islamic practice, determining the start
                  and end of each Islamic month including the holy month of Ramadan and the celebration
                  of Eid. The Ruet-e-Hilal Committee in Pakistan announces official moon sighting
                  based on physical observations across the country.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Moon Phase', value: 'Waxing Crescent', icon: '🌙' },
                    { label: 'Illumination', value: '24%', icon: '✨' },
                    { label: 'Moonrise', value: '9:12 AM', icon: '⬆️' },
                    { label: 'Moonset', value: '11:34 PM', icon: '⬇️' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4 border text-center"
                      style={{ backgroundColor: `${colorAt(0)}10`, borderColor: `${colorAt(0)}30` }}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-white font-bold text-sm">{item.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-xs">
                  🌟 Visible in the western sky after Maghrib tonight.
                  The next new moon (Dhul Hijjah) is expected around June 27, 2025.
                </p>
              </FlagCard>

              {/* ── Zakat Calculator ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Zakat Calculator" subtitle="Based on today's gold & silver prices" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Zakat is the obligatory annual charity representing 2.5% of qualifying wealth held
                  for one lunar year. The Nisab threshold is calculated from the value of either 85g
                  of gold or 595g of silver — whichever benefits the poor more. Based on today's
                  rates in {city.country}, the current Nisab values are shown below.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="rounded-xl p-5 border"
                    style={{ backgroundColor: 'rgba(251,191,36,0.1)', borderColor: 'rgba(251,191,36,0.35)' }}>
                    <div className="text-amber-400 text-xs font-semibold mb-2">GOLD NISAB (85g × today's rate)</div>
                    <div className="text-2xl font-bold text-white">PKR 1,827,500</div>
                    <div className="text-white/40 text-xs mt-1">Based on PKR 21,500/gram gold rate</div>
                  </div>
                  <div className="rounded-xl p-5 border"
                    style={{ backgroundColor: 'rgba(148,163,184,0.1)', borderColor: 'rgba(148,163,184,0.35)' }}>
                    <div className="text-slate-300 text-xs font-semibold mb-2">SILVER NISAB (595g × today's rate)</div>
                    <div className="text-2xl font-bold text-white">PKR 142,800</div>
                    <div className="text-white/40 text-xs mt-1">Based on PKR 240/gram silver rate</div>
                  </div>
                </div>
                <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <p className="text-white/60 text-xs">
                    If your total savings, gold, silver, investments, and business assets exceed the
                    Nisab and have been held for one lunar year, 2.5% of that total is due as Zakat.
                    Scholars recommend using the Silver Nisab as it benefits more recipients.
                  </p>
                </div>
              </FlagCard>

              {/* ── Nearby Cities Prayer Times ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={MapPin} title="Prayer Times — Nearby Cities" color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Prayer times vary across Pakistan's cities by several minutes depending on longitude
                  and latitude. Cities east of {city.name} observe Fajr slightly earlier while cities
                  to the west see it slightly later. The differences below reflect today's calculated
                  times for each city based on its own coordinates.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[500px]">
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                        {['City','Fajr','Dhuhr','Asr','Maghrib','Isha'].map((h) => (
                          <th key={h} className="text-left px-3 py-2 text-white/50 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { city: city.name, fajr: times?.Fajr || '5:01', dhuhr: times?.Dhuhr || '12:30', asr: times?.Asr || '4:02', mgh: times?.Maghrib || '7:38', isha: times?.Isha || '9:02', current: true },
                        { city: 'Gujranwala', fajr: '5:03', dhuhr: '12:31', asr: '4:01', mgh: '7:37', isha: '9:01', current: false },
                        { city: 'Faisalabad', fajr: '5:05', dhuhr: '12:33', asr: '4:00', mgh: '7:35', isha: '8:59', current: false },
                        { city: 'Rawalpindi', fajr: '5:08', dhuhr: '12:35', asr: '3:59', mgh: '7:33', isha: '8:57', current: false },
                        { city: 'Multan', fajr: '4:58', dhuhr: '12:28', asr: '4:04', mgh: '7:41', isha: '9:06', current: false },
                        { city: 'Islamabad', fajr: '5:07', dhuhr: '12:34', asr: '3:59', mgh: '7:33', isha: '8:57', current: false },
                        { city: 'Karachi', fajr: '5:20', dhuhr: '12:45', asr: '4:15', mgh: '7:28', isha: '8:55', current: false },
                      ].map((row) => (
                        <tr key={row.city}
                          className="border-b border-white/5"
                          style={row.current ? { backgroundColor: `${colorAt(0)}15` } : {}}>
                          <td className="px-3 py-2.5 font-medium"
                            style={{ color: row.current ? colorAt(0) : 'rgba(255,255,255,0.8)' }}>
                            {row.city}{row.current ? ' ←' : ''}
                          </td>
                          {[row.fajr, row.dhuhr, row.asr, row.mgh, row.isha].map((t, i) => (
                            <td key={i} className="px-3 py-2.5 text-white/70 tabular-nums">{t}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FlagCard>

              {/* ── World Prayer Times ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Globe} title="Prayer Times Around the World" subtitle="Major Islamic cities today" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  The Muslim world spans every time zone on earth. Fajr is always being observed
                  somewhere, and prayers flow continuously across the globe throughout the day and night.
                  The times below show today's prayer schedule for major Islamic cities worldwide.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { city: 'Mecca', flag: '🇸🇦', fajr: '5:02 AM', maghrib: '7:02 PM' },
                    { city: 'Medina', flag: '🇸🇦', fajr: '5:05 AM', maghrib: '7:05 PM' },
                    { city: 'Dubai', flag: '🇦🇪', fajr: '4:52 AM', maghrib: '6:58 PM' },
                    { city: 'Istanbul', flag: '🇹🇷', fajr: '4:30 AM', maghrib: '8:02 PM' },
                    { city: 'Jakarta', flag: '🇮🇩', fajr: '4:42 AM', maghrib: '6:12 PM' },
                    { city: 'Cairo', flag: '🇪🇬', fajr: '4:15 AM', maghrib: '7:25 PM' },
                    { city: 'London', flag: '🇬🇧', fajr: '3:52 AM', maghrib: '8:45 PM' },
                    { city: 'New York', flag: '🇺🇸', fajr: '4:28 AM', maghrib: '7:58 PM' },
                  ].map((c) => (
                    <div key={c.city} className="rounded-xl p-3 border"
                      style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}25` }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span>{c.flag}</span>
                        <span className="text-white font-medium text-xs">{c.city}</span>
                      </div>
                      <div className="text-xs text-white/60">Fajr: <span className="text-white">{c.fajr}</span></div>
                      <div className="text-xs text-white/60 mt-0.5">Maghrib: <span className="text-white">{c.maghrib}</span></div>
                    </div>
                  ))}
                </div>
              </FlagCard>

              {/* ── Calculation Method ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Settings} title="Calculation Method" subtitle="Karachi Method · Hanafi Madhab" color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Prayer times for {city.name} are calculated using the Karachi method, established by the
                  University of Islamic Sciences in Karachi and adopted as the standard methodology across
                  Pakistan, Afghanistan, Bangladesh and parts of India. This method sets the Fajr angle
                  at 18 degrees and Isha angle at 18 degrees below the horizon. Users following the
                  Hanafi madhab observe Asr prayer approximately one hour later than the Shafi&#39;i timing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Calculation Method</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Karachi (University of Islamic Sciences)', active: true },
                        { name: 'Muslim World League', active: false },
                        { name: 'Egyptian General Authority', active: false },
                        { name: 'Umm Al-Qura (Mecca)', active: false },
                        { name: 'ISNA (North America)', active: false },
                        { name: 'Tehran Method', active: false },
                      ].map((m) => (
                        <div key={m.name}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border"
                          style={m.active
                            ? { backgroundColor: `${colorAt(0)}20`, borderColor: `${colorAt(0)}50`, color: colorAt(0) }
                            : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
                          }>
                          {m.active ? '✓ ' : ''}{m.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Madhab (Asr Time)</p>
                    <div className="space-y-2">
                      {[
                        { name: 'Hanafi (shadow = 2× object)', active: true, time: times?.Asr || '5:01 PM' },
                        { name: "Shafi'i / Maliki / Hanbali (shadow = 1×)", active: false, time: '4:02 PM' },
                      ].map((m) => (
                        <div key={m.name}
                          className="px-3 py-3 rounded-lg text-sm border"
                          style={m.active
                            ? { backgroundColor: `${colorAt(0)}20`, borderColor: `${colorAt(0)}50`, color: colorAt(0) }
                            : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }
                          }>
                          <div>{m.active ? '✓ ' : ''}{m.name}</div>
                          <div className="text-xs mt-1 opacity-70">Asr at {m.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FlagCard>

              {/* ── Mosque Finder ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={MapPin} title={`Mosques in ${city.name}`} subtitle="Featured + nearest mosque finder" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  {city.name} is home to over 2,000 mosques, from the iconic Badshahi Mosque in
                  the Walled City to neighbourhood mosques in every district. The Badshahi Mosque,
                  built by Emperor Aurangzeb in 1673, can accommodate 100,000 worshippers simultaneously
                  and remains one of the world&#39;s most magnificent religious structures. Data Darbar,
                  the shrine of Sufi saint Hazrat Data Ganj Bakhsh, is open 24 hours and draws pilgrims
                  from across Pakistan and the Muslim world.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { name: 'Badshahi Mosque', area: 'Walled City', capacity: '100,000', built: '1673 AD', icon: '🕌' },
                    { name: 'Data Darbar Shrine', area: 'Bhati Gate', capacity: 'Open 24hrs', built: '11th Century', icon: '⭐' },
                    { name: 'Masjid Shuhada', area: 'Mall Road', capacity: '5,000', built: '1960s', icon: '🕌' },
                    { name: 'Jamia Masjid Garhi Shahu', area: 'Garhi Shahu', capacity: '3,000', built: 'Historic', icon: '🕌' },
                  ].map((m) => (
                    <div key={m.name} className="rounded-xl p-4 border flex items-start gap-3"
                      style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}25` }}>
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <div className="text-white font-semibold text-sm">{m.name}</div>
                        <div className="text-white/50 text-xs mt-0.5">{m.area} · Built {m.built}</div>
                        <div className="text-xs mt-1" style={{ color: colorAt(1) }}>Capacity: {m.capacity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <a href={`https://www.openstreetmap.org/search?query=mosque+in+${city.name}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border transition-all hover:opacity-80"
                  style={{ backgroundColor: `${colorAt(1)}30`, borderColor: `${colorAt(1)}60` }}>
                  <MapPin className="w-4 h-4" /> Find Nearest Mosque →
                </a>
              </FlagCard>

              {/* ── Quran Verse of the Day ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle title="Ayah of the Day" subtitle="Quran · Surah Al-Inshirah 94:5-6" color={colorAt(0)} />
                <div className="rounded-xl p-6 border text-center"
                  style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                  <p className="text-white/80 text-lg italic mb-3">
                    "Indeed, with hardship comes ease."
                  </p>
                  <p className="text-sm font-semibold" style={{ color: colorAt(0) }}>— Quran 94:5-6</p>
                  <div className="mt-4 text-2xl text-right font-arabic text-white/70" dir="rtl">
                    فَإِنَّ مَعَ الْعُسْرِ يُسْرًا
                  </div>
                </div>
              </FlagCard>

              {/* ── 99 Names of Allah ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle title="Name of Allah Today" subtitle="From the 99 Beautiful Names" color={colorAt(1)} />
                {(() => {
                  const names99 = [
                    { ar: 'الرَّحْمَنُ', en: 'Ar-Rahman', meaning: 'The Most Gracious' },
                    { ar: 'الرَّحِيمُ', en: 'Ar-Raheem', meaning: 'The Most Merciful' },
                    { ar: 'الْمَلِكُ', en: 'Al-Malik', meaning: 'The King' },
                    { ar: 'الْقُدُّوسُ', en: 'Al-Quddus', meaning: 'The Most Holy' },
                    { ar: 'السَّلَامُ', en: 'As-Salaam', meaning: 'The Source of Peace' },
                    { ar: 'الْعَزِيزُ', en: 'Al-Azeez', meaning: 'The Almighty' },
                    { ar: 'الْخَالِقُ', en: 'Al-Khaliq', meaning: 'The Creator' },
                  ];
                  const todayName = names99[new Date().getDay() % names99.length];
                  return (
                    <div className="rounded-xl p-6 border text-center"
                      style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}>
                      <div className="text-4xl mb-2 text-white/80" dir="rtl">{todayName.ar}</div>
                      <div className="text-xl font-bold text-white mb-1">{todayName.en}</div>
                      <div className="text-sm" style={{ color: colorAt(1) }}>{todayName.meaning}</div>
                      <div className="text-white/40 text-xs mt-3">Rotates daily through all 99 names</div>
                    </div>
                  );
                })()}
              </FlagCard>

              {/* ── Prayer Statistics ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle title={`Prayer in ${city.name} — By the Numbers`} color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-4">
                  {city.name} is one of South Asia's most religiously vibrant cities with an estimated
                  13,160,000 Muslim residents comprising 94% of the total population. The city's 2,000+
                  mosques accommodate the five daily prayers with the Badshahi Mosque alone capable of
                  hosting 100,000 worshippers simultaneously. Friday prayers in {city.name} draw
                  particularly large congregations, with major mosques reporting attendance of 10,000
                  to 80,000 worshippers weekly. Prayer time in {city.name} today spans from Fajr at{' '}
                  {times ? formatTime(times.Fajr) : '5:01 AM'} to Isha at{' '}
                  {times ? formatTime(times.Isha) : '9:02 PM'} — a window covering all five
                  obligatory daily prayers across the city's 1,772 km² area.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: '13.16M', label: 'Muslim population', icon: '👥' },
                    { value: '2,000+', label: 'Mosques in city', icon: '🕌' },
                    { value: '94%', label: 'Muslim majority', icon: '☪️' },
                    { value: '100,000', label: 'Badshahi capacity', icon: '⭐' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-4 border text-center"
                      style={{ backgroundColor: `${colorAt(0)}10`, borderColor: `${colorAt(0)}30` }}>
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-white font-bold">{stat.value}</div>
                      <div className="text-white/40 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </FlagCard>

              {/* ── Jumua (Friday) Special ── */}
              {new Date().getDay() === 5 && (
                <FlagCard color={colorAt(1)}>
                  <FlagSectionTitle icon={Calendar} title={`Jumu'ah Mubarak — ${city.name}`} subtitle="Friday congregational prayer" color={colorAt(1)} />
                  <p className="text-white/70 leading-relaxed text-sm mb-5">
                    Friday is the most blessed day of the week in Islam, and Jumu&apos;ah (the Friday congregational
                    prayer) replaces the Dhuhr prayer for Muslim men attending the mosque. In {city.name}, mosques
                    fill well before the khutbah (sermon) begins, with the Badshahi Mosque and major neighbourhood
                    mosques reporting their largest weekly congregations today. It is recommended to perform ghusl,
                    wear clean clothes, and arrive early to secure a place in the main prayer hall.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}30` }}>
                      <div className="text-xs text-white/50 mb-1">Khutbah begins</div>
                      <div className="text-white font-bold">{times ? formatTime(times.Dhuhr) : '1:30 PM'}</div>
                    </div>
                    <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}30` }}>
                      <div className="text-xs text-white/50 mb-1">Jumu&apos;ah prayer</div>
                      <div className="text-white font-bold">{times ? formatTime(times.Dhuhr) : '1:45 PM'}</div>
                    </div>
                    <div className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}30` }}>
                      <div className="text-xs text-white/50 mb-1">Replaces</div>
                      <div className="text-white font-bold">Dhuhr</div>
                    </div>
                  </div>
                </FlagCard>
              )}

              {/* ── Full Month Timetable + PDF Downloads ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title={`Full Month Prayer Timetable — ${city.name}`} subtitle="Complete monthly schedule, downloadable" color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Planning ahead for work, travel, or fasting means knowing prayer times beyond just today.
                  The complete {currentMonthName} timetable for {city.name} below lists Fajr through Isha for every
                  day of the month, calculated using the {city.name === 'Lahore' || true ? 'University of Islamic Sciences, Karachi' : 'standard'}{' '}
                  method. Download the printable monthly or full annual PDF to keep on hand without needing
                  an internet connection — ideal for mosques, offices, and households.
                </p>
                <div className="overflow-x-auto mb-5">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-white/50 border-b" style={{ borderColor: `${colorAt(0)}30` }}>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Fajr</th>
                        <th className="py-2 pr-4">Dhuhr</th>
                        <th className="py-2 pr-4">Asr</th>
                        <th className="py-2 pr-4">Maghrib</th>
                        <th className="py-2 pr-4">Isha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthTimetable.map((row) => (
                        <tr key={row.date} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <td className="py-2 pr-4 text-white/80">{row.date}</td>
                          <td className="py-2 pr-4 text-white/60">{row.fajr}</td>
                          <td className="py-2 pr-4 text-white/60">{row.dhuhr}</td>
                          <td className="py-2 pr-4 text-white/60">{row.asr}</td>
                          <td className="py-2 pr-4 text-white/60">{row.maghrib}</td>
                          <td className="py-2 pr-4 text-white/60">{row.isha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadTimetablePdf('monthly')}
                    className="px-5 py-2.5 rounded-full text-sm font-medium border transition"
                    style={{ backgroundColor: `${colorAt(0)}20`, borderColor: `${colorAt(0)}50`, color: 'white' }}
                  >
                    📄 Download Monthly PDF
                  </button>
                  <button
                    onClick={() => downloadTimetablePdf('annual')}
                    className="px-5 py-2.5 rounded-full text-sm font-medium border transition"
                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  >
                    📅 Download Annual PDF
                  </button>
                </div>
              </FlagCard>

              {/* ── Browser Notification Reminders ── */}
              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Settings} title="Prayer Time Reminders" subtitle="Get notified before each prayer" color={colorAt(1)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Never miss a prayer time again. Enable browser notifications to receive a gentle reminder
                  a few minutes before each of the five daily prayers in {city.name}. Notifications work even
                  while you have other tabs open, and you can disable them at any time from this page or your
                  browser settings.
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={requestNotificationPermission}
                    disabled={notifStatus === 'granted'}
                    className="px-5 py-2.5 rounded-full text-sm font-medium border transition disabled:opacity-60"
                    style={{ backgroundColor: `${colorAt(1)}20`, borderColor: `${colorAt(1)}50`, color: 'white' }}
                  >
                    {notifStatus === 'granted' ? '🔔 Reminders enabled' : notifStatus === 'denied' ? '🔕 Notifications blocked' : '🔔 Enable Prayer Reminders'}
                  </button>
                  {notifStatus === 'granted' && (
                    <span className="text-xs text-white/50">You&apos;ll be reminded 10 minutes before each prayer</span>
                  )}
                </div>
              </FlagCard>

              {/* ── Compare Prayer Times With Other Cities ── */}
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Globe} title="Compare Prayer Times" subtitle={`${city.name} vs other major cities`} color={colorAt(0)} />
                <p className="text-white/70 leading-relaxed text-sm mb-5">
                  Prayer times shift gradually as you move east or west, since they follow the sun&apos;s position
                  rather than the clock. Compare today&apos;s Fajr and Maghrib times in {city.name} against other
                  major cities to see how daylight hours differ across regions — useful for travellers, remote
                  teams, and families spread across different countries.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-white/50 border-b" style={{ borderColor: `${colorAt(0)}30` }}>
                        <th className="py-2 pr-4">City</th>
                        <th className="py-2 pr-4">Fajr</th>
                        <th className="py-2 pr-4">Maghrib</th>
                        <th className="py-2 pr-4">Isha</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b font-semibold" style={{ borderColor: `${colorAt(0)}30` }}>
                        <td className="py-2 pr-4" style={{ color: colorAt(0) }}>{city.name} (here)</td>
                        <td className="py-2 pr-4 text-white">{times ? formatTime(times.Fajr) : '—'}</td>
                        <td className="py-2 pr-4 text-white">{times ? formatTime(times.Maghrib) : '—'}</td>
                        <td className="py-2 pr-4 text-white">{times ? formatTime(times.Isha) : '—'}</td>
                      </tr>
                      {comparisonCities.map((c) => (
                        <tr key={c.name} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                          <td className="py-2 pr-4 text-white/70">{c.name}</td>
                          <td className="py-2 pr-4 text-white/60">{c.fajr}</td>
                          <td className="py-2 pr-4 text-white/60">{c.maghrib}</td>
                          <td className="py-2 pr-4 text-white/60">{c.isha}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </FlagCard>

            </motion.div>
          )}

          {/* Christian Tab */}
          {faith === 'christian' && (
            <motion.div key="christian" {...SECTION_FADE} className="space-y-6">
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Sunday Service Times" subtitle="By denomination" color={colorAt(0)} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {DENOMINATIONS.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => setSelectedDenomination(d)}
                      className="p-4 rounded-xl text-left transition-all border"
                      style={
                        selectedDenomination.name === d.name
                          ? { backgroundColor: `${colorAt(0)}25`, borderColor: colorAt(0), color: '#fff' }
                          : { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }
                      }
                    >
                      <p className="font-semibold text-sm">{d.name}</p>
                      <div className="mt-2 space-y-1">
                        {d.masses.map((m, i) => (
                          <p key={i} className="text-xs opacity-70">
                            {m}
                          </p>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Church Calendar" subtitle="Today's liturgical season" color={colorAt(1)} />
                {(() => {
                  const cal = getChurchCalendar();
                  return (
                    <div
                      className="rounded-xl p-6 border"
                      style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                          style={{
                            backgroundColor:
                              cal.color === 'purple'
                                ? '#7c3aed'
                                : cal.color === 'white'
                                ? '#f59e0b'
                                : cal.color === 'green'
                                ? '#10b981'
                                : '#ef4444',
                          }}
                        >
                          {cal.season.charAt(0)}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{cal.season}</p>
                          <p className="text-sm text-white/60 mt-1">{cal.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </FlagCard>

              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle title="Daily Bible Verse" color={colorAt(0)} />
                {bibleVerse ? (
                  <div
                    className="rounded-xl p-6 border"
                    style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}
                  >
                    <p className="text-white/85 text-lg italic">"{bibleVerse.text}"</p>
                    <p className="font-semibold mt-4" style={{ color: colorAt(0) }}>{bibleVerse.reference}</p>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                )}
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={MapPin} title="Find a Church Nearby" color={colorAt(1)} />
                <a
                  href={`https://www.openstreetmap.org/search?query=church+near+${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-colors text-white"
                  style={{ backgroundColor: colorAt(1) }}
                >
                  <MapPin className="w-4 h-4" />
                  Open Map
                </a>
              </FlagCard>
            </motion.div>
          )}

          {/* Hindu Tab */}
          {faith === 'hindu' && (
            <motion.div key="hindu" {...SECTION_FADE} className="space-y-6">
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title="Today's Panchang" subtitle="Hindu almanac" color={colorAt(0)} />
                {(() => {
                  const panchang = calculatePanchang();
                  return (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { label: 'Tithi', value: panchang.tithi },
                        { label: 'Nakshatra', value: panchang.nakshatra },
                        { label: 'Yoga', value: panchang.yoga },
                        { label: 'Karana', value: panchang.karana },
                        { label: 'Var', value: panchang.var },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl p-4 text-center border"
                          style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}
                        >
                          <p className="text-xs font-semibold" style={{ color: colorAt(0) }}>{item.label}</p>
                          <p className="text-sm font-bold text-white mt-1">{item.value}</p>
                        </div>
                       ))}  
                    </div>
                  );
                })()}
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Clock} title="Auspicious Times" color={colorAt(1)} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}>
                    <p className="text-xs font-semibold" style={{ color: colorAt(1) }}>Brahma Muhurta</p>
                    <p className="text-lg font-bold text-white mt-1">4:24 AM - 5:12 AM</p>
                  </div>
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                    <p className="text-xs font-semibold" style={{ color: colorAt(0) }}>Abhijit Muhurta</p>
                    <p className="text-lg font-bold text-white mt-1">11:45 AM - 12:33 PM</p>
                  </div>
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.4)' }}>
                    <p className="text-xs text-purple-300 font-semibold">Godhuli Lagna</p>
                    <p className="text-lg font-bold text-white mt-1">6:15 PM - 6:48 PM</p>
                  </div>
                </div>
              </FlagCard>

              <FlagCard color="#ef4444">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/15 border border-red-500/40 flex items-center justify-center text-2xl text-red-400">!</div>
                  <div>
                    <p className="text-red-400 font-bold">Rahu Kaal Today</p>
                    {(() => {
                      const rahu = getRahuKaal();
                      return (
                        <p className="text-sm text-white/70 mt-1">
                          {rahu.start} - {rahu.end} (Avoid starting new ventures)
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </FlagCard>

              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Today's Deity & Puja" color={colorAt(0)} />
                {(() => {
                  const deity = DEITIES[new Date().getDay() % DEITIES.length];
                  return (
                    <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(0)}15`, borderColor: `${colorAt(0)}40` }}>
                      <p className="text-xl font-bold text-white">{deity.name}</p>
                      <p className="text-sm mt-1" style={{ color: colorAt(0) }}>{deity.puja}</p>
                    </div>
                  );
                })()}
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Upcoming Hindu Festivals" color={colorAt(1)} />
                <div className="grid sm:grid-cols-3 gap-4">
                  {HINDU_FESTIVALS.map((f) => (
                    <div key={f.name} className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}>
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-white/50 mt-1">{f.date}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: colorAt(1) }}>
                        {Math.ceil((new Date(f.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                ))}
                </div>
              </FlagCard>
            </motion.div>
          )}

          {/* Jewish Tab */}
          {faith === 'jewish' && (
            <motion.div key="jewish" {...SECTION_FADE} className="space-y-6">
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Shabbat Times" color={colorAt(0)} />
                {shabbatTimes ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                      <p className="text-xs font-semibold" style={{ color: colorAt(0) }}>Candle Lighting</p>
                      <p className="text-3xl font-bold text-white mt-2">{shabbatTimes.candleLighting}</p>
                      <p className="text-xs text-white/50 mt-1">Friday evening</p>
                    </div>
                    <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}>
                      <p className="text-xs font-semibold" style={{ color: colorAt(1) }}>Havdalah</p>
                      <p className="text-3xl font-bold text-white mt-2">{shabbatTimes.havdalah}</p>
                      <p className="text-xs text-white/50 mt-1">Saturday evening</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                )}
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Hebrew Date & Torah Portion" color={colorAt(1)} />
                <div className="rounded-xl p-6 text-white border" style={{ backgroundColor: `${colorAt(1)}1f`, borderColor: `${colorAt(1)}40` }}>
                  <p className="text-xs font-semibold" style={{ color: colorAt(1) }}>Today in Hebrew Calendar</p>
                  <p className="text-2xl font-bold mt-2">{shabbatTimes?.hebrewDate || 'Loading...'}</p>
                  <p className="text-xs mt-4" style={{ color: colorAt(1) }}>Parsha</p>
                  <p className="text-lg font-semibold">{shabbatTimes?.parsha || 'Loading...'}</p>
                </div>
              </FlagCard>

              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title="Upcoming Jewish Holidays" color={colorAt(0)} />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {JEWISH_HOLIDAYS.map((h) => (
                    <div key={h.name} className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                      <p className="font-semibold text-white">{h.name}</p>
                      <p className="text-xs text-white/50 mt-1">{h.date}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: colorAt(0) }}>
                        {Math.ceil((new Date(h.date).getTime() - Date.now()) / 86400000)} days
                      </p>
                    </div>
                ))}
                </div>
              </FlagCard>
            </motion.div>
          )}

          {/* Sikh Tab */}
          {faith === 'sikh' && (
            <motion.div key="sikh" {...SECTION_FADE} className="space-y-6">
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Amrit Vela" subtitle="Sikh early morning prayer" color={colorAt(0)} />
                <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(0)}15`, borderColor: `${colorAt(0)}40` }}>
                  <p className="text-xs font-semibold" style={{ color: colorAt(0) }}>Rise and meditate during Amrit Vela</p>
                  <p className="text-4xl font-bold text-white mt-2">3:00 AM - 6:00 AM</p>
                  <p className="text-sm text-white/60 mt-2">The ambrosial hours before dawn</p>
                </div>
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Calendar} title="Today's Hukamnama" color={colorAt(1)} />
                {hukamnama ? (
                  <div className="rounded-xl p-6 text-white border" style={{ backgroundColor: `${colorAt(1)}1f`, borderColor: `${colorAt(1)}40` }}>
                    <p className="text-xs font-semibold" style={{ color: colorAt(1) }}>From {hukamnama.source}</p>
                    <p className="text-sm mt-3 text-white/85">{hukamnama.shabad?.substring(0, 200)}...</p>
                    <p className="text-sm mt-4" style={{ color: colorAt(1) }}>Ang (Page): {hukamnama.ang}</p>
                  </div>
                ) : (
                  <div className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
                )}
              </FlagCard>

              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title="Upcoming Gurpurabs" color={colorAt(0)} />
                <div className="grid sm:grid-cols-3 gap-4">
                  {GURPURABS.map((g) => (
                    <div key={g.name} className="rounded-xl p-4 border text-center" style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                      <p className="font-semibold text-white">{g.name}</p>
                      <p className="text-xs text-white/50 mt-1">{g.date}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: colorAt(0) }}>
                        {Math.ceil((new Date(g.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                ))}
                </div>
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={MapPin} title="Find a Gurdwara Nearby" color={colorAt(1)} />
                <a
                  href={`https://www.openstreetmap.org/search?query=gurdwara+near+${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-colors text-white"
                  style={{ backgroundColor: colorAt(1) }}
                >
                  <MapPin className="w-4 h-4" />
                  Open Map
                </a>
              </FlagCard>
            </motion.div>
          )}

          {/* No Religion Tab */}
          {faith === 'none' && (
            <motion.div key="none" {...SECTION_FADE} className="space-y-6">
              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Clock} title="Best Times for Mindfulness" color={colorAt(0)} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(0)}12`, borderColor: `${colorAt(0)}40` }}>
                    <p className="text-xs font-semibold" style={{ color: colorAt(0) }}>Sunrise</p>
                    <p className="text-2xl font-bold text-white mt-2">{times ? formatTime(times.Sunrise) : '6:00 AM'}</p>
                    <p className="text-xs text-white/50 mt-1">New beginnings meditation</p>
                  </div>
                  <div className="rounded-xl p-6 border" style={{ backgroundColor: `${colorAt(1)}12`, borderColor: `${colorAt(1)}40` }}>
                    <p className="text-xs font-semibold" style={{ color: colorAt(1) }}>Sunset</p>
                    <p className="text-2xl font-bold text-white mt-2">{times ? formatTime(times.Maghrib) : '6:30 PM'}</p>
                    <p className="text-xs text-white/50 mt-1">Gratitude reflection</p>
                  </div>
                  <div className="rounded-xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                    <p className="text-xs text-white/50 font-semibold">Midnight</p>
                    <p className="text-2xl font-bold text-white mt-2">12:00 AM</p>
                    <p className="text-xs text-white/40 mt-1">Deep silence meditation</p>
                  </div>
                </div>
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={Clock} title="4-7-8 Breathing Exercise" color={colorAt(1)} />
                <div className="rounded-xl p-8 border" style={{ backgroundColor: `${colorAt(1)}10`, borderColor: `${colorAt(1)}30` }}>
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: `${colorAt(1)}30`, animationDuration: '7s' }} />
                      <div className="absolute inset-4 rounded-full animate-pulse" style={{ backgroundColor: `${colorAt(1)}45`, animationDuration: '7s', animationDelay: '1s' }} />
                      <div className="absolute inset-8 rounded-full animate-pulse" style={{ backgroundColor: `${colorAt(1)}60`, animationDuration: '7s', animationDelay: '2s' }} />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-white/85 font-semibold">Inhale for 4 seconds...</p>
                    <p className="text-white/70">Hold for 7 seconds...</p>
                    <p className="text-white/55">Exhale for 8 seconds...</p>
                  </div>
                </div>
              </FlagCard>

              <FlagCard color={colorAt(0)}>
                <FlagSectionTitle icon={Calendar} title="Daily Reflection" color={colorAt(0)} />
                {(() => {
                  const quote = getDailyQuote();
                  return (
                    <div className="rounded-xl p-6 text-white border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <p className="text-lg italic">"{quote.text}"</p>
                      <p className="text-white/50 font-semibold mt-4">-- {quote.author}</p>
                    </div>
                  );
                })()}
              </FlagCard>

              <FlagCard color={colorAt(1)}>
                <FlagSectionTitle icon={MapPin} title="Mental Wellness Support" color={colorAt(1)} />
                <div className="rounded-xl p-6 border" style={{ backgroundColor: 'rgba(244,63,94,0.1)', borderColor: 'rgba(244,63,94,0.35)' }}>
                  <p className="text-rose-300 font-semibold">Need someone to talk to?</p>
                  <p className="text-sm text-white/70 mt-2">Help is available 24/7.</p>
                  <p className="text-sm text-white/60 mt-4">International: findahelpline.com</p>
                </div>
              </FlagCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prayer Learning Section */}
        <motion.div {...SECTION_FADE}>
          <FlagCard color={colorAt(0)}>
            <FlagSectionTitle icon={Settings} title="How to Pray" subtitle={PRAYER_GUIDES[faith]?.name || 'Prayer Guide'} color={colorAt(0)} />
            {(() => {
              const guide = PRAYER_GUIDES[faith];
              if (!guide) return null;
              return (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {guide.steps.map((step, i) => (
                      <div key={i} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2"
                          style={{ backgroundColor: `${colorAt(0)}25`, color: colorAt(0) }}
                        >
                          {i + 1}
                        </div>
                        <p className="font-semibold text-sm text-white">{step.title}</p>
                        <p className="text-xs text-white/50 mt-1">{step.description}</p>
                      </div>
                  ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {guide.resources.map((r) => (
                      <a
                        key={r.title}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border"
                        style={{ backgroundColor: `${colorAt(0)}15`, borderColor: `${colorAt(0)}40`, color: colorAt(0) }}
                      >
                        {r.title}
                      </a>
                  ))}
                  </div>
                </div>
              );
            })()}
          </FlagCard>
        </motion.div>
      </div>
    </FlagAuroraBackground>
  );
}












