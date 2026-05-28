import { motion } from 'framer-motion';

interface WeeklyTableProps {
  days: { date: string; fajr: string; dhuhr: string; asr: string; maghrib: string; isha: string }[];
}

export default function WeeklyTable({ days }: WeeklyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-3 py-2 text-left text-gray-600">Date</th>
            <th className="px-3 py-2 text-emerald-600">Fajr</th>
            <th className="px-3 py-2 text-orange-600">Dhuhr</th>
            <th className="px-3 py-2 text-yellow-600">Asr</th>
            <th className="px-3 py-2 text-red-600">Maghrib</th>
            <th className="px-3 py-2 text-indigo-600">Isha</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d, i) => (
            <motion.tr
              key={d.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-3 py-2 font-medium">{d.date}</td>
              <td className="px-3 py-2">{d.fajr}</td>
              <td className="px-3 py-2">{d.dhuhr}</td>
              <td className="px-3 py-2">{d.asr}</td>
              <td className="px-3 py-2">{d.maghrib}</td>
              <td className="px-3 py-2">{d.isha}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
