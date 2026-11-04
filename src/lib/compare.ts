// City-vs-city comparison data (Page 15 of the locked plan).
// Everything shown is fetched live or read from the site's own city
// database: weather + AQI (Open-Meteo/OpenWeather via the weather lib),
// prayer times (Aladhan), population/timezone (city DB). Categories with
// no reliable free source (cost-of-living indices, safety scores,
// salaries) are NOT shown: the doctrine is "show less, never invent".

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

// Rawalpindi is NOT a compare city: its DB row is a zeroed stub
// (population 0, coordinates 0,0, placeholder tagline), so every pair
// involving it 404s. See the stub defence in getCityCompare, which
// applies to ANY city, not just this one.
export const COMPARE_CITIES: CompareCityRef[] = [
  { citySlug: 'lahore', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Lahore' },
  { citySlug: 'karachi', provinceSlug: 'sindh', countrySlug: 'pakistan', label: 'Karachi' },
  { citySlug: 'islamabad', provinceSlug: 'islamabad-capital-territory', countrySlug: 'pakistan', label: 'Islamabad' },
  { citySlug: 'faisalabad', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Faisalabad' },
  { citySlug: 'multan', provinceSlug: 'punjab', countrySlug: 'pakistan', label: 'Multan' },
];

export function findCompareCity(slug: string): CompareCityRef | null {
  return COMPARE_CITIES.find((c) => c.citySlug === slug) ?? null;
}

export function cityPath(ref: CompareCityRef): string {
  return `/${ref.countrySlug}/${ref.provinceSlug}/${ref.citySlug}`;
}

// ── Canonical pair registry (B6) ───────────────────────────────────────────
// ONE registry decides which compare URLs exist. The sitemap generates
// its compare URLs from this list only, a reversed URL permanent-redirects
// to the registry form, and any pair not listed here (in either order)
// 404s. Contents: the published city pairs, the three province pairs, the
// country pairs, the continent pairs and the ocean pairs. The old
// rawalpindi-vs-islamabad sitemap pair is gone with the Rawalpindi stub
// (B1); lahore-vs-multan takes the sixth city slot so the registry stays
// at the published count. A pair enters the registry only when BOTH sides
// carry sourced figures for the shared rows of its kind: countries on the
// World Bank indicator set, continents on World Bank country data grouped
// by the site's published continent mapping, oceans on the sourced fact
// set each ocean page already prints.
export interface CanonicalPair {
  slug: string;
  kind: 'city' | 'province' | 'country' | 'continent' | 'ocean';
  a: string;
  b: string;
}

const pair = (kind: CanonicalPair['kind'], a: string, b: string): CanonicalPair => ({
  slug: `${a}-vs-${b}`,
  kind,
  a,
  b,
});

export const CANONICAL_PAIRS: CanonicalPair[] = [
  pair('city', 'lahore', 'karachi'),
  pair('city', 'lahore', 'islamabad'),
  pair('city', 'karachi', 'islamabad'),
  pair('city', 'faisalabad', 'lahore'),
  pair('city', 'faisalabad', 'multan'),
  pair('city', 'lahore', 'multan'),
  pair('province', 'punjab', 'sindh'),
  pair('province', 'punjab', 'khyber-pakhtunkhwa'),
  pair('province', 'sindh', 'balochistan'),
  pair('country', 'pakistan', 'india'),
  pair('country', 'pakistan', 'saudi-arabia'),
  pair('country', 'pakistan', 'united-arab-emirates'),
  pair('country', 'india', 'saudi-arabia'),
  pair('country', 'india', 'united-arab-emirates'),
  pair('country', 'saudi-arabia', 'united-arab-emirates'),
  pair('continent', 'asia', 'africa'),
  pair('continent', 'asia', 'europe'),
  pair('continent', 'asia', 'north-america'),
  pair('continent', 'asia', 'oceania'),
  pair('continent', 'africa', 'europe'),
  pair('continent', 'europe', 'north-america'),
  pair('continent', 'north-america', 'south-america'),
  pair('ocean', 'pacific-ocean', 'atlantic-ocean'),
  pair('ocean', 'pacific-ocean', 'indian-ocean'),
  pair('ocean', 'pacific-ocean', 'arctic-ocean'),
  pair('ocean', 'pacific-ocean', 'southern-ocean'),
  pair('ocean', 'pacific-ocean', 'arabian-sea'),
  pair('ocean', 'atlantic-ocean', 'indian-ocean'),
  pair('ocean', 'atlantic-ocean', 'arctic-ocean'),
  pair('ocean', 'atlantic-ocean', 'southern-ocean'),
  pair('ocean', 'atlantic-ocean', 'arabian-sea'),
  pair('ocean', 'indian-ocean', 'arctic-ocean'),
  pair('ocean', 'indian-ocean', 'southern-ocean'),
  pair('ocean', 'indian-ocean', 'arabian-sea'),
  pair('ocean', 'arctic-ocean', 'southern-ocean'),
  pair('ocean', 'arctic-ocean', 'arabian-sea'),
  pair('ocean', 'southern-ocean', 'arabian-sea'),
];

export const CANONICAL_CITY_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'city');
export const CANONICAL_PROVINCE_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'province');
export const CANONICAL_COUNTRY_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'country');
export const CANONICAL_CONTINENT_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'continent');
export const CANONICAL_OCEAN_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'ocean');

