'use client';

// Header / Nav (WP2 Slice 2 / Q2) — link set frozen by the homepage
// link map §2: Logo → / · Cities → /countries · Countries → /countries
// · Faiths → /#faiths (homepage anchor; the anchor itself is added by
// the Faiths panel slice) · Live Updates → /news · Compare → /compare
// · Rates → /rates.
// Changes from the previous header: the full frozen link set replaces
// the two-link version; the language toggle is REMOVED (the site is
// English-only under the frozen language policy — no Urdu identity in
// public UI); the location icon now links to the real /my-location
// page instead of firing a geolocation prompt that went nowhere.

import { Globe, Menu, X, MapPin, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { COLORS } from '@/lib/design-system';

const NAV_LINKS = [
  { label: 'Cities', href: '/countries' },
  { label: 'Countries', href: '/countries' },
  { label: 'Faiths', href: '/#faiths' },
  { label: 'Live Updates', href: '/news' },
  { label: 'Compare', href: '/compare' },
  { label: 'Rates', href: '/rates' },
];

const linkStyle: React.CSSProperties = {
  backgroundColor: 'rgba(99, 102, 241, 0.05)',
  color: COLORS.accent,
  border: `1px solid ${COLORS.border}`,
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('up');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: scrollDirection === 'down' ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 z-50 w-full transition-all duration-300"
      style={{
        backdropFilter: 'blur(20px)',
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
            <Link href="/" className="flex items-center gap-2 no-underline flex-shrink-0">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                    '0 0 40px rgba(6, 182, 212, 0.6)',
                    '0 0 20px rgba(6, 182, 212, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Globe className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <motion.span
                className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight"
                whileHover={{ scale: 1.02 }}
              >
                WorldCityHub
              </motion.span>
            </Link>
          </motion.div>

          {/* Navigation Links — frozen set (link map §2) */}
          <motion.div
            className="hidden lg:flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-indigo-500/15"
                style={linkStyle}
              >
                {l.label}
              </Link>
            ))}
          </motion.div>

          {/* Right Side — Desktop */}
          <motion.div
            className="hidden md:flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/my-location"
              className="p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 no-underline"
              title="My Location"
            >
              <MapPin className="w-5 h-5 text-cyan-400" />
            </Link>
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-cyan-400" />}
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: mobileMenuOpen ? 1 : 0, height: mobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        style={{ borderTop: `1px solid ${COLORS.border}` }}
      >
        {mobileMenuOpen && (
          <div className="px-4 py-4 space-y-2" style={{ backgroundColor: 'rgba(10, 15, 30, 0.95)' }}>
            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-indigo-500/15"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-indigo-500/15"
                style={linkStyle}
                onClick={() => setMobileMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/my-location"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-indigo-500/15"
              style={linkStyle}
              onClick={() => setMobileMenuOpen(false)}
            >
              <MapPin className="w-4 h-4" /> My Location
            </Link>
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ x: 5 }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: `1px solid ${COLORS.border}`, color: COLORS.accent }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
}
