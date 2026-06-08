'use client';
import { motion } from 'framer-motion';
import { Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMoonCalendar } from '../../lib/apis/astro';
import { useState } from 'react';

interface Props {
  primaryColor: string;
}

const PHASE_COLORS: Record<string, string> = {
  'New Moon': 'bg-gray-900 text-white',
  'Waxing Crescent': 'bg-gray-200 text-gray-700',
  'First Quarter': 'bg-gray-400 text-white',
  'Waxing Gibbous': 'bg-gray-300 text-gray-800',
  'Full Moon': 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  'Waning Gibbous': 'bg-gray-300 text-gray-800',
  'Last Quarter': 'bg-gray-400 text-white',
  'Waning Crescent': 'bg-gray-200 text-gray-700',
};

export default function MoonCalendar({ primaryColor }: Props) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const calendar = getMoonCalendar(month, year);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else { setMonth(m => m - 1); }
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else { setMonth(m => m + 1); }
  };

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8"
    >
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Moon size={18} style={{ color: primaryColor }} />
          <h2 className="font-semibold text-gray-900 text-sm">Moon Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-5">
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'].map((phase) => (
            <span key={phase} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PHASE_COLORS[phase]}`}>
              {phase}
            </span>
          ))}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendar.map((day, i) => {
            const dayOfWeek = day.date.getDay();
            const isFirstWeek = i < 7;
            const offset = isFirstWeek ? dayOfWeek : 0;

            if (i === 0 && offset > 0) {
              return (
                <div key={`empty-${i}`} className="aspect-square" />,
                <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative">
                  <span className="font-medium text-gray-700">{day.date.getDate()}</span>
                  <span className="text-base leading-none">{day.emoji}</span>
                </div>
              );
            }

            const phaseClass = PHASE_COLORS[day.phaseName] ?? 'bg-gray-100 text-gray-700';
            const todayHighlight = isToday(day.date);

            return (
              <div
                key={i}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative cursor-pointer hover:ring-2 hover:ring-gray-200 transition-all ${
                  todayHighlight ? 'ring-2 ring-offset-1' : ''
                }`}
                style={todayHighlight ? { ringColor: primaryColor } : {}}
                title={`${day.date.toLocaleDateString()}: ${day.phaseName}`}
              >
                <span className={`font-medium ${todayHighlight ? '' : 'text-gray-600'}`} style={todayHighlight ? { color: primaryColor } : {}}>
                  {day.date.getDate()}
                </span>
                <span className="text-base leading-none">{day.emoji}</span>
              </div>
            );
          })}
        </div>

        {/* Current phase info */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{calendar.find(d => isToday(d.date))?.emoji ?? '\uD83C\uDF15'}</span>
            <div>
              <p className="text-xs text-gray-500">Today's Moon</p>
              <p className="text-sm font-semibold text-gray-900">
                {calendar.find(d => isToday(d.date))?.phaseName ?? 'Full Moon'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Next Full Moon</p>
            <p className="text-sm font-semibold" style={{ color: primaryColor }}>~14 days</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
