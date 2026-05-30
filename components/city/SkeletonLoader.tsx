'use client';

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  count?: number;
  height?: string;
  width?: string;
}

export function SkeletonLoader({ count = 3, height = 'h-12', width = 'w-full' }: SkeletonLoaderProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={idx}
          className={`${width} ${height} backdrop-blur-xl bg-gradient-to-r from-white/5 to-white/10 rounded-lg`}
          animate={{
            backgroundPosition: ['200% center', '-200% center'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <motion.div
      className="backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl p-6"
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <div className="space-y-4">
        <div className="h-6 bg-gradient-to-r from-white/5 to-white/10 rounded-lg w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded-lg w-full" />
          <div className="h-4 bg-gradient-to-r from-white/5 to-white/10 rounded-lg w-5/6" />
        </div>
      </div>
    </motion.div>
  );
}
