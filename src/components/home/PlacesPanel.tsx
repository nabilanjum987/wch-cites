'use client';

// Places panel (§17) — content + ONE live figure per place (the
// weather right now at its coordinates, Open-Meteo). Deep links are
// on HOLD (link map §17 / L1): place detail pages are not published
// yet, so the cards render without links.

import { useEffect, useState } from 'react';

const PLACES = [
  { name: 'Badshahi Mosque', city: 'Lahore', lat: 31.5883, lng: 74.3096, note: 'Built in 1673 under Aurangzeb — for two centuries the largest mosque courtyard on earth.' },
  { name: 'Faisal Mosque', city: 'Islamabad', lat: 33.7296, lng: 73.0372, note: 'A tent of white marble at the foot of the Margalla Hills, gifted by King Faisal of Saudi Arabia.' },
  { name: 'Mohenjo-daro', city: 'Sindh', lat: 27.3292, lng: 68.1309, note: 'A planned city of the Indus Valley, 4,500 years old — streets, drains and a great bath, from 2600 BC.' },
];

export default function PlacesPanel() {
  const [temps, setTemps] = useState<(number | null)[]>(() => PLACES.map(() => null));

  useEffect(() => {
    const lats = PLACES.map((p) => p.lat).join(',');
    const lngs = PLACES.map((p) => p.lng).join(',');
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m`, { signal: AbortSignal.timeout(8000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setTemps(data.map((loc: any) => (typeof loc?.current?.temperature_2m === 'number' ? Math.round(loc.current.temperature_2m) : null)));
        }
      })
      .catch(() => { /* figures stay off */ });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PLACES.map((p, i) => (
        <div key={p.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-white font-bold">{p.name}</div>
              <div className="text-white/40 text-xs">{p.city}, Pakistan</div>
            </div>
            {temps[i] != null && (
              <div className="text-right">
                <div className="text-white font-bold text-lg leading-none">{temps[i]}°C</div>
                <div className="text-white/40 text-[11px] mt-0.5">there, right now</div>
              </div>
            )}
          </div>
          <p className="text-white/50 text-sm leading-relaxed mt-2">{p.note}</p>
        </div>
      ))}
    </div>
  );
}
