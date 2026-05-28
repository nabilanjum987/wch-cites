import { City } from '@/types/city';

const LAHORE: City = {
  name: 'Lahore',
  country: 'Pakistan',
  country_code: 'PK',
  country_slug: 'pakistan',
  province: 'Punjab',
  province_slug: 'punjab',
  city_slug: 'lahore',
  lat: 31.5497,
  lng: 74.3436,
  timezone: 'Asia/Karachi',
  population: 14000000,
  major_religion: 'Islam',
  religion_percent: 94,
  primary_color: '#01411C',
  secondary_color: '#FFFFFF',
  famous_for: 'Cultural capital, Mughal heritage',
  famous_products: 'Blue Pottery,Mangoes,Khussa,Multani Mitti',
  emergency_police: '15',
  emergency_ambulance: '1122',
  emergency_fire: '16',
  region: 'South Asia',
  is_active: true,
};

export async function fetchCity(
  country: string,
  province: string,
  city: string
): Promise<City | null> {
  // Hardcoded for Lahore during development
  if (
    city === 'lahore' &&
    province === 'punjab' &&
    country === 'pakistan'
  ) {
    return LAHORE;
  }

  return LAHORE;
}
