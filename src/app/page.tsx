'use client';

import { motion } from 'framer-motion';
import SearchBar from '@/components/shared/SearchBar';
import LiveGlobalStats from '@/components/home/LiveGlobalStats';
import FeaturedCitiesGrid from '@/components/home/FeaturedCitiesGrid';
import ExploreByContinent from '@/components/home/ExploreByContinent';
import ExploreByReligion from '@/components/home/ExploreByReligion';
import FeaturedWonders from '@/components/home/FeaturedWonders';
import LivePrayerTimesStrip from '@/components/home/LivePrayerTimesStrip';
import OceansToday from '@/components/home/OceansToday';
import GlobalMarketSnapshot from '@/components/home/GlobalMarketSnapshot';
import DidYouKnow from '@/components/home/DidYouKnow';
import FeaturedCountries from '@/components/home/FeaturedCountries';
import WorldNewsSection from '@/components/home/WorldNewsSection';
import WorldWeatherExtremes from '@/components/home/WorldWeatherExtremes';
import AllFaithsToday from '@/components/home/AllFaithsToday';
import HeritageSpotlight from '@/components/home/HeritageSpotlight';
import AboutAndFooter from '@/components/home/AboutAndFooter';
import ActiveConflictsWidget from '@/components/home/ActiveConflictsWidget';
import {
  AuroraBackground,
  AnimatedGradientText,
  AnimatedCounter,
  ScrollAnimation,
} from '@/components/shared/AnimatedComponents';
import { COLORS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Globe, Users, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const handleCitySelect = (city: { country_slug: string; province_slug: string; city_slug: string }) => {
    if (city) {
      window.location.href = `/${city.country_slug}/${city.province_slug}/${city.city_slug}`;
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <AuroraBackground>
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
          <motion.div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, -50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, 50, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }} />

          <div className="max-w-4xl mx-auto w-full z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

              <AnimatedGradientText
                text="Every City. Every Culture. Every Day."
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight block"
              />

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-base md:text-lg mb-4 max-w-2xl mx-auto leading-relaxed"
                style={{ color: COLORS.textSecondary }}>
                Live weather, prayer times, gold rates, news and culture for 10,247 cities across 195 countries — updated every day.
              </motion.p>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto mb-10">
                <div className="backdrop-blur-md border rounded-2xl p-4"
                  style={{ backgroundColor: 'rgba(10,15,30,0.6)', borderColor: COLORS.border }}>
                  <SearchBar onCitySelect={handleCitySelect} />
                </div>
              </motion.div>

              <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate"
                className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedCounter label="Cities"        value={10247} icon={<Globe      className="w-6 h-6 text-indigo-400" />} />
                <AnimatedCounter label="Countries"     value={195}   icon={<Users      className="w-6 h-6 text-cyan-400"   />} />
                <AnimatedCounter label="Faiths"        value={7}     icon={<Clock      className="w-6 h-6 text-purple-400" />} />
                <AnimatedCounter label="Live Updates"  value={24} suffix="/7" icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="absolute bottom-10" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <svg className="w-6 h-6 mx-auto" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>
      </AuroraBackground>

      {/* ── GLOBAL INSIGHTS ── */}
      <Section bg="dark" title="Global Insights"
        desc="Four numbers that tell you the state of the world right now — cities live, next prayer in Mecca, today's gold price, and the hottest city on earth. Refreshed automatically.">
        <LiveGlobalStats />
      </Section>

      {/* ── FEATURED CITIES ── */}
      <Section bg="darker" title="Featured Cities"
        desc="Twelve cities, live data. Click any city for full weather, prayer times, rates, news, and heritage.">
        <FeaturedCitiesGrid />
      </Section>

      {/* ── PRAYER TIMES ── */}
      <Section bg="dark" title="Prayer Times Around the World"
        desc="Next prayer across major Muslim-majority cities, updated live. Click any city for full monthly timetable and Qibla direction.">
        <LivePrayerTimesStrip />
      </Section>

      {/* ── GLOBAL MARKET SNAPSHOT ── */}
      <Section bg="darker" title="Live Market Rates"
        desc="Gold, Bitcoin, oil, and major currency pairs updated continuously. Click 'Full rates page' for city-specific gold in tola and local currency.">
        <GlobalMarketSnapshot />
      </Section>

      {/* ── WORLD WONDERS ── */}
      <Section bg="dark" title="Seven Wonders of the World"
        desc="Each wonder has its own page with today's weather, visiting guide, history, photography tips, and nearby attractions.">
        <FeaturedWonders />
      </Section>

      {/* ── EXPLORE BY CONTINENT ── */}
      <Section bg="darker" title="Explore by Continent"
        desc="All seven continents with city counts. Browse countries and cities by region.">
        <ExploreByContinent />
      </Section>

      {/* ── COUNTRIES ── */}
      <Section bg="dark" title="Countries of the World"
        desc="195 countries, each with its own page covering provinces, cities, economy, culture, and more.">
        <FeaturedCountries />
      </Section>

      {/* ── EXPLORE BY FAITH ── */}
      <Section bg="darker" title="Explore the World by Faith"
        desc="Seven traditions. Prayer times, sacred calendars, and cultural practices across every major belief system.">
        <ExploreByReligion />
      </Section>

      {/* ── WORLD NEWS ── */}
      <Section bg="dark" title="World News by Region"
        desc="Latest news from every region of the world, sourced from international wire services.">
        <WorldNewsSection />
      </Section>

      {/* ── WORLD WEATHER + CLOCKS ── */}
      <Section bg="darker" title="World Weather & Clocks"
        desc="Where it is hottest, coldest, rainiest, and snowiest right now — plus live analog clocks for four major world time zones.">
        <WorldWeatherExtremes />
      </Section>

      {/* ── ACTIVE CONFLICTS ── */}
      <Section bg="dark" title="Active Conflicts"
        desc="Factual, educational overview. Sources: UN, ACLED. No sides taken.">
        <ActiveConflictsWidget />
      </Section>

      {/* ── OCEANS TODAY ── */}
      <Section bg="darker" title="Oceans Today"
        desc="Current conditions across the Pacific, Atlantic, Indian, Arctic and Southern Oceans. Each ocean links to its own full page.">
        <OceansToday />
      </Section>

      {/* ── ALL FAITHS TODAY ── */}
      <Section bg="dark" title="All Faiths Today"
        desc="Seven calendar systems. One planet. Today's date across every major tradition.">
        <AllFaithsToday />
      </Section>

      {/* ── HERITAGE SPOTLIGHT ── */}
      <Section bg="darker" title="Heritage Spotlight"
        desc="Traditional crafts and cultural treasures from cities around the world.">
        <HeritageSpotlight />
      </Section>

      {/* ── DID YOU KNOW ── */}
      <Section bg="dark" title="">
        <DidYouKnow />
      </Section>

      {/* ── FOOTER ── */}
      <AboutAndFooter />
    </>
  );
}

function Section({ bg, title, desc, children }: {
  bg: 'dark' | 'darker'; title: string; desc?: string; children: React.ReactNode;
}) {
  const bgColor = bg === 'dark' ? COLORS.background : `${COLORS.background}cc`;
  return (
    <ScrollAnimation>
      <section className="py-14 px-4" style={{ backgroundColor: bgColor }}>
        <div className="max-w-6xl mx-auto">
          {title && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-white mb-3">
              {title}
            </motion.h2>
          )}
          {desc && <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-3xl">{desc}</p>}
          {children}
        </div>
      </section>
    </ScrollAnimation>
  );
}
