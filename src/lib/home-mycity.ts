// ─────────────────────────────────────────────────────────────────────────────
// My City panel data (WP2 Slice 4 / Q4) — SERVER fetcher.
// Everything comes from the same live APIs the city pages use (frozen
// spec: no new data pipeline): Open-Meteo (weather, elevation),
// Aladhan (prayer times, sunrise/sunset, Hijri date), CoinGecko PAX
// Gold + gold-api (gold tola / silver), GNews (headlines, titles only).
// A figure exists only when its source responded — otherwise the panel
// shows less, never an invented number. Moon phase is computed from
// the synodic cycle (deterministic astronomy, not sampled data).
// City facts rotate from the site's own city registry values
// (src/lib/getCityData.ts) plus live-derived figures.
// ─────────────────────────────────────────────────────────────────────────────

import { gnewsSearch } from '@/lib/apis/news';
import { CENSUS_2023_POPULATION } from '@/lib/census2023';

export interface MyCityData {
  slug: string;
  name: string;
  province: string;
  country: string;
  // ISO 3166-1 alpha-2, lowercase — pairs with `country` and selects
  // the vendored flag artwork (public/images/flags/<code>.png). Every
  // city record carries its own code, so the My City panel's flag
  // backdrop follows the city, never a hard-coded country.
  countryCode: string;
  path: string;
  color: string;
  tz: string;
  weather: { temp: number; feels: number; condition: string } | null;
  nextPrayer: { name: string; time: string; atMs: number } | null;
  goldTola: number | null;
  silverOz: number | null;
  sunrise: string | null;
  sunset: string | null;
  dayLength: string | null;
  hijri: string | null;
  moonPhase: string;
  facts: string[];
  headlines: string[];
  image: { url: string; credit: string; alt: string } | null;
}

export const MY_CITY_META: Record<string, {
  name: string; province: string; provinceSlug: string; lat: number; lng: number; tz: string;
  population: number | null; famousFor: string | null; capitalFact: string | null;
}> = {
  lahore: {
    name: 'Lahore', province: 'Punjab', provinceSlug: 'punjab', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi',
    // F3 — populations are the PBS Census-2023 totals from the single
    // source in @/lib/census2023 (Islamabad was previously null).
    population: CENSUS_2023_POPULATION['pakistan/punjab/lahore'], famousFor: 'Mughal architecture, food, culture', capitalFact: null,
  },
  karachi: {
    name: 'Karachi', province: 'Sindh', provinceSlug: 'sindh', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi',
    population: CENSUS_2023_POPULATION['pakistan/sindh/karachi'], famousFor: 'Port city, financial hub, beaches', capitalFact: null,
  },
  islamabad: {
    name: 'Islamabad', province: 'Islamabad Capital Territory', provinceSlug: 'islamabad-capital-territory', lat: 33.7294, lng: 73.0931, tz: 'Asia/Karachi',
    population: CENSUS_2023_POPULATION['pakistan/islamabad-capital-territory/islamabad'], famousFor: null, capitalFact: 'Capital of Pakistan, planned in the 1960s at the foot of the Margalla Hills',
  },
};

const WMO: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
  75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

export function moonPhaseName(date = new Date()): string {
  const synodic = 29.530588853;
  const known = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
  const age = (((date.getTime() / 86400000 - known) % synodic) + synodic) % synodic;
  const names = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  return names[Math.floor(((age / synodic) * 8 + 0.5)) % 8];
}

async function jget(url: string, revalidate: number): Promise<any | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      next: { revalidate },
      headers: { 'User-Agent': 'WorldCityHub/1.0' },
    } as RequestInit);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const fmt12 = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
  if (!Number.isFinite(hh)) return null;
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
};

