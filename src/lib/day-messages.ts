// Day-message library + special-day resolver (special-day cards feature,
// owner ruling 3 Nov 2026: wish/share cards are a "very important
// feature", with a professionally written message for each day and the
// tone matched to the day; celebratory for festivals and national days,
// solemn and respectful for remembrance days, never mixed).
//
// The days covered are the days the site's own data already carries:
// Pakistan's fixed-date national public holidays (the set seeded by
// migration 0003 and listed on the country page), the Islamic days the
// country page lists as "Varies (Islamic)", the Christian and Hindu and
// Sikh festivals the faith profiles name (Christmas, Easter, Diwali,
// Holi, Baisakhi), and the universal greeting days. No day is listed
// here that the site does not already observe somewhere.
//
// Dates are never invented:
//   * fixed days resolve by month and day;
//   * Mother's Day and Father's Day resolve by their Sunday rule;
//   * Easter and Good Friday resolve by the standard computus;
//   * Islamic days resolve by Hijri month and day against the Islamic
//     calendar (Intl, Umm al-Qura), the same live-computed approach the
//     Pakistan page's faith calendar uses. Official moon-sighting
//     announcements can shift an Islamic date by a day;
//   * Diwali and Holi follow the Hindu lunisolar calendar, so their
//     Gregorian dates live in a small table checked against published
//     panchang calendars (Diwali: 8 Nov 2026, 29 Oct 2027; Holi: 4 Mar
//     2026, 22 Mar 2027). A year missing from the table simply has no
//     occurrence here until the table is extended; nothing is guessed.
//
// English only. No em dashes anywhere in this copy, by the site rule.

export type DayTone = 'celebratory' | 'solemn' | 'reverent' | 'warm';

export type DayRule =
  | { kind: 'fixed'; month: number; day: number }
  | { kind: 'nth-weekday'; month: number; weekday: number; n: number }
  | { kind: 'hijri'; month: number; day: number }
  | { kind: 'easter-offset'; offset: number }
  | { kind: 'table'; dates: Record<number, { month: number; day: number }> };

export interface DayMessage {
  key: string;
  name: string;
  scope: string;
  tone: DayTone;
  rule: DayRule;
  /** Human label for when the day falls, shown in the library list. */
  dateLabel: string;
  headline: string;
  message: string;
  shareText: string;
}

export interface DateParts {
  y: number;
  m: number; // 1..12
  d: number;
}

