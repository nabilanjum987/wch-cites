// Life-path numerology — a stated, standard reduction method, computed
// honestly from the date the visitor enters. Nothing here is a prediction:
// numbers are labelled with their traditional associations only.
//
// METHOD (Pythagorean life path, as commonly stated): add every digit of the
// full birth date (month + day + year). If the total is a single digit, that
// is the life path. Otherwise add its digits again, and keep reducing —
// EXCEPT that the master numbers 11, 22 and 33 are not reduced further.
// That master-number exception is part of the stated method, not an
// after-the-fact adjustment: e.g. a digit total of 22 stays 22.
//
// Worked examples (hand-verified, also shown on the page):
//   15 Jul 1990 → 0+7+1+5+1+9+9+0 = 32 → 3+2 = 5  (life path 5)
//   2 Jan 1990  → 0+1+0+2+1+9+9+0 = 22 → master 22, not reduced to 4
//
// Meanings 1–9 reuse the traditional keywords already used elsewhere in this
// codebase (src/lib/apis/astro.ts NUMEROLOGY_MEANINGS); 11, 22, 33 use their
// standard traditional labels (Intuition, Master Builder, Master Teacher).

export interface LifePathResult {
  number: number;
  /** Human-readable reduction chain, e.g. "0+7+1+5+1+9+9+0 = 32 → 3+2 = 5". */
  steps: string;
  isMaster: boolean;
}

export interface LifePathMeaning {
  number: number;
  title: string;
  focus: string;
}

export const LIFE_PATH_MEANINGS: LifePathMeaning[] = [
  { number: 1, title: 'Leadership', focus: 'New beginnings, independence, initiative, pioneering spirit' },
  { number: 2, title: 'Harmony', focus: 'Partnership, balance, cooperation, diplomacy, sensitivity' },
  { number: 3, title: 'Creativity', focus: 'Self-expression, joy, communication, artistic pursuits, optimism' },
  { number: 4, title: 'Structure', focus: 'Stability, hard work, practicality, building foundations, discipline' },
  { number: 5, title: 'Freedom', focus: 'Change, adventure, adaptability, versatility, resourcefulness' },
  { number: 6, title: 'Nurturing', focus: 'Love, family, responsibility, care, harmony in relationships, service' },
  { number: 7, title: 'Wisdom', focus: 'Spirituality, introspection, analysis, inner knowledge, seeking truth' },
  { number: 8, title: 'Power', focus: 'Abundance, success, authority, material mastery, karma, achievement' },
  { number: 9, title: 'Completion', focus: 'Humanitarianism, compassion, endings, transformation, universal love' },
  { number: 11, title: 'Intuition (master number)', focus: 'Insight, inspiration and heightened sensitivity, traditionally read as a master number rather than reduced to 2' },
  { number: 22, title: 'Master Builder (master number)', focus: 'Turning large ideas into practical form, traditionally read as a master number rather than reduced to 4' },
  { number: 33, title: 'Master Teacher (master number)', focus: 'Teaching, healing and service to others, traditionally read as a master number rather than reduced to 6' },
];

export function getLifePathMeaning(number: number): LifePathMeaning | null {
  return LIFE_PATH_MEANINGS.find((m) => m.number === number) ?? null;
}

const MASTER_NUMBERS = [11, 22, 33];

function digitSum(n: number): number {
  return String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
}

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/**
 * Compute the life-path number for a birth date (YYYY-MM-DD).
 * Returns null for an invalid date. The returned `steps` string shows every
 * reduction step so the visitor can check the arithmetic.
 */
export function computeLifePath(isoDate: string): LifePathResult | null {
  if (!isValidIsoDate(isoDate)) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  const digits = `${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}${year}`;
  const digitList = digits.split('').map(Number);
  let total = digitList.reduce((sum, d) => sum + d, 0);
  const chain: string[] = [`${digitList.join('+')} = ${total}`];
  while (total > 9 && !MASTER_NUMBERS.includes(total)) {
    const next = digitSum(total);
    chain.push(`${String(total).split('').join('+')} = ${next}`);
    total = next;
  }
  return {
    number: total,
    steps: chain.join(' → '),
    isMaster: MASTER_NUMBERS.includes(total),
  };
}
