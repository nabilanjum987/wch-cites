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
  ScrollAnimation,
} from '@/components/shared/AnimatedComponents';
import { COLORS, ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
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
      <div className="min-h-screen bg-[#030712] relative overflow-hidden">
        {/* Aurora Background - 3 Colored Orbs */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          {/* Purple to Blue Orb */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full filter blur-3xl"
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -100, 50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: 0.15 }}
          />
          {/* Cyan to Blue Orb */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full filter blur-3xl"
            animate={{
              x: [0, -100, 50, 0],
              y: [0, 100, -50, 0],
            }}
            transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ opacity: 0.15 }}
          />
          {/* Pink to Purple Orb */}
          <motion.div
            className="absolute top-1/2 right-1/3 w-96 h-96 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full filter blur-3xl"
            animate={{
              x: [0, 50, -100, 0],
              y: [0, -50, 100, 0],
            }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            style={{ opacity: 0.15 }}
          />
        </div>

        {/* Content */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 z-10">
          <div className="max-w-5xl mx-auto w-full">
            {/* Animated Hero Title - Word by Word */}
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="text-center mb-8"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                {['Explore', 'The', 'World', "Like", 'Never', 'Before'].map((word, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15, duration: 0.5 }}
                    className="inline-block mr-3 md:mr-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Discover real-time data, cultural insights, and live updates from 10,000+ cities around the world
            </motion.p>

            {/* Search Bar with Glassmorphism & Border Glow */}
            <motion.div
              className="mb-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl p-1 focus-within:border-cyan-400/50 focus-within:shadow-lg focus-within:shadow-cyan-500/20 transition-all duration-300">
                <SearchBar onCitySelect={handleCitySelect} />
              </div>
            </motion.div>

            {/* Stats Counter Cards - Animate on Scroll */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12"
              variants={STAGGER_CONTAINER}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
            >
              {[
                { icon: Globe, label: 'Cities', value: '10,247' },
                { icon: Users, label: 'Communities', value: '5M+' },
                { icon: Clock, label: 'Real-time', value: 'Data' },
                { icon: TrendingUp, label: 'Insights', value: '24/7' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  variants={ANIMATIONS.scaleIn}
                  className="group backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl p-6 hover:bg-white/12 hover:border-white/30 transition-all duration-300"
                >
                  <stat.icon className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </section>
      </div>

      {/* STEP 5: Features Marquee Ticker */}
      <div className="w-full overflow-hidden py-3 border-y border-[#6366f1]/15" style={{background:'rgba(99,102,241,0.05)'}}>
        <div style={{display:'flex',width:'max-content',animation:'tickerScroll 35s linear infinite'}}>
          {[...Array(2)].map((_,i)=>(
            <div key={i} className="flex items-center whitespace-nowrap">
              {['🌍 10,247 Cities','☪️ Prayer Times','💰 Gold & Crypto','📰 Live News','⚽ Sports','🌤️ Weather','🕌 Qibla','🏺 Heritage','🌊 Oceans','🏆 Wonders','👤 Personalities','📅 Events','💊 Emergency','📊 Economy','🎭 Culture'].map((item,j)=>(
                <span key={j} className="text-sm text-slate-300 px-6">{item} <span className="text-[#6366f1]/40 ml-4">◆</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 6: Trust Badges */}
      <div className="flex flex-wrap justify-center gap-3 py-4 bg-[#030712]/50">
        {['🔒 Free Forever','⚡ Real-time Data','🌍 40,000+ Cities Coming','📱 Works on All Devices'].map((badge,i)=>(
          <span key={i} className="text-xs text-slate-300 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">{badge}</span>
        ))}
      </div>

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

      {/* SECTION 1: Live World News */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: COLORS.background }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            📰 World News Today
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: 'World', title: 'UN Climate Summit 2026 Opens in Geneva', source: 'Reuters', time: '2h ago', color: '#6366f1' },
              { category: 'Business', title: 'Gold hits new high amid global uncertainty', source: 'Bloomberg', time: '1h ago', color: '#f59e0b' },
              { category: 'Sports', title: 'PSL 2026: Lahore Qalandars win thriller', source: 'ESPN', time: '30m ago', color: '#10b981' },
              { category: 'Tech', title: 'OpenAI releases new model surpassing all benchmarks', source: 'TechCrunch', time: '3h ago', color: '#06b6d4' },
              { category: 'Health', title: 'WHO declares dengue emergency in South Asia', source: 'WHO', time: '5h ago', color: '#f43f5e' },
              { category: 'Culture', title: 'Lahore Literary Festival draws record crowds', source: 'Dawn', time: '4h ago', color: '#8b5cf6' },
            ].map((news, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: news.color + '30', borderLeft: `3px solid ${news.color}` }}
                  >
                    {news.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all">
                  {news.title}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{news.source}</span>
                  <span className="text-gray-500">{news.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/news"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              View all news →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 2: Sports Scores Today */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: `${COLORS.background}cc` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            ⚽ Live Sports Today
          </motion.h2>
          
          {/* Cricket Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">🏏 Cricket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { team1: 'PAK', score1: '287/6', overs1: '48.2', team2: 'IND', score2: '245/8', overs2: '45.0', status: 'LIVE' },
                { team1: 'ENG', score1: '312', overs1: 'All Out', team2: 'AUS', score2: '198/4', overs2: '38.1', status: 'LIVE' },
              ].map((match, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-indigo-400/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-white">{match.team1}</div>
                      <div className="text-lg text-indigo-400">{match.score1}</div>
                      <div className="text-xs text-gray-500">({match.overs1})</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500 mx-3">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-xs font-bold text-red-400"
                      >
                        {match.status}
                      </motion.div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-white">{match.team2}</div>
                      <div className="text-lg text-cyan-400">{match.score2}</div>
                      <div className="text-xs text-gray-500">({match.overs2})</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Football Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-indigo-400 mb-4">⚽ Football</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { team1: 'Real Madrid', score1: 2, team2: 'Barcelona', score2: 1, status: 'FT' },
                { team1: 'Man City', score1: 3, team2: 'Arsenal', score2: 0, status: 'FT' },
              ].map((match, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-indigo-400/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                      <div className="font-bold text-white">{match.team1}</div>
                    </div>
                    <div className="px-4 py-2 mx-3">
                      <div className="text-3xl font-bold text-indigo-400">{match.score1}</div>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-gray-500/20 border border-gray-500">
                      <div className="text-xs font-bold text-gray-300">{match.status}</div>
                    </div>
                    <div className="px-4 py-2 mx-3">
                      <div className="text-3xl font-bold text-cyan-400">{match.score2}</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="font-bold text-white">{match.team2}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/sports"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              View all sports →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 3: Today's Events Worldwide */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: COLORS.background }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            📅 Events Around the World Today
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { city: 'Lahore', country: 'Pakistan', event: 'Basant Festival', type: 'Cultural', flag: '🇵🇰' },
              { city: 'Dubai', country: 'UAE', event: 'Dubai Food Festival', type: 'Food', flag: '🇦🇪' },
              { city: 'Istanbul', country: 'Turkey', event: 'International Film Festival', type: 'Arts', flag: '🇹🇷' },
              { city: 'Tokyo', country: 'Japan', event: 'Cherry Blossom Festival', type: 'Nature', flag: '🇯🇵' },
              { city: 'London', country: 'UK', event: 'Notting Hill Carnival', type: 'Cultural', flag: '🇬🇧' },
              { city: 'Cairo', country: 'Egypt', event: 'Ramadan Night Market', type: 'Religious', flag: '🇪🇬' },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-indigo-400/50 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{event.flag}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/40">
                    {event.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{event.event}</h3>
                <p className="text-sm text-gray-400">{event.city}, {event.country}</p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/events"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              View all events →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 4: Gold Rates by Country */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: `${COLORS.background}cc` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            🥇 Gold Rates Today
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { country: 'Pakistan', rate: 'PKR 22,450/g', flag: '🇵🇰' },
              { country: 'UAE', rate: 'AED 285/g', flag: '🇦🇪' },
              { country: 'Saudi Arabia', rate: 'SAR 285/g', flag: '🇸🇦' },
              { country: 'UK', rate: '£62/g', flag: '🇬🇧' },
              { country: 'India', rate: '₹6,250/g', flag: '🇮🇳' },
              { country: 'USA', rate: '$76/g', flag: '🇺🇸' },
              { country: 'Turkey', rate: '₺2,450/g', flag: '🇹🇷' },
              { country: 'Egypt', rate: 'EGP 2,350/g', flag: '🇪🇬' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-indigo-400/50 transition-all text-center"
              >
                <span className="text-3xl block mb-2">{item.flag}</span>
                <p className="text-sm text-gray-400 mb-2">{item.country}</p>
                <p className="text-xl font-bold text-indigo-400">24K</p>
                <p className="text-lg font-semibold text-white">{item.rate}</p>
              </motion.div>
            ))}
          </div>

          {/* Zakat Nisab */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-400/50 rounded-2xl p-8 text-center"
          >
            <p className="text-sm text-gray-400 mb-2">Zakat Nisab (Gold Standard)</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              PKR 1,908,250
            </p>
            <p className="text-sm text-gray-400 mt-2">(85g gold)</p>
          </motion.div>

          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/rates"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              View all rates →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 5: Famous Personalities */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: COLORS.background }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            👤 Famous People From Around the World
          </motion.h2>
          <div className="flex overflow-x-auto pb-4 gap-6 scrollbar-hide">
            {[
              { name: 'Imran Khan', city: 'Lahore', country: 'Pakistan', field: 'Politics/Cricket', flag: '🇵🇰' },
              { name: 'Rumi', city: 'Balkh', country: 'Afghanistan', field: 'Poetry/Philosophy', flag: '🇦🇫' },
              { name: 'Ibn Battuta', city: 'Tangier', country: 'Morocco', field: 'Explorer', flag: '🇲🇦' },
              { name: 'Malala Yousafzai', city: 'Mingora', country: 'Pakistan', field: 'Education Activist', flag: '🇵🇰' },
              { name: 'Aristotle', city: 'Stagira', country: 'Greece', field: 'Philosophy', flag: '🇬🇷' },
              { name: 'Ibn Sina', city: 'Bukhara', country: 'Uzbekistan', field: 'Medicine/Philosophy', flag: '🇺🇿' },
              { name: 'Confucius', city: 'Qufu', country: 'China', field: 'Philosophy', flag: '🇨🇳' },
              { name: 'Einstein', city: 'Ulm', country: 'Germany', field: 'Physics', flag: '🇩🇪' },
            ].map((person, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 w-64 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 hover:border-indigo-400/50 transition-all group cursor-pointer"
              >
                <span className="text-5xl block text-center mb-4">{person.flag}</span>
                <h3 className="text-lg font-bold text-white text-center mb-2">{person.name}</h3>
                <p className="text-sm text-gray-400 text-center mb-3">{person.city}</p>
                <span className="block px-3 py-1 rounded-full text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 text-center">
                  {person.field}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/personalities"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Explore personalities →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 6: Heritage Products */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: `${COLORS.background}cc` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            🏺 Heritage Products by Region
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { product: 'Blue Pottery', city: 'Lahore', country: 'Pakistan', flag: '🇵🇰', color: '#1e40af' },
              { product: 'Persian Carpet', city: 'Isfahan', country: 'Iran', flag: '🇮🇷', color: '#dc2626' },
              { product: 'Turkish Kilim', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷', color: '#d97706' },
              { product: 'Indian Silk', city: 'Varanasi', country: 'India', flag: '🇮🇳', color: '#7c3aed' },
              { product: 'Egyptian Cotton', city: 'Cairo', country: 'Egypt', flag: '🇪🇬', color: '#059669' },
              { product: 'Japanese Pottery', city: 'Kyoto', country: 'Japan', flag: '🇯🇵', color: '#db2777' },
              { product: 'Chinese Porcelain', city: 'Jingdezhen', country: 'China', flag: '🇨🇳', color: '#0891b2' },
              { product: 'Moroccan Leather', city: 'Fez', country: 'Morocco', flag: '🇲🇦', color: '#b45309' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="backdrop-blur-xl border-2 rounded-2xl p-6 hover:scale-105 transition-all group cursor-pointer"
                style={{
                  backgroundColor: item.color + '15',
                  borderColor: item.color + '60',
                }}
              >
                <span className="text-4xl block text-center mb-4">{item.flag}</span>
                <h3 className="text-lg font-bold text-white text-center mb-2">{item.product}</h3>
                <p className="text-sm text-gray-400 text-center">{item.city}, {item.country}</p>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Explore products →
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 7: City Comparison */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: COLORS.background }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            🆚 Compare Any Two Cities
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="backdrop-blur-xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border-2 border-indigo-400/50 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Lahore 🇵🇰</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Population</p>
                    <p className="text-lg font-semibold text-indigo-300">12.6 Million</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Weather</p>
                    <p className="text-lg font-semibold text-indigo-300">34°C Sunny</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Religion</p>
                    <p className="text-lg font-semibold text-indigo-300">96% Muslim</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Gold Rate</p>
                    <p className="text-lg font-semibold text-indigo-300">PKR 22,450/g</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Language</p>
                    <p className="text-lg font-semibold text-indigo-300">Urdu, English</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Dubai 🇦🇪</h3>
                <div className="space-y-3">
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Population</p>
                    <p className="text-lg font-semibold text-cyan-300">3.6 Million</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Weather</p>
                    <p className="text-lg font-semibold text-cyan-300">38°C Sunny</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Religion</p>
                    <p className="text-lg font-semibold text-cyan-300">76% Muslim</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Gold Rate</p>
                    <p className="text-lg font-semibold text-cyan-300">AED 285/g</p>
                  </div>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Language</p>
                    <p className="text-lg font-semibold text-cyan-300">Arabic, English</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="/compare"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-10 py-4 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
              >
                Compare Cities →
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* SECTION 8: World Population Snapshot */}
      <motion.section 
        className="py-16 px-4" 
        style={{ backgroundColor: `${COLORS.background}cc` }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-12 text-white"
          >
            🌍 World at a Glance
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌍', number: '8.1B', label: 'World Population', color: '#6366f1' },
              { icon: '☪️', number: '1.9B', label: 'Muslims (24%)', color: '#10b981' },
              { icon: '✝️', number: '2.4B', label: 'Christians (31%)', color: '#f59e0b' },
              { icon: '🏙️', number: '4.4B', label: 'Urban Dwellers (55%)', color: '#06b6d4' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 text-center hover:border-white/40 transition-all"
              >
                <span className="text-5xl block mb-4">{stat.icon}</span>
                <p className="text-4xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.number}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
}