/** City pairs in the registry, in registry order (hub chips, other-pairs lists). */
export const POPULAR_PAIRS: [string, string][] = CANONICAL_CITY_PAIRS.map((p) => [p.a, p.b]);

/** Province pairs in the registry, in registry order. */
export const PROVINCE_PAIRS: [string, string][] = CANONICAL_PROVINCE_PAIRS.map((p) => [p.a, p.b]);

/** Country pairs in the registry, in registry order. */
export const COUNTRY_PAIRS: [string, string][] = CANONICAL_COUNTRY_PAIRS.map((p) => [p.a, p.b]);

/** Continent pairs in the registry, in registry order. */
export const CONTINENT_PAIRS: [string, string][] = CANONICAL_CONTINENT_PAIRS.map((p) => [p.a, p.b]);

/** Ocean pairs in the registry, in registry order. */
export const OCEAN_PAIRS: [string, string][] = CANONICAL_OCEAN_PAIRS.map((p) => [p.a, p.b]);

/**
 * Resolve two slugs against the registry. Returns the canonical pair and
 * whether the caller asked for it in reverse order (the page then
 * permanent-redirects to the registry form), or null when the pair is
 * not published in either order.
 */
export function findCanonicalPair(
  a: string,
  b: string,
): { pair: CanonicalPair; reversed: boolean } | null {
  if (a === b) return null;
  const fwd = CANONICAL_PAIRS.find((p) => p.a === a && p.b === b);
  if (fwd) return { pair: fwd, reversed: false };
  const rev = CANONICAL_PAIRS.find((p) => p.a === b && p.b === a);
  if (rev) return { pair: rev, reversed: true };
  return null;
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
// guide from live weather, labelled as such on the page. The exact
// formula is published in the method footnote on the pair pages:
// 100 - |feels-like - 22| x 3, minus 0.4 per humidity point above 60%
// and 0.5 per km/h of wind above 25 km/h, clamped to 5..100.
export function comfortScore(feelsLike: number | null, humidity: number | null, windKmh: number | null): number | null {
  if (feelsLike == null) return null;
  let s = 100 - Math.abs(feelsLike - 22) * 3;
  if (humidity != null) s -= Math.max(0, humidity - 60) * 0.4;
  if (windKmh != null) s -= Math.max(0, windKmh - 25) * 0.5;
  return Math.max(5, Math.min(100, Math.round(s)));
}

// AQI score, also published in the method footnote: 100 - AQI / 3,
// clamped to 0..100.
export function aqiScore(aqi: number | null): number | null {
  if (aqi == null) return null;
  return Math.max(0, Math.min(100, Math.round(100 - aqi / 3)));
}

const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

// Prayer settings this module actually requests from Aladhan, stated
// exactly so the pair pages can label the method: method 1 is the
// University of Islamic Sciences, Karachi; school 1 is Hanafi Asr.
export const COMPARE_PRAYER_METHOD_LABEL =
  'Aladhan method 1 (University of Islamic Sciences, Karachi), Hanafi Asr (school 1)';

// Cities whose verified data package exists (Round 2, R4) but whose DB row is
// not live yet resolve from the package identity: the package figures are
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
  // Defence in depth (B1): a stub side must NEVER render, for any city,
  // and no weather/time fetch may go out for 0,0 coordinates. A resolved
  // city that is still a stub (population 0 or lat/lng 0,0) returns null
  // here, before any live fetch, so the pair page 404s.
  if (city.population === 0 || (city.lat === 0 && city.lng === 0)) return null;
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
  // The weather object carries its label in `condition` (the OpenWeather
  // description, e.g. "clear sky"); it has no `description` field, which
  // is why the Conditions row used to render empty on every pair.
  const rawCondition = cur?.condition ?? null;
  return {
    ref,
    city,
    temp: cur?.temp ?? null,
    feelsLike: cur?.feels_like ?? null,
    humidity: cur?.humidity ?? null,
    windKmh: cur?.wind_speed ?? null,
    condition: rawCondition ? rawCondition.charAt(0).toUpperCase() + rawCondition.slice(1) : null,
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


// ── Province entities (Round 2, R5: minimal extension of the layer) ────────
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

export interface EntityFaq {
  q: string;
  a: string;
}

export interface EntityCompareData {
  kind: 'province' | 'country' | 'continent' | 'ocean';
  /** Canonical registry slug, e.g. 'punjab-vs-sindh'. */
  slug: string;
  a: EntitySide;
  b: EntitySide;
  /** Each side's own page (province page or country page). */
  aHref: string;
  bHref: string;
  rows: EntityRow[];
  verdict: string;
  sourceNote: string;
  /** Question headings with direct answers, composed from the rows. */
  faqs: EntityFaq[];
}

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const ratio1 = (x: number, y: number) => (x / y).toFixed(1);

// Province verdict, generated from the computed rows (S6): population
// ratio, urban shares, area ratio and densities all come from the same
// census counts the table above them prints, so the verdict can never
// drift from the rows.
function provinceVerdict(pa: CompareProvince, pb: CompareProvince): string {
  const popLeader = pa.population2023 >= pb.population2023 ? pa : pb;
  const popOther = popLeader === pa ? pb : pa;
  const areaLeader = pa.areaKm2 >= pb.areaKm2 ? pa : pb;
  const areaOther = areaLeader === pa ? pb : pa;
  const urbanA = (pa.urbanPopulation2023 / pa.population2023) * 100;
  const urbanB = (pb.urbanPopulation2023 / pb.population2023) * 100;
  const urbanLeader = urbanA >= urbanB ? pa : pb;
  const densA = Math.round(pa.population2023 / pa.areaKm2);
  const densB = Math.round(pb.population2023 / pb.areaKm2);
  const areaRatio = areaLeader.areaKm2 / areaOther.areaKm2;
  const areaPhrase = areaRatio >= 1.9 && areaRatio <= 2.1
    ? `about twice the area (${ratio1(areaLeader.areaKm2, areaOther.areaKm2)}x)`
    : `${ratio1(areaLeader.areaKm2, areaOther.areaKm2)}x the area`;
  return (
    `${popLeader.name} holds ${ratio1(popLeader.population2023, popOther.population2023)}x ${popOther.name}'s population ` +
    `(${fmtInt(popLeader.population2023)} against ${fmtInt(popOther.population2023)} in the 2023 census). ` +
    `${areaLeader.name} spans ${areaPhrase} (${fmtInt(areaLeader.areaKm2)} km² against ${fmtInt(areaOther.areaKm2)} km²), ` +
    `so population density runs ${fmtInt(Math.max(densA, densB))} people per km² in ${densA >= densB ? pa.name : pb.name} ` +
    `against ${fmtInt(Math.min(densA, densB))} in ${densA >= densB ? pb.name : pa.name}. ` +
    `${urbanLeader.name} is the more urban side at ${(urbanLeader === pa ? urbanA : urbanB).toFixed(1)}% urban, ` +
    `against ${(urbanLeader === pa ? urbanB : urbanA).toFixed(1)}% in ${urbanLeader === pa ? pb.name : pa.name}.`
  );
}

function provinceFaqs(pa: CompareProvince, pb: CompareProvince): EntityFaq[] {
  const popLeader = pa.population2023 >= pb.population2023 ? pa : pb;
  const popOther = popLeader === pa ? pb : pa;
  const areaLeader = pa.areaKm2 >= pb.areaKm2 ? pa : pb;
  const areaOther = areaLeader === pa ? pb : pa;
  const urbanA = (pa.urbanPopulation2023 / pa.population2023) * 100;
  const urbanB = (pb.urbanPopulation2023 / pb.population2023) * 100;
  const urbanLeader = urbanA >= urbanB ? pa : pb;
  const densA = Math.round(pa.population2023 / pa.areaKm2);
  const densB = Math.round(pb.population2023 / pb.areaKm2);
  const densLeader = densA >= densB ? pa : pb;
  return [
    {
      q: `Which province has more people, ${pa.name} or ${pb.name}?`,
      a: `${popLeader.name} has more people: ${fmtInt(popLeader.population2023)} in the PBS Census 2023, against ${fmtInt(popOther.population2023)} in ${popOther.name}, about ${ratio1(popLeader.population2023, popOther.population2023)}x as many.`,
    },
    {
      q: `Which province is larger by area, ${pa.name} or ${pb.name}?`,
      a: `${areaLeader.name} is larger: ${fmtInt(areaLeader.areaKm2)} km² against ${fmtInt(areaOther.areaKm2)} km² in ${areaOther.name} (PBS Census 2023).`,
    },
    {
      q: `Which province is more urban, ${pa.name} or ${pb.name}?`,
      a: `${urbanLeader.name} is more urban: ${(urbanLeader === pa ? urbanA : urbanB).toFixed(1)}% of its people live in urban areas, against ${(urbanLeader === pa ? urbanB : urbanA).toFixed(1)}% in ${urbanLeader === pa ? pb.name : pa.name} (computed from PBS Census 2023 urban counts).`,
    },
    {
      q: `Which province is more densely populated, ${pa.name} or ${pb.name}?`,
      a: `${densLeader.name} is denser at ${fmtInt(densLeader === pa ? densA : densB)} people per km², against ${fmtInt(densLeader === pa ? densB : densA)} per km² in ${densLeader === pa ? pb.name : pa.name} (population divided by area, from the census counts).`,
    },
  ];
}

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
    { label: 'Population density (computed)', a: `${fmtInt(pa.population2023 / pa.areaKm2)} /km²`, b: `${fmtInt(pb.population2023 / pb.areaKm2)} /km²`, note: 'Population divided by area, from the census counts above.' },
    { label: 'Urban share (computed)', a: `${((pa.urbanPopulation2023 / pa.population2023) * 100).toFixed(1)}%`, b: `${((pb.urbanPopulation2023 / pb.population2023) * 100).toFixed(1)}%`, note: 'Urban population divided by total (PBS Table 2.9 counts).' },
    { label: 'Annual growth 2017 to 2023', a: `${pa.growthPct}%`, b: `${pb.growthPct}%` },
    { label: 'Capital weather now (live)', a: `${pa.capitalName}: ${wx(wa)}`, b: `${pb.capitalName}: ${wx(wb)}`, note: 'Open-Meteo; this page updates hourly.' },
  ];
  return {
    kind: 'province',
    slug: `${aSlug}-vs-${bSlug}`,
    a: side(pa),
    b: side(pb),
    aHref: `/pakistan/${pa.slug}`,
    bHref: `/pakistan/${pb.slug}`,
    rows,
    verdict: provinceVerdict(pa, pb),
    sourceNote: 'Population, area, urban counts and growth: Pakistan Bureau of Statistics, 7th Population & Housing Census 2023 (National Census Report, Tables 4.2 and 2.9). Capital weather: Open-Meteo, live.',
    faqs: provinceFaqs(pa, pb),
  };
}

