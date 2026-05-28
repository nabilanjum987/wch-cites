import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Briefcase, Clock, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { fetchSignsCompatibility } from '../../lib/apis/astro';
import { ZODIAC_SIGNS, CHINESE_ANIMALS } from '../../types/horoscope';
import type { ZodiacSign, ChineseAnimal } from '../../types/horoscope';

interface Props {
  primaryColor: string;
}

interface CompatibilityCategory {
  percentage: number;
  description: string;
}

const CHINESE_COMPATIBILITY: Record<ChineseAnimal, { best: ChineseAnimal[]; good: ChineseAnimal[]; challenging: ChineseAnimal[] }> = {
  rat:     { best: ['ox', 'dragon', 'monkey'], good: ['snake', 'tiger'], challenging: ['horse', 'goat'] },
  ox:      { best: ['rat', 'snake', 'rooster'], good: ['tiger', 'rabbit'], challenging: ['dragon', 'horse'] },
  tiger:   { best: ['horse', 'dog', 'pig'], good: ['rat', 'dragon'], challenging: ['ox', 'snake'] },
  rabbit:  { best: ['goat', 'pig', 'dog'], good: ['ox', 'snake'], challenging: ['rooster', 'dragon'] },
  dragon:  { best: ['rat', 'monkey', 'rooster'], good: ['tiger', 'snake'], challenging: ['dog', 'rabbit'] },
  snake:   { best: ['ox', 'rooster', 'dragon'], good: ['horse', 'rat'], challenging: ['tiger', 'pig'] },
  horse:   { best: ['tiger', 'goat', 'dog'], good: ['dragon', 'monkey'], challenging: ['rat', 'ox'] },
  goat:    { best: ['rabbit', 'horse', 'pig'], good: ['dragon', 'monkey'], challenging: ['rat', 'ox'] },
  monkey:  { best: ['rat', 'dragon', 'snake'], good: ['ox', 'rabbit'], challenging: ['tiger', 'pig'] },
  rooster: { best: ['ox', 'snake', 'dragon'], good: ['tiger', 'horse'], challenging: ['rabbit', 'dog'] },
  dog:     { best: ['tiger', 'rabbit', 'horse'], good: ['goat', 'snake'], challenging: ['dragon', 'rooster'] },
  pig:     { best: ['tiger', 'rabbit', 'goat'], good: ['dragon', 'rat'], challenging: ['snake', 'monkey'] },
};

function getChineseCompatibility(animal1: ChineseAnimal, animal2: ChineseAnimal): { percentage: number; label: string } {
  const compat = CHINESE_COMPATIBILITY[animal1];
  if (compat.best.includes(animal2)) return { percentage: 95, label: 'Best Match' };
  if (compat.good.includes(animal2)) return { percentage: 75, label: 'Good Match' };
  if (compat.challenging.includes(animal2)) return { percentage: 35, label: 'Challenging' };
  return { percentage: 55, label: 'Neutral' };
}

