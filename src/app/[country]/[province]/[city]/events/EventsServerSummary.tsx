import Link from 'next/link';
import type { WchEvent } from '@/lib/events';

// ── P2 (28 Oct final sitting): server-rendered verified-events summary ─────
// The interactive calendar below is a client component whose listings only
// arrive via browser fetches, so its raw HTML is empty. This server section
// puts the verified facts into the raw HTML itself:
//   * city rows from WorldCityHub's own approved events table (0003/0007),
//   * the next national dates (labelled country-wide, never as city events),
//   * or, when neither exists, an honest parked notice, no invented rows.
// It never invents a listing: it renders exactly what getApprovedEvents
// returned (approved + verified + future only, enforced in src/lib/events).

export function fmtDate(iso: string): string {
  // E1 fix (subpages fix B): format the instant in Asia/Karachi. The old
  // code read Y-M-D off the UTC string of the stored instant, so a
  // midnight-PKT row (2026-11-09T00:00:00+05:00, which is 2026-11-08 in
  // UTC) rendered one day early (Sun, Nov 8 instead of Mon, Nov 9).
  // Formatting the instant itself in the event's own timezone renders
  // the true local calendar date whatever offset the row was stored
  // with. An unparseable value is shown as stored rather than guessed.
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Karachi',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

function isHttpUrl(u: string): boolean {
  return u.startsWith('https://') || u.startsWith('http://');
}

// E2 (subpages fix B): question headings with direct answers, composed
// only from this page's own verified data (the approved rows passed in
// and the next national date among them). The events page emits this
// same array as FAQPage schema, so visible text and schema agree.
export function eventsFaq(cityName: string, countryName: string, cityEvents: WchEvent[], nationalEvents: WchEvent[]): { q: string; a: string }[] {
  const sortedCity = [...cityEvents].sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  const nextNational = [...nationalEvents].sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))[0];
  const qa: { q: string; a: string }[] = [
    {
      q: `What is on in ${cityName}?`,
      a: sortedCity.length > 0
        ? `Verified upcoming events in ${cityName} include ${sortedCity.slice(0, 3).map((ev) => `${ev.title} on ${fmtDate(ev.starts_at)}`).join('; ')}. They are listed in the verified section on this page, and only approved, verified events are shown.`
        : `No verified events are listed for ${cityName} yet. This page lists only verified events, so it shows no listings rather than invented ones, and verified ${cityName} events will appear here as soon as they are approved.`,
    },
    {
      q: `When is the next national date in ${countryName}?`,
      a: nextNational
        ? `The next national date listed on this page is ${nextNational.title} on ${fmtDate(nextNational.starts_at)}. National dates are country-wide observances, labelled nationwide on this page, not ${cityName}-only events.`
        : `No national dates are currently listed on this page. When country-wide dates for ${countryName} are approved and verified, they appear here labelled nationwide, not as ${cityName}-only events.`,
    },
    {
      q: `How are events on this page verified?`,
      a: `Events in the verified section come from WorldCityHub's own events calendar and are listed only when they are approved, verified and still upcoming. If an event has not passed that check, it does not appear on this page.`,
    },
  ];
  return qa;
}

interface Props {
  cityName: string;
  countryName: string;
  cityEvents: WchEvent[];
  nationalEvents: WchEvent[];
}

export default function EventsServerSummary({ cityName, countryName, cityEvents, nationalEvents }: Props) {
  const sortedCity = [...cityEvents].sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at));
  const nationalAhead = [...nationalEvents]
    .sort((a, b) => +new Date(a.starts_at) - +new Date(b.starts_at))
    .slice(0, 3);

  return (
    <section style={{ backgroundColor: '#0a0f1e' }}>
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {sortedCity.length === 0 && nationalEvents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-5">
            <h2 className="text-lg font-bold text-white">No verified events listed for {cityName} yet</h2>
            <p className="text-sm text-gray-400 leading-relaxed mt-2">
              We list only verified events. The usual events feeds carry almost no Pakistan coverage,
              and our own verified calendar for {cityName} is still being built, so this page shows
              no listings rather than invented ones. Verified {cityName} events and national dates
              will appear here as soon as they are approved.
            </p>
            <Link
              href="/events/submit"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-semibold transition"
            >
              Organising an event in {cityName}? List it free for review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedCity.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white">Verified upcoming in {cityName}</h2>
                <ul className="mt-3 space-y-3">
                  {sortedCity.map((ev) => (
                    <li key={ev.id} className="rounded-2xl border border-white/10 p-4">
                      <p className="font-semibold text-white text-sm">{ev.title}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {fmtDate(ev.starts_at)}
                        {ev.venue ? ` · ${ev.venue}` : ''}
                      </p>
                      {ev.description ? (
                        <p className="text-xs text-gray-500 leading-relaxed mt-2">{ev.description}</p>
                      ) : null}
                      {ev.source_name || ev.source_url ? (
                        <p className="text-xs text-gray-500 mt-2">
                          Source:{' '}
                          {ev.source_url && isHttpUrl(ev.source_url) ? (
                            <a
                              href={ev.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-gray-300"
                            >
                              {ev.source_name || 'Source'}
                            </a>
                          ) : (
                            ev.source_name || 'WorldCityHub verified calendar'
                          )}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {nationalAhead.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-white">National dates ahead</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Country-wide dates, not {cityName}-only events.
                </p>
                <ul className="mt-3 space-y-2">
                  {nationalAhead.map((ev) => (
                    <li
                      key={ev.id}
                      className="rounded-2xl border border-white/10 px-4 py-3 flex flex-wrap items-baseline justify-between gap-2"
                    >
                      <span className="font-semibold text-white text-sm">{ev.title}</span>
                      <span className="text-xs text-gray-400">
                        {fmtDate(ev.starts_at)} · Nationwide
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-white">{cityName} Events: Quick Answers</h2>
          {eventsFaq(cityName, countryName, cityEvents, nationalEvents).map((item) => (
            <div key={item.q} className="mt-4">
              <h3 className="text-base font-bold text-white">{item.q}</h3>
              <p className="text-sm text-gray-300 leading-relaxed mt-1">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
