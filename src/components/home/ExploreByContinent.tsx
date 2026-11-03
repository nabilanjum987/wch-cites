'use client';

// Continents panel (§7). Cards link to the countries hub filtered by
// continent (link map §7 — READY pattern: /countries?continent={slug}).
// The previous version showed invented "cities" counts per continent;
// those fabricated figures are removed.
// Homepage-imagery pass (2026-10-28): each tile now carries a real
// photo of its continent (vendored under public/images/home28/;
// licence + creator records in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
// Credits for all seven photos are listed under the grid.
// Stage 3 card standard (2026-11-03): the photo is a clean block at
// the top of the card with nothing overlaid on it (the globe and ice
// emojis that sat on the photos are gone); the emoji now sits beside
// the continent name in the data block below the photo. The North
// America photo is anchored to the top of its frame: the Statue of
// Liberty asset is well framed at source, and the old wide, short
// crop cut the statue; top anchoring keeps the whole statue, torch
// to pedestal, in frame.

import Link from 'next/link';

const CONTINENTS = [
  { name: 'Asia',          emoji: '🌏', color: '#FF6B35', desc: 'Largest continent', slug: 'asia',
    img: '/images/home28/cont-asia.webp', imgAlt: 'The Great Wall of China winding over green hills' },
  { name: 'Africa',        emoji: '🌍', color: '#F7B731', desc: 'Richest biodiversity',    slug: 'africa',
    img: '/images/home28/cont-africa.webp', imgAlt: 'Mount Kilimanjaro rising above the Amboseli plain' },
  { name: 'Europe',        emoji: '🌍', color: '#4ECDC4', desc: 'Art & culture hub',          slug: 'europe',
    img: '/images/home28/cont-europe.webp', imgAlt: 'The Colosseum in Rome' },
  { name: 'North America', emoji: '🌎', color: '#45B7D1', desc: 'Arctic to Caribbean',      slug: 'north-america',
    img: '/images/home28/cont-namerica.webp', imgAlt: 'The Statue of Liberty in New York Harbour', imgPos: 'object-top' },
  { name: 'South America', emoji: '🌎', color: '#96CEB4', desc: 'Amazon & the Andes',     slug: 'south-america',
    img: '/images/home28/cont-samerica.webp', imgAlt: 'Machu Picchu above the Urubamba valley' },
  { name: 'Oceania',       emoji: '🌏', color: '#FFEAA7', desc: 'Pacific & Australia',         slug: 'oceania',
    img: '/images/home28/cont-oceania.webp', imgAlt: 'Sydney Opera House on the harbour' },
  { name: 'Antarctica',    emoji: '🧊', color: '#DFE6E9', desc: 'The frozen continent',            slug: 'antarctica',
    img: '/images/home28/cont-antarctica.webp', imgAlt: 'McMurdo Station in Antarctica, seen from Observation Hill' },
];

const CREDITS = 'Photos: Asia — Velatrix · CC0; Africa — Sergey Pesterev · CC BY-SA 4.0; Europe — Diliff · CC BY-SA 2.5; North America — William Warby · CC BY 2.0; South America — Martin St-Amant · CC BY-SA 3.0; Oceania — Diliff · CC BY-SA 3.0; Antarctica — owamux · CC BY 2.0 (all via Wikimedia Commons).';

export default function ExploreByContinent() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CONTINENTS.map((c) => (
          <Link key={c.slug} href={`/countries?continent=${c.slug}`} className="no-underline group">
            <div className="rounded-2xl overflow-hidden border transition-all group-hover:scale-[1.02] h-full"
              style={{ background: `linear-gradient(135deg, ${c.color}20, var(--bg))`, borderColor: `${c.color}30` }}>
              <div className="relative h-36 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.imgAlt} width={900} height={600} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${'imgPos' in c && c.imgPos ? c.imgPos : ''}`} />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{c.emoji}</span>
                  <div className="t-text font-bold text-sm">{c.name}</div>
                </div>
                <div className="sub-desc mt-0.5">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-[11px] t-text-40 mt-3">{CREDITS}</p>
    </div>
  );
}
