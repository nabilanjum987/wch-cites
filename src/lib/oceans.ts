// ─────────────────────────────────────────────────────────────────────────────
// Oceans data layer (WP5 / marathon Q10) — SERVER ONLY.
// Mirrors the golden wonder pattern (src/lib/wonders.ts): static facts
// live in the database after migration 0002 (`oceans`, `ocean_media`,
// `ocean_sources`); until the owner applies it, this module serves the
// SAME dataset baked from live verification on 2026-10-22 (Wikidata
// Q58705 — matched on its description "marginal sea of the northern
// Indian Ocean", NOT the first search hit, which is a ship of the same
// name — and the Wikipedia article).
//
// Live layer: Open-Meteo MARINE API (wave height / direction / period)
// at the sea's own Wikidata representative point + Open-Meteo forecast
// weather for the coast at Karachi. No figure is stored or invented;
// when a feed is down its block does not render.
// ─────────────────────────────────────────────────────────────────────────────

import { getSupabase } from '@/lib/supabase';
import { WMO_LABELS, weatherLabel, haversineKm } from '@/lib/wonders';

export { weatherLabel, WMO_LABELS, haversineKm };

export interface OceanMedia {
  fileTitle: string;
  fileUrl: string;
  pageUrl: string;
  width: number;
  height: number;
  licence: string;
  licenceUrl: string;
  author: string;
  attribution: string;
  role: 'hero' | 'gallery' | 'detail';
  alt: string;
  sortOrder: number;
}

export interface OceanSource {
  claim: string;
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
}

export interface Ocean {
  slug: string;
  name: string;
  wikidataQid: string;
  partOfName: string;
  lat: number; // representative point (Wikidata P625)
  lng: number;
  marineTimezone: string; // display timezone for marine data (nearest coast)
  seoTitle: string;
  seoDescription: string;
  intro: string[];
  facts: { label: string; value: string; source: string }[];
  geography: string[];
  monsoon: string[];
  coastalCity: {
    name: string;
    countryName: string;
    path: string; // published WorldCityHub city page
    lat: number;
    lng: number;
    timezone: string;
  };
  faqs: { q: string; a: string }[];
  media: OceanMedia[];
  sources: OceanSource[];
}

const CHECKED = '2026-10-22';