export default function CompatibilityFinder({ primaryColor }: Props) {
  const [sign1, setSign1] = useState<ZodiacSign>('aries');
  const [sign2, setSign2] = useState<ZodiacSign>('leo');
  const [chinese1, setChinese1] = useState<ChineseAnimal>('rat');
  const [chinese2, setChinese2] = useState<ChineseAnimal>('dragon');
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const signCompat = fetchSignsCompatibility(sign1, sign2);
  const chineseCompat = getChineseCompatibility(chinese1, chinese2);

  const sign1Data = ZODIAC_SIGNS.find(s => s.key === sign1)!;
  const sign2Data = ZODIAC_SIGNS.find(s => s.key === sign2)!;
  const chinese1Data = CHINESE_ANIMALS.find(a => a.key === chinese1)!;
  const chinese2Data = CHINESE_ANIMALS.find(a => a.key === chinese2)!;

  const lovePercent = signCompat.percentage;
  const friendshipPercent = Math.min(100, signCompat.percentage + (sign1 === sign2 ? 0 : Math.abs(5 - Math.abs(ZODIAC_SIGNS.indexOf(sign1Data) - ZODIAC_SIGNS.indexOf(sign2Data)) * 3)));
  const businessPercent = Math.abs(ZODIAC_SIGNS.indexOf(sign1) - ZODIAC_SIGNS.indexOf(sign2)) <= 2 || Math.abs(ZODIAC_SIGNS.indexOf(sign1) - ZODIAC_SIGNS.indexOf(sign2)) >= 10 ? signCompat.percentage - 10 : signCompat.percentage + 5;
  const longTermPercent = Math.round((lovePercent + friendshipPercent + businessPercent) / 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Users size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Compatibility Finder</h2>
      </div>

      <div className="p-5">
        {/* Western Zodiac */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Western Zodiac</p>
          <div className="flex items-center gap-3">
            <select
              value={sign1}
              onChange={(e) => { setSign1(e.target.value as ZodiacSign); setShowResults(false); }}
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.key} value={s.key}>{s.symbol} {s.name}</option>
              ))}
            </select>
            <span className="text-gray-400 font-bold">+</span>
            <select
              value={sign2}
              onChange={(e) => { setSign2(e.target.value as ZodiacSign); setShowResults(false); }}
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {ZODIAC_SIGNS.map((s) => (
                <option key={s.key} value={s.key}>{s.symbol} {s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chinese Zodiac */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 mb-2">Chinese Zodiac</p>
          <div className="flex items-center gap-3">
            <select
              value={chinese1}
              onChange={(e) => { setChinese1(e.target.value as ChineseAnimal); setShowResults(false); }}
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {CHINESE_ANIMALS.map((a) => (
                <option key={a.key} value={a.key}>{a.emoji} {a.name}</option>
              ))}
            </select>
            <span className="text-gray-400 font-bold">+</span>
            <select
              value={chinese2}
              onChange={(e) => { setChinese2(e.target.value as ChineseAnimal); setShowResults(false); }}
              className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
            >
              {CHINESE_ANIMALS.map((a) => (
                <option key={a.key} value={a.key}>{a.emoji} {a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-5"
          style={{ backgroundColor: primaryColor }}
        >
          <Sparkles size={16} />
          Check Compatibility
        </button>

        {/* Results */}
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Overall */}
            <div className="text-center py-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span className="text-2xl">{sign1Data.symbol}</span>
                <Heart size={20} className="text-red-400" />
                <span className="text-2xl">{sign2Data.symbol}</span>
              </div>
              <div
                className="text-4xl font-bold"
                style={{ color: signCompat.percentage >= 70 ? '#22C55E' : signCompat.percentage >= 50 ? '#EAB308' : '#EF4444' }}
              >
                {signCompat.percentage}%
              </div>
              <p className="text-xs text-gray-500 mt-1">{signCompat.description}</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Love', percent: lovePercent, icon: <Heart size={14} className="text-red-400" /> },
                { label: 'Friendship', percent: friendshipPercent, icon: <Users size={14} className="text-blue-400" /> },
                { label: 'Business', percent: businessPercent, icon: <Briefcase size={14} className="text-amber-500" /> },
                { label: 'Long-term', percent: longTermPercent, icon: <Clock size={14} className="text-green-500" /> },
              ].map((cat) => (
                <div key={cat.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <span className="flex justify-center mb-1">{cat.icon}</span>
                  <p className="text-[10px] text-gray-500">{cat.label}</p>
                  <p className="text-lg font-bold text-gray-900">{cat.percent}%</p>
                </div>
              ))}
            </div>

            {/* Strengths & Challenges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <CheckCircle size={12} className="text-green-600" />
                  <span className="text-[10px] font-semibold text-green-700">Strengths</span>
                </div>
                <ul className="space-y-1">
                  {signCompat.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-gray-700">{s}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-2">
                  <XCircle size={12} className="text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-700">Challenges</span>
                </div>
                <ul className="space-y-1">
                  {signCompat.challenges.map((c, i) => (
                    <li key={i} className="text-xs text-gray-700">{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chinese Compatibility */}
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-gray-500 mb-2">Chinese Compatibility</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{chinese1Data.emoji}</span>
                  <span className="text-gray-400">+</span>
                  <span className="text-xl">{chinese2Data.emoji}</span>
                </div>
                <div className="text-right">
                  <span
                    className="text-xl font-bold"
                    style={{ color: chineseCompat.percentage >= 75 ? '#22C55E' : chineseCompat.percentage >= 50 ? '#EAB308' : '#EF4444' }}
                  >
                    {chineseCompat.percentage}%
                  </span>
                  <p className="text-xs text-gray-500">{chineseCompat.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
