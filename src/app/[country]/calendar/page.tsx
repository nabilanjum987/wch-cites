import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import { hubWebPageJsonLd } from '@/lib/seo/hub';
import { breadcrumbJsonLd, SITE_URL } from '@/lib/seo/breadcrumbs';
import CalendarYear from '@/components/calendar/CalendarYear';
import CalendarActions from '@/components/calendar/CalendarActions';
import {
  CALENDAR_COUNTRIES,
  getCalendarYear,
  todayInTimeZone,
  type CalendarEntry,
} from '@/lib/calendar';

// Country calendar (calendar family SAMPLE, 4 Nov 2026). Owner spec
// (3 Nov 2026): one full-year calendar per country with public holidays
// and approved events together, ICS + PDF downloads and a website
// embed, the WorldCityHub name and URL locked onto every surface.
// This sample ships Pakistan only: any other country slug 404s until
// the owner approves the sample and the family replicates by data.
// The page is deliberately NOT in the sitemap (sample gate: a route
// enters the sitemap only after owner approval).

export const revalidate = 300;

interface PageProps {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ year?: string }>;
}

function resolveYear(raw: string | undefined, currentYear: number): number {
  const y = Number(raw);
  if (!Number.isInteger(y) || y < 2025 || y > currentYear + 2) return currentYear;
  return y;
}

function longDate(yyyyMmDd: string): string {
  const d = new Date(`${yyyyMmDd}T12:00:00Z`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { country } = await params;
  const cfg = CALENDAR_COUNTRIES[country];
  if (!cfg) return { title: 'Calendar | WorldCityHub' };
  const { year: rawYear } = await searchParams;
  const currentYear = Number(todayInTimeZone(cfg.timeZone).slice(0, 4));
  const year = resolveYear(rawYear, currentYear);
  const title = `${cfg.name} Calendar ${year}: Holidays & Events | WorldCityHub`;
  const description = `${cfg.name}'s public holidays and approved events for ${year} in one full-year calendar with Hijri dates, free ICS and PDF downloads, and a website embed.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${cfg.slug}/calendar` },
    openGraph: { title, description, url: `${SITE_URL}/${cfg.slug}/calendar`, siteName: 'WorldCityHub', type: 'website' },
  };
}

