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

