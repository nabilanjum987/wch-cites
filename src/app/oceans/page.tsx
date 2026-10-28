import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getHubOceans, getOceanLive, oceanHero, seaStateLabel } from '@/lib/oceans';

// Oceans hub (WP5 / marathon Q10; final28-P1) — server-rendered,
// mirroring the wonders hub treatment. The list is generated from
// data: every ocean in the hub list is a live, complete detail page
// (all 16 verified HTTP 200 with facts, FAQs, sources and gallery
// before linking). No ocean is listed without a link.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Oceans of the World: Live Waves, Weather & Facts',
  description:
    'Ocean guides with sourced facts (Wikidata & Wikipedia), licensed credited photos, and a live marine layer — waves and coastal weather today.',
  alternates: { canonical: `${BASE}/oceans` },
};

export default async function OceansIndex() {
  const oceans = await getHubOceans();
  const withLive = await Promise.all(
    oceans.map(async (o) => ({ ocean: o, live: await getOceanLive(o) })),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Oceans & Seas',
    description:
      'Ocean guides with sourced facts (Wikidata & Wikipedia), licensed credited photos, and a live marine layer — waves and coastal weather today.',
    url: `${BASE}/oceans`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: oceans.length,
      itemListElement: oceans.map((o, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: o.name,
        url: `${BASE}/oceans/${o.slug}`,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Oceans</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Oceans &amp; Seas</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
          An ocean guide with a pulse: the verified facts — size, depth, shores, the monsoon that rules it — checked
          against Wikidata and Wikipedia, plus a live marine layer no static page can offer: today&apos;s wave height
          and swell from the Open-Meteo Marine API and the weather on its coasts right now. Every photograph is openly
          licensed and credited. Guides publish one at a time, only when every figure can be traced to its source.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Published guides</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {withLive.map(({ ocean: o, live }) => {
            const hero = oceanHero(o);
            const area = o.facts.find((f) => f.label === 'Total area')?.value.split('(')[0].trim();
            return (
              <Link
                key={o.slug}
                href={`/oceans/${o.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-sky-400/40"
              >
                <div className="relative aspect-[16/9]">
                  <Image src={hero.fileUrl} alt={hero.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold group-hover:text-sky-300">{o.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{o.partOfLabel}{area ? ` · ${area}` : ''}</p>
                  {live && live.waveHeight !== null && (
                    <p className="mt-2 text-sm text-emerald-300">
                      Live now: waves {live.waveHeight.toFixed(2)} m · {seaStateLabel(live.waveHeight)}
                      {live.coast ? ` · ${o.coastalCity.name} ${Math.round(live.coast.tempNow)}°C` : ''}
                    </p>
                  )}
                  <p className="mt-3 text-sm font-semibold text-sky-300">Open the live guide →</p>
                  <p className="mt-2 text-[11px] text-gray-500">Hero photo: {hero.author} · {hero.licence}</p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
