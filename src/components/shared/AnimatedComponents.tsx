'use client';

import { motion } from 'framer-motion';
import { COLORS, ANIMATIONS, STAGGER_ITEM } from '@/lib/design-system';
import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function AnimatedCounter({
  label,
  value,
  suffix = '',
  icon,
  delay = 0,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue(prev => {
        const increment = Math.ceil(value / 50);
        return prev + increment > value ? value : prev + increment;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.div
      variants={STAGGER_ITEM}
      className="relative group"
    >
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"
      />
      <div
        className="relative p-6 rounded-2xl backdrop-blur-md border"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        <motion.div
          className="flex items-center justify-between mb-3"
          whileHover={{ scale: 1.05 }}
        >
          {icon && <div className="text-2xl">{icon}</div>}
        </motion.div>

        <motion.div
          className="text-4xl font-bold mb-2"
          style={{ color: COLORS.accent }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {displayValue.toLocaleString()}
          <span className="text-lg">{suffix}</span>
        </motion.div>

        <p style={{ color: COLORS.textSecondary }} className="text-sm font-medium">
          {label}
        </p>
      </div>
    </motion.div>
  );
}

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverable?: boolean;
}

export function GlassmorphicCard({
  children,
  className = '',
  delay = 0,
  hoverable = true,
}: GlassmorphicCardProps) {
  return (
    <motion.div
      variants={STAGGER_ITEM}
      className={`relative group ${className}`}
      whileHover={hoverable ? { scale: 1.02 } : undefined}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
      <div
        className="relative backdrop-blur-md border rounded-2xl"
        style={{
          backgroundColor: COLORS.card,
          borderColor: COLORS.border,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

interface AnimatedGradientTextProps {
  text: string;
  className?: string;
}

export function AnimatedGradientText({ text, className = '' }: AnimatedGradientTextProps) {
  return (
    <motion.h1
      className={`bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-300% ${className}`}
      animate={{
        backgroundPosition: ['0% center', '100% center', '0% center'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {text}
    </motion.h1>
  );
}

interface AuroraBackgroundProps {
  children: React.ReactNode;
}

export function AuroraBackground({ children }: AuroraBackgroundProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* Aurora gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 5,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface ParticleBackgroundProps {
  children: React.ReactNode;
  particleCount?: number;
}

export function ParticleBackground({ children, particleCount = 20 }: ParticleBackgroundProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {/* Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  delay?: number;
}

export function AnimatedCard({ children, index = 0, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{
        y: -10,
        boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
      }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

interface ScrollAnimationProps {
  children: React.ReactNode;
}

export function ScrollAnimation({ children }: ScrollAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: '-50px' }}
    >
      {children}
    </motion.div>
  );
}
