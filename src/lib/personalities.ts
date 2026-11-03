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
import { EXTENSION_PERSONALITIES } from './data/personalities-extension';

export type { PersonalityProfile };
export { PERSONALITIES_SEED };

// ── Code-side photo overrides + hero framing (personalities family fix) ────
// The country page carries the precedent (PERSONALITY_PHOTOS /
// PERSONALITY_POS in CountryClient.tsx): where a profile's database row
// has image_url NULL — or, for Iqbal, a hotlinked upload.wikimedia.org
// URL — the verified local photo is supplied here, keyed by slug, so
// every surface (detail hero, hub cards, related cards) shows the same
// photo with the same credit. Database rows are NOT edited from code;
// the SQL-side equivalents live in migration 0022. An override applies
// ONLY when the record has no photo or a remote hotlink: a local photo
// already on the record always wins.
interface PersonalityImageOverride {
  imageUrl: string;
  imageCredit: string;
  imageLicence: string;
}

export const PERSONALITY_IMAGE_OVERRIDES: Record<string, PersonalityImageOverride> = {
  // B6: replaces the hotlinked upload.wikimedia.org portrait. File:
  // extended-canvas portrait (head y 12–77%, x 6–91% of frame).
  'allama-iqbal': {
    imageUrl: '/images/home28/pers-iqbal-hero.webp',
    imageCredit: 'Iqbal Academy Pakistan',
    imageLicence: 'public domain',
  },
  // File:Muhammad Ali Jinnah.jpg — Ministry of Information &
  // Broadcasting, Government of Pakistan, public domain.
  'quaid-e-azam-jinnah': {
    imageUrl: '/images/personalities/muhammad-ali-jinnah.webp',
    imageCredit: 'Ministry of Information & Broadcasting, Government of Pakistan',
    imageLicence: 'public domain',
  },
  'muhammad-ali-jinnah': {
    imageUrl: '/images/personalities/muhammad-ali-jinnah.webp',
    imageCredit: 'Ministry of Information & Broadcasting, Government of Pakistan',
    imageLicence: 'public domain',
  },
  // File:Abdus Salam 1987.jpg — Bart Molendijk / Anefo, CC BY-SA 3.0 nl.
  'dr-abdus-salam': {
    imageUrl: '/images/personalities/abdus-salam.webp',
    imageCredit: 'Bart Molendijk / Anefo, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 3.0 nl',
  },
  'abdus-salam': {
    imageUrl: '/images/personalities/abdus-salam.webp',
    imageCredit: 'Bart Molendijk / Anefo, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 3.0 nl',
  },
  // File:Malala Yousafzai 2023 portrait 2x3.jpg — flowcomm, CC BY 2.0.
  'malala-yousafzai': {
    imageUrl: '/images/personalities/malala-yousafzai.webp',
    imageCredit: 'flowcomm, via Wikimedia Commons',
    imageLicence: 'CC BY 2.0',
  },
  // File:Abdul Sattar Edhi.jpg — Hussain, CC BY-SA 3.0.
  'abdul-sattar-edhi': {
    imageUrl: '/images/personalities/abdul-sattar-edhi.webp',
    imageCredit: 'Hussain, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 3.0',
  },
  // P9 photos (docs/personality-photos-p9.md): these two profiles are
  // served from database rows whose photos wait on migration 0016;
  // the seed records carry no photo, so without an override their
  // heroes and cards render photo-less even though verified local
  // files exist. Credits per migration 0016.
  'nusrat-fateh-ali-khan': {
    imageUrl: '/images/personalities/nusrat-fateh-ali-khan.webp',
    imageCredit: 'Thomas Rome, via Wikimedia Commons',
    imageLicence: 'CC BY 2.0',
  },
  'wasim-akram': {
    imageUrl: '/images/personalities/wasim-akram.webp',
    imageCredit: 'Arijit Basak, via Wikimedia Commons',
    imageLicence: 'CC BY 2.0',
  },
  // File:Oliver Mark - Benazir Bhutto, Dubai 2006 (cropped).jpg —
  // Oliver Mark, CC BY-SA 4.0 (media registry: VERIFIED). Framing not
  // yet measured; the hero position map gives object-top like every
  // other unmeasured portrait.
  'benazir-bhutto': {
    imageUrl: '/images/personalities/benazir-bhutto.webp',
    imageCredit: 'Oliver Mark, via Wikimedia Commons',
    imageLicence: 'CC BY-SA 4.0',
  },
};

