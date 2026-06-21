'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, MapPin, Settings } from 'lucide-react';

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
  const palette = getFlagPalette(city?.country_slug ?? country);

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
                <div className="flex flex-wrap justify-center gap-6">
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












