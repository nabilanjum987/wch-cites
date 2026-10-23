'use client';

// Oceans panel (§8). SWITCH-ON 2026-10-22 (link map §8 / Laws L1+L6):
// the Golden Ocean passed and /oceans/arabian-sea is published, so the
// featured Arabian Sea strip below deep-links to it and the hub link
// to /oceans is on. The five oceans' own detail pages are not
// published yet — their cards still render WITHOUT links. Areas are
// the oceans' real published surface areas (the Arabian Sea's
// 3,862,000 km² is its golden page's Wikidata/Wikipedia figure).

const OCEANS = [
  { name: 'Pacific Ocean',  emoji: '🌊', area: '165.25M km²', color: '#0369a1', note: 'Larger than all land on earth combined' },
  { name: 'Atlantic Ocean', emoji: '🌊', area: '106.46M km²', color: '#1d4ed8', note: 'Crossed by the Gulf Stream and the Mid-Atlantic Ridge' },
  { name: 'Indian Ocean',   emoji: '🌊', area: '70.56M km²',  color: '#0891b2', note: 'Its monsoon winds water farms across South Asia' },
  { name: 'Southern Ocean', emoji: '🌊', area: '21.96M km²',  color: '#065f46', note: 'The circumpolar current circles Antarctica unbroken' },
  { name: 'Arctic Ocean',   emoji: '🧊', area: '14.06M km²',  color: '#7c3aed', note: 'The smallest and shallowest — mostly sea ice in winter' },
];

import Link from 'next/link';

export default function OceansToday() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {OCEANS.map((o) => (
          <div key={o.name}>
            <div className="relative rounded-2xl border p-4 h-36 flex flex-col justify-between overflow-hidden"
              style={{ background: `linear-gradient(160deg, ${o.color}40, #0a0f1e)`, borderColor: `${o.color}40` }}>
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10 select-none pointer-events-none">{o.emoji}</div>
              <span className="text-2xl z-10">{o.emoji}</span>
              <div className="z-10">
                <div className="text-white font-semibold text-xs leading-tight">{o.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{o.area}</div>
                <div className="text-white/50 text-[11px] mt-1 leading-snug">{o.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link href="/oceans/arabian-sea" className="block mt-3 rounded-2xl border p-4 hover:border-sky-400/50 transition-colors"
        style={{ background: 'linear-gradient(160deg, #07598540, #0a0f1e)', borderColor: '#07598540' }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-white font-semibold text-sm">Featured sea · Arabian Sea</div>
            <div className="text-white/50 text-xs mt-0.5">3,862,000 km² of the Indian Ocean — live waves, monsoon pattern and Karachi coastal weather</div>
          </div>
          <div className="text-white/60 text-sm whitespace-nowrap">Explore →</div>
        </div>
      </Link>
      <p className="text-white/40 text-sm mt-4">
        Full ocean pages — live conditions, marine life and the cities on their shores — open as each passes review.{' '}
        <Link href="/oceans" className="text-white/70 underline underline-offset-4 hover:text-white">Explore Oceans &amp; Seas →</Link>
      </p>
    </div>
  );
}