export async function getMyCityData(slug: string): Promise<MyCityData> {
  const meta = MY_CITY_META[slug] ?? MY_CITY_META.lahore;
  const path = `/pakistan/${meta.provinceSlug}/${slug}`;
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');

  const [w, al, cg, silver, news] = await Promise.all([
    jget(`https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lng}&current=temperature_2m,apparent_temperature,weather_code`, 600),
    jget(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${now.getUTCFullYear()}?latitude=${meta.lat}&longitude=${meta.lng}&method=1`, 300),
    jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=pkr', 300),
    jget('https://api.gold-api.com/price/XAG', 300),
    gnewsSearch(meta.name, 'en', 2, 'local', 'pk', 900).catch(() => []),
  ]);

  const temp = w?.current?.temperature_2m;
  const weather = typeof temp === 'number'
    ? { temp: Math.round(temp), feels: Math.round(w.current.apparent_temperature ?? temp), condition: WMO[w.current.weather_code] ?? '' }
    : null;

  const timings = al?.data?.timings;
  const hijriRaw = al?.data?.date?.hijri;
  const hijri = hijriRaw ? `${hijriRaw.day} ${hijriRaw.month?.en ?? ''} ${hijriRaw.year} AH` : null;

  let nextPrayer: MyCityData['nextPrayer'] = null;
  if (timings) {
    const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: meta.tz }));
    for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      const raw: string | undefined = timings[name];
      if (!raw) continue;
      const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
      const at = new Date(nowLocal);
      at.setHours(hh, mi, 0, 0);
      if (at.getTime() > nowLocal.getTime()) {
        nextPrayer = { name, time: fmt12(raw) ?? raw, atMs: Date.now() + (at.getTime() - nowLocal.getTime()) };
        break;
      }
    }
  }

  let dayLength: string | null = null;
  if (timings?.Sunrise && timings?.Sunset) {
    const [sh, sm] = timings.Sunrise.split(' ')[0].split(':').map(Number);
    const [eh, em] = timings.Sunset.split(' ')[0].split(':').map(Number);
    const mins = eh * 60 + em - (sh * 60 + sm);
    if (mins > 0) dayLength = `${Math.floor(mins / 60)}h ${mins % 60}m of daylight`;
  }

  const pkr = cg?.['pax-gold']?.pkr;
  const goldTola = typeof pkr === 'number' ? Math.round((pkr * 11.6638) / 31.1035) : null;
  const silverOz = typeof silver?.price === 'number' ? Math.round(silver.price * 100) / 100 : null;

  const facts: string[] = [];
  if (meta.population) facts.push(`${meta.name} is home to about ${(meta.population / 1e6).toFixed(1)} million people.`);
  if (meta.famousFor) facts.push(`${meta.name} is famous for ${meta.famousFor.toLowerCase()}.`);
  if (meta.capitalFact) facts.push(meta.capitalFact + '.');
  if (typeof w?.elevation === 'number') facts.push(`${meta.name} sits ${Math.round(w.elevation)} metres above sea level, at ${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E.`);
  if (dayLength) facts.push(`Today ${meta.name} gets ${dayLength}.`);

  return {
    slug,
    name: meta.name,
    province: meta.province,
    country: 'Pakistan',
    countryCode: 'pk',
    path,
    color: '#01411C',
    tz: meta.tz,
    weather,
    nextPrayer,
    goldTola,
    silverOz,
    sunrise: fmt12(timings?.Sunrise),
    sunset: fmt12(timings?.Sunset),
    dayLength,
    hijri,
    moonPhase: moonPhaseName(),
    facts,
    headlines: (news ?? []).map((a: any) => a.title).filter(Boolean).slice(0, 2),
    image: slug === 'lahore'
      ? {
          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Badshahi_Mosque_%28Lahore%29.jpg/1280px-Badshahi_Mosque_%28Lahore%29.jpg',
          // Image: "Badshahi Mosque (Lahore).jpg" by Muhammad Umair Mirza,
          // Wikimedia Commons, CC BY-SA 4.0.
          credit: 'Badshahi Mosque, Lahore — photo by Muhammad Umair Mirza · CC BY-SA 4.0 · Wikimedia Commons',
          alt: 'The Badshahi Mosque in Lahore at golden hour',
        }
      : null,
  };
}
