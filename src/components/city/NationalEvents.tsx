'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
import { getChineseZodiacForYear, getChineseZodiacFor2025, getChineseAnimalData } from '../../lib/apis/astro';
import { CHINESE_ANIMALS, CHINESE_ELEMENT_COLORS } from '../../types/horoscope';
import type { ChineseAnimal, ChineseZodiacResult } from '../../types/horoscope';

interface Props {
  primaryColor: string;
}

export default function ChineseZodiac({ primaryColor }: Props) {
  const [birthYear, setBirthYear] = useState('');
  const [result, setResult] = useState<ChineseZodiacResult | null>(null);
  const [error, setError] = useState('');

  const year2025 = getChineseZodiacFor2025();

  const handleLookup = () => {
    const year = parseInt(birthYear, 10);
    if (isNaN(year) || year < 1900 || year > 2100) {
      setError('Please enter a valid year (1900-2100)');
      setResult(null);
      return;
    }
    const r = getChineseZodiacForYear(year);
    if (r) {
      setResult(r);
      setError('');
    } else {
      setError('Could not find zodiac for that year');
      setResult(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Sparkles size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Chinese Zodiac 2025</h2>
        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg font-medium">Year of Wood Snake</span>
      </div>

      <div className="p-5">
        {/* 2025 Year Description */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-5 border border-green-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{year2025.yearAnimal.emoji}</span>
            <div>
              <h3 className="font-bold text-gray-900">{year2025.yearAnimal.name} Year</h3>
              <p className="text-xs text-gray-500">Wood Element</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{year2025.description}</p>
        </div>

        {/* Birth Year Lookup */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-700 mb-2">Find Your Chinese Zodiac</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder="Enter birth year"
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
            <button
              onClick={handleLookup}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-1.5 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              <Search size={14} />
              Find
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{result.animal.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg">{result.animal.name}</h3>
                  <span className="text-xl">{result.elementEmoji}</span>
                </div>
                <p className="text-xs text-gray-500">{result.birthYear} • {result.element.charAt(0).toUpperCase() + result.element.slice(1)} Element</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">{result.forecast2025}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-lg">Traits: {result.animal.traits}</span>
            </div>
          </motion.div>
        )}

        {/* 12 Animals Grid */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">All 12 Animals</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {CHINESE_ANIMALS.map((animal) => {
              const elemColor = animal.key === 'snake' ? CHINESE_ELEMENT_COLORS.wood : primaryColor;
              return (
                <div
                  key={animal.key}
                  className="bg-gray-50 rounded-xl p-2.5 text-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">{animal.emoji}</span>
                  <p className="text-xs font-semibold text-gray-800 mt-1">{animal.name}</p>
                  <p className="text-[10px] text-gray-400">{animal.years[animal.years.length - 1]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
