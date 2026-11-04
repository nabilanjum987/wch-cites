import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PUBLISHED_CONTINENTS, getContinent, type Continent, type ContinentMedia } from '@/lib/continents';
import { formatLocalTime } from '@/lib/wonders';
import { DirectAnswer } from '@/components/aeo/AnswerLayer';
import ContinentClocks from './ContinentClocks';

// Golden Continent template (4 Nov 2026), SERVER component on the golden
// wonder/ocean pattern. Everything on the page renders from ONE record
// in src/lib/continents.ts: replicating to another continent means
// adding a record, never touching this file. Facts carry their sources
// on the page; the live layer is the local time in the continent's
// great capitals, computed from IANA time zones and ticked client-side.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export function generateStaticParams() {
  return PUBLISHED_CONTINENTS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const continent = getContinent(slug);
  if (!continent) return { title: 'Continent not found' };
  const hero = continent.media[0];
  const canonical = `${BASE}/continents/${continent.slug}`;
  return {
    title: continent.seoTitle,
    description: continent.seoDescription,
    alternates: { canonical },
    openGraph: {
      title: continent.seoTitle,
      description: continent.seoDescription,
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

function PhotoFigure({ media, priority = false, aspect = false }: { media: ContinentMedia; priority?: boolean; aspect?: boolean }) {
  return (
    <figure>
      <div className={`relative overflow-hidden rounded-2xl border border-white/10 ${aspect ? 'aspect-[3/2]' : ''}`}>
        <Image
          src={media.fileUrl}
          alt={media.alt}
          width={media.width}
          height={media.height}
          priority={priority}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className={aspect ? 'absolute inset-0 h-full w-full object-cover' : 'h-auto w-full object-cover'}
        />
      </div>
      <figcaption className="mt-2 text-xs text-gray-400">
        {media.attribution} ·{' '}
        <a href={media.pageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
          View on Wikimedia Commons
        </a>
      </figcaption>
    </figure>
  );
}

function shareWidth(share: string): number {
  const n = parseFloat(share);
  if (Number.isNaN(n)) return 1;
  return Math.max(1, n);
}

export default async function ContinentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const continent: Continent | null = getContinent(slug);
  if (!continent) notFound();

  const hero = continent.media[0];
  const canonical = `${BASE}/continents/${continent.slug}`;
  const capitalClocks = continent.capitals.map((c) => ({ ...c, initial: formatLocalTime(c.timezone) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Place',
        name: continent.name,
        description: continent.seoDescription,
        url: canonical,
        sameAs: [
          `https://www.wikidata.org/wiki/${continent.wikidataQid}`,
          `https://en.wikipedia.org/wiki/${continent.wikiTitle}`,
        ],
        image: { '@type': 'ImageObject', url: hero.fileUrl, width: hero.width, height: hero.height, caption: hero.attribution },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Continents', item: `${BASE}/continents` },
          { '@type': 'ListItem', position: 3, name: continent.name, item: canonical },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: continent.faqs.map((f) => ({
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
        {/* Breadcrumb + H1 + chips */}
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/continents" className="hover:text-white">Continents</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-200">{continent.name}</span>
        </nav>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{continent.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold text-amber-300">{continent.tagline}</span>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">
            {continent.facts.find((f) => f.label === 'Countries')?.value}
          </span>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-gray-200">Live capital times on this page</span>
        </div>

        {/* Direct answer, directly under the heading */}
        <div className="mt-6">
          <DirectAnswer answer={continent.directAnswer} source={continent.directAnswerSource} />
        </div>

        {/* Hero photo, credit below (never on the photo) */}
        <div className="mt-6">
          <PhotoFigure media={hero} priority />
        </div>

        {/* Overview */}
        <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-300">
          {continent.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Key facts */}
        <Section title={`${continent.name} in figures`}>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <tbody>
                {continent.facts.map((f, i) => (
                  <tr key={f.label} className={i % 2 ? 'bg-white/[0.03]' : ''}>
                    <th scope="row" className="w-44 px-4 py-3 align-top font-semibold text-white">{f.label}</th>
                    <td className="px-4 py-3 text-gray-200">
                      {f.value}
                      <span className="mt-0.5 block text-xs text-gray-500">Source: {f.source}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Live layer: capital times + time zone prose */}
        <Section title={`Live now in ${continent.name}'s capitals`}>
          <ContinentClocks capitals={capitalClocks} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-300">
            {continent.timezoneBody.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        {/* Regions */}
        <Section title={`The regions of ${continent.name}`}>
          <div className="grid gap-4 md:grid-cols-2">
            {continent.regions.map((r) => (
              <article key={r.name} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                {r.photo && (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image src={r.photo.fileUrl} alt={r.photo.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white">{r.name}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-amber-300/90">{r.scope}</p>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-300">
                    {r.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  {r.photo && <p className="mt-3 text-[11px] leading-snug text-gray-500">Photo: {r.photo.attribution}</p>}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Largest countries */}
        <Section title={`Largest countries in ${continent.name}`}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-lg font-bold text-white">By land area</h3>
              <ol className="mt-3 space-y-3">
                {continent.largestCountriesByArea.map((c, i) => (
                  <li key={c.name} className="flex gap-3">
                    <span className="text-sm font-bold text-amber-300">{i + 1}.</span>
                    <div>
                      <span className="font-semibold text-white">{c.name}</span>{' '}
                      <span className="text-gray-200">{c.value}</span>
                      <span className="block text-sm text-gray-400">{c.note}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-lg font-bold text-white">By population (2024)</h3>
              <ol className="mt-3 space-y-3">
                {continent.largestCountriesByPopulation.map((c, i) => (
                  <li key={c.name} className="flex gap-3">
                    <span className="text-sm font-bold text-amber-300">{i + 1}.</span>
                    <div>
                      <span className="font-semibold text-white">{c.name}</span>{' '}
                      <span className="text-gray-200">{c.value}</span>
                      <span className="block text-sm text-gray-400">{c.note}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-gray-500">Source: United Nations, World Population Prospects 2024.</p>
            </div>
          </div>
        </Section>

        {/* Largest cities */}
        <Section title={`Largest cities in ${continent.name}`}>
          {continent.cityPhoto && <PhotoFigure media={continent.cityPhoto} />}
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {continent.largestCities.map((c, i) => (
              <li key={c.name} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm font-bold text-amber-300">{i + 1}. </span>
                <span className="font-semibold text-white">{c.name}</span>
                <span className="text-gray-400">, {c.country}</span>
                <span className="block text-sm text-gray-300">{c.value} people</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-gray-500">Source: {continent.citySource}</p>
        </Section>

        {/* Extremes */}
        <Section title={`Highest, lowest and longest in ${continent.name}`}>
          <div className="space-y-10">
            {continent.extremes.map((x) => (
              <article key={x.label}>
                <span className="rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-300">{x.label}</span>
                <h3 className="mt-3 text-xl font-bold text-white">{x.title}</h3>
                {x.photo && (
                  <div className="mt-4">
                    <PhotoFigure media={x.photo} />
                  </div>
                )}
                <div className="mt-4 space-y-3 text-base leading-relaxed text-gray-300">
                  {x.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Faiths by population share */}
        <Section title={`Faiths of ${continent.name}`}>
          <p className="text-base leading-relaxed text-gray-300">{continent.faithsIntro}</p>
          <div className="mt-5 space-y-4">
            {continent.faiths.map((f) => (
              <div key={f.name}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-white">{f.name}</h3>
                  <span className="text-sm font-bold text-amber-300">{f.share}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-amber-400/70" style={{ width: `${shareWidth(f.share)}%` }} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{f.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-gray-500">Source: {continent.faithsSource}</p>
        </Section>

        {/* Explore: links only to live pages (Link Law) */}
        <Section title={`Explore ${continent.name} on WorldCityHub`}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {continent.explore.map((l) => (
              <Link key={l.href} href={l.href} className="group rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 no-underline transition hover:border-amber-400/40">
                <span className="font-semibold text-white group-hover:text-amber-300">{l.label}</span>
                <span className="mt-0.5 block text-sm text-gray-400">{l.note}</span>
              </Link>
            ))}
          </div>
        </Section>

        {/* AEO: visible questions; the FAQPage schema above uses this same array */}
        <Section title={`Questions about ${continent.name}`}>
          <div className="space-y-6">
            {continent.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold text-white">{f.q}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-gray-300">{f.a}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Sources & credits */}
        <Section title="Sources & credits">
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-400">
            {continent.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
            <li>
              Read more: <a href={`https://en.wikipedia.org/wiki/${continent.wikiTitle}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">{continent.name} on Wikipedia</a>
            </li>
          </ul>
          <h3 className="mt-6 text-base font-semibold text-white">Photo credits</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-400">
            {continent.media.map((m) => (
              <li key={m.fileUrl}>
                {m.attribution} ·{' '}
                <a href={m.pageUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-200">
                  Wikimedia Commons
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </main>
  );
}
