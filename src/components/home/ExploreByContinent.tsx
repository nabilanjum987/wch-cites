'use client';
import Link from 'next/link';

const CONTINENTS = [
  { name: 'Asia',          emoji: '🌏', cities: '4,847', color: '#FF6B35', desc: 'Largest & most populous continent',  slug: 'asia'          },
  { name: 'Africa',        emoji: '🌍', cities: '2,214', color: '#F7B731', desc: '54 countries, richest biodiversity',  slug: 'africa'        },
  { name: 'Europe',        emoji: '🌍', cities: '1,842', color: '#4ECDC4', desc: 'History, art and culture hub',        slug: 'europe'        },
  { name: 'North America', emoji: '🌎', cities: '1,103', color: '#45B7D1', desc: 'From Arctic to Caribbean',            slug: 'north-america' },
  { name: 'South America', emoji: '🌎', cities: '892',   color: '#96CEB4', desc: 'Amazon, Andes and ancient wonders',   slug: 'south-america' },
  { name: 'Oceania',       emoji: '🌏', cities: '284',   color: '#FFEAA7', desc: 'Pacific islands & Australia',         slug: 'oceania'       },
  { name: 'Antarctica',    emoji: '🧊', cities: '6',     color: '#DFE6E9', desc: 'World\'s southernmost continent',     slug: 'antarctica'    },
];

export default function ExploreByContinent() {
  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CONTINENTS.map((c) => (
          <Link key={c.slug} href={`/countries?continent=${c.slug}`} className="no-underline group">
            <div className="relative rounded-2xl overflow-hidden border p-4 h-32 flex flex-col justify-between transition-all group-hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${c.color}20, #0a0f1e)`, borderColor: `${c.color}30` }}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${c.color}20`, color: c.color }}>
                  {c.cities} cities
                </span>
              </div>
              <div>
                <div className="text-white font-bold text-sm">{c.name}</div>
                <div className="text-white/40 text-xs mt-0.5 line-clamp-1">{c.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
