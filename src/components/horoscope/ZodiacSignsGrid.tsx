import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import type { ZodiacSign, DailyReading } from '../../types/horoscope';
import { ZODIAC_SIGNS, ELEMENT_COLORS, ELEMENT_BG, ELEMENT_TEXT, FAMOUS_PEOPLE } from '../../types/horoscope';
import { fetchDailyReading } from '../../lib/apis/astro';

interface Props {
  onSignClick: (sign: ZodiacSign) => void;
  primaryColor: string;
}

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < rating ? 'fill-current' : ''} style={{ color: i < rating ? color : '#D1D5DB' }} />
      ))}
    </div>
  );
}

export default function ZodiacSignsGrid({ onSignClick, primaryColor }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">All 12 Western Signs</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {ZODIAC_SIGNS.map((sign, i) => {
          const reading: DailyReading = fetchDailyReading(sign.key);
          const elemColor = ELEMENT_COLORS[sign.element];
          const elemBg = ELEMENT_BG[sign.element];
          const elemText = ELEMENT_TEXT[sign.element];

          return (
            <motion.button
              key={sign.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSignClick(sign.key)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${elemColor}12` }}>
                  {sign.symbol}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${elemBg} ${elemText}`}>
                  {sign.element}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-sm">{sign.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{sign.dates}</p>

              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400 mb-1">Today</p>
                <StarRating rating={reading.overall} color={primaryColor} />
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: primaryColor }}>
                View details
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
