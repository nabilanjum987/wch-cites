// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for city types — WorldCityHub
// All src/-level pages and components import from here.
// ─────────────────────────────────────────────────────────────────────────────

export interface City {
  name: string;
  city_slug: string;
  country: string;
  country_code: string;
  country_slug: string;
  province: string;
  province_slug: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  major_religion: string;
  religion_percent: number;
  primary_color: string;
  secondary_color: string;
  famous_for: string;
  famous_products: string;
  emergency_police: string;
  emergency_ambulance: string;
  emergency_fire: string;
  region: string;
  is_active: boolean;
}

const CITIES: City[] = [
  {
    name: 'Lahore', city_slug: 'lahore', country: 'Pakistan',
    country_code: 'PK', country_slug: 'pakistan', province: 'Punjab',
    province_slug: 'punjab', lat: 31.5204, lng: 74.3587,
    population: 13000000, timezone: 'Asia/Karachi',
    major_religion: 'Islam', religion_percent: 96,
    primary_color: '#01411C', secondary_color: '#C8A951',
    famous_for: 'Mughal Architecture, Food, Culture',
    famous_products: 'Phulkari, Lahori Chappals',
    emergency_police: '15', emergency_ambulance: '1122',
    emergency_fire: '16', region: 'South Asia', is_active: true,
  },
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find(c => c.city_slug === slug) ?? null;
}

export function getAllCities(): City[] {
  return CITIES;
}

// ── Flags & Currency ──────────────────────────────────────────────────────────

export const FLAG_COLORS: Record<string, string> = {
  PK: '#01411C', US: '#B22234', GB: '#012169', AE: '#00732F', SA: '#006C35',
  IN: '#FF9933', NG: '#008751', BR: '#009C3B', DE: '#000000', FR: '#002395',
};

/** Full currency descriptor used by RatesPageClient */
export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
  /** Exchange rate to USD (1 USD = rate_to_usd <currency>) */
  rate_to_usd: number;
  name: string;
  flag: string;
}

export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  // keyed by BOTH ISO code AND country slug so callers can use either
  PK: { code: 'PKR', symbol: '₨',  rate: 278,  rate_to_usd: 278,  name: 'Pakistani Rupee', flag: 'PK' },
  pakistan: { code: 'PKR', symbol: '₨',  rate: 278,  rate_to_usd: 278,  name: 'Pakistani Rupee', flag: 'PK' },
  US: { code: 'USD', symbol: '$',   rate: 1,    rate_to_usd: 1,    name: 'US Dollar',        flag: 'US' },
  'united-states': { code: 'USD', symbol: '$', rate: 1, rate_to_usd: 1, name: 'US Dollar', flag: 'US' },
  GB: { code: 'GBP', symbol: '£',   rate: 0.79, rate_to_usd: 0.79, name: 'British Pound',   flag: 'GB' },
  'united-kingdom': { code: 'GBP', symbol: '£', rate: 0.79, rate_to_usd: 0.79, name: 'British Pound', flag: 'GB' },
  AE: { code: 'AED', symbol: 'د.إ', rate: 3.67, rate_to_usd: 3.67, name: 'UAE Dirham',      flag: 'AE' },
  'united-arab-emirates': { code: 'AED', symbol: 'د.إ', rate: 3.67, rate_to_usd: 3.67, name: 'UAE Dirham', flag: 'AE' },
  SA: { code: 'SAR', symbol: '﷼',   rate: 3.75, rate_to_usd: 3.75, name: 'Saudi Riyal',     flag: 'SA' },
  'saudi-arabia': { code: 'SAR', symbol: '﷼', rate: 3.75, rate_to_usd: 3.75, name: 'Saudi Riyal', flag: 'SA' },
  IN: { code: 'INR', symbol: '₹',   rate: 83,   rate_to_usd: 83,   name: 'Indian Rupee',    flag: 'IN' },
  india: { code: 'INR', symbol: '₹', rate: 83, rate_to_usd: 83, name: 'Indian Rupee', flag: 'IN' },
  DE: { code: 'EUR', symbol: '€',   rate: 0.92, rate_to_usd: 0.92, name: 'Euro',             flag: 'DE' },
  germany: { code: 'EUR', symbol: '€', rate: 0.92, rate_to_usd: 0.92, name: 'Euro', flag: 'DE' },
  FR: { code: 'EUR', symbol: '€',   rate: 0.92, rate_to_usd: 0.92, name: 'Euro',             flag: 'FR' },
  france: { code: 'EUR', symbol: '€', rate: 0.92, rate_to_usd: 0.92, name: 'Euro', flag: 'FR' },
  NG: { code: 'NGN', symbol: '₦',   rate: 1500, rate_to_usd: 1500, name: 'Nigerian Naira',  flag: 'NG' },
  nigeria: { code: 'NGN', symbol: '₦', rate: 1500, rate_to_usd: 1500, name: 'Nigerian Naira', flag: 'NG' },
  BR: { code: 'BRL', symbol: 'R$',  rate: 5.0,  rate_to_usd: 5.0,  name: 'Brazilian Real',  flag: 'BR' },
  brazil: { code: 'BRL', symbol: 'R$', rate: 5.0, rate_to_usd: 5.0, name: 'Brazilian Real', flag: 'BR' },
};

