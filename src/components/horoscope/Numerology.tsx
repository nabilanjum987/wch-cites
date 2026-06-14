import { motion } from 'framer-motion';
import { Hash, Focus, Palette, Quote } from 'lucide-react';
import { getNumerologyForToday } from '../../lib/apis/astro';

interface Props {
  primaryColor: string;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#EAB308',
  4: '#22C55E',
  5: '#14B8A6',
  6: '#6366F1',
  7: '#8B5CF6',
  8: '#EAB308',
  9: '#64748B',
};

export default function Numerology({ primaryColor }: Props) {
  const data = getNumerologyForToday();
  const numberColor = NUMBER_COLORS[data.universalDayNumber] ?? primaryColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Hash size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Numerology</h2>
        <span className="text-xs text-gray-400 ml-auto">{data.date}</span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-5 mb-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold"
            style={{ backgroundColor: `${numberColor}15`, color: numberColor }}
          >
            {data.universalDayNumber}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Universal Day Number</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{data.meaning}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3.5 flex items-start gap-3">
            <Focus size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Today's Focus</p>
              <p className="text-sm text-gray-800 leading-relaxed">{data.focus}</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3.5 flex items-start gap-3">
            <Palette size={18} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Power Color</p>
              <p className="text-sm font-semibold" style={{ color: numberColor }}>{data.color}</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{ backgroundColor: `${numberColor}08` }}
        >
          <Quote size={18} className="shrink-0 mt-0.5" style={{ color: numberColor }} />
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Affirmation</p>
            <p className="text-sm italic text-gray-700">{data.affirmation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
