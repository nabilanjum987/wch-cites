import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { UPCOMING_WONDERS, getPublishedWonders, getWonderLive, heroMedia, weatherLabel } from '@/lib/wonders';

// Wonders hub (WP4 / marathon Q9) — server-rendered. Only PUBLISHED
// wonders are linked; the rest of the New7Wonders appear as content
// (name + place, no link) until their own golden build passes QA.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Wonders of the World: Live Guides, Weather & Facts',
  description:
    'Wonder guides with facts verified against Wikidata & UNESCO, licensed credited photos, and a live layer — weather, sunrise and golden hour.',
  alternates: { canonical: `${BASE}/wonders` },
};

export default async function WondersIndex() {
  const wonders = await getPublishedWonders();
  const withLive = await Promise.all(
    wonders.map(async (w) => ({ wonder: w, live: await getWonderLive(w.lat, w.lng, w.timezone) })),
  );

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">Wonders</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Wonders of the World</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
          A wonder guide the way it should be in 2026: the same verified facts an encyclopedia gives you — checked
          against Wikidata, UNESCO and official sources — plus the layer a static page can never have: the weather at
          the site right now, today&apos;s sunrise and golden hour, what to wear, and whether the gates are open.
          Every photograph is openly licensed and credited. Guides are published one at a time, only when every fact
          on the page can be traced to its source.
        </p>

        <h2 className="mt-10 text-2xl font-bold">Published guides</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {withLive.map(({ wonder: w, live }) => {
            const hero = heroMedia(w);
            return (
              <Link
                key={w.slug}
                href={`/wonders/${w.slug}`}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-amber-400/40"
              >
                <div className="relative aspect-[16/9]">
                  <Image src={hero.fileUrl} alt={hero.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold group-hover:text-amber-300">{w.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {w.cityName}, {w.countryName}
                    {w.unescoId ? ` · UNESCO World Heritage Site ${w.unescoId} (since ${w.unescoYear})` : ''}
                  </p>
                  {live && (
                    <p className="mt-2 text-sm text-emerald-300">
                      Live now: {Math.round(live.tempNow)}°C · {weatherLabel(live.weatherCode)} · sunrise {live.today.sunrise} ·
                      sunset {live.today.sunset}
                    </p>
                  )}
                  <p className="mt-3 text-sm font-semibold text-amber-300">Open the live guide →</p>
                  <p className="mt-2 text-[11px] text-gray-500">Hero photo: {hero.author} · {hero.licence}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <h2 className="mt-12 text-2xl font-bold">The New7Wonders — in preparation</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">
          Each of these gets the same golden treatment — sourced facts, licensed photography, verified visitor
          information and a live layer — before its guide opens. Until then they are listed here as content only,
          deliberately without links: WorldCityHub never links to an unfinished page.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {UPCOMING_WONDERS.map((u) => (
            <li key={u.name} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-gray-100">{u.name}</p>
              <p className="mt-0.5 text-sm text-gray-400">{u.place}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-500">Guide in preparation</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 text-2xl font-bold">How every guide is built</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: 'Facts with receipts',
              d: 'Identity and dimensions from Wikidata, heritage status from UNESCO, visitor prices and hours from the official site — each claim stored with its source and the date it was checked.',
            },
            {
              t: 'Photos with licences',
              d: 'Photography comes from Wikimedia Commons. A photo without a free licence and a named author never reaches the page, and every credit travels with the image.',
            },
            {
              t: 'A live layer',
              d: 'Weather, sunrise, sunset, golden hour and a what-to-wear verdict from Open-Meteo at the wonder\u2019s exact coordinates — refreshed through the day, and honestly absent when the feed is down.',
            },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">{c.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
