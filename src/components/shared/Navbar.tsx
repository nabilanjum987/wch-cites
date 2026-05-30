'use client';

import { Globe, Menu, X, MapPin, Moon, Sun, Globe2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { COLORS } from '@/lib/design-system';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'UR'>('EN');
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

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

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('User location:', latitude, longitude);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to access your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleCitySelect = (city: any) => {
    if (city) {
      setMobileMenuOpen(false);
      router.push(`/${city.country_slug}/${city.province_slug}/${city.city_slug}`);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'UR' : 'EN');
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
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
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

          {/* Center Search Bar - Hidden on mobile */}
          <motion.div className="hidden md:flex flex-grow mx-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <SearchBar onCitySelect={handleCitySelect} />
          </motion.div>

          {/* Navigation Links - Hidden on mobile */}
          <motion.div
            className="hidden lg:flex items-center gap-2 mr-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <Link
              href="/rates"
              className="px-3 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.05)`,
                color: COLORS.accent,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = `rgba(99, 102, 241, 0.15)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = `rgba(99, 102, 241, 0.05)`;
              }}
            >
              Rates
            </Link>
            <Link
              href="/compare"
              className="px-3 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.05)`,
                color: COLORS.accent,
                border: `1px solid ${COLORS.border}`,
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = `rgba(99, 102, 241, 0.15)`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = `rgba(99, 102, 241, 0.05)`;
              }}
            >
              Compare
            </Link>
          </motion.div>

          {/* Right Side Icons - Desktop */}
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* My Location Button */}
            <motion.button
              onClick={handleMyLocation}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
              title="Find my location"
            >
              <MapPin className="w-5 h-5 text-cyan-400" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-cyan-400" />}
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-lg font-medium text-sm transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 text-cyan-400"
              title="Toggle language"
            >
              {language}
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg transition-all backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30"
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
          <div className="px-4 py-4 space-y-3" style={{ backgroundColor: `rgba(10, 15, 30, 0.95)` }}>
            {/* Mobile Search Bar */}
            <div className="mb-4">
              <SearchBar onCitySelect={handleCitySelect} />
            </div>

            {/* Mobile Action Buttons */}
            <motion.button
              onClick={handleMyLocation}
              whileHover={{ x: 5 }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
            >
              <MapPin className="w-4 h-4" />
              My Location
            </motion.button>

            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ x: 5 }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </motion.button>

            <motion.button
              onClick={toggleLanguage}
              whileHover={{ x: 5 }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
            >
              <Globe2 className="w-4 h-4" />
              {language === 'EN' ? 'اردو' : 'English'}
            </motion.button>

            <hr style={{ borderColor: COLORS.border }} className="my-2" />

            <Link
              href="/"
              className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/rates"
              className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Rates
            </Link>

            <Link
              href="/compare"
              className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Compare Cities
            </Link>
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
}
