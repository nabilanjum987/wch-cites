'use client';

import { useEffect, useState } from 'react';

// Weather extremes — honest version (Batch 3c). The old component showed
// RECORD values (Jacobabad 52°C, Oymyakon −67°C) under a "today's actual
// conditions" claim — fabricated live data. Now: the two temperature
// places show their LIVE current temperature from Open-Meteo, with the
// famous record kept as a labelled caption; the other four cards are
// long-term climate averages, labelled as averages (not today's weather).

const LIVE_PLACES = [
  { key: 'jacobabad', city: 'Jacobabad, Pakistan', type: 'Hottest', emoji: '🔥', color: '#ef4444', lat: 28.2819, lon: 68.4372, caption: 'Record high ≈ 52°C' },
  { key: 'oymyakon', city: 'Oymyakon, Russia', type: 'Coldest', emoji: '🥶', color: '#3b82f6', lat: 63.4641, lon: 142.7856, caption: 'Record low ≈ −67.7°C' },
];

const CLIMATE_FACTS = [
  { city: 'Mawsynram, India', type: 'Rainiest', value: '≈11,860mm/yr', emoji: '🌧️', color: '#06b6d4', caption: 'Average annual rainfall' },
  { city: 'Atacama, Chile', type: 'Driest', value: '~1mm/yr', emoji: '🏜️', color: '#f59e0b', caption: 'Rainfall in its driest parts' },
  { city: 'Wellington, NZ', type: 'Windiest', value: '29km/h', emoji: '💨', color: '#8b5cf6', caption: 'Average wind speed' },
  { city: 'Aomori, Japan', type: 'Snowiest', value: '792cm/yr', emoji: '❄️', color: '#67e8f9', caption: 'Average annual snowfall' },
];

export default function WorldWeatherExtremes() {
  const [temps, setTemps] = useState<Record<string, number | null>>({});

  useEffect(() => {
    let on = true;
    Promise.all(LIVE_PLACES.map(async (p) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m`);
        if (!res.ok) return [p.key, null] as const;
        const json = await res.json();
        const t = json?.current?.temperature_2m;
        return [p.key, typeof t === 'number' ? t : null] as const;
      } catch {
        return [p.key, null] as const;
      }
    })).then((pairs) => { if (on) setTemps(Object.fromEntries(pairs)); });
    return () => { on = false; };
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {LIVE_PLACES.map((p) => {
        const t = temps[p.key];
        return (
          <div key={p.key} className="rounded-xl border p-4"
            style={{ background: `${p.color}10`, borderColor: `${p.color}30` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${p.color}20`, color: p.color }}>{p.type}</span>
            </div>
            <div className="t-text font-bold text-lg">{t != null ? `${Math.round(t)}°C now` : '—'}</div>
            <div className="t-text-40 text-xs mt-0.5">{p.city}</div>
            <div className="t-text-30 text-[11px]">{p.caption}</div>
          </div>
        );
      })}
      {CLIMATE_FACTS.map((e) => (
        <div key={e.type} className="rounded-xl border p-4"
          style={{ background: `${e.color}10`, borderColor: `${e.color}30` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{e.emoji}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${e.color}20`, color: e.color }}>{e.type}</span>
          </div>
          <div className="t-text font-bold text-lg">{e.value}</div>
          <div className="t-text-40 text-xs mt-0.5">{e.city}</div>
          <div className="t-text-30 text-[11px]">{e.caption}</div>
        </div>
      ))}
    </div>
  );
}
