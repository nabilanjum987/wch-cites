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
