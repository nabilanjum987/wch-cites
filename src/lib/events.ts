// ── WorldCityHub — own events data layer (WP7 / marathon Q12) ──────────────
// Reads the `events` table created by supabase/migrations/0003_events.sql.
// Truth + degradation rules (the /improve pattern):
//   * Only approved + verified events are ever returned — RLS enforces
//     this at the database, and the queries below ask for the same.
//   * While migration 0003 is unapplied (table missing) or Supabase is
//     unreachable, every function returns an EMPTY list — city pages
//     fall back silently to their previous behaviour. Nothing is faked.

import type { CityEvent, EventCategory, LevelTab } from '@/types/city';
import { getSupabase } from './supabase';

export type WchEventCategory =
  | 'sports' | 'culture' | 'food' | 'education' | 'community' | 'religious';

export const WCH_EVENT_CATEGORIES: { key: WchEventCategory; label: string }[] = [
  { key: 'sports',    label: 'Sports' },
  { key: 'culture',   label: 'Culture' },
  { key: 'food',      label: 'Food' },
  { key: 'education', label: 'Education' },
  { key: 'community', label: 'Community' },
  { key: 'religious', label: 'Religious' },
];

export interface WchEvent {
  id: string;
  title: string;
  slug: string;
  city_slug: string | null;
  venue: string;
  starts_at: string;
  ends_at: string | null;
  category: WchEventCategory;
  description: string;
  source_name: string;
  source_url: string;
  verified: boolean;
  status: 'draft' | 'approved' | 'rejected';
  last_verified_at: string | null;
  created_at: string;
}

const SELECT_COLS =
  'id,title,slug,city_slug,venue,starts_at,ends_at,category,description,source_name,source_url,verified,status,last_verified_at,created_at';

// ── Server-side read via PostgREST (same pattern as the suggest route) ─────

export async function getApprovedEvents(opts: {
  citySlug?: string;
  includeNational?: boolean;
  limit?: number;
} = {}): Promise<WchEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  const limit = Math.min(opts.limit ?? 100, 500);
  const params = new URLSearchParams({
    select: SELECT_COLS,
    status: 'eq.approved',
    verified: 'eq.true',
    starts_at: `gte.${new Date().toISOString()}`,
    order: 'starts_at.asc',
    limit: String(limit),
  });
  if (opts.citySlug) {
    params.set('or', opts.includeNational === false
      ? `(city_slug.eq.${opts.citySlug})`
      : `(city_slug.eq.${opts.citySlug},city_slug.is.null)`);
  }
  try {
    const res = await fetch(`${url}/rest/v1/events?${params.toString()}`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 300 },
    } as RequestInit);
    if (!res.ok) return []; // table missing (migration unapplied) → silent fallback
    const rows = (await res.json()) as WchEvent[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

// ── Client-side read (city events page) via the shared anon client ─────────
// RLS already restricts anon SELECT to approved + verified rows; the
// explicit filters keep intent obvious. Any error → [] (silent fallback).

export async function fetchCityDbEvents(citySlug: string): Promise<WchEvent[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('events')
      .select(SELECT_COLS)
      .eq('status', 'approved')
      .eq('verified', true)
      .or(`city_slug.eq.${citySlug},city_slug.is.null`)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(100);
    if (error || !data) return [];
    return data as WchEvent[];
  } catch {
    return [];
  }
}

// ── Mapping into the city page's CityEvent shape ────────────────────────────

const CATEGORY_MAP: Record<WchEventCategory, EventCategory> = {
  sports: 'sports',
  culture: 'culture',
  food: 'food',
  education: 'conferences',
  community: 'family',
  religious: 'religious',
};

export function mapDbEventToCityEvent(ev: WchEvent, cityName: string, country: string): CityEvent {
  const isNational = !ev.city_slug;
  return {
    id: `wch-${ev.id}`,
    title: ev.title,
    description: ev.description ?? '',
    venue: ev.venue ?? '',
    address: '',
    city: cityName,
    country,
    category: CATEGORY_MAP[ev.category] ?? 'culture',
    start_time: ev.starts_at,
    end_time: ev.ends_at ?? ev.starts_at,
    ticket_url: ev.source_url || undefined,
    is_free: true,
    level: (isNational ? 'national' : 'local') as LevelTab,
  };
}

// ── PSL fixture ingestion helper (NOT wired into pages) ─────────────────────
// TheSportsDB covers the Pakistan Super League (league id 5067) — verified
// reachable 2026-10-22. Its 2026 season is complete and the 2027 schedule
// is not yet published, so today this returns only past fixtures. A future
// cron/ingest job can call this and insert upcoming fixtures into the
// `events` table (verified, source_name 'TheSportsDB — Pakistan Super
// League') once the PCB publishes the next season's schedule.
export async function fetchPslFixtures(season: string): Promise<WchEvent[]> {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/123/eventsseason.php?id=5067&s=${encodeURIComponent(season)}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { events?: Array<Record<string, string>> | null };
    const rows = json.events ?? [];
    return rows.map((ev) => ({
      id: `tsdb-${ev.idEvent}`,
      title: ev.strEvent,
      slug: `psl-${ev.idEvent}`,
      city_slug: null,
      venue: ev.strVenue ?? '',
      starts_at: ev.strTimestamp ?? `${ev.dateEvent}T00:00:00Z`,
      ends_at: null,
      category: 'sports' as WchEventCategory,
      description: `${ev.strLeague} — ${ev.strHomeTeam} vs ${ev.strAwayTeam}`,
      source_name: 'TheSportsDB — Pakistan Super League',
      source_url: 'https://www.thesportsdb.com/league/5067-Pakistan-Super-League',
      verified: true,
      status: 'approved' as const,
      last_verified_at: null,
      created_at: new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}
