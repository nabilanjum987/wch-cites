'use client';

// Countries panel (§9). Per the marathon card + link map §9: the
// Pakistan card links to /pakistan (verified full country page), and
// "all countries" links to the /countries hub. Other country cards
// render WITHOUT deep links until their country pages pass the QA
// gate (L1/L6) — the previous version linked every card and carried
// invented per-country "cities" counts; both are fixed here.

import Link from 'next/link';
import { useEffect, useState } from 'react';

const COUNTRIES = [
  { name: 'Pakistan',      flag: '🇵🇰', color: '#01411C', slug: 'pakistan', live: true },
  { name: 'India',         flag: '🇮🇳', color: '#FF9933', slug: 'india', live: false },
  { name: 'Saudi Arabia',  flag: '🇸🇦', color: '#006C35', slug: 'saudi-arabia', live: false },
  { name: 'UAE',           flag: '🇦🇪', color: '#00732F', slug: 'united-arab-emirates', live: false },
  { name: 'United States', flag: '🇺🇸', color: '#B22234', slug: 'united-states', live: false },
  { name: 'United Kingdom',flag: '🇬🇧', color: '#012169', slug: 'united-kingdom', live: false },
  { name: 'Turkey',        flag: '🇹🇷', color: '#E30A17', slug: 'turkey', live: false },
  { name: 'Japan',         flag: '🇯🇵', color: '#BC002D', slug: 'japan', live: false },
];

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
        <Link href="/countries" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors no-underline">
          View all countries →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        {visible.map((c) => {
          const cardInner = (
            <div className="relative rounded-2xl overflow-hidden border p-4 h-28 flex flex-col justify-between transition-all"
              style={{ background: `linear-gradient(135deg, ${c.color}25, #0a0f1e)`, borderColor: `${c.color}40` }}>
              <span className="text-3xl">{c.flag}</span>
              <div>
                <div className="text-white font-bold text-sm">{c.name}</div>
                <div className="text-white/40 text-xs mt-0.5">{c.live ? 'Country page is live' : 'Country page in preparation'}</div>
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
      <p className="text-white/40 text-sm">
        Pakistan's full country page is live today — provinces, cities, economy and culture. Every other country joins it as its page passes review →
      </p>
    </div>
  );
}
