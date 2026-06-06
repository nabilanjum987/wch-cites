'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';

interface FamousWork {
  title: string;
  year?: string;
  description: string;
  type?: string;
}

interface FamousWorksSectionProps {
  works: FamousWork[];
  title?: string;
}

export function FamousWorksSection({
  works,
  title = 'Famous Works',
}: FamousWorksSectionProps) {
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
        className="space-y-4"
      >
        {works.map((work, idx) => (
          <motion.div
            key={idx}
            variants={ANIMATIONS.scaleIn}
            whileHover={{ x: 4 }}
          >
            <GlassCard variant="default" className="p-6 cursor-pointer transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-xl font-bold text-white">{work.title}</h4>
                    {work.type && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                        {work.type}
                      </span>
                    )}
                  </div>
                  {work.year && (
                    <p className="text-sm text-gray-500 mb-2">{work.year}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-sm">{work.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