// ── Country entities (World Bank, one dataset both sides) ─────────────────
// The published country set for comparisons: the four countries whose
// packages this site carries (explicit slug → ISO2, the same hand-written
// map the country packages use — never derived from the slug). Only
// indicators that return a value for BOTH countries are shown: the
// figure sets genuinely match or the row does not exist. Years are
// printed per side (World Bank most-recent-value can differ by a year).
export interface CompareCountry {
  slug: string;
  name: string;
  iso2: string;
}

export const COMPARE_COUNTRIES: CompareCountry[] = [
  { slug: 'pakistan', name: 'Pakistan', iso2: 'PK' },
  { slug: 'india', name: 'India', iso2: 'IN' },
  { slug: 'saudi-arabia', name: 'Saudi Arabia', iso2: 'SA' },
  { slug: 'united-arab-emirates', name: 'United Arab Emirates', iso2: 'AE' },
];

export function findCountry(slug: string): CompareCountry | null {
  return COMPARE_COUNTRIES.find((c) => c.slug === slug) ?? null;
}

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

type WbSide = { value: number; year: string };
type WbPair = { a: WbSide; b: WbSide };

// Country verdict, generated from the same values the table prints
// (the province pattern): the leader is named PER CATEGORY, and the
// closing sentence states plainly that the lead is split, so no single
// overall winner is ever invented.
function countryVerdict(ca: CompareCountry, cb: CompareCountry, raw: Record<string, WbPair>): string {
  const lead = (code: string): { name: string; other: string; lv: number; ov: number } | null => {
    const r = raw[code];
    if (!r) return null;
    return r.a.value >= r.b.value
      ? { name: ca.name, other: cb.name, lv: r.a.value, ov: r.b.value }
      : { name: cb.name, other: ca.name, lv: r.b.value, ov: r.a.value };
  };
  const parts: string[] = [];
  const pop = lead('SP.POP.TOTL');
  if (pop) parts.push(`${pop.name} has more people (${fmtInt(pop.lv)} against ${fmtInt(pop.ov)})`);
  const gdp = lead('NY.GDP.MKTP.CD');
  if (gdp) parts.push(`${gdp.name} has the larger economy ($${(gdp.lv / 1e12).toFixed(2)} trillion against $${(gdp.ov / 1e12).toFixed(2)} trillion)`);
  const pc = lead('NY.GDP.PCAP.CD');
  if (pc) parts.push(`${pc.name} is ahead on GDP per person ($${fmtInt(pc.lv)} against $${fmtInt(pc.ov)})`);
  const life = lead('SP.DYN.LE00.IN');
  if (life) parts.push(`${life.name} is higher on life expectancy (${life.lv.toFixed(1)} against ${life.ov.toFixed(1)} years)`);
  const land = lead('AG.LND.TOTL.K2');
  if (land) parts.push(`${land.name} covers more land (${fmtInt(land.lv)} km² against ${fmtInt(land.ov)} km²)`);
  if (parts.length === 0) return 'Two countries on one dataset: every figure above comes from the same World Bank series for both sides.';
  const joined = parts.length === 1
    ? parts[0]
    : `${parts.slice(0, -1).join('; ')}; and ${parts[parts.length - 1]}`;
  return `${joined}. The lead changes by category, so there is no single overall winner: which country comes out ahead depends on the figure you read.`;
}

