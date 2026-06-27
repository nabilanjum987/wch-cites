'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ExternalLink, Newspaper, Filter } from 'lucide-react';
import { searchNews } from '../../lib/apis/news';
import { timeAgo } from '../../lib/apis/news';
import type { NewsArticle } from '../../types/city';
import { getSourceName } from '../../types/city';

interface NewsSearchProps {
  cityName: string;
  country: string;
}

export default function NewsSearch({ cityName, country }: NewsSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NewsArticle[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const articles = await searchNews(cityName, country, query, 10);

      const filtered = articles.filter((a) => {
        const pubDate = new Date(a.publishedAt);
        const now = new Date();
        if (dateRange === 'today') {
          return pubDate.toDateString() === now.toDateString();
        }
        if (dateRange === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return pubDate >= weekAgo;
        }
        if (dateRange === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return pubDate >= monthAgo;
        }
        return true;
      });

      setResults(filtered);
      setSearching(false);
      setShowResults(true);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, dateRange, cityName, country]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div>
      {/* Search bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${cityName} news...`}
              className="w-full pl-9 pr-9 py-2.5 bg-transparent border border-white/10 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-transparent/5 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Date range filter */}
          <div className="flex items-center gap-1 bg-transparent border border-white/10 rounded-xl p-1">
            <Filter className="w-3.5 h-3.5 text-gray-400 mx-1" />
            {(['all', 'today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize ${
                  dateRange === range
                    ? 'bg-black/50 text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {range === 'all' ? 'All' : range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-3"
          >
            {/* Result count */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">
                {searching ? 'Searching...' : `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
              </span>
              {dateRange !== 'all' && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full capitalize">
                  {dateRange}
                </span>
              )}
            </div>

            {results.length === 0 && !searching ? (
              <div className="bg-transparent rounded-xl border border-white/8 p-6 text-center">
                <Search className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No results found for "{query}"</p>
                <p className="text-xs text-gray-400 mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="space-y-2">
                {results.map((article, idx) => (
                  <motion.a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-start gap-3 p-3 bg-transparent rounded-xl border border-white/8 hover: transition-shadow no-underline group"
                  >
                    <div className="w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      {article.image ? (
                        <img
                          src={article.image}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                          <Newspaper className="w-4 h-4 text-emerald-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-semibold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                        <span className="font-medium text-emerald-400">{getSourceName(article.source)}</span>
                        <span>&#183;</span>
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-1" />
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
