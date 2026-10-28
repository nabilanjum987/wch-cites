'use client';

// World Capitals panel (§9A, frozen amendment 2026-10-22) — a live
// rotating set of capitals: flag (vendored locally in
// public/images/flags/), capital + country, local
// time ticking via Intl, current temperature from Open-Meteo (one
// batch call). Each capital links to its country page, per link map
// §9A; when a capital's own city page is published, its link switches
// to the city page (L6).
// Homepage-imagery pass (2026-10-28): each capital card now carries
// one small real landmark thumb above the flag row (vendored under
// public/images/home28/; licence + creator records in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
// Flags are vendored locally (merged #104); the landmark thumbs are
// this PR's addition. Credits for all twelve thumbs are listed under
// the grid.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CAPITALS } from '@/lib/capitals';

// Landmark thumb per capital, keyed by capital name (the CAPITALS
// list order is fixed, so this map cannot drift onto the wrong city).
const THUMBS: Record<string, { img: string; alt: string }> = {
  'Islamabad': { img: '/images/home28/cap-islamabad.webp', alt: 'The Faisal Mosque in Islamabad' },
  'London': { img: '/images/home28/cap-london.webp', alt: 'Tower Bridge in London at dawn' },
  'Paris': { img: '/images/home28/cap-paris.webp', alt: 'The Louvre in Paris' },
  'Berlin': { img: '/images/home28/cap-berlin.webp', alt: 'The Brandenburg Gate in Berlin' },
  'Tokyo': { img: '/images/home28/cap-tokyo.webp', alt: 'Senso-ji temple in Tokyo' },
  'Washington': { img: '/images/home28/cap-washington.webp', alt: 'The United States Capitol in Washington at dusk' },
  'Canberra': { img: '/images/home28/cap-canberra.webp', alt: 'Parliament House in Canberra at dusk' },
  'Ottawa': { img: '/images/home28/cap-ottawa.webp', alt: 'Parliament Hill in Ottawa, across the river' },
  'Beijing': { img: '/images/home28/cap-beijing.webp', alt: 'The Forbidden City in Beijing, seen from Coal Hill' },
  'New Delhi': { img: '/images/home28/cap-delhi.webp', alt: 'India Gate in New Delhi' },
  'Riyadh': { img: '/images/home28/cap-riyadh.webp', alt: 'The Kingdom Centre in Riyadh' },
  'Cairo': { img: '/images/home28/cap-cairo.webp', alt: 'The pyramids of Giza' },
};

const CREDITS = 'Landmark photos: Islamabad — Guilhem Vellut · CC BY 2.0; London — Fuzzypiggy · CC BY-SA 3.0; Paris — Benh LIEU SONG · CC BY-SA 3.0; Berlin — Norbert Nagel · CC BY-SA 3.0; Tokyo — Akonnchiroll · CC0; Washington — Martin Falbisoner · CC BY-SA 3.0; Canberra — Thennicke · CC BY-SA 4.0; Ottawa — Wladyslaw · CC BY-SA 3.0; Beijing — Pixelflake · CC BY-SA 3.0; New Delhi — Yann · CC BY-SA 3.0; Riyadh — Hamza A. Durrani · CC BY-SA 4.0; Cairo — Ricardo Liberato · CC BY-SA 2.0 (all via Wikimedia Commons).';

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
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CAPITALS.map((c, i) => {
          const time = now.toLocaleTimeString('en-US', { timeZone: c.tz, hour: 'numeric', minute: '2-digit', hour12: true });
          const thumb = THUMBS[c.capital];
          return (
            <Link key={c.capital} href={`/${c.countrySlug}`} className="no-underline group">
              <div className="rounded-2xl border t-border t-card overflow-hidden transition-all t-group-border-hover-25 group-hover:scale-[1.02]">
                {thumb && (
                  <div className="relative h-16 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumb.img} alt={thumb.alt} width={600} height={160} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                )}
                <div className="p-4 pt-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/images/flags/${c.code}.png`} alt={`Flag of ${c.country}`} width={40} height={27} className="rounded shadow" loading="lazy" decoding="async" />
                    {temps[i] != null && <span className="t-text font-bold text-lg">{temps[i]}°C</span>}
                  </div>
                  <div>
                    <div className="t-text font-bold text-sm leading-tight">{c.capital}</div>
                    <div className="sub-desc">{c.country}</div>
                    <div className="t-cyan font-mono text-sm mt-0.5">{time}</div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="text-[11px] t-text-40 mt-3">{CREDITS}</p>
    </div>
  );
}
