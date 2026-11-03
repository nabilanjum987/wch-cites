import { useState } from 'react';
import {
  LIFE_PATH_MEANINGS,
  computeLifePath,
  getLifePathMeaning,
} from '@/lib/horoscope/numerology';

export default function LifePathNumerology() {
  const [birthDate, setBirthDate] = useState('1990-07-15');
  const result = computeLifePath(birthDate);
  const meaning = result ? getLifePathMeaning(result.number) : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          <strong>Method (stated, standard reduction):</strong> add every digit of the full birth
          date (month + day + year). If the total is a single digit, that is the life-path number.
          Otherwise add its digits again and keep reducing — except that the master numbers 11, 22
          and 33 are not reduced further. The calculator below shows every step, so the arithmetic
          can be checked by hand.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-5">
          <label htmlFor="lifepath-birth-date" className="block text-sm font-semibold text-gray-900 mb-2">
            Find your life-path number — enter a birth date
          </label>
          <input
            id="lifepath-birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full sm:w-auto rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white"
          />
          {result && meaning ? (
            <div className="mt-3">
              <p className="text-sm text-gray-800 leading-relaxed">
                <strong>Life-path number: {result.number}</strong>
                {result.isMaster ? ' (master number — not reduced further)' : ''} — {meaning.title}.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-1">
                Working: {result.steps}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-1">
                Traditionally associated with: {meaning.focus.toLowerCase()}.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed mt-3">
              Enter a valid birth date to compute a life-path number.
            </p>
          )}
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-1">
          <strong>Worked examples (hand-verified):</strong>
        </p>
        <ul className="text-sm text-gray-700 leading-relaxed list-disc pl-5 mb-5 space-y-1">
          <li>15 Jul 1990 → 0+7+1+5+1+9+9+0 = 32 → 3+2 = 5 — life path 5 (Freedom).</li>
          <li>2 Jan 1990 → 0+1+0+2+1+9+9+0 = 22 — master number 22, not reduced to 4.</li>
        </ul>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {LIFE_PATH_MEANINGS.map((m) => (
            <div key={m.number} className="bg-gray-50 rounded-xl p-3">
              <p className="text-lg font-bold text-gray-900">{m.number}</p>
              <p className="text-sm font-semibold text-gray-800">{m.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed mt-1">{m.focus}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mt-4">
          Traditional associations only — the number is a computation from a date, not a prediction
          about a person. Meanings 1–9 follow the traditional keywords already used on this site;
          11, 22 and 33 are the standard traditional master-number readings.
        </p>
      </div>
    </div>
  );
}
