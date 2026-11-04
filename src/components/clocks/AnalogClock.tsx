'use client';

// Shared analog clock face for the pin/take surfaces (the pinned
// strip). The hero keeps its own frozen-spec dial in HeroClocks.tsx;
// this one takes its ring colour as a prop so a chosen design can
// restyle it. Ticking is shared too: useNow() hands every consumer
// the same fresh Date each second.

import { useEffect, useState } from 'react';

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function clockParts(now: Date, tz: string) {
  const str24 = now.toLocaleTimeString('en-US', {
    timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const [h, m, s] = str24.split(':').map(Number);
  const str12 = now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });
  return { h: Number.isFinite(h) ? h : 0, m: m || 0, s: s || 0, str12, date };
}

export default function AnalogClock({
  now, tz, color, size,
}: {
  now: Date; tz: string; color: string; size: number;
}) {
  const { h, m, s } = clockParts(now, tz);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const end = (angle: number, len: number) => ({
    x: cx + len * Math.cos(toRad(angle)), y: cy + len * Math.sin(toRad(angle)),
  });
  const hE = end(((h % 12) + m / 60) * 30 - 90, r * 0.5);
  const mE = end((m + s / 60) * 6 - 90, r * 0.72);
  const sE = end(s * 6 - 90, r * 0.85);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Clock for ${tz}`}>
      <circle cx={cx} cy={cy} r={r} fill="var(--card)" stroke={color} strokeWidth="2" />
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={cx + (r - 5) * Math.cos(a)} y1={cy + (r - 5) * Math.sin(a)}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="var(--text-25)" strokeWidth="1.5" />
        );
      })}
      <line x1={cx} y1={cy} x2={hE.x} y2={hE.y} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mE.x} y2={mE.y} stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={sE.x} y2={sE.y} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.5" fill={color} />
    </svg>
  );
}
