// Events panel (§13) — SERVER component. Real public holidays today
// and over the next seven days from date.nager.at. NOTE: nager.at
// does NOT cover Pakistan (verified 2026-10-22: HTTP 204 for PK, AE,
// SA — the feed simply has no data) — so holidays shown here are the
// covered countries in our sample (United Kingdom, United States),
// and Pakistan's own holiday calendar joins this panel when the
// events database (marathon Q12) is merged. Nothing is invented to
// fill the gap.
// Stage 2 (owner ruling, 2026-11-03): this homepage section is WORLD
// events and world holidays ONLY. The Lahore hero photo and the
// Lahore / Karachi / Islamabad city buttons are removed — city
// events live on the city pages, not on the world homepage.

interface Holiday { date: string; name: string; country: string }

const COUNTRIES = [
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
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
  // Speed pass (2026-11-03): the country × year fetches are independent
  // (each is a full-year list, cached 1h), so they run in parallel
  // instead of one awaited round-trip at a time. Result order is
  // unchanged: country order, then year order, flattened.
  const perFeed = await Promise.all(
    COUNTRIES.flatMap(({ code, name }) =>
      years.map((y) => fetchHolidays(code, name, y).catch(() => [] as Holiday[])),
    ),
  );
  const all: Holiday[] = perFeed.flat();
  const upcoming = all
    .filter((h) => h.date >= todayIso && h.date <= weekIso)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const fmtDate = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' });

  return (
    <div>
      {upcoming.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcoming.map((h, i) => (
            <div key={i} className="rounded-xl t-card border t-border px-4 py-3">
              <div className="t-emerald text-xs font-semibold uppercase tracking-wide">
                {h.date === todayIso ? 'Today' : fmtDate(h.date)} · {h.country}
              </div>
              <div className="t-text font-semibold text-sm mt-1">{h.name}</div>
              <div className="sub-desc">Public holiday</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sub-desc">
          No public holidays this week in the holiday feed's covered countries. World holidays appear here as soon as the feed lists them.
        </p>
      )}
    </div>
  );
}
