import { supabase } from './supabase';
import type { City } from '@/types/city';

/**
 * Fetch all cities from Supabase
 * Used for generating sitemaps and other global city lists
 */
export async function getAllCities(): Promise<City[]> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('country', { ascending: true })
      .order('province', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching cities:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Failed to fetch all cities:', err);
    return [];
  }
}

/**
 * Get unique countries from all cities
 */
export async function getAllCountries(): Promise<string[]> {
  const cities = await getAllCities();
  const countries = [...new Set(cities.map(city => city.country))];
  return countries.sort();
}
