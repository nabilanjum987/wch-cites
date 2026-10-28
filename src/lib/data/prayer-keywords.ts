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
