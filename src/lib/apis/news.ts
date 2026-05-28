import type { NewsArticle, NewsCategory, GlobalImpact, VideoItem, TrendingTopic } from '../../types/city';
import { YOUTUBE_CHANNELS, DEFAULT_YOUTUBE_CHANNELS } from '../../types/city';

const GNEWS_API_BASE = 'https://gnews.io/api/v4';

const CATEGORY_QUERY_MAP: Record<NewsCategory, string> = {
  government: 'government politics minister parliament',
  finance: 'economy finance business market stock',
  sports: 'sports cricket football hockey',
  culture: 'culture heritage art festival tradition',
  religion: 'religion mosque church temple prayer faith',
  health: 'health hospital medical disease healthcare',
  education: 'education school university student exam',
  environment: 'environment climate pollution weather green',
  transport: 'transport road metro airport railway traffic',
  entertainment: 'entertainment movie music celebrity film drama',
  world: 'world international global affairs',
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const published = new Date(dateStr);
  const diffMs = now.getTime() - published.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function isRecentBreaking(dateStr: string): boolean {
  const now = new Date();
  const published = new Date(dateStr);
  const diffMins = (now.getTime() - published.getTime()) / 60000;
  return diffMins < 120;
}

function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export async function fetchNews(
  city: string,
  country: string,
  category: NewsCategory | null = null,
  maxArticles: number = 10
): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  if (!apiKey) {
    return getFallbackNews(city, category, maxArticles);
  }

  try {
    const query = category
      ? `${CATEGORY_QUERY_MAP[category]} ${city}`
      : `${city} ${country}`;

    const params = new URLSearchParams({
      q: query,
      lang: 'en',
      max: String(maxArticles),
      apikey: apiKey,
    });

    const response = await fetch(`${GNEWS_API_BASE}/search?${params}`);

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return getFallbackNews(city, category, maxArticles);
    }

    return data.articles.map((article: any, index: number) => ({
      title: article.title || 'Untitled',
      description: article.description || '',
      content: article.content || '',
      url: article.url || '#',
      image: article.image || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown Source',
        url: article.source?.url || '#',
      },
      category: category || 'world',
      isBreaking: index === 0 && isRecentBreaking(article.publishedAt),
    }));
  } catch (error) {
    console.error('News API error:', error);
    return getFallbackNews(city, category, maxArticles);
  }
}

export async function fetchUrduNews(
  city: string,
  maxArticles: number = 10
): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  if (!apiKey) {
    return getFallbackUrduNews(city, maxArticles);
  }

  try {
    const params = new URLSearchParams({
      q: city,
      lang: 'ur',
      max: String(maxArticles),
      apikey: apiKey,
    });

    const response = await fetch(`${GNEWS_API_BASE}/search?${params}`);

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return getFallbackUrduNews(city, maxArticles);
    }

    return data.articles.map((article: any, _index: number) => ({
      title: article.title || 'بلا عنوان',
      description: article.description || '',
      content: article.content || '',
      url: article.url || '#',
      image: article.image || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'نامعلوم ذریعہ',
        url: article.source?.url || '#',
      },
      category: 'world',
      isBreaking: _index === 0,
    }));
  } catch (error) {
    console.error('Urdu news API error:', error);
    return getFallbackUrduNews(city, maxArticles);
  }
}

export async function fetchNewsByDate(
  city: string,
  country: string,
  date: Date,
  maxArticles: number = 10
): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  if (!apiKey) {
    return getFallbackNews(city, null, maxArticles);
  }

  try {
    const dateStr = formatDateISO(date);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = formatDateISO(nextDay);

    const params = new URLSearchParams({
      q: `${city} ${country}`,
      lang: 'en',
      from: dateStr,
      to: nextDayStr,
      max: String(maxArticles),
      apikey: apiKey,
    });

    const response = await fetch(`${GNEWS_API_BASE}/search?${params}`);

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    return data.articles.map((article: any) => ({
      title: article.title || 'Untitled',
      description: article.description || '',
      content: article.content || '',
      url: article.url || '#',
      image: article.image || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown Source',
        url: article.source?.url || '#',
      },
      category: 'world',
      isBreaking: false,
    }));
  } catch (error) {
    console.error('News by date API error:', error);
    return [];
  }
}