function countryFaqs(ca: CompareCountry, cb: CompareCountry, raw: Record<string, WbPair>): EntityFaq[] {
  const faqs: EntityFaq[] = [];
  const side = (r: WbPair): { leader: CompareCountry; other: CompareCountry; lv: number; ov: number; ly: string; oy: string } =>
    r.a.value >= r.b.value
      ? { leader: ca, other: cb, lv: r.a.value, ov: r.b.value, ly: r.a.year, oy: r.b.year }
      : { leader: cb, other: ca, lv: r.b.value, ov: r.a.value, ly: r.b.year, oy: r.a.year };
  const pop = raw['SP.POP.TOTL'];
  if (pop) {
    const s = side(pop);
    faqs.push({
      q: `Which country has more people, ${ca.name} or ${cb.name}?`,
      a: `${s.leader.name} has more people: ${fmtInt(s.lv)} (World Bank, ${s.ly}) against ${fmtInt(s.ov)} in ${s.other.name} (World Bank, ${s.oy}), about ${ratio1(s.lv, s.ov)}x as many.`,
    });
  }
  const gdp = raw['NY.GDP.MKTP.CD'];
  if (gdp) {
    const s = side(gdp);
    faqs.push({
      q: `Which country has the larger economy, ${ca.name} or ${cb.name}?`,
      a: `${s.leader.name} has the larger economy on World Bank GDP (current US$): $${(s.lv / 1e12).toFixed(2)} trillion against $${(s.ov / 1e12).toFixed(2)} trillion, about ${ratio1(s.lv, s.ov)}x as large.`,
    });
  }
  const life = raw['SP.DYN.LE00.IN'];
  if (life) {
    const s = side(life);
    faqs.push({
      q: `Which country has the higher life expectancy, ${ca.name} or ${cb.name}?`,
      a: `${s.leader.name} is higher at ${s.lv.toFixed(1)} years, against ${s.ov.toFixed(1)} years in ${s.other.name} (World Bank, most recent values).`,
    });
  }
  const land = raw['AG.LND.TOTL.K2'];
  if (land) {
    const s = side(land);
    faqs.push({
      q: `Which country is larger by land area, ${ca.name} or ${cb.name}?`,
      a: `${s.leader.name} is larger: ${fmtInt(s.lv)} km² of land area against ${fmtInt(s.ov)} km² in ${s.other.name} (World Bank).`,
    });
  }
  return faqs;
}

