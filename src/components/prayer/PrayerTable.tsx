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
  accent?: string;
}

const TYPE_BADGE: Record<PrayerRow['type'], string> = {
  fard: 'bg-emerald-500/20 text-emerald-300',
  sunnah: 'bg-sky-500/20 text-sky-300',
  optional: 'bg-amber-500/20 text-amber-300',
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

export default function PrayerTable({ rows, accent = '#10b981' }: Props) {
  const nowMins = new Date().getHours() * 60 + new Date().getMinutes();

  return (
    <div className="overflow-hidden rounded-2xl border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <th className="text-left px-4 py-3 font-semibold text-white/50">Prayer</th>
            <th className="text-left px-4 py-3 font-semibold text-white/50 hidden sm:table-cell">Arabic</th>
            <th className="text-left px-4 py-3 font-semibold text-white/50">Time</th>
            <th className="text-left px-4 py-3 font-semibold text-white/50 hidden md:table-cell">Type</th>
            <th className="text-right px-4 py-3 font-semibold text-white/50">Status</th>
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
                className="transition-colors"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  backgroundColor: active ? `${accent}1f` : 'transparent',
                }}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {row.icon && <span className="text-lg">{row.icon}</span>}
                    <span className="font-semibold" style={{ color: active ? accent : '#fff' }}>
                      {row.name}
                    </span>
                    {active && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accent }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accent }} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="text-white/45 font-arabic text-base">{row.arabicName}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="font-mono font-semibold" style={{ color: active ? accent : 'rgba(255,255,255,0.8)' }}>
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
                    <span className="font-semibold text-xs" style={{ color: accent }}>Current</span>
                  ) : passed ? (
                    <span className="text-white/30 text-xs">Done</span>
                  ) : (
                    <span className="text-white/30 text-xs">Upcoming</span>
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
