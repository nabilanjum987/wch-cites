import Link from 'next/link';
import type { WchEvent } from '@/lib/events';

// ── P2 (28 Oct final sitting): server-rendered verified-events summary ─────
// The interactive calendar below is a client component whose listings only
// arrive via browser fetches, so its raw HTML is empty. This server section
// puts the verified facts into the raw HTML itself:
//   * city rows from WorldCityHub's own approved events table (0003/0007),
//   * the next national dates (labelled country-wide, never as city events),
//   * or, when neither exists, an honest parked notice — no invented rows.
// It never invents a listing: it renders exactly what getApprovedEvents
// returned (approved + verified + future only, enforced in src/lib/events).

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function fmtDate(iso: string): string {
  // Show the calendar date exactly as the row states it. Rendering via
  // toLocaleDateString would use the SERVER's timezone: a midnight-PKT
  // row (2026-11-09T00:00:00+05:00) renders as the previous day on a UTC
  // server (Sun, Nov 8) — wrong for a fixed-date observance. The written
  // Y-M-D's weekday is timezone-independent, so format from that.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return iso;
  return `${WEEKDAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]}, ${MONTHS[mo - 1]} ${d}, ${y}`;
}

function isHttpUrl(u: string): boolean {
  return u.startsWith('https://') || u.startsWith('http://');
}

interface Props {
  cityName: string;
  cityEvents: WchEvent[];
  nationalEvents: WchEvent[];
}

export default function EventsServerSummary({ cityName, cityEvents, nationalEvents }: Props) {
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
              and our own verified calendar for {cityName} is still being built — so this page shows
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
      </div>
    </section>
  );
}