export const DAY_MESSAGES: DayMessage[] = [
  // ── Pakistan national days ────────────────────────────────────────
  {
    key: 'kashmir-day',
    name: 'Kashmir Day',
    scope: 'Pakistan',
    tone: 'solemn',
    rule: { kind: 'fixed', month: 2, day: 5 },
    dateLabel: '5 February',
    headline: 'A Day of Solidarity with Kashmir',
    message:
      'On Kashmir Day, Pakistan speaks with one voice for the people of Jammu and Kashmir and their right to decide their own future. It is a day of peaceful resolve, remembrance and prayer for families who live under occupation. WorldCityHub joins in honouring their courage and their hope.',
    shareText:
      'Today is Kashmir Day. Standing in solidarity with the people of Kashmir and their right to self-determination.',
  },
  {
    key: 'pakistan-day',
    name: 'Pakistan Day',
    scope: 'Pakistan',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 3, day: 23 },
    dateLabel: '23 March',
    headline: 'Pakistan Day Mubarak',
    message:
      'On 23 March 1940, the Lahore Resolution set a nation on its path. Today we celebrate that courage and the promise Pakistan still carries. May the country grow in peace, learning and prosperity.',
    shareText:
      'Happy Pakistan Day. On this day in 1940, the Lahore Resolution lit the path to a homeland.',
  },
  {
    key: 'labour-day',
    name: 'Labour Day',
    scope: 'Pakistan and worldwide',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 5, day: 1 },
    dateLabel: '1 May',
    headline: 'Honouring the Hands That Build',
    message:
      'Every road, harvest, classroom and hospital in Pakistan stands on the work of its labourers. Labour Day is our chance to thank them properly, and to argue for fair pay, safe work and dignity for all. Respect for work is respect for the nation.',
    shareText:
      'Happy Labour Day. Thank you to every worker whose hands build Pakistan, today and every day.',
  },
  {
    key: 'youm-e-takbeer',
    name: 'Youm-e-Takbeer',
    scope: 'Pakistan',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 5, day: 28 },
    dateLabel: '28 May',
    headline: 'Youm-e-Takbeer Mubarak',
    message:
      'On 28 May, Pakistan marks the day it became a nuclear power in 1998 and secured its defence for generations. Youm-e-Takbeer is a day of gratitude for the scientists, soldiers and citizens who made the country safe. May Pakistan always pair strength with peace.',
    shareText:
      'Youm-e-Takbeer Mubarak. Today Pakistan remembers 28 May 1998 and honours everyone who made its defence secure.',
  },
  {
    key: 'independence-day-pakistan',
    name: 'Independence Day',
    scope: 'Pakistan',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 8, day: 14 },
    dateLabel: '14 August',
    headline: 'Happy Independence Day, Pakistan',
    message:
      'On 14 August 1947, a homeland was born from sacrifice, hope and an unshakeable belief in a better future. Today the flags fly for the generations who dreamed it and the generations still building it. Pakistan Zindabad, today and always.',
    shareText: 'Happy Independence Day. Pakistan Zindabad. Celebrating 14 August with pride and gratitude.',
  },
  {
    key: 'defence-day',
    name: 'Defence Day',
    scope: 'Pakistan',
    tone: 'solemn',
    rule: { kind: 'fixed', month: 9, day: 6 },
    dateLabel: '6 September',
    headline: 'In Memory of Our Martyrs',
    message:
      "Defence Day honours the soldiers and citizens who defended Pakistan in September 1965, and every martyr who has stood guard since. We remember their names, their families and their sacrifice with gratitude and prayer. May their courage always protect this homeland.",
    shareText: "Today is Defence Day. We remember Pakistan's martyrs and defenders with gratitude and prayer.",
  },
  {
    key: 'iqbal-day',
    name: 'Iqbal Day',
    scope: 'Pakistan',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 11, day: 9 },
    dateLabel: '9 November',
    headline: 'Iqbal Day Mubarak',
    message:
      'Today Pakistan celebrates the birth of Allama Iqbal, the poet philosopher who taught a nation to believe in itself. His call to rise, to strive and to know your own worth still speaks to every young Pakistani. May his words keep lighting the way.',
    shareText: 'Happy Iqbal Day. Remembering Allama Iqbal, whose poetry taught a nation to believe in itself.',
  },
  {
    key: 'quaid-e-azam-day',
    name: 'Quaid-e-Azam Day',
    scope: 'Pakistan',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 12, day: 25 },
    dateLabel: '25 December',
    headline: 'Quaid-e-Azam Day Mubarak',
    message:
      'On 25 December, Pakistan celebrates the birthday of Muhammad Ali Jinnah, the founder whose discipline, honesty and faith built a nation. His words still set our standard: unity, faith and discipline. May we live up to the country he imagined.',
    shareText: 'Happy Quaid-e-Azam Day. Remembering Muhammad Ali Jinnah, founder of Pakistan, on his birthday.',
  },
  // ── Islamic days (Hijri rules) ────────────────────────────────────
  {
    key: 'islamic-new-year',
    name: 'Islamic New Year',
    scope: 'Muslim',
    tone: 'reverent',
    rule: { kind: 'hijri', month: 1, day: 1 },
    dateLabel: '1 Muharram',
    headline: 'Islamic New Year Mubarak',
    message:
      'The Islamic year opens with Muharram and the memory of the Hijrah, the journey that began a new chapter of faith and community. May this year bring you peace, patience and closeness to what matters most. Muharram Mubarak to you and your family.',
    shareText: 'Islamic New Year Mubarak. May the new Hijri year bring peace and blessings to you and your family.',
  },
  {
    key: 'ashura',
    name: 'Ashura',
    scope: 'Muslim',
    tone: 'solemn',
    rule: { kind: 'hijri', month: 1, day: 10 },
    dateLabel: '10 Muharram',
    headline: 'Ashura: A Day of Remembrance',
    message:
      'On Ashura, we remember Karbala and the stand of Imam Hussain, his family and his companions against injustice. It is a day of mourning, reflection and prayer, and a lesson that truth is worth every sacrifice. May we carry its courage with humility.',
    shareText: 'Today is Ashura, a day of remembrance for Karbala and the sacrifice of Imam Hussain.',
  },
  {
    key: 'eid-milad-un-nabi',
    name: 'Eid Milad-un-Nabi',
    scope: 'Muslim',
    tone: 'reverent',
    rule: { kind: 'hijri', month: 3, day: 12 },
    dateLabel: '12 Rabi al-Awwal',
    headline: 'Eid Milad-un-Nabi Mubarak',
    message:
      'On Rabi al-Awwal 12, Muslims celebrate the birth of the Prophet Muhammad (peace be upon him), whose life is a lesson in mercy, honesty and kindness. Homes and mosques light up with gratitude and with love for his example. May his teachings fill your life with light.',
    shareText: 'Eid Milad-un-Nabi Mubarak. Celebrating the birth of the Prophet Muhammad (peace be upon him).',
  },
  {
    key: 'ramadan-start',
    name: 'Ramadan Begins',
    scope: 'Muslim',
    tone: 'reverent',
    rule: { kind: 'hijri', month: 9, day: 1 },
    dateLabel: '1 Ramadan',
    headline: 'Ramadan Mubarak',
    message:
      'The month of Ramadan has begun: thirty days of fasting, prayer, charity and quiet reflection. May your fasts be accepted, your table be shared and your heart grow lighter with every evening. Ramadan Mubarak to you and everyone you love.',
    shareText: 'Ramadan Mubarak. May this blessed month bring peace, patience and answered prayers.',
  },
  {
    key: 'eid-ul-fitr',
    name: 'Eid ul-Fitr',
    scope: 'Muslim',
    tone: 'celebratory',
    rule: { kind: 'hijri', month: 10, day: 1 },
    dateLabel: '1 Shawwal',
    headline: 'Eid Mubarak',
    message:
      'After a month of fasting and prayer, Eid ul-Fitr arrives with sweet dishes, new clothes and doors open to everyone. May your home fill with laughter, your Eidi be generous and your heart stay as light as this morning. Eid Mubarak to you and your family.',
    shareText: 'Eid Mubarak. Wishing you and your family a joyful Eid ul-Fitr full of sweetness and togetherness.',
  },
  {
    key: 'eid-ul-adha',
    name: 'Eid ul-Adha',
    scope: 'Muslim',
    tone: 'celebratory',
    rule: { kind: 'hijri', month: 12, day: 10 },
    dateLabel: '10 Dhu al-Hijjah',
    headline: 'Eid ul-Adha Mubarak',
    message:
      'Eid ul-Adha honours the devotion of Prophet Ibrahim and the spirit of giving that defines this festival. As families share the sacrifice with neighbours and the poor, the whole community eats together. May your sacrifice and your generosity be accepted. Eid Mubarak.',
    shareText: 'Eid ul-Adha Mubarak. May your sacrifice be accepted and your table be shared with everyone.',
  },
  // ── Christian days ────────────────────────────────────────────────
  {
    key: 'good-friday',
    name: 'Good Friday',
    scope: 'Christian',
    tone: 'solemn',
    rule: { kind: 'easter-offset', offset: -2 },
    dateLabel: 'The Friday before Easter',
    headline: 'Good Friday: A Day of Reflection',
    message:
      'On Good Friday, Christians remember the crucifixion of Jesus Christ and the depth of his sacrifice. Churches fall quiet, prayers rise and the day is kept in solemn reflection. We join our Christian neighbours in respecting this holy day.',
    shareText: 'Today is Good Friday, a solemn day of reflection for Christians around the world.',
  },
  {
    key: 'easter',
    name: 'Easter Sunday',
    scope: 'Christian',
    tone: 'reverent',
    rule: { kind: 'easter-offset', offset: 0 },
    dateLabel: 'Easter Sunday (March or April)',
    headline: 'Happy Easter',
    message:
      'Easter Sunday celebrates the resurrection of Jesus Christ, the heart of the Christian faith and a message of hope over despair. Families gather, churches fill with song and spring itself seems to agree. Happy Easter to our Christian community in Pakistan and everywhere.',
    shareText: 'Happy Easter. Wishing our Christian friends a day of hope, renewal and joy.',
  },
  {
    key: 'christmas',
    name: 'Christmas Day',
    scope: 'Christian',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 12, day: 25 },
    dateLabel: '25 December',
    headline: 'Merry Christmas',
    message:
      'On 25 December, Christians in Pakistan and around the world celebrate the birth of Jesus Christ with prayer, family and generosity. Homes glow, choirs sing and no guest leaves unfed. Merry Christmas to our Christian community, and peace to every home.',
    shareText: 'Merry Christmas. Wishing our Christian friends in Pakistan and everywhere a day of peace and joy.',
  },
  // ── Hindu days (checked date table) ───────────────────────────────
  {
    key: 'holi',
    name: 'Holi',
    scope: 'Hindu',
    tone: 'celebratory',
    rule: { kind: 'table', dates: { 2026: { month: 3, day: 4 }, 2027: { month: 3, day: 22 } } },
    dateLabel: 'Date varies (Hindu calendar)',
    headline: 'Happy Holi',
    message:
      'Holi arrives in a cloud of colour, celebrating spring, friendship and the victory of good over evil. Streets and courtyards fill with gulal, music and laughter as old distances wash away. Happy Holi to our Hindu community in Pakistan and around the world.',
    shareText: 'Happy Holi. May your day be filled with colour, laughter and new beginnings.',
  },
  {
    key: 'diwali',
    name: 'Diwali',
    scope: 'Hindu',
    tone: 'celebratory',
    rule: { kind: 'table', dates: { 2026: { month: 11, day: 8 }, 2027: { month: 10, day: 29 } } },
    dateLabel: 'Date varies (Hindu calendar)',
    headline: 'Happy Diwali',
    message:
      'Diwali, the festival of lights, celebrates the victory of light over darkness and hope over despair. Homes glow with diyas, families share sweets and every lamp is a small promise of a brighter year. Happy Diwali to our Hindu community in Pakistan and everywhere.',
    shareText: 'Happy Diwali. May the festival of lights bring brightness, health and prosperity to your home.',
  },
  // ── Sikh days ─────────────────────────────────────────────────────
  {
    key: 'baisakhi',
    name: 'Baisakhi',
    scope: 'Sikh',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 4, day: 14 },
    dateLabel: '14 April',
    headline: 'Happy Baisakhi',
    message:
      'Baisakhi marks the spring harvest and the founding of the Khalsa in 1699, a day of gratitude, courage and community. At gurdwaras across Pakistan, including Nankana Sahib, the day is kept with prayer, song and shared food. Happy Baisakhi to our Sikh community.',
    shareText: 'Happy Baisakhi. Wishing our Sikh friends a day of gratitude, courage and celebration.',
  },
  // ── Universal greeting days ───────────────────────────────────────
  {
    key: 'new-year',
    name: "New Year's Day",
    scope: 'Worldwide',
    tone: 'celebratory',
    rule: { kind: 'fixed', month: 1, day: 1 },
    dateLabel: '1 January',
    headline: 'Happy New Year',
    message:
      'A new year is a fresh page: new plans, new courage and another chance to become who we hoped to be. May this year bring health to your home, honesty to your work and peace to your heart. Happy New Year from WorldCityHub.',
    shareText: 'Happy New Year. May the year ahead bring health, peace and new beginnings.',
  },
  {
    key: 'mothers-day',
    name: "Mother's Day",
    scope: 'Worldwide',
    tone: 'warm',
    rule: { kind: 'nth-weekday', month: 5, weekday: 0, n: 2 },
    dateLabel: 'Second Sunday of May',
    headline: "Happy Mother's Day",
    message:
      "Today we thank the mothers whose prayers travel with us everywhere and whose hands built our first world. If yours is near, hold her close. If she is a memory, let it be a grateful one. Happy Mother's Day to every mother in Pakistan and beyond.",
    shareText: "Happy Mother's Day. For every prayer, every sacrifice and every sleepless night: thank you.",
  },
  {
    key: 'fathers-day',
    name: "Father's Day",
    scope: 'Worldwide',
    tone: 'warm',
    rule: { kind: 'nth-weekday', month: 6, weekday: 0, n: 3 },
    dateLabel: 'Third Sunday of June',
    headline: "Happy Father's Day",
    message:
      "Today we honour the fathers whose quiet strength holds families together and whose hard work rarely asks for thanks. A father's advice has a way of arriving exactly when it is needed. Happy Father's Day to every father, in Pakistan and everywhere.",
    shareText: "Happy Father's Day. Thank you to every father whose strength and guidance light the way.",
  },
  {
    key: 'teachers-day',
    name: "Teachers' Day",
    scope: 'Worldwide',
    tone: 'warm',
    rule: { kind: 'fixed', month: 10, day: 5 },
    dateLabel: '5 October',
    headline: "Happy Teachers' Day",
    message:
      "Every doctor, engineer, artist and leader began in someone's classroom. Teachers' Day is our chance to thank the people who light lamps they will never sit under. To every teacher in Pakistan and around the world: thank you for building the future.",
    shareText: "Happy Teachers' Day. Thank you to every teacher who lights the way for the next generation.",
  },
];

