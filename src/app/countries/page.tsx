import Link from 'next/link';
import type { Metadata } from 'next';
import { CAPITALS } from '@/lib/capitals-table';
import CapitalsTable, { type CapitalRowWithTemp } from '@/components/countries/CapitalsTable';

// Current temperature for every capital in ONE Open-Meteo
// multi-location request (free, keyless), cached 30 minutes. A failed
// request yields nulls — the table then shows a dash, never a guess.
async function fetchCapitalTemps(): Promise<(number | null)[]> {
  try {
    const lats = CAPITALS.map((c) => c.lat).join(',');
    const lngs = CAPITALS.map((c) => c.lng).join(',');
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m`,
      { next: { revalidate: 1800 } },
    );
    if (!res.ok) return CAPITALS.map(() => null);
    const json = await res.json();
    const arr = Array.isArray(json) ? json : [json];
    return CAPITALS.map((_, i) => {
      const t = arr[i]?.current?.temperature_2m;
      return typeof t === 'number' ? t : null;
    });
  } catch {
    return CAPITALS.map(() => null);
  }
}

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
    { name: 'India', slug: 'india', flag: '🇮🇳', live: false },
  ],
  'north-america': [
    { name: 'United States', slug: 'united-states', flag: '🇺🇸', live: false },
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
    // A5: the hub overview carries the "countries of the world"
    // keyword in its title (37 chars) and description (127 chars).
    // Continent-detail metadata below is unchanged.
    return {
      title: 'Countries of the World | WorldCityHub',
      description:
        'Countries of the world — every capital with live time and temperature, and full country guides as they go live on WorldCityHub.',
      alternates: { canonical: 'https://worldcityhub.vercel.app/countries' },
    };
  }
  return {
    title: `Countries in ${meta.name} | WorldCityHub`,
    description: `Explore countries and cities in ${meta.name} on WorldCityHub. ${meta.desc}.`,
    alternates: { canonical: `https://worldcityhub.vercel.app/countries?continent=${meta.slug}` },
  };
}

