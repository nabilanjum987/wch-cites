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
  { name: 'Great Wall of China',    country: 'China',  emoji: '🏯', color: '#CC0000', desc: '21,196 km of ancient wall',
    // Card photo (2026-11-03): the wall sweeping over the ridges at
    // Jinshanling (Commons: "The Great Wall of China at
    // Jinshanling-edit.jpg", Severin.stalder, CC BY-SA 3.0).
    img: '/images/home/great-wall.webp', imgAlt: 'The Great Wall of China winding over green mountain ridges at Jinshanling', credit: 'Photo: Severin.stalder · CC BY-SA 3.0' },
  { name: 'Petra',                  country: 'Jordan', emoji: '🏛️', color: '#C4A265', desc: 'Rose-red city in rock',
    // Card photo (2026-11-03): the Monastery (Ad Deir), Petra's great
    // rock-cut facade shown whole (Commons: "Al Deir Petra.JPG",
    // Azurfrog, CC BY-SA 3.0). imgPos (D7, wonders-family fix): the
    // card's 208x112 centre crop cut the facade's pediment apexes, so
    // this card alone anchors the crop to the top of the frame, where
    // the pediment sits; the other cards' subjects are whole centred.
    img: '/images/home/petra.webp', imgAlt: 'The Monastery (Ad Deir) at Petra, its whole rock-cut facade carved into rose-red sandstone', credit: 'Photo: Azurfrog · CC BY-SA 3.0', imgPos: 'object-top' },
  { name: 'Christ the Redeemer',    country: 'Brazil', emoji: '✝️', color: '#009C3B', desc: '38 m statue above Rio',
    // Card photo (2026-11-03): the full statue on its pedestal above
    // Rio (Commons: "1 cristor redentor 2014.jpg", Chensiyuan,
    // CC BY-SA 4.0).
    img: '/images/home/christ-redeemer.webp', imgAlt: 'Christ the Redeemer, the full statue with outstretched arms on Corcovado above Rio de Janeiro', credit: 'Photo: Chensiyuan · CC BY-SA 4.0' },
  { name: 'Machu Picchu',           country: 'Peru',   emoji: '🗻', color: '#D9A028', desc: 'Inca citadel in the Andes',
    // Card photo (2026-11-03): the whole citadel below Huayna Picchu
    // (Commons: "Machu Picchu, 2023 (012).jpg", Draceane, CC BY-SA 4.0).
    img: '/images/home/machu-picchu.webp', imgAlt: 'Machu Picchu, the Inca citadel in full below the peak of Huayna Picchu in the Andes', credit: 'Photo: Draceane · CC BY-SA 4.0' },
  { name: 'Chichen Itza',           country: 'Mexico', emoji: '🔺', color: '#006847', desc: 'Mayan pyramid city',
    // Card photo (2026-11-03): El Castillo pyramid seen whole
    // (Commons: "Chichen Itza 3.jpg", Daniel Schwen, CC BY-SA 4.0).
    // imgW/imgH (D9, wonders-family fix): this file's real dimensions
    // are 640x340, not the 640x421 the other card photos share.
    img: '/images/home/chichen-itza.webp', imgAlt: 'El Castillo, the step pyramid of Chichen Itza, seen whole under a blue sky', credit: 'Photo: Daniel Schwen · CC BY-SA 4.0', imgW: 640, imgH: 340 },
  { name: 'Roman Colosseum',        country: 'Italy',  emoji: '🏟️', color: '#008C45', desc: 'Amphitheatre from 80 AD',
    // Card photo (2026-11-03): the full oval amphitheatre from the
    // plaza (Commons: "Colosseo 2020.jpg", FeaturedPics, CC BY-SA 4.0).
    img: '/images/home/colosseum.webp', imgAlt: 'The Colosseum in Rome, the full oval amphitheatre seen from the plaza', credit: 'Photo: FeaturedPics · CC BY-SA 4.0' },
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
          Right now at the Taj Mahal in Agra: <span className="t-text font-semibold">{tajTemp}°C</span>. The marble changes colour with the light through the day.
        </p>
      )}
      <div className="overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex gap-4" style={{ width: 'max-content' }}>
          {doubled.map((w, i) => {
            // Stage 3 card standard (2026-11-03): a visual zone on
            // top (each wonder's real photo; the emoji glyph remains
            // only as a fallback for a future wonder added without
            // one) and ALL data below it. Nothing sits on the photo:
            // the mosque emoji that used to overlay the Taj Mahal
            // photo is gone.
            const card = (
              <div className="rounded-2xl overflow-hidden border h-full"
                style={{ borderColor: `${w.color}40`, background: `linear-gradient(135deg, ${w.color}20, var(--bg))` }}>
                {'img' in w && w.img ? (
                  <div className="relative h-28 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.img} alt={w.imgAlt} width={'imgW' in w && w.imgW ? w.imgW : 640} height={'imgH' in w && w.imgH ? w.imgH : 421} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${'imgPos' in w && w.imgPos ? w.imgPos : ''}`} />
                  </div>
                ) : (
                  <div className="h-28 flex items-center justify-center text-6xl opacity-25 select-none" aria-hidden="true">{w.emoji}</div>
                )}
                <div className="p-4">
                  <div className="t-text font-bold text-sm leading-tight">{w.name}</div>
                  <div className="sub-desc mt-0.5">{w.country}</div>
                  <div className="sub-desc mt-1">{w.desc}</div>
                  {'credit' in w && w.credit && <div className="text-[10px] t-text-40 mt-2">{w.credit}</div>}
                </div>
              </div>
            );
            return (
              <div key={i} className="flex-shrink-0 w-52">
                {'href' in w && w.href ? <Link href={w.href} className="block h-full">{card}</Link> : card}
              </div>
            );
          })}
        </div>
      </div>
      <p className="sub-desc mt-4">
        The Taj Mahal&rsquo;s full page is live now, with live visiting conditions, history and photography guides. The other wonders open one by one as each passes review.{' '}
        <Link href="/wonders" className="t-text-70 underline underline-offset-4 t-hover-text">Explore all wonders →</Link>
      </p>
    </div>
  );
}
