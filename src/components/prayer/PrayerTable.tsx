import { motion } from 'framer-motion';

export interface PrayerRow {
  name: string;
  time: string;
  passed?: boolean;
  current?: boolean;
}

interface PrayerTableProps {
  prayers: PrayerRow[];
}

export default function PrayerTable({ prayers }: PrayerTableProps) {
  return (
    <div className="space-y-2">
      {prayers.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center justify-between p-3 rounded-xl ${
            p.current
              ? 'bg-emerald-100 border-2 border-emerald-500'
              : p.passed
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gray-50'
          }`}
        >
          <span className="font-medium">{p.name}</span>
          <span className="font-bold text-lg">{p.time}</span>
        </motion.div>
      ))}
    </div>
  );
}
