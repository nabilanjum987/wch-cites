import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { hubBreadcrumbJsonLd, hubWebPageJsonLd } from '@/lib/seo/hub';
import DayCard from '@/components/special-days/DayCard';
import {
  BIRTHDAY_MESSAGE,
  DAY_MESSAGES,
  fillTemplate,
  formatLongDate,
  hijriLabel,
  karachiToday,
  nextOccurrence,
  specialDaysOn,
  upcomingSpecialDays,
  type ResolvedDay,
} from '@/lib/day-messages';
import { getBornToday } from '@/lib/personalities';

// Special days and wish cards (owner ruling 3 Nov 2026: a "very
// important feature"). Every day in the library in src/lib/day-messages
// carries a professionally written message whose tone matches the day:
// celebratory for festivals and national days, solemn for remembrance
// days. The page renders today's day (or, honestly labelled, the next
// one) as a branded wish card with share, copy and image download, the
// next three days as a strip, today's famous birthdays from the
// personalities data, and the full library. Dates resolve from rules,
// never from invented strings; Islamic dates are computed live against
// the Islamic calendar and can sit one day apart from the official
// moon-sighting announcement.

const BASE = 'https://worldcityhub.vercel.app';

const TITLE = 'Special Days and Wish Cards | WorldCityHub';
const DESCRIPTION =
  "Today's special day with a wish card to share: Pakistan's national days, the festivals of every faith, and famous birthdays, from WorldCityHub.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE}/special-days` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE}/special-days`, siteName: 'WorldCityHub', type: 'website' },
};

export const revalidate = 3600;

const TONE_CHIP: Record<string, string> = {
  celebratory: 'bg-emerald-400/10 text-emerald-300',
  solemn: 'bg-slate-400/10 text-slate-300',
  reverent: 'bg-sky-400/10 text-sky-300',
  warm: 'bg-amber-400/10 text-amber-300',
};

