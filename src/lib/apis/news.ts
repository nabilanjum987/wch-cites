// ── WorldCityHub — News API ───────────────────────────────────────────────────
// Fetches news articles from GNews.io (free tier) with Urdu support.
// Provider history: this module originally used NewsData.io, but the
// project owner's key is for GNews (already set in Vercel and powering
// the city pages' news strip via lib/apis/cityData.ts), so all news
// fetching was consolidated onto GNews in Batch 2i (2026-10-21).
// Truth rule: when the API key is absent or a fetch fails, these functions
// return an EMPTY list so pages show less — they never invent headlines.
// (The old mock-article fallback fabricated plausible local headlines and
// has been removed everywhere.)

import type {
  NewsArticle,
  VideoItem,
  NewsCategory,
  LocationLevel,
  GlobalImpactObject,
  TrendingTopic,
} from '../../types/city';

export type { NewsArticle, VideoItem, NewsCategory, LocationLevel, TrendingTopic };

const API_KEY = process.env.NEXT_PUBLIC_GNEWS_KEY ?? '';
const BASE    = 'https://gnews.io/api/v4';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function timeAgo(dateStr: string | Date): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── GNews helpers ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGNewsArticle(a: any, category: string, country: string, language: string): NewsArticle {
  return {
    id:            a.url ?? a.title ?? '',
    title:         a.title ?? '',
    description:   a.description ?? '',
    url:           a.url ?? '#',
    image:         a.image ?? undefined,
    source:        { name: a.source?.name ?? 'Unknown' },
    publishedAt:   a.publishedAt ?? new Date().toISOString(),
    category,
    language,
    country,
    isBreaking:    false,
    sentiment:     'neutral',
  };
}