// Hero/card object-position per slug, MEASURED from the actual files
// (owner's complete-head rule: hair to chin inside the 4/5 frame).
// Unlisted photographed profiles default to 'object-top'.
export const PERSONALITY_HERO_POSITIONS: Record<string, string> = {
  'allama-iqbal': 'object-[center_40%]', // hero canvas (gradient backdrop extension): head y 17–79%, x 12–89%
  'faiz-ahmed-faiz': 'object-right', // 800×664, head x 39.5–96%
  'imran-khan': 'object-top', // head y 0.5–78.9%
  'wasim-akram': 'object-top', // head y 1.5–79.7%
  'nusrat-fateh-ali-khan': 'object-[80%_center]', // 402×402, head x 18.5–93.5%
  'quaid-e-azam-jinnah': 'object-top', // head y 10.8–38.2%, x 61.5–89%
  'muhammad-ali-jinnah': 'object-top',
  'dr-abdus-salam': 'object-center', // head x 19.8–74.3%, y 11.5–63%
  'abdus-salam': 'object-center',
  'malala-yousafzai': 'object-[center_20%]', // head y 8.8–62%
  'abdul-sattar-edhi': 'object-top', // head y 5.5–47%
};

export function personalityImagePosition(slug: string): string {
  return PERSONALITY_HERO_POSITIONS[slug] ?? 'object-top';
}

function applyPersonalityOverrides(profile: PersonalityProfile): PersonalityProfile {
  const o = PERSONALITY_IMAGE_OVERRIDES[profile.slug];
  if (!o) return profile;
  const current = profile.imageUrl ?? '';
  if (current && !/^https?:\/\//i.test(current)) return profile; // local photo wins
  return {
    ...profile,
    imageUrl: o.imageUrl,
    imageCredit: o.imageCredit,
    imageLicence: o.imageLicence,
  };
}

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
  return applyPersonalityOverrides(ensureDescription({
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
  }));
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
    .map((p) => applyPersonalityOverrides(ensureDescription(p)))
    .sort((a, b) => a.slug.localeCompare(b.slug));

// ── Consolidated-slug aliases (duplicate-person consolidation) ─────────────
// The survivors `dr-abdus-salam` / `quaid-e-azam-jinnah` exist only as
// database rows; the seed carries the same people under the retired
// slugs. In the seed-fallback environment the survivor URLs resolve to
// the seed twin (with the survivor's own display name/title/summary,
// mirroring migration 0019) so the pages behave exactly as they do
// from the database. In production the database row returns first and
// this path is never reached.
const SEED_SLUG_ALIASES: Record<string, string> = {
  'dr-abdus-salam': 'abdus-salam',
  'quaid-e-azam-jinnah': 'muhammad-ali-jinnah',
};
const SURVIVOR_DISPLAY: Record<string, { name: string; title: string; description: string }> = {
  'dr-abdus-salam': {
    name: 'Dr Abdus Salam',
    title: 'Nobel Laureate Physicist',
    description: 'Dr Abdus Salam, born in Jhang and educated at Government College Lahore, shared the 1979 Nobel Prize in Physics for electroweak unification.',
  },
  'quaid-e-azam-jinnah': {
    name: 'Quaid-e-Azam Muhammad Ali Jinnah',
    title: 'Founder',
    description: "Quaid-e-Azam Muhammad Ali Jinnah, born in Karachi, was the barrister who led the Pakistan Movement and became Pakistan's first Governor-General in 1947.",
  },
};

function seedBySlug(slug: string): PersonalityProfile | null {
  const direct = PERSONALITIES_SEED[slug];
  if (direct) return applyPersonalityOverrides(ensureDescription(direct));
  const alias = SEED_SLUG_ALIASES[slug];
  if (!alias || !PERSONALITIES_SEED[alias]) return null;
  const twin = PERSONALITIES_SEED[alias];
  const display = SURVIVOR_DISPLAY[slug];
  return applyPersonalityOverrides(
    ensureDescription({
      ...twin,
      slug,
      ...(display
        ? { name: display.name, title: display.title, description: display.description }
        : {}),
    }),
  );
}

// ── Single profile (detail page) ────────────────────────────────────────────
// Tries the database first (any row, so an unverified-but-migrated
// profile keeps its existing public URL), then the seed.
export async function getPersonalityBySlug(slug: string): Promise<PersonalityProfile | null> {
  const rows = await dbQuery({ slug: `eq.${slug}`, limit: '1' });
  if (rows && rows.length > 0) return rows[0];
  return seedBySlug(slug);
}

export async function getAllPersonalitySlugs(): Promise<string[]> {
  const rows = await dbQuery({ select: 'slug' });
  const dbSlugs = rows?.map((r) => r.slug) ?? [];
  return [...new Set([...dbSlugs, ...Object.keys(PERSONALITIES_SEED)])].sort();
}

// ── Pools (public: verified rows only when reading the database) ────────────

export async function getPersonalitiesByCity(citySlug: string): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ city_slug: `eq.${citySlug}`, verified: 'eq.true' });
  // S2 fix: an EMPTY database result (query succeeded, zero verified
  // rows) must fall through to the seed pool — returning it verbatim
  // suppressed whole sections (e.g. Related Personalities) whenever
  // the database answered with no rows for a city.
  if (rows !== null && rows.length > 0) return rows;
  return seedList().filter((p) => p.citySlug === citySlug);
}

