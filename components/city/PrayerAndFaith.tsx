'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { City } from '@/types/city';

interface PrayerTime {
  name: string;
  arabic: string;
  time: string;
  status: 'passed' | 'upcoming' | 'current';
}

interface TimingData {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface QiblaData {
  direction: number;
  from: string;
}

const RELIGION_COLORS: Record<string, string> = {
  Islam: '#10b981',
  Christianity: '#3b82f6',
  Hinduism: '#f59e0b',
  Buddhism: '#8b5cf6',
  Judaism: '#ef4444',
  Sikhism: '#06b6d4',
  Other: '#6b7280',
  'No Religion': '#84cc16',
};

const FAITH_TABS = [
  { id: 'Islam', label: 'Islam', icon: '☪️' },
  { id: 'Christianity', label: 'Christian', icon: '✝️' },
  { id: 'Hinduism', label: 'Hindu', icon: '🕉️' },
  { id: 'Judaism', label: 'Jewish', icon: '✡️' },
  { id: 'Buddhism', label: 'Buddhist', icon: '☸️' },
  { id: 'Sikhism', label: 'Sikh', icon: '🙏' },
  { id: 'No Religion', label: 'No Religion', icon: '🧘' },
];

const MINDFULNESS_QUOTES = [
  "The present moment is the only moment available to us, and it is the door to all moments. - Thich Nhat Hanh",
  "Be where you are, not where you think you should be. - Unknown",
  "The mind is everything. What you think you become. - Buddha",
  "Peace comes from within. Do not seek it without. - Buddha",
  "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra",
  "Mindfulness is a way of befriending ourselves and our experience. - Jon Kabat-Zinn",
  "The best way to capture moments is to pay attention. - Unknown",
  "Breathing in, I calm body and mind. Breathing out, I smile. - Thich Nhat Hanh",
  "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor. - Thich Nhat Hanh",
  "The present moment is filled with joy and happiness. If you are attentive, you will see it. - Thich Nhat Hanh",
  "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. - Buddha",
  "Wherever you are, be there totally. - Eckhart Tolle",
  "Life is available only in the present moment. - Thich Nhat Hanh",
  "Surrender to what is. Let go of what was. Have faith in what will be. - Sonia Ricotti",
  "The only way to live is by accepting each minute as an unrepeatable miracle. - Tara Brach",
  "Mindfulness is about love and loving life. - Thich Nhat Hanh",
  "Between stimulus and response there is a space. In that space is our power to choose our response. - Viktor Frankl",
  "Awareness is the greatest agent for change. - Eckhart Tolle",
  "The way to do is to be. - Lao Tzu",
  "Nature does not hurry, yet everything is accomplished. - Lao Tzu",
  "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
  "The quieter you become, the more you can hear. - Ram Dass",
  "Be happy in the moment, that's enough. Each moment is all we need, not more. - Mother Teresa",
  "Everything is created twice, first in the mind and then in reality. - Robin Sharma",
  "Smile, breathe, and go slowly. - Thich Nhat Hanh",
  "The art of deep breathing is at the heart of mindfulness. - Andy Puddicombe",
  "See the world as if for the first time. - Unknown",
  "Let your actions speak for themselves. - Unknown",
  "Mindfulness means being awake. It means knowing what you are doing. - Jon Kabat-Zinn",
  "Every morning brings new potential, but if you dwell on the misfortunes of the day before, you tend to overlook tremendous opportunities. - China Mills",
  "Begin each day as if it were on purpose. - Unknown",
  "Today is your day. - Dr. Seuss",
  "The journey of a thousand miles begins with one step. - Lao Tzu",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
  "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
  "Be the change that you wish to see in the world. - Mahatma Gandhi",
  "The only true wisdom is in knowing you know nothing. - Socrates",
  "Slow down and everything you are chasing will come around and catch you. - John De Paola",
  "Mindfulness is a pause. - Sylvia Boorstein",
  "Take rest; a field that has rested gives a beautiful crop. - Ovid",
  "The present moment is the only time over which we have dominion. - Thich Nhat Hanh",
  "You are the sky. Everything else is just the weather. - Pema Chodron",
  "Mindfulness is the aware, balanced acceptance of the present experience. - Sylvia Boorstein",
  "Life is 10% what happens to us and 90% how we react to it. - Charles R. Swindoll",
  "The greatest weapon against stress is our ability to choose one thought over another. - William James",
  "Rule #1: Stop expecting ease. - Unknown",
  "Discipline is choosing between what you want now and what you want most. - Abraham Lincoln",
  "Progress is progress, no matter how small. - Unknown",
  "A day without laughter is a day wasted. - Charlie Chaplin",
];

async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: number = 1
): Promise<{ timings: TimingData; date: { hijri: { date: string } } } | null> {
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${method}`
    );
    const data = await response.json();
    if (data.code === 200) {
      return data.data;
    }
  } catch {}
  return null;
}

async function fetchQibla(
  lat: number,
  lng: number
): Promise<QiblaData | null> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/qibla/${lat}/${lng}`
    );
    const data = await response.json();
    if (data.code === 200) {
      return {
        direction: data.data.direction,
        from: data.data.from,
      };
    }
  } catch {}
  return null;
}

