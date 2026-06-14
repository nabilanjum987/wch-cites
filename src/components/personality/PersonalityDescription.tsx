'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS } from '@/lib/design-system';

interface PersonalityDescriptionProps {
  sections: Array<{
    title: string;
    content: string;
  }>;
}

export function PersonalityDescription({ sections }: PersonalityDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mb-12 space-y-4"
    >
      {sections.map((section, idx) => (
        <motion.div
          key={idx}
          variants={ANIMATIONS.scaleIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: idx * 0.1 }}
        >
          <GlassCard variant="default" className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">{section.title}</h3>
            <p className="text-gray-300 leading-relaxed text-lg">{section.content}</p>
          </GlassCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
