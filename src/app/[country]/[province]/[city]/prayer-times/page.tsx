import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Settings, Calendar, Clock, MapPin, ChevronDown, BookOpen, Heart } from 'lucide-react';
import jsPDF from 'jspdf';

import FaithTabs, { type FaithKey } from '../../../../../components/prayer/FaithTabs';
import CountdownRing from '../../../../../components/prayer/CountdownRing';
import PrayerTable, { type PrayerRow } from '../../../../../components/prayer/PrayerTable';
import QiblaCompass from '../../../../../components/prayer/QiblaCompass';
import WeeklyTable from '../../../../../components/prayer/WeeklyTable';
import AzanPlayer from '../../../../../components/prayer/AzanPlayer';

import {
  fetchPrayerTimes,
  fetchWeeklyPrayerTimes,
  fetchMonthlyPrayerTimes,
  calcTahajjud,
  calcIshraq,
  calcDuha,
  calcWitr,
  formatTime,
  CALC_METHODS,
  type CalcMethod,
  type MadhabMethod,
  type DayData,
} from '../../../../../lib/apis/prayer';

import {
  HIJRI_MONTHS,
  ISLAMIC_EVENTS_2025,
  fetchMoonPhase,
  getMoonPhaseEmoji,
  getMoonPhaseName,
  fetchGoldPrice,
  fetchSilverPrice,
  fetchQuranVerse,
  fetchHadith,
  getNameOfAllahForToday,
  daysUntilEvent,
} from '../../../../../lib/apis/islamic';

import {
  fetchBibleVerse,
  getChurchCalendar,
  DENOMINATIONS,
  calculatePanchang,
  getRahuKaal,
  HINDU_FESTIVALS,
  DEITIES,
  fetchShabbatTimes,
  fetchHebrewDate,
  JEWISH_HOLIDAYS,
  fetchHukamnama,
  GURPURABS,
  getDailyQuote,
  PRAYER_GUIDES,
} from '../../../../../lib/apis/faiths';

import type { City } from '../../../../../types/city';

interface Props {
  params: { country: string; province: string; city: string };
  cityData?: City;
}

const SECTION_FADE = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
        <Icon className="w-5 h-5 text-emerald-700" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

const FAITH_CONTENT: Record<FaithKey, { label: string; description: string; color: string }> = {
  islam: {
    label: 'Islam',
    description: 'Daily Salah times based on Quran and Sunnah',
    color: 'text-emerald-700',
  },
  christian: {
    label: 'Christianity',
    description: 'Liturgy of the Hours — Morning & Evening Prayer',
    color: 'text-sky-700',
  },
  hindu: {
    label: 'Hinduism',
    description: 'Sandhyavandanam — dawn, noon and dusk worship',
    color: 'text-orange-600',
  },
  jewish: {
    label: 'Judaism',
    description: 'Shacharit, Mincha & Ma\'ariv daily prayers',
    color: 'text-blue-700',
  },
  buddhist: {
    label: 'Buddhism',
    description: 'Meditation sessions at dawn, midday & dusk',
    color: 'text-amber-700',
  },
  sikh: {
    label: 'Sikhism',
    description: 'Nitnem — Amritvela, Rehras & Kirtan Sohila',
    color: 'text-yellow-700',
  },
  none: {
    label: 'Mindfulness',
    description: 'Mindful moments at sunrise, noon & sunset',
    color: 'text-gray-600',
  },
};

