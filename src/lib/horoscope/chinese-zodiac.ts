// Chinese zodiac — dated lunar-year ranges, NOT a flat January–December mapping.
//
// A Chinese year starts on Chinese New Year (late January / mid-February on the
// Gregorian calendar) and ends the day before the next Chinese New Year, so a
// person born in January or early February usually belongs to the previous
// year's animal. The ranges below are the published Chinese New Year tables
// cross-checked for 2008–2027 between MoonAstro's Chinese calendar table
// (moonastro.com/chinese/chinese calendar) and TravelChinaGuide's Chinese New
// Year dates list; the two agree exactly on every overlapping start date, and
// the Alibaba Chinese New Year animal list agrees on the same starts/ends.
// Dates outside 7 Feb 2008 – 5 Feb 2027 are deliberately NOT extrapolated:
// getChineseZodiacForDate returns null there instead of guessing a boundary.
//
// Traits are the traditional associations already used elsewhere in this
// codebase (src/types/horoscope.ts CHINESE_ANIMALS), labelled "traditionally
// associated with" in the UI — not predictions.

export interface ChineseYearRange {
  animal: string;
  emoji: string;
  traits: string;
  /** ISO date (YYYY-MM-DD) of Chinese New Year starting this lunar year. */
  start: string;
  /** ISO date (YYYY-MM-DD) of the last day of this lunar year. */
  end: string;
  /** Human-readable range, e.g. "25 Jan 2020 – 11 Feb 2021". */
  label: string;
}

// Chronological lunar years, Rat 2008 through Horse 2026. Each end date is the
// day before the next range's start date.
export const CHINESE_YEAR_RANGES: ChineseYearRange[] = [
  { animal: 'Rat', emoji: '🐀', traits: 'Clever, resourceful, quick-witted', start: '2008-02-07', end: '2009-01-25', label: '7 Feb 2008 – 25 Jan 2009' },
  { animal: 'Ox', emoji: '🐂', traits: 'Diligent, dependable, strong', start: '2009-01-26', end: '2010-02-13', label: '26 Jan 2009 – 13 Feb 2010' },
  { animal: 'Tiger', emoji: '🐅', traits: 'Brave, competitive, confident', start: '2010-02-14', end: '2011-02-02', label: '14 Feb 2010 – 2 Feb 2011' },
  { animal: 'Rabbit', emoji: '🐇', traits: 'Gentle, elegant, vigilant', start: '2011-02-03', end: '2012-01-22', label: '3 Feb 2011 – 22 Jan 2012' },
  { animal: 'Dragon', emoji: '🐉', traits: 'Confident, ambitious, noble', start: '2012-01-23', end: '2013-02-09', label: '23 Jan 2012 – 9 Feb 2013' },
  { animal: 'Snake', emoji: '🐍', traits: 'Wise, enigmatic, intuitive', start: '2013-02-10', end: '2014-01-30', label: '10 Feb 2013 – 30 Jan 2014' },
  { animal: 'Horse', emoji: '🐎', traits: 'Free-spirited, energetic, independent', start: '2014-01-31', end: '2015-02-18', label: '31 Jan 2014 – 18 Feb 2015' },
  { animal: 'Goat', emoji: '🐐', traits: 'Creative, gentle, compassionate', start: '2015-02-19', end: '2016-02-07', label: '19 Feb 2015 – 7 Feb 2016' },
  { animal: 'Monkey', emoji: '🐒', traits: 'Witty, curious, innovative', start: '2016-02-08', end: '2017-01-27', label: '8 Feb 2016 – 27 Jan 2017' },
  { animal: 'Rooster', emoji: '🐓', traits: 'Observant, confident, hardworking', start: '2017-01-28', end: '2018-02-15', label: '28 Jan 2017 – 15 Feb 2018' },
  { animal: 'Dog', emoji: '🐕', traits: 'Loyal, honest, reliable', start: '2018-02-16', end: '2019-02-04', label: '16 Feb 2018 – 4 Feb 2019' },
  { animal: 'Pig', emoji: '🐖', traits: 'Generous, sincere, diligent', start: '2019-02-05', end: '2020-01-24', label: '5 Feb 2019 – 24 Jan 2020' },
  { animal: 'Rat', emoji: '🐀', traits: 'Clever, resourceful, quick-witted', start: '2020-01-25', end: '2021-02-11', label: '25 Jan 2020 – 11 Feb 2021' },
  { animal: 'Ox', emoji: '🐂', traits: 'Diligent, dependable, strong', start: '2021-02-12', end: '2022-01-31', label: '12 Feb 2021 – 31 Jan 2022' },
  { animal: 'Tiger', emoji: '🐅', traits: 'Brave, competitive, confident', start: '2022-02-01', end: '2023-01-21', label: '1 Feb 2022 – 21 Jan 2023' },
  { animal: 'Rabbit', emoji: '🐇', traits: 'Gentle, elegant, vigilant', start: '2023-01-22', end: '2024-02-09', label: '22 Jan 2023 – 9 Feb 2024' },
  { animal: 'Dragon', emoji: '🐉', traits: 'Confident, ambitious, noble', start: '2024-02-10', end: '2025-01-28', label: '10 Feb 2024 – 28 Jan 2025' },
  { animal: 'Snake', emoji: '🐍', traits: 'Wise, enigmatic, intuitive', start: '2025-01-29', end: '2026-02-16', label: '29 Jan 2025 – 16 Feb 2026' },
  { animal: 'Horse', emoji: '🐎', traits: 'Free-spirited, energetic, independent', start: '2026-02-17', end: '2027-02-05', label: '17 Feb 2026 – 5 Feb 2027' },
];

/** Most recent range for each animal, in traditional cycle order Rat → Pig. */
export const CHINESE_ANIMALS_LATEST: ChineseYearRange[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig',
].map((animal) => {
  const ranges = CHINESE_YEAR_RANGES.filter((r) => r.animal === animal);
  return ranges[ranges.length - 1]!;
});

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
 * Look up the Chinese zodiac animal for a Gregorian birth date (YYYY-MM-DD)
 * using the dated lunar-year ranges above. Returns null for an invalid date
 * or a date outside the covered ranges — never a guessed boundary.
 */
export function getChineseZodiacForDate(isoDate: string): ChineseYearRange | null {
  if (!isValidIsoDate(isoDate)) return null;
  return CHINESE_YEAR_RANGES.find((r) => isoDate >= r.start && isoDate <= r.end) ?? null;
}

/** The lunar year containing today (UTC date), or null outside the ranges. */
export function getCurrentChineseYear(todayIso?: string): ChineseYearRange | null {
  const iso = todayIso ?? new Date().toISOString().slice(0, 10);
  return getChineseZodiacForDate(iso);
}

export const CHINESE_LOOKUP_WINDOW = '7 Feb 2008 – 5 Feb 2027';
