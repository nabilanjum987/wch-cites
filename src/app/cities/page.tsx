import type { Metadata } from 'next';
import Link from 'next/link';

// A5 — Cities hub (new page; no /cities route existed before).
// Lists ONLY the cities with full, live guides — the same three the
// homepage "Cities of the World — Live" panel links (Lahore, Karachi,
// Islamabad). No other city is linked: a city appears here only when
// its guide renders real content. Multan and Peshawar are named as in
// preparation, deliberately WITHOUT links, mirroring the wonders hub's
// treatment of unpublished guides. This page is NOT added to the
// sitemap in this PR — sitemap completion belongs to Part C.
// "Largest city in the world" is NOT built here: no verified,
// definition-consistent largest-city list exists in the repo/data
// (the GeoNames slim file is mixed-vintage and draft-only, and
// city-proper vs metro area is undefined there), so per the brief it
// is skipped rather than faked.

const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Cities of the World | WorldCityHub',
  description:
    'Cities of the world with full live guides on WorldCityHub: Lahore, Karachi and Islamabad — weather, prayer times, rates, news and more.',
  alternates: { canonical: `${BASE}/cities` },
};

const CITIES = [
  {
    name: 'Lahore',
    province: 'Punjab, Pakistan',
    href: '/pakistan/punjab/lahore',
    blurb:
      'The cultural capital of Punjab — Badshahi Mosque, Lahore Fort, its food streets and its festivals.',
  },
  {
    name: 'Karachi',
    province: 'Sindh, Pakistan',
    href: '/pakistan/sindh/karachi',
    blurb:
      'Pakistan\u2019s port city on the Arabian Sea — Mazar-e-Quaid, Clifton Beach and its markets.',
  },
  {
    name: 'Islamabad',
    province: 'Capital Territory, Pakistan',
    href: '/pakistan/islamabad-capital-territory/islamabad',
    blurb:
      'The planned capital at the foot of the Margalla Hills — Faisal Mosque, Daman-e-Koh and its green sectors.',
  },
] as const;

const SUBPAGES = [
  { label: 'Weather', slug: 'weather' },
  { label: 'Prayer times', slug: 'prayer-times' },
  { label: 'Rates', slug: 'rates' },
  { label: 'News', slug: 'news' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Economy', slug: 'economy' },
  { label: 'Events', slug: 'events' },
] as const;

export default function CitiesIndex() {
  // ItemList JSON-LD built from the SAME array the cards render, so
  // the schema can never drift from the hub's real linked entries
  // (the wonders-hub P11 pattern).
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Cities of the World — Published guides',
    numberOfItems: CITIES.length,
    itemListElement: CITIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `${BASE}${c.href}`,
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Cities</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Cities of the World</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
          Every published city on WorldCityHub carries the same live guide: weather, prayer times, gold
          and currency rates, local news, sports, economy and events — the same figures, updated
          through the day. A city is listed here only when its guide renders real content; nothing
          here links to a placeholder.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Published city guides</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CITIES.map((c) => (
            <div key={c.href} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Link href={c.href} className="text-xl font-bold hover:text-cyan-300">
                {c.name}
              </Link>
              <p className="mt-1 text-sm text-gray-400">{c.province}</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">{c.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUBPAGES.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`${c.href}/${s.slug}`}
                      className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 hover:border-cyan-400/40 hover:text-cyan-300"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-2xl font-bold">Which cities have full guides on WorldCityHub?</h3>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
          Three cities have full guides on WorldCityHub today: Lahore in Punjab, Karachi in Sindh, and
          Islamabad in the Capital Territory. Each guide carries live weather, prayer times, gold and
          currency rates, news, sports, economy and events pages. More cities are added only when
          their guides are complete, so every city listed here renders real content rather than a
          placeholder.
        </p>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-400">
          More Pakistani cities, including Multan and Peshawar, are in preparation and will be listed
          here once their guides are complete. Until then they are named here only, deliberately
          without links: WorldCityHub never links to an unfinished page.
        </p>
      </div>
    </main>
  );
}