// Country pool = its cities' pools + national figures (rows whose
// country matches; national figures carry city_slug NULL). §16.
export async function getPersonalitiesByCountry(countrySlug: string): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ country_slug: `eq.${countrySlug}`, verified: 'eq.true' });
  if (rows !== null && rows.length > 0) return rows;
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
  const pool = rows && rows.length > 0 ? rows : seedList();
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  return pool.filter((p) => {
    if (!p.birthDate) return false;
    const m = p.birthDate.trim().match(/^(\d{1,2})\s+([A-Za-z]+)/);
    return !!m && parseInt(m[1], 10) === day && m[2].toLowerCase() === month;
  });
}

// ── Hub listing (/personalities index, B1) ──────────────────────────────────
// The canonical profile set: the same 35 slugs the sitemap lists.
// Resolution order per slug: database row → seed (direct or via the
// consolidated-slug alias) → extension dataset (the build-only mirror
// of migration 0013, converted to the profile shape). A slug that no
// source can resolve is omitted rather than rendered as a shell.
export const CANONICAL_PROFILE_SLUGS = [
  'abdul-qadeer-khan', 'abdul-sattar-edhi',
  'allama-iqbal', 'ameer-haider-khan-hoti', 'amrita-pritam',
  'ashfaq-ahmed', 'azam-khan-hoti', 'bahawal-khan-i', 'bano-qudsia',
  'benazir-bhutto', 'dr-abdus-salam', 'faiz-ahmed-faiz', 'fatima-jinnah',
  'feroz-khan-noon', 'habib-jalib', 'haider-zaman-khan', 'imran-khan',
  'james-abbott', 'khurshid-ahmed-shah', 'malala-yousafzai',
  'mehdi-hasan', 'mir-muhammad-masum', 'mohammad-hafeez',
  'mushaf-ali-mir', 'nasir-hussain-shah',
  'noor-jehan', 'nusrat-fateh-ali-khan', 'pervez-musharraf',
  'quaid-e-azam-jinnah', 'sadequain', 'sadiq-muhammad-khan-iv',
  'sadiq-muhammad-khan-v', 'sardar-mehtab-abbasi',
  'wasim-akram', 'younis-khan',
] as const;

