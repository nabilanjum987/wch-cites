'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';

interface PersonalityHeroProps {
  name: string;
  title: string;
  imageUrl?: string;
  // P9: credit/licence for locally stored, licence-recorded photos
  // (e.g. Wikimedia Commons). Rendered as a caption under the photo
  // when present; profiles without a photo render no image column
  // at all (see below) — never an empty placeholder block.
  imageCredit?: string;
  imageLicence?: string;
  birthDate?: string;
  deathDate?: string;
  nationality?: string;
  description: string;
}

export function PersonalityHero({
  name,
  title,
  imageUrl,
  imageCredit,
  imageLicence,
  birthDate,
  deathDate,
  nationality,
  description,
}: PersonalityHeroProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      animate="animate"
      className="mb-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
        {/* Image — P9: rendered ONLY when a photo exists. A profile
            without a photo gets no image column (and no placeholder):
            the content column spans the full width instead. */}
        {imageUrl && (
          <motion.div
            variants={ANIMATIONS.scaleIn}
            className="md:col-span-1"
          >
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl overflow-hidden border-2 border-orange-500/20"
              >
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-auto object-cover aspect-square"
                />
              </motion.div>
              {imageCredit && (
                <p className="mt-2 text-xs text-gray-400">
                  Photo: {imageCredit}{imageLicence ? ` · ${imageLicence}` : ''}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          variants={ANIMATIONS.scaleIn}
          className={imageUrl ? 'md:col-span-2 space-y-6' : 'md:col-span-3 space-y-6'}
        >
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">{name}</h1>
            <p className="text-2xl text-orange-400 font-semibold mb-4">{title}</p>
            <p className="text-gray-300 text-lg leading-relaxed">{description}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {nationality && (
              <GlassCard variant="default" className="p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Nationality</p>
                <p className="text-sm font-semibold text-white">{nationality}</p>
              </GlassCard>
            )}
            {birthDate && (
              <GlassCard variant="default" className="p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Birth</p>
                <p className="text-sm font-semibold text-white">{birthDate}</p>
              </GlassCard>
            )}
            {deathDate && (
              <GlassCard variant="default" className="p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Death</p>
                <p className="text-sm font-semibold text-white">{deathDate}</p>
              </GlassCard>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
