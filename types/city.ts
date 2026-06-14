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

// Weather-related types (minimal shapes used across the app)
export interface HourlyItem {
  dt: number;
  temp: number;
  condition_id: number;
  icon: string;
  pop: number;
  humidity?: number;
  wind_speed?: number;
  wind_deg?: number;
  dew_point?: number;
}

export interface DailyItem {
  dt: number;
  temp_max: number;
  temp_min: number;
  condition_id: number;
  icon: string;
  pop: number;
  condition?: string;
  temp?: number;
}

export interface WeatherCurrent {
  dt: number;
  temp: number;
  feels_like: number;
  condition: string;
  condition_id: number;
  icon: string;
  uvi: number;
  sunrise: number;
  sunset: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  dew_point: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: HourlyItem[];
  daily: DailyItem[];
  city_name?: string;
  lat?: number;
  lng?: number;
}

export interface HistoricalMonthly { month: string; high: number; low: number }

export interface HistoricalData {
  monthlyAverages: HistoricalMonthly[];
  todayAvgHigh: number;
  todayAvgLow: number;
  records: { hottestEver: number; coldestEver?: number; mostRainDay?: number };
}

export interface ClimateData {
  type: string;
  bestMonths: string[];
}

export interface AQIData {
  aqi: number;
  color: string;
  level: string;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  co: number;
  so2: number;
  sources: { vehicles: number; industry: number; agriculture: number; dust: number };
  history: { aqi: number; date: string }[];
}

export interface SunMoonData {
  sunrise: number;
  sunset: number;
  dayLength: number;
  goldenHourMorning: { start: number; end: number };
  goldenHourEvening: { start: number; end: number };
  twilight: any;
  moon: { phaseEmoji: string; phase: string; illumination: number; moonrise: number; moonset: number; distance?: number; age?: number };
  upcomingMoons: { phase: string; type: string; date: string }[];
  eclipses: { type: string; date: string; visible?: boolean }[];
  constellation: { name: string; direction: string; visibility: string };
}

export interface WeatherAlert {
  id: string;
  event: string;
  description: string;
  start: number;
  end: number;
  color: string;
  severity?: 'minor' | 'moderate' | 'severe' | 'extreme' | string;
}

export interface NearbyCityWeather {
  slug: string;
  name: string;
  temp: number;
  aqi: number;
  isWarmer: boolean;
  rain: number;
  condition?: string;
  distance?: number;
  isCleaner?: boolean;
}
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  rate_to_usd: number;
  flag: string;
}

export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  pakistan: { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate_to_usd: 278.5, flag: '🇵🇰' },
  india: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate_to_usd: 83.2, flag: '🇮🇳' },
  'saudi-arabia': { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate_to_usd: 3.75, flag: '🇸🇦' },
  uae: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate_to_usd: 3.67, flag: '🇦🇪' },
  uk: { code: 'GBP', name: 'British Pound', symbol: '£', rate_to_usd: 0.79, flag: '🇬🇧' },
  usa: { code: 'USD', name: 'US Dollar', symbol: '$', rate_to_usd: 1, flag: '🇺🇸' },
  turkey: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate_to_usd: 32.5, flag: '🇹🇷' },
  germany: { code: 'EUR', name: 'Euro', symbol: '€', rate_to_usd: 0.92, flag: '🇩🇪' },
  bangladesh: { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', rate_to_usd: 110, flag: '🇧🇩' },
};

export const FLAG_COLORS: Record<string, string> = {
  pakistan: '#01411C',
  india: '#FF9933',
  'saudi-arabia': '#006C35',
  uae: '#00732F',
  uk: '#012169',
  usa: '#B22234',
  turkey: '#E30A17',
  germany: '#000000',
  bangladesh: '#006A4E',
};

export type EventCategory =
  | 'sports' | 'culture' | 'music' | 'literature' | 'food'
  | 'religious' | 'business' | 'film' | 'outdoor' | 'family' | 'conferences';

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
  type: 'holiday' | 'sports' | 'cultural' | string;
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
