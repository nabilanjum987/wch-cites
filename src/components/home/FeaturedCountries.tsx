'use client';

// Countries panel (§9). Per the marathon card + link map §9: the
// Pakistan card links to /pakistan (verified full country page), and
// "all countries" links to the /countries hub. Other country cards
// render WITHOUT deep links until their country pages pass the QA
// gate (L1/L6) — the previous version linked every card and carried
// invented per-country "cities" counts; both are fixed here.
// Homepage-imagery pass (2026-10-28): each tile now carries one real
// landmark photo of its country (vendored under public/images/home28/;
// licence + creator records in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
// Credits for all eight photos are listed under the grid.
// Stage 3 card standard (2026-11-03): the photo is a clean block at
// the top of the card and ALL data sits below it, nothing overlaid on
// the photo. The old emoji flags are replaced by the vendored flag
// files in public/images/flags/: on Windows the emoji flags render as
// bare country-code letters (PK, IN, SA, AE), which the owner review
// ordered removed. The Turkey flag (tr.svg) is the flag defined by
// Turkish Flag Law No. 2893, public domain, via Wikimedia Commons
// (original drawing by David Benbennick); it was vendored in this pass
// because no tr.png existed.

import Link from 'next/link';
import { useEffect, useState } from 'react';

const COUNTRIES = [
  { name: 'Pakistan',      flagImg: '/images/flags/pk.png', color: '#01411C', slug: 'pakistan', live: true,
    img: '/images/home28/ctry-pakistan.webp', imgAlt: 'Hunza Valley in northern Pakistan' },
  { name: 'India',         flagImg: '/images/flags/in.png', color: '#FF9933', slug: 'india', live: false,
    img: '/images/home28/ctry-india.webp', imgAlt: 'The Red Fort in Delhi' },
  { name: 'Saudi Arabia',  flagImg: '/images/flags/sa.png', color: '#006C35', slug: 'saudi-arabia', live: false,
    img: '/images/home28/ctry-saudi.webp', imgAlt: 'The Kaaba in Mecca' },
  { name: 'UAE',           flagImg: '/images/flags/ae.png', color: '#00732F', slug: 'united-arab-emirates', live: false,
    img: '/images/home28/ctry-uae.webp', imgAlt: 'The Burj Khalifa in Dubai at sunset' },
  { name: 'United States', flagImg: '/images/flags/us.png', color: '#B22234', slug: 'united-states', live: false,
    img: '/images/home28/ctry-usa.webp', imgAlt: 'The Golden Gate Bridge in San Francisco' },
  { name: 'United Kingdom',flagImg: '/images/flags/gb.png', color: '#012169', slug: 'united-kingdom', live: false,
    img: '/images/home28/ctry-uk.webp', imgAlt: 'The Palace of Westminster in London' },
  { name: 'Turkey',        flagImg: '/images/flags/tr.svg', color: '#E30A17', slug: 'turkey', live: false,
    img: '/images/home28/ctry-turkey.webp', imgAlt: 'The Sultan Ahmed Mosque in Istanbul' },
  { name: 'Japan',         flagImg: '/images/flags/jp.png', color: '#BC002D', slug: 'japan', live: false,
    img: '/images/home28/ctry-japan.webp', imgAlt: 'Mount Fuji seen from Owakudani' },
];

const CREDITS = 'Photos: Pakistan — FaizanAhmad · CC BY-SA 3.0; India — Syed Sajidul Islam · CC BY-SA 4.0; Saudi Arabia — Moataz Egbaria · CC BY-SA 3.0; UAE — ECWiki1 · CC BY 4.0; United States — Frank Schulenburg · CC BY-SA 4.0; United Kingdom — Diliff · CC BY-SA 2.5; Turkey — Moonik · CC BY-SA 3.0; Japan — Suicasmo · CC BY-SA 4.0 (all via Wikimedia Commons).';

const PAGE_SIZE = 4;

export default function FeaturedCountries() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(COUNTRIES.length / PAGE_SIZE);
  const visible = COUNTRIES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    const timer = setInterval(() => setPage((p) => (p + 1) % totalPages), 4000);
    return () => clearInterval(timer);
  }, [totalPages]);

  return (
    <div className="mb-4">
      <div className="flex justify-end mb-4">
        <Link href="/countries" className="t-link text-sm font-medium transition-colors no-underline">
          View all countries →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {visible.map((c) => {
          const cardInner = (
            <div className="rounded-2xl overflow-hidden border transition-all h-full"
              style={{ background: `linear-gradient(135deg, ${c.color}25, var(--bg))`, borderColor: `${c.color}40` }}>
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={c.imgAlt} width={900} height={600} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.flagImg} alt={`Flag of ${c.name}`} width={30} height={20} loading="lazy" decoding="async" className="rounded-sm shadow shrink-0" />
                  <div className="t-text font-bold text-sm">{c.name}</div>
                </div>
                <div className="sub-desc mt-1">{c.live ? 'Country page is live' : 'Page in preparation'}</div>
              </div>
            </div>
          );
          return c.live ? (
            <Link key={c.slug} href={`/${c.slug}`} className="no-underline group hover:scale-[1.02] transition-transform">{cardInner}</Link>
          ) : (
            <div key={c.slug}>{cardInner}</div>
          );
        })}
      </div>
      <p className="text-[11px] t-text-40 mt-1 mb-3">{CREDITS}</p>
      <p className="sub-desc">
        Pakistan's full country page is live today: provinces, cities, economy and culture. Every other country joins it as its page passes review →
      </p>
    </div>
  );
}