export async function getCountryCompare(aSlug: string, bSlug: string): Promise<EntityCompareData | null> {
  const ca = findCountry(aSlug);
  const cb = findCountry(bSlug);
  if (!ca || !cb || aSlug === bSlug) return null;
  const rows: EntityRow[] = [];
  const raw: Record<string, WbPair> = {};
  for (const ind of WB_PAIR_INDICATORS) {
    const [va, vb] = await Promise.all([wbLatest(ca.iso2, ind.code), wbLatest(cb.iso2, ind.code)]);
    if (va == null || vb == null) continue; // unmatched indicator: no row
    raw[ind.code] = { a: va, b: vb };
    rows.push({ label: ind.label, a: ind.format(va.value), b: ind.format(vb.value), note: `World Bank ${ind.code} · ${ca.name} ${va.year}, ${cb.name} ${vb.year}` });
  }
  if (rows.length < 3) return null;
  return {
    kind: 'country',
    slug: `${aSlug}-vs-${bSlug}`,
    a: { name: ca.name, sub: `World Bank country data (ISO2 ${ca.iso2})` },
    b: { name: cb.name, sub: `World Bank country data (ISO2 ${cb.iso2})` },
    aHref: `/${ca.slug}`,
    bHref: `/${cb.slug}`,
    rows,
    verdict: countryVerdict(ca, cb, raw),
    sourceNote: 'All figures: World Bank World Development Indicators API, most recent value per indicator, fetched for both countries with the identical series codes (shown per row). A row appears only when both countries report the indicator.',
    faqs: countryFaqs(ca, cb, raw),
  };
}

/** The original published pair, kept as a named entry point. */
export async function getCountryPairCompare(): Promise<EntityCompareData | null> {
  return getCountryCompare('pakistan', 'india');
}

// ── Continent entities (World Bank country data, grouped by continent) ────
// There are no continent records of the ocean kind: the only sourced
// continent figures this site publishes are computed by grouping World
// Bank country data, exactly as the homepage Today's World population
// pie does (WorldContinentPie): the Bank publishes regions, not
// continents, so countries are grouped with the UN geoscheme split
// lists below, IDENTICAL to the pie's published mapping (Russia counts
// with Europe, Türkiye and the Central Asian states with Asia, and so
// on). Two indicators are grouped the same way: population
// (SP.POP.TOTL, the pie's own series) and land area (AG.LND.TOTL.K2,
// the same series the country pairs use). Density is computed from
// those two totals and labelled computed, as on the province pages.
// Antarctica has no World Bank country data and is not comparable.
export interface CompareContinent {
  slug: string;
  name: string;
}

export const COMPARE_CONTINENTS: CompareContinent[] = [
  { slug: 'asia', name: 'Asia' },
  { slug: 'africa', name: 'Africa' },
  { slug: 'europe', name: 'Europe' },
  { slug: 'north-america', name: 'North America' },
  { slug: 'south-america', name: 'South America' },
  { slug: 'oceania', name: 'Oceania' },
];

export function findContinent(slug: string): CompareContinent | null {
  return COMPARE_CONTINENTS.find((c) => c.slug === slug) ?? null;
}

const WB_OCEANIA = new Set(['AUS', 'NZL', 'PNG', 'FJI', 'SLB', 'VUT', 'FSM', 'KIR', 'MHL', 'NRU', 'PLW', 'WSM', 'TON', 'TUV', 'ASM', 'GUM', 'MNP', 'NCL', 'PYF', 'NIU', 'COK']);
const WB_SOUTH_AMERICA = new Set(['ARG', 'BOL', 'BRA', 'CHL', 'COL', 'ECU', 'FLK', 'GUF', 'GUY', 'PRY', 'PER', 'SUR', 'URY', 'VEN']);
const WB_ECS_ASIA = new Set(['TUR', 'KAZ', 'KGZ', 'TJK', 'TKM', 'UZB', 'ARM', 'AZE', 'GEO', 'CYP']);
const WB_MEA_AFRICA = new Set(['DZA', 'EGY', 'LBY', 'MAR', 'TUN', 'SDN', 'ESH']);
const WB_REGIONS = new Set(['EAS', 'ECS', 'LCN', 'MEA', 'NAC', 'SAS', 'SSF']);

