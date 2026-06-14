'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface LifeTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

export function LifeTimeline({ events, title = 'Life Timeline' }: LifeTimelineProps) {
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

      <div className="relative space-y-6">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-transparent" />

        {events.map((event, idx) => (
          <motion.div
            key={idx}
            variants={ANIMATIONS.scaleIn}
            className="relative pl-20"
          >
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center border-4 border-[#030712]">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>

            <GlassCard variant="premium" glowColor="orange" className="p-6">
              <p className="text-orange-400 font-bold text-lg mb-2">{event.year}</p>
              <h4 className="text-white font-bold text-lg mb-2">{event.title}</h4>
              <p className="text-gray-400 text-sm">{event.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
