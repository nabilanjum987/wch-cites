import { motion } from 'framer-motion';
import { TrendingUp, Hash } from 'lucide-react';
import type { TrendingTopic } from '../../types/city';

interface SocialPulseProps {
  cityName: string;
  topics: TrendingTopic[];
}

export default function SocialPulse({ cityName, topics }: SocialPulseProps) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        What {cityName} is talking about today
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {topics.map((topic, idx) => (
          <motion.div
            key={topic.keyword}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm transition-shadow group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{topic.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3 h-3 text-emerald-500" />
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                    {topic.keyword}
                  </h4>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span className="text-[11px] text-gray-500">
                    {topic.articleCount} article{topic.articleCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual bar */}
            <div className="mt-2.5 h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((topic.articleCount / (topics[0]?.articleCount || 1)) * 100, 100)}%` }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
