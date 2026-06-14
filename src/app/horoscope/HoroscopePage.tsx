import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import SkyRightNow from '../../components/horoscope/SkyRightNow';
import ZodiacSignsGrid from '../../components/horoscope/ZodiacSignsGrid';
import SignDetailPage from '../../components/horoscope/SignDetailPage';
import MoonCalendar from '../../components/horoscope/MoonCalendar';
import Numerology from '../../components/horoscope/Numerology';
import TarotCardOfDay from '../../components/horoscope/TarotCardOfDay';
import BirthChartCalculator from '../../components/horoscope/BirthChartCalculator';
import CompatibilityFinder from '../../components/horoscope/CompatibilityFinder';
import Affiliates from '../../components/horoscope/Affiliates';
import ChineseZodiac from '../../components/city/NationalEvents';
import VedicPanchang from '../../components/city/VedicPanchang';
import { fetchSkyRightNow } from '../../lib/apis/astro';
import type { ZodiacSign } from '../../types/horoscope';

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);
  const primaryColor = '#0F4C81';
  const skyData = useMemo(() => fetchSkyRightNow(), []);

  if (selectedSign) {
    return (
      <SignDetailPage
        sign={selectedSign}
        onBack={() => setSelectedSign(null)}
        primaryColor={primaryColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter,sans-serif]">
      {/* Page header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 50%), radial-gradient(circle at 50% 50%, white 0%, transparent 70%)',
          }}
        />
        {/* Decorative stars */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: `${1 + (i % 3)}px`,
                height: `${1 + (i % 3)}px`,
                top: `${(i * 17) % 100}%`,
                left: `${(i * 23 + 7) % 100}%`,
                opacity: 0.15 + (i % 5) * 0.05,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-6 pb-8">
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-4">
            <a href="/" className="hover:text-white transition-colors">
              Home
            </a>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Horoscope</span>
          </nav>

          <div className="flex items-center gap-3">
            <Sparkles size={28} className="text-white" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Horoscope & Sky Tonight
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Daily readings, moon phases & celestial events
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Section 1 — Sky Right Now */}
        <SkyRightNow data={skyData} primaryColor={primaryColor} />

        {/* Section 2 — All 12 Western Signs Grid */}
        <ZodiacSignsGrid
          onSignClick={(sign) => setSelectedSign(sign)}
          primaryColor={primaryColor}
        />

        {/* Section 3 — Numerology */}
        <Numerology primaryColor={primaryColor} />

        {/* Section 4 — Tarot Card of the Day */}
        <TarotCardOfDay primaryColor={primaryColor} />

        {/* Section 5 — Chinese Zodiac 2025 */}
        <ChineseZodiac primaryColor={primaryColor} />

        {/* Section 6 — Vedic Panchang */}
        <VedicPanchang primaryColor={primaryColor} />

        {/* Section 7 — Moon Calendar */}
        <MoonCalendar primaryColor={primaryColor} />

        {/* Section 8 — Birth Chart Calculator */}
        <BirthChartCalculator primaryColor={primaryColor} />

        {/* Section 9 — Compatibility Finder */}
        <CompatibilityFinder primaryColor={primaryColor} />

        {/* Section 10 — Affiliates */}
        <Affiliates primaryColor={primaryColor} />

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-xs text-gray-400">
            Horoscope readings are for entertainment purposes. Sky data is astronomically approximate.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
