'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const WONDERS = [
  { name: 'Great Wall of China',    country: 'China',  emoji: '🏯', slug: 'great-wall-of-china',    color: '#CC0000', desc: '21,196 km wall built over centuries' },
  { name: 'Petra',                  country: 'Jordan', emoji: '🏛️', slug: 'petra',                   color: '#C4A265', desc: 'Rose-red city carved into rock' },
  { name: 'Christ the Redeemer',    country: 'Brazil', emoji: '✝️', slug: 'christ-the-redeemer',     color: '#009C3B', desc: '38m statue overlooking Rio' },
  { name: 'Machu Picchu',           country: 'Peru',   emoji: '🗻', slug: 'machu-picchu',            color: '#D9A028', desc: '15th-century Inca citadel' },
  { name: 'Chichen Itza',           country: 'Mexico', emoji: '🔺', slug: 'chichen-itza',            color: '#006847', desc: 'Ancient Mayan pyramid city' },
  { name: 'Roman Colosseum',        country: 'Italy',  emoji: '🏟️', slug: 'roman-colosseum',         color: '#008C45', desc: 'Iconic amphitheatre from 70 AD' },
  { name: 'Taj Mahal',              country: 'India',  emoji: '🕌', slug: 'taj-mahal',               color: '#FF9933', desc: 'White marble mausoleum in Agra' },
];

export default function FeaturedWonders() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let raf: number;
    const step = () => {
      pos += 0.4;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...WONDERS, ...WONDERS];

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Link href="/wonders/great-wall-of-china" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors no-underline">
          Explore All 7 Wonders →
        </Link>
      </div>
      <div className="overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex gap-4" style={{ width: 'max-content' }}>
          {doubled.map((w, i) => (
            <Link key={i} href={`/wonders/${w.slug}`} className="no-underline flex-shrink-0 w-52">
              <div className="relative h-44 rounded-2xl overflow-hidden group border"
                style={{ borderColor: `${w.color}40`, background: `linear-gradient(135deg, ${w.color}20, #0a0f1e)` }}>
                <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-15 select-none pointer-events-none">{w.emoji}</div>
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                  <div className="text-3xl">{w.emoji}</div>
                  <div>
                    <div className="text-white font-bold text-sm leading-tight">{w.name}</div>
                    <div className="text-white/50 text-xs mt-0.5">{w.country}</div>
                    <div className="text-white/40 text-xs mt-1 line-clamp-2">{w.desc}</div>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${w.color}15` }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
