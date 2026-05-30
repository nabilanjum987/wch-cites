/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        // City themes
        weather: '#06b6d4',
        prayer: '#8b5cf6',
        rates: '#f59e0b',
        news: '#ef4444',
        events: '#10b981',
        sports: '#3b82f6',
        economy: '#ec4899',
        places: '#14b8a6',
        personalities: '#f97316',
      },
      backdropBlur: {
        xl: '40px',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { 'box-shadow': '0 0 40px rgba(6, 182, 212, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
    },
  },
  plugins: [],
};
