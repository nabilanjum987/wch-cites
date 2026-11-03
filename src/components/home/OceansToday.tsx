'use client';

// Oceans panel (§8). SWITCH-ON 2026-10-22 (link map §8 / Laws L1+L6):
// the Golden Ocean passed and /oceans/arabian-sea is published, so the
// featured Arabian Sea strip below deep-links to it and the hub link
// to /oceans is on. Stage 2 (2026-11-03): all five ocean detail pages
// are now live in the sitemap, so every ocean card links to its own
// page (slugs from src/lib/oceans.ts). Areas are the oceans' real
// published surface areas (the Arabian Sea's 3,862,000 km² is its
// golden page's Wikidata/Wikipedia figure).
// Ocean card photos (2026-11-03): each card now carries a real photo
// in the Stage 3 card standard (photo zone on top, all data below,
// nothing overlaid on the photo). Pacific, Atlantic, Southern and
// Arctic reuse the media registry's licence-verified Commons records
// (downloaded files SHA1-matched to docs/media-registry/subjects/);
// the Indian Ocean photo is "Marine Drive Waves" (monsoon surf over
// the Mumbai sea wall), licence verified on its Commons file page.

const OCEANS = [
  { name: 'Pacific Ocean',  slug: 'pacific-ocean',  emoji: '🌊', area: '165.25M km²', color: '#0369a1', note: 'Bigger than all land',
    img: '/images/home/pacific-ocean.webp', imgAlt: 'Lines of Pacific surf rolling toward the shore off Vancouver Island', credit: 'Photo: Paul Harrison · CC BY-SA 4.0' },
  { name: 'Atlantic Ocean', slug: 'atlantic-ocean', emoji: '🌊', area: '106.46M km²', color: '#1d4ed8', note: 'Gulf Stream crossing',
    img: '/images/home/atlantic-ocean.webp', imgAlt: 'An Atlantic wave breaking with wind-blown spray', credit: 'Photo: FrankBanalis · CC BY 4.0' },
  { name: 'Indian Ocean',   slug: 'indian-ocean',   emoji: '🌊', area: '70.56M km²',  color: '#0891b2', note: 'Monsoon-fed ocean',
    img: '/images/home/indian-ocean.webp', imgAlt: 'Monsoon waves splashing over the sea wall at Marine Drive in Mumbai', credit: 'Photo: AroundTheGlobe · CC BY-SA 3.0' },
  { name: 'Southern Ocean', slug: 'southern-ocean', emoji: '🌊', area: '21.96M km²',  color: '#065f46', note: 'Circles Antarctica',
    img: '/images/home/southern-ocean.webp', imgAlt: 'A tabular iceberg floating in the Southern Ocean off Elephant Island', credit: 'Photo: Godot13 · CC BY-SA 4.0' },
  { name: 'Arctic Ocean',   slug: 'arctic-ocean',   emoji: '🧊', area: '14.06M km²',  color: '#7c3aed', note: 'Smallest, mostly ice',
    img: '/images/home/arctic-ocean.webp', imgAlt: 'An Arctic iceberg in calm water, its turquoise underside glowing below the surface', credit: 'Photo: AWeith · CC BY-SA 4.0' },
];

import Link from 'next/link';

export default function OceansToday() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {OCEANS.map((o) => (
          <Link key={o.name} href={`/oceans/${o.slug}`} className="block no-underline group">
            <div className="rounded-2xl overflow-hidden border h-full transition-transform group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(160deg, ${o.color}26, var(--bg))`, borderColor: `${o.color}40` }}>
              <div className="relative h-24 sm:h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={o.img} alt={o.imgAlt} width={720} height={360} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <div className="t-text font-semibold text-xs leading-tight">{o.emoji} {o.name}</div>
                <div className="t-text-40 text-xs mt-0.5">{o.area}</div>
                <div className="sub-desc mt-1">{o.note}</div>
                <div className="text-[10px] t-text-40 mt-1.5">{o.credit}</div>
              </div>
            </div>
          </Link>
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
          </div>
          <div className="flex-1">
            <div className="t-text font-semibold text-sm">Featured sea · Arabian Sea</div>
            <div className="sub-desc mt-0.5">3,862,000 km², waves and monsoon</div>
            <div className="text-[10px] t-text-40 mt-1">Photo: Galib Tufan · CC BY-SA 4.0</div>
          </div>
          <div className="t-text-60 text-sm whitespace-nowrap">Explore →</div>
        </div>
      </Link>
      <p className="sub-desc mt-4">
        Every ocean above has its own page, with live surface conditions, marine life, seasonal patterns and the cities on its shores.{' '}
        <Link href="/oceans" className="t-text-70 underline underline-offset-4 t-hover-text">Explore Oceans &amp; Seas →</Link>
      </p>
    </div>
  );
}
