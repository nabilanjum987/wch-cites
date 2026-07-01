'use client';

import { motion } from 'framer-motion';
import SearchBar from '@/components/shared/SearchBar';
import TickerBar from '@/components/shared/TickerBar';
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
import {
  AuroraBackground,
  AnimatedGradientText,
  AnimatedCounter,
  ScrollAnimation,
} from '@/components/shared/AnimatedComponents';
import { COLORS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Globe, Users, Clock, TrendingUp } from 'lucide-react';

export default function Home() {
  const handleCitySelect = (city: any) => {
    if (city) {
      window.location.href = `/${city.country_slug}/${city.province_slug}/${city.city_slug}`;
    }
  };

  return (
    <>
      {/* ── HERO ── */}
      <AuroraBackground>
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
          <motion.div
            className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-72 h-72 bg-cyan-500/20 rounded-full filter blur-3xl"
            animate={{ y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />

          <div className="max-w-6xl mx-auto w-full z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <AnimatedGradientText
                text="Every City. Every Culture. Every Day."
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl md:text-2xl mb-8"
                style={{ color: COLORS.textSecondary }}
              >
                Explore the world's cities with real-time data, cultural insights, and global connections
              </motion.p>

              {/* SEO Intro Paragraph */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-base md:text-lg max-w-3xl mx-auto mb-10 leading-relaxed"
                style={{ color: COLORS.textSecondary, opacity: 0.75 }}
              >
                WorldCityHub covers 10,247 cities across 195 countries with information that
                actually changes every day. Each city page gives you the current weather, prayer
                and faith times for every religion, gold and currency rates, local news, heritage
                crafts, famous personalities, and cultural events — all gathered from live data
                sources and updated around the clock. Search any city below, or explore the world
                by continent, country, faith, or ocean. Whatever corner of the earth you are
                curious about, you will find it here.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-2xl mx-auto mb-12"
              >
                <div
                  className="backdrop-blur-md border rounded-2xl p-4 shadow-2xl"
                  style={{
                    backgroundColor: `rgba(10, 15, 30, 0.6)`,
                    borderColor: COLORS.border,
                  }}
                >
                  <SearchBar onCitySelect={handleCitySelect} />
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                <AnimatedCounter label="Cities" value={10247} icon={<Globe className="w-6 h-6 text-indigo-400" />} />
                <AnimatedCounter label="Countries" value={195} icon={<Users className="w-6 h-6 text-cyan-400" />} />
                <AnimatedCounter label="Faiths Covered" value={7} icon={<Clock className="w-6 h-6 text-purple-400" />} />
                <AnimatedCounter label="Live Updates" value={24} suffix="/7" icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 mx-auto" style={{ color: COLORS.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>
      </AuroraBackground>

      {/* ── TICKER ── */}
      <motion.section
        className="sticky top-16 z-40"
        style={{ backgroundColor: `rgba(10, 15, 30, 0.95)`, borderBottom: `1px solid ${COLORS.border}`, backdropFilter: 'blur(10px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <TickerBar />
      </motion.section>

      {/* ── GLOBAL INSIGHTS ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}ee` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Global Insights" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              Four numbers that tell you the state of the world right now. How many cities are live
              on WorldCityHub, what the next prayer time is in Mecca, where today's gold price
              stands, and which city is currently the hottest on earth. These figures refresh
              automatically throughout the day so every time you visit you are seeing the actual
              current picture, not a cached snapshot from hours ago.
            </p>
            <LiveGlobalStats />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── FEATURED CITIES ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Featured Cities" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              From Mecca to Mumbai, from London to Lahore, these twelve cities represent the
              diversity of what WorldCityHub covers. Each card shows the city's current temperature,
              faith time, and a direct link to its full city page with weather, news, rates, heritage,
              and more. Click any city to see everything about it updated for today.
            </p>
            <FeaturedCitiesGrid />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── PRAYER TIMES AROUND THE WORLD ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Prayer Times Around the World" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              For over a billion Muslims around the world, five prayer times shape the rhythm of
              every single day. This strip shows the next upcoming prayer for major cities across
              the globe, from Mecca and Medina to Karachi, Lahore, Dubai, and beyond. Every city
              on WorldCityHub has its own dedicated prayer times page with a full monthly timetable,
              Qibla direction, and browser notification reminders.
            </p>
            <LivePrayerTimesStrip />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── GLOBAL MARKET SNAPSHOT ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Global Market Snapshot" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              Gold, Bitcoin, and oil move every hour and affect the cost of living in cities across
              the world. This snapshot shows where the three biggest global market indicators are
              sitting right now, alongside live currency exchange rates including USD to PKR, EUR,
              GBP, and the major Gulf currencies. For a city-specific gold rate in local units like
              tola or per 10g, visit any city's Rates page directly.
            </p>
            <GlobalMarketSnapshot />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── WORLD WONDERS ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="World Wonders" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              The world's most remarkable structures and natural sites have drawn travellers,
              scholars, and pilgrims for centuries. WorldCityHub gives each wonder its own page
              showing today's weather at the site, visiting information, the city and country it
              belongs to, and its historical significance. These are not just tourist attractions.
              They are the places that define the civilisations that built them.
            </p>
            <FeaturedWonders />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── EXPLORE BY CONTINENT ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Explore by Continent" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              The world divides into eight major regions, each with its own climate, culture,
              economic character, and religious traditions. Asia alone has over 4,500 cities on
              WorldCityHub. The Middle East brings together the most searched prayer time cities.
              Europe holds the most UNESCO heritage sites. Click any continent to browse its
              countries and cities, or use the search bar above to go directly to any city in the
              world.
            </p>
            <ExploreByContinent />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── COUNTRIES OF THE WORLD ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Countries of the World" />
            <FeaturedCountries />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── EXPLORE BY FAITH ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Explore the World by Faith" subtitle="Cities, sacred times, and cultural practices across every major belief system" />
            <ExploreByReligion />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── WORLD NEWS ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="World News by Region" />
            <WorldNewsSection />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── WORLD WEATHER EXTREMES ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="World Weather Today" />
            <WorldWeatherExtremes />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── OCEANS TODAY ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Oceans Today" />
            <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
              The world's five oceans cover over 70 percent of the earth's surface and directly
              shape the weather, trade, and daily life of every coastal city on the planet. This
              section shows current sea surface temperatures, wave conditions, and weather patterns
              across the Pacific, Atlantic, Indian, Arctic, and Southern Oceans. Click any ocean
              to see conditions for major seas within it, including the Arabian Sea, the
              Mediterranean, and the Red Sea.
            </p>
            <OceansToday />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── ALL FAITHS TODAY ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="All Faiths Today" subtitle="Seven calendar systems. One planet. Today's date across every tradition." />
            <AllFaithsToday />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── HERITAGE SPOTLIGHT ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader title="Heritage Spotlight" subtitle="One craft. One city. One story." />
            <HeritageSpotlight />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── DID YOU KNOW ── */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <DidYouKnow />
          </div>
        </section>
      </ScrollAnimation>

      {/* ── ABOUT + FOOTER ── */}
      <AboutAndFooter />
    </>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-white"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <p className="text-gray-500 text-base mt-2">{subtitle}</p>
      )}
    </div>
  );
}
