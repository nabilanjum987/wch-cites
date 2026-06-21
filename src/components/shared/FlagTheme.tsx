'use client';

import { motion } from 'framer-motion';
import type { FlagPalette } from '@/lib/design/flagPalettes';

/**
 * Flag-themed UI primitives — dark glassmorphism components that pull their
 * color identity from a country's flag palette, matching the homepage's
 * aurora/glassmorphism visual language but recolored per-country.
 */

const BG = '#0a0f1e';

// ─── Aurora background with flag-colored glow orbs ──────────────────────────

export function FlagAuroraBackground({
  palette,
  children,
}: {
  palette: FlagPalette;
  children: React.ReactNode;
}) {
  const orbs = palette.glow.length > 0 ? palette.glow : ['#6366f1', '#06b6d4'];

  return (
    <div className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: BG }}>
      <div className="absolute top-0 left-0 w-full h-full opacity-35 pointer-events-none">
        {orbs.map((color, i) => (
          <motion.div
            key={color + i}
            className="absolute rounded-full mix-blend-screen filter blur-3xl"
            style={{
              backgroundColor: color,
              width: 420,
              height: 420,
              top: `${10 + i * 22}%`,
              left: i % 2 === 0 ? '8%' : '62%',
            }}
            animate={{
              x: [0, 80, -60, 0],
              y: [0, -60, 60, 0],
            }}
            transition={{
              duration: 16 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 1.5,
            }}
          />
        ))}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── Glassmorphism card, border tinted by a flag color ──────────────────────

export function FlagCard({
  color,
  children,
  className = '',
  glow = true,
}: {
  color: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`relative group ${className}`}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-300 pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}
      <div
        className="relative backdrop-blur-md rounded-2xl border p-6"
        style={{
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderColor: `${color}40`,
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

// ─── Gradient heading text using the flag palette ───────────────────────────

export function FlagGradientText({
  text,
  palette,
  className = '',
  as: Tag = 'h1',
}: {
  text: string;
  palette: FlagPalette;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const stops = palette.colors.filter((c) => c.toUpperCase() !== '#FFFFFF');
  const gradientColors = stops.length >= 2 ? stops : [...stops, '#06b6d4'];
  const gradient = `linear-gradient(90deg, ${gradientColors.join(', ')}, ${gradientColors[0]})`;

  return (
    <motion.div
      animate={{ backgroundPosition: ['0% center', '200% center'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      style={{
        backgroundImage: gradient,
        backgroundSize: '300% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
      className={className}
    >
      <Tag className="inline">{text}</Tag>
    </motion.div>
  );
}

// ─── Pill button / tab cycling through flag colors ──────────────────────────

export function FlagPill({
  active,
  color,
  children,
  onClick,
}: {
  active: boolean;
  color: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-sm font-medium transition-all border"
      style={
        active
          ? {
              backgroundColor: `${color}25`,
              borderColor: color,
              color: '#fff',
              boxShadow: `0 0 16px ${color}55`,
            }
          : {
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.6)',
            }
      }
    >
      {children}
    </button>
  );
}

// ─── Section label with a flag-colored marker bar ───────────────────────────

export function FlagSectionTitle({
  icon: Icon,
  title,
  subtitle,
  color,
}: {
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-1.5 h-7 rounded-full" style={{ backgroundColor: color }} />
      {Icon && <Icon className="w-5 h-5" style={{ color }} />}
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{subtitle}</p>}
      </div>
    </div>
  );
}
