import { City } from '@/types/city';

const MOCK_CITIES: Record<string, City> = {
  'pakistan/punjab/lahore': {
    name: 'Lahore',
    city_slug: 'lahore',
    country: 'Pakistan',
    country_code: 'PK',
    country_slug: 'pakistan',
    province: 'Punjab',
    province_slug: 'punjab',
    lat: 31.5204,
    lng: 74.3587,
    population: 13095038,
    timezone: 'Asia/Karachi',
    major_religion: 'Islam',
    religion_percent: 96,
    primary_color: '#01411C',
    secondary_color: '#FFFFFF',
    famous_for: 'Mughal architecture, food, culture',
    famous_products: 'Chikan embroidery, Leather goods',
    emergency_police: '15',
    emergency_ambulance: '1122',
    emergency_fire: '16',
    region: 'South Asia',
    is_active: true,
  },
};

export async function getCityData(
  country: string,
  province: string,
  city: string
): Promise<City | null> {
  const key = `${country}/${province}/${city}`;
  return MOCK_CITIES[key] ?? {
    name: city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    city_slug: city,
    country: country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    country_code: country.toUpperCase().slice(0, 2),
    country_slug: country,
    province: province.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    province_slug: province,
    lat: 0,
    lng: 0,
    population: 0,
    timezone: 'UTC',
    major_religion: 'Unknown',
    religion_percent: 0,
    primary_color: '#1a1a2e',
    secondary_color: '#FFFFFF',
    famous_for: '',
    famous_products: '',
    emergency_police: '911',
    emergency_ambulance: '911',
    emergency_fire: '911',
    region: 'Unknown',
    is_active: true,
  };
}
