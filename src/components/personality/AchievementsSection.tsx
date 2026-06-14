'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';

interface Achievement {
  icon: string;
  title: string;
  description: string;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  title?: string;
}

export function AchievementsSection({
  achievements,
  title = 'Major Achievements',
}: AchievementsSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="mb-12"
    >
      <motion.h2
        variants={ANIMATIONS.scaleIn}
        className="text-4xl font-bold text-white mb-8"
      >
        {title}
      </motion.h2>

      <motion.div
        variants={STAGGER_CONTAINER}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {achievements.map((achievement, idx) => (
          <motion.div
            key={idx}
            variants={ANIMATIONS.scaleIn}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GlassCard variant="premium" glowColor="orange" className="h-full p-6">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{achievement.title}</h3>
              <p className="text-gray-400 text-sm">{achievement.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
