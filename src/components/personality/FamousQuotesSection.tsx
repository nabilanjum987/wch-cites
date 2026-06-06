'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';

interface FamousQuote {
  text: string;
  context?: string;
}

interface FamousQuotesSectionProps {
  quotes: FamousQuote[];
  title?: string;
}

export function FamousQuotesSection({
  quotes,
  title = 'Famous Quotes',
}: FamousQuotesSectionProps) {
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {quotes.map((quote, idx) => (
          <motion.div
            key={idx}
            variants={ANIMATIONS.scaleIn}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <GlassCard variant="premium" glowColor="orange" className="p-6 h-full">
              <div className="flex flex-col h-full justify-between">
                <p className="text-2xl text-orange-300 mb-4 leading-relaxed">
                  "{quote.text}"
                </p>
                {quote.context && (
                  <p className="text-sm text-gray-400 border-t border-white/10 pt-4">
                    {quote.context}
                  </p>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
