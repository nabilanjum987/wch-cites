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

// ─── mock event generation ───────────────────────────────────────────────────

const MOCK_IMAGES = [
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
  'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg',
  'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg',
  'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
  'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg',
  'https://images.pexels.com/photos/1540319/pexels-photo-1540319.jpeg',
  'https://images.pexels.com/photos/167636/pexels-photo-167636.jpeg',
  'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
  'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg',
  'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
];

function generateMockEvents(city: string, country: string, cityLat: number, cityLng: number, timeTab: TimeTab): CityEvent[] {
  const now = new Date();
  const categories: EventCategory[] = ['sports', 'culture', 'music', 'literature', 'food', 'religious', 'business', 'film', 'outdoor', 'family'];
  const venues = ['City Arena', 'Grand Hall', 'Cultural Centre', 'Open Air Park', 'Convention Center', 'Main Theatre'];
  const levels: LevelTab[] = ['local', 'provincial', 'national', 'global'];

  const offsets: Record<TimeTab, number[]> = {
    today: [0.2, 1, 2, 3, 4, 5],
    tomorrow: [24, 25, 26, 27],
    weekend: [48, 52, 60, 65],
    week: [0.5, 24, 48, 72, 96, 120, 144],
    month: [0.3, 24, 72, 168, 336, 500, 600],
    upcoming: [0.1, 12, 48, 96, 240, 720],
  };

  const names = [
    `${city} International Music Festival`,
    `${city} Food & Culture Fair`,
    `${city} Sports Championship`,
    `${city} Business Summit`,
    `${city} Film Screening Night`,
    `${city} Heritage Walk`,
    `${city} Open Air Concert`,
    `${city} Literary Festival`,
    `${city} Community Family Day`,
    `${city} Religious Gathering`,
  ];

  return offsets[timeTab].map((h, i) => {
    const start = new Date(now.getTime() + h * 3600 * 1000);
    const end = new Date(start.getTime() + 2 * 3600 * 1000);
    const cat = categories[i % categories.length];
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    return {
      id: `mock-${i}-${city}`,
      title: names[i % names.length],
      description: `Join us for an exciting ${cat} event in the heart of ${city}. A wonderful opportunity to connect with the community.`,
      venue: venues[i % venues.length],
      address: `${100 + i * 10} Main Street, ${city}`,
      city,
      country,
      category: cat,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      image_url: MOCK_IMAGES[i % 10],
      ticket_url: '#',
      is_free: i % 3 === 0,
      price_from: i % 3 !== 0 ? 10 + i * 5 : undefined,
      currency: 'USD',
      level: levels[i % 4],
      lat: cityLat + latOffset,
      lng: cityLng + lngOffset,
    };
  });
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
  if (!TICKETMASTER_KEY) {
    const mock = generateMockEvents(city, country, cityLat, cityLng, timeTab);
    return mock.filter((e) => {
      if (level !== 'local' && e.level !== level) return false;
      if (category && e.category !== category) return false;
      return true;
    });
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
    return generateMockEvents(city, country, cityLat, cityLng, timeTab).filter((e) => {
      if (level !== 'local' && e.level !== level) return false;
      if (category && e.category !== category) return false;
      return true;
    });
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
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['08:00', '10:00', '14:00', '16:00', '18:00', '20:00', '21:30'];
  const venues = ['City Arena', 'Grand Hall', 'Cultural Centre', 'Open Air Park', 'Convention Center'];
  const cats: EventCategory[] = ['sports', 'culture', 'music', 'food', 'religious', 'business', 'outdoor'];
  const names = [
    `${city} Morning Run Club`,
    `${city} Book Circle`,
    `Sufi Music Night`,
    `${city} Food Market`,
    `Friday Prayer Gathering`,
    `${city} Startup Meetup`,
    `${city} Heritage Walk`,
  ];

  return names.map((title, i) => ({
    id: `recurring-${i}`,
    title,
    venue: venues[i % venues.length],
    day: days[i % days.length],
    time: times[i % times.length],
    category: cats[i % cats.length],
    is_free: i % 2 === 0,
    website: i % 3 === 0 ? '#' : undefined,
  }));
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
