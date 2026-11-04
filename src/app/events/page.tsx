import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { hubBreadcrumbJsonLd, hubWebPageJsonLd } from '@/lib/seo/hub';
import { getApprovedEvents, WCH_EVENT_CATEGORIES, type WchEvent } from '@/lib/events';

// Events hub (hubs family fix, 3 Nov 2026): /events previously fell
// through to the [country] route and rendered a "Check back soon" shell
// for a non-country slug. This static segment takes precedence over
// [country] (the personalities hub pattern) and renders the site's real
// published events set through the same data layer the city events
// pages use: getApprovedEvents in src/lib/events.ts, which returns only
// approved, verified, upcoming rows from the events table (the two rows
// published by migration 0016, Sindhi Cultural Day in Karachi and the
// Pakistan Day Parade in Islamabad, when the database is reachable and
// their dates are still ahead). When that set is empty, the hub says so
// plainly and still serves its real content: the published city events
// pages and the submission page. Nothing is listed here that the data
// layer did not return.

const BASE = 'https://worldcityhub.vercel.app';

const TITLE = 'Events in Pakistan | WorldCityHub';
const DESCRIPTION =
  'Upcoming approved events on WorldCityHub: verified listings for Karachi, Islamabad and Lahore, plus city events pages and free event submission.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}/events` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE}/events`, siteName: 'WorldCityHub', type: 'website' },
};

export const revalidate = 300;

const CITY_EVENTS_PAGES = [
  {
    name: 'Lahore',
    href: '/pakistan/punjab/lahore/events',
    blurb: 'Events in Lahore, the cultural capital of Punjab, plus national dates that apply across Pakistan.',
  },
  {
    name: 'Karachi',
    href: '/pakistan/sindh/karachi/events',
    blurb: 'Events in Karachi, including Sindhi Cultural Day on the first Sunday of December, and national dates.',
  },
  {
    name: 'Islamabad',
    href: '/pakistan/islamabad-capital-territory/islamabad/events',
    blurb: 'Events in the capital, including the Pakistan Day Parade at Shakarparian on 23 March, and national dates.',
  },
] as const;

const clean = (s: string) => s.replace(/ — /g, ', ').replace(/—/g, '-');

function cityLabel(ev: WchEvent): string {
  if (!ev.city_slug) return 'Nationwide';
  return ev.city_slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function dateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  });
}

export default async function EventsIndex() {
  const events = await getApprovedEvents({ limit: 100 });

  const itemListJsonLd =
    events.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Upcoming approved events in Pakistan',
          numberOfItems: events.length,
          itemListElement: events.map((ev, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Event',
              name: clean(ev.title),
              startDate: ev.starts_at,
              ...(ev.ends_at ? { endDate: ev.ends_at } : {}),
              location: { '@type': 'Place', name: clean(ev.venue) },
              description: clean(ev.description),
              url: `${BASE}/events`,
            },
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <JsonLd data={hubWebPageJsonLd('Events in Pakistan', '/events', DESCRIPTION)} />
      <JsonLd data={hubBreadcrumbJsonLd('Events', '/events')} />
      {itemListJsonLd && <JsonLd data={itemListJsonLd} />}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600"> / </span>
          <span className="text-gray-100 font-medium">Events</span>
        </nav>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Events in Pakistan</h1>

        <section className="mt-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Upcoming approved events</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            This page lists the events WorldCityHub has approved and verified for the weeks ahead,
            drawn from the same events table that powers each city&apos;s events page. A listing
            appears only when a person has checked it against its source; submissions that have not
            passed that check are never shown, and a date is never guessed.
          </p>
        </section>

        {events.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {events.map((ev) => (
              <li key={ev.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-cyan-300">{dateLabel(ev.starts_at)}</p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-white">{clean(ev.title)}</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {clean(ev.venue)} · {cityLabel(ev)}
                  {' · '}
                  {WCH_EVENT_CATEGORIES.find((c) => c.key === ev.category)?.label ?? ev.category}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{clean(ev.description)}</p>
                {ev.source_url && (
                  <p className="mt-3 text-xs text-gray-500">
                    Source:{' '}
                    <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">
                      {clean(ev.source_name)}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="leading-relaxed text-gray-300">
              No upcoming approved events are published right now. Verified listings appear here as
              soon as they pass review; the city events pages below also carry the national dates
              that apply in each city.
            </p>
          </div>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">City events pages</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Each published city carries its own events page, combining that city&apos;s approved
            listings with the national events that apply everywhere in Pakistan.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {CITY_EVENTS_PAGES.map((c) => (
              <div key={c.href} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <Link href={c.href} className="text-xl font-bold hover:text-cyan-300">
                  {c.name} events
                </Link>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{c.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Pakistan calendar</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            The whole year on one page: the{' '}
            <Link href="/pakistan/calendar" className="text-cyan-300 underline">
              Pakistan calendar
            </Link>{' '}
            brings these national dates and approved events together month by month, with Hijri
            dates, free ICS and PDF downloads, and a version other websites can embed.
          </p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Special days and wish cards</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            National days and festivals belong to everyone, so they live on their own page:{' '}
            <Link href="/special-days" className="text-cyan-300 underline">
              Special Days and Wish Cards
            </Link>{' '}
            shows today&apos;s special day with a written message and a branded card you can share, copy
            or download, plus the next special days and today&apos;s famous birthdays.

          </p>
        </section>

        <section className="mt-12 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">List your event</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Organising a concert, match, festival, expo, conference or community gathering in
            Pakistan?{' '}
            <Link href="/events/submit" className="text-cyan-300 underline">
              Submit it to WorldCityHub for free
            </Link>
            . Every submission is verified by a person before it is listed on the city&apos;s events
            page.
          </p>
        </section>
      </div>
    </main>
  );
}
