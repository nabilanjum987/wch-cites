// app/[country]/[province]/[city]/page.tsx
// City Main Page — 23 sections, real API data, rendered on-demand per request.
// force-dynamic prevents pre-rendering at build time, which would fire 14
// external API calls per city simultaneously and crash Vercel on rate limits.
// Test URL: /pakistan/punjab/lahore

import type { Metadata } from 'next';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import Link from 'next/link';
import ImproveCTA from '@/components/shared/ImproveCTA';
import CityAssistant, { OpenAssistantButton } from '@/components/shared/CityAssistant';
import { fetchAllCityData, type CityParams } from '@/lib/apis/cityData';
import { TOLA_GRAMS } from '@/lib/gold';
import { generateCityMeta, generateCitySchema, generateCityFaqs } from '@/lib/seo/cityMeta';
import { CENSUS_2023_POPULATION, hasCensusPopulation } from '@/lib/census2023';
import PopulationPie from '@/components/PopulationPie';
import { urbanRuralSlicesFor, faithSlicesForCity, isAllUrbanDistrict } from '@/lib/census2023-splits';
import { DirectAnswer, FaqBlock } from '@/components/aeo/AnswerLayer';
import CityPageImage from '@/components/city/CityPageImage';
import CityPrayerTimeline from '@/components/city/CityPrayerTimeline';
import { getMoonPhase } from '@/lib/apis/astro';
import { getCityImage } from '@/lib/data/cityImages';
import {
  generateCityIntro,
  generateCityIntroAfter,
  generateWeatherParagraph,
  generateWeatherAfter,
  generateSunMoonParagraph,
  generateSunMoonAfter,
  generatePrayerParagraph,
  generatePrayerAfter,
  generateGoldParagraph,
  generateGoldAfter,
  generateNewsParagraph,
  generateNewsAfter,
  generateEventsParagraph,
  generateEventsAfter,
  generateEconomyParagraph,
  generateEconomyAfter,
  generateSportsParagraph,
  generateSportsAfter,
  generatePersonalitiesParagraph,
  generatePersonalitiesAfter,
  generatePlacesParagraph,
  generatePlacesAfter,
  generateHeritageParagraph,
  generateHeritageAfter,
  generateStreetFoodParagraph,
  generateStreetFoodAfter,
  generateEmergencyParagraph,
  generateEmergencyAfter,
  generateCityGlanceParagraph,
  generateCityGlanceAfter,
  generateNearbyCitiesParagraph,
  generateNearbyCitiesAfter,
} from '@/lib/paragraphs/city';

export const dynamic = 'force-dynamic';

