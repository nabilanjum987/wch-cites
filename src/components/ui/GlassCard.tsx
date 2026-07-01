'use client';

import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';
import { ANIMATIONS } from '@/lib/design-system';

interface GlassCardProps extends MotionProps {
  children?: ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'highlight';
  hoverEffect?: boolean;
  glowColor?: string;
}

export function GlassCard({
  children,
  className = '',
  variant = 'default',
  hoverEffect = true,
  glowColor = 'cyan',
  ...motionProps
}: GlassCardProps) {
  const variants = {
    default: 'backdrop-blur-xl bg-white/8 border border-white/20 rounded-2xl',
    premium: 'backdrop-blur-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/30 rounded-2xl shadow-xl',
    highlight:
      'backdrop-blur-xl bg-gradient-to-br from-white/12 to-white/6 border border-white/25 rounded-2xl shadow-lg',
  };

  const glowStyles = {
    cyan: 'hover:shadow-lg hover:shadow-cyan-500/20 focus-within:shadow-lg focus-within:shadow-cyan-500/20',
    purple: 'hover:shadow-lg hover:shadow-purple-500/20 focus-within:shadow-lg focus-within:shadow-purple-500/20',
    pink: 'hover:shadow-lg hover:shadow-pink-500/20 focus-within:shadow-lg focus-within:shadow-pink-500/20',
    amber: 'hover:shadow-lg hover:shadow-amber-500/20 focus-within:shadow-lg focus-within:shadow-amber-500/20',
  };

  return (
    <motion.div
      className={`${variants[variant]} ${hoverEffect ? glowStyles[glowColor as keyof typeof glowStyles] || glowStyles.cyan : ''} transition-all duration-300 ${className}`}
      variants={ANIMATIONS.scaleIn}
      whileHover={hoverEffect ? { y: -4 } : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

interface DataCardProps extends GlassCardProps {
  icon?: ReactNode;
  title: string;
  value?: string | number;
  subtitle?: string;
  progress?: number;
}

export function DataCard({
  icon,
  title,
  value,
  subtitle,
  progress,
  children,
  ...props
}: DataCardProps) {
  return (
    <GlassCard {...props}>
      <div className="space-y-3">
        {icon && <div className="text-3xl">{icon}</div>}
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          {value !== undefined && <p className="text-2xl font-bold text-cyan-400">{value}</p>}
          {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
        </div>
        {progress !== undefined && (
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
        )}
        {children}
      </div>
    </GlassCard>
  );
}

interface CounterCardProps extends DataCardProps {
  isAnimating?: boolean;
}

export function CounterCard({
  icon,
  title,
  value = 0,
  subtitle,
  isAnimating = true,
  ...props
}: CounterCardProps) {
  return (
    <DataCard
      icon={icon}
      title={title}
      subtitle={subtitle}
      {...props}
    >
      <motion.div
        className="text-3xl font-bold text-cyan-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {isAnimating ? (
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {value}
          </motion.span>
        ) : (
          value
        )}
      </motion.div>
    </DataCard>
  );
}
