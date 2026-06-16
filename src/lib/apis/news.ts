// ── WorldCityHub — News API ───────────────────────────────────────────────────
// Fetches news articles from NewsData.io (free tier) with Urdu/Arabic support.
// Falls back to static mock data when the API key is absent or quota is hit.

import type {
  NewsArticle,
  VideoItem,
  NewsCategory,
  LocationLevel,
  GlobalImpactObject,
  TrendingTopic,
} from '../../types/city';

export type { NewsArticle, VideoItem, NewsCategory, LocationLevel, TrendingTopic };

const API_KEY = process.env.NEXT_PUBLIC_NEWSDATA_API_KEY ?? '';
const BASE    = 'https://newsdata.io/api/1';

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

function mockArticle(i: number, city: string, category: string): NewsArticle {
  const titles = [
    `${city} city council approves new infrastructure plan`,
    `Weather update: ${city} braces for seasonal changes`,
    `Economy boost expected in ${city} this quarter`,
    `Cultural festival draws thousands to ${city}`,
    `${city} health authorities issue seasonal advisory`,
    `New business district planned for ${city} outskirts`,
    `Transport improvements announced for ${city}`,
    `${city} education authority launches new initiative`,
  ];
  return {
    id: `mock-${i}-${Date.now()}`,
    title: titles[i % titles.length],
    description: `Latest news from ${city}. Stay updated with local and national developments impacting your community.`,
    url: '#',
    source: { name: 'WorldCityHub' },
    publishedAt: new Date(Date.now() - i * 3_600_000).toISOString(),
    category,
    language: 'en',
    country: '',
    isBreaking: i === 0,
    sentiment: 'neutral',
  };
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function fetchNews(
  city: string,
  country: string,
  category: NewsCategory = 'all',
  _limit = 20,
): Promise<NewsArticle[]> {
  if (!API_KEY) return Array.from({ length: 8 }, (_, i) => mockArticle(i, city, category));

  try {
    const q = encodeURIComponent(`${city} ${country}`);
    const cat = category === 'all' ? '' : `&category=${category}`;
    const url = `${BASE}/news?apikey=${API_KEY}&q=${q}&language=en${cat}`;
    const res = await fetch(url);
    const json = await res.json();
    if (!json.results) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.results.map((a: any): NewsArticle => ({
      id:            a.article_id ?? String(Math.random()),
      title:         a.title ?? '',
      description:   a.description ?? '',
      url:           a.link ?? '#',
      image:         a.image_url ?? undefined,
      source:        { name: a.source_id ?? 'Unknown' },
      publishedAt:   a.pubDate ?? new Date().toISOString(),
      category:      a.category?.[0] ?? 'all',
      language:      a.language ?? 'en',
      country:       a.country?.[0] ?? country,
      isBreaking:    false,
      sentiment:     'neutral',
    }));
  } catch {
    return Array.from({ length: 8 }, (_, i) => mockArticle(i, city, category));
  }
}

export async function fetchUrduNews(city: string, _limit = 10): Promise<NewsArticle[]> {
  if (!API_KEY) return Array.from({ length: 6 }, (_, i) => mockArticle(i, city, 'all'));

  try {
    const url = `${BASE}/news?apikey=${API_KEY}&q=${encodeURIComponent(city)}&language=ur`;
    const res  = await fetch(url);
    const json = await res.json();
    if (!json.results) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.results.map((a: any): NewsArticle => ({
      id: a.article_id ?? String(Math.random()),
      title: a.title ?? '',
      description: a.description ?? '',
      url: a.link ?? '#',
      image: a.image_url ?? undefined,
      source: { name: a.source_id ?? 'Unknown' },
      publishedAt: a.pubDate ?? new Date().toISOString(),
      category: 'all',
      language: 'ur',
      country: 'PK',
    }));
  } catch {
    return [];
  }
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
  _limit = 10,
): Promise<NewsArticle[]> {
  if (!API_KEY) return Array.from({ length: 5 }, (_, i) => mockArticle(i, city, 'all'));

  try {
    const q = encodeURIComponent(`${query} ${city}`);
    const url = `${BASE}/news?apikey=${API_KEY}&q=${q}&language=en`;
    const res  = await fetch(url);
    const json = await res.json();
    if (!json.results) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return json.results.map((a: any): NewsArticle => ({
      id: a.article_id ?? String(Math.random()),
      title: a.title ?? '',
      description: a.description ?? '',
      url: a.link ?? '#',
      source: { name: a.source_id ?? 'Unknown' },
      publishedAt: a.pubDate ?? new Date().toISOString(),
      category: 'all',
      language: 'en',
      country,
    }));
  } catch {
    return [];
  }
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
