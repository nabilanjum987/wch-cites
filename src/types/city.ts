export interface City {
  id: string;
  name: string;
  city_slug: string;
  country: string;
  country_code: string;
  country_slug: string;
  province: string;
  province_slug: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  major_religion: string;
  religion_percent: number;
  primary_color: string;
  secondary_color: string;
  famous_for: string;
  famous_products: string;
  emergency_police: string;
  emergency_ambulance: string;
  emergency_fire: string;
  region: string;
  is_active: boolean;
}

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category: string;
  isBreaking: boolean;
}

export type NewsCategory =
  | 'government'
  | 'finance'
  | 'sports'
  | 'culture'
  | 'religion'
  | 'health'
  | 'education'
  | 'environment'
  | 'transport'
  | 'entertainment'
  | 'world';

export const NEWS_CATEGORIES: { key: NewsCategory; label: string; icon: string }[] = [
  { key: 'government', label: 'Government', icon: 'Landmark' },
  { key: 'finance', label: 'Finance', icon: 'Banknote' },
  { key: 'sports', label: 'Sports', icon: 'Trophy' },
  { key: 'culture', label: 'Culture', icon: 'Drama' },
  { key: 'religion', label: 'Religion', icon: 'Sparkles' },
  { key: 'health', label: 'Health', icon: 'Heart' },
  { key: 'education', label: 'Education', icon: 'GraduationCap' },
  { key: 'environment', label: 'Environment', icon: 'Leaf' },
  { key: 'transport', label: 'Transport', icon: 'Car' },
  { key: 'entertainment', label: 'Entertainment', icon: 'Film' },
  { key: 'world', label: 'World', icon: 'Globe' },
];

export interface LocationLevel {
  type: 'world' | 'country' | 'province' | 'city';
  label: string;
  slug?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  breaking: '#EF4444',
  government: '#6366F1',
  finance: '#22C55E',
  sports: '#3B82F6',
  culture: '#F59E0B',
  religion: '#8B5CF6',
  health: '#EC4899',
  education: '#06B6D4',
  environment: '#10B981',
  transport: '#F97316',
  entertainment: '#A855F7',
  world: '#64748B',
};

export const COUNTRY_SOURCES: Record<string, { local: string[]; international: string[]; urdu?: string[] }> = {
  pakistan: {
    local: ['Dawn', 'Geo News', 'The News', 'Tribune', 'ARY News', 'Business Recorder', 'Jang', 'Nawa-i-Waqt'],
    international: ['Reuters', 'AP', 'BBC', 'Al Jazeera'],
    urdu: ['Jang', 'Express Urdu', 'Dunya', 'Nawa-i-Waqt'],
  },
  india: {
    local: ['Times of India', 'NDTV', 'Hindustan Times', 'The Hindu', 'India Today', 'Economic Times', 'Dainik Jagran', 'Aaj Tak'],
    international: ['Reuters', 'AP', 'BBC', 'Al Jazeera'],
  },
  uae: {
    local: ['Gulf News', 'Khaleej Times', 'The National', 'Emarat Al Youm', 'Al Bayan', 'Arabian Business'],
    international: ['Reuters', 'AP', 'BBC', 'Al Jazeera'],
  },
  'saudi-arabia': {
    local: ['Arab News', 'Saudi Gazette', 'Asharq Al-Awsat', 'Al Riyadh', 'Okaz'],
    international: ['Reuters', 'AP', 'BBC', 'Al Jazeera'],
  },
};

export const DEFAULT_SOURCES = {
  local: ['Local Daily', 'City Press', 'Regional Times', 'Metro News'],
  international: ['Reuters', 'AP', 'BBC', 'Al Jazeera', 'CNN'],
  urdu: ['Jang', 'Express Urdu', 'Dunya', 'Nawa-i-Waqt'],
};

export interface GlobalImpact {
  icon: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export type LanguageTab = 'english' | 'urdu';

export interface VideoItem {
  title: string;
  thumbnail: string;
  url: string;
  channel: string;
  publishedAt: string;
}

export interface TrendingTopic {
  keyword: string;
  articleCount: number;
  emoji: string;
}

export const YOUTUBE_CHANNELS: Record<string, { name: string; rssUrl: string }[]> = {
  pakistan: [
    { name: 'Geo News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCb4BQtOeLXwqKe9XSH5mYfw' },
    { name: 'ARY News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaC5mJbihmJX3MD5_7PGazg' },
    { name: 'Dawn News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcAFbu5dFPVPhAmx4KvIyw' },
    { name: 'City42', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCeD3g2S4bQYToKUT5iKjq7Q' },
  ],
};

export const DEFAULT_YOUTUBE_CHANNELS: { name: string; rssUrl: string }[] = [
  { name: 'Geo News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCb4BQtOeLXwqKe9XSH5mYfw' },
  { name: 'ARY News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCaC5mJbihmJX3MD5_7PGazg' },
  { name: 'Dawn News', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCcAFbu5dFPVPhAmx4KvIyw' },
  { name: 'City42', rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCeD3g3S4bQYToKUT5iKjq7Q' },
];
