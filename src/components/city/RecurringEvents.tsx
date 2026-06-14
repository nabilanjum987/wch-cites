import { motion } from 'framer-motion';
import { Repeat, Clock, MapPin, ExternalLink } from 'lucide-react';
import type { RecurringEvent, EventCategory } from '../../types/city';

const CATEGORY_COLORS: Record<EventCategory, string> = {
  sports: 'bg-blue-100 text-blue-700',
  culture: 'bg-amber-100 text-amber-700',
  music: 'bg-pink-100 text-pink-700',
  literature: 'bg-emerald-100 text-emerald-700',
  food: 'bg-orange-100 text-orange-700',
  religious: 'bg-teal-100 text-teal-700',
  business: 'bg-slate-100 text-slate-700',
  film: 'bg-red-100 text-red-700',
  outdoor: 'bg-green-100 text-green-700',
  family: 'bg-yellow-100 text-yellow-700',
  conferences: 'bg-cyan-100 text-cyan-700',
};

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
  events: RecurringEvent[];
  primaryColor: string;
}

export default function RecurringEvents({ events, primaryColor }: Props) {
  if (events.length === 0) return null;

  const sorted = [...events].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Repeat size={18} style={{ color: primaryColor }} />
        <h2 className="font-semibold text-gray-900 text-sm">Weekly Regulars</h2>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{events.length}</span>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-xs font-medium">
              <th className="text-left px-5 py-3 font-medium">Day</th>
              <th className="text-left px-5 py-3 font-medium">Time</th>
              <th className="text-left px-5 py-3 font-medium">Event</th>
              <th className="text-left px-5 py-3 font-medium">Venue</th>
              <th className="text-left px-5 py-3 font-medium">Type</th>
              <th className="text-center px-5 py-3 font-medium">Recurring</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ev) => {
              const catStyle = CATEGORY_COLORS[ev.category] ?? 'bg-gray-100 text-gray-600';
              const isCurrentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === ev.day;
              return (
                <tr
                  key={ev.id}
                  className={`border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors ${isCurrentDay ? 'bg-gray-50/80' : ''}`}
                >
                  <td className="px-5 py-3">
                    <span className={`font-medium ${isCurrentDay ? '' : 'text-gray-700'}`} style={isCurrentDay ? { color: primaryColor } : {}}>
                      {ev.day}
                      {isCurrentDay && <span className="ml-1 text-xs opacity-70">(today)</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    {ev.time}
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {ev.title}
                    {ev.is_free && <span className="ml-2 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-semibold">Free</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500 flex items-center gap-1">
                    <MapPin size={12} className="text-gray-400" />
                    {ev.venue}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-lg ${catStyle}`}>
                      {ev.category.charAt(0).toUpperCase() + ev.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Repeat size={13} style={{ color: primaryColor }} />
                      <span className="text-xs text-gray-400">Every {ev.day}</span>
                    </div>
                    {ev.website && (
                      <a href={ev.website} target="_blank" rel="noopener noreferrer" className="text-xs hover:underline mt-0.5 inline-flex items-center gap-0.5" style={{ color: primaryColor }}>
                        <ExternalLink size={10} /> link
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-gray-50">
        {sorted.map((ev) => {
          const isCurrentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === ev.day;
          return (
            <div key={ev.id} className={`px-5 py-4 ${isCurrentDay ? 'bg-gray-50/80' : ''}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm" style={isCurrentDay ? { color: primaryColor } : {}} >
                  {ev.day}
                  {isCurrentDay && <span className="ml-1 text-xs opacity-70">(today)</span>}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} /> {ev.time}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {ev.title}
                {ev.is_free && <span className="ml-2 text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded font-semibold">Free</span>}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={11} /> {ev.venue}
                <span className="mx-1">·</span>
                <Repeat size={11} style={{ color: primaryColor }} /> Every {ev.day}
              </p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
