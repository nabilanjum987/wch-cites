'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

interface Event {
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  rating: number;
}

interface EventsSectionProps {
  events?: Event[];
}

export function EventsSection({
  events = [
    { name: 'City Festival 2024', date: 'Dec 15', time: '18:00', location: 'Central Park', attendees: 5000, rating: 4.8 },
    { name: 'Tech Conference', date: 'Dec 18', time: '09:00', location: 'Convention Center', attendees: 2000, rating: 4.6 },
    { name: 'Food Fest', date: 'Dec 22', time: '12:00', location: 'Downtown Plaza', attendees: 3000, rating: 4.9 },
  ],
}: EventsSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* Upcoming Events */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        {events.map((event, idx) => (
          <GlassCard
            key={idx}
            variant="premium"
            glowColor="green"
            className="p-6 relative group overflow-hidden"
            variants={ANIMATIONS.scaleIn}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />

            <div className="relative z-10">
              <motion.h3 className="text-lg font-bold text-white mb-4">{event.name}</motion.h3>

              <motion.div className="space-y-3 mb-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
                <div className="flex items-center gap-2 text-gray-300">
                  <Calendar className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{event.date} at {event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{event.attendees.toLocaleString()} attending</span>
                </div>
              </motion.div>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(event.rating) ? 'fill-green-400 text-green-400' : 'text-gray-500'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-green-400">{event.rating}</span>
              </div>

              {/* CTA Button */}
              <motion.button
                className="w-full mt-4 py-2 bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 rounded-lg text-green-400 font-semibold text-sm hover:bg-green-500/40 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </div>
          </GlassCard>
        ))}
      </motion.div>

      {/* Events Calendar */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Events This Month</h3>
        <motion.div className="grid grid-cols-7 gap-2 mb-4" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
            <div key={idx} className="text-center text-xs font-semibold text-gray-400">
              {day}
            </div>
          ))}
        </motion.div>
        <motion.div className="grid grid-cols-7 gap-2" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[...Array(35)].map((_, idx) => {
            const hasEvent = idx === 14 || idx === 17 || idx === 21;
            return (
              <motion.div
                key={idx}
                variants={ANIMATIONS.scaleIn}
                className={`p-2 rounded text-sm text-center cursor-pointer transition-all ${
                  hasEvent
                    ? 'bg-gradient-to-br from-green-500/30 to-emerald-500/30 border border-green-400/50 text-green-300 font-semibold'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {(idx % 7) + 1}
              </motion.div>
            );
          })}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
