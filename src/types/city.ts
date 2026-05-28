export interface City {
  name: string;
  slug: string;
  country: string;
  countrySlug: string;
  province: string;
  provinceSlug: string;
  lat: number;
  lng: number;
  timezone: string;
}

export const CITIES: City[] = [
  {
    name: 'Karachi',
    slug: 'karachi',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    province: 'Sindh',
    provinceSlug: 'sindh',
    lat: 24.8607,
    lng: 67.0011,
    timezone: 'Asia/Karachi'
  },
  {
    name: 'Lahore',
    slug: 'lahore',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    province: 'Punjab',
    provinceSlug: 'punjab',
    lat: 31.5204,
    lng: 74.3587,
    timezone: 'Asia/Karachi'
  },
  {
    name: 'Islamabad',
    slug: 'islamabad',
    country: 'Pakistan',
    countrySlug: 'pakistan',
    province: 'Federal',
    provinceSlug: 'federal',
    lat: 33.6844,
    lng: 73.0479,
    timezone: 'Asia/Karachi'
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    country: 'India',
    countrySlug: 'india',
    province: 'Maharashtra',
    provinceSlug: 'maharashtra',
    lat: 19.076,
    lng: 72.8777,
    timezone: 'Asia/Kolkata'
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    country: 'India',
    countrySlug: 'india',
    province: 'Delhi',
    provinceSlug: 'delhi',
    lat: 28.6139,
    lng: 77.209,
    timezone: 'Asia/Kolkata'
  },
  {
    name: 'London',
    slug: 'london',
    country: 'United Kingdom',
    countrySlug: 'united-kingdom',
    province: 'England',
    provinceSlug: 'england',
    lat: 51.5074,
    lng: -0.1278,
    timezone: 'Europe/London'
  },
  {
    name: 'New York',
    slug: 'new-york',
    country: 'United States',
    countrySlug: 'united-states',
    province: 'New York',
    provinceSlug: 'new-york',
    lat: 40.7128,
    lng: -74.006,
    timezone: 'America/New_York'
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    country: 'UAE',
    countrySlug: 'uae',
    province: 'Dubai',
    provinceSlug: 'dubai',
    lat: 25.2048,
    lng: 55.2708,
    timezone: 'Asia/Dubai'
  },
];

export function getCityBySlug(countrySlug: string, provinceSlug: string, citySlug: string): City | undefined {
  return CITIES.find(
    (c) =>
      c.countrySlug.toLowerCase() === countrySlug.toLowerCase() &&
      c.provinceSlug.toLowerCase() === provinceSlug.toLowerCase() &&
      c.slug.toLowerCase() === citySlug.toLowerCase()
  );
}
