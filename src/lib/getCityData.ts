import { City } from '@/types/city';
import { supabase } from './supabase';

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
};

export async function getCityData(
  country: string,
  province: string,
  city: string
): Promise<City | null> {
  try {
    try {
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
