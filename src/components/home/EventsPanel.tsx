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
      {/* Homepage-imagery pass (2026-10-28): the section is no longer
          text-only. No public holidays fall in the feed's covered
          countries this week (verified 2026-10-28: nager.at returns
          nothing for GB/US for 2026-10-27–2026-11-03), and the events
          database item (P2) had no PR up, so — per the item, without
          blocking on P2 — the banner is a real photo of Lahore, the
          published city whose events page this section links first
          (Minar-e-Pakistan, King Eliot, CC BY-SA 4.0; vendored under
          public/images/home28/; record in
          docs/media-registry/subjects/homepage-imagery-2026-10-28.json). */}
      <figure className="relative h-40 sm:h-48 overflow-hidden rounded-2xl border t-border mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home28/events-lahore.webp" alt="Minar-e-Pakistan tower in Lahore" width={900} height={400} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <figcaption className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[11px] px-2.5 py-1 rounded-tl-lg">
          Minar-e-Pakistan, Lahore — photo: King Eliot · CC BY-SA 4.0
        </figcaption>
      </figure>
      {upcoming.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
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
          No public holidays this week in the holiday feed's covered countries — the city events pages below carry what is on.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {CITY_EVENTS.map((l) => (
          <Link key={l.href} href={l.href}
            className="px-4 py-2 rounded-full t-card border t-border-15 t-text-80 text-sm font-medium t-card-hover transition-colors no-underline">
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
