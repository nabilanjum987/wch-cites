'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Moon, Sun, Sparkles } from 'lucide-react';
import ZodiacSignsGrid from './ZodiacSignsGrid';
import SkyRightNowWrapper from './SkyRightNowWrapper';
import MoonCalendar from './MoonCalendar';
import TarotCardOfDay from './TarotCardOfDay';
import Affiliates from './Affiliates';
import type { ZodiacSign } from '@/types/horoscope';

const ZODIAC_SIGNS = [
  { slug: 'aries',       symbol: '♈', name: 'Aries',       dates: 'Mar 21 – Apr 19', element: 'Fire',  color: '#FF4B4B' },
  { slug: 'taurus',      symbol: '♉', name: 'Taurus',      dates: 'Apr 20 – May 20', element: 'Earth', color: '#4CAF50' },
  { slug: 'gemini',      symbol: '♊', name: 'Gemini',      dates: 'May 21 – Jun 20', element: 'Air',   color: '#FFD700' },
  { slug: 'cancer',      symbol: '♋', name: 'Cancer',      dates: 'Jun 21 – Jul 22', element: 'Water', color: '#4FC3F7' },
  { slug: 'leo',         symbol: '♌', name: 'Leo',         dates: 'Jul 23 – Aug 22', element: 'Fire',  color: '#FF9800' },
  { slug: 'virgo',       symbol: '♍', name: 'Virgo',       dates: 'Aug 23 – Sep 22', element: 'Earth', color: '#8BC34A' },
  { slug: 'libra',       symbol: '♎', name: 'Libra',       dates: 'Sep 23 – Oct 22', element: 'Air',   color: '#E91E63' },
  { slug: 'scorpio',     symbol: '♏', name: 'Scorpio',     dates: 'Oct 23 – Nov 21', element: 'Water', color: '#9C27B0' },
  { slug: 'sagittarius', symbol: '♐', name: 'Sagittarius', dates: 'Nov 22 – Dec 21', element: 'Fire',  color: '#FF5722' },
  { slug: 'capricorn',   symbol: '♑', name: 'Capricorn',   dates: 'Dec 22 – Jan 19', element: 'Earth', color: '#607D8B' },
  { slug: 'aquarius',    symbol: '♒', name: 'Aquarius',    dates: 'Jan 20 – Feb 18', element: 'Air',   color: '#00BCD4' },
  { slug: 'pisces',      symbol: '♓', name: 'Pisces',      dates: 'Feb 19 – Mar 20', element: 'Water', color: '#3F51B5' },
];

const ELEMENT_BG: Record<string, string> = {
  Fire: 'bg-red-50 border-red-100',
  Earth: 'bg-green-50 border-green-100',
  Air: 'bg-yellow-50 border-yellow-100',
  Water: 'bg-blue-50 border-blue-100',
};

export default function HoroscopeIndexClient() {
  const router = useRouter();
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-950 py-14 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #1d4ed8 0%, transparent 50%)'
        }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Star size={28} className="text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">WorldCityHub Astrology</h1>
            <Moon size={28} className="text-yellow-400" />
          </div>
          <p className="text-purple-200 text-lg mb-2">Daily Horoscopes • Moon Phases • Cosmic Events</p>
          <p className="text-purple-400 text-sm">{today}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Choose your sign */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className="text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Choose Your Sign</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {ZODIAC_SIGNS.map(sign => (
              <Link key={sign.slug} href={`/horoscope/${sign.slug}`}
                className={`flex flex-col items-center p-3 rounded-2xl border ${ELEMENT_BG[sign.element]} hover:scale-105 transition-transform`}>
                <span className="text-3xl mb-1.5" style={{ color: sign.color }}>{sign.symbol}</span>
                <span className="text-xs font-bold text-gray-800">{sign.name}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 text-center">{sign.dates}</span>
                <span className="text-[10px] mt-1 px-1.5 py-0.5 rounded-full bg-white/60 text-gray-600">{sign.element}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Sky Right Now */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sun size={20} className="text-orange-400" />
            <h2 className="text-xl font-bold text-white">Sky Right Now</h2>
          </div>
          <SkyRightNowWrapper primaryColor="#7c3aed" />
        </section>

        {/* Moon Calendar */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Moon size={20} className="text-blue-300" />
            <h2 className="text-xl font-bold text-white">Moon Calendar</h2>
          </div>
          <MoonCalendar primaryColor="#7c3aed" />
        </section>

        {/* Tarot Card of the Day */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-pink-400" />
            <h2 className="text-xl font-bold text-white">Tarot Card of the Day</h2>
          </div>
          <TarotCardOfDay primaryColor="#7c3aed" />
        </section>

        {/* All Signs Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-yellow-400" />
            <h2 className="text-xl font-bold text-white">All Signs Overview</h2>
          </div>
          <ZodiacSignsGrid
            primaryColor="#7c3aed"
            onSignClick={(sign: ZodiacSign) => router.push(`/horoscope/${sign}`)}
          />
        </section>

        <Affiliates primaryColor="#7c3aed" />
      </div>
    </div>
  );
}
