// Design System Constants
export const COLORS = {
  primary: '#6366f1', // Indigo
  accent: '#06b6d4', // Cyan
  background: '#0a0f1e', // Dark navy
  card: 'rgba(99, 102, 241, 0.1)', // Glassmorphism
  border: 'rgba(255, 255, 255, 0.1)',
  text: '#ffffff',
  textSecondary: '#cbd5e1',
};

export const ANIMATIONS = {
  pageEnter: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  glow: {
    animate: {
      boxShadow: [
        '0 0 20px rgba(99, 102, 241, 0.3)',
        '0 0 40px rgba(99, 102, 241, 0.6)',
        '0 0 20px rgba(99, 102, 241, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  },
  shimmer: {
    animate: {
      backgroundPosition: ['200% center', '-200% center'],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  },
};

export const STAGGER_CONTAINER = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};
