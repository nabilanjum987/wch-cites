import { Suspense } from 'react';
import type { Metadata } from 'next';
import ProvincePage, { type ProvinceLiveData } from './ProvinceClient';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, provinceCrumbs, provinceJsonLd, titleCaseSlug } from '@/lib/seo/breadcrumbs';
import { fetchWorldBankLatest, countrySlugToIso2 } from '@/lib/apis/worldbank';
import { fetchPrayerTimes, fetchWeather, fetchGoldRates, fetchSilverPkr, fetchGoldChangePercent } from '@/lib/apis/cityData';
import { getUsdPkrRate } from '@/lib/gold';
import { gnewsSearch } from '@/lib/apis/news';

// Server wrapper: the interactive province page lives in
// ProvinceClient.tsx. Metadata must be exported from a server component,
// so it lives here: every province gets its own unique title,
// description and canonical.
//
// Speed pass (owner audit, 3 Nov 2026, mirroring the homepage pattern):
// the old wrapper awaited the World Bank fetch before returning
// anything, so first byte waited on the slowest upstream. The page now
// returns the shell and JSON-LD immediately and streams the client in
// behind a Suspense boundary once the parallel data batch resolves.

interface PageProps {
  params: Promise<{ country: string; province: string }>;
}

const titleCase = (s: string) =>
  s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const p = await params;
  const province = titleCase(p.province);
  const country = titleCase(p.country);
  const title = `${province}, ${country} Guide | WorldCityHub`;
  const description = `${province}, ${country}: cities, live weather, famous places, food and culture: the complete guide.`;
  const canonical = `https://worldcityhub.vercel.app/${p.country}/${p.province}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: 'WorldCityHub', type: 'website' },
  };
}

// Coordinates for the province capitals and the major cities shown on
// the page: the site's canonical values where the repo holds them
// (getCityData.ts, prayer-keywords.ts CITY_COORDS / LIVE_CITY_COORDS,
// prayer-tables, city-packages), standard published city coordinates
// for the remaining Sindh and KPK cities. Weather is fetched live from
// OpenWeather per city; a city whose fetch fails simply shows no
// temperature, never a stored one.
interface ProvinceServerEntry {
  capitalLat: number;
  capitalLng: number;
  cities: { slug: string; lat: number; lng: number }[];
}

const PROVINCE_SERVER_DATA: Record<string, ProvinceServerEntry> = {
  'pakistan/punjab': {
    capitalLat: 31.5204, capitalLng: 74.3587, // Lahore
    cities: [
      { slug: 'lahore', lat: 31.5204, lng: 74.3587 },
      { slug: 'faisalabad', lat: 31.41554, lng: 73.08969 },
      { slug: 'rawalpindi', lat: 33.59733, lng: 73.0479 },
      { slug: 'multan', lat: 30.1978, lng: 71.4711 },
      { slug: 'gujranwala', lat: 32.15567, lng: 74.18705 },
      { slug: 'sialkot', lat: 32.49268, lng: 74.53134 },
    ],
  },
  'pakistan/sindh': {
    capitalLat: 24.8608, capitalLng: 67.0104, // Karachi
    cities: [
      { slug: 'karachi', lat: 24.8608, lng: 67.0104 },
      { slug: 'hyderabad', lat: 25.3960, lng: 68.3578 },
      { slug: 'sukkur', lat: 27.7061, lng: 68.8483 },
      { slug: 'larkana', lat: 27.5570, lng: 68.2028 },
      { slug: 'nawabshah', lat: 26.2442, lng: 68.4100 },
      { slug: 'jacobabad', lat: 28.2769, lng: 68.4513 },
    ],
  },
  'pakistan/khyber-pakhtunkhwa': {
    capitalLat: 34.008, capitalLng: 71.57849, // Peshawar
    cities: [
      { slug: 'peshawar', lat: 34.008, lng: 71.57849 },
      { slug: 'abbottabad', lat: 34.1558, lng: 73.2194 },
      { slug: 'mardan', lat: 34.1958, lng: 72.0447 },
      { slug: 'mingora', lat: 34.7717, lng: 72.3600 },
      { slug: 'kohat', lat: 33.5889, lng: 71.4429 },
      { slug: 'bannu', lat: 32.9910, lng: 70.6070 },
    ],
  },
  'pakistan/islamabad-capital-territory': {
    capitalLat: 33.72148, capitalLng: 73.04329, // Islamabad
    cities: [
      { slug: 'islamabad', lat: 33.72148, lng: 73.04329 },
    ],
  },
};

function weatherIcon(main: string, iconCode: string): string {
  const night = iconCode?.endsWith('n');
  switch (main) {
    case 'Clear': return night ? '🌙' : '☀️';
    case 'Clouds': return '⛅';
    case 'Rain': return '🌧️';
    case 'Drizzle': return '🌦️';
    case 'Thunderstorm': return '⛈️';
    case 'Snow': return '❄️';
    case 'Mist': case 'Fog': case 'Haze': return '🌫️';
    default: return '🌡️';
  }
}

const cleanTime = (v: unknown): string | null => {
  if (typeof v !== 'string') return null;
  const m = v.match(/(\d{1,2}):(\d{2})/);
  return m ? `${m[1].padStart(2, '0')}:${m[2]}` : null;
};

async function fetchProvinceLiveData(country: string, province: string, provinceName: string): Promise<ProvinceLiveData> {
  const entry = PROVINCE_SERVER_DATA[`${country}/${province}`];
  const isPakistan = country === 'pakistan';

  const [prayerRaw, gold, silver, usdPkr, goldChangePct, weatherResults, newsArticles] = await Promise.all([
    entry ? fetchPrayerTimes(entry.capitalLat, entry.capitalLng) : Promise.resolve(null),
    isPakistan ? fetchGoldRates('PKR') : Promise.resolve(null),
    isPakistan ? fetchSilverPkr() : Promise.resolve(null),
    isPakistan ? getUsdPkrRate() : Promise.resolve(null),
    isPakistan ? fetchGoldChangePercent() : Promise.resolve(null),
    entry
      ? Promise.all(entry.cities.map(async (c) => {
          const w = await fetchWeather(c.lat, c.lng);
          const main = (w?.main as Record<string, number> | undefined);
          const w0 = (w?.weather as Array<Record<string, string>> | undefined)?.[0];
          if (!w || typeof main?.temp !== 'number' || !w0) return null;
          return [c.slug, {
            temp: Math.round(main.temp),
            condition: w0.description ? w0.description.charAt(0).toUpperCase() + w0.description.slice(1) : w0.main,
            icon: weatherIcon(w0.main, w0.icon),
          }] as const;
        }))
      : Promise.resolve([]),
    // News quota gating mirrors the country page: only Pakistan
    // provinces fetch, to stay inside the GNews free plan's daily quota.
    isPakistan
      ? gnewsSearch(`${provinceName} Pakistan`, 'en', 6, 'all', 'Pakistan', 3600)
      : Promise.resolve([]),
  ]);

  const timingsRaw = (prayerRaw?.data as Record<string, Record<string, string>> | undefined)?.timings;
  const timings: Record<string, string> = {};
  for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
    const t = cleanTime(timingsRaw?.[name]);
    if (t) timings[name] = t;
  }
  const prayer = Object.keys(timings).length === 5 ? { timings } : null;

  const rates = gold && typeof gold.price_gram_24k === 'number' && silver && usdPkr
    ? {
        goldPerGram: gold.price_gram_24k,
        goldPerTola: gold.price_gram_24k * 11.6638,
        goldChangePct,
        silverPerTola: silver.per_tola,
        usdPkr,
        updatedAt: gold.updatedAt ?? silver.last_updated ?? null,
      }
    : null;

  const weather: ProvinceLiveData['weather'] = {};
  for (const r of weatherResults) {
    if (r) weather[r[0]] = r[1];
  }

  const news = (newsArticles ?? []).slice(0, 6).map((a) => ({
    title: a.title,
    url: a.url,
    source: a.source?.name ?? 'News',
    publishedAt: a.publishedAt,
  }));

  return { prayer, rates, weather, news };
}

async function ProvinceData({ country, province }: { country: string; province: string }) {
  const iso2 = countrySlugToIso2(country);
  const provinceName = titleCaseSlug(province);
  // FIX-POP1: the province share math divides by the World Bank's latest
  // SP.POP.TOTL for the country (same worldbank.ts path as the economy
  // data). Null when the WB is unreachable; the client then uses its
  // dated Pakistan fallback or hides the share. Fetched in parallel
  // with the live-data batch, not ahead of it.
  const [wb, live] = await Promise.all([
    fetchWorldBankLatest([iso2]),
    fetchProvinceLiveData(country, province, provinceName),
  ]);
  return <ProvincePage wbCountryPopulation={wb[iso2]?.population ?? null} live={live} />;
}

export default async function Page({ params }: PageProps) {
  const p = await params;
  // P6: province pages had no JSON-LD at all: BreadcrumbList +
  // AdministrativeArea (name + URL only, no figures).
  const countryName = titleCaseSlug(p.country);
  const provinceName = titleCaseSlug(p.province);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(provinceCrumbs(countryName, p.country, provinceName, p.province))} />
      <JsonLd data={provinceJsonLd(provinceName, p.province, countryName, p.country)} />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0f1e' }}>
            <div className="animate-pulse text-white text-lg">Loading...</div>
          </div>
        }
      >
        <ProvinceData country={p.country} province={p.province} />
      </Suspense>
    </>
  );
}