function wbContinentOf(region: string, iso3: string): string | null {
  switch (region) {
    case 'SAS': return 'Asia';
    case 'NAC': return 'North America';
    case 'SSF': return 'Africa';
    case 'EAS': return WB_OCEANIA.has(iso3) ? 'Oceania' : 'Asia';
    case 'ECS': return WB_ECS_ASIA.has(iso3) ? 'Asia' : 'Europe';
    case 'LCN': return WB_SOUTH_AMERICA.has(iso3) ? 'South America' : 'North America';
    case 'MEA': return WB_MEA_AFRICA.has(iso3) ? 'Africa' : 'Asia';
    default: return null;
  }
}

interface ContinentTotals {
  name: string;
  population: number;
  landKm2: number;
  popYears: string; // e.g. '2022–2024': the per-country latest-value window
}

async function fetchContinentTotals(): Promise<Map<string, ContinentTotals> | null> {
  try {
    const [countriesRes, popRes, landRes] = await Promise.all([
      fetch('https://api.worldbank.org/v2/country?format=json&per_page=20000', { next: { revalidate: 86400 } }),
      fetch('https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?format=json&per_page=20000&date=2022:2024', { next: { revalidate: 86400 } }),
      fetch('https://api.worldbank.org/v2/country/all/indicator/AG.LND.TOTL.K2?format=json&per_page=20000&date=2022:2024', { next: { revalidate: 86400 } }),
    ]);
    if (!countriesRes.ok || !popRes.ok || !landRes.ok) return null;
    const [countriesJson, popJson, landJson] = await Promise.all([countriesRes.json(), popRes.json(), landRes.json()]);
    const regionOf = new Map<string, string>();
    for (const c of Array.isArray(countriesJson?.[1]) ? countriesJson[1] : []) {
      const iso3 = c?.id;
      const region = c?.region?.id;
      if (typeof iso3 === 'string' && iso3.length === 3 && WB_REGIONS.has(region)) regionOf.set(iso3, region);
    }
    const latestByCountry = (json: unknown): Map<string, { value: number; year: number }> => {
      const latest = new Map<string, { value: number; year: number }>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rows: any[] = Array.isArray((json as any)?.[1]) ? (json as any)[1] : [];
      for (const r of rows) {
        const iso3 = r?.countryiso3code;
        const value = r?.value;
        const year = parseInt(String(r?.date ?? ''), 10);
        if (typeof iso3 !== 'string' || !regionOf.has(iso3)) continue;
        if (typeof value !== 'number' || !Number.isFinite(year)) continue;
        const prev = latest.get(iso3);
        if (!prev || year > prev.year) latest.set(iso3, { value, year });
      }
      return latest;
    };
    const pop = latestByCountry(popJson);
    const land = latestByCountry(landJson);
    const totals = new Map<string, ContinentTotals>();
    const years: number[] = [];
    for (const [iso3, row] of pop) {
      const name = wbContinentOf(regionOf.get(iso3)!, iso3);
      if (!name) continue;
      const t = totals.get(name) ?? { name, population: 0, landKm2: 0, popYears: '' };
      t.population += row.value;
      years.push(row.year);
      totals.set(name, t);
    }
    for (const [iso3, row] of land) {
      const name = wbContinentOf(regionOf.get(iso3)!, iso3);
      if (!name) continue;
      const t = totals.get(name);
      if (t) t.landKm2 += row.value;
    }
    if (years.length === 0) return null;
    const window = `${Math.min(...years)}–${Math.max(...years)}`;
    for (const t of totals.values()) t.popYears = window;
    return totals;
  } catch { return null; }
}

const fmtBig = (n: number): string => (n >= 1e9 ? `${(n / 1e9).toFixed(2)} billion` : `${(n / 1e6).toFixed(1)} million`);

