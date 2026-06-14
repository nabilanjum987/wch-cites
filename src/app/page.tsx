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
      {/* Hero Section with Aurora Background */}
      <AuroraBackground>
        <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20">
          {/* Animated background elements */}
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
                className="text-xl md:text-2xl mb-12"
                style={{ color: COLORS.textSecondary }}
              >
                Explore the world's cities with real-time data, cultural insights, and global connections
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

              {/* Animated Stats */}
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                <AnimatedCounter
                  label="Cities"
                  value={10247}
                  icon={<Globe className="w-6 h-6 text-indigo-400" />}
                />
                <AnimatedCounter
                  label="Countries"
                  value={195}
                  icon={<Users className="w-6 h-6 text-cyan-400" />}
                />
                <AnimatedCounter
                  label="Prayer Times"
                  value={5}
                  icon={<Clock className="w-6 h-6 text-purple-400" />}
                />
                <AnimatedCounter
                  label="Live Updates"
                  value={24}
                  suffix="/7"
                  icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              className="w-6 h-6 mx-auto"
              style={{ color: COLORS.accent }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </section>
      </AuroraBackground>

      {/* Ticker Bar */}
      <motion.section
        className="sticky top-16 z-40"
        style={{
          backgroundColor: `rgba(10, 15, 30, 0.95)`,
          borderBottom: `1px solid ${COLORS.border}`,
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <TickerBar />
      </motion.section>

      {/* Live Global Stats */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}ee` }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Global Insights
            </motion.h2>
            <LiveGlobalStats />
          </div>
        </section>
      </ScrollAnimation>

      {/* Featured Cities Grid */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Featured Cities
            </motion.h2>
            <FeaturedCitiesGrid />
          </div>
        </section>
      </ScrollAnimation>

      {/* Live Prayer Times Strip */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ color: COLORS.text }}
            >
              Prayer Times Around the World
            </motion.h2>
            <LivePrayerTimesStrip />
          </div>
        </section>
      </ScrollAnimation>

      {/* Global Market Snapshot */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Global Market Snapshot
            </motion.h2>
            <GlobalMarketSnapshot />
          </div>
        </section>
      </ScrollAnimation>

      {/* Featured Wonders */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              World Wonders
            </motion.h2>
            <FeaturedWonders />
          </div>
        </section>
      </ScrollAnimation>

      {/* Explore by Continent */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Explore by Continent
            </motion.h2>
            <ExploreByContinent />
          </div>
        </section>
      </ScrollAnimation>

      {/* Explore by Religion */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Cities by Religion & Faith
            </motion.h2>
            <ExploreByReligion />
          </div>
        </section>
      </ScrollAnimation>

      {/* Oceans Today */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: COLORS.background }}>
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-12"
              style={{ color: COLORS.text }}
            >
              Oceans Today
            </motion.h2>
            <OceansToday />
          </div>
        </section>
      </ScrollAnimation>

      {/* Did You Know */}
      <ScrollAnimation>
        <section className="py-16 px-4" style={{ backgroundColor: `${COLORS.background}cc` }}>
          <div className="max-w-6xl mx-auto">
            <DidYouKnow />
          </div>
        </section>
      </ScrollAnimation>
    </>
  );
}