export default function PrayerTimesPage({ params, cityData }: Props) {
  const city: City = cityData ?? {
    name: params?.city ?? 'Lahore',
    city_slug: params?.city ?? 'lahore',
    country: params?.country ?? 'Pakistan',
    country_code: 'PK',
    country_slug: params?.country ?? 'pakistan',
    province: params?.province ?? 'Punjab',
    province_slug: params?.province ?? 'punjab',
    lat: 31.5497,
    lng: 74.3436,
    population: 13000000,
    timezone: 'Asia/Karachi',
    major_religion: 'Islam',
    religion_percent: 97,
    primary_color: '#01411C',
    secondary_color: '#2d6a4f',
    famous_for: 'Mughal architecture',
    famous_products: 'Textiles',
    emergency_police: '15',
    emergency_ambulance: '1122',
    emergency_fire: '16',
    region: 'South Asia',
    is_active: true,
  };

  const [faith, setFaith] = useState<FaithKey>('islam');
  const [method, setMethod] = useState<CalcMethod>(1);
  const [madhab, setMadhab] = useState<MadhabMethod>(1);
  const [todayData, setTodayData] = useState<DayData | null>(null);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // New state for Islamic sections
  const [moonPhase, setMoonPhase] = useState<{ illumination: number } | null>(null);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [silverPrice, setSilverPrice] = useState<number | null>(null);
  const [quranVerse, setQuranVerse] = useState<{ text: string; surah: string; ayah: number } | null>(null);
  const [hadith, setHadith] = useState<{ text: string; narrator: string; book: string } | null>(null);

  // Other faiths data
  const [bibleVerse, setBibleVerse] = useState<{ text: string; reference: string } | null>(null);
  const [shabbatTimes, setShabbatTimes] = useState<{ candleLighting: string; havdalah: string; parsha: string; hebrewDate: string } | null>(null);
  const [hukamnama, setHukamnama] = useState<{ shabad: string; ang: number; source: string } | null>(null);
  const [selectedDenomination, setSelectedDenomination] = useState(DENOMINATIONS[0]);

  // Zakat calculator state
  const [zakatForm, setZakatForm] = useState({ cash: '', gold: '', silver: '', business: '', investments: '' });
  const [zakatResult, setZakatResult] = useState<number | null>(null);

  const loadPrayers = useCallback(async () => {
    setLoading(true);
    const [today, week] = await Promise.all([
      fetchPrayerTimes(city.lat, city.lng, method, madhab),
      fetchWeeklyPrayerTimes(city.lat, city.lng, method, madhab),
    ]);
    setTodayData(today);
    setWeekData(week);
    setLoading(false);
  }, [city.lat, city.lng, method, madhab]);

  useEffect(() => { loadPrayers(); }, [loadPrayers]);

  // Fetch additional Islamic data
  useEffect(() => {
    Promise.all([
      fetchMoonPhase(city.lat, city.lng).then(setMoonPhase),
      fetchGoldPrice().then(setGoldPrice),
      fetchSilverPrice().then(setSilverPrice),
      fetchQuranVerse().then(setQuranVerse),
      fetchHadith().then(setHadith),
      fetchBibleVerse().then(setBibleVerse),
      fetchShabbatTimes(city.lat, city.lng).then(setShabbatTimes),
      fetchHukamnama().then(setHukamnama),
    ]);
  }, [city.lat, city.lng]);

  // Auto-play notification
  useEffect(() => {
    if (!autoPlay || !todayData) return;
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const timers = prayers.map((p) => {
      const raw = todayData.timings[p];
      const [h, m] = raw.replace(/\s*(AM|PM).*/i, '').split(':').map(Number);
      const pTime = new Date();
      pTime.setHours(h, m, 0, 0);
      const ms = pTime.getTime() - Date.now();
      if (ms > 0) {
        return setTimeout(() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${p} Time`, {
              body: `It's time for ${p} in ${city.name}`,
              icon: '/favicon.ico',
            });
          }
        }, ms);
      }
      return null;
    });
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [autoPlay, todayData, city.name]);

  const buildPrayerRows = (): PrayerRow[] => {
    if (!todayData) return [];
    const t = todayData.timings;
    return [
      { name: 'Tahajjud', arabicName: 'تهجد', time: calcTahajjud(t.Isha, t.Fajr), type: 'optional', icon: '🌙' },
      { name: 'Fajr', arabicName: 'الفجر', time: t.Fajr, type: 'fard', icon: '🌄' },
      { name: 'Ishraq', arabicName: 'الإشراق', time: calcIshraq(t.Sunrise), type: 'sunnah', icon: '🌅' },
      { name: 'Duha', arabicName: 'الضحى', time: calcDuha(t.Sunrise), type: 'optional', icon: '☀️' },
      { name: 'Dhuhr', arabicName: 'الظهر', time: t.Dhuhr, type: 'fard', icon: '🕛' },
      { name: 'Asr', arabicName: 'العصر', time: t.Asr, type: 'fard', icon: '🌤️' },
      { name: 'Maghrib', arabicName: 'المغرب', time: t.Maghrib, type: 'fard', icon: '🌇' },
      { name: 'Isha', arabicName: 'العشاء', time: t.Isha, type: 'fard', icon: '🌃' },
      { name: 'Witr', arabicName: 'الوتر', time: calcWitr(t.Isha), type: 'sunnah', icon: '⭐' },
    ];
  };

  const prayerRows = buildPrayerRows();

  const countdownPrayers = prayerRows
    .filter((r) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(r.name))
    .map((r) => ({ name: r.name, time: r.time, arabicName: r.arabicName }));

  const calculateZakat = () => {
    const total =
      parseFloat(zakatForm.cash || '0') +
      parseFloat(zakatForm.gold || '0') +
      parseFloat(zakatForm.silver || '0') +
      parseFloat(zakatForm.business || '0') +
      parseFloat(zakatForm.investments || '0');
    const nisab = silverPrice ? silverPrice * 612.36 : 5000;
    if (total >= nisab) {
      setZakatResult(total * 0.025);
    } else {
      setZakatResult(0);
    }
  };

  const downloadMonthlyPDF = async () => {
    setPdfLoading(true);
    const now = new Date();
    const monthData = await fetchMonthlyPrayerTimes(
      city.lat, city.lng, method, madhab, now.getMonth() + 1, now.getFullYear()
    );
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const methodLabel = CALC_METHODS.find((m) => m.value === method)?.label ?? 'Standard';
    const madhabLabel = madhab === 1 ? 'Hanafi' : "Shafi'i";

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(5, 150, 105);
    doc.text(`Prayer Times — ${city.name}, ${city.province}`, 14, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(
      `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()} | Method: ${methodLabel} | Madhab: ${madhabLabel}`,
      14,
      25
    );

    const headers = ['Date', 'Day', 'Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const colWidths = [22, 22, 28, 28, 28, 28, 28, 28];
    const startX = 14;
    let y = 32;

    doc.setFillColor(5, 150, 105);
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 7, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    let x = startX;
    headers.forEach((h, i) => {
      doc.text(h, x + 2, y + 5);
      x += colWidths[i];
    });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    monthData.forEach((day, idx) => {
      const isEven = idx % 2 === 0;
      doc.setFillColor(isEven ? 240 : 255, isEven ? 253 : 255, isEven ? 244 : 255);
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 6, 'F');
      doc.setTextColor(50);

      const vals = [
        day.date.gregorian.date,
        day.date.gregorian.weekday.en.substring(0, 3),
        formatTime(day.timings.Fajr),
        formatTime(day.timings.Sunrise),
        formatTime(day.timings.Dhuhr),
        formatTime(day.timings.Asr),
        formatTime(day.timings.Maghrib),
        formatTime(day.timings.Isha),
      ];
      x = startX;
      vals.forEach((v, i) => {
        doc.text(v, x + 2, y + 4.5);
        x += colWidths[i];
      });
      y += 6;
      if (y > 185) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(7);
    doc.setTextColor(150);
    doc.text('Generated by WorldCityHub.com | Data: Aladhan API', 14, 200);
    doc.save(`prayer-times-${city.city_slug}-${now.getFullYear()}-${now.getMonth() + 1}.pdf`);
    setPdfLoading(false);
  };

  const hijriDate = todayData?.date.hijri;
  const gregorianDate = todayData?.date.gregorian;

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <div className="relative text-white" style={{ backgroundColor: city.primary_color }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-xs mb-4">
            <span>{city.country}</span>
            <span>/</span>
            <span>{city.province}</span>
            <span>/</span>
            <span>{city.name}</span>
            <span>/</span>
            <span className="text-white font-medium">Prayer Times</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-white/70" />
                <h1 className="text-3xl sm:text-4xl font-bold">{city.name} Prayer Times</h1>
              </div>
              <p className="text-white/80 text-sm">{city.province}, {city.country}</p>
              {gregorianDate && (
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    {gregorianDate.weekday.en}, {gregorianDate.date}
                  </span>
                  {hijriDate && (
                    <span className="bg-white/20 rounded-full px-3 py-1">
                      {hijriDate.date} {hijriDate.month.en} {hijriDate.year} AH
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span>Lat: {city.lat.toFixed(4)}</span>
              <span>Lng: {city.lng.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Section 1: Faith Tabs */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Clock} title="Select Your Faith" subtitle="Prayer schedules for all faiths" />
            <FaithTabs active={faith} onChange={setFaith} />
            <AnimatePresence mode="wait">
              <motion.div
                key={faith}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
              >
                <p className={`font-semibold text-sm ${FAITH_CONTENT[faith].color}`}>
                  {FAITH_CONTENT[faith].label}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">{FAITH_CONTENT[faith].description}</p>
                {faith !== 'islam' && (
                  <p className="text-xs text-gray-400 mt-2">
                    Note: Detailed schedules for this faith are shown below based on your timezone.
                    The Qibla and prayer countdown are specific to Islam.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Calculation & Madhab settings */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Settings} title="Calculation Settings" />
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Method selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Calculation Method
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-emerald-400 transition-colors"
                  >
                    <span>{CALC_METHODS.find((m) => m.value === method)?.label}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <AnimatePresence>
                    {showMethodDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden"
                      >
                        {CALC_METHODS.map((m) => (
                          <button
                            key={m.value}
                            onClick={() => { setMethod(m.value); setShowMethodDropdown(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors ${
                              method === m.value ? 'text-emerald-700 font-semibold bg-emerald-50' : 'text-gray-700'
                            }`}
                          >
                            {m.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Madhab selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Asr Madhab
                </label>
                <div className="flex gap-3">
                  {(['Hanafi', "Shafi'i"] as const).map((m, i) => (
                    <button
                      key={m}
                      onClick={() => setMadhab(i === 0 ? 1 : 0)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        (i === 0 ? madhab === 1 : madhab === 0)
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-400'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Hanafi uses later Asr time. Shafi'i uses earlier time.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 2 & 3: Countdown + Full Prayer Table */}
        <motion.div {...SECTION_FADE}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Countdown */}
            <Card className="p-6 flex flex-col items-center justify-center">
              <SectionTitle icon={Clock} title="Next Prayer" />
              {loading ? (
                <div className="w-52 h-52 rounded-full bg-gray-100 animate-pulse" />
              ) : (
                <CountdownRing prayers={countdownPrayers} />
              )}
            </Card>

            {/* Prayer Table */}
            <Card className="p-6 lg:col-span-2">
              <SectionTitle icon={Clock} title="Today's Prayer Schedule" subtitle="All prayers including optional" />
              {loading ? (
                <div className="space-y-2">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <PrayerTable rows={prayerRows} />
              )}
            </Card>
          </div>
        </motion.div>

        {/* Section 4 & 6 side-by-side: Qibla + Azan */}
        <motion.div {...SECTION_FADE}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Section 4: Qibla Compass */}
            <Card className="p-6">
              <SectionTitle icon={MapPin} title="Qibla Direction" subtitle="Direction towards Mecca" />
              <QiblaCompass lat={city.lat} lng={city.lng} cityName={city.name} />
            </Card>

            {/* Section 9: Azan Player */}
            <Card className="p-6">
              <SectionTitle icon={Clock} title="Azan Audio" subtitle="Choose your preferred reciter" />
              <AzanPlayer autoPlayEnabled={autoPlay} onToggleAutoPlay={setAutoPlay} />
            </Card>
          </div>
        </motion.div>

        {/* Section 7: Weekly Timetable */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Calendar} title="7-Day Timetable" subtitle="Prayer times for the week ahead" />
            {loading ? (
              <div className="space-y-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <WeeklyTable weekData={weekData} />
            )}
          </Card>
        </motion.div>

        {/* Section 8: Monthly PDF Download */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <SectionTitle icon={Download} title="Monthly Timetable PDF" subtitle="Download full month prayer schedule" />
                <p className="text-sm text-gray-500 -mt-4 ml-13">
                  Includes all 5 daily prayers for every day of the month,
                  formatted for print or digital use.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={downloadMonthlyPDF}
                disabled={pdfLoading}
                className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md disabled:opacity-60 whitespace-nowrap"
              >
                {pdfLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </>
                )}
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Faith-Specific Sections */}
        <AnimatePresence mode="wait">
          {faith === 'christian' && (
            <motion.div key="christian" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Christian Sunday Services */}
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

              {/* Church Calendar */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Church Calendar" subtitle="Today's liturgical season" />
                {(() => {
                  const cal = getChurchCalendar();
                  return (
                    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-6 border border-sky-100">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                          style={{ backgroundColor: cal.color === 'purple' ? '#7c3aed' : cal.color === 'white' ? '#f59e0b' : cal.color === 'green' ? '#10b981' : '#ef4444' }}
                        >
                          {cal.season.charAt(0)}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{cal.season}</p>
                          <p className="text-sm text-gray-600 mt-1">{cal.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Week {cal.seasonWeek}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {/* Bible Verse */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Daily Bible Verse" />
                {bibleVerse ? (
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                    <p className="text-gray-700 text-lg italic leading-relaxed">"{bibleVerse.text}"</p>
                    <p className="text-amber-700 font-semibold mt-4">{bibleVerse.reference}</p>
                    <p className="text-xs text-gray-400 mt-1">{bibleVerse.translation}</p>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              {/* Find Church */}
              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Find a Church Nearby" />
                <p className="text-sm text-gray-600 mb-4">
                  Search for churches in your area using OpenStreetMap
                </p>
                <a
                  href={`https://www.openstreetmap.org/search?query=church+near+${encodeURIComponent(city.name)}#${city.lat}/${city.lng}`}
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

          {faith === 'hindu' && (
            <motion.div key="hindu" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Panchang */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Today's Panchang" subtitle="Hindu almanac" />
                {(() => {
                  const panchang = calculatePanchang();
                  return (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {[
                        { label: 'Tithi', value: panchang.tithi, icon: '🌒' },
                        { label: 'Nakshatra', value: panchang.nakshatra, icon: '⭐' },
                        { label: 'Yoga', value: panchang.yoga, icon: '🧘' },
                        { label: 'Karana', value: panchang.karana, icon: '⏰' },
                        { label: 'Var (Day)', value: panchang.var, icon: '🌞' },
                      ].map((item) => (
                        <div key={item.label} className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center">
                          <span className="text-2xl">{item.icon}</span>
                          <p className="text-xs text-orange-600 font-semibold mt-2">{item.label}</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </Card>

              {/* Auspicious Times */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Auspicious Times" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                    <p className="text-xs text-yellow-700 font-semibold">Brahma Muhurta</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">4:24 AM - 5:12 AM</p>
                    <p className="text-xs text-gray-500 mt-1">Best for meditation</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                    <p className="text-xs text-green-700 font-semibold">Abhijit Muhurta</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">11:45 AM - 12:33 PM</p>
                    <p className="text-xs text-gray-500 mt-1">Most auspicious midday</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-xs text-purple-700 font-semibold">Godhuli Lagna</p>
                    <p className="text-lg font-bold text-gray-800 mt-1">6:15 PM - 6:48 PM</p>
                    <p className="text-xs text-gray-500 mt-1">Sunset sandhya</p>
                  </div>
                </div>
              </Card>

              {/* Rahu Kaal Warning */}
              <Card className="p-6 mb-6 bg-red-50 border border-red-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
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

              {/* Today's Deity */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Today's Deity & Puja" />
                {(() => {
                  const today = new Date().getDay();
                  const deity = DEITIES[today % DEITIES.length];
                  return (
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center gap-4">
                        <span className="text-5xl">{deity.icon}</span>
                        <div>
                          <p className="text-xl font-bold text-gray-800">{deity.name}</p>
                          <p className="text-sm text-orange-700 mt-1">{deity.puja}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Card>

              {/* Hindu Festivals */}
              <Card className="p-6">
                <SectionTitle icon={Calendar} title="Upcoming Hindu Festivals" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {HINDU_FESTIVALS.map((f) => (
                    <div key={f.name} className="bg-orange-50 rounded-xl p-4 border border-orange-100 text-center">
                      <span className="text-3xl">{f.icon}</span>
                      <p className="font-semibold text-gray-800 mt-2">{f.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-xs text-orange-600 font-semibold mt-1">
                        {Math.ceil((new Date(f.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {faith === 'jewish' && (
            <motion.div key="jewish" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Shabbat Times */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Shabbat Times" subtitle="Candle lighting and Havdalah" />
                {shabbatTimes ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100">
                      <p className="text-xs text-indigo-600 font-semibold">🕯️ Candle Lighting</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{shabbatTimes.candleLighting}</p>
                      <p className="text-xs text-gray-500 mt-1">Friday evening</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                      <p className="text-xs text-purple-600 font-semibold">✨ Havdalah</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{shabbatTimes.havdalah}</p>
                      <p className="text-xs text-gray-500 mt-1">Saturday evening</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              {/* Hebrew Date */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Hebrew Date & Torah Portion" />
                <div className="bg-blue-900 rounded-xl p-6 text-white">
                  <p className="text-xs text-blue-200 font-semibold">Today in Hebrew Calendar</p>
                  <p className="text-2xl font-bold mt-2">{shabbatTimes?.hebrewDate || 'Loading...'}</p>
                  <div className="mt-4 pt-4 border-t border-blue-700">
                    <p className="text-xs text-blue-200">Parsha (Torah Portion)</p>
                    <p className="text-lg font-semibold mt-1">{shabbatTimes?.parsha || 'Loading...'}</p>
                  </div>
                </div>
              </Card>

              {/* Jewish Holidays */}
              <Card className="p-6">
                <SectionTitle icon={Calendar} title="Upcoming Jewish Holidays" />
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {JEWISH_HOLIDAYS.map((h) => (
                    <div key={h.name} className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                      <span className="text-3xl">{h.icon}</span>
                      <p className="font-semibold text-gray-800 mt-2">{h.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">
                        {Math.ceil((new Date(h.date).getTime() - Date.now()) / 86400000)} days
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {faith === 'sikh' && (
            <motion.div key="sikh" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Amrit Vela */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Amrit Vela" subtitle="Sikh early morning prayer time" />
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-6 border border-amber-200">
                  <p className="text-xs text-amber-700 font-semibold">Rise and meditate during Amrit Vela</p>
                  <p className="text-4xl font-bold text-gray-800 mt-2">3:00 AM - 6:00 AM</p>
                  <p className="text-sm text-gray-600 mt-2">The ambrosial hours before dawn for Japji Sahib and Simran</p>
                </div>
              </Card>

              {/* Hukamnama */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Today's Hukamnama" subtitle="Divine command from Sri Guru Granth Sahib" />
                {hukamnama ? (
                  <div className="bg-orange-900 rounded-xl p-6 text-white">
                    <p className="text-xs text-orange-200 font-semibold">From {hukamnama.source}</p>
                    <p className="text-lg font-semibold mt-3 leading-relaxed">{hukamnama.shabad.substring(0, 200)}...</p>
                    <p className="text-sm text-orange-200 mt-4">Ang (Page): {hukamnama.ang}</p>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                )}
              </Card>

              {/* Gurpurabs */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Upcoming Gurpurabs" subtitle="Sikh holidays and celebrations" />
                <div className="grid sm:grid-cols-3 gap-4">
                  {GURPURABS.map((g) => (
                    <div key={g.name} className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-center">
                      <span className="text-3xl">{g.icon}</span>
                      <p className="font-semibold text-gray-800 mt-2">{g.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(g.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-amber-600 font-semibold mt-1">
                        {Math.ceil((new Date(g.date).getTime() - Date.now()) / 86400000)} days away
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Find Gurdwara */}
              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Find a Gurdwara Nearby" />
                <a
                  href={`https://www.openstreetmap.org/search?query=gurdwara+near+${encodeURIComponent(city.name)}#${city.lat}/${city.lng}`}
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

          {faith === 'none' && (
            <motion.div key="none" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              {/* Mindfulness Times */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="Best Times for Mindfulness" subtitle="Natural moments for reflection" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                    <p className="text-xs text-orange-600 font-semibold">🌅 Sunrise</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{todayData ? formatTime(todayData.timings.Sunrise) : '6:00 AM'}</p>
                    <p className="text-xs text-gray-500 mt-1">New beginnings meditation</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                    <p className="text-xs text-purple-600 font-semibold">🌇 Sunset</p>
                    <p className="text-2xl font-bold text-gray-800 mt-2">{todayData ? formatTime(todayData.timings.Maghrib) : '6:30 PM'}</p>
                    <p className="text-xs text-gray-500 mt-1">Gratitude reflection</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                    <p className="text-xs text-slate-300 font-semibold">🌙 Midnight</p>
                    <p className="text-2xl font-bold mt-2">12:00 AM</p>
                    <p className="text-xs text-slate-300 mt-1">Deep silence meditation</p>
                  </div>
                </div>
              </Card>

              {/* Breathing Exercise */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Clock} title="4-7-8 Breathing Exercise" subtitle="Calm your nervous system" />
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-8 border border-teal-100">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-teal-200 animate-pulse" style={{ animationDuration: '7s' }} />
                      <div className="absolute inset-4 rounded-full bg-teal-300 animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
                      <div className="absolute inset-8 rounded-full bg-teal-400 animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🧘</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-teal-700 font-semibold">Inhale for 4 seconds...</p>
                    <p className="text-teal-600">Hold for 7 seconds...</p>
                    <p className="text-teal-500">Exhale for 8 seconds...</p>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    Repeat 4 cycles for calm and clarity
                  </p>
                </div>
              </Card>

              {/* Daily Quote */}
              <Card className="p-6 mb-6">
                <SectionTitle icon={Calendar} title="Daily Reflection" />
                {(() => {
                  const quote = getDailyQuote();
                  return (
                    <div className="bg-slate-800 rounded-xl p-6 text-white">
                      <p className="text-lg italic leading-relaxed">"{quote.text}"</p>
                      <p className="text-slate-300 font-semibold mt-4">— {quote.author}</p>
                    </div>
                  );
                })()}
              </Card>

              {/* Mental Wellness Helpline */}
              <Card className="p-6">
                <SectionTitle icon={MapPin} title="Mental Wellness Support" />
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-6 border border-rose-200">
                  <p className="text-rose-700 font-semibold">Need someone to talk to?</p>
                  <p className="text-sm text-gray-600 mt-2">
                    If you or someone you know is struggling, help is available 24/7.
                  </p>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Pakistan:</span> +92-42-111-111-561
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">India:</span> 1800-120-820050
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">International:</span> findahelpline.com
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prayer Learning Section (All Faiths) */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle
              icon={Settings}
              title="How to Pray"
              subtitle={`Learn ${PRAYER_GUIDES[faith]?.name || 'prayer'} practice`}
            />
            {(() => {
              const guide = PRAYER_GUIDES[faith];
              if (!guide) return null;
              return (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {guide.steps.slice(0, 8).map((step, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-emerald-300 transition-colors"
                      >
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                      >
                        {r.title}
                        <span className="text-xs">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}
          </Card>
        </motion.div>

        {/* Section: Islamic Calendar */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Calendar} title="Islamic Calendar" subtitle="Hijri dates and important events" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Hijri Date */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-semibold mb-1">Today in Hijri</p>
                {hijriDate ? (
                  <>
                    <p className="text-2xl font-bold text-gray-800">{hijriDate.date} {hijriDate.month.en}</p>
                    <p className="text-lg text-emerald-700 font-arabic">{hijriDate.month.ar}</p>
                    <p className="text-sm text-gray-600 mt-1">{hijriDate.year} AH</p>
                    <p className="text-xs text-gray-400 mt-2">{hijriDate.weekday.en}</p>
                  </>
                ) : (
                  <div className="h-20 bg-white/50 rounded-lg animate-pulse" />
                )}
              </div>

              {/* Days in Month */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                <p className="text-xs text-gray-500 font-semibold mb-1">Current Month</p>
                {hijriDate && (
                  <>
                    <p className="text-xl font-bold text-gray-800">{hijriDate.month.en}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {HIJRI_MONTHS[hijriDate.month.number - 1]?.days || 30} days
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Month {hijriDate.month.number} of 12
                    </p>
                  </>
                )}
              </div>

              {/* Important Events Countdown */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <p className="text-xs text-amber-600 font-semibold mb-2">Upcoming Events</p>
                <div className="space-y-2">
                  {ISLAMIC_EVENTS_2025.slice(0, 3).map((e) => {
                    const days = daysUntilEvent(e.gregorian);
                    return (
                      <div key={e.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{e.name}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          days > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {days > 0 ? `${days} days` : 'Passed'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2025 Islamic Year Overview */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Islamic Year 1446-1447 AH — All Months</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {HIJRI_MONTHS.map((m, i) => (
                  <div key={m.en} className={`text-center p-2 rounded-lg ${
                    i + 1 === (hijriDate?.month.number || 0)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    <p className="text-xs font-semibold">{i + 1}</p>
                    <p className={`text-[10px] ${i + 1 === (hijriDate?.month.number || 0) ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {m.en.substring(0, 4)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ramadan 2026 Countdown */}
            <div className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-xs text-emerald-100 font-semibold">Ramadan 2026</p>
                  <p className="text-2xl font-bold mt-1">Countdown</p>
                  <p className="text-sm text-emerald-100 mt-0.5">1 Ramadan 1447 AH — Starting Feb 28, 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">{daysUntilEvent('2026-02-28')}</p>
                  <p className="text-xs text-emerald-100">days away</p>
                </div>
              </div>
            </div>

            {/* Sehri/Iftar Times */}
            {todayData && (
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs text-indigo-600 font-semibold">Sehri End (Sahur)</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formatTime(todayData.timings.Imsak)}</p>
                  <p className="text-xs text-gray-400 mt-1">Stop eating before Fajr</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <p className="text-xs text-orange-600 font-semibold">Iftar Time</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{formatTime(todayData.timings.Maghrib)}</p>
                  <p className="text-xs text-gray-400 mt-1">Break fast at Maghrib</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Section: Zakat Calculator */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle
              icon={Settings}
              title="Zakat Calculator"
              subtitle="Calculate your annual Zakat obligation"
            />
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Nisab Display */}
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <p className="text-xs text-amber-600 font-semibold mb-2">Today's Nisab Threshold</p>
                {goldPrice ? (
                  <>
                    <p className="text-2xl font-bold text-gray-800">${((goldPrice * 85.5) || 5200).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-1">Based on 87.48g gold</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Loading gold price...</p>
                )}
                {silverPrice && (
                  <p className="text-xs text-gray-500 mt-2">
                    Silver Nisab: ${((silverPrice * 612.36) || 400).toFixed(2)} (612.36g)
                  </p>
                )}
              </div>

              {/* Input Fields */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: 'cash', label: 'Cash & Bank', placeholder: '0.00' },
                    { key: 'gold', label: 'Gold Value', placeholder: '0.00' },
                    { key: 'silver', label: 'Silver Value', placeholder: '0.00' },
                    { key: 'business', label: 'Business Assets', placeholder: '0.00' },
                    { key: 'investments', label: 'Investments', placeholder: '0.00' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                      <input
                        type="number"
                        placeholder={f.placeholder}
                        value={zakatForm[f.key as keyof typeof zakatForm]}
                        onChange={(e) => setZakatForm({ ...zakatForm, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={calculateZakat}
                    className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Calculate Zakat
                  </button>
                  <a
                    href="https://www.islamicrelief.org/zakat-calculator/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    Learn about Zakat
                  </a>
                </div>
                {zakatResult !== null && (
                  <div className={`mt-4 p-4 rounded-xl ${zakatResult > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-gray-50 border border-gray-200'}`}>
                    {zakatResult > 0 ? (
                      <>
                        <p className="text-xs text-emerald-600 font-semibold">Your Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-emerald-700 mt-1">${zakatResult.toFixed(2)}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600">Your assets are below Nisab threshold. No Zakat is due.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section: Daily Islamic Content */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={Clock} title="Daily Islamic Content" subtitle="Quran, Hadith, and Names of Allah" />
            <div className="grid md:grid-cols-3 gap-6">
              {/* Quran Verse */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-emerald-600 font-semibold">Quran Verse of the Day</p>
                  <button
                    onClick={() => quranVerse && navigator.share?.({ text: `"${quranVerse.text}" - ${quranVerse.surah} ${quranVerse.ayah}` })}
                    className="text-gray-400 hover:text-emerald-600 text-xs"
                  >
                    Share
                  </button>
                </div>
                {quranVerse ? (
                  <>
                    <p className="text-sm text-gray-700 leading-relaxed italic">"{quranVerse.text}"</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-3">— {quranVerse.surah} {quranVerse.ayah}</p>
                  </>
                ) : (
                  <div className="h-24 bg-white/50 rounded-lg animate-pulse" />
                )}
              </div>

              {/* Hadith */}
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-5 border border-sky-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-sky-600 font-semibold">Hadith of the Day</p>
                  <button
                    onClick={() => hadith && navigator.share?.({ text: `"${hadith.text}" - ${hadith.book}` })}
                    className="text-gray-400 hover:text-sky-600 text-xs"
                  >
                    Share
                  </button>
                </div>
                {hadith ? (
                  <>
                    <p className="text-sm text-gray-700 leading-relaxed">{hadith.text.substring(0, 200)}...</p>
                    <p className="text-xs text-sky-600 font-semibold mt-3">— {hadith.book}</p>
                  </>
                ) : (
                  <div className="h-24 bg-white/50 rounded-lg animate-pulse" />
                )}
              </div>

              {/* 99 Names of Allah */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-amber-600 font-semibold">Name of Allah Today</p>
                  <button
                    onClick={() => {
                      const name = getNameOfAllahForToday();
                      navigator.share?.({ text: `${name.en} (${name.ar}) - ${name.meaning}` });
                    }}
                    className="text-gray-400 hover:text-amber-600 text-xs"
                  >
                    Share
                  </button>
                </div>
                {(() => {
                  const name = getNameOfAllahForToday();
                  return (
                    <>
                      <p className="text-3xl font-bold text-amber-800 font-arabic">{name.ar}</p>
                      <p className="text-lg font-semibold text-gray-800 mt-2">{name.en}</p>
                      <p className="text-sm text-gray-600 mt-1">{name.meaning}</p>
                    </>
                  );
                })()}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section: Moon Sighting */}
        <motion.div {...SECTION_FADE}>
          <Card className="p-6">
            <SectionTitle icon={MapPin} title="Moon Sighting" subtitle="Current moon phase and new moon dates" />
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Moon Phase */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white">
                <p className="text-xs text-slate-300 font-semibold mb-4">Tonight's Moon</p>
                <div className="flex items-center gap-6">
                  <div className="text-6xl">
                    {moonPhase ? getMoonPhaseEmoji(moonPhase.illumination) : '🌕'}
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {moonPhase ? getMoonPhaseName(moonPhase.illumination) : 'Full Moon'}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      Illumination: {moonPhase?.illumination.toFixed(1) || '99'}%
                    </p>
                    {moonPhase && (
                      <p className="text-xs text-slate-400 mt-1">Age: {moonPhase.age.toFixed(1)} days</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next New Moon */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-2">Next New Moon</p>
                  <p className="text-lg font-bold text-gray-800">Expected: Early July 2025</p>
                  <p className="text-xs text-gray-400 mt-1">For Muharram 1447 AH</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-semibold mb-2">Roet-e-Hilal (Pakistan)</p>
                  <p className="text-sm text-gray-700">Official moon sighting committees in Pakistan convene on the 29th of each Islamic month to sight the new moon.</p>
                  <a
                    href="https://www.metoffice.gov.pk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:underline mt-2 inline-block"
                  >
                    Pakistan Met Office
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer note */}
        <motion.div {...SECTION_FADE}>
          <div className="text-center text-xs text-gray-400 pb-4">
            Prayer times calculated via{' '}
            <a href="https://aladhan.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
              Aladhan API
            </a>{' '}
            · Method: {CALC_METHODS.find((m) => m.value === method)?.label} ·
            Madhab: {madhab === 1 ? 'Hanafi' : "Shafi'i"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
