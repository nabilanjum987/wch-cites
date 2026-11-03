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
// 404s. Contents: the published city pairs, the three province pairs and
// the one country pair: 10 pairs in total. The old rawalpindi-vs-islamabad
// sitemap pair is gone with the Rawalpindi stub (B1); lahore-vs-multan
// takes the sixth city slot so the registry stays at the published count.
export interface CanonicalPair {
  slug: string;
  kind: 'city' | 'province' | 'country';
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
];

export const CANONICAL_CITY_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'city');
export const CANONICAL_PROVINCE_PAIRS = CANONICAL_PAIRS.filter((p) => p.kind === 'province');

/** City pairs in the registry, in registry order (hub chips, other-pairs lists). */
export const POPULAR_PAIRS: [string, string][] = CANONICAL_CITY_PAIRS.map((p) => [p.a, p.b]);

/** Province pairs in the registry, in registry order. */
export const PROVINCE_PAIRS: [string, string][] = CANONICAL_PROVINCE_PAIRS.map((p) => [p.a, p.b]);

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
  kind: 'province' | 'country';
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

// ── Country pair: Pakistan vs India (World Bank, one dataset both sides) ───
// Only indicators that return a value for BOTH countries are shown: the
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
  const raw: Record<string, { pk: { value: number; year: string }; inn: { value: number; year: string } }> = {};
  let gdpPk: number | null = null;
  let gdpIn: number | null = null;
  for (const ind of WB_PAIR_INDICATORS) {
    const [pk, inn] = await Promise.all([wbLatest('PK', ind.code), wbLatest('IN', ind.code)]);
    if (pk == null || inn == null) continue; // unmatched indicator: no row
    raw[ind.code] = { pk, inn };
    if (ind.code === 'NY.GDP.MKTP.CD') { gdpPk = pk.value; gdpIn = inn.value; }
    rows.push({ label: ind.label, a: ind.format(pk.value), b: ind.format(inn.value), note: `World Bank ${ind.code} · Pakistan ${pk.year}, India ${inn.year}` });
  }
  if (rows.length < 3) return null;
  const verdict = gdpPk && gdpIn
    ? `On the same World Bank vintage, India's GDP is about ${(gdpIn / gdpPk).toFixed(1)}x Pakistan's: the gap per person is far smaller than the gap in totals.`
    : 'Two neighbours on one dataset: every figure above comes from the same World Bank series for both countries.';
  const faqs: EntityFaq[] = [];
  const pop = raw['SP.POP.TOTL'];
  if (pop) {
    const leader = pop.inn.value >= pop.pk.value ? 'India' : 'Pakistan';
    const other = leader === 'India' ? 'Pakistan' : 'India';
    const lv = leader === 'India' ? pop.inn.value : pop.pk.value;
    const ov = leader === 'India' ? pop.pk.value : pop.inn.value;
    const ly = leader === 'India' ? pop.inn.year : pop.pk.year;
    const oy = leader === 'India' ? pop.pk.year : pop.inn.year;
    faqs.push({
      q: 'Which country has more people, Pakistan or India?',
      a: `${leader} has more people: ${fmtInt(lv)} (World Bank, ${ly}) against ${fmtInt(ov)} in ${other} (World Bank, ${oy}), about ${ratio1(lv, ov)}x as many.`,
    });
  }
  const gdp = raw['NY.GDP.MKTP.CD'];
  if (gdp) {
    const leader = gdp.inn.value >= gdp.pk.value ? 'India' : 'Pakistan';
    const lv = leader === 'India' ? gdp.inn.value : gdp.pk.value;
    const ov = leader === 'India' ? gdp.pk.value : gdp.inn.value;
    faqs.push({
      q: 'Which country has the larger economy, Pakistan or India?',
      a: `${leader} has the larger economy on World Bank GDP (current US$): $${(lv / 1e12).toFixed(2)} trillion against $${(ov / 1e12).toFixed(2)} trillion, about ${ratio1(lv, ov)}x as large.`,
    });
  }
  const life = raw['SP.DYN.LE00.IN'];
  if (life) {
    const leader = life.inn.value >= life.pk.value ? 'India' : 'Pakistan';
    const lv = leader === 'India' ? life.inn.value : life.pk.value;
    const ov = leader === 'India' ? life.pk.value : life.inn.value;
    faqs.push({
      q: 'Which country has the higher life expectancy, Pakistan or India?',
      a: `${leader} is higher at ${lv.toFixed(1)} years, against ${ov.toFixed(1)} years in ${leader === 'India' ? 'Pakistan' : 'India'} (World Bank, most recent values).`,
    });
  }
  const land = raw['AG.LND.TOTL.K2'];
  if (land) {
    const leader = land.inn.value >= land.pk.value ? 'India' : 'Pakistan';
    const lv = leader === 'India' ? land.inn.value : land.pk.value;
    const ov = leader === 'India' ? land.pk.value : land.inn.value;
    faqs.push({
      q: 'Which country is larger by land area, Pakistan or India?',
      a: `${leader} is larger: ${fmtInt(lv)} km² of land area against ${fmtInt(ov)} km² (World Bank).`,
    });
  }
  return {
    kind: 'country',
    slug: 'pakistan-vs-india',
    a: { name: 'Pakistan', sub: 'World Bank country data (ISO2 PK)' },
    b: { name: 'India', sub: 'World Bank country data (ISO2 IN)' },
    aHref: '/pakistan',
    bHref: '/india',
    rows,
    verdict,
    sourceNote: 'All figures: World Bank World Development Indicators API, most recent value per indicator, fetched for both countries with the identical series codes (shown per row). A row appears only when both countries report the indicator.',
    faqs,
  };
}
