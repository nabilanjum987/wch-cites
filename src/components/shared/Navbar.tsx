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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300`}
      style={{
        backdropFilter: 'blur(10px)',
        backgroundColor: scrolled
          ? `rgba(10, 15, 30, 0.95)`
          : `rgba(10, 15, 30, ${scrolled ? 0.95 : 0.7})`,
        borderBottom: `1px solid ${COLORS.border}`,
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
                    '0 0 20px rgba(99, 102, 241, 0.3)',
                    '0 0 40px rgba(99, 102, 241, 0.6)',
                    '0 0 20px rgba(99, 102, 241, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Globe className="w-6 h-6 text-indigo-400" />
              </motion.div>
              <motion.span
                className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight"
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
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
              }}
              title="Find my location"
            >
              <MapPin className="w-5 h-5 text-indigo-400" />
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
              }}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            </motion.button>

            {/* Language Toggle */}
            <motion.button
              onClick={toggleLanguage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-lg font-medium text-sm transition-all"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
              title="Toggle language"
            >
              {language}
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: `rgba(99, 102, 241, 0.1)`,
              border: `1px solid ${COLORS.border}`,
            }}
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
              href="/pakistan/punjab/lahore/news"
              className="block px-4 py-2 text-sm font-medium rounded-lg transition-all no-underline"
              style={{
                backgroundColor: `rgba(99, 102, 241, 0.1)`,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.accent,
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Lahore News
            </Link>
          </div>
        )}
      </motion.div>
    </motion.nav>
  );
}
