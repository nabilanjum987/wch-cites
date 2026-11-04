import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CONTINENT_CARDS, CONTINENT_CARD_CREDITS, PUBLISHED_CONTINENTS } from '@/lib/continents';

// Continents hub (4 Nov 2026). Lists all seven continents; ONLY the
// published ones (PUBLISHED_CONTINENTS in src/lib/continents.ts) are
// links. The rest render as plain cards marked "Guide in preparation"
// (Link Law: never link to a shell). When a continent's record is
// completed and published, its card becomes a link automatically.
const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Continents of the World | Asia Guide Live | WorldCityHub',
  description:
    'The seven continents on WorldCityHub. The full Asia guide is live: regions, countries, cities, records and live capital times.',
  alternates: { canonical: `${BASE}/continents` },
  openGraph: {
    title: 'Continents of the World | Asia Guide Live | WorldCityHub',
    description:
      'The seven continents on WorldCityHub. The full Asia guide is live: regions, countries, cities, records and live capital times.',
    url: `${BASE}/continents`,
    type: 'website',
  },
};

export default function ContinentsHub() {
  const liveSlugs = new Set(PUBLISHED_CONTINENTS.map((c) => c.slug));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Continents of the World',
        url: `${BASE}/continents`,
        description: metadata.description,
      },
      {
        '@type': 'ItemList',
        itemListElement: PUBLISHED_CONTINENTS.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          url: `${BASE}/continents/${c.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Continents', item: `${BASE}/continents` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Continents</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Continents of the World</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300">
          Seven continents, one standard: real content under every heading, every figure with its source, and live
          local times. The full guide to Asia, the largest continent, is live today. The other continent guides open
          one by one as each passes the same review, and each card below becomes a link the day its guide is ready.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTINENT_CARDS.map((c) => {
            const live = liveSlugs.has(c.slug);
            const inner = (
              <>
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image src={c.img} alt={c.imgAlt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg font-bold text-white">{c.name}</span>
                    {live ? (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">Guide live</span>
                    ) : (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-gray-300">Guide in preparation</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{c.desc}</p>
                </div>
              </>
            );
            return live ? (
              <Link
                key={c.slug}
                href={`/continents/${c.slug}`}
                className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] no-underline transition hover:border-amber-400/40"
              >
                {inner}
              </Link>
            ) : (
              <div key={c.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {inner}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-gray-500">{CONTINENT_CARD_CREDITS}</p>
      </div>
    </main>
  );
}
