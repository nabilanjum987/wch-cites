import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PUBLISHED_WONDERS,
  getWonder,
  getWonderLive,
  heroMedia,
  wonderMedia,
  weatherLabel,
  whatToWear,
  openStatus,
  formatLocalTime,
  formatLocalDate,
  haversineKm,
} from '@/lib/wonders';
import WonderClock from './WonderClock';
import MapEmbed from './MapEmbed';

// Golden Wonder template (WP4 / marathon Q9) — SERVER component.
// Data: src/lib/wonders.ts (DB-first after migration 0001, baked
// verified dataset until then) + Open-Meteo live layer, revalidated
// every 30 minutes. No mock values anywhere; a block whose source is
// unavailable simply does not render.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export function generateStaticParams() {
  return PUBLISHED_WONDERS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const wonder = await getWonder(slug);
  if (!wonder) return { title: 'Wonder not found' };
  const hero = heroMedia(wonder);
  const canonical = `${BASE}/wonders/${wonder.slug}`;
  return {
    title: wonder.seoTitle,
    description: wonder.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: wonder.seoTitle,
      description: wonder.seoDescription,
      url: canonical,
      type: 'article',
      images: [{ url: hero.fileUrl, width: hero.width, height: hero.height, alt: hero.alt }],
    },
  };
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="mt-12">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function WonderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wonder = await getWonder(slug);
  if (!wonder) notFound();

  const live = await getWonderLive(wonder.lat, wonder.lng, wonder.timezone);
  const hero = heroMedia(wonder);
  const gallery = wonder.media.filter((m) => m.role === 'gallery' || m.role === 'detail');
  const status = live ? openStatus(live, wonder.timezone) : { open: null as boolean | null, text: '' };
  const localTime = formatLocalTime(wonder.timezone);
  const localDate = formatLocalDate(wonder.timezone);
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TouristAttraction',
        name: wonder.name,
        description: wonder.seoDescription,
        url: `${BASE}/wonders/${wonder.slug}`,
        geo: { '@type': 'GeoCoordinates', latitude: wonder.lat, longitude: wonder.lng },
        address: {
          '@type': 'PostalAddress',
          addressLocality: wonder.cityName,
          addressRegion: wonder.regionName,
          addressCountry: wonder.countryName,
        },
        image: { '@type': 'ImageObject', url: hero.fileUrl, width: hero.width, height: hero.height, caption: hero.attribution },
        sameAs: [`https://www.wikidata.org/wiki/${wonder.wikidataQid}`, wonder.officialUrl],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Wonders', item: `${BASE}/wonders` },
          { '@type': 'ListItem', position: 3, name: wonder.name, item: `${BASE}/wonders/${wonder.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: wonder.faqs.map((f) => ({
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
          <Link href="/wonders" className="hover:text-white">Wonders</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{wonder.name}</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{wonder.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300">{wonder.category}</span>
          {wonder.unescoId && (
            <span className="rounded-full bg-sky-500/15 px-3.5 py-1.5 text-xs font-semibold text-sky-300">
              UNESCO World Heritage Site {wonder.unescoId} · since {wonder.unescoYear}
            </span>
          )}
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {wonder.cityName}, {wonder.countryName}
          </span>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            Local time: <WonderClock timezone={wonder.timezone} initial={localTime} /> · {localDate}
          </span>
          {live && (
            <span className="rounded-full bg-emerald-500/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
              {Math.round(live.tempNow)}°C · {weatherLabel(live.weatherCode)} at the site now
            </span>
          )}
        </div>

        {/* 2 — Hero gallery */}
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
        {gallery.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((m) => (
              <figure key={m.fileTitle}>
                <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10">
                  <Image src={m.fileUrl} alt={m.alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover" loading="lazy" />
                </div>
                <figcaption className="mt-1 text-[11px] leading-snug text-gray-500">
                  Photo: {m.author} ·{' '}
                  <a href={m.licenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                    {m.licence}
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* 3 — QUICK ANSWER */}
        {live && (
          <div className="mt-8 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
            <h2 className="text-lg font-bold text-amber-200">Visiting today — the quick answer</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Status</p>
                <p className="mt-1 text-sm font-semibold text-white">{status.open === null ? wonder.visitor.closedDays : status.text}</p>
                <p className="mt-1 text-xs text-gray-400">{wonder.visitor.hoursText}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Weather at the site</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {Math.round(live.tempNow)}°C · {weatherLabel(live.weatherCode)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Feels {Math.round(live.feelsLike)}°C · today {Math.round(live.today.tempMin)}–{Math.round(live.today.tempMax)}°C
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Best light today</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {live.goldenMorning.start}–{live.goldenMorning.end} · {live.goldenEvening.start}–{live.goldenEvening.end}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Sunrise {live.today.sunrise} · sunset {live.today.sunset} (local)
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">Entry (official)</p>
                <p className="mt-1 text-sm font-semibold text-white">
                  {wonder.visitor.fees
                    ? wonder.visitor.fees
                        .slice(0, 3)
                        .map((f) => `${f.visitor.includes('Foreign') ? 'Foreign' : f.visitor.includes('SAARC') ? 'SAARC/BIMSTEC' : 'Indian'} ${f.amount}`)
                        .join(' · ')
                    : 'See visitor guide'}
                </p>
                <p className="mt-1 text-xs text-gray-400">Verified {wonder.visitor.lastVerified} · {wonder.visitor.sourceName}</p>
              </div>
            </div>
          </div>
        )}

        {/* 4 — Key facts */}
        <Section title="Key facts">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            {wonder.facts.map((f) => (
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
          <Section title={`There today — live at the ${wonder.name}`}>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-gray-400">Right now</p>
                <p className="mt-1 text-4xl font-bold">
                  {Math.round(live.tempNow)}°C <span className="text-base font-medium text-gray-300">{weatherLabel(live.weatherCode)}</span>
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-300">
                  <li>Feels like {Math.round(live.feelsLike)}°C</li>
                  <li>Humidity {Math.round(live.humidity)}%</li>
                  <li>Wind {Math.round(live.windKmh)} km/h</li>
                  <li>UV now {live.uvNow.toFixed(1)} · peak today {live.today.uvMax.toFixed(1)}</li>
                  <li className="text-xs text-gray-500">Open-Meteo, sampled {live.sampledAt.replace('T', ' ')} local</li>
                </ul>
                {live.hourly.length > 1 && (
                  <div className="mt-4">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Temperature, next hours</p>
                    <div className="mt-2 flex h-20 items-end gap-1">
                      {live.hourly.map((h) => {
                        const temps = live.hourly.map((x) => x.temp);
                        const min = Math.min(...temps);
                        const max = Math.max(...temps);
                        const pct = max > min ? 25 + ((h.temp - min) / (max - min)) * 75 : 50;
                        return (
                          <div key={h.time} className="flex flex-1 flex-col items-center gap-1" title={`${h.time.slice(11, 16)} — ${Math.round(h.temp)}°C`}>
                            <span className="text-[10px] text-gray-400">{Math.round(h.temp)}°</span>
                            <div className="w-full rounded-t bg-amber-400/70" style={{ height: `${pct}%` }} />
                            <span className="text-[10px] text-gray-500">{h.time.slice(11, 13)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-gray-400">Sun path today</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-200">
                  <li>🌅 Sunrise — <strong>{live.today.sunrise}</strong></li>
                  <li>☀️ Golden hour (morning) — <strong>{live.goldenMorning.start}–{live.goldenMorning.end}</strong></li>
                  <li>🌇 Golden hour (evening) — <strong>{live.goldenEvening.start}–{live.goldenEvening.end}</strong></li>
                  <li>🌆 Sunset — <strong>{live.today.sunset}</strong></li>
                </ul>
                <p className="mt-3 text-xs text-gray-500">All times local to the site ({wonder.timezone.replace('_', ' ')}).</p>
                <div className="mt-4 border-t border-white/10 pt-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Next days</p>
                  {live.nextDays.map((d) => (
                    <p key={d.date} className="mt-1 text-sm text-gray-300">
                      {d.date}: {Math.round(d.tempMin)}–{Math.round(d.tempMax)}°C · sunrise {d.sunrise} · sunset {d.sunset}
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-5">
                <p className="text-sm font-semibold text-emerald-200">👕 What to wear today</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-200">
                  {whatToWear(live).map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-gray-500">Generated from today&apos;s live temperature, rain, wind and UV at the site — updated with the weather, never written in advance.</p>
              </div>
            </div>
          </Section>
        )}

        {/* 6 — The Story */}
        <Section title="The story">
          <div className="max-w-3xl space-y-4 leading-relaxed text-gray-300">
            {wonder.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p className="text-sm text-gray-400">
              Read more:{' '}
              <a href="https://en.wikipedia.org/wiki/Taj_Mahal" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">
                Wikipedia — {wonder.name}
              </a>{' '}
              ·{' '}
              <a href={wonder.officialUrl} target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">
                Official site
              </a>
            </p>
          </div>
        </Section>

        {/* 7 — Architecture */}
        <Section title="Architecture">
          <div className="max-w-3xl space-y-4 leading-relaxed text-gray-300">
            {wonder.architecture.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Dimensions &amp; materials</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-300">
                {wonder.architecture.dimensions.map((d) => (
                  <li key={d.label} className="flex justify-between gap-4 border-b border-white/5 pb-2">
                    <span className="text-gray-400">{d.label}</span>
                    <span className="text-right font-medium text-white">{d.value}</span>
                  </li>
                ))}
                <li className="pt-1 text-gray-400">
                  Materials: <span className="text-gray-200">{wonder.architecture.materials.join(' · ')}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">The genius of it</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-gray-300">
                {wonder.architecture.geniusPoints.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* 8 — Development timeline */}
        <Section title="Development timeline">
          <ol className="relative space-y-8 border-l border-white/10 pl-6">
            {wonder.timeline.map((t) => {
              const img = wonderMedia(wonder, t.mediaFileTitle);
              return (
                <li key={`${t.year}-${t.title}`} className="relative">
                  <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="sm:w-40 sm:shrink-0">
                      <p className="text-xl font-bold text-amber-300">{t.year}</p>
                      <p className="font-semibold text-white">{t.title}</p>
                    </div>
                    <p className="max-w-xl text-sm leading-relaxed text-gray-300">{t.text}</p>
                    {img && (
                      <figure className="sm:ml-auto sm:w-56 sm:shrink-0">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                          <Image src={img.fileUrl} alt={img.alt} fill sizes="224px" className="object-cover" loading="lazy" />
                        </div>
                        <figcaption className="mt-1 text-[11px] text-gray-500">
                          {img.author} · {img.licence}
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* 9 — Visitor guide */}
        <Section title="Visitor guide">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Hours</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{wonder.visitor.hoursText}</p>
              <p className="mt-1 text-sm leading-relaxed text-gray-300">{wonder.visitor.closedDays}</p>
              {live && (
                <p className="mt-2 text-sm text-amber-200">
                  Today: sunrise {live.today.sunrise} → the gates open 30 minutes before it; the monument closes 30 minutes
                  before the {live.today.sunset} sunset.
                </p>
              )}
              <h3 className="mt-5 font-semibold text-white">Getting in</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{wonder.visitor.gatesText}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h3 className="font-semibold text-white">Entry fees (official)</h3>
              {wonder.visitor.fees ? (
                <>
                  <table className="mt-3 w-full text-sm">
                    <tbody>
                      {wonder.visitor.fees.map((f) => (
                        <tr key={f.visitor} className="border-b border-white/5">
                          <td className="py-2 pr-3 text-gray-300">{f.visitor}</td>
                          <td className="py-2 text-right font-semibold text-white">{f.amount}</td>
                          <td className="py-2 pl-3 text-right text-xs text-gray-400">{f.note ?? ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {wonder.visitor.feesNote && <p className="mt-3 text-xs leading-relaxed text-gray-400">{wonder.visitor.feesNote}</p>}
                </>
              ) : (
                <p className="mt-2 text-sm text-gray-300">Current fees are published on the official site (link below).</p>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Source: {wonder.visitor.sourceName} · last verified {wonder.visitor.lastVerified}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={wonder.visitor.sourceUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-400">
                  Official hours &amp; fees
                </a>
                {wonder.ticketUrl && (
                  <a href={wonder.ticketUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                    Official e-tickets (ASI)
                  </a>
                )}
              </div>
            </div>
          </div>
        </Section>

        {/* 10 — SEE IT LIVE */}
        <Section title="See it live">
          <MapEmbed lat={wonder.lat} lng={wonder.lng} name={wonder.name} googleKey={googleKey} />
        </Section>

        {/* 11 — Photography */}
        <Section title="Photography — best spots & today's windows">
          {live && (
            <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
              Today&apos;s best windows at the site: <strong className="text-white">{live.goldenMorning.start}–{live.goldenMorning.end}</strong> after
              sunrise and <strong className="text-white">{live.goldenEvening.start}–{live.goldenEvening.end}</strong> before sunset. The marble reads
              pinkish in the first light, white at midday and golden towards evening — plan the shot around the light, not the clock alone.
            </p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {wonder.photoSpots.map((s) => {
              const img = wonderMedia(wonder, s.mediaFileTitle);
              return (
                <div key={s.name} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  {img && (
                    <div className="relative aspect-[16/9]">
                      <Image src={img.fileUrl} alt={img.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-white">{s.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-300">{s.description}</p>
                    {img && <p className="mt-2 text-[11px] text-gray-500">Photo: {img.author} · {img.licence}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* 12 — Myth vs Fact */}
        {wonder.myths.length > 0 && (
          <Section title="Myth vs Fact">
            <div className="grid gap-4 sm:grid-cols-2">
              {wonder.myths.map((m) => (
                <article key={m.claim} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-semibold leading-snug text-white">“{m.claim}”</p>
                  <p
                    className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                      m.verdict === 'TRUE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : m.verdict === 'FALSE'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    Verdict: {m.verdict}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{m.evidence}</p>
                  <p className="mt-3 text-xs text-gray-500">
                    Source: {m.sourceName} ·{' '}
                    <a href={m.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-300">
                      read it
                    </a>
                  </p>
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* 13 — Nearby */}
        <Section title="Nearby — same heritage zone">
          <div className="grid gap-4 sm:grid-cols-2">
            {wonder.nearby.map((n) => (
              <div key={n.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold text-white">{n.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{n.relation}</p>
                <p className="mt-2 text-sm text-gray-400">
                  {haversineKm(wonder.lat, wonder.lng, n.lat, n.lng).toFixed(1)} km from the {wonder.name} (straight line, from
                  Wikidata coordinates)
                </p>
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-amber-300 underline">
                  {n.urlLabel} →
                </a>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-400">
            Our full {wonder.cityName} city guide is in preparation — it will link from here the day it publishes.
          </p>
        </Section>

        {/* 14 — FAQs + sources & credits + related */}
        <Section title="Frequently asked questions">
          <div className="space-y-3">
            {wonder.faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section title="Sources & credits">
          <ul className="space-y-2 text-sm text-gray-300">
            {wonder.sources.map((s) => (
              <li key={s.claim}>
                <span className="text-gray-400">{s.claim} — </span>
                <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-amber-300 underline">
                  {s.sourceName}
                </a>{' '}
                <span className="text-xs text-gray-500">(checked {s.checkedAt})</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 font-semibold text-white">Photo credits</h3>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-gray-400">
            {wonder.media.map((m) => (
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

        <Section title="More wonders">
          <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
            The {wonder.name} is the first WorldCityHub wonder guide built to the golden standard — every fact sourced,
            every photo licensed and credited, and a live layer (weather, sun, golden hour) that no static encyclopedia
            page can offer. The other New7Wonders — the Great Wall of China, Petra, Christ the Redeemer, Machu Picchu,
            Chichen Itza and the Colosseum — are being built to the same standard, one verified wonder at a time.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/wonders" className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition hover:bg-amber-400">
              All wonders
            </Link>
            <Link href="/news" className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
              Follow world news on WorldCityHub
            </Link>
          </div>
        </Section>
      </div>
    </main>
  );
}
