'use client';

// Oceans panel (§8). SWITCH-ON 2026-10-22 (link map §8 / Laws L1+L6):
// the Golden Ocean passed and /oceans/arabian-sea is published, so the
// featured Arabian Sea strip below deep-links to it and the hub link
// to /oceans is on. The five oceans' own detail pages are not
// published yet — their cards still render WITHOUT links. Areas are
// the oceans' real published surface areas (the Arabian Sea's
// 3,862,000 km² is its golden page's Wikidata/Wikipedia figure).

const OCEANS = [
  { name: 'Pacific Ocean',  emoji: '🌊', area: '165.25M km²', color: '#0369a1', note: 'Bigger than all land' },
  { name: 'Atlantic Ocean', emoji: '🌊', area: '106.46M km²', color: '#1d4ed8', note: 'Gulf Stream crossing' },
  { name: 'Indian Ocean',   emoji: '🌊', area: '70.56M km²',  color: '#0891b2', note: 'Monsoon-fed ocean' },
  { name: 'Southern Ocean', emoji: '🌊', area: '21.96M km²',  color: '#065f46', note: 'Circles Antarctica' },
  { name: 'Arctic Ocean',   emoji: '🧊', area: '14.06M km²',  color: '#7c3aed', note: 'Smallest, mostly ice' },
];

import Link from 'next/link';

export default function OceansToday() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {OCEANS.map((o) => (
          <div key={o.name}>
            <div className="relative rounded-2xl border p-4 h-36 flex flex-col justify-between overflow-hidden"
              style={{ background: `linear-gradient(160deg, ${o.color}40, var(--bg))`, borderColor: `${o.color}40` }}>
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10 select-none pointer-events-none">{o.emoji}</div>
              <span className="text-2xl z-10">{o.emoji}</span>
              <div className="z-10">
                <div className="t-text font-semibold text-xs leading-tight">{o.name}</div>
                <div className="t-text-40 text-xs mt-0.5">{o.area}</div>
                <div className="sub-desc mt-1">{o.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/oceans/arabian-sea" className="block mt-3 rounded-2xl border p-4 hover:border-sky-400/50 transition-colors"
        style={{ background: 'linear-gradient(160deg, #07598540, var(--bg))', borderColor: '#07598540' }}>
        <div className="flex items-center gap-4">
          {/* Polish Card 4: the featured sea carries its real photo
              (image bank: "Arabian sea waves", Galib Tufan, CC BY-SA 4.0). */}
          <div className="relative h-24 sm:h-28 w-32 sm:w-44 shrink-0 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/home/arabian-sea.webp" alt="Waves rolling in the Arabian Sea under a bright sky" width={720} height={450} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[9px] px-1.5 py-0.5 rounded-tl-md">Galib Tufan · CC BY-SA 4.0</span>
          </div>
          <div className="flex-1">
            <div className="t-text font-semibold text-sm">Featured sea · Arabian Sea</div>
            <div className="sub-desc mt-0.5">3,862,000 km² — waves & monsoon</div>
          </div>
          <div className="t-text-60 text-sm whitespace-nowrap">Explore →</div>
        </div>
      </Link>
      <p className="sub-desc mt-4">
        Full ocean pages — live conditions, marine life and the cities on their shores — open as each passes review.{' '}
        <Link href="/oceans" className="t-text-70 underline underline-offset-4 t-hover-text">Explore Oceans &amp; Seas →</Link>
      </p>
    </div>
  );
}
