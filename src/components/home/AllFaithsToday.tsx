'use client';
import { Calendar } from 'lucide-react';

const faithCalendars = [
  {
    faith: 'Islamic',
    symbol: '☪️',
    color: '#34d399',
    border: 'border-emerald-400/30',
    bg: 'from-emerald-500/10 to-teal-500/10',
    date: '24 Dhul Hijjah 1446 AH',
    event: 'Days of Tashreeq ending',
    calendar: 'Hijri Calendar',
  },
  {
    faith: 'Christian',
    symbol: '✝️',
    color: '#60a5fa',
    border: 'border-blue-400/30',
    bg: 'from-blue-500/10 to-indigo-500/10',
    date: '23 June 2026',
    event: 'Feast of St. John the Baptist',
    calendar: 'Gregorian Calendar',
  },
  {
    faith: 'Hindu',
    symbol: '🕉️',
    color: '#fb923c',
    border: 'border-orange-400/30',
    bg: 'from-orange-500/10 to-red-500/10',
    date: 'Ashadha Shukla Pratipada',
    event: 'Ashadhi Ekadashi approaching',
    calendar: 'Hindu Panchang',
  },
  {
    faith: 'Jewish',
    symbol: '✡️',
    color: '#a78bfa',
    border: 'border-violet-400/30',
    bg: 'from-violet-500/10 to-purple-500/10',
    date: '17 Tammuz 5786',
    event: 'Fast of 17th of Tammuz',
    calendar: 'Hebrew Calendar',
  },
  {
    faith: 'Buddhist',
    symbol: '☸️',
    color: '#c084fc',
    border: 'border-purple-400/30',
    bg: 'from-purple-500/10 to-pink-500/10',
    date: 'Ashadha Full Moon',
    event: 'Dhamma Day (Asalha Puja)',
    calendar: 'Buddhist Calendar',
  },
  {
    faith: 'Sikh',
    symbol: '🪯',
    color: '#fbbf24',
    border: 'border-amber-400/30',
    bg: 'from-amber-500/10 to-yellow-500/10',
    date: '23 Har 556 Nanakshahi',
    event: 'Regular Gurmat Sangat',
    calendar: 'Nanakshahi Calendar',
  },
  {
    faith: 'Secular',
    symbol: '🌍',
    color: '#94a3b8',
    border: 'border-slate-400/30',
    bg: 'from-slate-500/10 to-gray-500/10',
    date: '23 June 2026 — Tuesday',
    event: 'International Olympic Day',
    calendar: 'Gregorian / UN Calendar',
  },
];

export default function AllFaithsToday() {
  return (
    <div className="mb-4">
      {/* SEO Paragraph */}
      <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-4xl">
        The world runs on many different calendars at the same time. Today in the Islamic world it is
        a date in the Hijri calendar. In Jewish communities, the Hebrew date marks its own cycle of
        observance. Hindu families follow the Panchang for auspicious timings, and Buddhist
        communities track lunar months for Dhamma events. WorldCityHub shows you every major faith
        calendar side by side, so you always know what day it is for every community on earth.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {faithCalendars.slice(0, 4).map((f) => <FaithCard key={f.faith} f={f} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {faithCalendars.slice(4).map((f) => <FaithCard key={f.faith} f={f} />)}
      </div>
    </div>
  );
}

function FaithCard({ f }: { f: typeof faithCalendars[0] }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${f.bg} border ${f.border} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl leading-none">{f.symbol}</span>
        <div>
          <div className="text-white font-semibold text-sm">{f.faith}</div>
          <div className="text-gray-500 text-xs">{f.calendar}</div>
        </div>
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: f.color }}>{f.date}</div>
      <div className="text-gray-400 text-xs leading-snug">{f.event}</div>
    </div>
  );
}