// ── Events ────────────────────────────────────────────────────────────────────

export type EventCategory =
  | 'sports' | 'culture' | 'music' | 'literature' | 'food'
  | 'religious' | 'business' | 'film' | 'outdoor' | 'family' | 'conferences';

export type TimeTab = 'today' | 'tomorrow' | 'weekend' | 'week' | 'month' | 'upcoming';
export type LevelTab = 'local' | 'provincial' | 'national' | 'global';

export interface CityEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  address: string;
  city: string;
  country: string;
  category: EventCategory;
  start_time: string;
  end_time: string;
  image_url?: string;
  ticket_url?: string;
  is_free: boolean;
  price_from?: number;
  currency?: string;
  level: LevelTab;
  lat?: number;
  lng?: number;
}

export interface NationalEvent {
  id: string;
  title: string;
  date: string;
  type: string;
  description?: string;
  country_code: string;
}

export interface PendingEvent {
  name: string;
  date: string;
  venue: string;
  category: string;
  website?: string;
  city: string;
  country_code: string;
}

export interface RecurringEvent {
  id: string;
  title: string;
  day: string;
  time: string;
  venue: string;
  category: EventCategory;
  is_free: boolean;
  website?: string;
}

// ── News ──────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  /** source can be a plain string name or an object with {name} */
  source: string | { name: string };
  publishedAt: string | Date;
  category: string;
  language: string;
  country: string;
  isBreaking?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral';
  globalImpact?: GlobalImpactObject;
  locationLevel?: LocationLevel;
}

/** Helper to get display name from article source */
export function getSourceName(source: NewsArticle['source']): string {
  return typeof source === 'string' ? source : source.name;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  videoId: string;
  url?: string;
  publishedAt: string;
  channel: string;
  viewCount?: string;
  duration?: string;
}

export type NewsCategory =
  | 'all' | 'government' | 'finance' | 'sports' | 'culture'
  | 'religion' | 'health' | 'education' | 'environment' | 'tech' | 'crime' | 'entertainment';

/** String literal used in article metadata */
export type LocationLevelString = 'city' | 'provincial' | 'national' | 'regional' | 'global';

/** Object shape used by NewsPage's location tab filter */
export interface LocationLevelObject {
  type: string;
  label: string;
  slug?: string;
}

/** Union — either form is valid */
export type LocationLevel = LocationLevelString | LocationLevelObject;
/** String union used in simple severity contexts */
export type GlobalImpactLevel = 'low' | 'medium' | 'high';

/** Rich object used by NewsPage's impact cards */
export interface GlobalImpactObject {
  impact: 'positive' | 'negative' | 'neutral';
  icon: string;
  title: string;
  description: string;
}

/** Backward-compat alias — prefer GlobalImpactLevel or GlobalImpactObject explicitly */
export type GlobalImpact = GlobalImpactLevel | GlobalImpactObject;
export type LanguageTab = 'local' | 'english' | 'urdu' | 'arabic';

export interface TrendingTopic {
  tag: string;
  keyword?: string;
  emoji?: string;
  count: number;
  articleCount?: number;
  trend: 'up' | 'down' | 'flat';
}

// ── News constants ────────────────────────────────────────────────────────────

export const NEWS_CATEGORIES: { key: NewsCategory; label: string }[] = [
  { key: 'all',           label: 'All News' },
  { key: 'government',    label: 'Government' },
  { key: 'finance',       label: 'Finance' },
  { key: 'sports',        label: 'Sports' },
  { key: 'culture',       label: 'Culture' },
  { key: 'religion',      label: 'Religion' },
  { key: 'health',        label: 'Health' },
  { key: 'education',     label: 'Education' },
  { key: 'environment',   label: 'Environment' },
  { key: 'tech',          label: 'Technology' },
  { key: 'crime',         label: 'Crime' },
  { key: 'entertainment', label: 'Entertainment' },
];

export const CATEGORY_COLORS: Record<NewsCategory, string> = {
  all:           'bg-gray-100 text-gray-700',
  government:    'bg-blue-100 text-blue-700',
  finance:       'bg-green-100 text-green-700',
  sports:        'bg-orange-100 text-orange-700',
  culture:       'bg-purple-100 text-purple-700',
  religion:      'bg-teal-100 text-teal-700',
  health:        'bg-red-100 text-red-700',
  education:     'bg-indigo-100 text-indigo-700',
  environment:   'bg-emerald-100 text-emerald-700',
  tech:          'bg-cyan-100 text-cyan-700',
  crime:         'bg-rose-100 text-rose-700',
  entertainment: 'bg-pink-100 text-pink-700',
};

export interface SourceSet {
  local: string[];
  international: string[];
  urdu?: string[];
  arabic?: string[];
}

