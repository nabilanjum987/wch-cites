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

export type LevelTab = 'global' | 'national' | 'provincial' | 'local';
export type TimeTab = 'today' | 'tomorrow' | 'weekend' | 'week' | 'month' | 'upcoming';
export type EventCategory =
  | 'sports'
  | 'culture'
  | 'music'
  | 'literature'
  | 'food'
  | 'religious'
  | 'business'
  | 'film'
  | 'outdoor'
  | 'family'
  | 'conferences';

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
  organizer?: string;
  level: LevelTab;
  lat?: number;
  lng?: number;
}

export interface RecurringEvent {
  id: string;
  title: string;
  venue: string;
  day: string;
  time: string;
  category: EventCategory;
  is_free: boolean;
  website?: string;
}

export interface NationalEvent {
  id: string;
  title: string;
  date: string;
  type: 'holiday' | 'religious' | 'sports';
  description: string;
  country_code: string;
}

export interface PendingEvent {
  name: string;
  date: string;
  venue: string;
  category: string;
  website: string;
  city: string;
  country_code: string;
}
