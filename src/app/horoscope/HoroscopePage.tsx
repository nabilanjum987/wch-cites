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
import {
  generateSkyParagraph, generateSkyAfter,
  generateZodiacGridParagraph, generateZodiacGridAfter,
  generateNumerologyParagraph, generateNumerologyAfter,
  generateTarotParagraph, generateTarotAfter,
  generateChineseZodiacParagraph, generateChineseZodiacAfter,
  generatePanchangParagraph, generatePanchangAfter,
  generateMoonCalendarParagraph, generateMoonCalendarAfter,
  generateBirthChartParagraph, generateBirthChartAfter,
  generateCompatibilityParagraph, generateCompatibilityAfter,
  generateAffiliatesParagraph, generateAffiliatesAfter,
} from '../../lib/paragraphs/horoscope';

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
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }} className="min-h-screen/4 font-[Inter,sans-serif]">

      {/* Dark aurora orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-8"
          style={{ backgroundColor: "#0C7A3D" }} />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-6"
          style={{ backgroundColor: "#0C7A3D" }} />
      </div>
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
              className="absolute rounded-full bg-transparent animate-pulse"
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

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        {/* Section 1 — Sky Right Now */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateSkyParagraph()}</p>
          <SkyRightNow data={skyData} primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateSkyAfter()}</p>
        </div>

        {/* Section 2 — All 12 Western Signs Grid */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateZodiacGridParagraph()}</p>
          <ZodiacSignsGrid
            onSignClick={(sign) => setSelectedSign(sign)}
            primaryColor={primaryColor}
          />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateZodiacGridAfter()}</p>
        </div>

        {/* Section 3 — Numerology */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateNumerologyParagraph()}</p>
          <Numerology primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateNumerologyAfter()}</p>
        </div>

        {/* Section 4 — Tarot Card of the Day */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateTarotParagraph()}</p>
          <TarotCardOfDay primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateTarotAfter()}</p>
        </div>

        {/* Section 5 — Chinese Zodiac 2025 */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateChineseZodiacParagraph()}</p>
          <ChineseZodiac primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateChineseZodiacAfter()}</p>
        </div>

        {/* Section 6 — Vedic Panchang */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generatePanchangParagraph()}</p>
          <VedicPanchang primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generatePanchangAfter()}</p>
        </div>

        {/* Section 7 — Moon Calendar */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateMoonCalendarParagraph()}</p>
          <MoonCalendar primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateMoonCalendarAfter()}</p>
        </div>

        {/* Section 8 — Birth Chart Calculator */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateBirthChartParagraph()}</p>
          <BirthChartCalculator primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateBirthChartAfter()}</p>
        </div>

        {/* Section 9 — Compatibility Finder */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateCompatibilityParagraph()}</p>
          <CompatibilityFinder primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateCompatibilityAfter()}</p>
        </div>

        {/* Section 10 — Affiliates */}
        <div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">{generateAffiliatesParagraph()}</p>
          <Affiliates primaryColor={primaryColor} />
          <p className="text-gray-400 leading-relaxed text-sm mt-4">{generateAffiliatesAfter()}</p>
        </div>

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