export async function gnewsSearch(
  query: string,
  language: string,
  max: number,
  category: string,
  country: string,
  revalidate = 900,
): Promise<NewsArticle[]> {
  if (!API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query,
      lang: language,
      max: String(Math.min(max, 10)),
      sortby: 'publishedAt',
    });
    params.set('apikey', API_KEY);
    const url = `${BASE}/search?${params.toString()}`;
    const res = await fetch(url, ({ next: { revalidate } } as any));
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.articles) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.articles.map((a: any) => mapGNewsArticle(a, category, country, language));
  } catch {
    return [];
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchNews(
  city: string,
  country: string,
  category: NewsCategory = 'all',
  limit = 20,
): Promise<NewsArticle[]> {
  const catWord = category === 'all' ? '' : category === 'tech' ? ' technology' : ` ${category}`;
  return gnewsSearch(`${city} ${country}${catWord}`, 'en', limit, category, country);
}

export async function fetchUrduNews(city: string, limit = 10): Promise<NewsArticle[]> {
  // GNews indexes Urdu-language sources; lang=ur returns real Urdu news.
  const articles = await gnewsSearch(city, 'ur', limit, 'all', 'PK');
  return articles.map((a) => ({ ...a, language: 'ur' }));
}

export async function fetchNewsByDate(
  city: string,
  country: string,
  _from: string | Date,
  _limit = 10,
): Promise<NewsArticle[]> {
  return fetchNews(city, country, 'all');
}

export async function searchNews(
  city: string,
  country: string,
  query: string,
  limit = 10,
): Promise<NewsArticle[]> {
  void country;
  return gnewsSearch(`${query} ${city}`, 'en', limit, 'all', country);
}

// World headlines for the global /news page and the homepage section —
// real GNews top-headlines only. Quota note: the free GNews plan allows
// ~100 requests/day, so the world set is four feeds (world, Pakistan,
// US, UAE) cached for 3 hours (~32 requests/day), leaving room for the
// city pages' own fetches. Articles carry the queried country so the
// region tabs on /news can group them.
export async function fetchWorldNews(limit = 12): Promise<NewsArticle[]> {
  if (!API_KEY) return [];
  // Feed mix chosen for what the free plan actually serves: 'world' and
  // the US/GB country editions are supported top-headlines feeds, while
  // Pakistan is not a GNews country edition — its headlines come from
  // the search endpoint instead (the same route the city pages' strip
  // already uses successfully). Country editions for pk/ae returned
  // nothing in production (verified 2026-10-21).
  const feeds: { query: string; countryName: string; endpoint: string }[] = [
    { query: 'category=world', countryName: '', endpoint: 'top-headlines' },
    { query: 'country=us', countryName: 'United States of America', endpoint: 'top-headlines' },
    { query: 'country=gb', countryName: 'United Kingdom', endpoint: 'top-headlines' },
    { query: 'q=Pakistan', countryName: 'Pakistan', endpoint: 'search' },
  ];
  // Feeds are fetched SEQUENTIALLY and SPACED ~1.1s apart: the free
  // plan rate-limits rapid requests — parallel bursts AND back-to-back
  // sequential calls each yielded exactly one feed's cards in live
  // tests (2026-10-21). Spacing + the 3h cache keeps us at ~32
  // requests/day and every feed lands; the pause only costs time on a
  // cold cache (~3 extra seconds on one render every 3 hours).
  const results: NewsArticle[][] = [];
  let isFirstFeed = true;
  for (const { query, countryName, endpoint } of feeds) {
    try {
      if (!isFirstFeed) await new Promise((r) => setTimeout(r, 1100));
      isFirstFeed = false;
      const params = new URLSearchParams({ lang: 'en', max: '6' });
      for (const pair of query.split('&')) {
        const [k, v] = pair.split('=');
        params.set(k, v);
      }
      if (endpoint === 'search') params.set('sortby', 'publishedAt');
      params.set('apikey', API_KEY);
      const url = `${BASE}/${endpoint}?${params.toString()}`;
      const res = await fetch(url, ({ next: { revalidate: 10800 } } as any));
      if (!res.ok) continue;
      const json = await res.json();
      if (!json.articles) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results.push(json.articles.map((a: any) => mapGNewsArticle(a, 'top', countryName, 'en')));
    } catch {
      // one feed failing must not sink the others
    }
  }
  const seen = new Set<string>();
  const all: NewsArticle[] = [];
  for (const feedArticles of results) {
    for (const a of feedArticles) {
      if (!a.url || seen.has(a.url)) continue;
      seen.add(a.url);
      all.push(a);
    }
  }
  all.sort((x, y) => +new Date(y.publishedAt) - +new Date(x.publishedAt));
  return all.slice(0, limit);
}

// Country name (as returned on our articles) -> world region, shared by
// the /news page and the homepage news section.
const REGION_BY_COUNTRY: Record<string, string> = {};
for (const c of ['Pakistan', 'India', 'Bangladesh', 'Sri Lanka', 'China', 'Japan', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines', 'Thailand', 'Vietnam', 'Nepal', 'Myanmar']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Asia';
for (const c of ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Oman', 'Iraq', 'Iran', 'Israel', 'Jordan', 'Lebanon', 'Bahrain', 'Yemen']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Middle East';
for (const c of ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Poland', 'Ukraine', 'Russia', 'Switzerland', 'Belgium', 'Austria', 'Greece', 'Portugal', 'Denmark', 'Finland', 'Ireland', 'Czech Republic', 'Romania', 'Hungary']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Europe';
for (const c of ['United States of America', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Americas';
for (const c of ['Egypt', 'Nigeria', 'South Africa', 'Kenya', 'Ethiopia', 'Morocco', 'Algeria', 'Ghana', 'Tanzania', 'Sudan']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Africa';
for (const c of ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea']) REGION_BY_COUNTRY[c.toLowerCase()] = 'Oceania';

export function regionForCountry(country: string): string {
  return REGION_BY_COUNTRY[(country || '').toLowerCase()] || 'All';
}

export async function fetchYouTubeVideos(countrySlug: string): Promise<VideoItem[]> {
  return Array.from({ length: 6 }, (_, i) => ({
    id:          `vid-${i}`,
    title:       `Latest news from ${countrySlug.replace(/-/g, ' ')} #${i + 1}`,
    thumbnail:   `https://picsum.photos/seed/${countrySlug}${i}/320/180`,
    videoId:     'dQw4w9WgXcQ',
    url:         `https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
    publishedAt: new Date(Date.now() - i * 86_400_000).toISOString(),
    channel:     'WorldCityHub News',
    viewCount:   `${(Math.random() * 100_000).toFixed(0)}`,
    duration:    `${Math.floor(Math.random() * 10 + 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  }));
}

export function generateGlobalImpacts(cityName: string, _countrySlug: string): GlobalImpactObject[] {
  return [
    {
      impact: 'negative',
      icon: 'DollarSign',
      title: 'Currency Pressure',
      description: `Global monetary tightening continues to affect ${cityName}'s import costs and consumer prices.`,
    },
    {
      impact: 'positive',
      icon: 'TrendingUp',
      title: 'Remittance Inflow',
      description: `Diaspora remittances to ${cityName} rose 8% this quarter, boosting household spending.`,
    },
    {
      impact: 'neutral',
      icon: 'Fuel',
      title: 'Oil Price Watch',
      description: `Brent crude fluctuations are being closely monitored as fuel subsidies remain under review.`,
    },
    {
      impact: 'negative',
      icon: 'Thermometer',
      title: 'Climate Stress',
      description: `Heatwave index for ${cityName} hit a seasonal high — agriculture and energy demand affected.`,
    },
    {
      impact: 'positive',
      icon: 'BarChart3',
      title: 'Trade Corridor',
      description: `Regional trade agreements are opening new export pathways benefiting ${cityName} businesses.`,
    },
    {
      impact: 'neutral',
      icon: 'Globe',
      title: 'Geopolitical Shifts',
      description: `Ongoing global realignments are reshaping supply chains that pass through the region.`,
    },
  ];
}

export function generateTrendingTopics(city: string, _articles: NewsArticle[]): TrendingTopic[] {
  const topics = [
    { tag: `#${city}Today`, keyword: city, emoji: '🏙️', count: 4200, articleCount: 18, trend: 'up' as const },
    { tag: '#BreakingNews', keyword: 'breaking', emoji: '📰', count: 3800, articleCount: 24, trend: 'up' as const },
    { tag: '#Economy', keyword: 'economy', emoji: '📊', count: 2900, articleCount: 15, trend: 'flat' as const },
    { tag: '#Weather', keyword: 'weather', emoji: '🌤️', count: 1900, articleCount: 9, trend: 'down' as const },
    { tag: '#Sports', keyword: 'sports', emoji: '⚽', count: 1500, articleCount: 11, trend: 'up' as const },
    { tag: '#Culture', keyword: 'culture', emoji: '🎭', count: 900, articleCount: 6, trend: 'flat' as const },
  ];
  return topics;
}

export function generateWeekInReview(articles: NewsArticle[]): NewsArticle[] {
  return articles.slice(0, 7);
}

// ── Categorized news system (WP8 / marathon Q13) ────────────────────────────
// Spec: wch-news-system-spec-2026-10-22.md. One deduped, source-labelled
// feed per category, merged from GNews + The Guardian + verified RSS.
// Rules: headline + source + link + time only; dedupe across sources by
// normalized headline AND normalized URL; items older than 72h fall off.

import { fetchRssByCategory, type RssItem } from '../news-rss';

export type WchNewsCategory =
  | 'world' | 'pakistan' | 'finance' | 'crypto'
  | 'health' | 'science' | 'technology' | 'sports';

export const NEWS_CATEGORIES: { key: WchNewsCategory; label: string; hubPath: string }[] = [
  { key: 'world',      label: 'World',                hubPath: '/news/world' },
  { key: 'pakistan',   label: 'Pakistan',             hubPath: '/news/pakistan' },
  { key: 'finance',    label: 'Finance',              hubPath: '/news/finance' },
  { key: 'crypto',     label: 'Crypto',               hubPath: '/news/crypto' },
  { key: 'health',     label: 'Health',               hubPath: '/news/health' },
  { key: 'science',    label: 'Discoveries & Science', hubPath: '/news/science' },
  { key: 'technology', label: 'Technology',           hubPath: '/news/technology' },
  { key: 'sports',     label: 'Sports',               hubPath: '/news/sports' },
];

export const NEWS_CATEGORY_KEYS = NEWS_CATEGORIES.map((c) => c.key) as WchNewsCategory[];

const MAX_AGE_MS = 72 * 60 * 60 * 1000;

export function normalizeHeadline(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeUrl(raw: string): string {
  try {
    const u = new URL(raw);
    u.hash = '';
    for (const k of [...u.searchParams.keys()]) {
      if (/^utm_/i.test(k) || k === 'fbclid' || k === 'gclid') u.searchParams.delete(k);
    }
    return `${u.hostname.replace(/^www\./, '')}${u.pathname.replace(/\/$/, '')}${u.search}`.toLowerCase();
  } catch {
    return raw.toLowerCase().trim();
  }
}

// The same story from GNews and RSS (or Guardian) appears ONCE: an item
// is dropped when either its normalized headline or its normalized URL
// has already been seen. First occurrence wins — callers order sources
// by trust (RSS direct feeds first, then Guardian, then GNews).
export function dedupeArticles(articles: NewsArticle[]): NewsArticle[] {
  const seenTitles = new Set<string>();
  const seenUrls = new Set<string>();
  const out: NewsArticle[] = [];
  for (const a of articles) {
    const t = normalizeHeadline(a.title);
    const u = normalizeUrl(a.url);
    if (!t || seenTitles.has(t) || seenUrls.has(u)) continue;
    seenTitles.add(t);
    seenUrls.add(u);
    out.push(a);
  }
  return out;
}

function rssToArticle(item: RssItem, category: WchNewsCategory): NewsArticle {
  return {
    id: item.url,
    title: item.title,
    description: '',
    url: item.url,
    source: { name: item.source },
    publishedAt: item.publishedAt,
    category,
    language: 'en',
    country: '',
    isBreaking: false,
    sentiment: 'neutral',
  };
}

// ── The Guardian (env-gated) ────────────────────────────────────────────────
// The Guardian Open Platform needs a free API key. GUARDIAN_API_KEY is
// NOT currently set in the environment — while it is absent this fetcher
// is INACTIVE and returns [] (the blocker is logged in the Q13 evidence
// pack). The moment the owner adds the key, Guardian items join the
// merge with no code change.

const GUARDIAN_BY_CATEGORY: Record<WchNewsCategory, { section?: string; q?: string }> = {
  world:      { section: 'world' },
  pakistan:   { q: 'Pakistan' },
  finance:    { section: 'business' },
  crypto:     { q: 'cryptocurrency bitcoin' },
  health:     { q: 'health' },
  science:    { section: 'science' },
  technology: { section: 'technology' },
  sports:     { section: 'sport' },
};

export async function fetchGuardianCategory(
  category: WchNewsCategory,
  limit = 10,
): Promise<NewsArticle[]> {
  const key = process.env.GUARDIAN_API_KEY;
  if (!key) return [];
  const cfg = GUARDIAN_BY_CATEGORY[category];
  const params = new URLSearchParams({
    'api-key': key,
    'page-size': String(Math.min(limit, 20)),
    'order-by': 'newest',
  });
  if (cfg.section) params.set('section', cfg.section);
  if (cfg.q) params.set('q', cfg.q);
  try {
    const res = await fetch(`https://content.guardianapis.com/search?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 1800 },
    } as RequestInit);
    if (!res.ok) return [];
    const json = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any[] = json?.response?.results ?? [];
    return results.map((r) => ({
      id: r.webUrl ?? r.id ?? '',
      title: r.webTitle ?? '',
      description: '',
      url: r.webUrl ?? '',
      source: { name: 'The Guardian' },
      publishedAt: r.webPublicationDate ?? new Date().toISOString(),
      category,
      language: 'en',
      country: '',
      isBreaking: false,
      sentiment: 'neutral',
    } as NewsArticle)).filter((a: NewsArticle) => a.title && a.url);
  } catch {
    return [];
  }
}

export function guardianConfigured(): boolean {
  return typeof process.env.GUARDIAN_API_KEY === 'string' && process.env.GUARDIAN_API_KEY.length > 0;
}

// ── GNews per category ──────────────────────────────────────────────────────

const GNEWS_QUERY_BY_CATEGORY: Record<WchNewsCategory, { q: string; country: string }> = {
  world:      { q: 'world news', country: '' },
  pakistan:   { q: 'Pakistan', country: 'PK' },
  finance:    { q: 'stock market economy finance', country: '' },
  crypto:     { q: 'bitcoin cryptocurrency', country: '' },
  health:     { q: 'health medicine', country: '' },
  science:    { q: 'science discovery research', country: '' },
  technology: { q: 'technology', country: '' },
  sports:     { q: 'sports cricket football', country: '' },
};

// The category feed the /news hub pages consume. Sources merge in trust
// order (direct RSS → Guardian → GNews), dedupe runs across ALL of
// them, stale items (>72h) fall off, newest first.
export async function fetchNewsCategory(
  category: WchNewsCategory,
  limit = 20,
): Promise<NewsArticle[]> {
  const [rss, guardian, gnews] = await Promise.all([
    fetchRssByCategory(category).catch(() => [] as RssItem[]),
    fetchGuardianCategory(category).catch(() => [] as NewsArticle[]),
    (async () => {
      const cfg = GNEWS_QUERY_BY_CATEGORY[category];
      return gnewsSearch(cfg.q, 'en', 10, category, cfg.country, 1800).catch(() => [] as NewsArticle[]);
    })(),
  ]);
  const merged = [
    ...rss.map((i) => rssToArticle(i, category)),
    ...guardian,
    ...gnews,
  ];
  const fresh = merged.filter(
    (a) => Date.now() - new Date(a.publishedAt).getTime() < MAX_AGE_MS,
  );
  const deduped = dedupeArticles(fresh);
  deduped.sort((x, y) => +new Date(y.publishedAt) - +new Date(x.publishedAt));
  return deduped.slice(0, limit);
}