async function fetchShabbat(): Promise<{
  items: Array<{ title: string; date: string }>;
} | null> {
  try {
    const response = await fetch(
      'https://www.hebcal.com/shabbat?cfg=json&geonameid=1172451'
    );
    return response.json();
  } catch {}
  return null;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function SkeletonPulse() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
}

function ReligionBars({
  religionData,
}: {
  religionData: Record<string, number>;
}) {
  const entries = Object.entries(religionData);

  return (
    <div className="mb-6 space-y-3">
      <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
        Religious Demographics
      </p>
      {entries.map(([name, percent], idx) => (
        <motion.div
          key={name}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{name}</span>
            <span className="text-gray-500">{percent}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: RELIGION_COLORS[name] || '#6b7280' }}
              initial={{ width: 0 }}
              whileInView={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function IslamTab({
  lat,
  lng,
  isHanafi,
}: {
  lat: number;
  lng: number;
  isHanafi: boolean;
}) {
  const [timings, setTimings] = useState<TimingData | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [qibla, setQibla] = useState<QiblaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<number>(0);
  const [nextPrayerName, setNextPrayerName] = useState<string>('');

  useEffect(() => {
    async function load() {
      const method = isHanafi ? 4 : 1;
      const data = await fetchPrayerTimes(lat, lng, method);
      if (data) {
        setTimings(data.timings);
        setHijriDate(data.date.hijri.date);
      }
      const qiblaData = await fetchQibla(lat, lng);
      setQibla(qiblaData);
      setLoading(false);
    }
    load();
  }, [lat, lng, isHanafi]);

  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const now = getCurrentTimeMinutes();
      const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha },
      ];

      for (let i = 0; i < prayers.length; i++) {
        const prayerTime = timeToMinutes(prayers[i].time);
        const nextPrayer =
          i < prayers.length - 1
            ? timeToMinutes(prayers[i + 1].time)
            : timeToMinutes(prayers[0].time) + 1440;

        if (now >= prayerTime && now < nextPrayer) {
          const secondsUntilNext =
            (nextPrayer - now) * 60 - new Date().getSeconds();
          setCountdown(Math.max(0, secondsUntilNext));
          setNextPrayerName(prayers[(i + 1) % prayers.length].name);
          break;
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  if (loading) return <SkeletonPulse />;

  const prayers = [
    { name: 'Fajr', arabic: 'الفجر', time: timings?.Fajr || 'N/A' },
    { name: 'Sunrise', arabic: 'الشروق', time: timings?.Sunrise || 'N/A' },
    { name: 'Dhuhr', arabic: 'الظهر', time: timings?.Dhuhr || 'N/A' },
    { name: 'Asr', arabic: 'العصر', time: timings?.Asr || 'N/A' },
    { name: 'Maghrib', arabic: 'المغرب', time: timings?.Maghrib || 'N/A' },
    { name: 'Isha', arabic: 'العشاء', time: timings?.Isha || 'N/A' },
  ];

  const now = getCurrentTimeMinutes();

  const getPrayerRow = (
    prayer: { name: string; arabic: string; time: string },
    index: number
  ) => {
    const time = timeToMinutes(prayer.time);
    let status: 'passed' | 'current' | 'upcoming' = 'upcoming';
    let statusIcon = '⏳';

    if (now >= time) {
      if (
        index < prayers.length - 1 &&
        now < timeToMinutes(prayers[index + 1].time)
      ) {
        status = 'current';
        statusIcon = '⏰';
      } else if (index === prayers.length - 1 && now < timeToMinutes(prayers[0].time) + 1440) {
        status = 'current';
        statusIcon = '⏰';
      } else {
        status = 'passed';
        statusIcon = '✅';
      }
    }

    return { ...prayer, status, statusIcon };
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl p-5 border border-emerald-200"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut',
        }}
      >
        <p className="text-xs text-emerald-600 uppercase tracking-wider mb-2">
          Next Prayer: {nextPrayerName}
        </p>
        <p className="text-4xl font-bold font-mono text-emerald-800">
          {formatCountdown(countdown)}
        </p>
        <p className="text-xs text-emerald-500 mt-1"> hours : minutes : seconds</p>
      </motion.div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center text-sm mb-3 pb-2 border-b border-gray-100">
          <span className="text-gray-600">Hijri Date</span>
          <span className="font-semibold text-emerald-700">{hijriDate}</span>
        </div>
        {qibla && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Qibla Direction</span>
            <span className="font-semibold text-emerald-700">
              {Math.round(qibla.direction)}° {qibla.from}
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {prayers.map((prayer, idx) => {
          const row = getPrayerRow(prayer, idx);
          return (
            <div
              key={prayer.name}
              className={`flex items-center justify-between p-3 rounded-lg ${
                row.status === 'current'
                  ? 'bg-emerald-100 border-2 border-emerald-400'
                  : row.status === 'passed'
                  ? 'bg-gray-50 opacity-60'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{row.statusIcon}</span>
                <div>
                  <p className="font-medium text-gray-900">{prayer.name}</p>
                  <p className="text-xs text-gray-500">{prayer.arabic}</p>
                </div>
              </div>
              <span className="font-mono text-lg text-gray-700">
                {prayer.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChristianTab() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) return null;

  const month = today.getMonth();
  const day = today.getDate();
  let season = 'Ordinary Time';
  let seasonColor = '#22c55e';

  if (month === 11 && day >= 25) {
    season = 'Christmas';
    seasonColor = '#dc2626';
  } else if (month === 11 && day >= 1 && day <= 24) {
    season = 'Advent';
    seasonColor = '#9333ea';
  } else if ((month === 2 && day >= 22) || (month === 3 && day <= 25)) {
    season = 'Lent';
    seasonColor = '#6b7280';
  } else if (month === 3 && day >= 26 && day <= 30) {
    season = 'Easter Triduum';
    seasonColor = '#dc2626';
  } else if (month === 4) {
    season = 'Easter';
    seasonColor = '#fbbf24';
  }

  return (
    <div className="space-y-4">
      <div
        className="rounded-xl p-5 text-white"
        style={{ backgroundColor: seasonColor }}
      >
        <p className="text-sm opacity-90 mb-1">Current Liturgical Season</p>
        <p className="text-2xl font-bold">{season}</p>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Sunday Service Times</p>
        <div className="space-y-2">
          {['8:00 AM', '10:00 AM', '6:00 PM'].map((time) => (
            <div
              key={time}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-lg">⛪</span>
              <span className="font-mono font-medium">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HinduTab() {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!today) return null;

  const tithi = ['Purnima', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi'][
    today.getDate() % 5
  ];
  const nakshatra = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira'][
    today.getDate() % 5
  ];

  const now = today;
  const rahuStart = new Date(now);
  rahuStart.setHours(9, 0, 0);
  const rahuEnd = new Date(now);
  rahuEnd.setHours(10, 30, 0);
  const isRahuKaal =
    now >= rahuStart && now <= rahuEnd;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-5 border border-orange-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-orange-600">Tithi</p>
            <p className="font-bold text-orange-800">{tithi}</p>
          </div>
          <div>
            <p className="text-xs text-orange-600">Nakshatra</p>
            <p className="font-bold text-orange-800">{nakshatra}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Auspicious Times Today</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span>🌅 Brahma Muhurta</span>
            <span className="font-mono text-sm">4:24 - 5:12 AM</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span>☀️ Abhijit Muhurta</span>
            <span className="font-mono text-sm">11:45 - 12:33 PM</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span>🌅 Godhuli</span>
            <span className="font-mono text-sm">5:45 - 6:15 PM</span>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg p-4 border-2 ${
          isRahuKaal
            ? 'bg-red-50 border-red-300'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-medium text-red-700">Rahu Kaal</p>
            <p className="text-sm text-gray-600">09:00 - 10:30 AM</p>
            {isRahuKaal && (
              <p className="text-xs text-red-600 mt-1">Currently Active - Avoid new ventures</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function JewishTab() {
  const [shabbat, setShabbat] = useState<{
    candleLighting: string;
    havdalah: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const data = await fetchShabbat();
      if (data && data.items?.length > 0) {
        const candle = data.items.find((i) =>
          i.title.toLowerCase().includes('candle')
        );
        const havdalah = data.items.find((i) =>
          i.title.toLowerCase().includes('havdalah')
        );
        if (candle && havdalah) {
          setShabbat({
            candleLighting: candle.date,
            havdalah: havdalah.date,
          });
        }
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border border-blue-200">
        <p className="text-xs text-blue-600 uppercase tracking-wider mb-3">
          Shabbat Times
        </p>
        {shabbat ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">🕯️ Candle Lighting</span>
              <span className="font-mono font-medium">{shabbat.candleLighting}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">✨ Havdalah</span>
              <span className="font-mono font-medium">{shabbat.havdalah}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Loading...</p>
        )}
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">Weekly Torah Portion</p>
        <p className="font-medium text-gray-900">
          Check local synagogue for current parashah
        </p>
      </div>
    </div>
  );
}

function SikhTab() {
  const [hukamnama, setHukamnama] = useState<string>('Loading...');

  useEffect(() => {
    const lines = [
      'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ',
      'ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ',
      'ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ',
    ];
    setHukamnama(lines[Math.floor(Math.random() * lines.length)]);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl p-5 border border-cyan-200">
        <p className="text-xs text-cyan-600 uppercase tracking-wider mb-2">
          Daily Hukamnama
        </p>
        <p className="text-lg font-medium text-cyan-900">{hukamnama}</p>
        <p className="text-xs text-cyan-600 mt-2">
          From Sri Darbar Sahib, Amritsar
        </p>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Amrit Vela</p>
        <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded">
          <span className="text-2xl">🌅</span>
          <div>
            <p className="font-medium text-cyan-800">3:00 AM - 6:00 AM</p>
            <p className="text-xs text-cyan-600">Best time for Naam Simran</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoReligionTab() {
  const [quote, setQuote] = useState<string>('');
  const [sunrise, setSunrise] = useState<Date | null>(null);
  const [sunset, setSunset] = useState<Date | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const randomQuote =
      MINDFULNESS_QUOTES[Math.floor(Math.random() * MINDFULNESS_QUOTES.length)];
    setQuote(randomQuote);

    const currentDate = new Date();
    setNow(currentDate);

    const sr = new Date(currentDate);
    sr.setHours(6, 30, 0);
    setSunrise(sr);
    const ss = new Date(currentDate);
    ss.setHours(18, 30, 0);
    setSunset(ss);
  }, []);

  const isOptimal =
    sunrise &&
    sunset &&
    now &&
    (now.getHours() < 7 || now.getHours() >= 18 || now.getHours() === 12);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-lime-50 to-green-100 rounded-xl p-5 border border-lime-200">
        <p className="text-xs text-lime-700 uppercase tracking-wider mb-3">
          Today's Mindfulness Reflection
        </p>
        <p className="text-sm italic text-gray-700 leading-relaxed">{quote}</p>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600 mb-3">Recommended Mindfulness Times</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-lime-50 rounded">
            <span>🌅 Early Morning</span>
            <span className="font-mono text-sm">5:00 - 7:00 AM</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-lime-50 rounded">
            <span>☀️ Midday Reset</span>
            <span className="font-mono text-sm">12:00 PM</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-lime-50 rounded">
            <span>🌅 Sunset</span>
            <span className="font-mono text-sm">6:00 - 7:00 PM</span>
          </div>
        </div>
        {isOptimal && (
          <div className="mt-3 p-2 bg-lime-100 rounded border border-lime-300">
            <p className="text-xs text-lime-800 font-medium">
              🌿 Current time is optimal for mindfulness practice
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function PrayerAndFaith({ city }: { city: City }) {
  const [activeTab, setActiveTab] = useState<string>(city.major_religion || 'Islam');
  const [isHanafi, setIsHanafi] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Prayer Times & Faith
      </h2>

      <ReligionBars
        religionData={
          typeof city.religion_percent === 'number'
            ? { [city.major_religion]: city.religion_percent, Other: 100 - city.religion_percent }
            : (city.religion_percent as Record<string, number>) || { Islam: 94, Christianity: 4, Other: 2 }
        }
      />

      <div
        ref={tabsRef}
        className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar"
      >
        {FAITH_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor:
                activeTab === tab.id ? RELIGION_COLORS[tab.id] : undefined,
            }}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'Islam' && (
        <>
          <label className="flex items-center gap-2 mb-4 text-sm">
            <input
              type="checkbox"
              checked={isHanafi}
              onChange={(e) => setIsHanafi(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <span className="text-gray-700">Use Hanafi Asr Timing (+1 hour)</span>
          </label>
          <IslamTab lat={city.lat} lng={city.lng} isHanafi={isHanafi} />
        </>
      )}

      {activeTab === 'Christianity' && <ChristianTab />}
      {activeTab === 'Hinduism' && <HinduTab />}
      {activeTab === 'Judaism' && <JewishTab />}
      {activeTab === 'Buddhism' && (
        <div className="text-center p-8 text-gray-500">
          <p className="text-4xl mb-3">☸️</p>
          <p>Meditation practices coming soon</p>
        </div>
      )}
      {activeTab === 'Sikhism' && <SikhTab />}
      {activeTab === 'No Religion' && <NoReligionTab />}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
}
