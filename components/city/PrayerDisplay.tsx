'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Clock, Moon, Sun } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

interface PrayerSectionProps {
  prayerTimes?: PrayerTime[];
  nextPrayer?: string;
}

export function PrayerSection({
  prayerTimes = [
    { name: 'Fajr', time: '04:45', icon: <Sun className="w-5 h-5" /> },
    { name: 'Zuhr', time: '12:15', icon: <Sun className="w-5 h-5" /> },
    { name: 'Asr', time: '15:45', icon: <Sun className="w-5 h-5" /> },
    { name: 'Maghrib', time: '18:20', icon: <Moon className="w-5 h-5" /> },
    { name: 'Isha', time: '19:50', icon: <Moon className="w-5 h-5" /> },
  ],
  nextPrayer = 'Zuhr in 2 hours',
}: PrayerSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Next Prayer Alert */}
      <motion.div variants={ANIMATIONS.scaleIn} className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <Clock className="w-8 h-8 text-purple-400" />
          <div>
            <p className="text-sm text-gray-400">Next Prayer</p>
            <p className="text-2xl font-bold text-purple-400">{nextPrayer}</p>
          </div>
        </div>
      </motion.div>

      {/* Prayer Times Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-5 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {prayerTimes.map((prayer, idx) => (
          <DataCard
            key={idx}
            icon={<div className="text-purple-400">{prayer.icon}</div>}
            title={prayer.name}
            value={prayer.time}
            glowColor="purple"
            variants={ANIMATIONS.scaleIn}
          />
        ))}
      </motion.div>

      {/* Prayer Information */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Prayer Guidelines</h3>
        <motion.div className="space-y-3" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[
            '📍 Qibla Direction: 297.5° (NW)',
            '⏱️ Prayer Duration: 10-15 minutes',
            '🧼 Ablution (Wudu): 5 minutes',
            '🤝 Congregation Times: 15 min before Iqamah',
          ].map((info, idx) => (
            <motion.p key={idx} variants={ANIMATIONS.slideUp} className="text-gray-300 flex items-start gap-3">
              <span className="mt-1">{info.charAt(0)}</span>
              <span>{info.slice(2)}</span>
            </motion.p>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
