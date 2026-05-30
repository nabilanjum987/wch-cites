'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
}: RevealSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration,
        delay,
        ease: [0.23, 1, 0.82, 1], // Premium cubic-bezier easing
      }}
    >
      {children}
    </motion.section>
  );
}

export default RevealSection;
