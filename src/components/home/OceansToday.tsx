'use client';
import Link from 'next/link';

const OCEANS = [
  { name: 'Pacific Ocean',  emoji: '🌊', temp: '18°C', slug: 'pacific-ocean',  area: '165.25M km²', color: '#0369a1', condition: 'Moderate waves' },
  { name: 'Atlantic Ocean', emoji: '🌊', temp: '16°C', slug: 'atlantic-ocean', area: '106.46M km²', color: '#1d4ed8', condition: 'Calm' },
  { name: 'Indian Ocean',   emoji: '🌊', temp: '24°C', slug: 'indian-ocean',   area: '70.56M km²',  color: '#0891b2', condition: 'Monsoon season' },
  { name: 'Arctic Ocean',   emoji: '🧊', temp: '-2°C', slug: 'arctic-ocean',   area: '14.06M km²',  color: '#7c3aed', condition: 'Ice covered' },
  { name: 'Southern Ocean', emoji: '🌊', temp: '2°C',  slug: 'southern-ocean', area: '21.96M km²',  color: '#065f46', condition: 'Stormy' },
];

export default function OceansToday() {
  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Link href="/oceans/pacific-ocean" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors no-underline">
          Explore All Oceans →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {OCEANS.map((o) => (
          <Link key={o.slug} href={`/oceans/${o.slug}`} className="no-underline group">
            <div className="relative rounded-2xl border p-4 h-36 flex flex-col justify-between overflow-hidden transition-all group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(160deg, ${o.color}40, #0a0f1e)`, borderColor: `${o.color}40` }}>
              {/* Background wave emoji */}
              <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-10 select-none pointer-events-none">{o.emoji}</div>
              <div className="flex items-center justify-between z-10">
                <span className="text-2xl">{o.emoji}</span>
                <span className="text-white font-bold text-lg">{o.temp}</span>
              </div>
              <div className="z-10">
                <div className="text-white font-semibold text-xs leading-tight">{o.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{o.area}</div>
                <div className="text-xs mt-1 px-1.5 py-0.5 rounded-full inline-block" style={{ backgroundColor: `${o.color}30`, color: '#7dd3fc' }}>
                  {o.condition}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
