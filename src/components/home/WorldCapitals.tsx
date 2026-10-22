'use client';

// World Capitals panel (§9A, frozen amendment 2026-10-22) — a live
// rotating set of capitals: flag (flagcdn), capital + country, local
// time ticking via Intl, current temperature from Open-Meteo (one
// batch call). Each capital links to its country page, per link map
// §9A; when a capital's own city page is published, its link switches
// to the city page (L6).

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CAPITALS } from '@/lib/capitals';

export default function WorldCapitals() {
  const [now, setNow] = useState(() => new Date());
  const [temps, setTemps] = useState<(number | null)[]>(() => CAPITALS.map(() => null));

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const lats = CAPITALS.map((c) => c.lat).join(',');
    const lngs = CAPITALS.map((c) => c.lng).join(',');
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m`, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setTemps(data.map((loc: any) => (typeof loc?.current?.temperature_2m === 'number' ? Math.round(loc.current.temperature_2m) : null)));
        }
      })
      .catch(() => { /* temperatures simply stay off */ });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {CAPITALS.map((c, i) => {
        const time = now.toLocaleTimeString('en-US', { timeZone: c.tz, hour: 'numeric', minute: '2-digit', hour12: true });
        return (
          <Link key={c.capital} href={`/${c.countrySlug}`} className="no-underline group">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 h-32 flex flex-col justify-between transition-all group-hover:border-white/25 group-hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://flagcdn.com/w160/${c.code}.png`} alt={`Flag of ${c.country}`} width={40} height={27} className="rounded shadow" loading="lazy" />
                {temps[i] != null && <span className="text-white font-bold text-lg">{temps[i]}°C</span>}
              </div>
              <div>
                <div className="text-white font-bold text-sm leading-tight">{c.capital}</div>
                <div className="text-white/40 text-xs">{c.country}</div>
                <div className="text-cyan-300 font-mono text-sm mt-0.5">{time}</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
