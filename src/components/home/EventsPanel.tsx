import Link from 'next/link';

// Events panel (§13) — SERVER component. Real public holidays today
// and over the next seven days from date.nager.at. NOTE: nager.at
// does NOT cover Pakistan (verified 2026-10-22: HTTP 204 for PK, AE,
// SA — the feed simply has no data) — so holidays shown here are the
// covered countries in our sample (United Kingdom, United States),
// and Pakistan's own holiday calendar joins this panel when the
// events database (marathon Q12) is merged. Nothing is invented to
// fill the gap; the published cities' events pages are linked below.

interface Holiday { date: string; name: string; country: string }

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
];

const CITY_EVENTS = [
  { label: 'Lahore events', href: '/pakistan/punjab/lahore/events' },
  { label: 'Karachi events', href: '/pakistan/sindh/karachi/events' },
  { label: 'Islamabad events', href: '/pakistan/islamabad-capital-territory/islamabad/events' },
];

async function fetchHolidays(code: string, name: string, year: number): Promise<Holiday[]> {
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${code}`, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return [];
    const rows = await res.json();
    return Array.isArray(rows) ? rows.map((r: any) => ({ date: r.date, name: r.name, country: name })) : [];
  } catch {
    return [];
  }
}

export default async function EventsPanel() {
  const now = new Date();
  const dayMs = 86400000;
  const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayIso = isoOf(now);
  const weekIso = isoOf(new Date(now.getTime() + 7 * dayMs));

  const years = [...new Set([now.getFullYear(), new Date(now.getTime() + 7 * dayMs).getFullYear()])];
  const all: Holiday[] = [];
  for (const { code, name } of COUNTRIES) {
    for (const y of years) {
      all.push(...(await fetchHolidays(code, name, y).catch(() => [])));
    }
  }
  const upcoming = all
    .filter((h) => h.date >= todayIso && h.date <= weekIso)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const fmtDate = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div>
      {upcoming.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {upcoming.map((h, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">
                {h.date === todayIso ? 'Today' : fmtDate(h.date)} · {h.country}
              </div>
              <div className="text-white font-semibold text-sm mt-1">{h.name}</div>
              <div className="text-white/40 text-xs">Public holiday</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/50 text-sm mb-5">
          No public holidays this week in the holiday feed's covered countries — the city events pages below carry what is on.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {CITY_EVENTS.map((l) => (
          <Link key={l.href} href={l.href}
            className="px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors no-underline">
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
