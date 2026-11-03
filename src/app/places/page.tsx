import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { hubBreadcrumbJsonLd, hubWebPageJsonLd } from '@/lib/seo/hub';

// Places hub (hubs family fix, 3 Nov 2026): /places previously fell
// through to the [country] route and rendered a "Check back soon" shell
// for a non-country slug. This static segment takes precedence over
// [country] (the personalities hub pattern) and lists every published
// place as a real card. The six records below are copied from the place
// template data in src/app/places/[slug]/page.tsx (the places-b8
// registry records): name, city, tagline, the local card photo in
// public/images/places/cards/, and the photo credit recorded for that
// record, which is printed under the card photo. Hub and detail page
// therefore agree about which places exist and who made each photo.

const BASE = 'https://worldcityhub.vercel.app';

const TITLE = 'Famous Places in Lahore | WorldCityHub';
const DESCRIPTION =
  'Six famous places in Lahore with full guides: Badshahi Mosque, Lahore Fort, Shalimar Gardens, Data Darbar, the Walled City and Lahore Museum.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}/places` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE}/places`, siteName: 'WorldCityHub', type: 'website' },
};

interface PlaceCard {
  slug: string;
  name: string;
  city: string;
  description: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
}

const PLACES: PlaceCard[] = [
  {
    slug: 'badshahi-mosque',
    name: 'Badshahi Mosque',
    city: 'Lahore',
    description: "The Emperor's Mosque, one of the largest in the world",
    image: '/images/places/cards/badshahi-mosque.webp',
    imageAlt: 'Badshahi Mosque courtyard in Lahore, looking across the stone courtyard to the red sandstone entrance gate and a minaret',
    imageCredit: 'Zapata1000 · CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    slug: 'lahore-fort',
    name: 'Lahore Fort',
    city: 'Lahore',
    description: 'UNESCO World Heritage, 1000 years of Mughal history',
    image: '/images/places/cards/lahore-fort.webp',
    imageAlt: 'Alamgiri Gate of Lahore Fort in Lahore, its white twin-towered gateway seen through a scalloped arch',
    imageCredit: 'Rohaan Bhatti · CC BY-SA 3.0, via Wikimedia Commons',
  },
  {
    slug: 'shalimar-gardens',
    name: 'Shalimar Gardens',
    city: 'Lahore',
    description: 'A Mughal paradise garden of terraces, marble pavilions and 410 fountains',
    image: '/images/places/cards/shalimar-gardens.webp',
    imageAlt: 'Shalimar Gardens in Lahore, a red sandstone pavilion beside a fountain pool with garden beds in front',
    imageCredit: 'M Umair Astro · CC BY-SA 4.0, via Wikimedia Commons',
  },
  {
    slug: 'data-darbar',
    name: 'Data Darbar',
    city: 'Lahore',
    description: "South Asia's largest Sufi shrine, the heart of Lahore's spiritual life",
    image: '/images/places/cards/data-darbar.webp',
    imageAlt: 'Data Darbar shrine in Lahore, visitors crossing the marble courtyard toward the green-domed tomb',
    imageCredit: 'Guilhem Vellut · CC BY 2.0, via Wikimedia Commons',
  },
  {
    slug: 'walled-city',
    name: 'Walled City',
    city: 'Lahore',
    description: "Old Lahore, thirteen gates, a thousand lanes, and the city's living heart",
    image: '/images/places/cards/walled-city.webp',
    imageAlt: 'Elevated view over the Walled City of Lahore, a street and rooftops below a fortification tower and a blue-shuttered building',
    imageCredit: 'Guilhem Vellut · CC BY 2.0, via Wikimedia Commons',
  },
  {
    slug: 'lahore-museum',
    name: 'Lahore Museum',
    city: 'Lahore',
    description: "Pakistan's largest museum, 60,000 objects from Gandhara to the Pakistan Movement",
    image: '/images/places/cards/lahore-museum.webp',
    imageAlt: 'Lahore Museum in Lahore, its red brick domed facade behind the entrance gate on The Mall',
    imageCredit: 'Muhammad Ashar · CC BY-SA 3.0, via Wikimedia Commons',
  },
];

export default function PlacesIndex() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Famous Places in Lahore: Published guides',
    numberOfItems: PLACES.length,
    itemListElement: PLACES.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: p.name,
        url: `${BASE}/places/${p.slug}`,
        image: `${BASE}${p.image}`,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <JsonLd data={hubWebPageJsonLd('Famous Places in Lahore', '/places', DESCRIPTION)} />
      <JsonLd data={hubBreadcrumbJsonLd('Places', '/places')} />
      <JsonLd data={itemListJsonLd} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600"> / </span>
          <span className="text-gray-100 font-medium">Places</span>
        </nav>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Famous Places in Lahore</h1>

        <section className="mt-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Published place guides</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Every place below has a full guide on WorldCityHub: its history, what makes it
            significant, opening hours and entry information where a source supports them, and the
            facts a visitor needs, each traced to a named source on the guide itself. All six
            published places stand in Lahore, within a few kilometres of each other in and around
            the old city, so most visitors see several of them in a single day.
          </p>
          <p className="mt-3 leading-relaxed text-gray-300">
            Two of the six, Lahore Fort and Shalimar Gardens, share one UNESCO World Heritage
            listing. Badshahi Mosque faces the fort across Hazuri Bagh, Data Darbar is the largest
            Sufi shrine in South Asia, the Walled City is the historic district that holds them
            together, and Lahore Museum on The Mall carries the region&apos;s story indoors, from
            Gandhara sculpture to the Pakistan Movement.
          </p>
        </section>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/places/${p.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/30"
              >
                <span className="block aspect-[16/10] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="block p-5">
                  <span className="block text-xl font-bold leading-tight text-white group-hover:underline">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-sm text-gray-400">{p.city}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-gray-300">{p.description}</span>
                  <span className="mt-3 block text-[11px] leading-relaxed text-gray-500">
                    Photo: {p.imageCredit}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">About these guides</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            A place is listed here only once its guide passes the same gate as every other page on
            this site: real, sourced content, a licensed local photograph with its creator credited,
            and no figure the sources do not support. The city guide for{' '}
            <Link href="/pakistan/punjab/lahore" className="text-cyan-300 underline">Lahore</Link>{' '}
            brings these places together with the city&apos;s weather, prayer times, rates, news and
            events.
          </p>
        </section>
      </div>
    </main>
  );
}