const ARABIAN_SEA: Ocean = {
  slug: 'arabian-sea',
  name: 'Arabian Sea',
  wikidataQid: 'Q58705',
  partOfName: 'Indian Ocean',
  lat: 16,
  lng: 64,
  marineTimezone: 'Asia/Karachi',
  seoTitle: 'Arabian Sea: Live Waves, Weather & Facts',
  seoDescription:
    'The Arabian Sea live: wave height & swell today, Karachi coastal weather, monsoon pattern, size and depth facts — every figure sourced.',
  intro: [
    'The Arabian Sea is the northwestern arm of the Indian Ocean, bounded on the west by the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel, on the northwest by the Gulf of Oman and Iran, on the north by Pakistan, on the east by India, and on the southeast by the Laccadive Sea and the Maldives, with Somalia to the southwest. Its total area is 3,862,000 km².',
    'Few seas have shaped history like this one. For millennia its reversing monsoon winds carried trade — and with it concepts, peoples, philosophies, technologies and religions — across the Old World: sailors rode one monsoon out and waited for the winds and currents to reverse before sailing home. The same monsoon still sets the sea\u2019s moods today, which is why this page pairs the facts with the live wave and weather picture.',
    'At its centre and south the seabed falls away into the Arabian Basin, an expansive, relatively flat stretch of ocean floor reaching depths beyond 4,500 metres. In the west the Gulf of Aden connects the sea to the Red Sea through the strait of Bab-el-Mandeb; in the northwest the Gulf of Oman connects it to the Persian Gulf.',
  ],
  facts: [
    { label: 'Part of', value: 'Indian Ocean', source: 'Wikidata' },
    { label: 'Total area', value: '3,862,000 km² (1,491,000 sq mi)', source: 'Wikidata / Wikipedia' },
    { label: 'Maximum depth', value: '5,395 m', source: 'Wikipedia (see sources note)' },
    { label: 'Representative point', value: '16° N, 64° E', source: 'Wikidata' },
    { label: 'Seabed', value: 'Arabian Basin — beyond 4,500 m in places', source: 'Wikipedia' },
    { label: 'Connects west', value: 'Gulf of Aden → Bab-el-Mandeb → Red Sea', source: 'Wikipedia' },
    { label: 'Connects northwest', value: 'Gulf of Oman → Persian Gulf', source: 'Wikipedia' },
    { label: 'Northern shore', value: 'Pakistan — Karachi is its great port city', source: 'Wikipedia' },
  ],
  geography: [
    'West: the Arabian Peninsula, the Gulf of Aden and the Guardafui Channel. Northwest: the Gulf of Oman and Iran. North: Pakistan. East: India. Southeast: the Laccadive Sea and the Maldives. Southwest: Somalia. Most islands and seamounts in the sea lie along its coastal fringes, close to the major landmasses (Wikipedia).',
  ],
  monsoon: [
    'The Arabian Sea is the world\u2019s great monsoon sea. In mid-summer, strong winds carry warm air and moisture northeastwards from the African interior and the Indian Ocean, bringing heavy rains to the northeastern shoreline of the Arabian basin while the Horn of Africa and the Arabian Peninsula stay dry (Wikipedia). In the era of square-rigged vessels this pattern governed all trade here: ships sailed out on one monsoon and were effectively marooned at their destination until the reversal of winds and currents let them sail home on calmer waters.',
    'The practical rhythm that follows from that pattern: the southwest monsoon months (roughly June to September) bring the strongest winds and the roughest open-sea conditions of the year; the northeast monsoon months (roughly November to March) are generally the calmest. The live wave panel on this page shows what the sea is actually doing today, inside that seasonal frame.',
  ],
  coastalCity: {
    name: 'Karachi',
    countryName: 'Pakistan',
    path: '/pakistan/sindh/karachi',
    lat: 24.8607,
    lng: 67.0011,
    timezone: 'Asia/Karachi',
  },
  faqs: [
    {
      q: 'How big is the Arabian Sea?',
      a: 'Its total area is 3,862,000 km² (1,491,000 sq mi) — the northwestern region of the Indian Ocean, between the Arabian Peninsula, Iran, Pakistan, India, the Maldives and Somalia (Wikidata / Wikipedia).',
    },
    {
      q: 'How deep is the Arabian Sea?',
      a: 'Wikipedia gives a maximum depth of 5,395 metres; Wikidata records 5,800 metres for the same quantity. Both figures are shown in this page\u2019s sources rather than hidden — depth soundings for an entire sea are estimates that vary by survey and by where the deepest point is taken.',
    },
    {
      q: 'What are the waves like in the Arabian Sea today?',
      a: 'The live panel at the top of this page shows today\u2019s significant wave height, swell direction and wave period from the Open-Meteo Marine API at the sea\u2019s representative point (16° N, 64° E), plus the weather on the coast at Karachi.',
    },
    {
      q: 'When is the Arabian Sea roughest?',
      a: 'During the southwest monsoon, roughly June to September, when strong winds drive the year\u2019s roughest open-sea conditions. The northeast monsoon months, roughly November to March, are generally the calmest — the pattern that governed sailing trade here for millennia (Wikipedia).',
    },
    {
      q: 'Which WorldCityHub city is on the Arabian Sea?',
      a: 'Karachi, Pakistan — the great port city on the sea\u2019s northern shore. Its full WorldCityHub guide (weather, prayer times, rates, news and more) is linked from this page.',
    },
  ],
  media: [
    {
      fileTitle: 'Arabian sea waves.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Arabian_sea_waves.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_sea_waves.jpg',
      width: 6000,
      height: 4000,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Galib Tufan',
      attribution: '"Arabian sea waves" by Galib Tufan — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'hero',
      alt: 'Waves rolling in the Arabian Sea under a bright sky',
      sortOrder: 1,
    },
    {
      fileTitle: 'Winter Phytoplankon Arabian Sea.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Winter_Phytoplankon_Arabian_Sea.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Winter_Phytoplankon_Arabian_Sea.jpg',
      width: 2491,
      height: 1470,
      licence: 'Public domain',
      licenceUrl: 'https://commons.wikimedia.org/wiki/Commons:Public_domain',
      author: 'NASA',
      attribution: '"Winter Phytoplankton, Arabian Sea" by NASA — public domain, via Wikimedia Commons',
      role: 'gallery',
      alt: 'Satellite view of a winter phytoplankton bloom swirling in the Arabian Sea (NASA)',
      sortOrder: 2,
    },
    {
      fileTitle: 'Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India.jpg',
      fileUrl:
        'https://upload.wikimedia.org/wikipedia/commons/b/b5/Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort%2C_Goa%2C_India.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_and_Morjim_Beach_as_seen_from_Vagator_Fort,_Goa,_India.jpg',
      width: 3072,
      height: 2048,
      licence: 'CC BY 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by/4.0',
      author: 'Vyacheslav Argenberg',
      attribution:
        '"Arabian Sea and Morjim Beach as seen from Vagator Fort, Goa, India" by Vyacheslav Argenberg — CC BY 4.0, via Wikimedia Commons',
      role: 'gallery',
      alt: 'The Arabian Sea and Morjim Beach seen from Vagator Fort, Goa, on the sea\u2019s eastern shore',
      sortOrder: 3,
    },
    {
      fileTitle: 'Arabian Sea - n22e70.jpg',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Arabian_Sea_-_n22e70.jpg',
      pageUrl: 'https://commons.wikimedia.org/wiki/File:Arabian_Sea_-_n22e70.jpg',
      width: 683,
      height: 446,
      licence: 'CC BY-SA 4.0',
      licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      author: 'Arjun Sinh Jadeja',
      attribution: '"Arabian Sea" satellite tile by Arjun Sinh Jadeja — CC BY-SA 4.0, via Wikimedia Commons',
      role: 'detail',
      alt: 'Satellite tile of the Arabian Sea region (the image attached to the sea\u2019s Wikidata record)',
      sortOrder: 4,
    },
  ],
  sources: [
    { claim: 'Identity (matched on description, not name alone), representative coordinates 16° N 64° E, area, part of Indian Ocean', sourceName: 'Wikidata — Q58705 (Arabian Sea)', sourceUrl: 'https://www.wikidata.org/wiki/Q58705', checkedAt: CHECKED },
    { claim: 'Bounds, connections (Bab-el-Mandeb, Gulf of Oman), Arabian Basin, monsoon pattern, trade history', sourceName: 'Wikipedia — "Arabian Sea"', sourceUrl: 'https://en.wikipedia.org/wiki/Arabian_Sea', checkedAt: CHECKED },
    { claim: 'Maximum depth — SOURCES DIFFER: Wikipedia 5,395 m; Wikidata (P4511) 5,800 m. Both recorded; the fact card shows Wikipedia\u2019s figure with this note', sourceName: 'Wikipedia — "Arabian Sea" / Wikidata Q58705', sourceUrl: 'https://en.wikipedia.org/wiki/Arabian_Sea', checkedAt: CHECKED },
    { claim: 'Live wave height, direction and period at 16° N, 64° E; Karachi coastal weather', sourceName: 'Open-Meteo Marine & Forecast APIs', sourceUrl: 'https://open-meteo.com/', checkedAt: CHECKED },
    { claim: 'All photographs: licence, author, dimensions', sourceName: 'Wikimedia Commons — imageinfo records (per-file links in the credits)', sourceUrl: 'https://commons.wikimedia.org/', checkedAt: CHECKED },
  ],
};

