// City-vs-city comparison data (Page 15 of the locked plan).
// Everything shown is fetched live or read from the site's own city
// database: weather + AQI (Open-Meteo/OpenWeather via the weather lib),
// prayer times (Aladhan), population/timezone (city DB). Categories with
// no reliable free source (cost-of-living indices, safety scores,
// salaries) are NOT shown — the doctrine is "show less, never invent".

import { getCityData } from '@/lib/getCityData';
import { fetchWeatherData, fetchAQIData } from '@/lib/apis/weather';
import { fetchPrayerTimes } from '@/lib/apis/prayer';
import type { City } from '@/types/city';

export interface CompareCityRef {
  citySlug: string;
  provinceSlug: string;
  countrySlug: string;
  label: string;
}

export const COMPARE_CITIES: CompareCityRef[] = [
  { citySlug: 'lahore', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Lahore' },
  { citySlug: 'karachi', provinceSlug: 'sindh', countrySlug: 'pakistan', label: 'Karachi' },
  { citySlug: 'islamabad', provinceSlug: 'islamabad-capital-territory', countrySlug: 'pakistan', label: 'Islamabad' },
  { citySlug: 'faisalabad', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Faisalabad' },
  { citySlug: 'rawalpindi', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Rawalpindi' },
  { citySlug: 'multan', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Multan' },
];

export const POPULAR_PAIRS: [string, string][] = [
  ['lahore', 'karachi'],
  ['lahore', 'islamabad'],
  ['karachi', 'islamabad'],
  ['faisalabad', 'lahore'],
  ['rawalpindi', 'islamabad'],
  ['faisalabad', 'multan'],
];

export function findCompareCity(slug: string): CompareCityRef | null {
  return COMPARE_CITIES.find((c) => c.citySlug === slug) ?? null;
}

export function cityPath(ref: CompareCityRef): string {
  return `/${ref.countrySlug}/${ref.provinceSlug}/${ref.citySlug}`;
}

export interface CityCompareData {
  ref: CompareCityRef;
  city: City;
  temp: number | null;
  feelsLike: number | null;
  humidity: number | null;
  windKmh: number | null;
  condition: string | null;
  aqi: number | null;
  aqiLevel: string | null;
  prayers: { name: string; time: string }[] | null;
  localTime: string;
  comfort: number | null;
}

// Transparent comfort score: starts at 100, penalises heat/cold away
// from ~22°C feels-like, high humidity and strong wind. A WCH-computed
// guide from live weather — labelled as such on the page.
export function comfortScore(feelsLike: number | null, humidity: number | null, windKmh: number | null): number | null {
  if (feelsLike == null) return null;
  let s = 100 - Math.abs(feelsLike - 22) * 3;
  if (humidity != null) s -= Math.max(0, humidity - 60) * 0.4;
  if (windKmh != null) s -= Math.max(0, windKmh - 25) * 0.5;
  return Math.max(5, Math.min(100, Math.round(s)));
}

export function aqiScore(aqi: number | null): number | null {
  if (aqi == null) return null;
  return Math.max(0, Math.min(100, Math.round(100 - aqi / 3)));
}

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

// Cities whose verified data package exists (Round 2, R4) but whose DB row is
// not live yet resolve from the package identity — the package figures are
// the same verified set (Wikidata-checked coords/population), so the pair
// renders honestly before the city itself activates.
import { MULTAN } from '@/lib/data/city-packages/multan';
import { FAISALABAD } from '@/lib/data/city-packages/faisalabad';

const PACKAGE_CITY_FALLBACK: Record<string, City> = {
  multan: MULTAN.identity as City,
  faisalabad: FAISALABAD.identity as City,
};

export async function getCityCompare(ref: CompareCityRef): Promise<CityCompareData | null> {
  // The city DB carries zeroed stub rows for unpublished cities (population 0,
  // coords 0,0, "waiting to be discovered"): a stub is not data. A verified
  // package outranks a stub; a real DB row outranks the package.
  const dbCity = await getCityData(ref.countrySlug, ref.provinceSlug, ref.citySlug);
  const isStub = dbCity != null && (dbCity.population === 0 || (dbCity.lat === 0 && dbCity.lng === 0));
  const city = (!isStub && dbCity) || PACKAGE_CITY_FALLBACK[ref.citySlug] || dbCity;
  if (!city) return null;
  const [w, aqiData, prayerDay] = await Promise.all([
    fetchWeatherData(city.lat, city.lng).catch(() => null),
    fetchAQIData(city.lat, city.lng, city.name).catch(() => null),
    fetchPrayerTimes(city.lat, city.lng, 1, 1).catch(() => null),
  ]);
  const cur = w?.current ?? null;
  const timings = (prayerDay as { timings?: Record<string, string> } | null)?.timings;
  const prayers = timings
    ? PRAYER_NAMES.filter((n) => timings[n]).map((n) => ({
        name: n,
        time: timings[n].replace(/[^0-9:]/g, ''),
      }))
    : null;
  let localTime = '';
  try {
    localTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: city.timezone, hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(new Date());
  } catch { localTime = ''; }
  return {
    ref,
    city,
    temp: cur?.temp ?? null,
    feelsLike: cur?.feels_like ?? null,
    humidity: cur?.humidity ?? null,
    windKmh: cur?.wind_speed ?? null,
    condition: (cur as { description?: string } | null)?.description ?? null,
    aqi: aqiData?.aqi ?? null,
    aqiLevel: aqiData?.level ?? null,
    prayers,
    localTime,
    comfort: comfortScore(cur?.feels_like ?? null, cur?.humidity ?? null, cur?.wind_speed ?? null),
  };
}

export async function getPairCompare(aSlug: string, bSlug: string): Promise<{ a: CityCompareData; b: CityCompareData } | null> {
  const ra = findCompareCity(aSlug);
  const rb = findCompareCity(bSlug);
  if (!ra || !rb || aSlug === bSlug) return null;
  const [a, b] = await Promise.all([getCityCompare(ra), getCityCompare(rb)]);
  if (!a || !b) return null;
  return { a, b };
}


// ── Province entities (Round 2, R5 — minimal extension of the layer) ───────
// Figures: Pakistan Bureau of Statistics, 7th Population & Housing Census
// 2023 (National Census Report, Table 4.2: area, population, density,
// household size; Table 2.9: urban/rural split; growth = census annualized
// 2017→2023 rate). Density and urban share are computed from those counts
// and labelled computed. Capital weather is live (Open-Meteo via the
// weather lib) at the capital's coordinates.
export interface CompareProvince {
  slug: string;
  name: string;
  capitalName: string;
  capitalLat: number;
  capitalLng: number;
  population2023: number;
  areaKm2: number;
  urbanPopulation2023: number;
  growthPct: number;
}

export const COMPARE_PROVINCES: CompareProvince[] = [
  { slug: 'punjab', name: 'Punjab', capitalName: 'Lahore', capitalLat: 31.5204, capitalLng: 74.3587, population2023: 127688922, areaKm2: 205345, urbanPopulation2023: 51975967, growthPct: 2.53 },
  { slug: 'sindh', name: 'Sindh', capitalName: 'Karachi', capitalLat: 24.8607, capitalLng: 67.0011, population2023: 55696147, areaKm2: 140914, urbanPopulation2023: 30056739, growthPct: 2.57 },
  { slug: 'khyber-pakhtunkhwa', name: 'Khyber Pakhtunkhwa', capitalName: 'Peshawar', capitalLat: 34.0144, capitalLng: 71.5675, population2023: 40856097, areaKm2: 101741, urbanPopulation2023: 6131296, growthPct: 2.38 },
  { slug: 'balochistan', name: 'Balochistan', capitalName: 'Quetta', capitalLat: 30.1958, capitalLng: 67.0172, population2023: 14894402, areaKm2: 347190, urbanPopulation2023: 4611828, growthPct: 3.2 },
];

export const PROVINCE_PAIRS: [string, string][] = [
  ['punjab', 'sindh'],
  ['punjab', 'khyber-pakhtunkhwa'],
  ['sindh', 'balochistan'],
];

export const PROVINCE_VERDICTS: Record<string, string> = {
  'punjab-vs-sindh': 'Punjab holds 2.3x Sindh’s population, but Sindh is Pakistan’s most urbanised province — 54% urban against Punjab’s 41%, powered by Karachi.',
  'punjab-vs-khyber-pakhtunkhwa': 'Punjab holds 3.1x KP’s people on twice the land; KP remains the most rural large province — about 85% of its people live outside cities.',
  'sindh-vs-balochistan': 'Balochistan spans 2.5x Sindh’s area with barely a quarter of its people — about 43 people per km² against Sindh’s 395.',
};

export function findProvince(slug: string): CompareProvince | null {
  return COMPARE_PROVINCES.find((p) => p.slug === slug) ?? null;
}

export interface EntitySide {
  name: string;
  sub: string;
}

export interface EntityRow {
  label: string;
  a: string;
  b: string;
  note?: string;
}

export interface EntityCompareData {
  kind: 'province' | 'country';
  a: EntitySide;
  b: EntitySide;
  rows: EntityRow[];
  verdict: string;
  sourceNote: string;
}

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');

export async function getProvinceCompare(aSlug: string, bSlug: string): Promise<EntityCompareData | null> {
  const pa = findProvince(aSlug);
  const pb = findProvince(bSlug);
  if (!pa || !pb || aSlug === bSlug) return null;
  const [wa, wb] = await Promise.all([
    fetchWeatherData(pa.capitalLat, pa.capitalLng).catch(() => null),
    fetchWeatherData(pb.capitalLat, pb.capitalLng).catch(() => null),
  ]);
  const side = (p: CompareProvince): EntitySide => ({ name: p.name, sub: `Capital: ${p.capitalName}` });
  const wx = (w: Awaited<ReturnType<typeof fetchWeatherData>>) =>
    w?.current ? `${Math.round(w.current.temp)}°C now in the capital` : 'Feed unavailable';
  const rows: EntityRow[] = [
    { label: 'Population (2023 census)', a: fmtInt(pa.population2023), b: fmtInt(pb.population2023) },
    { label: 'Area', a: `${fmtInt(pa.areaKm2)} km²`, b: `${fmtInt(pb.areaKm2)} km²` },
    { label: 'Population density (computed)', a: `${fmtInt(pa.population2023 / pa.areaKm2)} /km²`, b: `${fmtInt(pb.population2023 / pb.areaKm2)} /km²`, note: 'Population ÷ area, from the census counts above.' },
    { label: 'Urban share (computed)', a: `${((pa.urbanPopulation2023 / pa.population2023) * 100).toFixed(1)}%`, b: `${((pb.urbanPopulation2023 / pb.population2023) * 100).toFixed(1)}%`, note: 'Urban population ÷ total (PBS Table 2.9 counts).' },
    { label: 'Annual growth 2017→2023', a: `${pa.growthPct}%`, b: `${pb.growthPct}%` },
    { label: 'Capital weather now (live)', a: `${pa.capitalName}: ${wx(wa)}`, b: `${pb.capitalName}: ${wx(wb)}`, note: 'Open-Meteo, sampled at render.' },
  ];
  return {
    kind: 'province',
    a: side(pa),
    b: side(pb),
    rows,
    verdict: PROVINCE_VERDICTS[`${aSlug}-vs-${bSlug}`] ?? PROVINCE_VERDICTS[`${bSlug}-vs-${aSlug}`] ?? '',
    sourceNote: 'Population, area, urban counts and growth: Pakistan Bureau of Statistics, 7th Population & Housing Census 2023 (National Census Report, Tables 4.2 and 2.9). Capital weather: Open-Meteo, live.',
  };
}

// ── Country pair: Pakistan vs India (World Bank, one dataset both sides) ───
// Only indicators that return a value for BOTH countries are shown — the
// figure sets genuinely match or the row does not exist. Years are printed
// per side (World Bank most-recent-value can differ by a year).
const WB_PAIR_INDICATORS: { code: string; label: string; format: (v: number) => string }[] = [
  { code: 'SP.POP.TOTL', label: 'Population', format: (v) => fmtInt(v) },
  { code: 'NY.GDP.MKTP.CD', label: 'GDP (current US$)', format: (v) => `$${(v / 1e12).toFixed(2)} trillion` },
  { code: 'NY.GDP.PCAP.CD', label: 'GDP per capita (current US$)', format: (v) => `$${fmtInt(v)}` },
  { code: 'FP.CPI.TOTL.ZG', label: 'Inflation (annual %)', format: (v) => `${v.toFixed(1)}%` },
  { code: 'SL.UEM.TOTL.ZS', label: 'Unemployment (% of labour force)', format: (v) => `${v.toFixed(1)}%` },
  { code: 'SP.DYN.LE00.IN', label: 'Life expectancy (years)', format: (v) => v.toFixed(1) },
  { code: 'AG.LND.TOTL.K2', label: 'Land area', format: (v) => `${fmtInt(v)} km²` },
];

async function wbLatest(iso2: string, indicator: string): Promise<{ value: number; year: string } | null> {
  try {
    const r = await fetch(`https://api.worldbank.org/v2/country/${iso2}/indicator/${indicator}?format=json&mrv=1`, { next: { revalidate: 86400 } });
    if (!r.ok) return null;
    const j = await r.json();
    const row = Array.isArray(j) ? j[1]?.[0] : null;
    if (!row || typeof row.value !== 'number') return null;
    return { value: row.value, year: String(row.date) };
  } catch { return null; }
}

export async function getCountryPairCompare(): Promise<EntityCompareData | null> {
  const rows: EntityRow[] = [];
  let gdpPk: number | null = null;
  let gdpIn: number | null = null;
  for (const ind of WB_PAIR_INDICATORS) {
    const [pk, inn] = await Promise.all([wbLatest('PK', ind.code), wbLatest('IN', ind.code)]);
    if (pk == null || inn == null) continue; // unmatched indicator → no row
    if (ind.code === 'NY.GDP.MKTP.CD') { gdpPk = pk.value; gdpIn = inn.value; }
    rows.push({ label: ind.label, a: ind.format(pk.value), b: ind.format(inn.value), note: `World Bank ${ind.code} · Pakistan ${pk.year}, India ${inn.year}` });
  }
  if (rows.length < 3) return null;
  const verdict = gdpPk && gdpIn
    ? `On the same World Bank vintage, India’s GDP is about ${(gdpIn / gdpPk).toFixed(1)}x Pakistan’s — the gap per person is far smaller than the gap in totals.`
    : 'Two neighbours on one dataset: every figure above comes from the same World Bank series for both countries.';
  return {
    kind: 'country',
    a: { name: 'Pakistan', sub: 'World Bank country data (ISO2 PK)' },
    b: { name: 'India', sub: 'World Bank country data (ISO2 IN)' },
    rows,
    verdict,
    sourceNote: 'All figures: World Bank World Development Indicators API, most recent value per indicator, fetched for both countries with the identical series codes (shown per row). A row appears only when both countries report the indicator.',
  };
}
