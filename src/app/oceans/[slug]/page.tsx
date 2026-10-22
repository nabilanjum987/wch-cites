import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PUBLISHED_OCEANS,
  getOcean,
  getOceanLive,
  oceanHero,
  weatherLabel,
  compass,
  seaStateLabel,
  monsoonSeason,
} from '@/lib/oceans';
import { formatLocalTime, formatLocalDate } from '@/lib/wonders';
import OceanClock from './OceanClock';
import OceanMap from './OceanMap';

// Golden Ocean template (WP5 / marathon Q10) — SERVER component on
// the golden wonder pattern. Facts: Wikidata Q58705 + Wikipedia,
// every claim sourced on the page. Live layer: Open-Meteo Marine API
// at the sea's representative point (16°N, 64°E) + Karachi coastal
// weather. The old client shell's invented conditions ratings, port
// throughputs and marine-life lists are GONE — nothing renders here
// without a source.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export function generateStaticParams() {
  return PUBLISHED_OCEANS.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ocean = await getOcean(slug);
  if (!ocean) return { title: 'Ocean not found' };
  const hero = oceanHero(ocean);
  const canonical = `${BASE}/oceans/${ocean.slug}`;
  return {
    title: ocean.seoTitle,
    description: ocean.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: ocean.seoTitle,
      description: ocean.seoDescription,
      url: canonical,
      type: 'article',
      images: [{ url: hero.fileUrl, width: hero.width, height: hero.height, alt: hero.alt }],
    },
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function OceanPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ocean = await getOcean(slug);
  if (!ocean) notFound();

  const live = await getOceanLive(ocean);
  const hero = oceanHero(ocean);
  const gallery = ocean.media.filter((m) => m.role !== 'hero');
  const season = monsoonSeason(ocean.marineTimezone, ocean.slug);
  const coast = ocean.coastalCity;
  const oceanWord = ocean.name.includes('Ocean') ? 'ocean' : 'sea';
  const clockTimezone = coast?.timezone ?? ocean.marineTimezone;
  const localTime = formatLocalTime(clockTimezone);
  const localDate = formatLocalDate(clockTimezone);
  const pointLabel = `${Math.abs(ocean.lat)}° ${ocean.lat >= 0 ? 'N' : 'S'}, ${Math.abs(ocean.lng)}° ${ocean.lng >= 0 ? 'E' : 'W'}`;
  const areaChip = ocean.facts.find((f) => f.label === 'Total area')?.value.split('(')[0].trim();
  const depthChip = ocean.facts.find((f) => f.label === 'Maximum depth')?.value;
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: ocean.name,
        description: ocean.seoDescription,
        url: `${BASE}/oceans/${ocean.slug}`,
        geo: { '@type': 'GeoCoordinates', latitude: ocean.lat, longitude: ocean.lng },
        image: { '@type': 'ImageObject', url: hero.fileUrl, width: hero.width, height: hero.height, caption: hero.attribution },
        sameAs: [`https://www.wikidata.org/wiki/${ocean.wikidataQid}`],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Oceans', item: `${BASE}/oceans` },
          { '@type': 'ListItem', position: 3, name: ocean.name, item: `${BASE}/oceans/${ocean.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: ocean.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#0a0e1a] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        {/* 1 — Breadcrumb + H1 + chips */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/oceans" className="hover:text-white">Oceans</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{ocean.name}</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{ocean.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-sky-500/15 px-3.5 py-1.5 text-xs font-semibold text-sky-300">
            {ocean.partOfLabel}
          </span>
          {(areaChip || depthChip) && (
            <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">
              {[areaChip, depthChip ? `max depth ${depthChip}` : null].filter(Boolean).join(' · ')}
            </span>
          )}
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {coast ? `${coast.name} time` : 'Ocean point time (UTC)'}: <OceanClock timezone={clockTimezone} initial={localTime} /> · {localDate}
          </span>
          {live && live.waveHeight !== null && (
            <span className="rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
              {live.waveHeight !== null ? `Waves now ${live.waveHeight.toFixed(2)} m · ${seaStateLabel(live.waveHeight)}` : 'Wave feed unavailable at this point'}
            </span>
          )}
        </div>

        {/* 2 — Hero */}
        <figure className="mt-6">
          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <Image
              src={hero.fileUrl}
              alt={hero.alt}
              width={hero.width}
              height={hero.height}
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className="h-auto w-full object-cover"
            />
          </div>
          <figcaption className="mt-2 text-xs text-gray-400">
            {hero.attribution} ·{' '}
            <a href={hero.pageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
              View on Wikimedia Commons
            </a>
          </figcaption>
        </figure>

        {/* 3 — QUICK ANSWER: the sea today */}
        {live && (
          <div className="mt-8 rounded-2xl border border-sky-400/25 bg-sky-400/5 p-5">
            <h2 className="text-lg font-bold text-sky-200">The sea today — the quick answer</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Waves (open sea, {pointLabel})</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {live.waveHeight !== null ? `${live.waveHeight.toFixed(2)} m · ${seaStateLabel(live.waveHeight)}` : 'Feed unavailable'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {live.waveDirection !== null && live.wavePeriod !== null
                    ? `Swell from ${compass(live.waveDirection)} (${Math.round(live.waveDirection)}°) · period ${live.wavePeriod.toFixed(1)} s`
                    : ''}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">{coast ? `${coast.name} coast weather` : 'Coastal weather'}</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {live.coast ? `${Math.round(live.coast.tempNow)}°C · ${weatherLabel(live.coast.weatherCode)}` : 'Feed unavailable'}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {live.coast ? `Wind ${Math.round(live.coast.windKmh)} km/h · today ${Math.round(live.coast.tempMin)}–${Math.round(live.coast.tempMax)}°C` : ''}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Coastal sun today</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {live.coast ? `${live.coast.sunrise} – ${live.coast.sunset}` : '—'}
                </p>
                <p className="mt-1 text-xs text-gray-400">Sunrise – sunset {coast ? `at ${coast.name} (local)` : '— no published coastal city yet'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Season frame</p>
                <p className="mt-1 text-sm font-semibold text-white">{season.name}</p>
                <p className="mt-1 text-xs text-gray-400">Live data: Open-Meteo Marine, sampled {live.sampledAt.replace('T', ' ')} ({coast ? `${coast.name} time` : 'UTC'})</p>
              </div>
            </div>
          </div>
        )}

        {/* 4 — Key facts */}
        <Section title="Key facts">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ocean.facts.map((f) => (
              <div key={f.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <dt className="text-[11px] uppercase tracking-wide text-gray-400">{f.label}</dt>
                <dd className="mt-1 text-sm font-semibold leading-snug text-white">{f.value}</dd>
                <dd className="mt-1 text-[11px] text-gray-500">Source: {f.source}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* 5 — THERE TODAY live dashboard */}
        {live && (
          <Section title="There today — live conditions">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-gray-400">Open sea — waves through today</p>
                <p className="mt-1 text-4xl font-bold">
                  {live.waveHeight !== null ? `${live.waveHeight.toFixed(2)} m` : '—'}
                  {live.waveHeight !== null && (
                    <span className="ml-2 text-base font-medium text-gray-300">{seaStateLabel(live.waveHeight)}</span>
                  )}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-300">
                  {live.waveDirection !== null && <li>Swell direction: from {compass(live.waveDirection)} ({Math.round(live.waveDirection)}°)</li>}
                  {live.wavePeriod !== null && <li>Wave period: {live.wavePeriod.toFixed(1)} seconds</li>}
                  <li className="text-xs text-gray-500">
                    Open-Meteo Marine API at the sea&apos;s representative point (Wikidata: 16° N, 64° E), sampled {live.sampledAt.replace('T', ' ')}.
                  </li>
                </ul>
                {live.hourlyWaves.length > 1 && (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Wave height, rest of today (m)</p>
                    <div className="mt-2 flex h-20 items-end gap-1">
                      {live.hourlyWaves.map((h) => {
                        const heights = live.hourlyWaves.map((x) => x.height);
                        const max = Math.max(...heights, 0.5);
                        const pct = Math.max(8, (h.height / max) * 100);
                        return (
                          <div key={h.time} className="flex flex-1 flex-col items-center gap-1" title={`${h.time.slice(11, 16)} — ${h.height.toFixed(2)} m`}>
                            <span className="text-[10px] text-gray-400">{h.height.toFixed(1)}</span>
                            <div className="w-full rounded-t bg-sky-400/70" style={{ height: `${pct}%` }} />
                            <span className="text-[10px] text-gray-500">{h.time.slice(11, 13)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {coast ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">On the coast — {coast.name}, {coast.countryName}</p>
                  {live.coast ? (
                    <>
                      <p className="mt-1 text-4xl font-bold">
                        {Math.round(live.coast.tempNow)}°C{' '}
                        <span className="text-base font-medium text-gray-300">{weatherLabel(live.coast.weatherCode)}</span>
                      </p>
                      <ul className="mt-3 space-y-1 text-sm text-gray-300">
                        <li>Feels like {Math.round(live.coast.feelsLike)}°C · humidity {Math.round(live.coast.humidity)}%</li>
                        <li>Wind {Math.round(live.coast.windKmh)} km/h</li>
                        <li>Sunrise {live.coast.sunrise} · sunset {live.coast.sunset} (local)</li>
                      </ul>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">Coastal weather feed unavailable right now.</p>
                  )}
                  <Link
                    href={coast.path}
                    className="mt-4 inline-block rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-sky-400"
                  >
                    Open the full {coast.name} guide →
                  </Link>
                  <p className="mt-2 text-xs text-gray-500">Weather, prayer times, rates, news and events for the sea&apos;s great northern port city.</p>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-gray-400">On the coast</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">
                    WorldCityHub has no published coastal city on this ocean yet, so this page carries the
                    open-ocean live panel only — no city is dressed up as a coast it does not stand on.
                    Coastal coverage joins when that city&apos;s own guide passes the QA gate.
                  </p>
                </div>
              )}
              <div className="rounded-xl border border-sky-400/25 bg-sky-400/5 p-5">
                <p className="text-sm font-semibold text-sky-200">🌊 {season.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-200">{season.text}</p>
                <p className="mt-3 text-xs text-gray-500">
                  The season frame is climatology from the Wikipedia article; the figures beside it are today&apos;s live measurements. The two are never mixed.
                </p>
              </div>
            </div>
          </Section>
        )}

        {/* 6 — The story */}
        <Section title={`The story of this ${ocean.name.includes('Ocean') ? 'ocean' : 'sea'}`}>
          <div className="max-w-3xl space-y-4 leading-relaxed text-gray-300">
            {ocean.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-sm text-gray-400">
              Read more:{' '}
              <a href={`https://en.wikipedia.org/wiki/${ocean.wikiTitle}`} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">
                Wikipedia — {ocean.name}
              </a>{' '}
              ·{' '}
              <a href={`https://www.wikidata.org/wiki/${ocean.wikidataQid}`} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">
                Wikidata — {ocean.wikidataQid}
              </a>
            </p>
          </div>
        </Section>

        {/* 7 — Geography */}
        <Section title="Geography — shores & connections">
          <div className="max-w-3xl space-y-4 leading-relaxed text-gray-300">
            {ocean.geography.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        {/* 8 — The monsoon sea */}
        <Section title={ocean.seasonTitle}>
          <div className="max-w-3xl space-y-4 leading-relaxed text-gray-300">
            {ocean.monsoon.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        {/* 9 — SEE IT LIVE */}
        <Section title="See it live">
          <OceanMap lat={ocean.lat} lng={ocean.lng} name={ocean.name} googleKey={googleKey} />
          <p className="mt-2 text-sm text-gray-400">
            The marker is the {ocean.name.includes('Ocean') ? 'ocean' : 'sea'}&apos;s representative point from Wikidata ({pointLabel}) — the same point the live wave
            panel measures.
          </p>
        </Section>

        {/* 10 — From space & shore (gallery) */}
        <Section title="From space & from the shore">
          <div className="grid gap-4 sm:grid-cols-3">
            {gallery.map((m) => (
              <figure key={m.fileTitle} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <div className="relative aspect-[16/10]">
                  <Image src={m.fileUrl} alt={m.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" loading="lazy" />
                </div>
                <figcaption className="p-3 text-[11px] leading-snug text-gray-400">
                  {m.alt}. Photo: {m.author} ·{' '}
                  <a href={m.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {m.licence}
                  </a>{' '}
                  ·{' '}
                  <a href={m.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    Commons file
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>

        {/* 11 — Coastal city (published coastal city only; never a fake shore) */}
        <Section title="On its shore — our city guide">
          {coast ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">{coast.name}, {coast.countryName}</h3>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-gray-300">
                A full WorldCityHub city guide on this {oceanWord}&apos;s shore: live weather, prayer times, gold and
                currency rates, news, sports and events, all from real sources.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={coast.path} className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-sky-400">
                  {coast.name} guide →
                </Link>
                <Link href={`${coast.path}/weather`} className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                  {coast.name} weather →
                </Link>
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Other shore cities join this block as their own guides publish; they are never linked before they are real.
              </p>
            </div>
          ) : (
            <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
              WorldCityHub has no published coastal city on this {oceanWord} yet — city guides join this block as they
              publish, and nothing is linked before it is real.
            </p>
          )}
        </Section>

        {/* 12 — FAQs + sources & credits + related */}
        <Section title="Frequently asked questions">
          <div className="space-y-3">
            {ocean.faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="Sources & credits">
          <ul className="space-y-2 text-sm text-gray-300">
            {ocean.sources.map((s) => (
              <li key={s.claim}>
                <span className="text-gray-400">{s.claim} — </span>
                <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">
                  {s.sourceName}
                </a>{' '}
                <span className="text-xs text-gray-500">(checked {s.checkedAt})</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold text-white">Photo credits</h3>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            {ocean.media.map((m) => (
              <li key={m.fileTitle}>
                {m.attribution} ·{' '}
                <a href={m.pageUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  file page
                </a>{' '}
                ·{' '}
                <a href={m.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  licence
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="More oceans">
          <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
            The {ocean.name} is the first WorldCityHub ocean guide built to the golden standard — sourced facts,
            licensed photography, and a live marine layer. The Pacific, Atlantic, Indian, Southern and Arctic oceans
            follow the same standard, one verified ocean at a time; they are listed on the oceans hub as content until
            their guides are real.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/oceans" className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-sky-400">
              All oceans
            </Link>
            <Link href="/wonders" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Wonders of the world
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
