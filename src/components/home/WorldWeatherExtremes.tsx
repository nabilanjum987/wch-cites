'use client';
import { useEffect, useState } from 'react';

const EXTREMES = [
  { city: 'Jacobabad, Pakistan', type: 'Hottest', value: '52°C', emoji: '🔥', color: '#ef4444' },
  { city: 'Oymyakon, Russia',    type: 'Coldest', value: '-67°C', emoji: '🥶', color: '#3b82f6' },
  { city: 'Mawsynram, India',    type: 'Rainiest', value: '11,871mm/yr', emoji: '🌧️', color: '#06b6d4' },
  { city: 'Atacama, Chile',      type: 'Driest',  value: '0.1mm/yr', emoji: '🏜️', color: '#f59e0b' },
  { city: 'Wellington, NZ',      type: 'Windiest', value: '29km/h avg', emoji: '💨', color: '#8b5cf6' },
  { city: 'Aomori, Japan',       type: 'Snowiest', value: '792cm/yr', emoji: '❄️', color: '#67e8f9' },
];

const CLOCK_CITIES = [
  { name: 'London',   timezone: 'Europe/London',        color: '#3b82f6' },
  { name: 'Dubai',    timezone: 'Asia/Dubai',           color: '#f59e0b' },
  { name: 'New York', timezone: 'America/New_York',     color: '#ef4444' },
  { name: 'Tokyo',    timezone: 'Asia/Tokyo',           color: '#10b981' },
];

function AnalogClock({ timezone, color, name }: { timezone: string; color: string; name: string }) {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const str = now.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const [h, m, s] = str.split(':').map(Number);
      setTime({ h, m, s });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  const hourAngle   = ((time.h % 12) + time.m / 60) * 30 - 90;
  const minuteAngle = (time.m + time.s / 60) * 6 - 90;
  const secondAngle = time.s * 6 - 90;

  const toRad = (deg: number) => deg * Math.PI / 180;
  const handEnd = (angle: number, length: number) => ({
    x: cx + length * Math.cos(toRad(angle)),
    y: cy + length * Math.sin(toRad(angle)),
  });

  const hEnd = handEnd(hourAngle,   r * 0.5);
  const mEnd = handEnd(minuteAngle, r * 0.7);
  const sEnd = handEnd(secondAngle, r * 0.85);

  const timeStr = new Date().toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Face */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.04)" stroke={color} strokeWidth="2" />
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const a = (i * 30 - 90) * Math.PI / 180;
          const x1 = cx + (r - 4) * Math.cos(a);
          const y1 = cy + (r - 4) * Math.sin(a);
          const x2 = cx + r * Math.cos(a);
          const y2 = cy + r * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />;
        })}
        {/* Hour hand */}
        <line x1={cx} y1={cy} x2={hEnd.x} y2={hEnd.y} stroke={color} strokeWidth="3" strokeLinecap="round" />
        {/* Minute hand */}
        <line x1={cx} y1={cy} x2={mEnd.x} y2={mEnd.y} stroke="white" strokeWidth="2" strokeLinecap="round" />
        {/* Second hand */}
        <line x1={cx} y1={cy} x2={sEnd.x} y2={sEnd.y} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
        {/* Centre dot */}
        <circle cx={cx} cy={cy} r="3" fill={color} />
      </svg>
      <div className="text-white font-semibold text-sm">{name}</div>
      <div className="text-white/40 text-xs">{timeStr}</div>
    </div>
  );
}

export default function WorldWeatherExtremes() {
  return (
    <div className="mb-4 space-y-6">
      {/* Weather extremes grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {EXTREMES.map((e) => (
          <div key={e.type} className="rounded-xl border p-4" style={{ background: `${e.color}10`, borderColor: `${e.color}30` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl">{e.emoji}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${e.color}20`, color: e.color }}>{e.type}</span>
            </div>
            <div className="text-white font-bold text-lg">{e.value}</div>
            <div className="text-white/40 text-xs mt-0.5">{e.city}</div>
          </div>
        ))}
      </div>

      {/* World clocks */}
      <div>
        <div className="text-white/40 text-xs uppercase tracking-wider mb-4">World Clocks — Live</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {CLOCK_CITIES.map((c) => (
            <AnalogClock key={c.name} name={c.name} timezone={c.timezone} color={c.color} />
          ))}
        </div>
      </div>
    </div>
  );
}
