// World Capitals panel data (WP2 Slice 5 / Q5, frozen spec §9A).
// Baked from the verified dataset collected 2026-10-21
// (~/workspace/worldcityhub/data/world_capitals.csv, GeoNames-based):
// capital, country, site country slug, ISO code (for flagcdn flags),
// coordinates and IANA timezone. Live time is computed client-side
// with Intl; live temperature comes from Open-Meteo at these coords.
// Per the link map (§9A) each capital links to its COUNTRY page today.

export interface Capital {
  capital: string;
  country: string;
  countrySlug: string;
  code: string; // ISO 3166-1 alpha-2, lowercase for flagcdn
  lat: number;
  lng: number;
  tz: string;
}

export const CAPITALS: Capital[] = [
  { capital: 'Islamabad', country: 'Pakistan', countrySlug: 'pakistan', code: 'pk', lat: 33.72148, lng: 73.04329, tz: 'Asia/Karachi' },
  { capital: 'London', country: 'United Kingdom', countrySlug: 'united-kingdom', code: 'gb', lat: 51.50853, lng: -0.12574, tz: 'Europe/London' },
  { capital: 'Paris', country: 'France', countrySlug: 'france', code: 'fr', lat: 48.85341, lng: 2.3488, tz: 'Europe/Paris' },
  { capital: 'Berlin', country: 'Germany', countrySlug: 'germany', code: 'de', lat: 52.52437, lng: 13.41053, tz: 'Europe/Berlin' },
  { capital: 'Tokyo', country: 'Japan', countrySlug: 'japan', code: 'jp', lat: 35.6895, lng: 139.69171, tz: 'Asia/Tokyo' },
  { capital: 'Washington', country: 'United States', countrySlug: 'united-states', code: 'us', lat: 38.89511, lng: -77.03637, tz: 'America/New_York' },
  { capital: 'Canberra', country: 'Australia', countrySlug: 'australia', code: 'au', lat: -35.28346, lng: 149.12807, tz: 'Australia/Sydney' },
  { capital: 'Ottawa', country: 'Canada', countrySlug: 'canada', code: 'ca', lat: 45.41117, lng: -75.69812, tz: 'America/Toronto' },
  { capital: 'Beijing', country: 'China', countrySlug: 'china', code: 'cn', lat: 39.9075, lng: 116.39723, tz: 'Asia/Shanghai' },
  { capital: 'New Delhi', country: 'India', countrySlug: 'india', code: 'in', lat: 28.62137, lng: 77.2148, tz: 'Asia/Kolkata' },
  { capital: 'Riyadh', country: 'Saudi Arabia', countrySlug: 'saudi-arabia', code: 'sa', lat: 24.68773, lng: 46.72185, tz: 'Asia/Riyadh' },
  { capital: 'Cairo', country: 'Egypt', countrySlug: 'egypt', code: 'eg', lat: 30.06263, lng: 31.24967, tz: 'Africa/Cairo' },
];
