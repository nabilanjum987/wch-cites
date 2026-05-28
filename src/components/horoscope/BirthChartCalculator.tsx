import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Sun, Moon, Star, Sparkles, Hash, Calendar, MapPin } from 'lucide-react';
import { getBirthNumerology, getChineseZodiacForYear, getCurrentSunSign, getMoonSign, getSignData } from '../../lib/apis/astro';
import { ZODIAC_SIGNS, CHINESE_ANIMALS, CHINESE_ELEMENT_COLORS } from '../../types/horoscope';
import type { ZodiacSign, ChineseAnimal } from '../../types/horoscope';

interface Props {
  primaryColor: string;
}

interface BirthChartResult {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  chineseAnimal: string;
  chineseElement: string;
  vedicMoon: string;
  lifePathNumber: number;
  personalYearNumber: number;
}

export default function BirthChartCalculator({ primaryColor }: Props) {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthCity, setBirthCity] = useState('');
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [error, setError] = useState('');

  const calculateChart = () => {
    if (!birthDate) {
      setError('Please enter your birth date');
      return;
    }

    setError('');
    const [year, month, day] = birthDate.split('-').map(Number);
    const now = new Date();

    // Sun sign from date
    let sunSign: ZodiacSign = 'capricorn';
    for (const s of ZODIAC_SIGNS) {
      const inSign = month > s.start_month || (month === s.start_month && day >= s.start_day);
      if (s.key === 'capricorn') {
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
          sunSign = 'capricorn';
          break;
        }
      } else if (inSign) {
        sunSign = s.key;
        break;
      }
    }

    // Moon sign (approximation based on date)
    const moonSign: ZodiacSign = getMoonSign();

    // Rising sign (simplified: based on time if provided, otherwise use current)
    let risingSign: ZodiacSign = 'aries';
    if (birthTime) {
      const [hour] = birthTime.split(':').map(Number);
      const signIndex = Math.floor(hour / 2) % 12;
      risingSign = ZODIAC_SIGNS[signIndex].key;
    } else {
      risingSign = ZODIAC_SIGNS[Math.floor((now.getHours() / 2) % 12)].key;
    }

    // Chinese zodiac
    const chineseResult = getChineseZodiacForYear(year);
    const chineseAnimal = chineseResult?.animal.name ?? 'Unknown';
    const chineseElement = chineseResult?.element ?? 'wood';

    // Vedic moon sign (approximation)
    const vedicMoonIndex = (day + month * 3) % 12;
    const vedicMoon = ZODIAC_SIGNS[vedicMoonIndex].name;

    // Numerology
    const numerology = getBirthNumerology(birthDate);

    setResult({
      sunSign,
      moonSign,
      risingSign,
      chineseAnimal,
      chineseElement,
      vedicMoon,
      lifePathNumber: numerology.lifePathNumber,
      personalYearNumber: numerology.personalYearNumber,
    });
  };

  const sunSignData = result ? getSignData(result.sunSign) : null;
  const moonSignData = result ? getSignData(result.moonSign) : null;
  const risingSignData = result ? getSignData(result.risingSign) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Calculator size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Birth Chart Calculator</h2>
      </div>

      <div className="p-5">
        {/* Input Form */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
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
            <label className="text-xs font-medium text-gray-500 mb-1 block">Time (optional)</label>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">City (optional)</label>
            <input
              type="text"
              value={birthCity}
              onChange={(e) => setBirthCity(e.target.value)}
              placeholder="City of birth"
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

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 space-y-6"
          >
            {/* The Three Pillars */}
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
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3.5 text-center border border-purple-100">
                <Star size={20} className="mx-auto text-purple-400 mb-1" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase">Rising Sign</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{risingSignData?.symbol}</p>
                <p className="text-sm font-semibold text-gray-800">{risingSignData?.name}</p>
              </div>
            </div>

            {/* Other Results */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <span className="text-2xl">{CHINESE_ANIMALS.find(a => a.name === result.chineseAnimal)?.emoji}</span>
                <p className="text-[10px] text-gray-500 mt-1">Chinese Year</p>
                <p className="text-sm font-semibold text-gray-800">{result.chineseAnimal}</p>
                <p className="text-xs text-gray-400">{result.chineseElement}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Sparkles size={20} className="mx-auto text-orange-400 mb-1" />
                <p className="text-[10px] text-gray-500 mt-1">Vedic Moon</p>
                <p className="text-sm font-semibold text-gray-800">{result.vedicMoon}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Hash size={20} className="mx-auto text-green-500 mb-1" />
                <p className="text-[10px] text-gray-500 mt-1">Life Path</p>
                <p className="text-xl font-bold text-gray-900">{result.lifePathNumber}</p>
              </div>
            </div>

            {/* Personal Year */}
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