export async function getContinentCompare(aSlug: string, bSlug: string): Promise<EntityCompareData | null> {
  const ca = findContinent(aSlug);
  const cb = findContinent(bSlug);
  if (!ca || !cb || aSlug === bSlug) return null;
  const totals = await fetchContinentTotals();
  const ta = totals?.get(ca.name);
  const tb = totals?.get(cb.name);
  if (!ta || !tb || ta.population <= 0 || tb.population <= 0 || ta.landKm2 <= 0 || tb.landKm2 <= 0) return null;
  const densA = ta.population / ta.landKm2;
  const densB = tb.population / tb.landKm2;
  const rows: EntityRow[] = [
    { label: 'Population', a: fmtBig(ta.population), b: fmtBig(tb.population), note: `World Bank SP.POP.TOTL summed over each continent's countries · most recent value per country, ${ta.popYears}` },
    { label: 'Land area', a: `${fmtInt(ta.landKm2)} km²`, b: `${fmtInt(tb.landKm2)} km²`, note: 'World Bank AG.LND.TOTL.K2 summed the same way.' },
    { label: 'Population density (computed)', a: `${densA.toFixed(1)} /km²`, b: `${densB.toFixed(1)} /km²`, note: 'Population divided by land area, from the two totals above.' },
  ];
  const popLeader = ta.population >= tb.population ? ca : cb;
  const popOther = popLeader === ca ? cb : ca;
  const landLeader = ta.landKm2 >= tb.landKm2 ? ca : cb;
  const landOther = landLeader === ca ? cb : ca;
  const densLeader = densA >= densB ? ca : cb;
  const densOther = densLeader === ca ? cb : ca;
  const verdict =
    `${popLeader.name} holds more people (${fmtBig(popLeader === ca ? ta.population : tb.population)} against ${fmtBig(popOther === ca ? ta.population : tb.population)}), ` +
    `while ${landLeader.name} covers more land (${fmtInt(landLeader === ca ? ta.landKm2 : tb.landKm2)} km² against ${fmtInt(landOther === ca ? ta.landKm2 : tb.landKm2)} km²). ` +
    `On density, ${densLeader.name} is the more crowded side at ${(densLeader === ca ? densA : densB).toFixed(1)} people per km² against ${(densOther === ca ? densA : densB).toFixed(1)}. ` +
    'Each figure is a category of its own: the lead is split, and there is no single overall winner.';
  const faqs: EntityFaq[] = [
    {
      q: `Which continent has more people, ${ca.name} or ${cb.name}?`,
      a: `${popLeader.name} has more people: ${fmtBig(popLeader === ca ? ta.population : tb.population)} against ${fmtBig(popOther === ca ? ta.population : tb.population)} in ${popOther.name}, about ${ratio1(Math.max(ta.population, tb.population), Math.min(ta.population, tb.population))}x as many (World Bank country populations summed by continent).`,
    },
    {
      q: `Which continent is larger by land area, ${ca.name} or ${cb.name}?`,
      a: `${landLeader.name} is larger: ${fmtInt(landLeader === ca ? ta.landKm2 : tb.landKm2)} km² of land against ${fmtInt(landOther === ca ? ta.landKm2 : tb.landKm2)} km² in ${landOther.name} (World Bank country land areas summed by continent).`,
    },
    {
      q: `Which continent is more densely populated, ${ca.name} or ${cb.name}?`,
      a: `${densLeader.name} is denser at ${(densLeader === ca ? densA : densB).toFixed(1)} people per km², against ${(densOther === ca ? densA : densB).toFixed(1)} per km² in ${densOther.name} (computed from the population and land totals).`,
    },
    {
      q: `How are ${ca.name} and ${cb.name} assigned their countries?`,
      a: 'The World Bank publishes regions, not continents, so each country is grouped with the UN geoscheme split this site already uses for its homepage population-by-continent pie: for example Russia is counted with Europe, and Türkiye and the Central Asian states with Asia. The same mapping is applied to both sides.',
    },
  ];
  return {
    kind: 'continent',
    slug: `${aSlug}-vs-${bSlug}`,
    a: { name: ca.name, sub: 'World Bank country data, grouped by continent' },
    b: { name: cb.name, sub: 'World Bank country data, grouped by continent' },
    aHref: `/countries?continent=${ca.slug}`,
    bHref: `/countries?continent=${cb.slug}`,
    rows,
    verdict,
    sourceNote: 'Population and land area: World Bank World Development Indicators (SP.POP.TOTL and AG.LND.TOTL.K2), most recent value per country, summed over the countries of each continent with the UN geoscheme grouping this site publishes on its homepage. Density is computed from those totals. If the Bank feed is unavailable, this page does not render.',
    faqs,
  };
}

// ── Ocean entities (the sourced fact set each ocean page already prints) ──
// The five oceans plus the Arabian Sea: the six records whose pages carry
// the shared fact labels (Total area, Average depth, Maximum depth).
// Figures are read from the ocean records themselves (src/lib/oceans.ts),
// displayed in the record's own wording, and each row names the record's
// own source. A row exists only when BOTH records carry the fact: the
// Arabian Sea record has no average-depth fact, so its pairs compare on
// area and maximum depth only. Ocean volume is not a fact any ocean page
// prints, so it is never compared.
import { getOcean, type Ocean } from '@/lib/oceans';

export interface CompareOcean {
  slug: string;
  name: string;
}

export const COMPARE_OCEANS: CompareOcean[] = [
  { slug: 'pacific-ocean', name: 'Pacific Ocean' },
  { slug: 'atlantic-ocean', name: 'Atlantic Ocean' },
  { slug: 'indian-ocean', name: 'Indian Ocean' },
  { slug: 'arctic-ocean', name: 'Arctic Ocean' },
  { slug: 'southern-ocean', name: 'Southern Ocean' },
  { slug: 'arabian-sea', name: 'Arabian Sea' },
];

export function findOcean(slug: string): CompareOcean | null {
  return COMPARE_OCEANS.find((o) => o.slug === slug) ?? null;
}

interface OceanFigure {
  /** The record's own value wording, exactly as its page prints it. */
  display: string;
  /** The record's own source for this fact. */
  source: string;
  /** Leading number parsed from the record's value, for ratios only. */
  num: number;
}

function oceanFigure(ocean: Ocean, label: string): OceanFigure | null {
  const fact = ocean.facts.find((f) => f.label === label);
  if (!fact) return null;
  const m = fact.value.replace(/≈/g, '').match(/[\d][\d,]*(?:\.\d+)?/);
  if (!m) return null;
  const num = parseFloat(m[0].replace(/,/g, ''));
  if (!Number.isFinite(num) || num <= 0) return null;
  return { display: fact.value, source: fact.source, num };
}