export const COUNTRY_SOURCES: Record<string, SourceSet> = {
  PK: {
    local: ['Dawn', 'The News', 'Geo News', 'ARY News', 'Express Tribune', 'Dunya News'],
    international: ['Reuters', 'BBC World', 'Al Jazeera', 'AFP'],
    urdu: ['جیو اردو', 'اے آر وائی نیوز', 'ایکسپریس اردو', 'دنیا اردو', 'سماء اردو'],
  },
  IN: {
    local: ['Times of India', 'NDTV', 'The Hindu', 'India Today', 'Hindustan Times'],
    international: ['Reuters', 'BBC World', 'AFP'],
  },
  GB: {
    local: ['BBC', 'The Guardian', 'The Times', 'Sky News', 'The Telegraph'],
    international: ['Reuters', 'AP', 'AFP'],
  },
  US: {
    local: ['CNN', 'NBC News', 'Fox News', 'NPR', 'AP News', 'Washington Post'],
    international: ['Reuters', 'BBC World', 'AFP'],
  },
  AE: {
    local: ['Gulf News', 'The National', 'Khaleej Times'],
    international: ['Reuters', 'Al Jazeera', 'AFP'],
    arabic: ['الإمارات اليوم', 'البيان', 'الخليج'],
  },
  SA: {
    local: ['Arab News', 'Saudi Gazette'],
    international: ['Reuters', 'Al Arabiya', 'AFP'],
    arabic: ['الرياض', 'عكاظ', 'المواطن'],
  },
};

export const DEFAULT_SOURCES: SourceSet = {
  local: ['Local News', 'City Times'],
  international: ['Reuters', 'AFP', 'BBC World', 'Al Jazeera'],
};

// ── Weather ───────────────────────────────────────────────────────────────────

export interface HourlyItem {
  dt: number;
  temp: number;
  pop: number;
  condition: string;
  condition_id: number;
  icon: string;
}

export interface DailyItem {
  dt: number;
  temp_max: number;
  temp_min: number;
  pop: number;
  condition: string;
  condition_id: number;
  icon: string;
}

export interface WeatherCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  uvi: number;
  pressure: number;
  visibility: number;
  dew_point: number;
  clouds: number;
  condition: string;
  condition_id: number;
  icon: string;
  sunrise: number;
  sunset: number;
  dt: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyItem[];
  daily: DailyItem[];
  city_name?: string;
  lat?: number;
  lng?: number;
}

export interface MonthlyAverage { month: string; high: number; low: number; rain: number }

export interface HistoricalData {
  todayAvgHigh: number;
  todayAvgLow: number;
  monthlyAverages: MonthlyAverage[];
  records: { hottestEver: number; coldestEver: number; mostRainDay: number };
}

export interface ClimateData {
  type: string;
  bestMonths: string[];
  rainySeason: string;
  summerPeak: string;
  winterCold: string;
  allMonthsRanked: string[];
}

export interface AQIData {
  aqi: number;
  level: string;
  color: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  sources: { vehicles: number; industry: number; agriculture: number; dust: number; other: number };
  history: { date: string; aqi: number }[];
}

export interface SunMoonUpcomingMoon {
  date: string;
  type: string;
  phase: string;
}

export interface SunMoonEclipse {
  date: string;
  type: string;
  visible: boolean;
}

export interface SunMoonConstellation {
  name: string;
  direction: string;
  visibility: string;
}

export interface SunMoonData {
  sunrise: number;   // unix timestamp seconds
  sunset: number;    // unix timestamp seconds
  solarNoon?: number;
  dayLength?: number;
  goldenHourMorning?: { start: number; end: number };
  goldenHourEvening?: { start: number; end: number };
  twilight?: {
    civil: { dawn: number; dusk: number };
    nautical: { dawn: number; dusk: number };
    astronomical: { dawn: number; dusk: number };
  };
  moon?: {
    phase: string;
    phaseEmoji: string;
    illumination: number;
    moonrise: number;  // unix timestamp
    moonset: number;   // unix timestamp
    distance: number;
    age: number;
  };
  upcomingMoons?: SunMoonUpcomingMoon[];
  eclipses?: SunMoonEclipse[];
  constellation?: SunMoonConstellation;
}

export interface WeatherAlert {
  id?: string;
  headline: string;
  severity: string;
  urgency: string;
  areas: string;
  event: string;
  effective: string;
  expires: string;
  desc: string;
  description?: string;  // alias for desc used by some components
  start: number;
  end: number;
  color?: string;        // severity-mapped colour hex used by WeatherPageClient
}

export interface NearbyCityWeather {
  name: string;
  slug: string;
  temp: number;
  aqi: number;
  rain: number;
  condition: string;
  distance: number;
  isWarmer: boolean;
  isCleaner: boolean;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  country_code: string;
  province: string;
  city_slug: string;
  country_slug: string;
  province_slug: string;
  lat: number;
  lng: number;
  population: number;
  primary_color: string;
}
