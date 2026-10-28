// ── WorldCityHub — personalities data layer (WP9 / marathon Q14) ──────────
// One dataset, three surfaces (package §16): city pages draw from the
// CITY pool (base), country pages from the COUNTRY pool (its cities'
// pools + national figures), the homepage from a planned 24-MONTH
// ROTATION over the pools.
//
// Source of truth: the `personalities` table (migration
// 0005_personalities.sql). While that migration is unapplied, every
// function falls back to the extracted hard-coded seed
// (src/lib/data/personalities-seed.ts) so the live pages behave
// exactly as before. Server-side only (PostgREST reads).
//
// VERIFIED RULE: public pool queries (byCity / byCountry / bornToday /
// rotation) return only verified=true rows from the database —
// profiles publish as their data is verified. The seed fallback is
// exempt by necessity: the seed carries no verification state and the
// site already publishes those profiles today; the migration seeds
// them as verified=false pending a human verification pass, at which
// point the database takes over cleanly.

import {
  PERSONALITIES_SEED,
  type PersonalityProfile,
} from './data/personalities-seed';

export type { PersonalityProfile };
export { PERSONALITIES_SEED };

interface PersonalityRow {
  slug: string;
  name: string;
  title: string;
  occupation: string;
  birth_date: string | null;
  death_date: string | null;
  nationality: string;
  city_slug: string | null;
  province_slug: string | null;
  country_slug: string;
  city_name: string;
  province_name: string;
  country_name: string;
  summary: string;
  achievements: PersonalityProfile['achievements'];
  timeline: PersonalityProfile['timeline'];
  works: PersonalityProfile['works'];
  quotes: PersonalityProfile['quotes'];
  description_sections: PersonalityProfile['descriptionSections'];
  image_url: string | null;
  image_credit: string | null;
  image_licence: string | null;
  primary_color: string;
  sources: { name: string; url: string }[];
  verified: boolean;
}

// ── Description guarantee (CARD 0 build fix, 2026-10-22) ───────────────────
// A profile's description must ALWAYS be a non-empty string: page
// metadata slices it during static generation, and the production
// build died on /personalities/* because a database row reached the
// page with description undefined (its summary was absent). The
// fallback below is composed ONLY from the record's own fields —
// name, title, nationality, city, country — never invented facts.
function fallbackDescription(p: {
  name: string;
  title: string;
  nationality?: string;
  city?: string;
  country?: string;
}): string {
  const place = [p.city, p.country].filter(Boolean).join(', ');
  return (
    `${p.name} — ${p.title}.` +
    (p.nationality ? ` ${p.nationality} figure` : '') +
    (place ? ` associated with ${place}.` : '')
  );
}

function ensureDescription(profile: PersonalityProfile): PersonalityProfile {
  if (typeof profile.description === 'string' && profile.description.trim().length > 0) {
    return profile;
  }
  return { ...profile, description: fallbackDescription(profile) };
}

// ── Row-shape coercion (CARD 0.1 build fix, 2026-10-22) ────────────────────
// Production rows come from the OLD personalities table, whose array
// columns are plain text: achievements / timeline / works / quotes /
// description_sections / sources can arrive as strings (or other
// non-arrays). `?? []` only guards null — a string passes straight
// through and the detail page dies prerendering on `.map`. So EVERY
// array field is coerced here, at the single mapping point, and the
// text fields are coerced to strings where the page expects strings
// (summary was already handled in CARD 0). A non-array value degrades
// to an empty section — the page shows less, it never crashes.
const asArray = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const asString = (v: unknown): string =>
  typeof v === 'string' ? v : v == null ? '' : String(v);
const asOptString = (v: unknown): string | undefined =>
  typeof v === 'string' && v.length > 0 ? v : undefined;

function rowToProfile(r: PersonalityRow): PersonalityProfile {
  const sources = asArray<{ name: string; url: string }>(r.sources);
  const wikiEntry = sources.find(
    (s) => !!s && typeof s.name === 'string' && /wikipedia/i.test(s.name),
  );
  const wiki = typeof wikiEntry?.url === 'string' ? wikiEntry.url : undefined;
  return ensureDescription({
    slug: asString(r.slug),
    name: asString(r.name),
    title: asString(r.title),
    imageUrl: asOptString(r.image_url),
    imageCredit: asOptString(r.image_credit),
    imageLicence: asOptString(r.image_licence),
    birthDate: asOptString(r.birth_date),
    deathDate: asOptString(r.death_date),
    nationality: asString(r.nationality),
    city: asString(r.city_name),
    citySlug: asString(r.city_slug),
    country: asString(r.country_name),
    countrySlug: asString(r.country_slug),
    province: asString(r.province_name),
    provinceSlug: asString(r.province_slug),
    description: typeof r.summary === 'string' ? r.summary : '',
    primaryColor: asString(r.primary_color) || '#01411C',
    timeline: asArray(r.timeline),
    achievements: asArray(r.achievements),
    works: asArray(r.works),
    quotes: asArray(r.quotes),
    descriptionSections: asArray(r.description_sections),
    wikiUrl: wiki,
  });
}

