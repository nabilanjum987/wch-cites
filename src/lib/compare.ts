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
];

export const POPULAR_PAIRS: [string, string][] = [
  ['lahore', 'karachi'],
  ['lahore', 'islamabad'],
  ['karachi', 'islamabad'],
  ['faisalabad', 'lahore'],
  ['rawalpindi', 'islamabad'],
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

export async function getCityCompare(ref: CompareCityRef): Promise<CityCompareData | null> {
  const city = await getCityData(ref.countrySlug, ref.provinceSlug, ref.citySlug);
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
