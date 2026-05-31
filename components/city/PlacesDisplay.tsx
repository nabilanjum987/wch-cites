'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Landmark, MapPin, Star } from 'lucide-react';

interface Place {
  name: string;
  type: string;
  distance: string;
  rating: number;
  visitors: string;
}

interface PlacesSectionProps {
  places?: Place[];
}

export function PlacesSection({
  places = [
    { name: 'Ancient Temple', type: 'Historic Site', distance: '2.5 km', rating: 4.9, visitors: '50K+/month' },
    { name: 'Central Museum', type: 'Museum', distance: '1.2 km', rating: 4.7, visitors: '30K+/month' },
    { name: 'Riverside Park', type: 'Nature', distance: '0.8 km', rating: 4.6, visitors: '100K+/month' },
    { name: 'Grand Mosque', type: 'Religious', distance: '3.1 km', rating: 4.8, visitors: '200K+/month' },
  ],
}: PlacesSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Featured Places Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {places.map((place, idx) => (
          <GlassCard
            key={idx}
            variant="premium"
            glowColor="green"
            className="p-6 relative group overflow-hidden cursor-pointer"
            variants={ANIMATIONS.scaleIn}
            whileHover={{ scale: 1.02 }}
          >
            {/* Image placeholder with gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <motion.h3 className="text-lg font-bold text-white mb-1">{place.name}</motion.h3>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Landmark className="w-4 h-4" />
                    {place.type}
                  </p>
                </div>
                <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">📍</div>
              </div>

              <div className="space-y-2 mb-4 py-4 border-y border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Distance</span>
                  <span className="font-semibold text-teal-400">{place.distance}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Monthly Visitors</span>
                  <span className="font-semibold text-teal-400">{place.visitors}</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(place.rating) ? 'fill-teal-400 text-teal-400' : 'text-gray-500'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-teal-400">{place.rating}</span>
              </div>
            </div>

            {/* Hover overlay button */}
            <motion.button
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              whileHover={{ scale: 1.1 }}
            >
              <div className="px-4 py-2 bg-teal-500/80 backdrop-blur-sm rounded-lg font-semibold text-white">View Details</div>
            </motion.button>
          </GlassCard>
        ))}
      </motion.div>

      {/* Places by Category */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Browse by Category</h3>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[
            { emoji: '🏛️', name: 'Historic', count: 24 },
            { emoji: '🏞️', name: 'Nature', count: 18 },
            { emoji: '🛕', name: 'Religious', count: 12 },
            { emoji: '🎨', name: 'Cultural', count: 15 },
          ].map((cat, idx) => (
            <motion.button
              key={idx}
              variants={ANIMATIONS.scaleIn}
              className="p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:border-teal-400/50 hover:bg-white/15 transition-all text-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="font-semibold text-white text-sm">{cat.name}</p>
              <p className="text-xs text-gray-400">{cat.count} places</p>
            </motion.button>
          ))}
        </motion.div>
      </GlassCard>

      {/* Map & Nearby */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Around You</h3>
        <motion.div className="space-y-3" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[
            { dist: '0.5 km', name: 'Coffee Shop', type: 'Food & Beverage' },
            { dist: '1.2 km', name: 'Public Library', type: 'Education' },
            { dist: '2.1 km', name: 'Hospital', type: 'Healthcare' },
          ].map((place, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.slideUp} className="flex items-center gap-4 p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
              <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-white">{place.name}</p>
                <p className="text-xs text-gray-400">{place.type}</p>
              </div>
              <span className="text-sm font-semibold text-teal-400">{place.dist}</span>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
