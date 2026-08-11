import Link from 'next/link';
import type { Metadata } from 'next';

interface ContinentMeta {
  name: string;
  emoji: string;
  color: string;
  desc: string;
  slug: string;
}

interface CountryEntry {
  name: string;
  slug: string;
  flag: string;
  live: boolean;
}

const CONTINENTS: ContinentMeta[] = [
  { name: 'Asia', emoji: '🌏', color: '#FF6B35', desc: 'Largest & most populous continent', slug: 'asia' },
  { name: 'Africa', emoji: '🌍', color: '#F7B731', desc: '54 countries, richest biodiversity', slug: 'africa' },
  { name: 'Europe', emoji: '🌍', color: '#4ECDC4', desc: 'History, art and culture hub', slug: 'europe' },
  { name: 'North America', emoji: '🌎', color: '#45B7D1', desc: 'From Arctic to Caribbean', slug: 'north-america' },
  { name: 'South America', emoji: '🌎', color: '#96CEB4', desc: 'Amazon, Andes and ancient wonders', slug: 'south-america' },
  { name: 'Oceania', emoji: '🌏', color: '#FFEAA7', desc: 'Pacific islands & Australia', slug: 'oceania' },
  { name: 'Antarctica', emoji: '🧊', color: '#DFE6E9', desc: "World's southernmost continent", slug: 'antarctica' },
];

// Countries that already have a real, fully working page at /[country].
// Update this list as more capitals/countries are built out.
const COUNTRIES_BY_CONTINENT: Record<string, CountryEntry[]> = {
  asia: [
    { name: 'Pakistan', slug: 'pakistan', flag: '🇵🇰', live: true },
    { name: 'India', slug: 'india', flag: '🇮🇳', live: true },
  ],
  'north-america': [
    { name: 'United States', slug: 'united-states', flag: '🇺🇸', live: true },
  ],
  africa: [],
  europe: [],
  'south-america': [],
  oceania: [],
  antarctica: [],
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ continent?: string }>;
}): Promise<Metadata> {
  const { continent } = await searchParams;
  const meta = CONTINENTS.find((c) => c.slug === continent);
  if (!meta) {
    return {
      title: 'Explore Countries by Continent | WorldCityHub',
      description: 'Browse countries and cities across all seven continents on WorldCityHub.',
    };
  }
  return {
    title: `Countries in ${meta.name} | WorldCityHub`,
    description: `Explore countries and cities in ${meta.name} on WorldCityHub. ${meta.desc}.`,
  };
}

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<{ continent?: string }>;
}) {
  const { continent } = await searchParams;
  const activeContinent = CONTINENTS.find((c) => c.slug === continent);

  // ── Overview mode: no continent selected, show all 7 ──────────────────────
  if (!activeContinent) {
    return (
      <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">
            Explore the World
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Countries by Continent</h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl">
            Pick a continent to see which countries and cities are live on WorldCityHub right now.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CONTINENTS.map((c) => (
              <Link key={c.slug} href={`/countries?continent=${c.slug}`} className="no-underline group">
                <div
                  className="relative rounded-2xl overflow-hidden border p-5 h-36 flex flex-col justify-between transition-all group-hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${c.color}20, #0a0f1e)`, borderColor: `${c.color}30` }}
                >
                  <span className="text-3xl">{c.emoji}</span>
                  <div>
                    <div className="text-white font-bold">{c.name}</div>
                    <div className="text-white/40 text-xs mt-1">{c.desc}</div>
                    <div className="text-white/30 text-xs mt-2">
                      {(COUNTRIES_BY_CONTINENT[c.slug] ?? []).length} countries live
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // ── Detail mode: a specific continent ──────────────────────────────────────
  const countries = COUNTRIES_BY_CONTINENT[activeContinent.slug] ?? [];

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <Link href="/countries" className="text-white/40 hover:text-white/70 text-sm mb-6 inline-block">
          ← All continents
        </Link>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{activeContinent.emoji}</span>
          <h1 className="text-4xl md:text-5xl font-bold">{activeContinent.name}</h1>
        </div>
        <p className="text-white/60 text-lg mb-10 max-w-xl">{activeContinent.desc}</p>

        {countries.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="no-underline flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="font-semibold">{c.name}</span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-white/70">
            {countries.length > 0
              ? `More ${activeContinent.name} countries are being added regularly as we build out full city and country profiles.`
              : `No ${activeContinent.name} countries are live yet — we're adding countries and capitals one at a time. Check back soon.`}
          </p>
        </div>
      </div>
    </main>
  );
}