export default async function SpecialDaysPage() {
  const today = karachiToday();
  const todayLabel = formatLongDate(today);
  const todays = specialDaysOn(today);
  const upcoming = upcomingSpecialDays(today, 6, false);

  // The hero card is today's day when one falls today. When none does,
  // the nearest upcoming day is featured instead, labelled as upcoming,
  // never dressed up as today's.
  const heroDays: ResolvedDay[] = todays.length > 0 ? todays : upcoming.slice(0, 1);
  const heroKeys = new Set(heroDays.map((d) => d.entry.key));
  const strip = upcoming.filter((d) => !heroKeys.has(d.entry.key)).slice(0, 3);

  const bornToday = await getBornToday(new Date(Date.UTC(today.y, today.m - 1, today.d, 12, 0, 0)));

  const next = upcoming[0];
  const faqs = [
    {
      q: "What is today's special day?",
      a:
        todays.length > 0
          ? `${todays.map((d) => d.entry.name).join(' and ')} fall${todays.length > 1 ? '' : 's'} today, ${todayLabel}. The wish card above carries a message written for the day, ready to share.`
          : `No special day falls today, ${todayLabel}. The next special day is ${next.entry.name} on ${formatLongDate(next.date)}, and its wish card is featured above.`,
    },
    {
      q: 'How do I share a WorldCityHub wish card?',
      a: 'Every special day on this page comes with a ready made wish card. Press Share to send it through your apps, Copy message to paste the greeting as text, or Download card image to save the card as a picture and post it anywhere. The WorldCityHub name and address are printed on the card itself, so the wish always carries where it came from.',
    },
    {
      q: 'Which special days does WorldCityHub cover?',
      a: "The library covers Pakistan's national days, from Kashmir Day and Pakistan Day to Independence Day, Iqbal Day and Quaid-e-Azam Day; the Islamic year, including Ramadan, both Eids, Ashura and Eid Milad-un-Nabi; Christmas, Easter, Diwali, Holi and Baisakhi for Pakistan's Christian, Hindu and Sikh communities; and worldwide days such as New Year, Mother's Day, Father's Day and Teachers' Day. Famous birthdays from our personality profiles appear on the day itself.",
    },
    {
      q: 'Why do Eid and Ramadan fall on a different date every year?',
      a: 'Islamic festivals follow the lunar Hijri calendar, which is about eleven days shorter than the solar year, so each festival moves earlier by roughly eleven days each year. WorldCityHub computes the dates from the Islamic calendar; the official moon-sighting announcement in Pakistan can place a festival one day either side of the computed date.',
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

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">
      <JsonLd data={hubWebPageJsonLd('Special Days and Wish Cards', '/special-days', DESCRIPTION)} />
      <JsonLd data={hubBreadcrumbJsonLd('Special Days', '/special-days')} />
      <JsonLd data={faqJsonLd} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="text-gray-600"> / </span>
          <span className="text-gray-100 font-medium">Special Days</span>
        </nav>

        <h1 className="mt-6 text-4xl font-bold sm:text-5xl">Special Days and Wish Cards</h1>

        <section className="mt-6 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">What is today&apos;s special day?</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            {todays.length > 0 ? (
              <>
                Today, {todayLabel}, is {todays.map((d) => d.entry.name).join(' and ')}. The wish card below
                carries a message written for the day, ready to share with family and friends.
              </>
            ) : (
              <>
                No special day falls today, {todayLabel}. The next one is {next.entry.name} on{' '}
                {formatLongDate(next.date)}, so its wish card is featured below, ready ahead of time.
              </>
            )}{' '}
            WorldCityHub keeps a message for every national day, every major festival of Pakistan&apos;s faiths
            and the famous birthdays in our profiles, each written in the tone the day deserves.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="sr-only">{todays.length > 0 ? "Today's wish card" : 'Next wish card'}</h2>
          {todays.length === 0 && (
            <p className="mb-4 text-sm font-medium text-gray-400">
              Coming up next, on {formatLongDate(heroDays[0].date)}:
            </p>
          )}
          <div className="grid gap-6">
            {heroDays.map(({ entry, date }) => (
              <DayCard
                key={entry.key}
                cardKey={entry.key}
                name={entry.name}
                scope={entry.scope}
                tone={entry.tone}
                headline={entry.headline}
                message={entry.message}
                shareText={entry.shareText}
                dateLabel={formatLongDate(date)}
                hijriDateLabel={hijriLabel(date)}
              />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Famous birthdays today</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            The personalities in our profiles who were born on this date, with a birthday wish in the same
            card style.
          </p>
          {bornToday.length > 0 ? (
            <div className="mt-6 grid gap-6">
              {bornToday.map((p) => (
                <DayCard
                  key={p.slug}
                  cardKey={`birthday-${p.slug}`}
                  name={p.name}
                  scope="Famous birthday"
                  tone="warm"
                  headline={fillTemplate(BIRTHDAY_MESSAGE.headline, p.name, p.title)}
                  message={fillTemplate(BIRTHDAY_MESSAGE.message, p.name, p.title)}
                  shareText={fillTemplate(BIRTHDAY_MESSAGE.shareText, p.name, p.title)}
                  dateLabel={todayLabel}
                  hijriDateLabel={hijriLabel(today)}
                  href={`/personalities/${p.slug}`}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="leading-relaxed text-gray-300">
                No famous birthday in our personality profiles falls on today&apos;s date. This section
                lights up on the days our profiles were born, from Allama Iqbal on 9 November to
                Quaid-e-Azam on 25 December.
              </p>
            </div>
          )}
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Coming up</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {strip.map(({ entry, date }) => (
              <div key={entry.key} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-cyan-300">{formatLongDate(date)}</p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-white">{entry.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{entry.scope}</p>
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{entry.headline}. {entry.message}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold text-white">Every special day in the library</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Each day below has its own written message, in the tone the day deserves: celebratory for
            festivals and national days, solemn for days of remembrance. Islamic dates are computed from
            the Hijri calendar and can sit one day apart from the official moon-sighting announcement.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DAY_MESSAGES.map((entry) => {
              const occ = nextOccurrence(entry, today);
              return (
                <li key={entry.key} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-white">{entry.name}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${TONE_CHIP[entry.tone]}`}>
                      {entry.tone}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">
                    {entry.scope} · {entry.dateLabel}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-300">{entry.headline}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    {occ ? `Next: ${formatLongDate(occ)}` : 'Dates for the coming years are added as calendars are confirmed.'}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-white">Questions about special days</h2>
          <div className="mt-5 space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="text-lg font-semibold text-white">{f.q}</h3>
                <p className="mt-2 leading-relaxed text-gray-300">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-xl font-semibold text-white">Events, too</h2>
          <p className="mt-3 leading-relaxed text-gray-300">
            Special days are the dates everyone shares. For concerts, matches, festivals and community
            gatherings with their own venues and times, see the{' '}
            <Link href="/events" className="text-cyan-300 underline">
              events hub
            </Link>
            , where every listing is verified by a person before it appears.
          </p>
        </section>
      </div>
    </main>
  );
}
