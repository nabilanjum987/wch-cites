'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface RateData {
  metal: string;
  price: number;
  change: number;
  trend: 'up' | 'down';
}

interface RatesSectionProps {
  rates?: RateData[];
}

export function RatesSection({
  rates = [
    { metal: 'Gold (1g)', price: 8500, change: 2.5, trend: 'up' as const },
    { metal: 'Silver (1g)', price: 850, change: -1.2, trend: 'down' as const },
    { metal: 'Platinum (1g)', price: 4200, change: 0.8, trend: 'up' as const },
    { metal: 'Palladium (1g)', price: 3200, change: -2.1, trend: 'down' as const },
  ],
}: RatesSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Rates Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {rates.map((rate, idx) => (
          <GlassCard key={idx} variant="premium" glowColor="amber" className="p-6 relative overflow-hidden" variants={ANIMATIONS.scaleIn}>
            {/* Background gradient based on trend */}
            <motion.div
              className={`absolute inset-0 ${rate.trend === 'up' ? 'bg-gradient-to-br from-amber-500/5 to-transparent' : 'bg-gradient-to-br from-red-500/5 to-transparent'}`}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">{rate.metal}</h3>
                {rate.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-green-400" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-400" />
                )}
              </div>

              <div className="mb-4">
                <motion.div
                  className="text-3xl font-bold text-amber-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  PKR {rate.price.toLocaleString()}
                </motion.div>
              </div>

              <div className={`text-sm font-semibold ${rate.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                {rate.trend === 'up' ? '+' : ''}{rate.change}%
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Rate Information */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Market Information</h3>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          <div variants={ANIMATIONS.slideUp}>
            <p className="text-sm text-gray-400 mb-2">Market Status</p>
            <p className="text-lg font-semibold text-amber-400">Open</p>
          </div>
          <div variants={ANIMATIONS.slideUp}>
            <p className="text-sm text-gray-400 mb-2">Last Updated</p>
            <p className="text-lg font-semibold text-amber-400">2 mins ago</p>
          </div>
          <div variants={ANIMATIONS.slideUp}>
            <p className="text-sm text-gray-400 mb-2">Trading Volume</p>
            <p className="text-lg font-semibold text-amber-400">High</p>
          </div>
        </motion.div>
      </GlassCard>

      {/* Historical Chart Placeholder */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">30-Day Trend</h3>
        <motion.div className="flex items-end gap-1 h-32" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[...Array(30)].map((_, idx) => (
            <motion.div
              key={idx}
              className="flex-1 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"
              variants={ANIMATIONS.slideUp}
              style={{
                height: `${Math.random() * 100}%`,
                minHeight: '4px',
              }}
            />
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