export const PUBLISHED_OCEANS: Ocean[] = [ARABIAN_SEA];

// The other oceans — content only on the index (no links) until each
// one's own golden build is verified and published.
export const UPCOMING_OCEANS: { name: string; note: string }[] = [
  { name: 'Pacific Ocean', note: 'The largest ocean on Earth' },
  { name: 'Atlantic Ocean', note: 'Between the Americas, Europe and Africa' },
  { name: 'Indian Ocean', note: 'The Arabian Sea is its northwestern arm' },
  { name: 'Southern Ocean', note: 'The waters around Antarctica' },
  { name: 'Arctic Ocean', note: 'The smallest and shallowest ocean' },
];

export function oceanHero(ocean: Ocean): OceanMedia {
  return ocean.media.find((m) => m.role === 'hero') ?? ocean.media[0];
}

async function getOceanFromDb(slug: string): Promise<Ocean | null> {
  try {
    const supabase = getSupabase();
    const query = supabase.from('oceans').select('*').eq('slug', slug).eq('status', 'published').single();
    const { data: row, error } = await Promise.race([
      query,
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: new Error('timeout') }), 2500),
      ),
    ]);
    if (error || !row || !row.curated) return null;
    const [{ data: media }, { data: sources }] = await Promise.all([
      supabase.from('ocean_media').select('*').eq('ocean_id', row.id).order('sort_order'),
      supabase.from('ocean_sources').select('*').eq('ocean_id', row.id),
    ]);
    if (!media || media.length === 0) return null;
    const c = row.curated as Record<string, unknown>;
    return {
      slug: row.slug,
      name: row.name,
      wikidataQid: row.wikidata_qid,
      partOfName: row.part_of_name,
      lat: Number(row.lat),
      lng: Number(row.lng),
      marineTimezone: row.marine_timezone,
      seoTitle: row.seo_title,
      seoDescription: row.seo_description,
      intro: (c.intro as string[]) ?? [],
      facts: (c.facts as Ocean['facts']) ?? [],
      geography: (c.geography as string[]) ?? [],
      monsoon: (c.monsoon as string[]) ?? [],
      coastalCity: c.coastal_city as Ocean['coastalCity'],
      faqs: (c.faqs as Ocean['faqs']) ?? [],
      media: media.map((m) => ({
        fileTitle: m.file_title,
        fileUrl: m.file_url,
        pageUrl: m.page_url,
        width: m.width,
        height: m.height,
        licence: m.licence,
        licenceUrl: m.licence_url,
        author: m.author,
        attribution: m.attribution_text,
        role: m.role,
        alt: m.alt_text,
        sortOrder: m.sort_order,
      })),
      sources: (sources ?? []).map((s) => ({
        claim: s.claim,
        sourceName: s.source_name,
        sourceUrl: s.source_url,
        checkedAt: String(s.checked_at).slice(0, 10),
      })),
    };
  } catch {
    return null;
  }
}

