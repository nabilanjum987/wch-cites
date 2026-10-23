'use client';

// Continents panel (§7). Cards link to the countries hub filtered by
// continent (link map §7 — READY pattern: /countries?continent={slug}).
// The previous version showed invented "cities" counts per continent;
// those fabricated figures are removed.

import Link from 'next/link';

const CONTINENTS = [
  { name: 'Asia',          emoji: '🌏', color: '#FF6B35', desc: 'Largest continent', slug: 'asia' },
  { name: 'Africa',        emoji: '🌍', color: '#F7B731', desc: 'Richest biodiversity',    slug: 'africa' },
  { name: 'Europe',        emoji: '🌍', color: '#4ECDC4', desc: 'Art & culture hub',          slug: 'europe' },
  { name: 'North America', emoji: '🌎', color: '#45B7D1', desc: 'Arctic to Caribbean',      slug: 'north-america' },
  { name: 'South America', emoji: '🌎', color: '#96CEB4', desc: 'Amazon & the Andes',     slug: 'south-america' },
  { name: 'Oceania',       emoji: '🌏', color: '#FFEAA7', desc: 'Pacific & Australia',         slug: 'oceania' },
  { name: 'Antarctica',    emoji: '🧊', color: '#DFE6E9', desc: 'The frozen continent',            slug: 'antarctica' },
];

export default function ExploreByContinent() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CONTINENTS.map((c) => (
          <Link key={c.slug} href={`/countries?continent=${c.slug}`} className="no-underline group">
            <div className="relative rounded-2xl overflow-hidden border p-4 h-32 flex flex-col justify-between transition-all group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${c.color}20, var(--bg))`, borderColor: `${c.color}30` }}>
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <div className="t-text font-bold text-sm">{c.name}</div>
                <div className="sub-desc mt-0.5">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
