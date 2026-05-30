'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { TrendingUp, BarChart3, PieChart, Zap } from 'lucide-react';

interface EconomySector {
  name: string;
  gdp: number;
  growth: number;
  employment: number;
}

interface EconomySectionProps {
  sectors?: EconomySector[];
}

export function EconomySection({
  sectors = [
    { name: 'Technology', gdp: 450, growth: 12.5, employment: 28000 },
    { name: 'Manufacturing', gdp: 380, growth: 5.2, employment: 45000 },
    { name: 'Retail & Commerce', gdp: 320, growth: 8.3, employment: 52000 },
    { name: 'Services', gdp: 290, growth: 7.1, employment: 38000 },
  ],
}: EconomySectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Economic Overview */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        <DataCard
          icon={<BarChart3 className="w-6 h-6 text-pink-400" />}
          title="GDP"
          value="$1.44T"
          subtitle="Annual Growth"
          glowColor="pink"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<TrendingUp className="w-6 h-6 text-pink-400" />}
          title="Growth Rate"
          value="8.3%"
          subtitle="YoY"
          glowColor="pink"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Zap className="w-6 h-6 text-pink-400" />}
          title="Employment"
          value="163K+"
          subtitle="Total Jobs"
          glowColor="pink"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<PieChart className="w-6 h-6 text-pink-400" />}
          title="Market Cap"
          value="$2.8B"
          subtitle="Private Sector"
          glowColor="pink"
          variants={ANIMATIONS.scaleIn}
        />
      </motion.div>

      {/* Sector Breakdown */}
      <GlassCard variant="premium" glowColor="pink" className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Economic Sectors</h3>
        <motion.div className="space-y-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {sectors.map((sector, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.slideUp} className="p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-semibold text-white">{sector.name}</h4>
                <span className="text-sm px-3 py-1 bg-pink-500/30 text-pink-300 rounded-full font-semibold">+{sector.growth}%</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">GDP Contribution</p>
                  <motion.p
                    className="text-2xl font-bold text-pink-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    ${sector.gdp}B
                  </motion.p>
                </div>
                <div>
                  <p className="text-gray-400">Growth Rate</p>
                  <p className="text-2xl font-bold text-pink-400">{sector.growth}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Employment</p>
                  <p className="text-2xl font-bold text-pink-400">{sector.employment.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(sector.gdp / 450) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>

      {/* Market Trends */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Market Trends</h3>
        <motion.div className="flex items-end gap-1 h-32" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[...Array(24)].map((_, idx) => (
            <motion.div
              key={idx}
              className="flex-1 bg-gradient-to-t from-pink-500 to-pink-400 rounded-t opacity-70 hover:opacity-100 transition-opacity cursor-pointer group relative"
              variants={ANIMATIONS.slideUp}
              style={{
                height: `${30 + Math.sin(idx * 0.5) * 40}%`,
                minHeight: '4px',
              }}
              whileHover={{ scaleY: 1.1 }}
            >
              <motion.div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {100 + idx}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
