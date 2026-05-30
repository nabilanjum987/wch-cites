'use client';

import { motion } from 'framer-motion';
import { GlassCard, DataCard } from '@/components/ui/GlassCard';
import { ANIMATIONS, STAGGER_CONTAINER } from '@/lib/design-system';
import { Trophy, Users, Zap } from 'lucide-react';

interface SportsTeam {
  name: string;
  wins: number;
  losses: number;
  points: number;
  position: number;
}

interface SportsSectionProps {
  teams?: SportsTeam[];
  sport?: string;
}

export function SportsSection({
  teams = [
    { name: 'City United', wins: 15, losses: 3, points: 45, position: 1 },
    { name: 'Downtown FC', wins: 14, losses: 4, points: 42, position: 2 },
    { name: 'Metro Rangers', wins: 12, losses: 6, points: 36, position: 3 },
    { name: 'Valley Stars', wins: 10, losses: 8, points: 30, position: 4 },
  ],
  sport = 'Football',
}: SportsSectionProps) {
  return (
    <motion.div
      variants={STAGGER_CONTAINER}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6"
    >
      {/* League Standings */}
      <GlassCard variant="premium" glowColor="blue" className="p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-400" />
          {sport} League Standings
        </h3>

        <motion.div className="space-y-3" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {teams.map((team, idx) => (
            <motion.div
              key={idx}
              variants={ANIMATIONS.slideUp}
              className="flex items-center justify-between p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg hover:border-blue-400/50 transition-all"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-4 flex-1">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-500/30 text-yellow-400' : idx === 1 ? 'bg-gray-400/30 text-gray-300' : idx === 2 ? 'bg-orange-500/30 text-orange-400' : 'bg-blue-500/30 text-blue-400'
                  }`}
                >
                  {team.position}
                </motion.div>
                <div>
                  <p className="font-semibold text-white">{team.name}</p>
                  <p className="text-xs text-gray-400">{team.wins}W - {team.losses}L</p>
                </div>
              </div>

              <motion.div
                className="text-2xl font-bold text-blue-400"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                {team.points}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>

      {/* Stats Overview */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={STAGGER_CONTAINER} initial="initial" whileInView="animate">
        <DataCard
          icon={<Trophy className="w-6 h-6 text-blue-400" />}
          title="Matches Played"
          value="180"
          glowColor="blue"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Users className="w-6 h-6 text-blue-400" />}
          title="Total Players"
          value="450+"
          glowColor="blue"
          variants={ANIMATIONS.scaleIn}
        />
        <DataCard
          icon={<Zap className="w-6 h-6 text-blue-400" />}
          title="Active Leagues"
          value="8"
          glowColor="blue"
          variants={ANIMATIONS.scaleIn}
        />
      </motion.div>

      {/* Upcoming Matches */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Upcoming Matches</h3>
        <motion.div className="space-y-3" variants={STAGGER_CONTAINER} initial="initial" animate="animate">
          {[
            { home: 'City United', away: 'Downtown FC', date: 'Dec 15, 20:00', stadium: 'Central Stadium' },
            { home: 'Metro Rangers', away: 'Valley Stars', date: 'Dec 16, 18:30', stadium: 'Metro Arena' },
            { home: 'Valley Stars', away: 'City United', date: 'Dec 18, 19:00', stadium: 'Valley Sports Complex' },
          ].map((match, idx) => (
            <motion.div key={idx} variants={ANIMATIONS.slideUp} className="p-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-white text-center flex-1">
                  {match.home} <span className="text-gray-400">vs</span> {match.away}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{match.date}</span>
                <span>📍 {match.stadium}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}
