import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { UPCOMING_OCEANS, getPublishedOceans, getOceanLive, oceanHero, seaStateLabel } from '@/lib/oceans';

// Oceans hub (WP5 / marathon Q10) — server-rendered, mirroring the
// wonders hub treatment. Only PUBLISHED oceans are linked; the rest
// appear as content (name + note, no link) until their own golden
// build passes QA.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Oceans of the World: Live Waves, Weather & Facts',
  description:
    'Ocean guides with sourced facts (Wikidata & Wikipedia), licensed credited photos, and a live marine layer — waves and coastal weather today.',
  alternates: { canonical: `${BASE}/oceans` },
};

export default async function OceansIndex() {
  const oceans = await getPublishedOceans();
  const withLive = await Promise.all(
    oceans.map(async (o) => ({ ocean: o, live: await getOceanLive(o) })),
  );

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
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
                  <p className="mt-1 text-sm text-gray-400">Northwestern {o.partOfName} · 3,862,000 km²</p>
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

        <h2 className="mt-12 text-2xl font-bold">The world&apos;s oceans — in preparation</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
          Each receives the same golden treatment — sourced facts, licensed photography and a live marine layer —
          before its guide opens. Until then they are listed here as content only, deliberately without links:
          WorldCityHub never links to an unfinished page.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING_OCEANS.map((u) => (
            <li key={u.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-gray-100">{u.name}</p>
              <p className="mt-0.5 text-sm text-gray-400">{u.note}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">Guide in preparation</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