export async function searchNews(
  city: string,
  country: string,
  query: string,
  maxArticles: number = 10
): Promise<NewsArticle[]> {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;

  if (!apiKey) {
    return getFallbackSearchResults(city, query, maxArticles);
  }

  try {
    const params = new URLSearchParams({
      q: `${query} ${city} ${country}`,
      lang: 'en',
      max: String(maxArticles),
      apikey: apiKey,
    });

    const response = await fetch(`${GNEWS_API_BASE}/search?${params}`);

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      return [];
    }

    return data.articles.map((article: any, index: number) => ({
      title: article.title || 'Untitled',
      description: article.description || '',
      content: article.content || '',
      url: article.url || '#',
      image: article.image || '',
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source?.name || 'Unknown Source',
        url: article.source?.url || '#',
      },
      category: 'world',
      isBreaking: index === 0,
    }));
  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}

export async function fetchYouTubeVideos(
  countrySlug: string
): Promise<VideoItem[]> {
  const channels = YOUTUBE_CHANNELS[countrySlug] || DEFAULT_YOUTUBE_CHANNELS;

  try {
    const allVideos: VideoItem[] = [];

    for (const channel of channels) {
      try {
        const response = await fetch(channel.rssUrl);
        if (!response.ok) continue;

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');

        const entries = xml.querySelectorAll('entry');
        let count = 0;

        entries.forEach((entry) => {
          if (count >= 1) return;
          count++;

          const title = entry.querySelector('title')?.textContent || '';
          const link = entry.querySelector('link')?.getAttribute('href') || '#';
          const published = entry.querySelector('published')?.textContent || new Date().toISOString();

          const mediaGroup = entry.querySelector('media\\:group, group');
          const thumbnail = mediaGroup?.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') || '';

          allVideos.push({
            title,
            thumbnail,
            url: link,
            channel: channel.name,
            publishedAt: published,
          });
        });
      } catch {
        // Skip failed channel, continue with others
      }
    }

    if (allVideos.length === 0) {
      return getFallbackYouTubeVideos(channels);
    }

    return allVideos.slice(0, 4);
  } catch (error) {
    console.error('YouTube RSS error:', error);
    return getFallbackYouTubeVideos(channels);
  }
}

function getFallbackYouTubeVideos(channels: { name: string }[]): VideoItem[] {
  const imageIds = [2675671, 2774556, 2519660, 2653452];
  return channels.slice(0, 4).map((ch, i) => ({
    title: `Latest news update from ${ch.name}`,
    thumbnail: `https://images.pexels.com/photos/${imageIds[i]}/pexels-photo-${imageIds[i]}.jpeg?auto=compress&cs=tinysrgb&w=400`,
    url: 'https://www.youtube.com',
    channel: ch.name,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
  }));
}