export default async function CountriesPage({
  searchParams,
}: {
  searchParams: Promise<{ continent?: string }>;
}) {
  const { continent } = await searchParams;
  const activeContinent = CONTINENTS.find((c) => c.slug === continent);
  const capitalTemps = !activeContinent ? await fetchCapitalTemps() : [];
  const capitalRows: CapitalRowWithTemp[] = CAPITALS.map((c, i) => ({ ...c, tempC: capitalTemps[i] ?? null }));

  // ── Overview mode: no continent selected, show all 7 ──────────────────────
  if (!activeContinent) {
    return (
      <main className="min-h-screen bg-[#0a0e1a] text-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wide mb-3">
            Explore the World
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Countries of the World</h1>
          <p className="text-white/60 text-lg mb-10 max-w-2xl">
            Pick a continent to see which countries and cities are live on WorldCityHub right now.
          </p>
          <p className="text-white/60 leading-relaxed max-w-2xl mb-6">
            WorldCityHub is building a living guide to every country on earth — its capital and cities, its
            weather and prayer times, its money, its headlines and its notable people — one country at a
            time, and only ever with real data. A country marked &ldquo;Full guide live&rdquo; below has a
            complete country page behind it; the rest are being built to the same standard before they open.
          </p>
          <p className="text-white/60 leading-relaxed max-w-2xl mb-10">
            That standard is the point of this site. A page is published only when it renders completely from
            live sources — no placeholder text dressed up as information, and no estimated figure presented
            as a measurement. Where a value cannot be verified, the page shows less rather than inventing
            more. The <Link href="/sources" className="text-cyan-300 underline">data sources</Link> page names
            where every figure comes from, and the <Link href="/improve" className="text-cyan-300 underline">improvement form</Link> reaches
            the people who maintain these pages if you spot something wrong or missing.
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
                      {(COUNTRIES_BY_CONTINENT[c.slug] ?? []).filter((x) => x.live).length > 0
                        ? `${(COUNTRIES_BY_CONTINENT[c.slug] ?? []).filter((x) => x.live).length} full country guide live`
                        : 'Country guides in preparation'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* ── WORLD CAPITALS TABLE (link map §9A — the full table lives
              here in the /countries hub, not on a separate page) ── */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-3">World Capitals</h2>
            <p className="text-white/60 max-w-2xl mb-6">
              Every sovereign state&apos;s capital — its local time right now and its current
              temperature, updated live. Full country guides are live for Pakistan today;
              the remaining country pages are being completed one by one, and each row
              links to that country&apos;s page.
            </p>
            <p className="text-white/60 max-w-2xl mb-6 leading-relaxed">
              The local time in each capital is calculated from its IANA time zone, and every temperature is
              read in a single Open-Meteo request covering all capitals at once — the same Open-Meteo service
              behind the live panels on this site&apos;s homepage. When a temperature cannot be read, the table shows a
              dash rather than a guess. Start with the guide that is complete today:{' '}
              <Link href="/pakistan" className="text-cyan-300 underline">Pakistan</Link>, with full city guides
              for <Link href="/pakistan/punjab/lahore" className="text-cyan-300 underline">Lahore</Link>,{' '}
              <Link href="/pakistan/sindh/karachi" className="text-cyan-300 underline">Karachi</Link> and{' '}
              <Link href="/pakistan/islamabad-capital-territory/islamabad" className="text-cyan-300 underline">Islamabad</Link>.
            </p>
            <CapitalsTable rows={capitalRows} />
            <p className="text-white/35 text-xs mt-4">
              Capital data: GeoNames. Temperatures: Open-Meteo, refreshed every 30 minutes.
            </p>
          </section>
          {/* A5: secondary hub keywords. The "most beautiful" answer
              deliberately names NO ranking — there is no official one,
              and inventing a top list would be fabrication. The
              population answer states only the UN-based fact, with no
              population figure attached. */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-3">Most Beautiful Countries in the World</h2>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              There is no official ranking of the most beautiful countries in the world, so this page
              names none: travel lists disagree because beauty is judged by different things, from
              mountains and coastlines to historic cities and wildlife. The honest way to explore is
              country by country, starting with the full guides and capital entries on this page, where
              each guide covers the same ground.
            </p>
          </section>
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-3">Largest Country in the World by Population</h2>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              India is the largest country in the world by population, according to United Nations
              estimates, having moved ahead of China in 2023. The two countries together hold well over
              a quarter of all people on earth, which is why their cities, languages and economies
              dominate world rankings. This page&apos;s capitals table lists New Delhi as India&apos;s
              capital, and a full India guide will follow when its country page goes live.
            </p>
            <h3 className="text-2xl font-bold mt-8 mb-3">How many countries are there in the world?</h3>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              The United Nations has 193 member states, and two observer states — the Holy See and
              Palestine — which is why 195 is the figure quoted for the number of countries in the
              world. Counts differ because some places are recognised by some states and not others.
              The capitals table on this page lists 198 entries, including Vatican City, Kosovo and
              Taiwan, which appear in the source data as entries.
            </p>
          </section>
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-3">How a WorldCityHub country guide is built</h2>
            <p className="text-white/60 max-w-2xl mb-6 leading-relaxed">
              Every full guide follows the same template, proven first on Pakistan: an overview of the
              country, its provinces and its cities — and for each city the same family of pages covering
              weather, prayer times, rates, news, economy, sports and events, plus sections on the
              city&apos;s notable personalities and famous places. The figures come from the public sources named on each page — the World Bank
              for economy indicators, Open-Meteo and OpenWeatherMap for weather, Aladhan for prayer times,
              gold-api for gold and silver spot (CoinGecko PAX Gold as fallback) and CoinGecko for crypto — never from a writer&apos;s imagination.
            </p>
            <p className="text-white/60 max-w-2xl leading-relaxed">
              Coverage grows in verified batches rather than by flooding the index with thin pages, so a
              country that is not live yet still appears in the capitals table above with its live time and
              weather. If your country is missing, you can{' '}
              <Link href="/improve" className="text-cyan-300 underline">tell us what to build first</Link>.
            </p>
          </section>
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
                {c.live && (
                  <span className="ml-auto rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    Full guide live
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-6">
          <p className="text-white/70">
            {countries.length > 0
              ? `More ${activeContinent.name} countries are being added regularly as we build out full city and country profiles. Every live guide follows the same verified template — real data only, with its sources named on the page.`
              : `No ${activeContinent.name} countries are live yet — we're adding countries and capitals one at a time. Check back soon.`}
          </p>
        </div>
      </div>
    </main>
  );
}
