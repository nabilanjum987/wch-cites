import { motion } from 'framer-motion';
import type { DayData } from '../../lib/apis/prayer';
import { formatTime } from '../../lib/apis/prayer';

interface Props {
  weekData: DayData[];
}

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export default function WeeklyTable({ weekData }: Props) {
  if (!weekData.length) return null;

  const todayIdx = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-x-auto"
    >
      <table className="w-full text-xs sm:text-sm min-w-[600px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-3 py-3 font-semibold text-gray-500 sticky left-0 bg-gray-50">Day</th>
            {PRAYER_KEYS.map((k) => (
              <th key={k} className="text-center px-3 py-3 font-semibold text-gray-500">{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekData.map((day, i) => {
            const isToday = i === todayIdx;
            const weekday = day.date.gregorian.weekday.en;
            const dateStr = day.date.gregorian.date;
            return (
              <motion.tr
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`border-b border-gray-50 ${isToday ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}
              >
                <td className={`px-3 py-3 sticky left-0 ${isToday ? 'bg-emerald-50' : 'bg-white'}`}>
                  <div>
                    <span className={`font-semibold ${isToday ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {weekday.substring(0, 3)}
                    </span>
                    <span className="text-gray-400 ml-1">{dateStr.split('-')[0]}</span>
                    {isToday && <span className="ml-1 text-xs text-emerald-600 font-bold">Today</span>}
                  </div>
                </td>
                {PRAYER_KEYS.map((k) => (
                  <td key={k} className={`px-3 py-3 text-center font-mono ${isToday ? 'text-emerald-700 font-semibold' : 'text-gray-600'}`}>
                    {formatTime(day.timings[k])}
                  </td>
                ))}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </motion.div>
  );
}
