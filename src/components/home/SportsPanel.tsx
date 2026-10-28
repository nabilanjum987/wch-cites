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
      {/* Homepage-imagery pass (2026-10-28): the section is no longer
          a bare text block — a real photo of Gaddafi Stadium, Lahore,
          sits above the fixtures (or above the honest no-fixtures
          line, which stays word-for-word). Vendored under
          public/images/home28/; record in
          docs/media-registry/subjects/homepage-imagery-2026-10-28.json. */}
      <figure className="relative h-40 sm:h-48 overflow-hidden rounded-2xl border t-border mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home28/sports-pakistan.webp" alt="Gaddafi Stadium in Lahore during a Pakistan Super League match" width={900} height={400} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <figcaption className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[11px] px-2.5 py-1 rounded-tl-lg">
          Gaddafi Stadium, Lahore — photo: PCB · CC0 · Wikimedia Commons
        </figcaption>
      </figure>
      {fixtures.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {fixtures.map((f, i) => (
            <div key={i} className="rounded-xl t-card border t-border px-4 py-3">
              <div className="t-emerald text-xs font-semibold uppercase tracking-wide">{fmtDate(f.date)}{f.league ? ` · ${f.league}` : ''}</div>
              <div className="t-text font-semibold text-sm mt-1">{f.event}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sub-desc">
          No upcoming fixtures are listed for Pakistan's national teams in the sports feed right now — the panel fills itself the moment the next match is scheduled.
        </p>
      )}
      <Link href="/pakistan/punjab/lahore/sports" className="inline-flex items-center gap-2 t-link text-sm font-medium no-underline">
        Sport in Lahore — teams, grounds and fixtures →
      </Link>
    </div>
  );
}
