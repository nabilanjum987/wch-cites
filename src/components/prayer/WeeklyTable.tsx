import { motion } from 'framer-motion';
import type { DayData } from '../../lib/apis/prayer';
import { formatTime } from '../../lib/apis/prayer';

interface Props {
  weekData: DayData[];
  accent?: string;
}

const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export default function WeeklyTable({ weekData, accent = '#10b981' }: Props) {
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
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <th className="text-left px-3 py-3 font-semibold text-white/50 sticky left-0" style={{ backgroundColor: '#10182c' }}>Day</th>
            {PRAYER_KEYS.map((k) => (
              <th key={k} className="text-center px-3 py-3 font-semibold text-white/50">{k}</th>
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
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: isToday ? `${accent}1f` : 'transparent',
                }}
              >
                <td
                  className="px-3 py-3 sticky left-0"
                  style={{ backgroundColor: isToday ? '#142235' : '#10182c' }}
                >
                  <div>
                    <span className="font-semibold" style={{ color: isToday ? accent : 'rgba(255,255,255,0.75)' }}>
                      {weekday.substring(0, 3)}
                    </span>
                    <span className="text-white/35 ml-1">{dateStr.split('-')[0]}</span>
                    {isToday && <span className="ml-1 text-xs font-bold" style={{ color: accent }}>Today</span>}
                  </div>
                </td>
                {PRAYER_KEYS.map((k) => (
                  <td
                    key={k}
                    className="px-3 py-3 text-center font-mono"
                    style={{ color: isToday ? accent : 'rgba(255,255,255,0.6)', fontWeight: isToday ? 600 : 400 }}
                  >
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