function extensionToProfile(e: (typeof EXTENSION_PERSONALITIES)[number]): PersonalityProfile {
  const wiki = e.sources.find((s) => /wikipedia/i.test(s.name))?.url;
  return applyPersonalityOverrides(
    ensureDescription({
      slug: e.slug,
      name: e.name,
      title: e.title,
      imageUrl: e.imageUrl ?? undefined,
      imageCredit: e.imageCredit ?? undefined,
      imageLicence: e.imageLicence ?? undefined,
      birthDate: e.birthDate || undefined,
      deathDate: e.deathDate ?? undefined,
      nationality: e.nationality,
      city: e.cityName,
      citySlug: e.citySlug,
      country: e.countryName,
      countrySlug: e.countrySlug,
      province: e.provinceName,
      provinceSlug: e.provinceSlug,
      description: e.summary,
      primaryColor: e.primaryColor || '#01411C',
      timeline: e.timeline,
      achievements: e.achievements,
      works: e.works as PersonalityProfile['works'],
      quotes: e.quotes as PersonalityProfile['quotes'],
      descriptionSections: e.descriptionSections as PersonalityProfile['descriptionSections'],
      wikiUrl: wiki,
    }),
  );
}

export async function getAllPersonalities(): Promise<PersonalityProfile[]> {
  const rows = await dbQuery({ limit: '500' });
  const bySlug = new Map((rows ?? []).map((r) => [r.slug, r]));
  const out: PersonalityProfile[] = [];
  for (const slug of CANONICAL_PROFILE_SLUGS) {
    const fromDb = bySlug.get(slug);
    if (fromDb) {
      out.push(fromDb);
      continue;
    }
    const fromSeed = seedBySlug(slug);
    if (fromSeed) {
      out.push(fromSeed);
      continue;
    }
    const ext = EXTENSION_PERSONALITIES.find((e) => e.slug === slug);
    if (ext) out.push(extensionToProfile(ext));
  }
  return out;
}

// ── Related personalities (final28: template Section 10) ────────────────────
// Same-city profiles first, then same-country profiles to fill up to
// `limit`. Order inside each group is slug order (the pools are already
// slug-sorted), so the selection is deterministic — no randomness at
// render. Self is always excluded.
//
// DUPLICATE-PERSON CONSOLIDATION (owner decision, 28 Oct 2026, final):
// the retired slugs `abdus-salam` and `muhammad-ali-jinnah` 301 to
// `dr-abdus-salam` and `quaid-e-azam-jinnah` (see src/proxy.ts). The
// pools below can still carry the retired slugs — the seed fallback
// lists them, and a verified database row would too — so retired slugs
// are excluded here, the single choke point for this section's links.
// Exclusion (not substitution) is deliberate: it behaves identically
// in seed-fallback and database environments, and the survivor still
// appears via the pool whenever its own row is present. No page may
// link to a redirected URL.
const RETIRED_PERSONALITY_SLUGS = new Set([
  'abdus-salam',
  'muhammad-ali-jinnah',
]);

export async function getRelatedPersonalities(
  profile: PersonalityProfile,
  limit = 4,
): Promise<PersonalityProfile[]> {
  const seen = new Set<string>([profile.slug]);
  const out: PersonalityProfile[] = [];
  const push = (p: PersonalityProfile): void => {
    if (!seen.has(p.slug) && !RETIRED_PERSONALITY_SLUGS.has(p.slug)) {
      seen.add(p.slug);
      out.push(p);
    }
  };
  if (profile.citySlug) {
    for (const p of await getPersonalitiesByCity(profile.citySlug)) push(p);
  }
  if (out.length < limit && profile.countrySlug) {
    for (const p of await getPersonalitiesByCountry(profile.countrySlug)) push(p);
  }
  return out.slice(0, limit);
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