// ─── CITY DATABASE (expand to all cities) ────────────────────────────────────
// For scale: move this to Supabase / Firebase
const CITY_DB: Record<string, CityParams> = {
  'pakistan/punjab/lahore': {
    city: 'Lahore', country: 'Pakistan', province: 'Punjab',
    lat: 31.5204, lon: 74.3587, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/sindh/karachi': {
    city: 'Karachi', country: 'Pakistan', province: 'Sindh',
    lat: 24.8607, lon: 67.0011, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/islamabad-capital-territory/islamabad': {
    city: 'Islamabad', country: 'Pakistan', province: 'Islamabad Capital Territory',
    lat: 33.6844, lon: 73.0479, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/punjab/faisalabad': {
    city: 'Faisalabad', country: 'Pakistan', province: 'Punjab',
    lat: 31.4504, lon: 73.1350, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/punjab/rawalpindi': {
    city: 'Rawalpindi', country: 'Pakistan', province: 'Punjab',
    lat: 33.5651, lon: 73.0169, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/punjab/multan': {
    city: 'Multan', country: 'Pakistan', province: 'Punjab',
    lat: 30.1978, lon: 71.4711, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/khyber-pakhtunkhwa/peshawar': {
    city: 'Peshawar', country: 'Pakistan', province: 'Khyber Pakhtunkhwa',
    lat: 34.008, lon: 71.57849, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
};

function getCityParams(country: string, province: string, city: string): CityParams | null {
  const key = `${country}/${province}/${city}`;
   console.log('KEY:', key);
  return CITY_DB[key] ?? null;
}

// ─── Q11 AUDIT FIXES ─────────────────────────────────────────────────────────
// Per-city "at a glance" facts. Until now EVERY city printed Lahore's
// values (population 13M+, area 1,772 km², elevation 217 m). F3: the
// populations of Lahore, Karachi and Islamabad are PBS Census-2023
// admin-unit totals read from the single source in @/lib/census2023
// (district / division / territory totals matching the areas shown);
// B10 extends the same rule to Faisalabad (district total, matching
// its 5,856 km² district area) so the Faisalabad-vs-Multan pair reads
// Census-2023 on both sides. Rawalpindi alone keeps the site's own
// collected dataset value (pakistan_cities.csv, GeoNames-shaped).
// Areas are district/territory areas; elevations are the cities'
// standard published figures.
// D17 exception, following the batch's F3 single-source rule: Multan and
// Peshawar populations are PBS Census-2023 DISTRICT totals, paired with
// the matching district areas (the same unit-matches-area rule F3 uses
// for Lahore/Karachi/Islamabad) — not city/municipal-corporation counts.
const fmtCensus = (key: string): string => CENSUS_2023_POPULATION[key].toLocaleString('en-US');
const GLANCE: Record<string, { population: string; area: string; elevation: string; languages: string; founded: string }> = {
  'pakistan/punjab/lahore': { population: fmtCensus('pakistan/punjab/lahore'), area: '1,772', elevation: '217', languages: 'Urdu, Punjabi', founded: 'antiquity' },
  'pakistan/sindh/karachi': { population: fmtCensus('pakistan/sindh/karachi'), area: '3,527', elevation: '8', languages: 'Urdu, Sindhi', founded: '1729' },
  'pakistan/islamabad-capital-territory/islamabad': { population: fmtCensus('pakistan/islamabad-capital-territory/islamabad'), area: '906', elevation: '540', languages: 'Urdu, Punjabi', founded: '1960' },
  'pakistan/punjab/faisalabad': { population: '9,075,819', area: '5,856', elevation: '184', languages: 'Urdu, Punjabi', founded: '1892' },
  'pakistan/punjab/rawalpindi': { population: '3,357,612', area: '5,286', elevation: '508', languages: 'Urdu, Punjabi, Potohari', founded: 'antiquity' },
  'pakistan/punjab/multan': { population: '5,362,305', area: '3,720', elevation: '122', languages: 'Urdu, Saraiki, Punjabi', founded: 'antiquity' },
  'pakistan/khyber-pakhtunkhwa/peshawar': { population: '4,758,762', area: '1,518', elevation: '340', languages: 'Urdu, Pashto, Hindko', founded: 'antiquity' },
};

// Nearby cities: only cities whose full pages render (the old list
// linked to Coming Soon shells — Gujranwala, Sialkot — from
// every city, with Lahore's distances). Distances are straight-line,
// computed from the canonical coordinates in CITY_DB above.
// D17: the two new cities link ONLY to already-live pages; existing
// cities' nearby lists are untouched by this change.
const NEARBY_KEYS: Record<string, string[]> = {
  'pakistan/punjab/lahore': ['pakistan/islamabad-capital-territory/islamabad', 'pakistan/punjab/faisalabad', 'pakistan/punjab/rawalpindi', 'pakistan/sindh/karachi'],
  'pakistan/sindh/karachi': ['pakistan/punjab/lahore', 'pakistan/islamabad-capital-territory/islamabad'],
  'pakistan/islamabad-capital-territory/islamabad': ['pakistan/punjab/rawalpindi', 'pakistan/punjab/lahore', 'pakistan/punjab/faisalabad'],
  'pakistan/punjab/faisalabad': ['pakistan/punjab/lahore', 'pakistan/islamabad-capital-territory/islamabad'],
  'pakistan/punjab/rawalpindi': ['pakistan/islamabad-capital-territory/islamabad', 'pakistan/punjab/lahore'],
  'pakistan/punjab/multan': ['pakistan/punjab/lahore', 'pakistan/punjab/faisalabad', 'pakistan/islamabad-capital-territory/islamabad'],
  'pakistan/khyber-pakhtunkhwa/peshawar': ['pakistan/islamabad-capital-territory/islamabad', 'pakistan/punjab/rawalpindi', 'pakistan/punjab/lahore'],
};

function haversineKm(a: CityParams, b: CityParams): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Compare chips: ONLY the pairs actually published in /compare (the old
// chips linked to lahore-vs-dubai, lahore-vs-mumbai, lahore-vs-london
// and a wrong-order lahore-vs-faisalabad — all dead ends).
// D17: no chips for Multan/Peshawar yet — the only Multan pair
// (faisalabad-vs-multan) is not in this audited list or the sitemap's
// compare list. (B10 retired the pair's 2017 package population in
// favour of PBS Census-2023 district totals, so the drift reason no
// longer applies — but chips are still a follow-up, not a silent
// addition here.) Peshawar has no compare pair at all.
const COMPARE_LINKS: Record<string, { label: string; pair: string }[]> = {
  lahore: [
    { label: 'Karachi', pair: 'lahore-vs-karachi' },
    { label: 'Islamabad', pair: 'lahore-vs-islamabad' },
    { label: 'Faisalabad', pair: 'faisalabad-vs-lahore' },
  ],
  karachi: [
    { label: 'Lahore', pair: 'lahore-vs-karachi' },
    { label: 'Islamabad', pair: 'karachi-vs-islamabad' },
  ],
  islamabad: [
    { label: 'Lahore', pair: 'lahore-vs-islamabad' },
    { label: 'Karachi', pair: 'karachi-vs-islamabad' },
    { label: 'Rawalpindi', pair: 'rawalpindi-vs-islamabad' },
  ],
  faisalabad: [{ label: 'Lahore', pair: 'faisalabad-vs-lahore' }],
  rawalpindi: [{ label: 'Islamabad', pair: 'rawalpindi-vs-islamabad' }],
};

// ─── CITY IDENTITY BLOCKS ────────────────────────────────────────────────
// The city template's identity block is per-city data, never shared copy:
// each entry is built only from named, verifiable anchors of that city
// (institutions, markets, industries), with no unsourced figures. Cities
// without an entry render no identity section rather than another city's
// strengths. Lahore is the template instance (owner review, 3 Nov 2026).
const IDENTITY_BLOCKS: Record<string, { heading: string; text: string }[]> = {
  'pakistan/punjab/lahore': [
    {
      heading: 'Technology',
      text: 'Arfa Software Technology Park anchors the city\'s software industry, and the technology universities PUCIT, UET and LUMS supply the graduates its software houses hire.',
    },
    {
      heading: 'Markets',
      text: 'Shah Alam Market runs wholesale trade for the whole region, Hall Road is the city\'s electronics bazaar, Anarkali serves the old city, and Liberty Market serves Gulberg.',
    },
    {
      heading: 'Industry',
      text: 'Textiles and garments, leather goods, and food processing are the city\'s established manufacturing strengths, shipped across Pakistan and abroad.',
    },
    {
      heading: 'Education',
      text: 'Government College University (founded 1864), the University of the Punjab (1882), King Edward Medical University (1860), and Aitchison College (1886) have educated the city for well over a century.',
    },
  ],
};

// ─── NEWS LIST PREPARATION ───────────────────────────────────────────────
// The city news feed regularly carries the SAME story from several
// outlets (the owner review found a top five that was really three
// stories) and fills a Pakistani city's list with foreign outlets.
// Prepare the list once: drop duplicate stories by headline token
// overlap, then put Pakistani outlets first. The reorder is stable and
// removes nothing; dedupe keeps the first (best-placed) copy.
type NewsArticleLike = {
  title?: string;
  url?: string;
  publishedAt?: string;
  source?: unknown;
};

const PK_NEWS_OUTLETS = [
  'dawn', 'geo news', 'express tribune', 'the news', 'ary news',
  'dunya news', 'samaa', 'aaj news', 'aaj english', 'business recorder',
  'pakistan observer', 'daily times', 'the nation', 'pakistan today',
  'the frontier post', 'jang', '92 news', 'hum news', 'bol news', 'gnn',
  '24 news', 'public news', 'neo news', 'roze news',
];

function newsSourceName(article: NewsArticleLike): string {
  const src = article.source as Record<string, string> | string | undefined;
  if (src && typeof src === 'object') return (src.name ?? '').toLowerCase();
  return typeof src === 'string' ? src.toLowerCase() : '';
}

function storyTokens(title: string): Set<string> {
  const cleaned = title
    .toLowerCase()
    .replace(/\s+-\s+[^-]+$/, '')
    .replace(/[^a-z0-9\s]/g, ' ');
  return new Set(cleaned.split(/\s+/).filter((w) => w.length > 2));
}

function sameStory(a: Set<string>, b: Set<string>): boolean {
  if (a.size === 0 || b.size === 0) return false;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  return inter / (a.size + b.size - inter) >= 0.55;
}

function prepareNewsList(articles: NewsArticleLike[]): NewsArticleLike[] {
  const kept: NewsArticleLike[] = [];
  const keptTokens: Set<string>[] = [];
  for (const article of articles) {
    if (!article.title) continue;
    const tokens = storyTokens(article.title);
    if (keptTokens.some((t) => sameStory(tokens, t))) continue;
    kept.push(article);
    keptTokens.push(tokens);
  }
  const isPk = (a: NewsArticleLike) => {
    const name = newsSourceName(a);
    return PK_NEWS_OUTLETS.some((o) => name.includes(o));
  };
  return [...kept.filter(isPk), ...kept.filter((a) => !isPk(a))];
}

/** Cut a headline at a word boundary, never mid-word. */
function truncateHeadline(title: string, max = 110): string {
  if (title.length <= max) return title;
  const cut = title.lastIndexOf(' ', max);
  return `${title.slice(0, cut > 40 ? cut : max)}…`;
}

function toTitleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ComingSoonCity({ countrySlug, country, city }: { countrySlug: string; country: string; city: string }) {
  return (
    <main className="relative min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center px-6 overflow-hidden">
      <FlagSymbolBackground countrySlug={countrySlug} />
      <div className="relative z-10 max-w-xl text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-3">
          {country}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{city}</h1>
        <p className="text-white/60 text-lg mb-8">
          We&apos;re building out full city data, weather, prayer times, gold
          rates, news and more, for {city}. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition-colors"
        >
          Explore other cities
        </Link>
      </div>
    </main>
  );
}

// ─── GENERATE STATIC PARAMS (for known cities at build time) ─────────────────
export async function generateStaticParams() {
  return Object.keys(CITY_DB).map((key) => {
    const [country, province, city] = key.split('/');
    return { country, province, city };
  });
}

// ─── METADATA ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; province: string; city: string }>;
}): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityParams = getCityParams(country, province, city);
  if (!cityParams) {
    const cityName = toTitleCase(city);
    return {
      title: `${cityName} · Coming Soon | WorldCityHub`,
      description: `Detailed information for ${cityName} is coming soon to WorldCityHub.`,
      robots: { index: false, follow: true },
    };
  }

  // Do NOT call fetchAllCityData here — it fires 14 external API calls for
  // every static page at build time, crashing the Vercel worker on rate limits
  // and timeouts. Metadata is generated from static slug data only; live
  // enrichment (temp, prayer times, gold) is loaded client-side at runtime.
  const meta = generateCityMeta({
    city: cityParams.city,
    country: cityParams.country,
    province: cityParams.province,
    temp: null,
    weatherDesc: null,
    fajr: null,
    maghrib: null,
    goldPerGram: null,
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      siteName: 'WorldCityHub',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────
export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; province: string; city: string }>;
}) {
  const resolvedParams = await params;
  const { country: countrySlug, province: provinceSlug, city: citySlug } = await params;
  const cityParams = getCityParams(countrySlug, provinceSlug, citySlug);
  if (!cityParams) {
    return <ComingSoonCity countrySlug={countrySlug} country={toTitleCase(countrySlug)} city={toTitleCase(citySlug)} />;
  }

  // PC1(2): every rendered heading, label and generated paragraph below
  // uses the DISPLAY names (Lahore, Punjab, Pakistan) from the city
  // record — never the lowercase URL slugs. Slugs stay in
  // resolvedParams / *Slug for URLs only.
  const country = cityParams.country;
  const province = cityParams.province;
  const city = cityParams.city;
  const cityKey = `${countrySlug}/${provinceSlug}/${citySlug}`;
  const glance = GLANCE[cityKey];
  const nearbyCities = (NEARBY_KEYS[cityKey] ?? []).flatMap((key) => {
    const target = CITY_DB[key];
    if (!target) return [];
    const km = haversineKm(cityParams, target);
    return [{
      name: target.city,
      dist: `~${Math.max(5, Math.round(km / 5) * 5)} km`,
      slug: key,
      // Licensed hero photo for the card, where the media registry has
      // one for that city; cities without a record render a text card.
      image: getCityImage(key.split('/')[2], 'hero'),
    }];
  });

  const data = await fetchAllCityData(cityParams);

  // ── Destructure API responses safely ──
  const weather = data.weather as Record<string, unknown> | null;
  const hourly = data.hourlyForecast as Record<string, unknown> | null;
  const sunMoon = data.sunMoon as Record<string, unknown> | null;
  const prayer = data.prayerTimes as Record<string, unknown> | null;
  const gold = data.goldRates as Record<string, unknown> | null;
  const crypto = data.crypto as Record<string, unknown> | null;
  const news = data.news as Record<string, unknown> | null;
  const wiki = data.wikiSummary as Record<string, unknown> | null;
  const economy = data.economy as Record<string, unknown> | null;
  const emergency = data.emergencyContacts as Record<string, unknown> | null;
  const airQuality = data.airQuality as Record<string, unknown> | null;
  const currency = data.currencyRates as Record<string, unknown> | null;
  const holidays = data.holidays as unknown[] | null;

  // ── Parsed values ──
  const temp = (weather?.main as Record<string, number> | undefined)?.temp ?? null;
  const feelsLike = (weather?.main as Record<string, number> | undefined)?.feels_like ?? null;
  const humidity = (weather?.main as Record<string, number> | undefined)?.humidity ?? null;
  const windSpeed = (weather?.wind as Record<string, number> | undefined)?.speed ?? null;
  const weatherDesc = ((weather?.weather as Array<Record<string, string>> | undefined)?.[0]?.description) ?? null;

  const timings = (prayer?.data as Record<string, Record<string, string>> | undefined)?.timings ?? null;
  const hijriDate = (prayer?.data as Record<string, Record<string, Record<string, string>>> | undefined)?.date?.hijri ?? null;

  const goldPerGram = (gold as Record<string, number> | null)?.price_gram_24k ?? null;
  const goldPerTola = goldPerGram ? Math.round(goldPerGram * TOLA_GRAMS) : null;
  // Today's movement: the 24h change percent rides on the gold object
  // (see fetchAllCityData). The PKR amount per tola is derived from that
  // same percent and today's price, never a separate invented figure.
  const goldChangePct = (gold as Record<string, number> | null)?.change_percent_24h ?? null;
  const goldMovePerTola =
    goldChangePct !== null && goldPerTola
      ? Math.round(goldPerTola - goldPerTola / (1 + goldChangePct / 100))
      : null;
  const silver = data.silver as { per_gram: number; per_tola: number } | null;

  // Moon phase for the Sun & Moon card: the site's own astronomical
  // helper (same computation the horoscope and Islamic surfaces use).
  const moon = getMoonPhase();

  const sunrise = (sunMoon?.results as Record<string, string> | undefined)?.sunrise ?? null;
  const sunset = (sunMoon?.results as Record<string, string> | undefined)?.sunset ?? null;

  const rawNewsArticles = ((news?.articles as Array<Record<string, string>> | undefined) ?? []) as unknown as NewsArticleLike[];
  const displayArticles = prepareNewsList(rawNewsArticles);
  const topHeadline = displayArticles[0]?.title ?? null;

  const aqi = ((airQuality?.list as Array<Record<string, Record<string, number>>> | undefined)?.[0]?.main?.aqi) ?? null;
  const aqiLabel = aqi === 1 ? 'Good' : aqi === 2 ? 'Fair' : aqi === 3 ? 'Moderate' : aqi === 4 ? 'Poor' : aqi === 5 ? 'Very Poor' : 'N/A';

  const btcUsd = (crypto?.bitcoin as Record<string, number> | undefined)?.usd ?? null;
  const btcPkr = (crypto?.bitcoin as Record<string, number> | undefined)?.pkr ?? null;

  const pkrRate = (currency?.conversion_rates as Record<string, number> | undefined)?.PKR ?? null;

  const gdpPerCapita = (economy as Record<string, number> | null)?.['NY.GDP.PCAP.CD'] ?? null;
  const inflation = (economy as Record<string, number> | null)?.['FP.CPI.TOTL.ZG'] ?? null;
  const unemployment = (economy as Record<string, number> | null)?.['SL.UEM.TOTL.ZS'] ?? null;

  const policeNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.police?.all?.[0] ?? null;
  const ambulanceNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.ambulance?.all?.[0] ?? null;
  const fireNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.fire?.all?.[0] ?? null;

  const hourlyList = (hourly?.list as Array<Record<string, unknown>> | undefined)?.slice(0, 8) ?? [];

  // Day/night for the hourly strip is decided from each entry's own
  // timestamp against today's sunrise/sunset (sunrise-sunset.org,
  // formatted=0, so UTC ISO instants), shifted by whole days so an
  // entry past midnight is judged against the right day's window.
  // The forecast block's sys.pod marker is NOT trusted: it disagrees
  // with the sun times for some blocks (a 3am Lahore entry rendered a
  // sun in the 3 Nov 2026 live audit, while 9pm and 12am were right).
  // When the sun fetch failed there is no window, and only then does
  // the pod marker decide, exactly as before.
  const sunWindow = (() => {
    const sr = sunrise ? new Date(sunrise).getTime() : NaN;
    const ss = sunset ? new Date(sunset).getTime() : NaN;
    if (!Number.isFinite(sr) || !Number.isFinite(ss) || ss <= sr) return null;
    return { sr, ss };
  })();
  const isNightAt = (ms: number, pod: string | undefined): boolean => {
    if (!sunWindow || !Number.isFinite(ms)) return pod === 'n';
    const DAY_MS = 86_400_000;
    for (const k of [-1, 0, 1]) {
      if (ms >= sunWindow.sr + k * DAY_MS && ms <= sunWindow.ss + k * DAY_MS) return false;
    }
    return true;
  };

  // ── City Assistant (Phase 1) snapshot ──────────────────────────────────
  // ONLY values this page already loaded (same feeds as the panels above).
  // The bot renders exactly these — never a fetched, guessed or cross-city
  // value. Events: this page lists no individual events, so eventsCount
  // is 0 and the bot answers honestly with the events-page link.
  const rainMm =
    (weather?.rain as Record<string, number> | undefined)?.['1h'] ??
    (weather?.rain as Record<string, number> | undefined)?.['3h'] ?? null;
  const assistantSnapshot = {
    scopeName: city,
    countryCode: cityParams.countryCode,
    basePath: `/${countrySlug}/${provinceSlug}/${citySlug}`,
    prayerTimes: timings
      ? {
          Fajr: timings.Fajr, Sunrise: timings.Sunrise, Dhuhr: timings.Dhuhr,
          Asr: timings.Asr, Maghrib: timings.Maghrib, Isha: timings.Isha,
        }
      : null,
    temp: temp !== null ? Math.round(temp) : null,
    feelsLike: feelsLike !== null ? Math.round(feelsLike) : temp !== null ? Math.round(temp) : null,
    weatherDesc,
    rainMm,
    goldPerGram: goldPerGram !== null ? Math.round(goldPerGram) : null,
    goldPerTola,
    police: policeNum ?? '15',
    ambulance: ambulanceNum ?? '1122',
    fire: fireNum ?? '16',
    eventsCount: 0,
  };

  const upcomingHolidays = ((holidays ?? []) as Array<Record<string, string>>)
    .filter((h) => new Date(h.date) >= new Date())
    .slice(0, 5);

  // ── JSON-LD Schemas ──
  // ── Batch 4 Item 2: AEO answer layer ──────────────────────────────────
  // faqProps feeds BOTH the FAQPage schema (generateCitySchema) and the
  // visible FAQ block (generateCityFaqs) — one source, no drift. The
  // direct-answer block's first sentence answers the template's primary
  // mined question ("What is the population of {city}?"); every figure in
  // it comes from the same data this page already renders (GLANCE dataset
  // + live weather) — nothing new is hard-coded.
  const faqProps = {
    city: city,
    country: country,
    province: province,
    temp, weatherDesc, fajr: timings?.Fajr, maghrib: timings?.Maghrib,
    goldPerGram,
    population: glance?.population ?? null,
    // Fix 4 (billi audit): the language FAQ is built from this city's own
    // dataset languages list and the emergency FAQ from the emergency
    // numbers this page itself fetches — not from generator assumptions.
    languages: glance?.languages ?? null,
    emergency: { police: policeNum, ambulance: ambulanceNum, fire: fireNum },
  };
  const schemas = generateCitySchema(faqProps);
  const cityFaqs = generateCityFaqs(faqProps);
  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const directAnswer = glance
    ? `${city} has a population of ${glance.population} and is one of the principal cities of ${province}, ${country}. The city covers about ${glance.area} km² at roughly ${glance.elevation} metres above sea level, and its main languages are ${glance.languages}.${temp ? ` Right now it is ${Math.round(temp)}°C in ${city}${weatherDesc ? ` with ${weatherDesc}` : ''}.` : ''} The sections below cover its live weather, prayer times, gold rates, news, events and economy in full.`
    : `${city} is a city of ${province}, ${country}, and this page is its complete guide.${temp ? ` Right now it is ${Math.round(temp)}°C in ${city}${weatherDesc ? ` with ${weatherDesc}` : ''}.` : ''} The sections below cover its live weather, prayer times, gold rates, news, events, famous places and people, and economy in full, each with a dedicated page of its own, plus the city's at-a-glance facts, emergency numbers and comparisons with other cities.`;


  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.citySchema) }}
      />

      <main className="min-h-screen relative" style={{ backgroundColor: '#0a0f1e', fontFamily: 'Inter, sans-serif' }}>

        {/* ── FLAG SYMBOL BACKGROUND ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          <FlagSymbolBackground countrySlug={countrySlug} />
        </div>

        {/* ══ SECTION 1: TICKER BAR ══════════════════════════════════════════ */}
        <div className="text-white text-xs py-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(12,122,61,0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="flex gap-8 px-4 flex-wrap items-center">
            {goldPerGram && (
              <span>🥇 Gold <strong>PKR {Math.round(goldPerGram).toLocaleString()}/g</strong></span>
            )}
            {btcUsd && (
              <span>₿ BTC <strong>${btcUsd.toLocaleString()}</strong></span>
            )}
            {pkrRate && (
              <span>💱 USD/PKR <strong>{pkrRate.toFixed(2)}</strong></span>
            )}
            {temp && (
              <span>🌡 {city} <strong>{Math.round(temp)}°C</strong></span>
            )}
            {timings?.Maghrib && (
              <span>🕌 Maghrib <strong>{timings.Maghrib}</strong></span>
            )}
            <span className="ml-auto opacity-70">
              {currentMonth} {currentYear} · Live Data
            </span>
          </div>
        </div>

        {/* ══ SECTION 2: HERO + LOCAL TIME ══════════════════════════════════ */}
        <section className="relative text-white pt-8 pb-10 px-4 md:px-8" style={{ background: 'linear-gradient(160deg, #0C7A3D22, #0a0f1e 60%)', borderBottom: '1px solid rgba(12,122,61,0.3)' }}>
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-300 transition-colors">WorldCityHub</a>
            <span className="mx-1">›</span>
            <a href={`/${resolvedParams.country}`} className="hover:text-gray-300 transition-colors capitalize">{country}</a>
            <span className="mx-1">›</span>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}`} className="hover:text-gray-300 transition-colors capitalize">{province}</a>
            <span className="mx-1">›</span>
            <span className="text-white">{city}</span>
          </nav>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#34d399' }} className="text-4xl md:text-5xl font-bold mb-2">
                {city}
              </h1>
              <p className="text-gray-400 text-lg mb-1">{province} · {country}</p>
              <p className="text-gray-500 text-sm">
                {hijriDate ? `${hijriDate.day} ${((hijriDate.month as unknown as Record<string, string>))?.en} ${hijriDate.year} AH · ` : ''}
                {currentMonth} {currentYear}
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`}
                  className="bg-[#C8A951] text-[#01411C] text-sm font-semibold px-4 py-2 rounded-full hover:bg-yellow-400 transition">
                  🌤 Weather Detail
                </a>
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  🕌 Prayer Times
                </a>
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  💰 Rates
                </a>
              </div>
            </div>

            {/* Live clock placeholder - JS hydrates this */}
            <div className="text-right hidden md:block">
              <div className="text-6xl font-mono font-light text-white" id="city-clock">--:--</div>
              <div className="text-gray-500 text-sm mt-1">{cityParams.timezone}</div>
              {sunrise && sunset && (
                <div className="text-gray-500 text-xs mt-2">
                  🌅 Sunrise {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                  &nbsp;·&nbsp;
                  🌇 Sunset {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                </div>
              )}
            </div>
          </div>
          {/* Final28 P12: real city photo (licensed/open, local file, credited) — no image for cities without a record. */}
          <div className="max-w-6xl mx-auto mt-8">
            <CityPageImage citySlug={resolvedParams.city} variant="hero" layout="card" />
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10 relative z-10">
          {/* ── Batch 4 Item 2: direct-answer block, directly under the hero/heading ── */}
          <DirectAnswer
            answer={directAnswer}
            source={glance
              ? `Population, area & elevation: WorldCityHub city dataset · Weather & prayer times: live, ${todayStr}`
              : `Weather & prayer times: live, ${todayStr}`}
          />

          {/* ══ SECTION 3: WEATHER ════════════════════════════════════════════ */}
          <section id="weather" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🌤 Weather in {city} Today: {currentMonth} {currentYear}
            </h2>
            {temp ? (
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" aria-label={`Full weather forecast for ${city}`}>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#34d399' }}>{Math.round(temp)}°C</div>
                  <div className="text-xs text-gray-400 mt-1">Temperature</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#34d399' }}>{Math.round(feelsLike ?? temp)}°C</div>
                  <div className="text-xs text-gray-400 mt-1">Feels Like</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#34d399' }}>{humidity}%</div>
                  <div className="text-xs text-gray-400 mt-1">Humidity</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#34d399' }}>{Math.round((windSpeed ?? 0) * 3.6)}</div>
                  <div className="text-xs text-gray-400 mt-1">Wind km/h</div>
                </div>
              </a>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Live weather is unavailable right now. The full weather page shows the latest conditions.
              </div>
            )}

            {/* AQI */}
            {aqi && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
                aqi <= 2 ? 'bg-green-900/40 text-green-400' :
                aqi === 3 ? 'bg-yellow-900/40 text-yellow-400' :
                'bg-red-900/40 text-red-400'
              }`}>
                💨 Air Quality: <strong>{aqiLabel}</strong> (AQI {aqi}/5)
              </div>
            )}

            {/* Hourly forecast: the whole strip opens the weather page.
                Icons follow the day's actual sunrise/sunset (see
                isNightAt above), so night hours never show a sun. */}
            {hourlyList.length > 0 && (
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`} className="block overflow-x-auto" aria-label={`Hourly forecast for ${city}: full weather page`}>
                <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                  {hourlyList.map((h, i) => {
                    const t = h.dt_txt as string;
                    const hTemp = (h.main as Record<string, number>)?.temp;
                    const hDesc = (h.weather as Array<Record<string, string>>)?.[0]?.main;
                    // Entry instant: the forecast's Unix dt (UTC) is
                    // unambiguous; dt_txt is UTC text, parsed as UTC
                    // in the fallback (never as local time).
                    const entryMs = typeof h.dt === 'number' ? h.dt * 1000 : new Date(t.replace(' ', 'T') + 'Z').getTime();
                    // The label is the CITY's local time for that instant.
                    // (Owner catch, 3 Nov 2026: without the timezone this
                    // rendered UTC wall-clock labels on the server, so the
                    // 08:00 city entry wore a "03:00 AM" label and its sun
                    // icon looked like a night bug.)
                    const time = new Date(entryMs).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone });
                    const isNight = isNightAt(entryMs, (h.sys as Record<string, string> | undefined)?.pod);
                    const icon =
                      hDesc === 'Rain' || hDesc === 'Drizzle' ? '🌧'
                      : hDesc === 'Thunderstorm' ? '⛈'
                      : hDesc === 'Snow' ? '🌨'
                      : hDesc === 'Clouds' ? '☁️'
                      : hDesc === 'Clear' ? (isNight ? '🌙' : '☀️')
                      : isNight ? '🌙' : '🌤';
                    return (
                      <div key={i} className="rounded-xl px-4 py-3 text-center min-w-[72px] border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                        <div className="text-xs text-gray-400">{time}</div>
                        <div className="text-lg">{icon}</div>
                        <div className="text-sm font-mono font-medium" style={{ color: '#34d399' }}>{Math.round(hTemp)}°</div>
                      </div>
                    );
                  })}
                </div>
              </a>
            )}

            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              {generateWeatherParagraph(city, temp, feelsLike, humidity, weatherDesc, windSpeed ? windSpeed * 3.6 : null)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateWeatherAfter(city, country)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`}
              className="inline-block mt-4 text-sm font-semibold px-5 py-2.5 rounded-full transition hover:opacity-90" style={{ backgroundColor: '#0C7A3D', color: '#ffffff' }}>
              View full weather forecast →
            </a>
          </section>

          {/* ══ SECTION 4: SUN/MOON ═══════════════════════════════════════════ */}
          {(sunrise || sunset) && (
            <section id="sun-moon" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
                🌅 Sun & Moon in {city}: {currentMonth} {currentYear}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sunrise && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.2)' }}>
                    <div className="text-2xl">🌅</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunrise</div>
                  </div>
                )}
                {sunset && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
                    <div className="text-2xl">🌇</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunset</div>
                  </div>
                )}
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
                  <div className="text-2xl">{moon.emoji}</div>
                  <div className="font-semibold" style={{ color: '#34d399' }}>{moon.phase_name}</div>
                  <div className="text-xs text-gray-400 mt-1">Moon Phase · {moon.illumination}% illuminated</div>
                </div>
                {sunrise && sunset && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.2)' }}>
                    <div className="text-2xl">⏱</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {Math.round((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 3600000)}h
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Daylight</div>
                  </div>
                )}
              </div>
              <p className="mt-6 text-gray-400 leading-relaxed text-sm">
                {generateSunMoonParagraph(city,
                  sunrise ? new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone }) : null,
                  sunset ? new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone }) : null
                )}
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateSunMoonAfter(city)}
              </p>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`}
                className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
                Full weather page: the outlook ahead →
              </a>
            </section>
          )}

          {/* ══ SECTION 5: PRAYER TIMES ═══════════════════════════════════════ */}
          <section id="prayer-times" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-1">
              🕌 Prayer Times in {city}: {currentMonth} {currentYear}
            </h2>
            {hijriDate && (
              <p className="text-sm text-gray-500 mb-4">
                {hijriDate.day} {((hijriDate.month as unknown as Record<string, string>))?.en} {hijriDate.year} AH
              </p>
            )}
            {timings ? (
              <CityPrayerTimeline
                entries={[
                  { name: 'Fajr', time: timings.Fajr, emoji: '🌙' },
                  { name: 'Sunrise', time: timings.Sunrise, emoji: '🌅' },
                  { name: 'Dhuhr', time: timings.Dhuhr, emoji: '☀️' },
                  { name: 'Asr', time: timings.Asr, emoji: '🌤' },
                  { name: 'Maghrib', time: timings.Maghrib, emoji: '🌇' },
                  { name: 'Isha', time: timings.Isha, emoji: '🌑' },
                ]}
                timezone={cityParams.timezone}
                serverNowIso={new Date().toISOString()}
              />
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Prayer times are unavailable right now. The full timetable is on the Prayer Times page.
              </div>
            )}
            <p className="text-gray-400 leading-relaxed text-sm">
              {generatePrayerParagraph(city, timings)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePrayerAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full prayer timetable, Qibla compass & Zakat calculator →
            </a>
          </section>

          {/* ══ SECTION 6: GOLD & METAL RATES ════════════════════════════════ */}
          <section id="gold-rates" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🥇 Gold & Metal Rates in {city}: {currentMonth} {currentYear}
            </h2>
            {goldPerGram ? (
              <>
                {goldMovePerTola !== null && goldChangePct !== null && (
                  <p className="mb-4 text-sm font-medium" style={{ color: goldChangePct >= 0 ? '#34d399' : '#f87171' }}>
                    {goldChangePct >= 0 ? '▲' : '▼'} Gold in the last 24 hours: {goldChangePct >= 0 ? 'up' : 'down'} PKR {Math.abs(goldMovePerTola).toLocaleString()} per tola ({goldChangePct >= 0 ? '+' : ''}{goldChangePct.toFixed(2)}%)
                  </p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                  {[
                    { label: '24 Karat / gram', value: `PKR ${Math.round(goldPerGram).toLocaleString()}` },
                    { label: '24 Karat / tola', value: `PKR ${goldPerTola?.toLocaleString()}` },
                    { label: '22 Karat / gram', value: `PKR ${Math.round(goldPerGram * 0.9167).toLocaleString()}` },
                    { label: '18 Karat / gram', value: `PKR ${Math.round(goldPerGram * 0.75).toLocaleString()}` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.3)' }}>
                      <div className="text-xs text-amber-400 mb-1">{item.label}</div>
                      <div className="font-mono font-bold text-amber-300 text-lg">{item.value}</div>
                    </div>
                  ))}
                  {silver && (
                    <div className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(148,163,184,0.08)', borderColor: 'rgba(148,163,184,0.35)' }}>
                      <div className="text-xs text-slate-300 mb-1">Silver / tola</div>
                      <div className="font-mono font-bold text-slate-200 text-lg">PKR {Math.round(silver.per_tola).toLocaleString()}</div>
                      <div className="text-[11px] text-slate-400 mt-1">PKR {Math.round(silver.per_gram).toLocaleString()} per gram</div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Gold rates are unavailable right now. The full rates page shows the latest prices.
              </div>
            )}

            {/* Crypto */}
            {btcUsd && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Cryptocurrency Today</h3>
                <div className="flex gap-4 flex-wrap">
                  <div className="rounded-lg px-4 py-2 border" style={{ backgroundColor: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.3)' }}>
                    <span className="text-xs text-gray-500">Bitcoin (BTC)</span>
                    <div className="font-mono font-bold text-orange-400">${btcUsd.toLocaleString()}</div>
                    {btcPkr && <div className="text-xs text-gray-500">PKR {btcPkr.toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              {generateGoldParagraph(city, goldPerGram)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateGoldAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`}
              className="inline-block mt-4 text-sm font-semibold px-5 py-2.5 rounded-full transition hover:opacity-90" style={{ backgroundColor: '#0C7A3D', color: '#ffffff' }}>
              Full rates page: oil, silver, crypto, currency, stocks →
            </a>
          </section>

          {/* ══ SECTION 7: TODAY'S NEWS ═══════════════════════════════════════ */}
          <section id="news" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              📰 {city} News Today: {currentMonth} {currentYear}
            </h2>
            {displayArticles.length > 0 ? (
              <div className="space-y-4 mb-6">
                {displayArticles.slice(0, 5).map((article, i) => (
                  <article key={i} className="flex gap-4 items-start border-b pb-4 last:border-0">
                    <span className="text-gray-300 font-mono text-lg mt-0.5 min-w-[24px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={article.title}
                        className="font-medium text-gray-100 hover:text-emerald-300 leading-snug"
                      >
                        {article.title ? truncateHeadline(article.title) : ''}
                      </a>
                      <p className="text-xs text-gray-400 mt-1">
                        {newsSourceName(article)} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                News is unavailable right now. The full news page has the latest headlines.
              </div>
            )}
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateNewsParagraph(city, topHeadline)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateNewsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/news`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full news page: 12 categories, archive, Urdu feed →
            </a>
          </section>

          {/* ══ SECTION 8: EVENTS ═════════════════════════════════════════════ */}
          <section id="events" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🎉 Events in {city}: {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Sports', 'Culture', 'Music', 'Food', 'Religion', 'Business', 'Art', 'Family'].map((cat) => (
                <a
                  key={cat}
                  href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events?category=${cat.toLowerCase()}`}
                  className="rounded-xl p-3 text-center text-sm text-gray-200 border transition hover:border-emerald-400/60"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(12,122,61,0.3)' }}
                >
                  {cat}
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEventsParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEventsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full events calendar: map view, 16 categories, submit event →
            </a>
          </section>

          {/* ══ SECTION 9: ECONOMY ════════════════════════════════════════════ */}
          <section id="economy" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              📊 Economy of {city}: {currentMonth} {currentYear}
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Headline indicators: national figures for {country} (World Bank). City-level GDP and inflation series are not published for {city}, so the national numbers are shown and labelled as national.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">GDP per Capita</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  ${gdpPerCapita ? Math.round(gdpPerCapita).toLocaleString() : '--'}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">Inflation</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  {inflation ? `${Math.round(inflation)}%` : '--'}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">Unemployment</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  {unemployment ? `${Math.round(unemployment)}%` : '--'}
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEconomyParagraph(city, country, gdpPerCapita, inflation, unemployment)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEconomyAfter(city, country)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/economy`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full economy page: GDP charts, misery index, jobs →
            </a>
          </section>

          {/* ══ SECTION 10: SPORTS ════════════════════════════════════════════ */}
          <section id="sports" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🏏 Sports in {city}: {currentMonth} {currentYear}
            </h2>
            <div className="flex gap-3 flex-wrap mb-6">
              {['Cricket', 'PSL', 'Hockey', 'Football', 'Squash', 'Kabaddi'].map((sport) => (
                <span key={sport} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(12,122,61,0.3)', color: '#34d399', border: '1px solid rgba(12,122,61,0.5)' }}>
                  {sport}
                </span>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateSportsParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateSportsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/sports`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full sports page: live scores, PSL standings, schedules →
            </a>
          </section>

          {/* ══ SECTION 11: FAMOUS PERSONALITIES ═════════════════════════════ */}
          <section id="personalities" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              👤 Famous People from {city}
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
                {generatePersonalitiesParagraph(city)}
              </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {(citySlug === 'lahore' ? [
                { name: 'Allama Iqbal', role: 'Poet-Philosopher', slug: 'allama-iqbal', img: '/images/home28/pers-iqbal.webp', credit: 'Iqbal Academy Pakistan · public domain', pos: 'object-top' },
                { name: 'Faiz Ahmed Faiz', role: 'Poet', slug: 'faiz-ahmed-faiz', img: '/images/personalities/faiz-ahmed-faiz.webp', credit: 'Amarjit Chandan · CC BY-SA 4.0', pos: 'object-right' },
                { name: 'Nusrat Fateh Ali Khan', role: 'Qawwali Singer', slug: 'nusrat-fateh-ali-khan', img: '/images/personalities/nusrat-fateh-ali-khan.webp', credit: 'Thomas Rome · CC BY 2.0', pos: 'object-[80%_center]' },
                { name: 'Wasim Akram', role: 'Cricketer', slug: 'wasim-akram', img: '/images/personalities/wasim-akram.webp', credit: 'Arijit Basak · CC BY 2.0', pos: 'object-top' },
              ] : []).map((p) => (
                <a
                  key={p.slug}
                  href={`/personalities/${p.slug}`}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-green-500/40 transition block" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={`Portrait of ${p.name}`} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${p.pos}`} />
                  </div>
                  <div className="p-3">
                    <div className="font-medium text-sm text-white">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.role}</div>
                    <div className="text-[10px] text-gray-500 mt-1.5">Photo: {p.credit}</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePersonalitiesAfter(city)}
              </p>
            <a href="/personalities"
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              All personalities →
            </a>
          </section>

          {/* ══ SECTION 12: FAMOUS PLACES ════════════════════════════════════ */}
          <section id="places" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🏛 Famous Places in {city}
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
                {generatePlacesParagraph(city)}
              </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(citySlug === 'lahore' ? [
                // Card photos (2026-11-03): one licensed photo per place,
                // vendored under public/images/places/cards/ at card size.
                // Badshahi: repo asset (Zapata1000, CC BY-SA 4.0, registry
                // VERIFIED). Fort: Commons "Lahore Fort view from
                // Baradari.jpg" (Rohaan Bhatti, CC BY-SA 3.0, verified via
                // Commons API extmetadata). Shalimar / Data Darbar /
                // Walled City / Museum: card-size derivatives of the B8
                // place-page photos (media-registry places-b8 records).
                { name: 'Badshahi Mosque', type: 'Mughal Mosque', slug: 'badshahi-mosque', img: '/images/places/cards/badshahi-mosque.webp', alt: 'Courtyard of Badshahi Mosque, Lahore', credit: 'Zapata1000 · CC BY-SA 4.0' },
                { name: 'Lahore Fort', type: 'UNESCO Heritage', slug: 'lahore-fort', img: '/images/places/cards/lahore-fort.webp', alt: 'Alamgiri Gate of Lahore Fort', credit: 'Rohaan Bhatti · CC BY-SA 3.0' },
                // D18: the four newly published Lahore places.
                { name: 'Shalimar Gardens', type: 'Mughal Gardens', slug: 'shalimar-gardens', img: '/images/places/cards/shalimar-gardens.webp', alt: 'Shalimar Gardens, Lahore', credit: 'M Umair Astro · CC BY-SA 4.0' },
                { name: 'Data Darbar', type: 'Sufi Shrine', slug: 'data-darbar', img: '/images/places/cards/data-darbar.webp', alt: 'Data Darbar shrine, Lahore', credit: 'Guilhem Vellut · CC BY 2.0' },
                { name: 'Walled City', type: 'Historic District', slug: 'walled-city', img: '/images/places/cards/walled-city.webp', alt: 'A street in the Walled City, Lahore', credit: 'Guilhem Vellut · CC BY 2.0' },
                { name: 'Lahore Museum', type: 'Museum', slug: 'lahore-museum', img: '/images/places/cards/lahore-museum.webp', alt: 'Lahore Museum on The Mall', credit: 'Muhammad Ashar · CC BY-SA 3.0' },
              ] : []).map((place) => (
                <a
                  key={place.slug}
                  href={`/places/${place.slug}`}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-green-500/40 transition block" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  {place.img && (
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={place.img} alt={place.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                      </div>
                      <figcaption className="px-3 py-1 text-[10px] text-gray-500">
                        {place.alt}: {place.credit}, via Wikimedia Commons
                      </figcaption>
                    </figure>
                  )}
                  <div className="p-4">
                    <div className="font-medium text-sm text-white">{place.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{place.type}</div>
                    <div className="text-xs mt-2 font-medium" style={{ color: '#34d399' }}>Open today? →</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePlacesAfter(city)}
              </p>
            <a href="/places"
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              All places worth knowing →
            </a>
          </section>

          {/* ══ SECTION 13: HERITAGE PRODUCTS ════════════════════════════════ */}
          <section id="heritage" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🧶 Heritage Products of {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {(citySlug === 'lahore' ? [
                { name: 'Phulkari Embroidery', slug: 'phulkari-lahore' },
                { name: 'Lahori Chappals', slug: 'lahori-chappals' },
                { name: 'Hand-knotted Rugs', slug: 'lahore-rugs' },
                { name: 'Kashmiri Shawls', slug: 'kashmiri-shawls-lahore' },
                { name: 'Lacquerware', slug: 'lahore-lacquerware' },
                { name: 'Brass & Copperware', slug: 'lahore-brassware' },
              ] : []).map((p) => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="rounded-xl p-4 border hover:border-amber-400/50 transition" style={{ backgroundColor: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.2)' }}
                >
                  <div className="font-medium text-sm text-amber-300">{p.name}</div>
                  <div className="text-xs text-amber-500 mt-1">View story & buy →</div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateHeritageParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateHeritageAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 14: STREET FOOD ═══════════════════════════════════════ */}
          <section id="food" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🍛 Street Food of {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {(citySlug === 'lahore' ? ['Nihari', 'Seekh Kebabs', 'Paye', 'Halwa Puri', 'Brain Masala', 'Karahi', 'Jalebi', 'Murgh Cholay'] : []).map((dish) => (
                <div key={dish} className="rounded-xl p-3 text-center text-sm font-medium border" style={{ backgroundColor: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.3)', color: '#fb923c' }}>
                  {dish}
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateStreetFoodParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateStreetFoodAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 15: EMERGENCY CONTACTS ═══════════════════════════════ */}
          <section id="emergency" className="rounded-2xl p-6 border-l-4 border-red-500" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-red-400 mb-4">
              🚨 Emergency Contacts: {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Police', number: policeNum ?? '15', emoji: '👮' },
                { label: 'Rescue / Ambulance', number: ambulanceNum ?? '1122', emoji: '🚑' },
                { label: 'Fire Brigade', number: fireNum ?? '16', emoji: '🚒' },
                { label: 'Women Helpline', number: '1043', emoji: '👩' },
                { label: 'Child Protection', number: '1121', emoji: '🛡' },
                { label: 'Edhi Foundation', number: '115', emoji: '🏥' },
                { label: 'PDMA Disaster Line', number: '1129', emoji: '🌧' },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={`tel:${contact.number}`}
                  className="rounded-xl p-5 text-center border hover:border-red-400/60 transition block" style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}
                  aria-label={`Call ${contact.label} on ${contact.number}`}
                >
                  <div className="text-3xl mb-1">{contact.emoji}</div>
                  <div className="font-mono font-bold text-red-400 text-2xl">{contact.number}</div>
                  <div className="text-xs text-gray-300 mt-1">{contact.label}</div>
                  <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide">Tap to call</div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEmergencyParagraph(city, policeNum, ambulanceNum, fireNum)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEmergencyAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 16: CITY IDENTITY ════════════════════════════════════
              The city's own identity, from its named anchors only. This
              replaces the old country-scope "Natural Resources" section:
              country content belongs to the country page, never a city
              page. Cities without an identity entry render no section. */}
          {IDENTITY_BLOCKS[cityKey] && (
            <section id="identity" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
                🏙 What {city} Is Known For
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {IDENTITY_BLOCKS[cityKey].map((item) => (
                  <div key={item.heading} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(12,122,61,0.25)' }}>
                    <div className="font-semibold text-sm mb-1" style={{ color: '#34d399' }}>{item.heading}</div>
                    <p className="text-sm text-gray-300 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ SECTION 17: CITY AT A GLANCE ═════════════════════════════════ */}
          <section id="glance" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              📋 {city} at a Glance: {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                ...(glance ? [
                  { label: hasCensusPopulation(cityKey) ? 'Population (2023 census)' : 'Population', value: glance.population },
                  { label: 'Area', value: `${glance.area} km²` },
                  { label: 'Elevation', value: `${glance.elevation} m` },
                ] : []),
                { label: 'Province', value: province },
                { label: 'Time Zone', value: 'PKT (UTC+5)' },
                ...(glance ? [{ label: 'Languages', value: glance.languages }] : []),
              ].map((item) => (
                <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.2)' }}>
                  <div className="text-xs text-gray-400">{item.label}</div>
                  <div className="font-semibold mt-1" style={{ color: '#34d399' }}>{item.value}</div>
                </div>
              ))}
            </div>
            {/* ── Population pies (PBS Census-2023 splits) ───────────────────
              Rendered only where a verified split exists: urban/rural for
              Karachi + Islamabad, "100% urban (district)" text plus a
              100% bar for Lahore (a one-slice pie is a defect), faith
              pies for Karachi + Islamabad. Lahore has NO faith pie or
              faith bar: its PBS Table 9 district row was not directly
              sighted and secondary summaries disagree on the Sikh /
              Scheduled Castes split — see @/lib/census2023-splits.
              Other cities get no pie block. */}
            {(() => {
              const urbanRural = urbanRuralSlicesFor(cityKey);
              const faith = faithSlicesForCity(cityKey);
              const allUrban = isAllUrbanDistrict(cityKey);
              if (!urbanRural && !faith && !allUrban) return null;
              return (
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  {urbanRural ? (
                    <PopulationPie
                      title="Urban vs rural population"
                      unit={urbanRural.unit}
                      slices={urbanRural.slices}
                      source="PBS Census-2023, Table 1"
                    />
                  ) : allUrban ? (
                    <div
                      data-population-pie="Urban vs rural population"
                      className="rounded-2xl p-5 border"
                      style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}
                    >
                      <div className="text-white font-semibold text-sm">Urban vs rural population</div>
                      <div className="text-gray-500 text-xs mt-0.5">Lahore District · Total {glance?.population}</div>
                      <p className="mt-4 text-sm text-gray-300">100% urban (district)</p>
                      {/* Chart visual for the one verified Lahore split
                          (owner audit, 3 Nov 2026): a 100% bar, not a
                          pie — a one-slice pie is a defect. Every figure
                          is the card's own: urban = the district total
                          printed above, rural = 0, both from the same
                          PBS Census-2023 line the source note cites.
                          No faith visual ships for Lahore: see the
                          census2023-splits note on the unsighted
                          Table 9 district row. */}
                      <div className="mt-4" role="img" aria-label="Urban versus rural population for Lahore District: 100 percent urban, 0 percent rural">
                        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full" style={{ width: '100%', backgroundColor: '#0C7A3D' }} />
                        </div>
                        <ul className="mt-2 space-y-1.5 text-sm">
                          <li className="flex items-baseline gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0 self-center" style={{ backgroundColor: '#0C7A3D' }} />
                            <span className="text-gray-300">Urban</span>
                            <span className="text-gray-500 ml-auto text-right">{glance?.population} · 100%</span>
                          </li>
                          <li className="flex items-baseline gap-2">
                            <span className="inline-block w-3 h-3 rounded-sm flex-shrink-0 self-center" style={{ backgroundColor: '#34d399' }} />
                            <span className="text-gray-300">Rural</span>
                            <span className="text-gray-500 ml-auto text-right">0 · 0%</span>
                          </li>
                        </ul>
                      </div>
                      <p className="mt-4 text-xs text-gray-500">Source: PBS Census-2023. The entire Lahore District population lives in urban areas.</p>
                    </div>
                  ) : null}
                  {faith ? (
                    <PopulationPie
                      title="Population by faith"
                      unit={faith.unit}
                      slices={faith.slices}
                      source="PBS Census-2023, Table 9"
                      note="Hindu combines Table 9's Hindu Jati + Scheduled Castes columns. Religion not recorded covers people in sensitive areas / collective residences for whom religion was not enumerated, so the pie sums to the census total."
                    />
                  ) : null}
                </div>
              );
            })()}
            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              {glance ? generateCityGlanceParagraph(city, country, province, glance.area, glance.elevation, glance.founded) : generateCityGlanceAfter(city, country)}
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
              {generateCityGlanceAfter(city, country)}
            </p>
          </section>

          {/* ══ SECTION 18: NEARBY CITIES ════════════════════════════════════ */}
          <section id="nearby" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🗺 Nearby Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {nearbyCities.map((c) => (
                <a
                  key={c.name}
                  href={`/${c.slug}`}
                  className="rounded-xl overflow-hidden border border-white/10 hover:border-green-500/40 block transition" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  {c.image && (
                    <figure>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.image.src}
                        alt={c.image.alt}
                        width={c.image.width}
                        height={c.image.height}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-28 object-cover"
                      />
                      <figcaption className="px-3 py-1 text-[10px] text-gray-500">
                        {c.image.alt}: {c.image.credit}, via Wikimedia Commons
                      </figcaption>
                    </figure>
                  )}
                  <div className="p-4 flex justify-between items-center">
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.dist}</div>
                  </div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateNearbyCitiesParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateNearbyCitiesAfter(city)}
              </p>
            </p>
            {/* Preset compare chips, duplicated inside Nearby Cities
                (owner audit, 3 Nov 2026): the comparisons belong with
                the nearby cities they name. This is a DUPLICATE, not a
                move — the standalone Compare section below keeps its
                own chips and behaviour, unchanged. */}
            {(COMPARE_LINKS[citySlug] ?? []).length > 0 && (
              <div className="mt-6">
                <div className="text-sm text-gray-400 mb-3">Compare {city} with a nearby city:</div>
                <div className="flex gap-3 flex-wrap">
                  {(COMPARE_LINKS[citySlug] ?? []).map((c) => (
                    <a
                      key={c.pair}
                      href={`/compare/${c.pair}`}
                      className="text-sm px-4 py-2 rounded-full transition border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/20 text-gray-300 hover:text-white"
                    >
                      {city} vs {c.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ══ SECTION 19: PUBLIC HOLIDAYS ══════════════════════════════════ */}
          {upcomingHolidays.length > 0 && (
            <section id="holidays" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
                📅 Upcoming Holidays in {country}
              </h2>
              <div className="space-y-3">
                {upcomingHolidays.map((h, i) => (
                  <div key={i} className="flex justify-between items-center rounded-xl px-4 py-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                    <div className="font-medium text-white">{h.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(h.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ SECTION 20: COMPARE THIS CITY ════════════════════════════════ */}
          <section id="compare" className="rounded-2xl p-6 border" style={{ background: 'linear-gradient(135deg, rgba(12,122,61,0.3), rgba(12,122,61,0.1))', borderColor: 'rgba(12,122,61,0.5)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold mb-4">
              ⚖️ Compare {city} with Another City
            </h2>
            <div className="flex gap-3 flex-wrap">
              {(COMPARE_LINKS[citySlug] ?? []).map((c) => (
                <a
                  key={c.pair}
                  href={`/compare/${c.pair}`}
                  className="text-sm px-4 py-2 rounded-full transition border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/20 text-gray-300 hover:text-white"
                >
                  {city} vs {c.label}
                </a>
              ))}
            </div>
          </section>

          {/* ══ SECTION 21: JOBS IN CITY ══════════════════════════════════════ */}
          <section id="jobs" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              💼 Jobs in {city}: {currentMonth} {currentYear}
            </h2>
            {/* Sector cards carry NO growth labels: the old "Fast growing /
                Stable" tags had no published source, so they were removed
                rather than presented as data (owner review, 3 Nov 2026). */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                'IT & Software',
                'Textiles & Garments',
                'Banking & Finance',
                'Education',
                'Healthcare',
                'E-commerce',
              ].map((sector) => (
                <div key={sector} className="rounded-xl p-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="font-medium text-sm text-white">{sector}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-5 flex-wrap">
              <a href="https://www.rozee.pk" target="_blank" rel="noopener noreferrer"
                className="inline-block text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
                Browse jobs in {city} on Rozee.pk →
              </a>
              <a href="https://njp.gov.pk" target="_blank" rel="noopener noreferrer"
                className="inline-block text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
                Government vacancies on the National Job Portal →
              </a>
            </div>
          </section>

          {/* ══ SECTION 22: CHATBOT CTA ═══════════════════════════════════════ */}
          <section id="chatbot" className="rounded-2xl p-6 text-center border" style={{ background: 'linear-gradient(135deg, rgba(200,169,81,0.2), rgba(200,169,81,0.1))', borderColor: 'rgba(200,169,81,0.4)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-2">
              💬 Ask Anything About {city}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Weather, prayer times, gold rates, events: ask the {city} City Assistant
            </p>
            <OpenAssistantButton />
          </section>

          {/* ── Batch 4 Item 2: visible FAQ block — same data as the FAQPage schema in the head ── */}
          <FaqBlock
            faqs={cityFaqs}
            source={`Figures: WorldCityHub city dataset (population) · Weather, prayer times & gold rate: live, ${todayStr}`}
          />

          {/* ══ SECTION 23: FOOTER NAV ════════════════════════════════════════ */}
          <section className="text-center py-6 text-sm text-gray-600">
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-500">
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`} className="hover:text-green-400 transition-colors">Weather</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`} className="hover:text-green-400 transition-colors">Prayer Times</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`} className="hover:text-green-400 transition-colors">Rates</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/news`} className="hover:text-green-400 transition-colors">News</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events`} className="hover:text-green-400 transition-colors">Events</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/economy`} className="hover:text-green-400 transition-colors">Economy</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/sports`} className="hover:text-green-400 transition-colors">Sports</a>
            </div>
            <p className="text-xs text-gray-600">
              Data updates every hour. Prayer times: Karachi method. Gold: LBMA + SBP rate.
              <br />© {currentYear} WorldCityHub · <a href="/privacy" className="hover:underline">Privacy</a> · <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
            </p>
          </section>

        </div>
      </main>

      <CityAssistant snapshot={assistantSnapshot} />

      <ImproveCTA country={resolvedParams.country} city={resolvedParams.city} label={cityParams.city} />

      {/* Live clock script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateClock() {
              const el = document.getElementById('city-clock');
              if (!el) return;
              el.textContent = new Date().toLocaleTimeString('en-PK', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZone: '${cityParams.timezone}'
              });
            }
            updateClock();
            setInterval(updateClock, 1000);
          `,
        }}
      />
    </>
  );
}




