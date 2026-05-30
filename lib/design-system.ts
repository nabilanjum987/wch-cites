// Design System Constants - Linear.app meets Apple.com aesthetic
export const COLORS = {
  // Global
  background: '#030712', // Near-black
  card: 'rgba(255, 255, 255, 0.08)', // Glassmorphism
  cardBorder: 'rgba(255, 255, 255, 0.12)',
  text: '#ffffff',
  textSecondary: '#a0aec0',
  
  // City Page Themes
  weather: '#06b6d4', // Cyan
  prayer: '#8b5cf6', // Purple
  rates: '#f59e0b', // Amber
  news: '#ef4444', // Red
  events: '#10b981', // Green
  sports: '#3b82f6', // Blue
  economy: '#ec4899', // Pink
  places: '#14b8a6', // Teal
  personalities: '#f97316', // Orange
  
  // Country Primary Colors
  pakistan: { primary: '#01411C', secondary: '#FFFFFF' },
  uae: { primary: '#00732F', secondary: '#FFFFFF' },
  saudiarabia: { primary: '#006C35', secondary: '#FFFFFF' },
  
  // UI Elements
  glow: 'rgba(6, 182, 212, 0.5)',
};

export const ANIMATIONS = {
  // Hero text animations - word by word
  heroWord: {
    initial: { opacity: 0, y: 40 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
  },
  
  // Page enter/exit
  pageEnter: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.6 }
    },
    exit: { opacity: 0 },
  },
  
  // Smooth slide up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.23, 1, 0.82, 1] },
  },
  
  // Scale in for cards
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.82, 1] },
  },
  
  // Floating animation
  float: {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  // Glow effect
  glow: (color: string = '#06b6d4') => ({
    animate: {
      boxShadow: [
        `0 0 20px ${color}33`,
        `0 0 40px ${color}66`,
        `0 0 20px ${color}33`,
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  }),
  
  // Shimmer loader
  shimmer: {
    animate: {
      backgroundPosition: ['200% center', '-200% center'],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  },
  
  // Skeleton pulse
  skeletonPulse: {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  },
};

// Stagger animations for lists
export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.23, 1, 0.82, 1] },
};

// Tailwind utility classes for glassmorphism
export const GLASSMORPHISM = 'backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl';
