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
    emergency_fire: '16', region: 'South Asia', is_active: true
  }
];

export function getCityBySlug(slug: string): City | null {
  return CITIES.find(c => c.city_slug === slug) ?? null;
}

export function getAllCities(): City[] {
  return CITIES;
}

export const FLAG_COLORS: Record<string, string> = {
  PK: '#01411C', US: '#B22234', GB: '#012169', AE: '#00732F', SA: '#006C35'
};

export type CurrencyInfo = { code: string; symbol: string; rate: number };

export const COUNTRY_CURRENCIES: Record<string, CurrencyInfo> = {
  PK: { code: 'PKR', symbol: '?', rate: 278 },
  US: { code: 'USD', symbol: '$', rate: 1 }
};

export type EventCategory = string;

;

export type TimeTab = 'today' | 'tomorrow' | 'weekend' | 'week' | 'month' | 'upcoming';
export type LevelTab = 'local' | 'provincial' | 'national' | 'global';

export type EventCategory =
  | 'sports' | 'culture' | 'music' | 'literature' | 'food'
  | 'religious' | 'business' | 'film' | 'outdoor' | 'family' | 'conferences';

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

