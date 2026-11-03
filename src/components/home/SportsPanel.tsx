import Link from 'next/link';
import type { SportEvent } from '@/lib/apis/sports';

// Sports panel (§20) — SERVER component. Stage 2 (owner ruling,
// 2026-11-03): this section shows the WORLD's major sporting items
// happening now, not one country's team. Data is TheSportsDB's
// day-events feed (eventsday.php), the same endpoint the city sports
// pages use, queried for today across football, cricket, basketball
// and tennis. One key detail, verified live 2026-11-03: eventsday is
// premium-only on the shared free key "2" (it answers "Invalid
// Premium API key"), while the public test key "123" still serves
// it — the previous version of this panel used "123" inline for the
// same reason, so this panel keeps that pattern. If today is thin,
// tomorrow's fixtures fill the panel. If the feed lists nothing at
// all, the panel falls back to an honest note plus the sports news
// link — it never renders empty and never invents a fixture.
//
// Click target: the site has no standalone global sports hub (sports
// pages are per-city), so every item links to the site's sports news
// category, /news?category=sports — the one global sports surface the
// site publishes. Reported as such in the Stage 2 report.

const TSDB_DAY_BASE = 'https://www.thesportsdb.com/api/v1/json/123';

async function fetchDayEvents(sport: string, date: string): Promise<SportEvent[]> {
  try {
    const res = await fetch(
      `${TSDB_DAY_BASE}/eventsday.php?d=${date}&s=${encodeURIComponent(sport)}`,
      { signal: AbortSignal.timeout(6000), next: { revalidate: 900 } } as RequestInit,
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.events) ? data.events : [];
  } catch {
    return [];
  }
}

const SPORTS: { sport: string; label: string }[] = [
  { sport: 'Soccer', label: 'Football' },
  { sport: 'Cricket', label: 'Cricket' },
  { sport: 'Basketball', label: 'Basketball' },
  { sport: 'Tennis', label: 'Tennis' },
];

const SPORTS_NEWS = '/news?category=sports';

const dayStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

async function gather(): Promise<(SportEvent & { sportLabel: string })[]> {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 86400000);
  const out: (SportEvent & { sportLabel: string })[] = [];
  for (const when of [today, tomorrow]) {
    const perSport = await Promise.all(
      SPORTS.map(async (s) => {
        const events = await fetchDayEvents(s.sport, dayStr(when)).catch(() => []);
        return events.slice(0, 3).map((e) => ({ ...e, sportLabel: s.label }));
      }),
    );
    out.push(...perSport.flat());
    if (out.length >= 3) break;
  }
  return out.slice(0, 6);
}

export default async function SportsPanel() {
  const fixtures = await gather();

  return (
    <div>
      {fixtures.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {fixtures.map((f, i) => (
            <Link key={`${f.idEvent}-${i}`} href={SPORTS_NEWS}
              className="rounded-xl t-card border t-border px-4 py-3 t-border-hover-25 transition-colors no-underline block">
              <div className="t-emerald text-xs font-semibold uppercase tracking-wide">
                {f.sportLabel} · {f.strLeague}
              </div>
              <div className="t-text font-semibold text-sm mt-1">{f.strEvent}</div>
              <div className="sub-desc">{f.dateEvent ?? ''}{f.strTime ? ` · ${f.strTime} UTC` : ''}{f.strVenue ? ` · ${f.strVenue}` : ''}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl t-card border t-border px-4 py-3">
          <div className="t-text font-semibold text-sm">No major fixtures in the live feed today</div>
          <p className="sub-desc mt-1">
            The fixture feed lists nothing major right now. The sports news page below carries today's coverage as it lands.
          </p>
        </div>
      )}
      <div className="mt-4">
        <Link href={SPORTS_NEWS}
          className="px-4 py-2 rounded-full t-card border t-border-15 t-text-80 text-sm font-medium t-card-hover transition-colors no-underline inline-block">
          All sports coverage →
        </Link>
      </div>
    </div>
  );
}
