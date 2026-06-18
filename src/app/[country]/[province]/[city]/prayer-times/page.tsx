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

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>{children}</div>;
}

interface SectionTitleProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}

function SectionTitle({ icon: Icon, title, subtitle }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Icon && <Icon className="w-5 h-5 text-emerald-600" />}
      <div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

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

  if (!city) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold text-gray-800">City Not Found</h1>
          <p className="text-gray-600 mt-2">Please check the URL and try again.</p>
        </Card>
      </div>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <motion.div {...SECTION_FADE} className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {city.name}, {city.country}
          </h1>
          <p className="text-gray-500">
            {todayData?.date?.readable} {todayData?.date?.hijri?.date}
          </p>
        </motion.div>

        {/* Faith Tabs */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-4">
            <FaithTabs active={faith} onChange={setFaith} />
          </Card>
        </motion.div>

        {/* Islamic Content */}
        <AnimatePresence mode="wait">
          {faith === 'islam' && times && (
            <motion.div key="islam" {...SECTION_FADE}>
              {/* Countdown Rings */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Next Prayer" subtitle={nextPrayer} />
                <div className="flex flex-wrap justify-center gap-6">
                </div>
              </Card>

              {/* Prayer Times Table */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Prayer Times Today" />
                <PrayerTable rows={prayerRows.map((p) => ({ name: p.name, arabicName: p.name, time: p.time, type: 'fard' as const }))} />
              </Card>

              {/* Qibla & Azan */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={MapPin} title="Qibla Direction" />
                <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                  <QiblaCompass lat={city.lat} lng={city.lng} cityName={city.name} />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800">{Math.round(qiblaDirection)}°</p>
                    <p className="text-sm text-gray-500">from North</p>
                    <div className="mt-4">
                      <AzanPlayer autoPlayEnabled={azanAutoPlay} onToggleAutoPlay={setAzanAutoPlay} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Weekly Times */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Weekly Prayer Times" />
                <WeeklyTable
                  weekData={weeklyData}
              />
              </Card>

              {/* Hadith */}
              {hadith && (
                <Card className="p-6 mb-6">
                  <SectionTitle title="Daily Hadith" />
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-gray-700 text-sm italic">{hadith.text.substring(0, 200)}...</p>
                    <p className="text-xs text-emerald-600 mt-2">{hadith.narrator} - {hadith.book}</p>
                  </div>
                </Card>
              )}

              {/* Hijri Calendar */}
              <Card className="p-6">
                <SectionTitle icon={Calendar} title="Islamic Calendar" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {HIJRI_MONTHS.map((m, i) => (
                    <div
                      key={m.en}
                      className={`p-3 rounded-lg text-center ${
                        i + 1 === todayData?.date?.hijri?.month?.number
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      <p className="text-xs font-semibold">{m.en}</p>
                      <p className="text-[10px]">{m.ar}</p>
                    </div>
                ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Christian Tab */}
          {faith === 'christian' && (
            <motion.div key="christian" {...SECTION_FADE}>
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Sunday Service Times" subtitle="By denomination" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {DENOMINATIONS.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => setSelectedDenomination(d)}
                      className={`p-4 rounded-xl text-left transition-all ${
                        selectedDenomination.name === d.name
                          ? 'bg-sky-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <p className="font-semibold text-sm">{d.name}</p>
                      <div className="mt-2 space-y-1">
                        {d.masses.map((m, i) => (
                          <p key={i} className={`text-xs ${selectedDenomination.name === d.name ? 'text-sky-100' : 'text-gray-500'}`}>
                            {m}
                          </p>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Church Calendar" subtitle="Today's liturgical season" />
                {(() => {
                  const cal = getChurchCalendar();
                  return (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6">
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
                          <p className="text-2xl font-bold text-gray-800">{cal.season}</p>
                          <p className="text-sm text-gray-600 mt-1">{cal.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle title="Daily Bible Verse" />
                {bibleVerse ? (
                  <div className="bg-amber-50 rounded-xl p-6">
                    <p className="text-gray-700 text-lg italic">"{bibleVerse.text}"</p>
                    <p className="text-amber-700 font-semibold mt-4">{bibleVerse.reference}</p>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Find a Church Nearby" />
                <a
                  href={`https://www.openstreetmap.org/search?query=church+near+${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open Map
                </a>
              </Card>
            </motion.div>
          )}

          {/* Hindu Tab */}
          {faith === 'hindu' && (
            <motion.div key="hindu" {...SECTION_FADE}>
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Today's Panchang" subtitle="Hindu almanac" />
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
                        <div key={item.label} className="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                          <p className="text-xs text-orange-600 font-semibold">{item.label}</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{item.value}</p>
                        </div>
                       ))}  
                    </div>
                  );
                })()}
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Auspicious Times" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                    <p className="text-xs text-yellow-700 font-semibold">Brahma Muhurta</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">4:24 AM - 5:12 AM</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <p className="text-xs text-green-700 font-semibold">Abhijit Muhurta</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">11:45 AM - 12:33 PM</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs text-purple-700 font-semibold">Godhuli Lagna</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">6:15 PM - 6:48 PM</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6 bg-red-50 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-2xl">!</div>
                  <div>
                    <p className="text-red-700 font-bold">Rahu Kaal Today</p>
                    {(() => {
                      const rahu = getRahuKaal();
                      return (
                        <p className="text-sm text-gray-700 mt-1">
                          {rahu.start} - {rahu.end} (Avoid starting new ventures)
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Today's Deity & Puja" />
                {(() => {
                  const deity = DEITIES[new Date().getDay() % DEITIES.length];
                  return (
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6">
                      <p className="text-xl font-bold text-gray-800">{deity.name}</p>
                      <p className="text-sm text-orange-700 mt-1">{deity.puja}</p>
                    </div>
                  );
                })()}
              </Card>

              <Card className="p-6">
                <SectionTitle icon={Calendar} title="Upcoming Hindu Festivals" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {HINDU_FESTIVALS.map((f) => (
                    <div key={f.name} className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center">
                      <p className="font-semibold text-gray-800">{f.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{f.date}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-1">
                        {Math.ceil((new Date(f.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Jewish Tab */}
          {faith === 'jewish' && (
            <motion.div key="jewish" {...SECTION_FADE}>
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Shabbat Times" />
                {shabbatTimes ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-xl p-6">
                      <p className="text-xs text-blue-600 font-semibold">Candle Lighting</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{shabbatTimes.candleLighting}</p>
                      <p className="text-xs text-gray-500 mt-1">Friday evening</p>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-6">
                      <p className="text-xs text-purple-600 font-semibold">Havdalah</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{shabbatTimes.havdalah}</p>
                      <p className="text-xs text-gray-500 mt-1">Saturday evening</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Hebrew Date & Torah Portion" />
                <div className="bg-blue-900 rounded-xl p-6 text-white">
                  <p className="text-xs text-blue-200 font-semibold">Today in Hebrew Calendar</p>
                  <p className="text-2xl font-bold mt-2">{shabbatTimes?.hebrewDate || 'Loading...'}</p>
                  <p className="text-xs text-blue-200 mt-4">Parsha</p>
                  <p className="text-lg font-semibold">{shabbatTimes?.parsha || 'Loading...'}</p>
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={Calendar} title="Upcoming Jewish Holidays" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {JEWISH_HOLIDAYS.map((h) => (
                    <div key={h.name} className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                      <p className="font-semibold text-gray-800">{h.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{h.date}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">
                        {Math.ceil((new Date(h.date).getTime() - Date.now()) / 86400000)} days
                      </p>
                    </div>
                ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Sikh Tab */}
          {faith === 'sikh' && (
            <motion.div key="sikh" {...SECTION_FADE}>
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Amrit Vela" subtitle="Sikh early morning prayer" />
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6">
                  <p className="text-xs text-amber-700 font-semibold">Rise and meditate during Amrit Vela</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">3:00 AM - 6:00 AM</p>
                  <p className="text-sm text-gray-600 mt-2">The ambrosial hours before dawn</p>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Today's Hukamnama" />
                {hukamnama ? (
                  <div className="bg-orange-900 rounded-xl p-6 text-white">
                    <p className="text-xs text-orange-200 font-semibold">From {hukamnama.source}</p>
                    <p className="text-sm mt-3">{hukamnama.shabad?.substring(0, 200)}...</p>
                    <p className="text-sm text-orange-200 mt-4">Ang (Page): {hukamnama.ang}</p>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Upcoming Gurpurabs" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {GURPURABS.map((g) => (
                    <div key={g.name} className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
                      <p className="font-semibold text-gray-800">{g.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{g.date}</p>
                      <p className="text-xs text-amber-600 font-semibold mt-1">
                        {Math.ceil((new Date(g.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                ))}
                </div>
              </Card>

              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Find a Gurdwara Nearby" />
                <a
                  href={`https://www.openstreetmap.org/search?query=gurdwara+near+${encodeURIComponent(city.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open Map
                </a>
              </Card>
            </motion.div>
          )}

          {/* No Religion Tab */}
          {faith === 'none' && (
            <motion.div key="none" {...SECTION_FADE}>
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Best Times for Mindfulness" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-orange-50 rounded-xl p-6">
                    <p className="text-xs text-orange-600 font-semibold">Sunrise</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{times ? formatTime(times.Sunrise) : '6:00 AM'}</p>
                    <p className="text-xs text-gray-500 mt-1">New beginnings meditation</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6">
                    <p className="text-xs text-purple-600 font-semibold">Sunset</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{times ? formatTime(times.Maghrib) : '6:30 PM'}</p>
                    <p className="text-xs text-gray-500 mt-1">Gratitude reflection</p>
                  </div>
                  <div className="bg-slate-800 rounded-xl p-6 text-white">
                    <p className="text-xs text-slate-300 font-semibold">Midnight</p>
                    <p className="text-2xl font-bold mt-2">12:00 AM</p>
                    <p className="text-xs text-slate-300 mt-1">Deep silence meditation</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="4-7-8 Breathing Exercise" />
                <div className="bg-teal-50 rounded-xl p-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-teal-200 animate-pulse" style={{ animationDuration: '7s' }} />
                      <div className="absolute inset-4 rounded-full bg-teal-300 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
                      <div className="absolute inset-8 rounded-full bg-teal-400 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-teal-700 font-semibold">Inhale for 4 seconds...</p>
                    <p className="text-teal-600">Hold for 7 seconds...</p>
                    <p className="text-teal-500">Exhale for 8 seconds...</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Daily Reflection" />
                {(() => {
                  const quote = getDailyQuote();
                  return (
                    <div className="bg-slate-800 rounded-xl p-6 text-white">
                      <p className="text-lg italic">"{quote.text}"</p>
                      <p className="text-slate-300 font-semibold mt-4">-- {quote.author}</p>
                    </div>
                  );
                })()}
              </Card>

              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Mental Wellness Support" />
                <div className="bg-rose-50 rounded-xl p-6">
                  <p className="text-rose-700 font-semibold">Need someone to talk to?</p>
                  <p className="text-sm text-gray-600 mt-2">Help is available 24/7.</p>
                  <p className="text-sm text-gray-700 mt-4">International: findahelpline.com</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prayer Learning Section */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Settings} title="How to Pray" subtitle={PRAYER_GUIDES[faith]?.name || 'Prayer Guide'} />
            {(() => {
              const guide = PRAYER_GUIDES[faith];
              if (!guide) return null;
              return (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {guide.steps.map((step, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold mb-2">
                          {i + 1}
                        </div>
                        <p className="font-semibold text-sm text-gray-800">{step.title}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100"
                      >
                        {r.title}
                      </a>
                  ))}
                  </div>
                </div>
              );
            })()}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}