export function generateTrendingTopics(city: string, articles: NewsArticle[]): TrendingTopic[] {
  if (articles.length === 0) {
    return getFallbackTrendingTopics(city);
  }

  const wordFreq: Record<string, number> = {};
  const stopWords = new Set([
    'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'and', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'can', 'shall', 'this', 'that', 'these', 'those',
    'it', 'its', 'from', 'by', 'as', 'or', 'not', 'no', 'but', 'if',
    'so', 'up', 'out', 'about', 'into', 'over', 'after', 'new', 'says',
    'said', 'also', 'just', 'more', 'than', 'each', 'how', 'their',
    'which', 'we', 'our', 'your', 'my', 'he', 'she', 'they', 'them',
    'who', 'what', 'when', 'where', 'why', 'all', 'any', 'both',
    ...city.toLowerCase().split(' '),
  ]);

  const topicEmojis: Record<string, string> = {
    cricket: '\u{1F3CF}', football: '\u26BD', hockey: '\u{1F3D2}', sports: '\u{1F3C6}',
    election: '\u{1F5F3}', government: '\u{1F3DB}', parliament: '\u{1F3DB}', minister: '\u{1F3DB}',
    economy: '\u{1F4B0}', market: '\u{1F4C8}', stock: '\u{1F4C9}', finance: '\u{1F4B5}',
    health: '\u{1F49A}', hospital: '\u{1F3E5}', medical: '\u{1F48A}', disease: '\u{1F9A0}',
    education: '\u{1F4DA}', school: '\u{1F3EB}', university: '\u{1F393}', exam: '\u{1F4DD}',
    weather: '\u{1F326}', rain: '\u{1F327}', climate: '\u{1F30D}', environment: '\u{1F33F}',
    police: '\u{1F46E}', crime: '\u{1F6A8}', traffic: '\u{1F697}', metro: '\u{1F687}',
    culture: '\u{1F3AD}', music: '\u{1F3B5}', film: '\u{1F3AC}', festival: '\u{1F389}',
    mosque: '\u{1F54C}', religion: '\u{1F54C}', prayer: '\u{1F64B}', ramadan: '\u{1F319}',
    gold: '\u{1F4B0}', oil: '\u{1F4E1}', petrol: '\u26FD', gas: '\u26FD',
    food: '\u{1F356}', restaurant: '\u{1F37D}', street: '\u{1F3D7}',
    technology: '\u{1F4BB}', digital: '\u{1F4F1}', internet: '\u{1F310}',
    building: '\u{1F3D7}', road: '\u{1F6E3}', airport: '\u2708',
  };

  articles.forEach((article) => {
    const words = (article.title + ' ' + article.description)
      .toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    words.forEach((word) => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
  });

  const sorted = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (sorted.length === 0) {
    return getFallbackTrendingTopics(city);
  }

  return sorted.map(([keyword, count]) => ({
    keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
    articleCount: count,
    emoji: Object.entries(topicEmojis).find(([k]) => keyword.includes(k))?.[1] || '\u{1F4F0}',
  }));
}

function getFallbackTrendingTopics(city: string): TrendingTopic[] {
  return [
    { keyword: 'Cricket', articleCount: 12, emoji: '\u{1F3CF}' },
    { keyword: 'Weather', articleCount: 9, emoji: '\u{1F326}' },
    { keyword: 'Education', articleCount: 7, emoji: '\u{1F4DA}' },
    { keyword: 'Economy', articleCount: 6, emoji: '\u{1F4B0}' },
    { keyword: 'Traffic', articleCount: 5, emoji: '\u{1F697}' },
  ].map((t) => ({
    ...t,
    keyword: city ? `${t.keyword}` : t.keyword,
  }));
}

export function generateWeekInReview(city: string, articles: NewsArticle[]): NewsArticle[] {
  if (articles.length === 0) {
    return getFallbackWeekInReview(city);
  }

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeek = articles.filter((a) => {
    const d = new Date(a.publishedAt);
    return d >= weekAgo && d <= now;
  });

  if (thisWeek.length === 0) {
    return articles.slice(0, 5);
  }

  return thisWeek.slice(0, 5);
}

function getFallbackWeekInReview(city: string): NewsArticle[] {
  const imageIds = [3183189, 258154, 3861969, 259588, 2603464];
  const stories = [
    { headline: `${city} announces major infrastructure overhaul`, source: 'Dawn' },
    { headline: `Cricket fever grips ${city} as tournament begins`, source: 'Geo News' },
    { headline: `${city} education board reveals new policy framework`, source: 'The News' },
    { headline: `Economic growth in ${city} exceeds quarterly projections`, source: 'Business Recorder' },
    { headline: `${city} cultural heritage site gains international recognition`, source: 'Tribune' },
  ];

  return stories.map((item, index) => ({
    title: item.headline,
    description: `Top story from this week in ${city}.`,
    content: '',
    url: '#',
    image: `https://images.pexels.com/photos/${imageIds[index]}/pexels-photo-${imageIds[index]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    publishedAt: new Date(Date.now() - (index + 1) * 24 * 3600000).toISOString(),
    source: { name: item.source, url: '#' },
    category: 'world',
    isBreaking: false,
  }));
}

function getFallbackSearchResults(city: string, query: string, maxArticles: number): NewsArticle[] {
  const imageIds = [3183189, 258154, 3861969, 259588, 2603464, 374870];
  return Array.from({ length: Math.min(maxArticles, 5) }).map((_, i) => ({
    title: `${query} developments in ${city} - Update ${i + 1}`,
    description: `Latest updates about ${query} in ${city}.`,
    content: '',
    url: '#',
    image: `https://images.pexels.com/photos/${imageIds[i % imageIds.length]}/pexels-photo-${imageIds[i % imageIds.length]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
    source: { name: ['Dawn', 'Geo News', 'The News', 'Tribune', 'ARY News'][i % 5], url: '#' },
    category: 'world',
    isBreaking: i === 0,
  }));
}

function getFallbackNews(
  city: string,
  category: NewsCategory | null,
  maxArticles: number
): NewsArticle[] {
  const cat = category || 'world';
  const fallbackData: Record<string, { headline: string; source: string }[]> = {
    government: [
      { headline: `${city} City Council announces new urban development plan`, source: 'Dawn' },
      { headline: `Provincial government approves funding for ${city} infrastructure`, source: 'Geo News' },
      { headline: `New public policy reforms discussed in ${city} assembly session`, source: 'The News' },
      { headline: `${city} municipal budget allocation for fiscal year revealed`, source: 'Tribune' },
      { headline: `Civic body launches digital governance initiative in ${city}`, source: 'ARY News' },
    ],
    finance: [
      { headline: `${city} stock exchange shows positive trading momentum`, source: 'Business Recorder' },
      { headline: `New business district development attracts investors to ${city}`, source: 'Dawn' },
      { headline: `${city} Chamber of Commerce reports growth in local enterprises`, source: 'The News' },
      { headline: `Banking sector expansion creates jobs in ${city}`, source: 'Tribune' },
      { headline: `${city} real estate market sees steady price appreciation`, source: 'Geo News' },
    ],
    sports: [
      { headline: `${city} cricket team wins regional championship title`, source: 'Geo News' },
      { headline: `International athletes visit ${city} for upcoming tournament`, source: 'The News' },
      { headline: `${city} sports board announces new training facilities`, source: 'Dawn' },
      { headline: `Local hockey stars from ${city} selected for national team`, source: 'ARY News' },
      { headline: `${city} marathon draws record participation this year`, source: 'Tribune' },
    ],
    culture: [
      { headline: `${city} cultural festival showcases traditional arts and crafts`, source: 'Dawn' },
      { headline: `Heritage preservation project launched in ${city} old city`, source: 'The News' },
      { headline: `${city} art exhibition draws international visitors`, source: 'Tribune' },
      { headline: `Traditional music concert series begins in ${city}`, source: 'Geo News' },
      { headline: `${city} literary festival announces speaker lineup`, source: 'Jang' },
    ],
    religion: [
      { headline: `${city} religious scholars convene for annual interfaith dialogue`, source: 'Nawa-i-Waqt' },
      { headline: `Ramadan arrangements finalized across ${city} mosques`, source: 'Geo News' },
      { headline: `${city} religious board announces community outreach programs`, source: 'Dawn' },
      { headline: `Historic mosque restoration completed in ${city}`, source: 'The News' },
      { headline: `${city} interfaith harmony conference promotes unity`, source: 'Jang' },
    ],
    health: [
      { headline: `${city} hospitals receive new medical equipment and facilities`, source: 'Dawn' },
      { headline: `Dengue prevention campaign launched across ${city}`, source: 'Geo News' },
      { headline: `${city} health department issues seasonal disease advisory`, source: 'The News' },
      { headline: `Free medical camps set up in underserved areas of ${city}`, source: 'Tribune' },
      { headline: `${city} medical university announces research breakthrough`, source: 'ARY News' },
    ],
    education: [
      { headline: `${city} schools announce new curriculum for upcoming academic year`, source: 'Dawn' },
      { headline: `University rankings place ${city} institutions among top regional schools`, source: 'The News' },
      { headline: `${city} launches digital literacy program for students`, source: 'Tribune' },
      { headline: `Scholarship fund established for underprivileged students in ${city}`, source: 'Geo News' },
      { headline: `${city} board exam results show improvement in pass rates`, source: 'Jang' },
    ],
    environment: [
      { headline: `${city} launches tree plantation drive to combat pollution`, source: 'Dawn' },
      { headline: `Air quality monitoring system upgraded across ${city}`, source: 'The News' },
      { headline: `${city} river cleanup initiative shows promising results`, source: 'Tribune' },
      { headline: `Waste management reforms introduced in ${city} municipal areas`, source: 'Geo News' },
      { headline: `${city} parks department announces new green spaces plan`, source: 'ARY News' },
    ],
    transport: [
      { headline: `${city} metro expansion project enters new construction phase`, source: 'Dawn' },
      { headline: `New bus routes announced for ${city} suburban areas`, source: 'Geo News' },
      { headline: `${city} airport upgrade plan approved by aviation authority`, source: 'The News' },
      { headline: `Road infrastructure improvements begin across ${city}`, source: 'Tribune' },
      { headline: `${city} traffic management system gets AI-powered upgrade`, source: 'ARY News' },
    ],
    entertainment: [
      { headline: `${city} film festival announces this year's lineup and guests`, source: 'Dawn' },
      { headline: `Popular music concert series draws crowds to ${city}`, source: 'Geo News' },
      { headline: `${city} theater revival brings classic dramas to local stage`, source: 'The News' },
      { headline: `Celebrity chef opens new restaurant in ${city}`, source: 'Tribune' },
      { headline: `${city} comedy night showcases local talent`, source: 'ARY News' },
    ],
    world: [
      { headline: `${city} business delegation returns from international trade expo`, source: 'Reuters' },
      { headline: `International observers visit ${city} for urban development study`, source: 'BBC' },
      { headline: `${city} ranks in global livability index update`, source: 'AP' },
      { headline: `Diplomatic mission praises ${city} cultural preservation efforts`, source: 'Al Jazeera' },
      { headline: `${city} participates in sister city exchange program`, source: 'Dawn' },
    ],
  };

  const articles = (fallbackData[cat] || fallbackData.world).slice(0, maxArticles);
  const imageIds = [3183189, 258154, 3861969, 259588, 2603464, 374870, 242236, 21007, 325185, 573238];

  return articles.map((item, index) => ({
    title: item.headline,
    description: `Stay updated with the latest ${cat} news from ${city}.`,
    content: '',
    url: '#',
    image: `https://images.pexels.com/photos/${imageIds[index % imageIds.length]}/pexels-photo-${imageIds[index % imageIds.length]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
    source: { name: item.source, url: '#' },
    category: cat,
    isBreaking: index === 0,
  }));
}

function getFallbackUrduNews(city: string, maxArticles: number): NewsArticle[] {
  const urduStories: { headline: string; source: string }[] = [
    { headline: `${city} میں نئی ترقیاتی منصوبوں کا آغاز`, source: 'جنگ' },
    { headline: `${city} کرکٹ ٹیم نے علاقائی چیمپئن شپ جیتی`, source: 'ایکسپریس اردو' },
    { headline: `${city} میں موسم کی تبدیلی کے اثرات کا جائزہ`, source: 'دنیا نیوز' },
    { headline: `${city} تعلیمی اداروں میں نئے نصاب کا اطلاق`, source: 'نوائے وقت' },
    { headline: `${city} میں صحت کی سہولیات میں بہتری`, source: 'جنگ' },
    { headline: `${city} کے کاروباری علاقے میں نیا سرمایہ کاری`, source: 'ایکسپریس اردو' },
    { headline: `${city} میں ٹریفک کے مسائل کے حل کے لیے نئے منصوبے`, source: 'دنیا نیوز' },
    { headline: `${city} ثقافتی تہوار کا کامیاب آغاز`, source: 'نوائے وقت' },
    { headline: `${city} میں ماحولیات کے تحفظ کے لیے اقدامات`, source: 'جنگ' },
    { headline: `${city} میں روزگار کے نئے مواقع پیدا ہوئے`, source: 'ایکسپریس اردو' },
  ];

  const imageIds = [3183189, 258154, 3861969, 259588, 2603464, 374870, 242236, 21007, 325185, 573238];

  return urduStories.slice(0, maxArticles).map((item, index) => ({
    title: item.headline,
    description: `${city} سے تازہ ترین خبریں حاصل کریں۔`,
    content: '',
    url: '#',
    image: `https://images.pexels.com/photos/${imageIds[index % imageIds.length]}/pexels-photo-${imageIds[index % imageIds.length]}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
    source: { name: item.source, url: '#' },
    category: 'world',
    isBreaking: index === 0,
  }));
}

export function generateGlobalImpacts(city: string, countrySlug: string): GlobalImpact[] {
  const impacts: GlobalImpact[] = [];

  if (countrySlug === 'pakistan') {
    impacts.push(
      {
        icon: 'Fuel',
        title: 'Oil prices rising globally',
        description: 'Petrol price review due next week in Pakistan. Expect possible increase at the pump across major cities.',
        impact: 'negative',
      },
      {
        icon: 'DollarSign',
        title: 'USD remains strong against PKR',
        description: `Exports from ${city} benefit from favorable rates, but imports become more expensive for local businesses.`,
        impact: 'neutral',
      },
      {
        icon: 'Thermometer',
        title: 'Seasonal weather shifts',
        description: `Temperature changes may affect ${city} agriculture output and daily commute patterns in coming days.`,
        impact: 'neutral',
      },
      {
        icon: 'Globe',
        title: 'Global trade corridor updates',
        description: `CPEC-related shipments through ${city} corridor may see schedule adjustments based on international demand.`,
        impact: 'positive',
      },
      {
        icon: 'TrendingUp',
        title: 'Gold prices surge internationally',
        description: `Gold rates impact local jewelry markets in ${city}. Wedding season demand may push prices further.`,
        impact: 'negative',
      }
    );
  } else if (countrySlug === 'india') {
    impacts.push(
      {
        icon: 'Fuel',
        title: 'Crude oil price movements',
        description: `Fuel price revision expected in ${city}. Global crude trends suggest marginal increase at retail pumps.`,
        impact: 'negative',
      },
      {
        icon: 'DollarSign',
        title: 'Rupee vs Dollar dynamics',
        description: `IT exporters in ${city} benefit from rupee depreciation, but import costs rise for manufacturing sector.`,
        impact: 'neutral',
      },
      {
        icon: 'TrendingUp',
        title: 'Global equity market rally',
        description: `Sensex and Nifty movements likely to impact ${city} investor sentiment in upcoming trading sessions.`,
        impact: 'positive',
      }
    );
  } else {
    impacts.push(
      {
        icon: 'Fuel',
        title: 'Global oil market update',
        description: `Energy prices may affect transportation costs and daily expenses in ${city}.`,
        impact: 'negative',
      },
      {
        icon: 'DollarSign',
        title: 'Currency exchange movements',
        description: `Local import and export businesses in ${city} should monitor current exchange rate trends.`,
        impact: 'neutral',
      },
      {
        icon: 'Globe',
        title: 'International trade shifts',
        description: `Global trade policy changes could impact ${city}'s commercial and industrial sectors.`,
        impact: 'neutral',
      }
    );
  }

  const hour = new Date().getHours();
  if (hour >= 8 && hour <= 11) {
    impacts.push({
      icon: 'BarChart3',
      title: 'Markets opening direction',
      description: `Asian market cues will influence ${city} local business sentiment and trading patterns today.`,
      impact: 'positive',
    });
  }

  return impacts;
}

export { timeAgo };
