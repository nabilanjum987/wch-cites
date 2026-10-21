import { CityEvent, EventCategory, LevelTab, TimeTab, RecurringEvent, NationalEvent, PendingEvent } from '../../types/city';
import { getSupabase } from '../supabase';

const TICKETMASTER_KEY = process.env.NEXT_PUBLIC_TICKETMASTER_KEY as string | undefined;

// ─── ticketmaster helpers ────────────────────────────────────────────────────

function buildTicketmasterUrl(
  city: string,
  country: string,
  category: string | null,
  timeTab: TimeTab
): string {
  const base = 'https://app.ticketmaster.com/discovery/v2/events.json';
  const params = new URLSearchParams();
  if (TICKETMASTER_KEY) params.set('apikey', TICKETMASTER_KEY);
  params.set('city', city);
  params.set('countryCode', country);
  params.set('size', '50');
  params.set('sort', 'date,asc');

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00Z`;

  if (timeTab === 'today') {
    const end = new Date(now); end.setHours(23, 59, 59);
    params.set('startDateTime', fmt(now)); params.set('endDateTime', fmt(end));
  } else if (timeTab === 'tomorrow') {
    const start = new Date(now); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0);
    const end = new Date(start); end.setHours(23, 59, 59);
    params.set('startDateTime', fmt(start)); params.set('endDateTime', fmt(end));
  } else if (timeTab === 'weekend') {
    const day = now.getDay();
    const daysToSat = (6 - day + 7) % 7 || 7;
    const sat = new Date(now); sat.setDate(sat.getDate() + daysToSat); sat.setHours(0, 0, 0);
    const sun = new Date(sat); sun.setDate(sun.getDate() + 1); sun.setHours(23, 59, 59);
    params.set('startDateTime', fmt(sat)); params.set('endDateTime', fmt(sun));
  } else if (timeTab === 'week') {
    const end = new Date(now); end.setDate(end.getDate() + 7);
    params.set('startDateTime', fmt(now)); params.set('endDateTime', fmt(end));
  } else if (timeTab === 'month') {
    const end = new Date(now); end.setMonth(end.getMonth() + 1);
    params.set('startDateTime', fmt(now)); params.set('endDateTime', fmt(end));
  } else {
    params.set('startDateTime', fmt(now));
  }

  const segmentMap: Partial<Record<EventCategory, string>> = {
    sports: 'KZFzniwnSyZfZ7v7nE',
    music: 'KZFzniwnSyZfZ7v7nJ',
    culture: 'KZFzniwnSyZfZ7v7na',
    film: 'KZFzniwnSyZfZ7v7nn',
    family: 'KZFzniwnSyZfZ7v7n1',
  };
  if (category && segmentMap[category]) params.set('segmentId', segmentMap[category]!);

  return `${base}?${params.toString()}`;
}

function mapTMEventToCity(ev: Record<string, unknown>, level: LevelTab): CityEvent {
  const dates = ev.dates as Record<string, unknown> | undefined;
  const start = dates?.start as Record<string, unknown> | undefined;
  const priceRanges = ev.priceRanges as Array<Record<string, unknown>> | undefined;
  const embedded = ev._embedded as Record<string, unknown> | undefined;
  const venues = embedded?.venues as Array<Record<string, unknown>> | undefined;
  const venue = venues?.[0];
  const images = ev.images as Array<Record<string, unknown>> | undefined;
  const location = venue?.location as Record<string, unknown> | undefined;

  const startISO = (start?.dateTime as string | undefined) ?? (start?.localDate as string | undefined) ?? new Date().toISOString();
  const endISO = new Date(new Date(startISO).getTime() + 2 * 60 * 60 * 1000).toISOString();

  return {
    id: (ev.id as string) ?? String(Math.random()),
    title: (ev.name as string) ?? 'Event',
    description: ((ev.info as string | undefined) ?? (ev.pleaseNote as string | undefined) ?? '').slice(0, 200),
    venue: (venue?.name as string | undefined) ?? 'TBD',
    address: [(venue?.address as Record<string, unknown> | undefined)?.line1, (venue?.city as Record<string, unknown> | undefined)?.name].filter(Boolean).join(', '),
    city: (venue?.city as Record<string, unknown> | undefined)?.name as string ?? '',
    country: (venue?.country as Record<string, unknown> | undefined)?.countryCode as string ?? '',
    category: 'culture',
    start_time: startISO,
    end_time: endISO,
    image_url: images?.find((i) => i.ratio === '16_9' && (i.width as number) > 500)?.url as string | undefined ?? images?.[0]?.url as string | undefined,
    ticket_url: (ev.url as string | undefined),
    is_free: !priceRanges || priceRanges.length === 0,
    price_from: priceRanges?.[0]?.min as number | undefined,
    currency: priceRanges?.[0]?.currency as string | undefined,
    level,
    lat: location?.latitude ? parseFloat(location.latitude as string) : undefined,
    lng: location?.longitude ? parseFloat(location.longitude as string) : undefined,
  };
}

// ─── main fetch ──────────────────────────────────────────────────────────────

export async function fetchCityEvents(
  city: string,
  country: string,
  countryCode: string,
  cityLat: number,
  cityLng: number,
  timeTab: TimeTab,
  category: string | null,
  level: LevelTab
): Promise<CityEvent[]> {
  // Truth rule: without a Ticketmaster key there is no real events feed,
  // so the page shows its honest empty state. The old code fabricated a
  // full calendar of invented events (names, dates, venues, prices) —
  // removed. Add NEXT_PUBLIC_TICKETMASTER_KEY in Vercel to enable this.
  if (!TICKETMASTER_KEY) {
    return [];
  }

  try {
    const url = buildTicketmasterUrl(city, countryCode, category, timeTab);
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error('Ticketmaster API error');
    const json = await res.json() as Record<string, unknown>;
    const embedded = json._embedded as Record<string, unknown> | undefined;
    const rawEvents = (embedded?.events as Array<Record<string, unknown>> | undefined) ?? [];
    return rawEvents.map((e) => mapTMEventToCity(e, level));
  } catch {
    return [];
  }
}

// ─── public holidays (date.nager.at) ─────────────────────────────────────────

export async function fetchPublicHolidays(countryCode: string, year?: number): Promise<NationalEvent[]> {
  const y = year ?? new Date().getFullYear();
  try {
    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${y}/${countryCode}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('Holiday API error');
    const data = await res.json() as Array<{ date: string; localName: string; name: string }>;
    return data.map((h) => ({
      id: `hol-${h.date}-${h.localName}`,
      title: h.localName || h.name,
      date: h.date,
      type: 'holiday' as const,
      description: h.name,
      country_code: countryCode,
    }));
  } catch {
    return [];
  }
}

// ─── sports events (TheSportsDB) ────────────────────────────────────────────

export async function fetchSportsEvents(countryCode: string): Promise<NationalEvent[]> {
  const countryNames: Record<string, string> = {
    PK: 'Pakistan', IN: 'India', US: 'USA', GB: 'England', DE: 'Germany',
    FR: 'France', SA: 'Saudi_Arabia', AE: 'UAE', TR: 'Turkey', JP: 'Japan',
  };
  const name = countryNames[countryCode] ?? '';
  if (!name) return [];
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/searchevents.php?e=${encodeURIComponent(name)}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) throw new Error('SportsDB error');
    const json = await res.json() as { event?: Array<Record<string, string>> };
    const events = json.event ?? [];
    return events.slice(0, 10).map((ev, i) => ({
      id: `sport-${i}-${ev.idEvent ?? i}`,
      title: ev.strEvent ?? 'Sports Event',
      date: ev.dateEvent ?? new Date().toISOString().slice(0, 10),
      type: 'sports' as const,
      description: `${ev.strLeague ?? ''} — ${ev.strVenue ?? ''}`,
      country_code: countryCode,
    }));
  } catch {
    return [];
  }
}

// ─── recurring events (mock + could be from Supabase later) ─────────────────

export function fetchRecurringEvents(city: string): RecurringEvent[] {
  // This used to invent a weekly calendar (run clubs, book circles, sufi
  // nights with made-up venues and times) for every city. Until recurring
  // events come from a real source (the planned Supabase table), the
  // section stays empty — showing less beats showing fiction.
  void city;
  return [];
}

// ─── submit pending event to Supabase ────────────────────────────────────────

export async function submitPendingEvent(event: PendingEvent): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('pending_events')
      .insert([{
        name: event.name,
        date: event.date,
        venue: event.venue,
        category: event.category,
        website: event.website,
        city: event.city,
        country_code: event.country_code,
        status: 'pending',
      }]);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
