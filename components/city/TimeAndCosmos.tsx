'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface SunData {
  sunrise: string;
  sunset: string;
}

interface MoonData {
  Phase: {
    Name: string;
  };
  Illumination: number;
}

interface DateInfo {
  gregorian: string;
  hijri: string;
  hebrew: string;
  buddhist: string;
}

async function fetchSunData(lat: number, lng: number): Promise<SunData | null> {
  try {
    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`
    );
    const data = await response.json();
    if (data.status === 'OK') {
      return {
        sunrise: data.results.sunrise,
        sunset: data.results.sunset,
      };
    }
  } catch {}
  return null;
}

async function fetchMoonData(timestamp: number): Promise<MoonData | null> {
  try {
    const response = await fetch(
      `https://api.farmsense.net/v1/moonphases/?d=${timestamp}`
    );
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
  } catch {}
  return null;
}

async function fetchHijriDate(date: Date): Promise<string> {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH?date=${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    );
    const data = await response.json();
    if (data.data) {
      const h = data.data.hijri;
      return `${h.day} ${h.month.ar} ${h.year}`;
    }
  } catch {}
  return 'N/A';
}

function LiveClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span>{time || '--:--:--'}</span>;
}

function FullDate({ timezone }: { timezone: string }) {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateDate = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setDate(formatter.format(new Date()));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span>{date}</span>;
}

function calculateDayLength(sunrise: Date, sunset: Date): string {
  const diff = Math.floor((sunset.getTime() - sunrise.getTime()) / 1000);
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function SunArc({
  sunriseTime,
  sunsetTime,
  currentTime,
}: {
  sunriseTime: Date | null;
  sunsetTime: Date | null;
  currentTime: Date | null;
}) {
  if (!sunriseTime || !sunsetTime || !currentTime) {
    return <div className="w-full h-20 bg-gray-100 rounded-lg animate-pulse"></div>;
  }

  const progress = Math.max(
    0,
    Math.min(
      1,
      (currentTime.getTime() - sunriseTime.getTime()) /
        (sunsetTime.getTime() - sunriseTime.getTime())
    )
  );

  const isNight = currentTime < sunriseTime || currentTime > sunsetTime;

  if (isNight) {
    return (
      <div className="w-full h-20 flex items-center justify-center relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg">
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .star { animation: twinkle 3s infinite; }
        `}</style>
        <div className="absolute text-4xl">🌙</div>
        <div className="absolute left-8 top-4 text-lg star">⭐</div>
        <div className="absolute right-12 top-6 text-sm star">⭐</div>
        <div className="absolute left-1/4 top-2 text-xs star">⭐</div>
      </div>
    );
  }

  const xPos = progress * 100;

  return (
    <div className="w-full flex flex-col">
      <svg
        width="100%"
        height="80"
        viewBox="0 0 100 80"
        preserveAspectRatio="none"
        className="bg-gradient-to-b from-sky-300 to-sky-100 rounded-lg"
      >
        <path
          d="M 0 80 Q 50 0 100 80"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="0.5"
        />
      </svg>

      <motion.div
        className="absolute top-12 text-3xl"
        style={{
          left: `${xPos}%`,
          marginLeft: '-1rem',
        }}
        initial={false}
        animate={{ left: `${xPos}%` }}
        transition={{ type: 'tween', duration: 0.5 }}
      >
        ☀️
      </motion.div>

      <div className="flex justify-between px-4 text-xs text-gray-600 font-medium mt-2">
        <span>🌅 Sunrise</span>
        <span>🌇 Sunset</span>
      </div>
    </div>
  );
}

export function TimeAndCosmos({ city }: { city: City }) {
  const [sunData, setSunData] = useState<SunData | null>(null);
  const [moonData, setMoonData] = useState<MoonData | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('Loading...');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [dayLength, setDayLength] = useState<string>('');
  useEffect(() => {
    setCurrentTime(new Date());
    fetchSunData(city.lat, city.lng).then(setSunData);
    fetchMoonData(Math.floor(Date.now() / 1000)).then(setMoonData);
    fetchHijriDate(new Date()).then(setHijriDate);
  }, [city.lat, city.lng]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sunData) {
      const sunrise = new Date(sunData.sunrise);
      const sunset = new Date(sunData.sunset);
      setDayLength(calculateDayLength(sunrise, sunset));
    }
  }, [sunData]);

  const sunriseTime = sunData ? new Date(sunData.sunrise) : null;
  const sunsetTime = sunData ? new Date(sunData.sunset) : null;
  const gregorianFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const [clientToday, setClientToday] = useState<string>('');
  const [clientYear, setClientYear] = useState<number>(2024);

  useEffect(() => {
    setClientToday(gregorianFormatter.format(new Date()));
    setClientYear(new Date().getFullYear());
  }, []);

  const today = clientToday || gregorianFormatter.format(new Date());
  const year = clientYear || new Date().getFullYear();
  const buddhist = year + 543;
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
            Local Time
          </p>
          <div className="text-5xl font-bold text-gray-900 font-mono mb-4">
            <LiveClock timezone={city.timezone} />
          </div>
          <p className="text-gray-600 mb-2">
            <FullDate timezone={city.timezone} />
          </p>
          <p className="text-sm text-gray-500">
            Daylight: <span className="font-semibold text-gray-700">{dayLength}</span>
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">
            Moon Phase
          </p>
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌙</span>
            <div>
              <p className="font-semibold text-gray-900">{moonData?.Phase.Name || 'N/A'}</p>
              <p className="text-sm text-gray-500">
                {moonData?.Illumination}% illuminated
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-gray-500 text-sm uppercase tracking-wider mb-3">
          Sun Position
        </p>
        <SunArc
          sunriseTime={sunriseTime}
          sunsetTime={sunsetTime}
          currentTime={currentTime}
        />
      </div>

      <div className="mt-6 flex gap-2 flex-wrap">
        <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
          📅 {today}
        </div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
          ☪️ {hijriDate}
        </div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
          ✡️ Hebrew
        </div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
          🏯 BE {buddhist}
        </div>
      </div>
    </div>
  );
}
