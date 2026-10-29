// ─────────────────────────────────────────────────────────────────────────────
// Prayer-times keyword SEO (final30 prayer cluster).
//
// The prayer-times page is ONE template for every city, so keyword headings
// and titles live here, keyed by city slug, instead of being hard-coded
// into the template. Only the slugs listed here get keyword treatment:
//
//   * lahore   — PR1 worked example (exact title/H1/H2/H3 from the brief).
//   * karachi  — PR2 (A2), following the Lahore model.
//   * islamabad — PR2 flank ONLY (generic title/H1 + one Fajr H3).
//     The two Very Hard reserve phrases for the capital city are NEVER
//     written into a title, H1 or H2 anywhere in this cluster —
//     Islamabad's title and H1 stay generic, and its AEO card carries
//     only the single Fajr flank H3.
//
// Every other city keeps the template's pre-existing generic title and
// headings, so this file cannot regress an untouched page.
//
// COORDS: getCityBySlug() only knows Lahore; every other city falls back
// to Lahore's coordinates in the template, which would show Lahore's
// times on the Karachi/Islamabad pages. CITY_COORDS overrides the fallback
// with the coordinates already stored in the repo's own prayer-tables
// files (karachi.ts, islamabad.ts), so server and client fetches use the
// right city. Timezone is Asia/Karachi for both (Pakistan, no DST).
// ─────────────────────────────────────────────────────────────────────────────

export interface PrayerSeo {
  /** <title> — always ≤60 chars. */
  title: string;
  /** Meta description — always ≤155 chars. */
  description: string;
  /** Page H1. Lowercase keyword form for lahore/karachi; generic otherwise. */
  h1: string;
}

const SEO: Record<string, PrayerSeo> = {
  lahore: {
    title: 'Prayer Times in Lahore Today | WorldCityHub',
    description:
      'Prayer times in Lahore today: live Fajr, Dhuhr, Asr, Maghrib and Isha times, Sehri and Jummah timings, Qibla direction and the full-year calendar.',
    h1: 'prayer times in lahore',
  },
  // PR2 (A2): Karachi follows the Lahore model.
  karachi: {
    title: 'Prayer Times in Karachi Today | WorldCityHub',
    description:
      'Prayer times in Karachi today: live Fajr, Dhuhr, Asr, Maghrib and Isha times, Sehri and Jummah timings, plus Qibla direction and mosques.',
    h1: 'prayer times in karachi',
  },
  // PR2 (A2) flank ONLY: generic title and H1 (the same header text the
  // template already rendered for this city). The single keyword heading
  // for this city is the Fajr H3 in the client, added by PR2.
  islamabad: {
    title: 'Islamabad Faith & Prayer Guide | WorldCityHub',
    description:
      "Islamabad faith guide: live prayer timetable, Fajr times, mosques, churches and places of worship across Pakistan's capital city.",
    h1: 'Islamabad, Pakistan',
  },
};

/** Keyword SEO for a prayer-times page, or null for a generic city page. */
export function getPrayerSeo(citySlug: string): PrayerSeo | null {
  return SEO[citySlug] ?? null;
}

export interface CityCoords {
  lat: number;
  lng: number;
  timezone: string;
}

/** Coordinates for cities the template's city registry does not know. */
export const CITY_COORDS: Record<string, CityCoords> = {
  // From src/lib/data/prayer-tables/karachi.ts and islamabad.ts.
  karachi: { lat: 24.8608, lng: 67.0104, timezone: 'Asia/Karachi' },
  islamabad: { lat: 33.72148, lng: 73.04329, timezone: 'Asia/Karachi' },
  // B10: without these, Multan/Peshawar prayer pages seed from the
  // Lahore fallback (31.5204, 74.3587). Coordinates are the site's
  // canonical CITY_DB values (city main page), matching the
  // prayer-tables rows for Peshawar exactly and Multan within 1 km.
  multan: { lat: 30.1978, lng: 71.4711, timezone: 'Asia/Karachi' },
  peshawar: { lat: 34.008, lng: 71.57849, timezone: 'Asia/Karachi' },
};

// ── PR3 (B7): live comparison-table coordinates ──────────────────────────
// The "Compare", "Nearby Cities" and "Around the World" tables used to
// carry hard-coded times (summer values that went stale). They now fetch
// live Aladhan times (method 1, school 1 — the same method as Lahore)
// for these coordinates, and show a dash until a live response arrives:
// no stored time is ever shown as current again. Coordinates are from
// the repo's own prayer-tables files where available (gujranwala,
// faisalabad, rawalpindi, multan, karachi, islamabad, dubai, istanbul,
// london, new-york, cairo via prayer-tables-batch2), from
// src/lib/getCityData.ts (mecca), or standard geographic coordinates
// (medina, jakarta).
export const LIVE_CITY_COORDS: Record<string, CityCoords> = {
  karachi: { lat: 24.8608, lng: 67.0104, timezone: 'Asia/Karachi' },
  islamabad: { lat: 33.72148, lng: 73.04329, timezone: 'Asia/Karachi' },
  gujranwala: { lat: 32.15567, lng: 74.18705, timezone: 'Asia/Karachi' },
  faisalabad: { lat: 31.41554, lng: 73.08969, timezone: 'Asia/Karachi' },
  rawalpindi: { lat: 33.59733, lng: 73.0479, timezone: 'Asia/Karachi' },
  multan: { lat: 30.19679, lng: 71.47824, timezone: 'Asia/Karachi' },
  dubai: { lat: 25.269722222222, lng: 55.309444444444, timezone: 'Asia/Dubai' },
  mecca: { lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh' },
  medina: { lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh' },
  istanbul: { lat: 41.01, lng: 28.960277777778, timezone: 'Europe/Istanbul' },
  jakarta: { lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta' },
  cairo: { lat: 30.044444444444, lng: 31.235833333333, timezone: 'Africa/Cairo' },
  london: { lat: 51.507222222222, lng: -0.1275, timezone: 'Europe/London' },
  'new-york': { lat: 40.712777777778, lng: -74.006111111111, timezone: 'America/New_York' },
};
