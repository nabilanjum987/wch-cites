'use client';
import Link from 'next/link';
import { useMemo } from 'react';

const SIGNS = [
  { name: 'Aries',       emoji: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire',  color: '#ef4444', slug: 'aries'       },
  { name: 'Taurus',      emoji: '♉', dates: 'Apr 20 – May 20', element: 'Earth', color: '#10b981', slug: 'taurus'      },
  { name: 'Gemini',      emoji: '♊', dates: 'May 21 – Jun 20', element: 'Air',   color: '#f59e0b', slug: 'gemini'      },
  { name: 'Cancer',      emoji: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', color: '#3b82f6', slug: 'cancer'      },
  { name: 'Leo',         emoji: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire',  color: '#f97316', slug: 'leo'         },
  { name: 'Virgo',       emoji: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', color: '#10b981', slug: 'virgo'       },
  { name: 'Libra',       emoji: '♎', dates: 'Sep 23 – Oct 22', element: 'Air',   color: '#a855f7', slug: 'libra'       },
  { name: 'Scorpio',     emoji: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', color: '#6366f1', slug: 'scorpio'     },
  { name: 'Sagittarius', emoji: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire',  color: '#ef4444', slug: 'sagittarius' },
  { name: 'Capricorn',   emoji: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', color: '#84cc16', slug: 'capricorn'   },
  { name: 'Aquarius',    emoji: '♒', dates: 'Jan 20 – Feb 18', element: 'Air',   color: '#06b6d4', slug: 'aquarius'    },
  { name: 'Pisces',      emoji: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', color: '#8b5cf6', slug: 'pisces'      },
];

const CHINESE_YEARS: Record<number, { animal: string; emoji: string }> = {
  2024: { animal: 'Dragon', emoji: '🐉' },
  2025: { animal: 'Snake',  emoji: '🐍' },
  2026: { animal: 'Horse',  emoji: '🐎' },
};

function getTodaySign() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return SIGNS[0];
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return SIGNS[1];
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return SIGNS[2];
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return SIGNS[3];
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return SIGNS[4];
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return SIGNS[5];
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return SIGNS[6];
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return SIGNS[7];
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return SIGNS[8];
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return SIGNS[9];
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return SIGNS[10];
  return SIGNS[11];
}

export default function HoroscopeSection() {
  const todaySign = useMemo(() => getTodaySign(), []);
  const year = new Date().getFullYear();
  const chineseYear = CHINESE_YEARS[year] || { animal: 'Dragon', emoji: '🐉' };
  const hijriDate = new Date().toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Today's cosmic snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href={`/horoscope/${todaySign.slug}`} className="no-underline group">
          <div className="rounded-2xl border p-5 h-full transition-all group-hover:scale-[1.01]"
            style={{ background: `linear-gradient(135deg, ${todaySign.color}20, #0a0f1e)`, borderColor: `${todaySign.color}40` }}>
            <div className="text-4xl mb-3">{todaySign.emoji}</div>
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Today's Western Sign</div>
            <div className="text-white font-bold text-xl">{todaySign.name}</div>
            <div className="text-white/50 text-sm mt-1">{todaySign.dates}</div>
            <div className="text-white/30 text-xs mt-2">{todaySign.element} sign · Full reading →</div>
          </div>
        </Link>

        <Link href="/horoscope" className="no-underline group">
          <div className="rounded-2xl border p-5 h-full transition-all group-hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), #0a0f1e)', borderColor: 'rgba(245,158,11,0.3)' }}>
            <div className="text-4xl mb-3">{chineseYear.emoji}</div>
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Chinese Zodiac {year}</div>
            <div className="text-white font-bold text-xl">Year of the {chineseYear.animal}</div>
            <div className="text-white/50 text-sm mt-1">木 Wood element</div>
            <div className="text-white/30 text-xs mt-2">Chinese traditions & forecast →</div>
          </div>
        </Link>

        <Link href="/horoscope" className="no-underline group">
          <div className="rounded-2xl border p-5 h-full transition-all group-hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), #0a0f1e)', borderColor: 'rgba(16,185,129,0.3)' }}>
            <div className="text-4xl mb-3">☪️</div>
            <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Islamic Calendar</div>
            <div className="text-white font-bold text-lg">{hijriDate}</div>
            <div className="text-white/50 text-sm mt-1">Hijri date · Moon sighting</div>
            <div className="text-white/30 text-xs mt-2">Full Islamic & Hebrew calendar →</div>
          </div>
        </Link>
      </div>

      {/* All 12 signs grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {SIGNS.map((s) => (
          <Link key={s.slug} href={`/horoscope/${s.slug}`} className="no-underline group">
            <div className="rounded-xl border p-3 text-center transition-all group-hover:scale-[1.03]"
              style={{ backgroundColor: `${s.color}10`, borderColor: `${s.color}30` }}>
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="text-white text-xs font-semibold">{s.name}</div>
              <div className="text-white/30 text-xs">{s.element}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <Link href="/horoscope"
          className="inline-block px-6 py-2.5 rounded-full border text-sm font-medium text-white/70 hover:text-white transition-all no-underline"
          style={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
          Full Horoscope — All Traditions →
        </Link>
      </div>
    </div>
  );
}
