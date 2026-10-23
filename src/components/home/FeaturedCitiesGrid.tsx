'use client';

// Cities panel (§10) — PUBLISHED cities only (link map §10 / L6):
// Lahore, Karachi and Islamabad, each linking to its full city page,
// with LIVE figures fetched from the same keyless APIs as the city
// pages (Open-Meteo weather, Aladhan next prayer). The previous
// version showed twelve cities — nine of them unpublished — with
// hard-coded temperatures and prayer strings presented as live.
// All of that is removed; a figure appears only when its source
// responded.

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CITIES = [
  { name: 'Lahore', province: 'Punjab', flag: '🇵🇰', color: '#01411C', href: '/pakistan/punjab/lahore', lat: 31.5204, lng: 74.3587 },
  { name: 'Karachi', province: 'Sindh', flag: '🇵🇰', color: '#0e5a8a', href: '/pakistan/sindh/karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Islamabad', province: 'Capital Territory', flag: '🇵🇰', color: '#7a5c14', href: '/pakistan/islamabad-capital-territory/islamabad', lat: 33.7294, lng: 73.0931 },
];

interface LiveFig { temp: number | null; prayer: string | null }

async function fetchPrayer(lat: number, lng: number): Promise<string | null> {
  try {
    const now = new Date();
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const res = await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${now.getUTCFullYear()}?latitude=${lat}&longitude=${lng}&method=1`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const timings = (await res.json())?.data?.timings;
    if (!timings) return null;
    const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
    for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      const raw: string | undefined = timings[name];
      if (!raw) continue;
      const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
      const at = new Date(nowLocal);
      at.setHours(hh, mi, 0, 0);
      if (at.getTime() > nowLocal.getTime()) {
        const h12 = ((hh + 11) % 12) + 1;
        return `${name} ${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function FeaturedCitiesGrid() {
  const [figs, setFigs] = useState<LiveFig[]>(() => CITIES.map(() => ({ temp: null, prayer: null })));

  useEffect(() => {
    const lats = CITIES.map((c) => c.lat).join(',');
    const lngs = CITIES.map((c) => c.lng).join(',');
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m`, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setFigs((prev) => prev.map((f, i) => ({ ...f, temp: typeof data[i]?.current?.temperature_2m === 'number' ? Math.round(data[i].current.temperature_2m) : null })));
        }
      })
      .catch(() => { /* temps stay off */ });
    CITIES.forEach((c, i) => {
      fetchPrayer(c.lat, c.lng).then((p) => {
        if (p) setFigs((prev) => prev.map((f, j) => (j === i ? { ...f, prayer: p } : f)));
      });
    });
  }, []);

  return (
    <div className="mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CITIES.map((city, i) => (
          <Link key={city.name} href={city.href} className="no-underline group">
            <div className="relative h-44 rounded-2xl overflow-hidden border transition-all group-hover:scale-[1.02]"
              style={{ borderColor: `${city.color}50`, background: `linear-gradient(160deg, ${city.color}33, var(--bg))` }}>
              <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none" style={{ fontSize: '84px', opacity: 0.15 }}>
                {city.flag}
              </div>
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{city.flag}</span>
                  {figs[i].temp != null && <span className="t-text font-bold text-xl">{figs[i].temp}°C</span>}
                </div>
                <div>
                  <div className="t-text font-bold text-lg leading-tight">{city.name}</div>
                  <div className="sub-desc">{city.province} · Pakistan</div>
                  {figs[i].prayer && <div className="t-emerald text-xs mt-1 font-medium">Next prayer · {figs[i].prayer}</div>}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="sub-desc mt-4">
        Three full city guides are live today — weather, prayer times, rates, news and events for each. More cities join as they pass review →
      </p>
    </div>
  );
}
