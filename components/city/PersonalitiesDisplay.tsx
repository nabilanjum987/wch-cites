'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { User, Award, BookOpen, Globe } from 'lucide-react';

interface Personality {
  name: string;
  title: string;
  achievements: number;
  field: string;
  bio: string;
}

interface PersonalitiesSectionProps {
  personalities?: Personality[];
}

export function PersonalitiesSection({
  personalities = [
    {
      name: 'Dr. Ahmed Khan',
      title: 'Nobel Prize Winner',
      achievements: 45,
      field: 'Physics',
      bio: 'Revolutionary contributions to quantum mechanics',
    },
    {
      name: 'Fatima Al-Rashid',
      title: 'Tech Entrepreneur',
      achievements: 12,
      field: 'Technology',
      bio: 'Founded 3 billion-dollar tech startups',
    },
    {
      name: 'Hassan Al-Maktoum',
      title: 'Cultural Icon',
      achievements: 28,
      field: 'Arts & Culture',
      bio: 'Preserved and promoted heritage for 30 years',
    },
    {
      name: 'Leila Ibrahim',
      title: 'Medical Pioneer',
      achievements: 52,
      field: 'Medicine',
      bio: 'Developed life-saving surgical techniques',
    },
  ],
}: PersonalitiesSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Famous Personalities Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {personalities.map((person, idx) => (
          <GlassCard
            key={idx}
            variant="premium"
            glowColor="amber"
            className="p-6 relative group overflow-hidden"
            variants={ANIMATIONS.scaleIn}
          >
            {/* Avatar placeholder */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-yellow-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/30 to-yellow-500/20 flex items-center justify-center text-2xl font-bold text-orange-400 flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {person.name.charAt(0)}
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{person.name}</h3>
                  <p className="text-sm text-orange-400 font-semibold">{person.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{person.field}</p>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 leading-relaxed">{person.bio}</p>

              {/* Achievements Badge */}
              <motion.div
                className="flex items-center gap-2 pt-4 border-t border-white/10"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Award className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-semibold text-orange-400">{person.achievements} Achievements</span>
              </motion.div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Field of Expertise */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Fields of Excellence</h3>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[
            { icon: '🔬', name: 'Science', count: 18 },
            { icon: '💼', name: 'Business', count: 12 },
            { icon: '🏥', name: 'Medicine', count: 8 },
            { icon: '🎨', name: 'Arts', count: 14 },
          ].map((field, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.scaleIn} className="p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-center hover:border-orange-400/50 transition-all">
              <div className="text-3xl mb-2">{field.icon}</div>
              <p className="font-semibold text-white text-sm mb-1">{field.name}</p>
              <p className="text-xs text-gray-400">{field.count} personalities</p>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>

      {/* Notable Achievements Timeline */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-6">Historical Milestones</h3>
        <motion.div className="space-y-4 relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/0 via-orange-500/50 to-orange-500/0"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          />

          {[
            { year: 2020, event: 'International Recognition' },
            { year: 2018, event: 'Major Discovery/Innovation' },
            { year: 2015, event: 'Leadership Milestone' },
            { year: 2012, event: 'Career Beginning' },
          ].map((milestone, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.slideUp} className="flex gap-4 relative">
              {/* Timeline dot */}
              <motion.div
                className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center flex-shrink-0 mt-1 z-10"
                whileHover={{ scale: 1.2 }}
              >
                <div className="w-3 h-3 rounded-full bg-white" />
              </motion.div>

              <div className="py-1">
                <p className="font-bold text-orange-400 text-sm">{milestone.year}</p>
                <p className="text-gray-300 text-sm">{milestone.event}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>

      {/* Call to Action */}
      <motion.div variants={ANIMATIONS.scaleIn} className="backdrop-blur-xl bg-gradient-to-r from-orange-500/20 to-yellow-500/10 border border-orange-400/30 rounded-2xl p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">Meet Our Community Legends</h3>
        <p className="text-gray-300 mb-4">Discover inspiring stories from individuals who shaped our city's destiny</p>
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-orange-500/60 to-yellow-500/40 border border-orange-400/50 rounded-lg text-white font-semibold hover:from-orange-500/80 hover:to-yellow-500/60 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore More
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
