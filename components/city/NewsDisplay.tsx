'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Newspaper, AlertCircle, Clock } from 'lucide-react';

interface NewsItem {
  title: string;
  time: string;
  category: string;
  urgency: 'critical' | 'high' | 'normal';
}

interface NewsSectionProps {
  news?: NewsItem[];
}

export function NewsSection({
  news = [
    { title: 'Major Infrastructure Project Approved', time: '30 mins ago', category: 'Development', urgency: 'high' },
    { title: 'Weather Alert: Thunderstorm Expected', time: '1 hour ago', category: 'Weather', urgency: 'critical' },
    { title: 'Local Sports Team Wins Championship', time: '2 hours ago', category: 'Sports', urgency: 'normal' },
  ],
}: NewsSectionProps) {
  const urgencyColors = {
    critical: 'from-red-500/20 to-pink-500/20 border-red-400/30',
    high: 'from-orange-500/20 to-red-500/20 border-orange-400/30',
    normal: 'from-red-500/20 to-red-500/20 border-red-400/20',
  };

  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Breaking News Banner */}
      <motion.div variants={ANIMATIONS.scaleIn} className="backdrop-blur-xl bg-gradient-to-r from-red-500/30 to-pink-500/20 border border-red-400/40 rounded-2xl p-6 overflow-hidden relative">
        <motion.div
          className="absolute -top-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500"
          animate={{
            width: ['0%', '100%', '0%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="flex items-center gap-4 mt-2">
          <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Breaking News</p>
            <p className="text-lg font-bold text-red-300 line-clamp-2">{news[0].title}</p>
          </div>
        </div>
      </motion.div>

      {/* News Feed */}
      <motion.div className="space-y-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {news.map((item, idx) => (
          <GlassCard
            key={idx}
            className={`p-6 backdrop-blur-xl bg-gradient-to-br ${urgencyColors[item.urgency]} border`}
            glowColor="red"
            variants={ANIMATIONS.scaleIn}
            hoverEffect={true}
          >
            <div className="flex gap-4">
              <Newspaper className={`w-6 h-6 flex-shrink-0 ${item.urgency === 'critical' ? 'text-red-400' : item.urgency === 'high' ? 'text-orange-400' : 'text-red-300'}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white flex-1 line-clamp-2">{item.title}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${item.urgency === 'critical' ? 'bg-red-500/30 text-red-300' : item.urgency === 'high' ? 'bg-orange-500/30 text-orange-300' : 'bg-gray-500/30 text-gray-300'}`}>
                    {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{item.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* News Archive */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Categories</h3>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {['Breaking News', 'Local', 'National', 'International'].map((cat, idx) => (
            <motion.button
              key={idx}
              variants={ANIMATIONS.scaleIn}
              className="p-3 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:bg-white/15 transition-all text-sm font-semibold text-gray-300 hover:text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
