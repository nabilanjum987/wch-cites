'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, MapPin, Landmark, Banknote, Trophy, Drama,
  Sparkles, Heart, GraduationCap, Leaf, Car, Film,
  ChevronRight, AlertTriangle, Clock, ExternalLink,
  Newspaper, ArrowLeft, Radio, Fuel, DollarSign,
  Thermometer, TrendingUp, TrendingDown, Minus,
  BarChart3, Zap, RefreshCw, Calendar, ChevronLeft,
  Languages, Search, X, Play
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { fetchNews, fetchUrduNews, fetchNewsByDate, timeAgo, generateGlobalImpacts, generateTrendingTopics, generateWeekInReview } from '../../lib/apis/news';
import type { City, NewsArticle, NewsCategory, LocationLevel, GlobalImpactObject, LanguageTab, LocationLevelObject, SourceSet } from '../../types/city';
import { NEWS_CATEGORIES, CATEGORY_COLORS, COUNTRY_SOURCES, DEFAULT_SOURCES, getSourceName } from '../../types/city';
import { NewsCardSkeleton, BreakingBarSkeleton, TabSkeleton } from '../shared/LoadingSkeleton';
import NewsSearch from './NewsSearch';
import VideoNews from './VideoNews';
import SocialPulse from './SocialPulse';
import WeekInReview from './WeekInReview';
import {
  generateSearchParagraph, generateSearchAfter,
  generateTopStoriesParagraph, generateTopStoriesAfter,
  generateMoreStoriesParagraph, generateMoreStoriesAfter,
  generateLiveFeedParagraph, generateLiveFeedAfter,
  generateArchiveParagraph, generateArchiveAfter,
  generateVideoParagraph, generateVideoAfter,
  generateSocialParagraph, generateSocialAfter,
  generateWeekParagraph, generateWeekAfter,
  generateImpactParagraph, generateImpactAfter,
  generateSourcesParagraph, generateSourcesAfter,
} from '../../lib/paragraphs/news';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  government: Landmark,
  finance: Banknote,
  sports: Trophy,
  culture: Drama,
  religion: Sparkles,
  health: Heart,
  education: GraduationCap,
  environment: Leaf,
  transport: Car,
  entertainment: Film,
  world: Globe,
};

const IMPACT_ICONS: Record<string, React.ElementType> = {
  Fuel, DollarSign, Thermometer, Globe, TrendingUp, TrendingDown, Minus, BarChart3, Zap,
};

const IMPACT_COLORS: Record<GlobalImpactObject['impact'], { bg: string; text: string; border: string; icon: React.ElementType }> = {
  positive: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: TrendingUp },
  negative: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: TrendingDown },
  neutral: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', icon: Minus },
};

function getCategoryDotColor(category: string, isBreaking: boolean): string {
  if (isBreaking) return (CATEGORY_COLORS as Record<string, string>).breaking ?? '#ef4444';
  return (CATEGORY_COLORS as Record<string, string>)[category] ?? (CATEGORY_COLORS as Record<string, string>).all ?? '#6b7280';
}

function formatRefreshTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

interface NewsPageProps {
  country: string;
  province: string;
  city: string;
  cityData?: import('../../types/city').City | null;
}

