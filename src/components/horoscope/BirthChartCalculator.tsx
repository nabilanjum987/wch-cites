'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Sun, Moon, Star, Sparkles, Hash } from 'lucide-react';
import { getBirthNumerology, getChineseZodiacForYear, getSignData } from '../../lib/apis/astro';
import { computeBirthChart } from '../../lib/horoscope/compose';
import { CHINESE_ANIMALS } from '../../types/horoscope';
import type { ZodiacSign } from '../../types/horoscope';

interface Props {
  primaryColor: string;
}

interface BirthChartResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign | null;
  placements: { planet: string; sign: string; degree: number; retrograde: boolean }[];
  chineseAnimal: string;
  chineseElement: string;
  lifePathNumber: number;
  personalYearNumber: number;
}

export default function BirthChartCalculator({ primaryColor }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [error, setError] = useState('');

  const calculateChart = () => {
    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }
    // Everything below is computed from the entered BIRTH date (and hour)
    // by the same engine as the daily readings, never from today's sky:
    // sun sign from the zodiac date ranges, moon sign and planetary
    // placements from computePositions(birthDate), rising sign from the
    // birth hour only.
    const chart = computeBirthChart(birthDate, birthTime || undefined);
    if (!chart) {
      setError('Please enter a valid birth date');
      return;
    }
    setError('');
    const [year] = birthDate.split('-').map(Number);

    const chineseResult = getChineseZodiacForYear(year);
    const numerology = getBirthNumerology(birthDate);

    setResult({
      sunSign: chart.sunSign,
      moonSign: chart.moonSign,
      risingSign: chart.risingSign,
      placements: chart.placements.map((p) => ({
        planet: p.label,
        sign: p.sign,
        degree: Math.round(p.degreeInSign * 10) / 10,
        retrograde: p.retrograde,
      })),
      chineseAnimal: chineseResult?.animal.name ?? 'Unknown',
      chineseElement: chineseResult?.element ?? 'wood',
      lifePathNumber: numerology.lifePathNumber,
      personalYearNumber: numerology.personalYearNumber,
    });
  };

  const sunSignData = result ? getSignData(result.sunSign) : null;
  const moonSignData = result ? getSignData(result.moonSign) : null;
  const risingSignData = result?.risingSign ? getSignData(result.risingSign) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Calculator size={18} style={{ color: primaryColor }} />
        <div className="font-semibold text-gray-900 text-sm">Birth Chart Calculator</div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Date of Birth *</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Time (optional, for rising sign)</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <button
          onClick={calculateChart}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: primaryColor }}
        >
          <Sparkles size={16} />
          Calculate Birth Chart
        </button>

        <p className="text-[11px] leading-relaxed text-gray-400 mt-3">
          Sun sign, Moon sign and planetary placements are computed from your birth date with the
          same Keplerian engine as the daily readings (Schlyter's algorithm). The rising sign is
          approximate, from your birth hour only; this tool does not ask for a birth city because
          it does not use one.
        </p>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-6"
          >
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-3.5 text-center border border-amber-100">
                <Sun size={20} className="mx-auto text-amber-500 mb-1" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Sun Sign</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{sunSignData?.symbol}</p>
                <p className="text-sm font-semibold text-gray-800">{sunSignData?.name}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3.5 text-center border border-blue-100">
                <Moon size={20} className="mx-auto text-blue-400 mb-1" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Moon Sign</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{moonSignData?.symbol}</p>
                <p className="text-sm font-semibold text-gray-800">{moonSignData?.name}</p>
                <p className="text-[10px] text-gray-400 mt-1">Computed Moon sign for your birth date</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3.5 text-center border border-purple-100">
                <Star size={20} className="mx-auto text-purple-400 mb-1" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Rising Sign</p>
                {risingSignData ? (
                  <>
                    <p className="text-xl font-bold text-gray-900 mt-1">{risingSignData.symbol}</p>
                    <p className="text-sm font-semibold text-gray-800">{risingSignData.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1">Approximate, from your birth hour only</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">Add a birth time to estimate your rising sign</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">Planetary placements at your birth date (computed)</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {result.placements.map((t) => (
                  <div key={t.planet} className="bg-gray-50 rounded-xl p-2 text-center">
                    <p className="text-[10px] font-semibold text-gray-500">{t.planet}{t.retrograde ? ' ℞' : ''}</p>
                    <p className="text-xs font-bold text-gray-900">{t.sign}</p>
                    <p className="text-[10px] text-gray-500">{t.degree.toFixed(1)}°</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <span className="text-2xl">{CHINESE_ANIMALS.find(a => a.name === result.chineseAnimal)?.emoji}</span>
                <p className="text-[10px] text-gray-500 mt-1">Chinese Year</p>
                <p className="text-sm font-semibold text-gray-800">{result.chineseAnimal}</p>
                <p className="text-xs text-gray-400">{result.chineseElement}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Hash size={20} className="mx-auto text-green-500 mb-1" />
                <p className="text-[10px] text-gray-500 mt-1">Life Path</p>
                <p className="text-xl font-bold text-gray-900">{result.lifePathNumber}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Personal Year Number</p>
                  <p className="text-2xl font-bold text-gray-900">{result.personalYearNumber}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                >
                  {result.personalYearNumber}
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {result.personalYearNumber === 1 && 'A year of new beginnings and fresh starts.'}
                {result.personalYearNumber === 2 && 'A year of partnerships and cooperation.'}
                {result.personalYearNumber === 3 && 'A year of creativity and self-expression.'}
                {result.personalYearNumber === 4 && 'A year of hard work and building foundations.'}
                {result.personalYearNumber === 5 && 'A year of change and freedom.'}
                {result.personalYearNumber === 6 && 'A year of responsibility and nurturing.'}
                {result.personalYearNumber === 7 && 'A year of introspection and spiritual growth.'}
                {result.personalYearNumber === 8 && 'A year of power and material success.'}
                {result.personalYearNumber === 9 && 'A year of completion and humanitarianism.'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
