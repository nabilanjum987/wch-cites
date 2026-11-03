'use client';

// Places panel (§17) — content + ONE live figure per place (the
// weather right now at its coordinates, Open-Meteo). Deep links are
// on HOLD (link map §17 / L1): place detail pages are not published
// yet, so the cards render without links.

import { useEffect, useState } from 'react';

const PLACES = [
  { name: 'Badshahi Mosque', city: 'Lahore', lat: 31.5883, lng: 74.3096, note: 'Built 1673, largest mosque courtyard',
    // Polish Card 4: the first place carries its real photo (image bank:
    // "Courtyard of Badshahi mosque of Lahore, Pakistan", Zapata1000,
    // CC BY-SA 4.0) — a courtyard view, distinct from the My City image.
    img: '/images/home/badshahi-places.webp', imgAlt: 'Courtyard of Badshahi mosque of Lahore, Pakistan', credit: 'Zapata1000 · CC BY-SA 4.0' },
  // Stage 3 (2026-11-03): Faisal Mosque reuses the existing licensed
  // asset already vendored for the Islamabad city card (Ali Mujtaba,
  // CC BY-SA 4.0).
  { name: 'Faisal Mosque', city: 'Islamabad', lat: 33.7296, lng: 73.0372, note: 'Tent of marble gifted by King Faisal',
    img: '/images/home28/city-islamabad.webp', imgAlt: 'The Faisal Mosque in Islamabad', credit: 'Ali Mujtaba · CC BY-SA 4.0' },
  // Stage 3 (2026-11-03): new licensed photo (Saqib Qayyum,
  // CC BY-SA 3.0, via Wikimedia Commons, File:Mohenjo-daro.jpg,
  // licence verified on the file page and in independent credits).
  { name: 'Mohenjo-daro', city: 'Sindh', lat: 27.3292, lng: 68.1309, note: 'Planned Indus Valley city, from 2600 BC',
    img: '/images/home/mohenjo-daro.webp', imgAlt: 'The excavated ruins of Mohenjo-daro, with the Great Bath in the foreground', credit: 'Saqib Qayyum · CC BY-SA 3.0' },
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
        <div key={p.name} className="rounded-2xl border t-border t-card overflow-hidden">
          {'img' in p && p.img && (
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.imgAlt} width={768} height={506} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          )}
          <div className="p-5">
            {'img' in p && p.img && <div className="text-[10px] t-text-40 mb-2">Photo: {p.credit}</div>}
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="t-text font-bold">{p.name}</div>
                <div className="sub-desc">{p.city}, Pakistan</div>
              </div>
              {temps[i] != null && (
                <div className="text-right">
                  <div className="t-text font-bold text-lg leading-none">{temps[i]}°C</div>
                  <div className="t-text-40 text-[11px] mt-0.5">there, right now</div>
                </div>
              )}
            </div>
            <p className="sub-desc mt-2">{p.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
