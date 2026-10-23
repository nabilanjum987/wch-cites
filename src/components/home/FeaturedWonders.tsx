'use client';

// Wonders panel (§6). SWITCH-ON 2026-10-22 (link map §6 / Laws L1+L6):
// the Golden Wonder passed and /wonders/taj-mahal is published, so the
// Taj Mahal card deep-links to it and the hub link to /wonders is on.
// The other wonders' pages are not published yet — their cards still
// render WITHOUT links. The panel's live figure is real: the weather
// right now at the Taj Mahal's coordinates in Agra (Open-Meteo).

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const WONDERS = [
  { name: 'Great Wall of China',    country: 'China',  emoji: '🏯', color: '#CC0000', desc: '21,196 km of ancient wall' },
  { name: 'Petra',                  country: 'Jordan', emoji: '🏛️', color: '#C4A265', desc: 'Rose-red city in rock' },
  { name: 'Christ the Redeemer',    country: 'Brazil', emoji: '✝️', color: '#009C3B', desc: '38 m statue above Rio' },
  { name: 'Machu Picchu',           country: 'Peru',   emoji: '🗻', color: '#D9A028', desc: 'Inca citadel in the Andes' },
  { name: 'Chichen Itza',           country: 'Mexico', emoji: '🔺', color: '#006847', desc: 'Mayan pyramid city' },
  { name: 'Roman Colosseum',        country: 'Italy',  emoji: '🏟️', color: '#008C45', desc: 'Amphitheatre from 80 AD' },
  { name: 'Taj Mahal',              country: 'India',  emoji: '🕌', color: '#FF9933', desc: 'Marble tomb in Agra', href: '/wonders/taj-mahal',
    // Polish Card 4: the published wonder's card carries its real photo
    // (image bank: "Taj Mahal (Edited).jpeg", Yann Forget, CC BY-SA 4.0).
    img: '/images/home/taj.webp', imgAlt: 'The Taj Mahal seen from the Yamuna river side, its white marble dome and minarets above the garden wall', credit: 'Photo: Yann Forget · CC BY-SA 4.0' },
];

export default function FeaturedWonders() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [tajTemp, setTajTemp] = useState<number | null>(null);

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

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=27.175&longitude=78.0419&current=temperature_2m', { signal: AbortSignal.timeout(6000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const t = d?.current?.temperature_2m;
        if (typeof t === 'number') setTajTemp(Math.round(t));
      })
      .catch(() => { /* figure stays off */ });
  }, []);

  const doubled = [...WONDERS, ...WONDERS];

  return (
    <div className="mb-4">
      {tajTemp != null && (
        <p className="sub-desc">
          Right now at the Taj Mahal in Agra: <span className="t-text font-semibold">{tajTemp}°C</span> — the marble changes colour with the light through the day.
        </p>
      )}
      <div className="overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex gap-4" style={{ width: 'max-content' }}>
          {doubled.map((w, i) => {
            const card = (
              <div className="relative h-44 rounded-2xl overflow-hidden border"
                style={{ borderColor: `${w.color}40`, background: `linear-gradient(135deg, ${w.color}20, var(--bg))` }}>
                {'img' in w && w.img ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.img} alt={w.imgAlt} width={640} height={421} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,15,30,0.92) 0%, rgba(10,15,30,0.35) 55%, rgba(10,15,30,0.15) 100%)' }} />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-15 select-none pointer-events-none">{w.emoji}</div>
                )}
                <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                  <div className="text-3xl">{w.emoji}</div>
                  <div>
                    <div className="t-text font-bold text-sm leading-tight">{w.name}</div>
                    <div className="sub-desc mt-0.5">{w.country}</div>
                    <div className="sub-desc mt-1">{w.desc}</div>
                    {'credit' in w && w.credit && <div className="text-[9px] text-white/50 mt-1">{w.credit}</div>}
                  </div>
                </div>
              </div>
            );
            return (
              <div key={i} className="flex-shrink-0 w-52">
                {'href' in w && w.href ? <Link href={w.href} className="block">{card}</Link> : card}
              </div>
            );
          })}
        </div>
      </div>
      <p className="sub-desc mt-4">
        The Taj Mahal&rsquo;s full page is live now — live visiting conditions, history and photography guides. The other wonders open one by one as each passes review.{' '}
        <Link href="/wonders" className="t-text-70 underline underline-offset-4 t-hover-text">Explore all wonders →</Link>
      </p>
    </div>
  );
}