export default async function CountryCalendarPage({ params, searchParams }: PageProps) {
  const { country } = await params;
  const cfg = CALENDAR_COUNTRIES[country];
  if (!cfg) notFound();

  const todayIso = todayInTimeZone(cfg.timeZone);
  const currentYear = Number(todayIso.slice(0, 4));
  const { year: rawYear } = await searchParams;
  const year = resolveYear(rawYear, currentYear);

  const data = await getCalendarYear(cfg, year);
  const calendarPath = `/${cfg.slug}/calendar`;
  const calendarUrl = `${SITE_URL}${calendarPath}`;
  const icsUrl = `${calendarPath}/ics?year=${year}`;
  const embedUrl = `${SITE_URL}/embed/calendar/${cfg.slug}`;

  const upcomingHolidays = data.holidays.filter((h) => h.date >= todayIso);
  const nextHoliday: CalendarEntry | undefined =
    year >= currentYear ? upcomingHolidays[0] ?? data.holidays[0] : undefined;

  const holidayListText = data.hasHolidayData
    ? data.holidays.map((h) => `${h.title} (${longDate(h.date)})`).join('; ')
    : '';

  const faqs: { q: string; a: string }[] = [
    {
      q: `Which public holidays are on the ${cfg.name} calendar for ${year}?`,
      a: data.hasHolidayData
        ? `The fixed-date national public holidays listed for ${year} are: ${holidayListText}. Islamic holidays such as Eid ul-Fitr, Eid ul-Adha, Ashura and Eid Milad-un-Nabi are set by official announcement each year, so they are added to this calendar when confirmed and are never guessed.`
        : `Holiday data for ${year} has not been added to WorldCityHub's calendar data yet, so this page lists no holidays for ${year} rather than filling the year by guesswork. Confirmed dates appear here as soon as they are part of the site's verified events and holidays data.`,
    },
    {
      q: `Does the ${cfg.name} calendar show Hijri (Islamic) dates?`,
      a: `Yes. Every holiday and event on this calendar also shows its Hijri date, worked out by converting the Gregorian date.${
        data.holidays[0]
          ? ` For example, ${data.holidays[0].title} falls on ${longDate(data.holidays[0].date)}, which is ${data.holidays[0].hijri}.`
          : ''
      } The Hijri date is a calendar conversion of the same day, shown beside it so both calendars can be read together.`,
    },
    {
      q: `How can I download the ${cfg.name} calendar for ${year}?`,
      a: `Use the download buttons on this page. The ICS file adds every ${year} holiday and event to Google Calendar, Apple Calendar or Outlook in one import. The PDF button saves a printable list of the whole year, month by month. Both files carry the WorldCityHub name and this page's address inside the file, so the source travels with the calendar wherever it is saved or shared.`,
    },
    {
      q: `Can I add the ${cfg.name} calendar to my own website?`,
      a: `Yes, free. Copy the embed code on this page and paste it where the calendar should appear; the widget shows the current month with its holidays and events. The widget always carries a WorldCityHub credit line at its foot. The credit is rendered inside the widget itself, so it stays with the calendar on every site that embeds it.`,
    },
    {
      q: `When is the next public holiday in ${cfg.name}?`,
      a: nextHoliday
        ? `The next public holiday on this calendar is ${nextHoliday.title} on ${longDate(nextHoliday.date)} (${nextHoliday.hijri}). It is one of the fixed-date national holidays carried in WorldCityHub's verified events and holidays data. Islamic holidays announced during the year are added when they are officially confirmed.`
        : `Open the ${currentYear} calendar to see the next upcoming public holiday in ${cfg.name}. Fixed-date national holidays are listed for the current year, and Islamic holidays are added when they are officially confirmed, never guessed in advance.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: 'WorldCityHub', path: '/' },
    { name: cfg.name, path: `/${cfg.slug}` },
    { name: 'Calendar', path: calendarPath },
  ]);

  const yearHref = (y: number) => (y === currentYear ? calendarPath : `${calendarPath}?year=${y}`);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <JsonLd data={hubWebPageJsonLd(`${cfg.name} Calendar ${year}`, calendarPath, `${cfg.name}'s public holidays and approved events for ${year} in one full-year calendar with Hijri dates, free ICS and PDF downloads, and a website embed.`)} />
      <JsonLd data={breadcrumb} />
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600"> / </span>
          <Link href={`/${cfg.slug}`} className="hover:text-white">{cfg.name}</Link>
          <span className="text-gray-600"> / </span>
          <span className="text-gray-100 font-medium">Calendar</span>
        </nav>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">
          {cfg.name} Calendar {year}
        </h1>

        <section className="mt-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">
            Every public holiday and approved event in {cfg.name} for {year}, in one calendar
          </h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            This is {cfg.name}&apos;s full-year calendar on WorldCityHub: the fixed-date national
            public holidays and the events WorldCityHub has approved and verified, shown together
            month by month, each with its Hijri date beside it. The holidays and events come from
            the same data as the rest of the site, the verified events system behind every city
            events page. Dates are listed only when they are part of that data; a date is never
            invented to fill the calendar.
          </p>
          <p className="mt-3 leading-relaxed text-gray-300">
            Islamic holidays such as Eid ul-Fitr, Eid ul-Adha, Ashura and Eid Milad-un-Nabi are set
            by official announcement each year. Until a date is confirmed it does not appear here;
            when it is confirmed and verified, it joins this calendar like any other entry.
          </p>
        </section>

        {/* Year switcher + next holiday */}
        <div className="mt-8 flex flex-wrap items-stretch gap-4">
          <nav aria-label="Calendar year" className="flex items-center gap-2">
            {year - 1 >= 2025 && (
              <Link href={yearHref(year - 1)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white">
                {year - 1}
              </Link>
            )}
            <span className="rounded-xl border border-cyan-300/50 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200">
              {year}
            </span>
            {year + 1 <= currentYear + 2 && (
              <Link href={yearHref(year + 1)} className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white">
                {year + 1}
              </Link>
            )}
          </nav>
          {nextHoliday && (
            <div className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Next public holiday</span>
              <p className="text-sm font-semibold text-white">
                {nextHoliday.title} · {longDate(nextHoliday.date)} · {nextHoliday.hijri}
              </p>
            </div>
          )}
        </div>

        {!data.hasHolidayData && (
          <div className="mt-8 max-w-3xl rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
            <h2 className="text-lg font-semibold text-amber-200">Holiday data for {year} is not published here yet</h2>
            <p className="mt-2 leading-relaxed text-gray-200">
              WorldCityHub&apos;s calendar data does not carry a confirmed holiday list for {year}
              yet, so no holidays are shown for this year rather than filling it by guesswork.
              Events approved for {year} still appear below when they exist. The confirmed
              holiday list joins this page as soon as it is part of the site&apos;s verified
              events and holidays data.
            </p>
          </div>
        )}

        <div className="mt-10">
          <CalendarYear
            entries={data.entries}
            year={year}
            todayIso={todayIso}
            holidayCount={data.holidays.length}
            eventCount={data.events.length}
          />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Take this calendar with you</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Download the year as a calendar file or a printable PDF, or embed the live calendar
            on your own website. Every copy carries the WorldCityHub name and address: the credit
            is built into the file and the widget, and cannot be taken off.
          </p>
          <div className="mt-6">
            <CalendarActions
              entries={data.entries}
              year={year}
              countryName={cfg.name}
              countrySlug={cfg.slug}
              calendarUrl={calendarUrl}
              icsUrl={icsUrl}
              embedUrl={embedUrl}
            />
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-white">Questions about the {cfg.name} calendar</h2>
          <div className="mt-4 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold text-white">{f.q}</h3>
                <p className="mt-1.5 leading-relaxed text-gray-300">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-white">How this calendar is put together</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Public holidays: the fixed-date national holidays are carried in WorldCityHub&apos;s
            own events data, sourced from the Government of {cfg.name} public holidays list, and
            are the same national dates shown on every city events page. Events: only listings
            that a person has checked against their source and marked approved and verified are
            shown, the same rule as the{' '}
            <Link href="/events" className="text-cyan-300 underline">events hub</Link>.
            Hijri dates are worked out by converting each Gregorian date with the Islamic
            calendar, not copied from a separate list.
          </p>
          <p className="mt-3 leading-relaxed text-gray-300">
            More for {cfg.name}: the{' '}
            <Link href={`/${cfg.slug}`} className="text-cyan-300 underline">{cfg.name} country page</Link>
            {' '}collects its cities, rates and guides; city events pages for{' '}
            <Link href="/pakistan/punjab/lahore/events" className="text-cyan-300 underline">Lahore</Link>,{' '}
            <Link href="/pakistan/sindh/karachi/events" className="text-cyan-300 underline">Karachi</Link>{' '}
            and{' '}
            <Link href="/pakistan/islamabad-capital-territory/islamabad/events" className="text-cyan-300 underline">Islamabad</Link>{' '}
            combine each city&apos;s own listings with these national dates.
          </p>
        </section>

        {/* Branding lock band */}
        <footer className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-lg font-bold text-white">WorldCityHub</p>
          <p className="mt-1 text-sm text-gray-300">
            This calendar is published by WorldCityHub. Its downloads and embeds always carry the
            WorldCityHub name and address.
          </p>
          <p className="mt-1 text-sm">
            <Link href={calendarPath} className="text-cyan-300 underline">{calendarUrl}</Link>
          </p>
        </footer>
      </div>
    </main>
  );
}
