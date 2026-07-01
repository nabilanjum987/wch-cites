import { City } from '@/types/city';
import { getSupabase } from './supabase';

// Fallback mock data for development
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
  'pakistan/sindh/karachi': {
    name: 'Karachi',
    city_slug: 'karachi',
    country: 'Pakistan',
    country_code: 'PK',
    country_slug: 'pakistan',
    province: 'Sindh',
    province_slug: 'sindh',
    lat: 24.8607,
    lng: 67.0011,
    population: 14910352,
    timezone: 'Asia/Karachi',
    major_religion: 'Islam',
    religion_percent: 95,
    primary_color: '#01411C',
    secondary_color: '#FFFFFF',
    famous_for: 'Port city, financial hub, beaches',
    famous_products: 'Textiles, seafood, leather goods',
    emergency_police: '15',
    emergency_ambulance: '1122',
    emergency_fire: '16',
    region: 'South Asia',
    is_active: true,
  },
  'uae/dubai/dubai': {
    name: 'Dubai',
    city_slug: 'dubai',
    country: 'UAE',
    country_code: 'AE',
    country_slug: 'uae',
    province: 'Dubai',
    province_slug: 'dubai',
    lat: 25.276987,
    lng: 55.296249,
    population: 3331420,
    timezone: 'Asia/Dubai',
    major_religion: 'Islam',
    religion_percent: 76,
    primary_color: '#00732F',
    secondary_color: '#FFFFFF',
    famous_for: 'Skyscrapers, luxury malls, desert experiences',
    famous_products: 'Gold, dates, luxury goods',
    emergency_police: '999',
    emergency_ambulance: '998',
    emergency_fire: '997',
    region: 'Middle East',
    is_active: true,
  },
  'uk/england/london': {
    name: 'London',
    city_slug: 'london',
    country: 'UK',
    country_code: 'GB',
    country_slug: 'uk',
    province: 'England',
    province_slug: 'england',
    lat: 51.5072,
    lng: -0.1276,
    population: 8982000,
    timezone: 'Europe/London',
    major_religion: 'Christianity',
    religion_percent: 48,
    primary_color: '#012169',
    secondary_color: '#FFFFFF',
    famous_for: 'Landmarks, finance, culture',
    famous_products: 'Fashion, finance, media',
    emergency_police: '999',
    emergency_ambulance: '999',
    emergency_fire: '999',
    region: 'Europe',
    is_active: true,
  },
  'saudi-arabia/makkah/mecca': {
    name: 'Mecca',
    city_slug: 'mecca',
    country: 'Saudi Arabia',
    country_code: 'SA',
    country_slug: 'saudi-arabia',
    province: 'Makkah',
    province_slug: 'makkah',
    lat: 21.3891,
    lng: 39.8579,
    population: 2000000,
    timezone: 'Asia/Riyadh',
    major_religion: 'Islam',
    religion_percent: 100,
    primary_color: '#006C35',
    secondary_color: '#FFFFFF',
    famous_for: 'Holy Kaaba, pilgrimage',
    famous_products: 'Dates, Zamzam water',
    emergency_police: '999',
    emergency_ambulance: '997',
    emergency_fire: '998',
    region: 'Middle East',
    is_active: true,
  },
  'turkey/istanbul/istanbul': {
    name: 'Istanbul',
    city_slug: 'istanbul',
    country: 'Turkey',
    country_code: 'TR',
    country_slug: 'turkey',
    province: 'Istanbul',
    province_slug: 'istanbul',
    lat: 41.0082,
    lng: 28.9784,
    population: 15460000,
    timezone: 'Europe/Istanbul',
    major_religion: 'Islam',
    religion_percent: 99,
    primary_color: '#E30A17',
    secondary_color: '#FFFFFF',
    famous_for: 'History, Bosphorus, bazaars',
    famous_products: 'Carpets, ceramics, spices',
    emergency_police: '155',
    emergency_ambulance: '112',
    emergency_fire: '110',
    region: 'Europe/Asia',
    is_active: true,
  },
};

export async function getCityData(
  country: string,
  province: string,
  city: string
): Promise<City | null> {
  try {
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('country_slug', country)
        .eq('province_slug', province)
        .eq('city_slug', city)
        .eq('is_active', true)
        .single();

      if (error) {
        console.warn(`Database query error for ${country}/${province}/${city}:`, error.message);
        return getMockCityData(country, province, city);
      }

      if (!data) {
        console.info(`City not found in database, using mock data`);
        return getMockCityData(country, province, city);
      }

      return data as City;
    } catch (dbError: any) {
      console.error('Database connection error:', dbError?.message);
      return getMockCityData(country, province, city);
    }
  } catch (error: any) {
    console.error('Error in getCityData:', error?.message);
    return getMockCityData(country, province, city);
  }
}

function getMockCityData(country: string, province: string, city: string): City | null {
  const key = `${country}/${province}/${city}`;
  
  // Check if we have hardcoded mock data
  if (MOCK_CITIES[key]) {
    return MOCK_CITIES[key];
  }

  // Generate default city object
  return {
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
    famous_for: 'A city waiting to be discovered',
    famous_products: '',
    emergency_police: '911',
    emergency_ambulance: '911',
    emergency_fire: '911',
    region: 'Unknown',
    is_active: true,
  };
}

// Export async function to fetch multiple cities
export async function getCitiesData(
  citySlugs: string[]
): Promise<City[]> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .in('city_slug', citySlugs)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching cities:', error.message);
      return [];
    }

    return (data || []) as City[];
  } catch (error: any) {
    console.error('Error in getCitiesData:', error?.message);
    return [];
  }
}
