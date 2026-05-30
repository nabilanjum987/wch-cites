'use client';

import { motion } from 'framer-motion';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { ReactNode } from 'react';

interface CityPageThemeProps {
  theme: 'weather' | 'prayer' | 'rates' | 'news' | 'events' | 'sports' | 'economy' | 'places' | 'personalities';
  title: string;
  description: string;
  children: ReactNode;
}

const themeColors = {
  weather: { primary: '#06b6d4', secondary: 'from-cyan-500/20 to-blue-500/20', light: 'bg-cyan-500/10' },
  prayer: { primary: '#8b5cf6', secondary: 'from-purple-500/20 to-pink-500/20', light: 'bg-purple-500/10' },
  rates: { primary: '#f59e0b', secondary: 'from-amber-500/20 to-orange-500/20', light: 'bg-amber-500/10' },
  news: { primary: '#ef4444', secondary: 'from-red-500/20 to-pink-500/20', light: 'bg-red-500/10' },
  events: { primary: '#10b981', secondary: 'from-green-500/20 to-emerald-500/20', light: 'bg-green-500/10' },
  sports: { primary: '#3b82f6', secondary: 'from-blue-500/20 to-cyan-500/20', light: 'bg-blue-500/10' },
  economy: { primary: '#ec4899', secondary: 'from-pink-500/20 to-purple-500/20', light: 'bg-pink-500/10' },
  places: { primary: '#14b8a6', secondary: 'from-teal-500/20 to-cyan-500/20', light: 'bg-teal-500/10' },
  personalities: { primary: '#f97316', secondary: 'from-orange-500/20 to-red-500/20', light: 'bg-orange-500/10' },
};

export function CityPageTheme({ theme, title, description, children }: CityPageThemeProps) {
  const colors = themeColors[theme];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0a0f1e] to-[#030712]">
      {/* Animated Hero Section */}
      <motion.section
        className="relative px-4 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Gradient background orbs */}
        <motion.div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${colors.secondary} rounded-full filter blur-3xl`}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className={`absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br ${colors.secondary} rounded-full filter blur-3xl`}
          animate={{
            x: [0, -50, 50, 0],
            y: [0, 50, -50, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        {/* Content */}
        <div className="max-w-6xl mx-auto w-full z-10 relative">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="text-center mb-12"
          >
            {/* Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-4 leading-tight"
              style={{
                backgroundImage: `linear-gradient(to right, ${colors.primary}, #ffffff)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {title}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={ANIMATIONS.slideUp}
              className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {description}
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content Section */}
      <section className="relative px-4 py-12 z-10">
        <motion.div
          className="max-w-6xl mx-auto"
          variants={STAGGER_CONTAINER}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
        >
          {children}
        </motion.div>
      </section>
    </div>
  );
}