export async function getOceanCompare(aSlug: string, bSlug: string): Promise<EntityCompareData | null> {
  const ca = findOcean(aSlug);
  const cb = findOcean(bSlug);
  if (!ca || !cb || aSlug === bSlug) return null;
  const [oa, ob] = await Promise.all([getOcean(aSlug), getOcean(bSlug)]);
  if (!oa || !ob) return null;
  const areaA = oceanFigure(oa, 'Total area');
  const areaB = oceanFigure(ob, 'Total area');
  const maxA = oceanFigure(oa, 'Maximum depth');
  const maxB = oceanFigure(ob, 'Maximum depth');
  if (!areaA || !areaB || !maxA || !maxB) return null;
  const rows: EntityRow[] = [
    { label: 'Total area', a: areaA.display, b: areaB.display, note: `Sources as printed on each page: ${ca.name}: ${areaA.source}; ${cb.name}: ${areaB.source}.` },
    { label: 'Maximum depth', a: maxA.display, b: maxB.display, note: `Sources as printed on each page: ${ca.name}: ${maxA.source}; ${cb.name}: ${maxB.source}.` },
  ];
  const avgA = oceanFigure(oa, 'Average depth');
  const avgB = oceanFigure(ob, 'Average depth');
  if (avgA && avgB) {
    rows.push({ label: 'Average depth', a: avgA.display, b: avgB.display, note: `Sources as printed on each page: ${ca.name}: ${avgA.source}; ${cb.name}: ${avgB.source}.` });
  }
  const areaLeader = areaA.num >= areaB.num ? ca : cb;
  const areaOther = areaLeader === ca ? cb : ca;
  const maxLeader = maxA.num >= maxB.num ? ca : cb;
  const maxOther = maxLeader === ca ? cb : ca;
  let verdict =
    `${areaLeader.name} is the larger of the two at ${areaLeader === ca ? areaA.display : areaB.display}, about ${ratio1(Math.max(areaA.num, areaB.num), Math.min(areaA.num, areaB.num))}x the area of ${areaOther.name} (${areaOther === ca ? areaA.display : areaB.display}). ` +
    `${maxLeader.name} reaches deeper: a maximum depth of ${maxLeader === ca ? maxA.display : maxB.display} against ${maxOther === ca ? maxA.display : maxB.display} in ${maxOther.name}.`;
  if (avgA && avgB) {
    const avgLeader = avgA.num >= avgB.num ? ca : cb;
    verdict += ` On average depth, ${avgLeader.name} is deeper at ${avgLeader === ca ? avgA.display : avgB.display} against ${avgLeader === ca ? avgB.display : avgA.display}.`;
  }
  verdict += ' Size and depth are different contests, so there is no single overall winner.';
  const faqs: EntityFaq[] = [
    {
      q: `Which is bigger, the ${ca.name} or the ${cb.name}?`,
      a: `The ${areaLeader.name} is bigger: ${areaLeader === ca ? areaA.display : areaB.display} against ${areaOther === ca ? areaA.display : areaB.display} for the ${areaOther.name} (figures and sources as printed on each ocean's page).`,
    },
    {
      q: `Which is deeper, the ${ca.name} or the ${cb.name}?`,
      a: `The ${maxLeader.name} reaches deeper, with a maximum depth of ${maxLeader === ca ? maxA.display : maxB.display}, against ${maxOther === ca ? maxA.display : maxB.display} for the ${maxOther.name}.`,
    },
  ];
  if (avgA && avgB) {
    const avgLeader = avgA.num >= avgB.num ? ca : cb;
    const avgOther = avgLeader === ca ? cb : ca;
    faqs.push({
      q: `Which has the greater average depth, the ${ca.name} or the ${cb.name}?`,
      a: `The ${avgLeader.name}, at ${avgLeader === ca ? avgA.display : avgB.display} on average, against ${avgOther === ca ? avgA.display : avgB.display} for the ${avgOther.name}.`,
    });
  }
  return {
    kind: 'ocean',
    slug: `${aSlug}-vs-${bSlug}`,
    a: { name: ca.name, sub: 'Facts as printed on its WorldCityHub ocean page' },
    b: { name: cb.name, sub: 'Facts as printed on its WorldCityHub ocean page' },
    aHref: `/oceans/${ca.slug}`,
    bHref: `/oceans/${cb.slug}`,
    rows,
    verdict,
    sourceNote: `Every figure is taken from the fact set each ocean's own WorldCityHub page prints, with that page's named source per fact (shown under each row): the underlying sources are Wikidata and Wikipedia, checked 2026-10-22. A row appears only when both oceans' pages carry the fact.`,
    faqs,
  };
}

// ── Entity dispatcher: one entry point for every non-city pair ────────────
export async function getEntityCompare(pair: CanonicalPair): Promise<EntityCompareData | null> {
  switch (pair.kind) {
    case 'province': return getProvinceCompare(pair.a, pair.b);
    case 'country': return getCountryCompare(pair.a, pair.b);
    case 'continent': return getContinentCompare(pair.a, pair.b);
    case 'ocean': return getOceanCompare(pair.a, pair.b);
    default: return null;
  }
}
