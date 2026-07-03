'use client';
import { useEffect, useState } from 'react';

const CLOCK_CITIES = [
  { name: 'London',    timezone: 'Europe/London',        color: '#3b82f6', flag: '🇬🇧' },
  { name: 'Dubai',     timezone: 'Asia/Dubai',           color: '#f59e0b', flag: '🇦🇪' },
  { name: 'Karachi',   timezone: 'Asia/Karachi',         color: '#10b981', flag: '🇵🇰' },
  { name: 'New York',  timezone: 'America/New_York',     color: '#ef4444', flag: '🇺🇸' },
  { name: 'Tokyo',     timezone: 'Asia/Tokyo',           color: '#a855f7', flag: '🇯🇵' },
  { name: 'Sydney',    timezone: 'Australia/Sydney',     color: '#f97316', flag: '🇦🇺' },
];

function AnalogClock({ timezone, color, name, flag }: { timezone: string; color: string; name: string; flag: string }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0, str: '' });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const str24 = now.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const [h, m, s] = str24.split(':').map(Number);
      const str12 = now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true });
      setTime({ h, m, s, str: str12 });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const size = 90;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 5;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const handEnd = (angle: number, length: number) => ({
    x: cx + length * Math.cos(toRad(angle)),
    y: cy + length * Math.sin(toRad(angle)),
  });
  const hEnd = handEnd(((time.h % 12) + time.m / 60) * 30 - 90, r * 0.5);
  const mEnd = handEnd((time.m + time.s / 60) * 6 - 90, r * 0.7);
  const sEnd = handEnd(time.s * 6 - 90, r * 0.85);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.04)" stroke={color} strokeWidth="2" />
        {[...Array(12)].map((_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          return <line key={i}
            x1={cx + (r - 5) * Math.cos(a)} y1={cy + (r - 5) * Math.sin(a)}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />;
        })}
        <line x1={cx} y1={cy} x2={hEnd.x} y2={hEnd.y} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={mEnd.x} y2={mEnd.y} stroke="white" strokeWidth="2" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={sEnd.x} y2={sEnd.y} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3.5" fill={color} />
      </svg>
      <div className="text-center">
        <div className="text-lg">{flag}</div>
        <div className="text-white font-bold text-sm">{name}</div>
        <div className="text-white/40 text-xs font-mono">{time.str}</div>
      </div>
    </div>
  );
}

export default function WorldClockStrip() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 py-4">
      {CLOCK_CITIES.map((c) => (
        <AnalogClock key={c.name} name={c.name} timezone={c.timezone} color={c.color} flag={c.flag} />
      ))}
    </div>
  );
}