async function dbQuery(params: Record<string, string>): Promise<PersonalityProfile[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  const qs = new URLSearchParams({ select: '*', order: 'slug.asc', ...params });
  try {
    const res = await fetch(`${url}/rest/v1/personalities?${qs.toString()}`, {
      headers: { apikey: anon, Authorization: `Bearer ${anon}` },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 3600 },
    } as RequestInit);
    if (!res.ok) return null; // table missing → caller falls back to seed
    const rows = (await res.json()) as PersonalityRow[];
    return Array.isArray(rows) ? rows.map(rowToProfile) : null;
  } catch {
    return null;
  }
}

const seedList = (): PersonalityProfile[] =>
  Object.values(PERSONALITIES_SEED)
    .map(ensureDescription)
    .sort((a, b) => a.slug.localeCompare(b.slug));

// ── Single profile (detail page) ────────────────────────────────────────────
// Tries the database first (any row, so an unverified-but-migrated
// profile keeps its existing public URL), then the seed.
export async function getPersonalityBySlug(slug: string): Promise<PersonalityProfile | null> {
  const rows = await dbQuery({ slug: `eq.${slug}`, limit: '1' });
  if (rows && rows.length > 0) return rows[0];
  const seed = PERSONALITIES_SEED[slug];
  return seed ? ensureDescription(seed) : null;
}

export async function getAllPersonalitySlugs(): Promise<string[]> {
  const rows = await dbQuery({ select: 'slug' });
  const dbSlugs = rows?.map((r) => r.slug) ?? [];
  return [...new Set([...dbSlugs, ...Object.keys(PERSONALITIES_SEED)])].sort();
}

// ── Pools (public: verified rows only when reading the database) ────────────

export async function getPersonalitiesByCity(citySlug: string): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ city_slug: `eq.${citySlug}`, verified: 'eq.true' });
  if (rows !== null) return rows;
  return seedList().filter((p) => p.citySlug === citySlug);
}

// Country pool = its cities' pools + national figures (rows whose
// country matches; national figures carry city_slug NULL). §16.
export async function getPersonalitiesByCountry(countrySlug: string): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ country_slug: `eq.${countrySlug}`, verified: 'eq.true' });
  if (rows !== null) return rows;
  return seedList().filter((p) => p.countrySlug === countrySlug);
}

const MONTHS = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

// "Born on this day" across every pool — matches the day + month in
// the stored birth-date strings (e.g. "9 November 1877").
export async function getBornToday(date: Date = new Date()): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ verified: 'eq.true', limit: '500' });
  const pool = rows ?? seedList();
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return pool.filter((p) => {
    if (!p.birthDate) return false;
    const m = p.birthDate.trim().match(/^(\d{1,2})\s+([A-Za-z]+)/);
    return !!m && parseInt(m[1], 10) === day && m[2].toLowerCase() === month;
  });
}

// ── Homepage 24-month rotation ──────────────────────────────────────────────
// DETERMINISTIC — no randomness at render. Rule:
//   1. The pool is sorted by slug (stable, content-independent order).
//   2. For month index m (0 = the first month of the plan), the
//      selection window starts at offset (m mod poolSize) and takes
//      `size` consecutive profiles, wrapping around the end.
//   3. Advancing one profile per month means every profile headlines
//      the panel in turn and the full cycle covers the pool before
//      repeating; a 24-month schedule is generated from any start
//      month with generateRotationSchedule().
// With a small pool (today: 2 profiles) the window is the whole pool
// and the rotation expresses itself as the lead profile alternating
// month to month — honest behaviour until the pool grows.

export const HOMEPAGE_ROTATION_SIZE = 4;

export function getHomepageRotation(
  pool: PersonalityProfile[],
  monthIndex: number,
  size: number = HOMEPAGE_ROTATION_SIZE,
): PersonalityProfile[] {
  if (pool.length === 0) return [];
  const sorted = [...pool].sort((a, b) => a.slug.localeCompare(b.slug));
  const n = sorted.length;
  const take = Math.min(size, n);
  const offset = ((monthIndex % n) + n) % n;
  const out: PersonalityProfile[] = [];
  for (let i = 0; i < take; i++) out.push(sorted[(offset + i) % n]);
  return out;
}

export interface RotationMonth {
  month: string; // 'YYYY-MM'
  monthIndex: number;
  slugs: string[];
}

export function generateRotationSchedule(
  pool: PersonalityProfile[],
  startYear: number,
  startMonth: number, // 1-12
  months = 24,
  size: number = HOMEPAGE_ROTATION_SIZE,
): RotationMonth[] {
  const out: RotationMonth[] = [];
  for ( let i = 0; i < months; i++) {
    const total = (startMonth - 1) + i;
    const y = startYear + Math.floor(total / 12);
    const m = (total % 12) + 1;
    out.push({
      month: `${y}-${String(m).padStart(2, '0')}`,
      monthIndex: i,
      slugs: getHomepageRotation(pool, i, size).map((p) => p.slug),
    });
  }
  return out;
}

// Absolute month index helper for callers that know a calendar date:
// months since the plan epoch (2026-11, the first full month after
// this system lands). The homepage slice (Agent A) can map its render
// date through this to pick the month's selection.
export function monthIndexForDate(date: Date): number {
  const epochYear = 2026;
  const epochMonth = 11; // November 2026
  return (date.getFullYear() - epochYear) * 12 + (date.getMonth() + 1 - epochMonth);
}
