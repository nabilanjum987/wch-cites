'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Cloud, Wind, Droplets, Eye } from 'lucide-react';

interface WeatherSectionProps {
  temperature?: number;
  condition?: string;
  humidity?: number;
  windSpeed?: number;
  visibility?: number;
}

export function WeatherSection({
  temperature = 28,
  condition = 'Partly Cloudy',
  humidity = 65,
  windSpeed = 12,
  visibility = 10,
}: WeatherSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Main Weather Card */}
      <GlassCard variant="premium" glowColor="cyan" className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.div variants={ANIMATIONS.scaleIn} className="text-6xl font-bold text-cyan-400 mb-2">
              {temperature}°C
            </motion.div>
            <p className="text-xl text-gray-300">{condition}</p>
          </div>
          <Cloud className="w-20 h-20 text-cyan-400" />
        </div>
        <p className="text-sm text-gray-400">Updated 2 minutes ago</p>
      </GlassCard>

      {/* Weather Details Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        <DataCard
          icon={<Droplets className="w-6 h-6 text-cyan-400" />}
          title="Humidity"
          value={`${humidity}%`}
          glowColor="cyan"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Wind className="w-6 h-6 text-cyan-400" />}
          title="Wind Speed"
          value={`${windSpeed} km/h`}
          glowColor="cyan"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Eye className="w-6 h-6 text-cyan-400" />}
          title="Visibility"
          value={`${visibility} km`}
          glowColor="cyan"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Cloud className="w-6 h-6 text-cyan-400" />}
          title="Condition"
          value="Stable"
          glowColor="cyan"
          variants={ANIMATIONS.scaleIn}
        />
      </motion.div>

      {/* Weekly Forecast */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
        <motion.div className="grid grid-cols-7 gap-2" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[...Array(7)].map((_, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.scaleIn} className="text-center backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">Day {idx + 1}</p>
              <div className="text-2xl mb-2">🌤️</div>
              <p className="text-sm font-semibold text-cyan-400">25°</p>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
