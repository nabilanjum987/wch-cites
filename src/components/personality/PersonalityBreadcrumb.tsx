'use client';

import { motion } from 'framer-motion';
import { ANIMATIONS } from '@/lib/design-system';

interface PersonalityBreadcrumbProps {
  name: string;
  birthYear?: string;
}

export function PersonalityBreadcrumb({ name, birthYear }: PersonalityBreadcrumbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 text-sm mb-4"
    >
      <a href="/" className="text-gray-400 hover:text-white transition-colors">
        Home
      </a>
      <span className="text-gray-600">/</span>
      <a href="/personalities" className="text-gray-400 hover:text-white transition-colors">
        Personalities
      </a>
      <span className="text-gray-600">/</span>
      <span className="text-orange-400 font-semibold">
        {name}
        {birthYear && <span className="text-gray-500 ml-2">({birthYear})</span>}
      </span>
    </motion.div>
  );
}
