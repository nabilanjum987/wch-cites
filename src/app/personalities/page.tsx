import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getAllPersonalities,
  personalityImagePosition,
  type PersonalityProfile,
} from '@/lib/personalities';

// ── Personalities hub (B1) ────────────────────────────────────────────────
// The index the family was missing: /personalities previously fell
// through to the [country] route and rendered a "Check back soon"
// shell. This static segment takes precedence over [country], and the
// page lists every canonical profile (the same 35 slugs the sitemap
// carries) as a real card: photo where a verified one exists, name,
// title and life dates, linking to the full profile. Server-rendered
// from the same data layer the detail pages use, so hub and profile
// can never disagree about who exists.
export const revalidate = 1800;

const BASE = 'https://worldcityhub.vercel.app';

export const metadata: Metadata = {
  title: 'Famous Personalities of Pakistan | WorldCityHub',
  description:
    'Poets, founders, scientists, artists and athletes who shaped Pakistan: Iqbal, Jinnah, Faiz, Edhi, Malala and more, each with a timeline, works and quotes.',
  alternates: { canonical: `${BASE}/personalities` },
};

function lifeDates(p: PersonalityProfile): string {
  const year = (d?: string): string | null => d?.match(/(\d{4})/)?.[1] ?? null;
  const b = year(p.birthDate);
  const d = year(p.deathDate);
  if (b && d) return `${b} – ${d}`;
  if (b) return `Born ${b}`;
  return '';
}

export default async function PersonalitiesIndex() {
  const profiles = await getAllPersonalities();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Famous Personalities of Pakistan',
    numberOfItems: profiles.length,
    itemListElement: profiles.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Person',
        name: p.name,
        jobTitle: p.title,
        url: `${BASE}/personalities/${p.slug}`,
        ...(p.imageUrl && !/^https?:\/\//i.test(p.imageUrl)
          ? { image: `${BASE}${p.imageUrl}` }
          : p.imageUrl
            ? { image: p.imageUrl }
            : {}),
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600"> / </span>
          <span className="text-gray-100 font-medium">Personalities</span>
        </nav>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Personalities</h1>

        <section className="mt-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Lives that shaped Pakistan</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Pakistan&apos;s story is carried by the people on this page: the poet who
            imagined the country, the barrister who founded it, the singers and
            writers who gave it a voice, the scientist who won its first Nobel
            Prize in physics, the humanitarian who built its largest volunteer
            ambulance network, and the schoolgirl from Swat who became the
            youngest Nobel Peace laureate in history.
          </p>
          <p className="mt-3 leading-relaxed text-gray-300">
            Every name below opens a full profile with a dated timeline, the
            achievements and works the person is remembered for, and their
            recorded words. Use the index to move between the cities that
            formed them: Lahore&apos;s poets and cricketers, Karachi&apos;s founders
            and artists, Islamabad&apos;s statesmen, and the figures of the
            smaller cities in between.
          </p>
        </section>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {profiles.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/personalities/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/30"
              >
                {p.imageUrl ? (
                  <span className="block aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-cover ${personalityImagePosition(p.slug)}`}
                    />
                  </span>
                ) : (
                  <span
                    className="flex aspect-[4/5] items-center justify-center"
                    style={{ backgroundColor: `${p.primaryColor}33` }}
                    aria-hidden="true"
                  >
                    <span className="text-5xl font-bold" style={{ color: p.primaryColor }}>
                      {p.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </span>
                  </span>
                )}
                <span className="block p-4">
                  <span className="block font-semibold leading-tight text-white group-hover:underline">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-gray-400">{p.title}</span>
                  {lifeDates(p) && (
                    <span className="mt-2 block text-xs text-gray-500">{lifeDates(p)}</span>
                  )}
                  <span className="mt-1 block text-xs text-gray-500">
                    {p.city}, {p.country}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">About these profiles</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Each profile is built from the person&apos;s own record: dated facts,
            documented works and well-documented words, with the setting where
            each quotation is reliably recorded. Photographs are stored on
            this site with their creator and licence credited under the
            portrait. Where no verified photograph exists, the card above
            carries the person&apos;s initials instead of an image, rather than
            a picture we cannot stand behind.
          </p>
        </section>
      </div>
    </main>
  );
}
