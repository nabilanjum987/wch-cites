import { useState } from 'react';
import {
  CHINESE_ANIMALS_LATEST,
  CHINESE_LOOKUP_WINDOW,
  getChineseZodiacForDate,
  getCurrentChineseYear,
} from '@/lib/horoscope/chinese-zodiac';

export default function ChineseZodiacSection() {
  const [birthDate, setBirthDate] = useState('2026-03-01');
  const result = getChineseZodiacForDate(birthDate);
  const current = getCurrentChineseYear();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          The Chinese zodiac runs in a 12-animal cycle — Rat, Ox, Tiger, Rabbit, Dragon, Snake,
          Horse, Goat, Monkey, Rooster, Dog, Pig — but each animal&apos;s year starts on Chinese New
          Year, not on 1 January. Someone born in January or early February therefore usually
          belongs to the previous year&apos;s animal. The table shows each animal&apos;s most recent
          lunar year with its exact dates; traits are the traditional associations for each animal.
        </p>

        {current && (
          <p className="text-sm font-semibold text-gray-900 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
            Current Chinese year: {current.emoji} Year of the {current.animal} ({current.label}).
          </p>
        )}

        <div className="overflow-x-auto mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-2 pr-3 font-semibold">Animal</th>
                <th className="py-2 pr-3 font-semibold">Most recent lunar year</th>
                <th className="py-2 font-semibold">Traditionally associated with</th>
              </tr>
            </thead>
            <tbody>
              {CHINESE_ANIMALS_LATEST.map((row) => (
                <tr key={row.animal} className="border-b border-gray-100 last:border-0">
                  <td className="py-2 pr-3 font-semibold text-gray-900 whitespace-nowrap">
                    {row.emoji} {row.animal}
                  </td>
                  <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{row.label}</td>
                  <td className="py-2 text-gray-700">{row.traits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <label htmlFor="chinese-birth-date" className="block text-sm font-semibold text-gray-900 mb-2">
            Find your Chinese animal — enter a birth date
          </label>
          <input
            id="chinese-birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
          />
          {result ? (
            <p className="text-sm text-gray-800 leading-relaxed mt-3">
              <span className="text-2xl mr-1">{result.emoji}</span>
              <strong>{birthDate} falls in the Year of the {result.animal}</strong> ({result.label}) —
              traditionally associated with: {result.traits.toLowerCase()}.
              Note the boundary: a date just before {result.start} would belong to the previous animal.
            </p>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              That date is outside the dated ranges covered on this page ({CHINESE_LOOKUP_WINDOW}).
              The 12 animals repeat in the same order, but each year&apos;s exact boundary is its
              Chinese New Year date, so a January–December year mapping is not used here.
            </p>
          )}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mt-4">
          Sources for the year ranges: MoonAstro Chinese calendar table (Chinese New Year start and
          end dates, 1924–2044) and TravelChinaGuide Chinese New Year dates list; the two agree
          exactly on every overlapping start date in the covered window. Traditional associations
          only — for entertainment, not predictions.
        </p>
      </div>
    </div>
  );
}
