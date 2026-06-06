'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import type { City } from '@/types/city';
import {
  generateNewsIntroductionParagraph,
  generateLocalNewsCategoriesParagraph,
  generateMediaOutletsParagraph,
  generateSocialMediaNewsParagraph,
  generateEventsCulturalParagraph,
  generateBreakingnewsParagraph,
  generateNewsArchiveParagraph,
} from '@/lib/paragraphs/newsParagraphs';
import { generateNewsMeta, generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

export const revalidate = 3600;

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  importance: 'high' | 'medium' | 'low';
}

export default function NewsPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const country = Array.isArray(params.country) ? params.country[0] : params.country;
        const province = Array.isArray(params.province) ? params.province[0] : params.province;
        const citySlug = Array.isArray(params.city) ? params.city[0] : params.city;

        const cityData = await getCityData(country, province, citySlug);

        if (!cityData) {
          setError('City not found');
          setLoading(false);
          return;
        }

        setCity(cityData);

        const mockArticles: NewsArticle[] = [
          {
            id: '1',
            title: 'City Development Project Updates',
            category: 'Development',
            date: 'Today',
            summary: 'New infrastructure projects announced for the city. Multiple development zones to be inaugurated next quarter.',
            importance: 'high',
          },
          {
            id: '2',
            title: 'Cultural Festival Preparations Begin',
            category: 'Events',
            date: 'Yesterday',
            summary: 'Annual cultural festival preparations kick off with community involvement. Expect increased activity in downtown areas.',
            importance: 'medium',
          },
          {
            id: '3',
            title: 'Weather Alert: Monsoon Season',
            category: 'Weather',
            date: '2 days ago',
            summary: 'Monsoon season approaching. Citizens advised to prepare for heavy rainfall and potential flooding in low-lying areas.',
            importance: 'high',
          },
          {
            id: '4',
            title: 'Business Growth Statistics Released',
            category: 'Economy',
            date: '3 days ago',
            summary: 'City economy shows 8.5% growth this quarter. New businesses opening, employment opportunities increasing.',
            importance: 'medium',
          },
          {
            id: '5',
            title: 'Sports Tournament Schedule Announced',
            category: 'Sports',
            date: '4 days ago',
            summary: 'Regional sports tournament to be hosted in the city. Registration now open for participating teams.',
            importance: 'low',
          },
          {
            id: '6',
            title: 'Tourism Numbers Rise',
            category: 'Tourism',
            date: '5 days ago',
            summary: 'City attracted record number of tourists this month. New hotels and resorts contributing to growth.',
            importance: 'medium',
          },
        ];

        setArticles(mockArticles);
      } catch (err) {
        setError('Error loading news articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'red';
      case 'medium':
        return 'amber';
      default:
        return 'blue';
    }
  };

  // Inject schema markup for SEO
  useEffect(() => {
    if (!city) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-news';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'news'));
    document.head.appendChild(breadcrumbScript);

    // Update meta tags
    document.title = `${city.name} News Today — Latest Breaking News & Events`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Latest news from ${city.name}: breaking news, local events, political updates, business developments, and cultural happenings.`
      );
    }

    return () => {
      breadcrumbScript.remove();
    };
  }, [city]);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <motion.header
          className="w-full py-12 px-4 border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Latest News</h1>
            <p className="text-gray-400 text-lg">
              From {city?.name}, {city?.province}
            </p>
            <p className="text-gray-500 text-sm mt-2">Stay updated with local news and events</p>
          </div>
        </motion.header>

        <div className="w-full px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {[...Array(6)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    variants={ANIMATIONS.scaleIn}
                    className="h-24 bg-white/5 rounded-2xl animate-pulse"
                  />
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                variants={ANIMATIONS.scaleIn}
                initial="initial"
                animate="animate"
                className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center"
              >
                <p className="text-red-400 text-lg">{error}</p>
              </motion.div>
            ) : (
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
                viewport={{ once: true, margin: '-100px' }}
                className="space-y-4"
              >
                {articles.map((article) => (
                  <motion.div
                    key={article.id}
                    variants={ANIMATIONS.scaleIn}
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <GlassCard
                      variant="default"
                      glowColor="violet"
                      className="p-6 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs uppercase tracking-widest text-gray-400">
                              {article.category}
                            </span>
                            <span
                              className={`inline-block h-2 w-2 rounded-full bg-${getImportanceColor(
                                article.importance
                              )}-500`}
                            />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{article.summary}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <span className="text-xs text-gray-500">{article.date}</span>
                        <span className="text-purple-400 text-xs font-semibold uppercase">
                          Read More
                        </span>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="mt-12"
            >
              <motion.div variants={ANIMATIONS.scaleIn}>
                <GlassCard variant="highlight" className="p-8">
                  <h4 className="text-lg font-semibold text-white mb-3">News Categories</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Development', 'Events', 'Weather', 'Economy', 'Sports', 'Tourism'].map(
                      (cat) => (
                        <div
                          key={cat}
                          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {cat}
                        </div>
                      )
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>

            {/* SEO CONTENT SECTIONS */}
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="mt-16 border-t border-white/10 pt-12"
            >
              <div className="space-y-12">
                {/* News Introduction */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">News from {city?.name}</h2>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateNewsIntroductionParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* News Categories */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Local News Categories</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateLocalNewsCategories(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Media Outlets */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Media Outlets and News Sources</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateMediaOutletsParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Social Media */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Social Media and Digital News</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateSocialMediaNewsParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Cultural Events */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Cultural and Religious Events</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateEventsCulturalParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Breaking News */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Breaking News Coverage</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateBreakingnewsParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* News Archives */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">News Archives and Historical Records</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateNewsArchiveParagraph(city),
                      }}
                    />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
