'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: 'Weather', id: 'weather', icon: '⛅' },
  { label: 'Prayer Times', id: 'prayer-times', icon: '🕌' },
  { label: 'Gold Rates', id: 'rates', icon: '🥇' },
  { label: 'News', id: 'news', icon: '📰' },
  { label: 'Events', id: 'events', icon: '📅' },
  { label: 'Sports', id: 'sports', icon: '⚽' },
  { label: 'Economy', id: 'economy', icon: '💼' },
];

export function CityTabs() {
  const pathname = usePathname();

  return (
    <motion.div
      className="w-full border-b border-gray-200 bg-white sticky top-16 z-40"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex overflow-x-auto gap-1 scrollbar-hide">
          {tabs.map((tab, idx) => (
            <motion.a
              key={tab.id}
              href={`#${tab.id}`}
              className="flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-all duration-200 relative"
              style={{
                borderColor: pathname.includes(tab.id) ? '#6366f1' : 'transparent',
                color: pathname.includes(tab.id) ? '#6366f1' : '#666',
              }}
              whileHover={{ color: '#6366f1' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
