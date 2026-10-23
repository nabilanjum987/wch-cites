import Link from 'next/link';

// Sports panel (§20) — SERVER component. Upcoming fixtures for
// Pakistan's national teams from TheSportsDB's free tier (the old
// free key "3" is permanently disabled; the public test key "123"
// responds — verified 2026-10-22). If no fixtures are listed, the
// panel says so honestly instead of inventing matches.

const API = 'https://www.thesportsdb.com/api/v1/json/123';

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

interface Fixture { event: string; league: string; date: string }

export default async function SportsPanel() {
  let fixtures: Fixture[] = [];
  const teams = await jget(`${API}/searchteams.php?t=Pakistan`);
  const teamId = teams?.teams?.[0]?.idTeam;
  if (teamId) {
    const next = await jget(`${API}/eventsnext.php?id=${teamId}`);
    const events = Array.isArray(next?.events) ? next.events : [];
    fixtures = events.slice(0, 3).map((e: any) => ({
      event: String(e.strEvent ?? ''),
      league: String(e.strLeague ?? ''),
      date: String(e.dateEvent ?? ''),
    })).filter((f: Fixture) => f.event);
  }

  const fmtDate = (iso: string) =>
    iso ? new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' }) : '';

  return (
    <div>
      {fixtures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 items-start">
          {fixtures.map((f, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="text-emerald-300 text-xs font-semibold uppercase tracking-wide">{fmtDate(f.date)}{f.league ? ` · ${f.league}` : ''}</div>
              <div className="text-white font-semibold text-sm mt-1">{f.event}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sub-desc mb-5">
          No upcoming fixtures are listed for Pakistan's national teams in the sports feed right now — the panel fills itself the moment the next match is scheduled.
        </p>
      )}
      <Link href="/pakistan/punjab/lahore/sports" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium no-underline">
        Sport in Lahore — teams, grounds and fixtures →
      </Link>
    </div>
  );
}
