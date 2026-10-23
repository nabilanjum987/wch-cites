// ─────────────────────────────────────────────────────────────────────────────
// Today's World (WP2 Slice 5 / Q5, frozen spec §5) — SERVER data.
// Computed live from Open-Meteo across a fixed sample of world cities:
// the next sunrise on earth, the hottest and coldest inhabited places
// in the sample right now. The "biggest event today" line uses real
// public-holiday data (date.nager.at) and is OMITTED when no sampled
// country has a holiday today — never invented. A line links inward
// only when its city is published (L1/L2).
// ─────────────────────────────────────────────────────────────────────────────

export interface WorldCity { name: string; country: string; lat: number; lng: number; href: string | null }

export const WORLD_SAMPLE: WorldCity[] = [
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, href: null },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, href: null },
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lng: 139.6917, href: null },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, href: null },
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.209, href: null },
  { name: 'Jacobabad', country: 'Pakistan', lat: 28.2819, lng: 68.4378, href: null },
  { name: 'Karachi', country: 'Pakistan', lat: 24.8607, lng: 67.0011, href: '/pakistan/sindh/karachi' },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, href: null },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, href: null },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, href: null },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, href: null },
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006, href: null },
  { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298, href: null },
  { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437, href: null },
  { name: 'Honolulu', country: 'United States', lat: 21.3099, lng: -157.8581, href: null },
  { name: 'Oymyakon', country: 'Russia', lat: 63.4608, lng: 142.7867, href: null },
];

export interface TodaysWorldData {
  sunrise: { city: WorldCity; localTime: string; inHours: number } | null;
  hottest: { city: WorldCity; temp: number } | null;
  coldest: { city: WorldCity; temp: number } | null;
  event: { name: string; country: string; href: string | null } | null;
}

async function jget(url: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const EVENT_COUNTRIES: { code: string; name: string; href: string | null }[] = [
  { code: 'PK', name: 'Pakistan', href: '/pakistan/punjab/lahore/events' },
  { code: 'AE', name: 'the UAE', href: null },
  { code: 'IN', name: 'India', href: null },
  { code: 'GB', name: 'the United Kingdom', href: null },
  { code: 'US', name: 'the United States', href: null },
];

export async function getTodaysWorld(): Promise<TodaysWorldData> {
  const out: TodaysWorldData = { sunrise: null, hottest: null, coldest: null, event: null };
  const lats = WORLD_SAMPLE.map((c) => c.lat).join(',');
  const lngs = WORLD_SAMPLE.map((c) => c.lng).join(',');
  const data = await jget(
    `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lngs}&current=temperature_2m&daily=sunrise&timezone=auto&forecast_days=2`,
    900,
  );
  if (Array.isArray(data)) {
    const now = Date.now();
    let nextSun: { city: WorldCity; epoch: number; localTime: string } | null = null;
    data.forEach((loc: any, i: number) => {
      const city = WORLD_SAMPLE[i];
      const temp = loc?.current?.temperature_2m;
      if (typeof temp === 'number') {
        if (!out.hottest || temp > out.hottest.temp) out.hottest = { city, temp: Math.round(temp) };
        if (!out.coldest || temp < out.coldest.temp) out.coldest = { city, temp: Math.round(temp) };
      }
      const off = typeof loc?.utc_offset_seconds === 'number' ? loc.utc_offset_seconds : 0;
      for (const iso of loc?.daily?.sunrise ?? []) {
        const epoch = Date.parse(`${iso}:00Z`) - off * 1000;
        if (epoch > now && (!nextSun || epoch < nextSun.epoch)) {
          const [hh, mi] = iso.split('T')[1].split(':').map(Number);
          const h12 = ((hh + 11) % 12) + 1;
          nextSun = { city, epoch, localTime: `${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}` };
        }
      }
    });
    if (nextSun) {
      out.sunrise = { city: nextSun.city, localTime: nextSun.localTime, inHours: Math.max(0, Math.round(((nextSun.epoch - now) / 3600000) * 10) / 10) };
    }
  }
  // Biggest event today — a real public holiday in a sampled country.
  const todayPk = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));
  const iso = `${todayPk.getFullYear()}-${String(todayPk.getMonth() + 1).padStart(2, '0')}-${String(todayPk.getDate()).padStart(2, '0')}`;
  const year = todayPk.getFullYear();
  for (const c of EVENT_COUNTRIES) {
    const holidays = await jget(`https://date.nager.at/api/v3/PublicHolidays/${year}/${c.code}`, 3600);
    const hit = Array.isArray(holidays) ? holidays.find((h: any) => h.date === iso) : null;
    if (hit) {
      out.event = { name: hit.name, country: c.name, href: c.href };
      break;
    }
  }
  return out;
}
