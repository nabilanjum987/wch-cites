'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface Article {
  title: string;
  description: string;
  source: { name: string };
  publishedAt: string;
  url: string;
  category?: string;
}

interface GNewsResponse {
  articles: Array<{
    title: string;
    description: string;
    source: { name: string };
    publishedAt: string;
    url: string;
  }>;
}

const LEVEL_TABS = [
  { id: 'global', label: 'Global', icon: '🌍', query: 'world news' },
  { id: 'national', label: 'National', icon: '🏳️' },
  { id: 'local', label: 'Local', icon: '🏙️', defaultActive: true },
  { id: 'breaking', label: 'Breaking', icon: '🔴' },
];

const CATEGORY_SUBTABS = [
  { id: 'sports', label: 'Sports', icon: '⚽', query: 'sports' },
  { id: 'finance', label: 'Finance', icon: '💰', query: 'finance' },
  { id: 'culture', label: 'Culture', icon: '🎭', query: 'culture' },
  { id: 'religion', label: 'Religion', icon: '🕌', query: 'religion' },
  { id: 'government', label: 'Government', icon: '🏛️', query: 'government' },
];

const CATEGORY_COLORS: Record<string, string> = {
  sports: '#22c55e',
  finance: '#eab308',
  culture: '#ec4899',
  religion: '#8b5cf6',
  government: '#3b82f6',
  global: '#64748b',
  national: '#0ea5e9',
  local: '#10b981',
  breaking: '#ef4444',
};

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    sports: '⚽',
    finance: '💰',
    culture: '🎭',
    religion: '🕌',
    government: '🏛️',
    default: '📰',
  };
  return emojis[category] || emojis.default;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

async function fetchGNews(
  query: string,
  apiKey: string
): Promise<Article[] | null> {
  if (!apiKey) return null;

  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=${encodedQuery}&lang=en&token=${apiKey}&max=5`
    );
    if (!response.ok) return null;
    const data: GNewsResponse = await response.json();
    return data.articles?.map((article) => ({
      ...article,
      category: query.includes('sports')
        ? 'sports'
        : query.includes('finance')
        ? 'finance'
        : query.includes('culture')
        ? 'culture'
        : query.includes('religion')
        ? 'religion'
        : query.includes('government')
        ? 'government'
        : 'general',
    })) || null;
  } catch {
    return null;
  }
}

function NewsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-50 rounded-lg p-4 animate-pulse border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-6 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const categoryColor =
    CATEGORY_COLORS[article.category || 'general'] || '#64748b';

  return (
    <motion.a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1"
          style={{ backgroundColor: categoryColor }}
        >
          {getCategoryEmoji(article.category || 'general')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 line-clamp-2 text-sm">
            {article.title}
          </p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
            <span>{article.source?.name || 'Unknown'}</span>
            <span>•</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </p>
        </div>
      </div>
    </motion.a>
  );
}

export function NewsToday({ city }: { city: City }) {
  const [levelTab, setLevelTab] = useState<string>('local');
  const [categoryTab, setCategoryTab] = useState<string>('sports');
  const [articles, setArticles] = useState<Article[]>([]);
  const [feedArticles, setFeedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLevelTab('local');
  }, []);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const key = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
      if (!key) {
        setLoading(false);
        setArticles([]);
        return;
      }

      let query = '';
      if (levelTab === 'global') {
        query = 'world news';
      } else if (levelTab === 'national') {
        query = city.country;
      } else if (levelTab === 'local') {
        query = `${city.name} ${categoryTab}`;
      } else if (levelTab === 'breaking') {
        query = `${city.country} breaking news`;
      }

      const news = await fetchGNews(query, key!);
      setArticles(news || []);
      setLoading(false);
    }

    loadNews();
  }, [city.name, city.country, levelTab, categoryTab]);

  useEffect(() => {
    async function refreshFeed() {
      const key = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
      if (!key) return;

      const promises: Promise<Article[] | null>[] = [
        fetchGNews(`${city.name}`, key),
        fetchGNews(`${city.country}`, key),
      ];
      const results = await Promise.all(promises);
      const allArticles = results
        .filter(Boolean)
        .flat() as Article[];
      const uniqueArticles = Array.from(
        new Map(allArticles.map((a) => [a.url, a])).values()
      );
      setFeedArticles(uniqueArticles.slice(0, 8));
    }

    refreshFeed();
    intervalRef.current = setInterval(refreshFeed, 15 * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [city.name, city.country]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">📰</span>
        {city.name} Today
      </h2>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
        {LEVEL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setLevelTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
              levelTab === tab.id
                ? 'text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor:
                levelTab === tab.id ? CATEGORY_COLORS[tab.id] : undefined,
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.defaultActive && levelTab === tab.id && (
              <span className="ml-1 text-xs">✓</span>
            )}
          </button>
        ))}
      </div>

      {levelTab === 'local' && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_SUBTABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryTab(tab.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                categoryTab === tab.id
                  ? 'text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor:
                  categoryTab === tab.id
                    ? CATEGORY_COLORS[tab.id]
                    : undefined,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mb-6 min-h-[350px]">
        {loading ? (
          <NewsSkeleton />
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-3">📰</p>
            <p>No news available at this time</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article, idx) => (
              <ArticleCard key={article.url + idx} article={article} index={idx} />
            ))}
          </div>
        )}
      </div>

      {feedArticles.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <span className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></span>
            Live Feed - Updates every 15 min
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {feedArticles.map((article, idx) => (
              <a
                key={article.url + idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 max-w-[200px] p-3 rounded-lg text-xs border border-gray-100 hover:border-gray-200 transition-colors"
                style={{
                  borderLeftWidth: '3px',
                  borderLeftColor:
                    CATEGORY_COLORS[article.category || 'general'],
                }}
              >
                <p className="font-medium line-clamp-2">{article.title}</p>
                <p className="text-gray-500 mt-1">
                  {article.source?.name || 'Unknown'}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
