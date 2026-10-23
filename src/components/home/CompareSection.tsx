'use client';

// Compare panel (§22) — the featured pair card and the pair picker
// only offer PUBLISHED pairings (link map §22 — READY, billi-verified
// real comparisons). The old picker listed twelve cities and eleven
// countries and happily routed to pair pages that do not exist; the
// city list is now the three published cities (whose three pairings
// are all published), and the country picker is removed until country
// pairings are published.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const COMPARE_CITIES = ['Lahore, Pakistan', 'Karachi, Pakistan', 'Islamabad, Pakistan'];

const CITY_SLUGS: Record<string, string> = {
  'Lahore, Pakistan': 'lahore',
  'Karachi, Pakistan': 'karachi',
  'Islamabad, Pakistan': 'islamabad',
};

function Select({ options, value, onChange, placeholder }: {
  options: string[]; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3 t-text text-sm font-medium border outline-none"
      style={{ backgroundColor: 'var(--input-bg)', borderColor: 'var(--border-12)' }}>
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => <option key={o} value={o} style={{ backgroundColor: 'var(--bg)' }}>{o}</option>)}
    </select>
  );
}

export default function CompareSection() {
  const router = useRouter();
  const [cityA, setCityA] = useState('');
  const [cityB, setCityB] = useState('');

  // Pair slugs are directional on this site — only these three
  // orderings are published (verified against the live sitemap).
  const PAIRS: Record<string, string> = {
    'karachi|lahore': 'lahore-vs-karachi',
    'islamabad|lahore': 'lahore-vs-islamabad',
    'islamabad|karachi': 'karachi-vs-islamabad',
  };

  const handleCityCompare = () => {
    if (!cityA || !cityB) return;
    const key = [CITY_SLUGS[cityA], CITY_SLUGS[cityB]].sort().join('|');
    const pair = PAIRS[key];
    if (pair) router.push(`/compare/${pair}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Featured pair */}
      <Link href="/compare/lahore-vs-karachi" className="no-underline group">
        <div className="rounded-2xl border p-6 transition-all group-hover:scale-[1.01] h-full"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), var(--bg))', borderColor: 'rgba(99,102,241,0.25)' }}>
          {/* Polish Card 4: the featured pair carries both cities' real
              photos (image bank: Lahore — Romero Maia, CC BY-SA 4.0;
              Karachi, Mazar-e-Quaid — Ibrahim Janjua, CC BY-SA 4.0). */}
          <div className="flex gap-2 mb-4">
            <div className="relative h-32 sm:h-36 flex-1 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/home/compare-lahore.webp" alt="Badshahi Mosque front picture, Lahore" width={640} height={426} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span className="t-force-dark absolute bottom-0 left-0 bg-black/60 t-text text-[10px] font-semibold px-1.5 py-0.5 rounded-tr-md">Lahore</span>
              <span className="t-force-dark absolute bottom-0 right-0 bg-black/60 t-text-70 text-[9px] px-1.5 py-0.5 rounded-tl-md">Romero Maia · CC BY-SA 4.0</span>
            </div>
            <div className="relative h-32 sm:h-36 flex-1 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/home/compare-karachi.webp" alt="Mazar-e-Quaid, the heart of Karachi" width={640} height={360} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              <span className="t-force-dark absolute bottom-0 left-0 bg-black/60 t-text text-[10px] font-semibold px-1.5 py-0.5 rounded-tr-md">Karachi</span>
              <span className="t-force-dark absolute bottom-0 right-0 bg-black/60 t-text-70 text-[9px] px-1.5 py-0.5 rounded-tl-md">Ibrahim Janjua · CC BY-SA 4.0</span>
            </div>
          </div>
          <div className="t-text-40 text-xs uppercase tracking-wider mb-2">Featured comparison</div>
          <div className="t-text font-bold text-2xl mb-2">Lahore vs Karachi</div>
          <p className="sub-desc">
            Weather, air quality, prayer times compared
          </p>
          <div className="t-cyan text-sm font-medium mt-4">See the full comparison →</div>
        </div>
      </Link>

      {/* Pair picker — published cities only */}
      <div className="rounded-2xl border p-6 space-y-4"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.10), var(--bg))', borderColor: 'rgba(16,185,129,0.25)' }}>
        <div>
          <div className="t-text font-bold text-lg mb-1">Compare two cities</div>
          <div className="sub-desc">Pick two published cities to compare live</div>
        </div>
        <Select options={COMPARE_CITIES} value={cityA} onChange={setCityA} placeholder="Select first city" />
        <div className="text-center t-text-30 text-sm font-bold">VS</div>
        <Select options={COMPARE_CITIES.filter((c) => c !== cityA)} value={cityB} onChange={setCityB} placeholder="Select second city" />
        <button onClick={handleCityCompare} disabled={!cityA || !cityB}
          className="w-full py-3 rounded-xl font-semibold t-onbrand text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{ background: cityA && cityB ? 'linear-gradient(90deg, #6366f1, #06b6d4)' : 'rgba(255,255,255,0.08)' }}>
          Compare Cities →
        </button>
        <Link href="/compare" className="block text-center t-link text-sm font-medium no-underline">
          All published comparisons →
        </Link>
      </div>
    </div>
  );
}