export default function NewsPage({ country, province, city, cityData: initialCityData }: NewsPageProps) {

  const [cityData, setCityData] = useState<City | null>(initialCityData ?? null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [urduArticles, setUrduArticles] = useState<NewsArticle[]>([]);
  const [archivedArticles, setArchivedArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | null>(null);
  const [languageTab, setLanguageTab] = useState<LanguageTab>('english');
  const [loading, setLoading] = useState(true);
  const [urduLoading, setUrduLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [breakingArticles, setBreakingArticles] = useState<NewsArticle[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calendar state
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const loadCity = useCallback(async () => {
    if (!country || !province || !city) return;
    const { data } = await supabase
      .from('cities')
      .select('*')
      .eq('country_slug', country)
      .eq('province_slug', province)
      .eq('city_slug', city)
      .maybeSingle();
    if (data) setCityData(data as City);
  }, [country, province, city]);

  const loadNews = useCallback(async () => {
    if (!cityData) return;
    setLoading(true);
    const news = await fetchNews(cityData.name, cityData.country, activeCategory, 10);
    setArticles(news);
    const breaking = news.filter((a) => a.isBreaking);
    setBreakingArticles(breaking);
    setLastRefresh(new Date());
    setLoading(false);
  }, [cityData, activeCategory]);

  const loadUrduNews = useCallback(async () => {
    if (!cityData) return;
    setUrduLoading(true);
    const news = await fetchUrduNews(cityData.name, 10);
    setUrduArticles(news);
    setUrduLoading(false);
  }, [cityData]);

  const loadArchivedNews = useCallback(async (date: Date) => {
    if (!cityData) return;
    setArchiveLoading(true);
    const news = await fetchNewsByDate(cityData.name, cityData.country, date, 10);
    setArchivedArticles(news);
    setArchiveLoading(false);
  }, [cityData]);

  useEffect(() => { loadCity(); }, [loadCity]);
  useEffect(() => { loadNews(); }, [loadNews]);

  // Load Urdu news when tab switches
  useEffect(() => {
    if (languageTab === 'urdu' && urduArticles.length === 0) {
      loadUrduNews();
    }
  }, [languageTab, loadUrduNews, urduArticles.length]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    refreshIntervalRef.current = setInterval(() => {
      loadNews();
      if (languageTab === 'urdu') loadUrduNews();
    }, 15 * 60 * 1000);
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [loadNews, loadUrduNews, languageTab]);

  // Load archived news when a date is selected
  useEffect(() => {
    if (selectedDate) {
      loadArchivedNews(selectedDate);
    }
  }, [selectedDate, loadArchivedNews]);

  const globalImpacts = cityData ? generateGlobalImpacts(cityData.name, cityData.country_slug) : [];
  const sources = (country && COUNTRY_SOURCES[country]) || DEFAULT_SOURCES;

  const locationLevels: LocationLevelObject[] = [
    { type: 'world', label: 'World' },
    { type: 'country', label: cityData?.country || 'Country', slug: country },
    { type: 'province', label: cityData?.province || 'Province', slug: province },
    { type: 'city', label: cityData?.name || 'City', slug: city },
  ];

  const topStories = articles.slice(0, 5);
  const moreStories = articles.slice(5);
  const headerBg = cityData?.primary_color || '#01411C';

  // Calendar helpers
  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
  const isToday = (day: number) =>
    day === today.getDate() &&
    calendarMonth === today.getMonth() &&
    calendarYear === today.getFullYear();
  const isSelected = (day: number) =>
    selectedDate &&
    day === selectedDate.getDate() &&
    calendarMonth === selectedDate.getMonth() &&
    calendarYear === selectedDate.getFullYear();
  const isFuture = (day: number) => {
    const d = new Date(calendarYear, calendarMonth, day);
    return d > today;
  };

  const handleDateClick = (day: number) => {
    if (isFuture(day)) return;
    setSelectedDate(new Date(calendarYear, calendarMonth, day));
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-transparent/4">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ backgroundColor: headerBg }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <Link
            href={`/${country}/${province}/${city}`}
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-4 transition-colors no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {cityData?.name || 'City'}
          </Link>

          {/* Level Selector */}
          <div className="flex items-center gap-1 flex-wrap mb-4">
            {locationLevels.map((level, idx) => (
              <div key={level.type} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="w-4 h-4 text-white/50" />}
                <Link
                  href={level.slug ? `/${level.slug}` : '/'}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all no-underline ${
                    level.type === 'city'
                      ? 'bg-transparent text-white '
                      : 'bg-transparent/15 text-white hover:bg-transparent/25'
                  }`}
                >
                  {level.type === 'world' && <Globe className="w-3.5 h-3.5" />}
                  {level.type === 'city' && <MapPin className="w-3.5 h-3.5" />}
                  {level.label}
                  {level.type === 'city' && (
                    <span className="text-emerald-400 font-bold">&#10003;</span>
                  )}
                </Link>
              </div>
            ))}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            <Newspaper className="w-7 h-7 inline-block mr-2 -mt-1" />
            {cityData?.name || 'City'} News
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Latest stories from {cityData?.name}, {cityData?.province}, {cityData?.country}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breaking News Bar */}
        <AnimatePresence>
          {breakingArticles.length > 0 && !loading && languageTab === 'english' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-red-600 rounded-xl overflow-hidden">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-red-700 flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider whitespace-nowrap">Breaking</span>
                  </div>
                  <div className="overflow-hidden flex-1 relative">
                    <motion.div
                      animate={{ x: [0, -800] }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                      className="whitespace-nowrap py-2.5 px-3"
                    >
                      {breakingArticles.map((a, i) => (
                        <span key={i} className="text-white text-sm font-medium mx-8">{a.title}</span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && <BreakingBarSkeleton />}

        {/* Language Toggle + Category Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {/* Language Toggle */}
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex bg-transparent rounded-xl border border-white/10 p-1 ">
              <button
                onClick={() => setLanguageTab('english')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  languageTab === 'english'
                    ? 'bg-black/50 text-white '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguageTab('urdu')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all font-urdu ${
                  languageTab === 'urdu'
                    ? 'bg-black/50 text-white '
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                اردو
              </button>
            </div>
            {languageTab === 'urdu' && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <Languages className="w-3 h-3" />
                RTL - Noto Nastaliq Urdu
              </span>
            )}
          </div>

          {/* Category Tabs (only for English) */}
          {languageTab === 'english' && (
            loading ? (
              <TabSkeleton />
            ) : (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === null
                      ? 'bg-black/50 text-white '
                      : 'bg-transparent text-gray-400 border border-white/10 hover:border-white/15 hover:text-white'
                  }`}
                >
                  All News
                </button>
                {NEWS_CATEGORIES.map((cat) => {
                  const Icon = CATEGORY_ICONS[cat.key] || Globe;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat.key
                          ? 'bg-black/50 text-white '
                          : 'bg-transparent text-gray-400 border border-white/10 hover:border-white/15 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </motion.div>

        {/* Urdu News Content */}
        {languageTab === 'urdu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="rtl"
          >
            {/* Urdu sources badge */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm font-bold text-white font-urdu">اردو ذرائع:</span>
              {(sources.urdu || DEFAULT_SOURCES.urdu).map((source) => (
                <span
                  key={source}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/20 font-urdu"
                >
                  {source}
                </span>
              ))}
            </div>

            {urduLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <NewsCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Featured Urdu story */}
                {urduArticles[0] && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4">
                    <a
                      href={urduArticles[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-transparent rounded-2xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group"
                    >
                      <div className="sm:flex">
                        <div className="sm:w-1/2 h-64 sm:h-80 relative overflow-hidden">
                          {urduArticles[0].image ? (
                            <img src={urduArticles[0].image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                              <Newspaper className="w-12 h-12 text-emerald-300" />
                            </div>
                          )}
                        </div>
                        <div className="sm:w-1/2 p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-urdu">
                            <span className="font-medium text-emerald-400">{getSourceName(urduArticles[0].source)}</span>
                            <span>&#183;</span>
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo(urduArticles[0].publishedAt)}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-400 transition-colors font-urdu">
                            {urduArticles[0].title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-loose font-urdu">{urduArticles[0].description}</p>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )}

                {/* Urdu grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {urduArticles.slice(1).map((article, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: (idx + 1) * 0.1 }}>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-transparent rounded-2xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group h-full"
                      >
                        <div className="h-40 relative overflow-hidden">
                          {article.image ? (
                            <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                              <Newspaper className="w-8 h-8 text-emerald-300" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5 font-urdu">
                            <span className="font-medium text-emerald-400">{getSourceName(article.source)}</span>
                            <span>&#183;</span>
                            <span>{timeAgo(article.publishedAt)}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors font-urdu line-clamp-3">
                            {article.title}
                          </h4>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Urdu empty state */}
            {!urduLoading && urduArticles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-400 mb-1 font-urdu">خبریں نہیں ملیں</h3>
                <p className="text-sm text-gray-400 font-urdu">براہ کرم بعد میں دوبارہ چیک کریں</p>
              </div>
            )}
          </motion.div>
        )}

        {/* English News Content */}
        {languageTab === 'english' && (
          <>
            {/* News Search */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                <Search className="w-5 h-5 text-emerald-400" />
                Search News
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm mb-4">
                {generateSearchParagraph(cityData?.name || city)}
              </p>
              <NewsSearch cityName={cityData?.name || ''} country={cityData?.country || ''} />
              <p className="text-gray-400 leading-relaxed text-sm mt-4">
                {generateSearchAfter(cityData?.name || city)}
              </p>
            </motion.section>

            {/* Main content: Top Stories + Live Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column: Top Stories */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                  Top Stories
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {generateTopStoriesParagraph(cityData?.name || city)}
                </p>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <NewsCardSkeleton key={i} />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* First story - large featured */}
                    {topStories[0] && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <a
                          href={topStories[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-transparent rounded-2xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group"
                        >
                          <div className="sm:flex">
                            <div className="sm:w-1/2 h-64 sm:h-80 relative overflow-hidden">
                              {topStories[0].image ? (
                                <img src={topStories[0].image} alt={topStories[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                                  <Newspaper className="w-12 h-12 text-emerald-300" />
                                </div>
                              )}
                              {topStories[0].isBreaking && (
                                <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" /> Breaking
                                </span>
                              )}
                              <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                                {topStories[0].category}
                              </span>
                            </div>
                            <div className="sm:w-1/2 p-6 flex flex-col justify-center">
                              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span className="font-medium text-emerald-400">{getSourceName(topStories[0].source)}</span>
                                <span>&#183;</span>
                                <Clock className="w-3 h-3" />
                                <span>{timeAgo(topStories[0].publishedAt)}</span>
                              </div>
                              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug group-hover:text-emerald-400 transition-colors">
                                {topStories[0].title}
                              </h3>
                              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{topStories[0].description}</p>
                              <div className="mt-4 inline-flex items-center gap-1 text-emerald-400 text-sm font-medium">
                                Read full story <ExternalLink className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        </a>
                      </motion.div>
                    )}

                    {/* Stories 2-5 grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {topStories.slice(1).map((article, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: (idx + 1) * 0.1 }}>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-transparent rounded-2xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group h-full"
                          >
                            <div className="h-40 relative overflow-hidden">
                              {article.image ? (
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                                  <Newspaper className="w-8 h-8 text-emerald-300" />
                                </div>
                              )}
                              <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full capitalize">
                                {article.category}
                              </span>
                            </div>
                            <div className="p-4">
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5">
                                <span className="font-medium text-emerald-400">{getSourceName(article.source)}</span>
                                <span>&#183;</span>
                                <span>{timeAgo(article.publishedAt)}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-3">
                                {article.title}
                              </h4>
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}

                {!loading && (
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {generateTopStoriesAfter(cityData?.name || city)}
                  </p>
                )}

                {/* More Stories */}
                {moreStories.length > 0 && !loading && (
                  <section>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                      More Stories
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-sm mb-4">
                      {generateMoreStoriesParagraph(cityData?.name || city)}
                    </p>
                    <div className="space-y-3">
                      {moreStories.map((article, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }}>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex bg-transparent rounded-xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group"
                          >
                            <div className="w-28 sm:w-36 flex-shrink-0 h-24 sm:h-28 relative overflow-hidden">
                              {article.image ? (
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                                  <Newspaper className="w-6 h-6 text-emerald-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                                <span className="font-medium text-emerald-400">{getSourceName(article.source)}</span>
                                <span>&#183;</span>
                                <Clock className="w-3 h-3" />
                                <span>{timeAgo(article.publishedAt)}</span>
                                <span>&#183;</span>
                                <span className="capitalize">{article.category}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {article.title}
                              </h4>
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm mt-4">
                      {generateMoreStoriesAfter(cityData?.name || city)}
                    </p>
                  </section>
                )}
              </div>

              {/* Right column: Live Feed */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-transparent rounded-2xl  border border-white/8 sticky top-20"
                >
                  <div className="p-4 border-b border-white/8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Radio className="w-4 h-4 text-red-500" />
                        Live Feed
                      </h2>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <RefreshCw className="w-3 h-3" />
                        <span>Updated {formatRefreshTime(lastRefresh)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Auto-refreshes every 15 min</p>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">
                      {generateLiveFeedParagraph(cityData?.name || city)}
                    </p>
                  </div>

                  {loading ? (
                    <div className="p-4 space-y-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-start gap-3 animate-pulse">
                          <div className="w-2.5 h-2.5 rounded-full bg-transparent/8 mt-1.5 flex-shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-transparent/8 rounded w-3/4" />
                            <div className="h-2.5 bg-transparent/5 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                      {articles.map((article, idx) => {
                        const dotColor = getCategoryDotColor(article.category, article.isBreaking);
                        return (
                          <motion.a
                            key={idx}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="flex items-start gap-3 p-3.5 hover:bg-transparent/4 transition-colors no-underline group"
                          >
                            <span className="relative flex-shrink-0 mt-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full block"
                                style={{ backgroundColor: dotColor }}
                              />
                              <span
                                className="absolute inset-0 w-2.5 h-2.5 rounded-full opacity-30 scale-150"
                                style={{ backgroundColor: dotColor }}
                              />
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-semibold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                                <span
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium capitalize"
                                  style={{
                                    backgroundColor: `${dotColor}15`,
                                    color: dotColor,
                                  }}
                                >
                                  {article.category}
                                </span>
                                <span>{getSourceName(article.source)}</span>
                                <span>&#183;</span>
                                <span>{timeAgo(article.publishedAt)}</span>
                              </div>
                            </div>
                          </motion.a>
                        );
                      })}
                    </div>
                  )}

                  {/* Category legend */}
                  <div className="p-3 border-t border-white/8 bg-transparent/4/50 rounded-b-2xl">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/100" /> Breaking</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500/100" /> Sports</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500/100" /> Finance</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-transparent/40" /> World</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed text-sm">
              {generateLiveFeedAfter(cityData?.name || city)}
            </p>

            {/* Empty state */}
            {!loading && articles.length === 0 && (
              <div className="text-center py-16">
                <Newspaper className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-400 mb-1">No stories found</h3>
                <p className="text-sm text-gray-400">Try selecting a different category or check back later</p>
              </div>
            )}
          </>
        )}

        {/* Archive By Date */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <Calendar className="w-5 h-5 text-emerald-400" />
            Archive by Date
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateArchiveParagraph(cityData?.name || city)}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="bg-transparent rounded-2xl  border border-white/8 p-5">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-transparent/5 transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                </button>
                <h3 className="text-sm font-bold text-white">
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-transparent/5 transition-colors"
                  aria-label="Next month"
                  disabled={calendarYear === today.getFullYear() && calendarMonth === today.getMonth()}
                >
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-center text-[11px] font-medium text-gray-400 py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isTod = isToday(day);
                  const isSel = isSelected(day);
                  const isFut = isFuture(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleDateClick(day)}
                      disabled={isFut}
                      className={`relative w-8 h-8 rounded-lg text-xs font-medium transition-all mx-auto ${
                        isSel
                          ? 'bg-emerald-600 text-white '
                          : isTod
                          ? 'bg-emerald-500/10 text-emerald-400 font-bold ring-1 ring-emerald-200'
                          : isFut
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-300 hover:bg-transparent/5'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear selection
                </button>
              )}
            </div>

            {/* Archived articles */}
            <div className="lg:col-span-2">
              {!selectedDate ? (
                <div className="bg-transparent rounded-2xl  border border-white/8 p-8 text-center">
                  <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Select a date</h3>
                  <p className="text-xs text-gray-400">Click any day on the calendar to view news from that date</p>
                </div>
              ) : archiveLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <NewsCardSkeleton key={i} />
                  ))}
                </div>
              ) : archivedArticles.length === 0 ? (
                <div className="bg-transparent rounded-2xl  border border-white/8 p-8 text-center">
                  <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">No articles found</h3>
                  <p className="text-xs text-gray-400">
                    No news available for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-white">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-gray-400">
                      {archivedArticles.length} article{archivedArticles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {archivedArticles.map((article, idx) => (
                    <motion.a
                      key={idx}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex bg-transparent rounded-xl  border border-white/8 overflow-hidden hover: transition-shadow no-underline group"
                    >
                      <div className="w-24 sm:w-32 flex-shrink-0 h-20 sm:h-24 relative overflow-hidden">
                        {article.image ? (
                          <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                            <Newspaper className="w-5 h-5 text-emerald-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                          <span className="font-medium text-emerald-400">{getSourceName(article.source)}</span>
                          <span>&#183;</span>
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(article.publishedAt)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-snug group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateArchiveAfter(cityData?.name || city)}
          </p>
        </motion.section>

        {/* Video News */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <Play className="w-5 h-5 text-red-400" />
            Video News
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateVideoParagraph(cityData?.country || country)}
          </p>
          <VideoNews countrySlug={country || ''} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateVideoAfter(cityData?.country || country)}
          </p>
        </motion.section>

        {/* Social Pulse */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Social Pulse
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateSocialParagraph(cityData?.name || city)}
          </p>
          <SocialPulse cityName={cityData?.name || ''} topics={generateTrendingTopics(cityData?.name || '', articles)} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateSocialAfter(cityData?.name || city)}
          </p>
        </motion.section>

        {/* Week in Review */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            <Calendar className="w-5 h-5 text-emerald-400" />
            Week in Review
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateWeekParagraph(cityData?.name || city)}
          </p>
          <WeekInReview cityName={cityData?.name || ''} articles={generateWeekInReview(articles)} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateWeekAfter(cityData?.name || city)}
          </p>
        </motion.section>

        {/* Global Impact on City */}
        {globalImpacts.length > 0 && !loading && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              How World News Affects {cityData?.name || 'Your City'} Today
            </h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateImpactParagraph(cityData?.name || city)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {globalImpacts.map((impact, idx) => {
                const style = IMPACT_COLORS[impact.impact];
                const ImpactIcon = IMPACT_ICONS[impact.icon] || Globe;
                const TrendIcon = style.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.08 }}
                    className={`rounded-xl border p-4 ${style.bg} ${style.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg} border ${style.border}`}>
                        <ImpactIcon className={`w-4 h-4 ${style.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-sm font-bold ${style.text}`}>{impact.title}</h3>
                          <TrendIcon className={`w-4 h-4 flex-shrink-0 ${style.text}`} />
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{impact.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateImpactAfter(cityData?.name || city)}
            </p>
          </motion.section>
        )}

        {/* Sources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-600 rounded-full" />
            News Sources
          </h2>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateSourcesParagraph(cityData?.name || city, cityData?.country || country)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Local sources */}
            <div className="bg-transparent rounded-2xl  border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  {cityData?.country || 'Local'} Sources
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.local.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/20"
                  >
                    <Newspaper className="w-3 h-3" />
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* International sources */}
            <div className="bg-transparent rounded-2xl  border border-white/8 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">International Sources</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {sources.international.map((source) => (
                  <span
                    key={source}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-lg border border-blue-100"
                  >
                    <Globe className="w-3 h-3" />
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Urdu sources */}
            {(sources.urdu || DEFAULT_SOURCES.urdu) && (
              <div className="bg-transparent rounded-2xl  border border-white/8 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Urdu Sources</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(sources.urdu || DEFAULT_SOURCES.urdu).map((source) => (
                    <span
                      key={source}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-lg border border-amber-100 font-urdu"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateSourcesAfter(cityData?.name || city, cityData?.country || country)}
          </p>
        </motion.section>
      </div>
    </div>
  );
}