export async function getOcean(slug: string): Promise<Ocean | null> {
  const fromDb = await getOceanFromDb(slug);
  if (fromDb) return fromDb;
  return PUBLISHED_OCEANS.find((o) => o.slug === slug) ?? null;
}

export async function getPublishedOceans(): Promise<Ocean[]> {
  const out: Ocean[] = [];
  for (const o of PUBLISHED_OCEANS) {
    const full = await getOcean(o.slug);
    if (full) out.push(full);
  }
  return out;
}

// ── Live layer ──────────────────────────────────────────────────────────────
export interface OceanLive {
  sampledAt: string;
  waveHeight: number | null;
  waveDirection: number | null; // degrees, direction waves come FROM
  wavePeriod: number | null; // seconds
  hourlyWaves: { time: string; height: number }[];
  coast: {
    tempNow: number;
    feelsLike: number;
    humidity: number;
    windKmh: number;
    weatherCode: number;
    sunrise: string;
    sunset: string;
    tempMax: number;
    tempMin: number;
  } | null;
}

export function compass(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

// Plain-language sea state from the live wave height (WMO sea state
// scale bands — a description of the number, not a new figure).
export function seaStateLabel(waveHeight: number): string {
  if (waveHeight < 0.5) return 'Calm to slight';
  if (waveHeight < 1.25) return 'Slight';
  if (waveHeight < 2.5) return 'Moderate';
  if (waveHeight < 4) return 'Rough';
  if (waveHeight < 6) return 'Very rough';
  return 'High';
}

// Seasonal frame from the calendar month (pattern sourced from the
// Wikipedia article — climatology, clearly distinct from live data).
export function monsoonSeason(timezone: string): { name: string; text: string } {
  let month = 1;
  try {
    month = parseInt(
      new Intl.DateTimeFormat('en-GB', { timeZone: timezone, month: 'numeric' }).format(new Date()),
      10,
    );
  } catch { /* default below still returns a valid frame */ }
  if (month >= 6 && month <= 9)
    return {
      name: 'Southwest monsoon season',
      text: 'The summer monsoon frame: strong southwesterly winds and the roughest open-sea conditions of the year are the pattern now (Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  if (month >= 11 || month <= 3)
    return {
      name: 'Northeast monsoon season',
      text: 'The winter monsoon frame: the generally calmest seas of the year are the pattern now (Wikipedia). Compare the live waves above — today\u2019s actual sea, inside the seasonal frame.',
    };
  if (month === 10)
    return {
      name: 'Post-monsoon transition',
      text: 'The winds are reversing after the southwest monsoon; seas typically settle through this transition month (pattern per Wikipedia).',
    };
  return {
    name: 'Pre-monsoon transition',
    text: 'The hot-season build-up before the southwest monsoon arrives; winds and seas strengthen toward June (pattern per Wikipedia).',
  };
}

export async function getOceanLive(ocean: Ocean): Promise<OceanLive | null> {
  try {
    const marineUrl =
      `https://marine-api.open-meteo.com/v1/marine?latitude=${ocean.lat}&longitude=${ocean.lng}` +
      `&current=wave_height,wave_direction,wave_period&hourly=wave_height&forecast_days=2&timezone=${encodeURIComponent(ocean.marineTimezone)}`;
    const coastUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${ocean.coastalCity.lat}&longitude=${ocean.coastalCity.lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=sunrise,sunset,temperature_2m_max,temperature_2m_min&timezone=${encodeURIComponent(ocean.coastalCity.timezone)}&forecast_days=1`;
    const [mRes, cRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 1800 } }),
      fetch(coastUrl, { next: { revalidate: 1800 } }),
    ]);
    if (!mRes.ok) return null;
    const m = await mRes.json();
    const cur = m.current;
    if (!cur) return null;
    const todayStr = (cur.time as string).slice(0, 10);
    const hourlyWaves: { time: string; height: number }[] = (m.hourly?.time ?? [])
      .map((t: string, i: number) => ({ time: t, height: m.hourly.wave_height[i] as number }))
      .filter((h: { time: string }) => h.time.slice(0, 10) === todayStr && h.time >= (cur.time as string).slice(0, 13));
    let coast: OceanLive['coast'] = null;
    if (cRes.ok) {
      const c = await cRes.json();
      if (c.current && c.daily?.sunrise?.length) {
        coast = {
          tempNow: c.current.temperature_2m,
          feelsLike: c.current.apparent_temperature,
          humidity: c.current.relative_humidity_2m,
          windKmh: c.current.wind_speed_10m,
          weatherCode: c.current.weather_code,
          sunrise: (c.daily.sunrise[0] as string).slice(11, 16),
          sunset: (c.daily.sunset[0] as string).slice(11, 16),
          tempMax: c.daily.temperature_2m_max[0],
          tempMin: c.daily.temperature_2m_min[0],
        };
      }
    }
    return {
      sampledAt: cur.time,
      waveHeight: typeof cur.wave_height === 'number' ? cur.wave_height : null,
      waveDirection: typeof cur.wave_direction === 'number' ? cur.wave_direction : null,
      wavePeriod: typeof cur.wave_period === 'number' ? cur.wave_period : null,
      hourlyWaves,
      coast,
    };
  } catch {
    return null;
  }
}
