import { motion } from 'framer-motion';
import { formatTime, getTimeInMinutes } from '../../lib/apis/prayer';

export interface PrayerRow {
  name: string;
  arabicName: string;
  time: string;
  type: 'fard' | 'sunnah' | 'optional';
  icon?: string;
}

interface Props {
  rows: PrayerRow[];
}

const TYPE_BADGE: Record<PrayerRow['type'], string> = {
  fard: 'bg-emerald-100 text-emerald-700',
  sunnah: 'bg-sky-100 text-sky-700',
  optional: 'bg-amber-100 text-amber-700',
};

const TYPE_LABEL: Record<PrayerRow['type'], string> = {
  fard: 'Fard',
  sunnah: 'Sunnah',
  optional: 'Optional',
};

function isCurrentPrayer(time: string, nextTime: string): boolean {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const t = getTimeInMinutes(time);
  const n = getTimeInMinutes(nextTime);
  if (n > t) return nowMins >= t && nowMins < n;
  return nowMins >= t || nowMins < n;
}

export default function PrayerTable({ rows }: Props) {
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 font-semibold text-gray-500">Prayer</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 hidden sm:table-cell">Arabic</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500">Time</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-500 hidden md:table-cell">Type</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const next = rows[(i + 1) % rows.length];
            const active = isCurrentPrayer(row.time, next.time);
            const pMins = getTimeInMinutes(row.time);
            const passed = !active && pMins < nowMins;
            return (
              <motion.tr
                key={row.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`border-b border-gray-50 transition-colors ${
                  active ? 'bg-emerald-50' : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {row.icon && <span className="text-lg">{row.icon}</span>}
                    <span className={`font-semibold ${active ? 'text-emerald-700' : 'text-gray-800'}`}>
                      {row.name}
                    </span>
                    {active && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="text-gray-500 font-arabic text-base">{row.arabicName}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`font-mono font-semibold ${active ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {formatTime(row.time)}
                  </span>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[row.type]}`}>
                    {TYPE_LABEL[row.type]}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  {active ? (
                    <span className="text-emerald-600 font-semibold text-xs">Current</span>
                  ) : passed ? (
                    <span className="text-gray-400 text-xs">Done</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Upcoming</span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