/** Birthday message for the famous-birthdays cards. Placeholders:
 *  {name} and {title} are filled from the personality profile. */
export const BIRTHDAY_MESSAGE = {
  headline: 'Happy Birthday, {name}',
  message:
    'Today we celebrate the birthday of {name}, {title}. Their life and work left a mark on Pakistan and on everyone who learns their story. Happy birthday from WorldCityHub, with gratitude for all they gave.',
  shareText:
    'Happy birthday to {name}, born on this day. Remembering their life and legacy with WorldCityHub.',
};

export function fillTemplate(text: string, name: string, title: string): string {
  return text.replaceAll('{name}', name).replaceAll('{title}', title);
}

// ── Date machinery (all in plain y/m/d parts, no timezone traps) ────

const TIME_ZONE = 'Asia/Karachi';

export function karachiToday(): DateParts {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? '0');
  return { y: get('year'), m: get('month'), d: get('day') };
}

function toUTCDate(p: DateParts): Date {
  return new Date(Date.UTC(p.y, p.m - 1, p.d, 12, 0, 0));
}

function fromUTCDate(d: Date): DateParts {
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

function addDays(p: DateParts, n: number): DateParts {
  const d = toUTCDate(p);
  d.setUTCDate(d.getUTCDate() + n);
  return fromUTCDate(d);
}

function compareParts(a: DateParts, b: DateParts): number {
  return a.y - b.y || a.m - b.m || a.d - b.d;
}

function sameDay(a: DateParts, b: DateParts): boolean {
  return compareParts(a, b) === 0;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatLongDate(p: DateParts): string {
  const weekday = WEEKDAY_NAMES[toUTCDate(p).getUTCDay()];
  return `${weekday}, ${p.d} ${MONTH_NAMES[p.m - 1]} ${p.y}`;
}

// ── Islamic calendar labels ─────────────────────────────────────────

const hijriPartsFmt = new Intl.DateTimeFormat('en-u-ca-islamic', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});
const hijriLongFmt = new Intl.DateTimeFormat('en-u-ca-islamic', {
  timeZone: TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function hijriPartsOf(p: DateParts): { hy: number; hm: number; hd: number } {
  const parts = hijriPartsFmt.formatToParts(toUTCDate(p));
  const get = (t: string) => Number(parts.find((x) => x.type === t)?.value ?? '0');
  return { hy: get('year'), hm: get('month'), hd: get('day') };
}

/** Formatted Islamic date for a Gregorian date, e.g. "25 Jumada I, 1448 AH". */
export function hijriLabel(p: DateParts): string {
  return hijriLongFmt.format(toUTCDate(p));
}

// ── Occurrence resolution ───────────────────────────────────────────

function easterSunday(year: number): DateParts {
  // Standard Gregorian computus (anonymous algorithm).
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const mm = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * mm + 114) / 31);
  const day = ((h + l - 7 * mm + 114) % 31) + 1;
  return { y: year, m: month, d: day };
}

function occurrenceInYear(entry: DayMessage, year: number): DateParts | null {
  const rule = entry.rule;
  switch (rule.kind) {
    case 'fixed':
      return { y: year, m: rule.month, d: rule.day };
    case 'nth-weekday': {
      const first = toUTCDate({ y: year, m: rule.month, d: 1 });
      const delta = (rule.weekday - first.getUTCDay() + 7) % 7;
      return { y: year, m: rule.month, d: 1 + delta + (rule.n - 1) * 7 };
    }
    case 'easter-offset':
      return addDays(easterSunday(year), rule.offset);
    case 'table': {
      const hit = rule.dates[year];
      return hit ? { y: year, m: hit.month, d: hit.day } : null;
    }
    case 'hijri':
      return null; // resolved by scanning, below
  }
}

function resolveHijri(rule: { month: number; day: number }, from: DateParts): DateParts | null {
  let cur = from;
  for (let i = 0; i < 400; i++) {
    const h = hijriPartsOf(cur);
    if (h.hm === rule.month && h.hd === rule.day) return cur;
    cur = addDays(cur, 1);
  }
  return null;
}

export interface ResolvedDay {
  entry: DayMessage;
  date: DateParts;
}

/** The next date the entry falls on, today included, or null when the
 *  entry's rule cannot produce one (e.g. a table year not yet added). */
export function nextOccurrence(entry: DayMessage, from: DateParts): DateParts | null {
  if (entry.rule.kind === 'hijri') return resolveHijri(entry.rule, from);
  for (const year of [from.y, from.y + 1]) {
    const occ = occurrenceInYear(entry, year);
    if (occ && compareParts(occ, from) >= 0) return occ;
  }
  return null;
}

/** Every library day that falls exactly on the given date. */
export function specialDaysOn(date: DateParts): ResolvedDay[] {
  const out: ResolvedDay[] = [];
  for (const entry of DAY_MESSAGES) {
    const occ = nextOccurrence(entry, date);
    if (occ && sameDay(occ, date)) out.push({ entry, date: occ });
  }
  return out;
}

/** The next `count` special days from `from` (exclusive of today when
 *  `includeToday` is false), soonest first. */
export function upcomingSpecialDays(from: DateParts, count: number, includeToday = false): ResolvedDay[] {
  const start = includeToday ? from : addDays(from, 1);
  const resolved: ResolvedDay[] = [];
  for (const entry of DAY_MESSAGES) {
    const occ = nextOccurrence(entry, start);
    if (occ) resolved.push({ entry, date: occ });
  }
  resolved.sort((a, b) => compareParts(a.date, b.date) || a.entry.name.localeCompare(b.entry.name));
  return resolved.slice(0, count);
}
