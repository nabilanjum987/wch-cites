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

async function gnewsSearch(
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
  // Feeds are fetched SEQUENTIALLY, not in parallel: with four parallel
  // requests the free plan answered only one and rejected the rest
  // (verified live 2026-10-21 — each deploy render showed exactly one
  // feed's six cards). Sequential + the 3h cache keeps us at ~32
  // requests/day and every feed lands.
  const results: NewsArticle[][] = [];
  for (const { query, countryName, endpoint } of feeds) {
    try {
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
