// ─────────────────────────────────────────────────────────────────────────────
// Homepage search registry + preview figures (WP2 Slice 2 / Q2).
// The homepage search covers PUBLISHED entities only (Link Law L2/L6):
// the three QA-passed cities and the one published country. Figures are
// fetched client-side from the same keyless APIs the site already uses
// (Open-Meteo weather, Aladhan prayer, gold-api XAU gold via the shared
// F4 helper, World Bank) —
// a figure is shown only when its source responded; nothing is invented.
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchEntity {
  kind: 'city' | 'country';
  name: string;
  sub: string; // province or "Country"
  href: string;
  lat?: number;
  lng?: number;
  tz?: string;
}

import { getGoldPkr } from '@/lib/gold';

export const SEARCH_ENTITIES: SearchEntity[] = [
  { kind: 'city', name: 'Lahore', sub: 'Punjab, Pakistan', href: '/pakistan/punjab/lahore', lat: 31.5204, lng: 74.3587, tz: 'Asia/Karachi' },
  { kind: 'city', name: 'Karachi', sub: 'Sindh, Pakistan', href: '/pakistan/sindh/karachi', lat: 24.8607, lng: 67.0011, tz: 'Asia/Karachi' },
  { kind: 'city', name: 'Islamabad', sub: 'Islamabad Capital Territory, Pakistan', href: '/pakistan/islamabad-capital-territory/islamabad', lat: 33.7294, lng: 73.0931, tz: 'Asia/Karachi' },
  { kind: 'country', name: 'Pakistan', sub: 'Country · capital Islamabad', href: '/pakistan' },
];

export function matchEntities(query: string): SearchEntity[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  return SEARCH_ENTITIES.filter((e) => e.name.toLowerCase().includes(q)).slice(0, 5);
}

export interface PreviewFigures {
  weather?: string; // "31°C · Clear sky"
  nextPrayer?: string; // "Maghrib 5:41 PM"
  goldTola?: string; // "Rs 424,557 / tola"
  capital?: string;
  population?: string; // "240.5M (2024, World Bank)"
}

const WMO: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
  75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPreviewFigures(e: SearchEntity): Promise<PreviewFigures> {
  const out: PreviewFigures = {};
  if (e.kind === 'country') {
    out.capital = 'Islamabad';
    const pop = await jget('https://api.worldbank.org/v2/country/PAK/indicator/SP.POP.TOTL?format=json&per_page=1');
    const row = pop?.[1]?.[0];
    if (row?.value) {
      out.population = `${(row.value / 1e6).toFixed(1)}M (${row.date}, World Bank)`;
    }
    return out;
  }
  const [w, p, g] = await Promise.all([
    jget(`https://api.open-meteo.com/v1/forecast?latitude=${e.lat}&longitude=${e.lng}&current=temperature_2m,weather_code`),
    jget(`https://api.aladhan.com/v1/timings/${String(new Date().getUTCDate()).padStart(2, '0')}-${String(new Date().getUTCMonth() + 1).padStart(2, '0')}-${new Date().getUTCFullYear()}?latitude=${e.lat}&longitude=${e.lng}&method=1`),
    getGoldPkr().catch(() => null),
  ]);
  const temp = w?.current?.temperature_2m;
  if (typeof temp === 'number') {
    out.weather = `${Math.round(temp)}°C · ${WMO[w.current.weather_code] ?? '—'}`;
  }
  const timings = p?.data?.timings;
  if (timings && e.tz) {
    const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: e.tz }));
    for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      const raw: string | undefined = timings[name];
      if (!raw) continue;
      const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
      const at = new Date(nowLocal);
      at.setHours(hh, mi, 0, 0);
      if (at.getTime() > nowLocal.getTime()) {
        const h12 = ((hh + 11) % 12) + 1;
        out.nextPrayer = `${name} ${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
        break;
      }
    }
    if (!out.nextPrayer && timings.Fajr) out.nextPrayer = `Fajr ${timings.Fajr.split(' ')[0]} (tomorrow)`;
  }
  if (g) {
    const tola = Math.round(g.perTola);
    out.goldTola = `Rs ${tola.toLocaleString('en-US')} / tola`;
  }
  return out;
}
