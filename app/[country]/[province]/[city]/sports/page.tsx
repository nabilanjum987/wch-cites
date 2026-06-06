'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import type { City } from '@/types/city';
import {
  generateSportsIntroductionParagraph,
  generateCricketDominanceParagraph,
  generateFieldsAndVenuesParagraph,
  generateSquashLegacyParagraph,
  generateYouthSportsEngagementParagraph,
  generateInternationalCompetitionsParagraph,
  generateWomensSportsParagraph,
} from '@/lib/paragraphs/sportsParagraphs';
import { generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

export const revalidate = 3600;

interface SportsEvent {
  id: string;
  sport: string;
  teams: string;
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
}

export default function SportsPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [events, setEvents] = useState<SportsEvent[]>([]);
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

        const mockEvents: SportsEvent[] = [
          {
            id: '1',
            sport: 'Cricket',
            teams: 'City Hawks vs Northern Tigers',
            date: 'Tomorrow',
            time: '3:00 PM',
            venue: 'National Stadium',
            status: 'upcoming',
          },
          {
            id: '2',
            sport: 'Football',
            teams: 'United FC vs Dynamo FC',
            date: 'Tomorrow',
            time: '7:00 PM',
            venue: 'City Sports Complex',
            status: 'upcoming',
          },
          {
            id: '3',
            sport: 'Hockey',
            teams: 'Provincial Team vs Regional Rivals',
            date: 'Today',
            time: '5:30 PM',
            venue: 'Olympic Arena',
            status: 'upcoming',
          },
          {
            id: '4',
            sport: 'Tennis',
            teams: 'City Tennis Championship - Singles',
            date: 'June 5',
            time: '10:00 AM',
            venue: 'Tennis Court Complex',
            status: 'upcoming',
          },
          {
            id: '5',
            sport: 'Basketball',
            teams: 'City Hoops vs Valley Kings',
            date: 'June 4',
            time: '8:00 PM',
            venue: 'Indoor Gymnasium',
            status: 'upcoming',
          },
          {
            id: '6',
            sport: 'Volleyball',
            teams: 'Women League - Final Match',
            date: 'June 3',
            time: '6:00 PM',
            venue: 'Sports Hall',
            status: 'completed',
          },
        ];

        setEvents(mockEvents);
      } catch (err) {
        setError('Error loading sports events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return { bg: 'bg-red-500/10', text: 'text-red-400', badge: 'bg-red-500' };
      case 'upcoming':
        return { bg: 'bg-green-500/10', text: 'text-green-400', badge: 'bg-green-500' };
      case 'completed':
        return { bg: 'bg-gray-500/10', text: 'text-gray-400', badge: 'bg-gray-500' };
      default:
        return { bg: 'bg-blue-500/10', text: 'text-blue-400', badge: 'bg-blue-500' };
    }
  };

  // Inject schema markup for SEO
  useEffect(() => {
    if (!city) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-sports';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'sports'));
    document.head.appendChild(breadcrumbScript);

    // Update meta tags
    document.title = `${city.name} Sports Events — Cricket, Football & Local Tournaments`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        `Sports events and tournaments in ${city.name}: cricket matches, football games, and athletic competitions happening in the city.`
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Sports Events</h1>
            <p className="text-gray-400 text-lg">
              Upcoming matches in {city?.name}
            </p>
            <p className="text-gray-500 text-sm mt-2">Stay updated with local sports schedule</p>
          </div>
        </motion.header>

        <div className="w-full px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[...Array(6)].map((_, idx) => (
                  <motion.div
                    key={idx}
                    variants={ANIMATIONS.scaleIn}
                    className="h-32 bg-white/5 rounded-2xl animate-pulse"
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
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {events.map((event) => {
                  const statusColor = getStatusColor(event.status);
                  return (
                    <motion.div
                      key={event.id}
                      variants={ANIMATIONS.scaleIn}
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                      <GlassCard
                        variant="premium"
                        glowColor="orange"
                        className="h-full p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                                {event.sport}
                              </p>
                              <h3 className="text-lg font-bold text-white line-clamp-2">
                                {event.teams}
                              </h3>
                            </div>
                            <span className={`h-3 w-3 rounded-full ${statusColor.badge}`} />
                          </div>
                        </div>

                        <div className="space-y-2 py-4 border-y border-white/10">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Date</span>
                            <span className="text-white font-semibold">{event.date}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Time</span>
                            <span className="text-white font-semibold">{event.time}</span>
                          </div>
                        </div>

                        <div className="pt-4">
                          <p className="text-gray-400 text-xs mb-2">Venue</p>
                          <p className="text-orange-300 font-semibold text-sm">{event.venue}</p>
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="mt-12"
            >
              <motion.div variants={ANIMATIONS.scaleIn}>
                <GlassCard variant="default" className="p-8">
                  <h4 className="text-lg font-semibold text-white mb-4">Sports in {city?.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <p className="font-semibold text-white mb-2">Popular Sports</p>
                      <ul className="space-y-1">
                        <li>Cricket - National Sport</li>
                        <li>Football - Growing Popularity</li>
                        <li>Hockey - Professional Level</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-2">Event Information</p>
                      <p>Book tickets online through official channels. Arrive early for best seating. Follow stadium guidelines for safety.</p>
                    </div>
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
                {/* Sports Introduction */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h2 className="text-3xl font-bold text-white mb-6">Sports in {city?.name}</h2>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateSportsIntroductionParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Cricket Dominance */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Cricket Heritage and Dominance</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateCricketDominanceParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Fields and Venues */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Sports Fields and Venues</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateFieldsAndVenuesParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Squash Legacy */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Squash and Racquet Sports Legacy</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateSquashLegacyParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Youth Sports */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Youth Sports Engagement</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateYouthSportsEngagementParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* International Competitions */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">International Sports Competitions</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateInternationalCompetitionsParagraph(city),
                      }}
                    />
                  )}
                </motion.div>

                {/* Women's Sports */}
                <motion.div variants={ANIMATIONS.fadeInUp} className="prose prose-invert max-w-none">
                  <h3 className="text-2xl font-bold text-white mb-4">Women's Sports and Empowerment</h3>
                  {city && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: generateWomensSportsParagraph(city),
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
