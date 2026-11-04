// ─────────────────────────────────────────────────────────────────────────────
// Horoscope prose + period aggregations COMPOSED from the computed engine
// (src/lib/transits.ts, Schlyter Keplerian positions). No static narrative
// pool, no seeded randomness: every sentence below is assembled from features
// the engine actually computed for the stated date and sign (aspects present,
// the Moon's sign and phase, the sign ruler's aspects, ingresses), so the
// text differs because the sky differs. Deterministic per date + sign:
// identical inputs always produce identical output, and the module is pure
// (no Date.now, no Math.random), so it is SSR-safe.
// ─────────────────────────────────────────────────────────────────────────────

import {
  computePositions,
  computeAspects,
  deriveDaily,
  SIGN_RULERS,
  type Aspect,
  type PlanetKey,
  type PlanetPosition,
} from '../transits';
import { ZODIAC_SIGNS, type ZodiacSign } from '../../types/horoscope';

const SIGN_NAMES = ZODIAC_SIGNS.map((s) => s.name);
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};
const labelOf = (positions: PlanetPosition[], k: PlanetKey) => positions.find((p) => p.planet === k)?.label ?? k;

// ─── Moon phase from the computed Sun-Moon elongation ────────────────────────
// Same band thresholds as the synodic phase helper used by the Moon calendar,
// but the elongation here comes from the engine's computed longitudes at the
// same instant (noon UTC), so the hub and the sign pages agree by source.

export interface MoonPhaseInfo {
  /** Elongation / 360, 0 to 1. */
  fraction: number;
  name: string;
  emoji: string;
  illumination: number;
}

export function moonPhaseFromElongation(elongationDeg: number): MoonPhaseInfo {
  const fraction = ((elongationDeg % 360) + 360) % 360 / 360;
  const illumination = Math.round((1 - Math.cos(fraction * 2 * Math.PI)) / 2 * 100);
  let name: string;
  let emoji: string;
  if (fraction < 0.03 || fraction > 0.97) { name = 'New Moon'; emoji = '\u{1F311}'; }
  else if (fraction < 0.22) { name = 'Waxing Crescent'; emoji = '\u{1F312}'; }
  else if (fraction < 0.28) { name = 'First Quarter'; emoji = '\u{1F313}'; }
  else if (fraction < 0.47) { name = 'Waxing Gibbous'; emoji = '\u{1F314}'; }
  else if (fraction < 0.53) { name = 'Full Moon'; emoji = '\u{1F315}'; }
  else if (fraction < 0.72) { name = 'Waning Gibbous'; emoji = '\u{1F316}'; }
  else if (fraction < 0.78) { name = 'Last Quarter'; emoji = '\u{1F317}'; }
  else { name = 'Waning Crescent'; emoji = '\u{1F318}'; }
  return { fraction, name, emoji, illumination };
}

export function moonPhaseForDate(date: Date): MoonPhaseInfo {
  const positions = computePositions(date);
  const sun = positions.find((p) => p.planet === 'sun')!;
  const moon = positions.find((p) => p.planet === 'moon')!;
  return moonPhaseFromElongation(moon.longitude - sun.longitude);
}

// ─── Daily narrative composition ─────────────────────────────────────────────

// Sentence bank keyed to the computed aspect kind. The planet names, signs
// and orbs filled in are the day's real computed values.
const ASPECT_SENTENCES: Record<Aspect['kind'], { harmonious: string; tense: string }> = {
  conjunction: {
    harmonious: '{a} meets {b} by conjunction (orb {orb} degrees), so their themes run together today rather than pulling in separate directions.',
    tense: '{a} meets {b} by conjunction (orb {orb} degrees), and the pairing is a demanding one, so that area of life asks for care rather than force.',
  },
  sextile: {
    harmonious: '{a} forms a sextile with {b} (orb {orb} degrees), an easy angle that rewards a small, practical step taken early in the day.',
    tense: '{a} forms a sextile with {b} (orb {orb} degrees), an easy angle that rewards a small, practical step taken early in the day.',
  },
  trine: {
    harmonious: '{a} forms a trine with {b} (orb {orb} degrees), the smoothest angle in the set, so work that leans on this pairing tends to flow.',
    tense: '{a} forms a trine with {b} (orb {orb} degrees), the smoothest angle in the set, so work that leans on this pairing tends to flow.',
  },
  square: {
    harmonious: '{a} squares {b} (orb {orb} degrees), a tense right angle that creates friction worth planning around rather than pushing through.',
    tense: '{a} squares {b} (orb {orb} degrees), a tense right angle that creates friction worth planning around rather than pushing through.',
  },
  opposition: {
    harmonious: '{a} stands opposite {b} (orb {orb} degrees), so balance between the two matters more than choosing one side.',
    tense: '{a} stands opposite {b} (orb {orb} degrees), so balance between the two matters more than choosing one side.',
  },
};

function fillAspectSentence(asp: Aspect, positions: PlanetPosition[]): string {
  const bank = ASPECT_SENTENCES[asp.kind];
  const text = asp.harmonious ? bank.harmonious : bank.tense;
  return text
    .replace('{a}', labelOf(positions, asp.a))
    .replace('{b}', labelOf(positions, asp.b))
    .replace('{orb}', asp.orb.toFixed(1));
}

const DOMAIN_LABELS: Record<string, string> = {
  overall: 'overall', love: 'love', career: 'career', health: 'health', finance: 'finance', spirituality: 'spirituality',
};

/**
 * Compose the daily narrative for a sign from that day's computed transits.
 * Slots: (1) Moon sign + phase + mood, (2) the sign ruler's tightest aspect,
 * (3) the day's tightest aspect overall, (4) the Sun's position, (5) the
 * strongest computed meter. Every slot is filled from engine output; when a
 * slot has no aspect within orb it says so plainly instead of inventing one.
 */
export function composeDailyNarrative(signKey: string, date: Date = new Date()): string {
  const derived = deriveDaily(signKey, date);
  const { positions, aspects } = derived;
  const signName = cap(signKey);
  const byPlanet = new Map(positions.map((p) => [p.planet, p]));
  const moon = byPlanet.get('moon')!;
  const sun = byPlanet.get('sun')!;
  const ruler = SIGN_RULERS[signKey] ?? 'sun';
  const rulerLabel = labelOf(positions, ruler);
  const phase = moonPhaseFromElongation(moon.longitude - sun.longitude);

  const sentences: string[] = [];
  sentences.push(
    `The Moon is in ${moon.sign} today and the sky is in its ${phase.name} phase, which sets a ${derived.mood.toLowerCase()} tone for ${signName} and colours the emotional register of the reading.`,
  );

  const rulerAspects = aspects.filter((a) => a.a === ruler || a.b === ruler);
  if (rulerAspects.length > 0) {
    const tightest = rulerAspects[0];
    sentences.push(
      `${rulerLabel}, the planet that rules ${signName}, is the centre of today's geometry. ${fillAspectSentence(tightest, positions)}`,
    );
    if (rulerAspects.length > 1) {
      sentences.push(`A second angle to your ruler is also in orb: ${fillAspectSentence(rulerAspects[1], positions)}`);
    }
  } else {
    sentences.push(
      `${rulerLabel}, the planet that rules ${signName}, makes no major aspect within orb today, so the reading rests on the Moon's position and the wider pattern of the sky rather than on one sharp angle.`,
    );
  }

  const widest = aspects.find((a) => !(a.a === ruler || a.b === ruler));
  if (widest) {
    sentences.push(`Across the rest of the sky, the tightest remaining angle is this: ${fillAspectSentence(widest, positions)}`);
  }

  sentences.push(
    `The Sun is in ${sun.sign} at ${sun.degreeInSign.toFixed(1)} degrees, and ${signName}'s lucky colour today, ${derived.luckyColor}, comes from the planet in tightest aspect to ${rulerLabel} under the fixed derivation rules.`,
  );

  const meterEntries = Object.entries(derived.meters) as [string, number][];
  const strongest = meterEntries.reduce((best, cur) => (cur[1] > best[1] ? cur : best), meterEntries[0]);
  const weakest = meterEntries.reduce((best, cur) => (cur[1] < best[1] ? cur : best), meterEntries[0]);
  sentences.push(
    `Of the computed meters, ${DOMAIN_LABELS[strongest[0]]} scores highest at ${strongest[1]} of 5 and ${DOMAIN_LABELS[weakest[0]]} lowest at ${weakest[1]} of 5, both read from the harmonious and tense aspect strength touching each area. This reading is composed from today's computed positions and is for entertainment only.`,
  );

  return sentences.join(' ');
}

// ─── Weekly aggregation (framework: run the daily engine for every day) ────

export interface WeeklyComputed {
  weekStart: Date;
  weekEnd: Date;
  overall: number;
  summary: string;
  basis: string;
  bestDays: string[];
  challengingDays: string[];
}

interface DayScore {
  date: Date;
  dayName: string;
  overall: number;
  score: number;
  moonSign: string;
}

function rulerScore(signKey: string, date: Date): DayScore {
  const derived = deriveDaily(signKey, date);
  const ruler = SIGN_RULERS[signKey] ?? 'sun';
  let harm = 0;
  let tense = 0;
  for (const asp of derived.aspects) {
    if (asp.a === ruler || asp.b === ruler) {
      const maxOrb = asp.a === 'sun' || asp.a === 'moon' || asp.b === 'sun' || asp.b === 'moon' ? 8 : 6;
      const strength = 1 - asp.orb / maxOrb;
      if (asp.harmonious) harm += strength; else tense += strength;
    }
  }
  const moon = derived.positions.find((p) => p.planet === 'moon')!;
  return {
    date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12)),
    dayName: DAY_NAMES[date.getUTCDay()],
    overall: derived.meters.overall,
    score: derived.meters.overall + harm - tense,
    moonSign: moon.sign,
  };
}

export function mondayOf(date: Date): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));
  const dow = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - dow + (dow === 0 ? -6 : 1));
  return d;
}

export function computeWeekly(signKey: string, refDate: Date = new Date()): WeeklyComputed {
  const monday = mondayOf(refDate);
  const days: DayScore[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday.getTime() + i * 86400000);
    days.push(rulerScore(signKey, d));
  }
  const ranked = [...days].sort((a, b) => b.score - a.score);
  const bestDays = ranked.slice(0, 2).map((d) => d.dayName);
  const challengingDays = ranked.slice(-1).map((d) => d.dayName);
  const overall = Math.max(1, Math.min(5, Math.round(days.reduce((s, d) => s + d.overall, 0) / 7)));

  const signName = cap(signKey);
  const rulerLabel = labelOf(computePositions(monday), SIGN_RULERS[signKey] ?? 'sun');
  const moonSigns: string[] = [];
  for (const d of days) if (!moonSigns.includes(d.moonSign)) moonSigns.push(d.moonSign);
  const sunday = days[6];
  const fmt = (d: Date) => `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const summary =
    `For the week ${fmt(monday)} to ${fmt(sunday.date)}, the Moon moves through ${moonSigns.join(', ')} on its computed path. ` +
    `${signName}'s days are ranked by each day's computed overall meter and the aspects to ${rulerLabel}, the sign's ruler: the strongest days are ${bestDays.join(' and ')}, and the most testing is ${challengingDays[0]}. ` +
    `The week's average overall meter is ${overall} of 5, the mean of the seven daily computed meters. Readings are for entertainment only.`;

  const basis =
    `Basis: the daily engine run for each of the week's seven days (noon UTC, Schlyter's Keplerian method), ` +
    `with days ranked by the computed overall meter and the aspects to ${rulerLabel}, the sign's ruler.`;

  return { weekStart: monday, weekEnd: sunday.date, overall, summary, basis, bestDays, challengingDays };
}

// ─── Monthly aggregation (per content-bank/horoscope/monthly-framework.md) ─

export interface MonthlyComputed {
  month: number;
  monthName: string;
  overall: number;
  summary: string;
  basis: string;
  highlightDates: string[];
}

export function computeMonthly(signKey: string, refDate: Date = new Date()): MonthlyComputed {
  const year = refDate.getUTCFullYear();
  const month = refDate.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const signName = cap(signKey);
  const ruler = SIGN_RULERS[signKey] ?? 'sun';

  const scores: DayScore[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    scores.push(rulerScore(signKey, new Date(Date.UTC(year, month, d, 12))));
  }
  const overall = Math.max(1, Math.min(5, Math.round(scores.reduce((s, d) => s + d.overall, 0) / daysInMonth)));

  // Ingresses: a planet's sign on a day differs from the previous day
  // (the previous month's last day seeds the comparison).
  const ingresses: { planet: string; sign: string; day: number }[] = [];
  let prev = computePositions(new Date(Date.UTC(year, month, 0, 12)));
  for (let d = 1; d <= daysInMonth; d++) {
    const pos = computePositions(new Date(Date.UTC(year, month, d, 12)));
    for (const p of pos) {
      const before = prev.find((q) => q.planet === p.planet)!;
      if (before.sign !== p.sign) ingresses.push({ planet: p.label, sign: p.sign, day: d });
    }
    prev = pos;
  }
  const rulerIngress = ingresses.find((i) => i.planet === labelOf(prev, ruler));
  const sunIngress = ingresses.find((i) => i.planet === 'Sun');

  // Moon phases in the month from computed elongations: the days closest to
  // elongation 0 (new) and 180 (full).
  let newMoonDay = 1;
  let fullMoonDay = 1;
  let bestNew = Infinity;
  let bestFull = Infinity;
  for (let d = 1; d <= daysInMonth; d++) {
    const pos = computePositions(new Date(Date.UTC(year, month, d, 12)));
    const sun = pos.find((p) => p.planet === 'sun')!;
    const moon = pos.find((p) => p.planet === 'moon')!;
    const elong = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
    const distNew = Math.min(elong, 360 - elong);
    const distFull = Math.abs(elong - 180);
    if (distNew < bestNew) { bestNew = distNew; newMoonDay = d; }
    if (distFull < bestFull) { bestFull = distFull; fullMoonDay = d; }
  }

  const ranked = [...scores].sort((a, b) => b.score - a.score);
  const highlightDates = ranked.slice(0, 4).map((d) => d.date.getUTCDate()).sort((a, b) => a - b).map(ordinal);

  const rulerLabel = labelOf(prev, ruler);
  const parts: string[] = [];
  parts.push(`${MONTH_NAMES[month]} for ${signName} is summarised from the daily engine run for every day of the month, not from a separate forecast.`);
  if (rulerIngress) {
    parts.push(`${rulerLabel}, the sign's ruler, enters ${rulerIngress.sign} on the ${ordinal(rulerIngress.day)}, the clearest shift in the month's geometry for ${signName}.`);
  } else {
    parts.push(`${rulerLabel}, the sign's ruler, stays in one sign all month, so the month's pattern comes from its aspects rather than a change of sign.`);
  }
  if (sunIngress) parts.push(`The Sun enters ${sunIngress.sign} on the ${ordinal(sunIngress.day)}.`);
  parts.push(`The new Moon falls near the ${ordinal(newMoonDay)} and the full Moon near the ${ordinal(fullMoonDay)}, from the computed Sun and Moon longitudes.`);
  parts.push(`The strongest computed days are the ${highlightDates.join(', ')}, ranked by the daily overall meter and the aspects to ${rulerLabel}; the monthly overall meter, ${overall} of 5, is the mean of the daily meters. Readings are for entertainment only.`);

  const basis =
    `Basis: the daily engine run for every day of ${MONTH_NAMES[month]} (noon UTC, Schlyter's Keplerian method), ` +
    `with the month's sign changes and Moon phase dates read from the same computed positions.`;

  return { month: month + 1, monthName: MONTH_NAMES[month], overall, summary: parts.join(' '), basis, highlightDates };
}

// ─── Yearly aggregation (framework: the daily engine across the year) ──────
// The engine honestly supports a year layer from the same computed facts
// the daily, weekly and monthly readings use, aggregated over all 365 or
// 366 days: the Sun's computed season in the native sign, the year's four
// turning points (the Sun reaching 0, 90, 180 and 270 degrees), the sign
// ruler's sign changes, the signs of the slow planets Jupiter and Saturn,
// the year's new and full Moons in the native sign, and the daily meters
// averaged by month. Nothing here is a separate forecast model, and the
// basis line printed with the reading says exactly this.

export interface YearlyComputed {
  year: number;
  overall: number;
  summary: string;
  basis: string;
  highlightDates: string[];
  bestMonth: string;
  quietestMonth: string;
  seasonStart: string;
  seasonEnd: string;
}

export function computeYearly(signKey: string, refDate: Date = new Date()): YearlyComputed {
  const year = refDate.getUTCFullYear();
  const signName = cap(signKey);
  const ruler = SIGN_RULERS[signKey] ?? 'sun';
  const fmtDay = (d: Date) => `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCDate()}`;
  const at = (ps: PlanetPosition[], k: PlanetKey) => ps.find((p) => p.planet === k)!;

  // One pass of computed positions: 31 December of the previous year seeds
  // the sign-change detection, then every day of the year, noon UTC.
  interface DaySky { date: Date; positions: PlanetPosition[] }
  const sky: DaySky[] = [];
  for (let t = Date.UTC(year - 1, 11, 31, 12); t <= Date.UTC(year, 11, 31, 12); t += 86400000) {
    const date = new Date(t);
    sky.push({ date, positions: computePositions(date) });
  }
  const yearDays = sky.slice(1);
  const rulerLabel = labelOf(yearDays[0].positions, ruler);

  // The sign's season: the runs of days with the Sun in the native sign.
  // One run for eleven signs; Capricorn wraps the year end and has two.
  const seasonRuns: { start: Date; end: Date }[] = [];
  for (const d of yearDays) {
    if (at(d.positions, 'sun').signKey !== signKey) continue;
    const last = seasonRuns[seasonRuns.length - 1];
    if (last && d.date.getTime() - last.end.getTime() === 86400000) last.end = d.date;
    else seasonRuns.push({ start: d.date, end: d.date });
  }
  const wrapped = seasonRuns.length > 1;
  const seasonStart = fmtDay((wrapped ? seasonRuns[seasonRuns.length - 1] : seasonRuns[0]).start);
  const seasonEnd = fmtDay(seasonRuns[0].end);

  // The year's four turning points: the days the Sun's computed longitude
  // crosses 0, 90, 180 and 270 degrees.
  const QUARTERS: { lon: number; name: string }[] = [
    { lon: 0, name: 'March equinox' },
    { lon: 90, name: 'June solstice' },
    { lon: 180, name: 'September equinox' },
    { lon: 270, name: 'December solstice' },
  ];
  const quarters: { name: string; date: Date }[] = [];
  for (let i = 1; i < sky.length; i++) {
    if (sky[i].date.getUTCFullYear() !== year) continue;
    const prevLon = at(sky[i - 1].positions, 'sun').longitude;
    const lon = at(sky[i].positions, 'sun').longitude;
    for (const q of QUARTERS) {
      const crossed = prevLon <= lon
        ? prevLon < q.lon && lon >= q.lon
        : q.lon > prevLon || q.lon <= lon;
      if (crossed) quarters.push({ name: q.name, date: sky[i].date });
    }
  }

  // Sign changes during the year for any planet (second day of each pair
  // must fall inside the year).
  const ingressesOf = (planet: PlanetKey): { sign: string; date: Date }[] => {
    const out: { sign: string; date: Date }[] = [];
    for (let i = 1; i < sky.length; i++) {
      if (sky[i].date.getUTCFullYear() !== year) continue;
      const prevSign = at(sky[i - 1].positions, planet).sign;
      const now = at(sky[i].positions, planet);
      if (now.sign !== prevSign) out.push({ sign: now.sign, date: sky[i].date });
    }
    return out;
  };
  const slowLine = (planet: PlanetKey, label: string): string => {
    const first = at(yearDays[0].positions, planet).sign;
    const changes = ingressesOf(planet);
    if (changes.length === 0) return `${label} stays in ${first} all year`;
    let out = `${label} starts the year in ${first}`;
    for (const c of changes) out += `, enters ${c.sign} on ${fmtDay(c.date)}`;
    return out;
  };

  // New and full Moons falling in the native sign: within each run of
  // days the Moon spends in the sign, the day whose computed Sun-Moon
  // elongation comes closest to 0 (new) or 180 (full), kept when the
  // closest approach is within 15 degrees, the day-level granularity the
  // monthly reading already uses.
  const moonRuns: { startIdx: number; endIdx: number }[] = [];
  yearDays.forEach((d, idx) => {
    if (at(d.positions, 'moon').signKey !== signKey) return;
    const last = moonRuns[moonRuns.length - 1];
    if (last && idx - last.endIdx === 1) last.endIdx = idx;
    else moonRuns.push({ startIdx: idx, endIdx: idx });
  });
  const lunationDates = (target: 0 | 180): Date[] => {
    const found: Date[] = [];
    for (const run of moonRuns) {
      let bestDist = Infinity;
      let bestDate: Date | null = null;
      for (let i = run.startIdx; i <= run.endIdx; i++) {
        const sun = at(yearDays[i].positions, 'sun');
        const moon = at(yearDays[i].positions, 'moon');
        const elong = ((moon.longitude - sun.longitude) % 360 + 360) % 360;
        const dist = target === 0 ? Math.min(elong, 360 - elong) : Math.abs(elong - 180);
        if (dist < bestDist) { bestDist = dist; bestDate = yearDays[i].date; }
      }
      if (bestDate && bestDist <= 15) found.push(bestDate);
    }
    return found.slice(0, 2);
  };
  const newMoons = lunationDates(0);
  const fullMoons = lunationDates(180);

  // The year's daily meters from the same scorer the weekly and monthly
  // readings use, averaged by month.
  const scores: DayScore[] = [];
  for (let t = Date.UTC(year, 0, 1, 12); ; t += 86400000) {
    const d = new Date(t);
    if (d.getUTCFullYear() !== year) break;
    scores.push(rulerScore(signKey, d));
  }
  const monthMeans: { name: string; overall: number; score: number }[] = MONTH_NAMES.map((name, m) => {
    const inMonth = scores.filter((s) => s.date.getUTCMonth() === m);
    return {
      name,
      overall: inMonth.reduce((sum, s) => sum + s.overall, 0) / inMonth.length,
      score: inMonth.reduce((sum, s) => sum + s.score, 0) / inMonth.length,
    };
  });
  const byScore = [...monthMeans].sort((a, b) => b.score - a.score);
  const bestMonth = byScore[0].name;
  const quietestMonth = byScore[byScore.length - 1].name;
  const overall = Math.max(1, Math.min(5, Math.round(scores.reduce((s, d) => s + d.overall, 0) / scores.length)));
  const highlightDates = [...scores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((d) => fmtDay(d.date));

  // ── Summary, composed from the facts computed above ──
  const parts: string[] = [];
  parts.push(
    `${year} for ${signName} is gathered from the same computed positions as the daily readings, run for every day of the year, so the year is read from its computed shape rather than a fixed forecast.`,
  );
  if (wrapped) {
    parts.push(
      `The Sun is in ${signName} until ${fmtDay(seasonRuns[0].end)} and again from ${fmtDay(seasonRuns[seasonRuns.length - 1].start)} to the year's end, so the sign's season closes one year and opens the next.`,
    );
  } else if (seasonRuns.length === 1) {
    parts.push(`The Sun is in ${signName} from ${fmtDay(seasonRuns[0].start)} to ${fmtDay(seasonRuns[0].end)}, the sign's own season.`);
  }
  if (quarters.length === 4) {
    const list = quarters.map((q) => `${fmtDay(q.date)} (the ${q.name})`).join(', ');
    parts.push(`The year's four turning points fall near ${list}, read from the Sun's computed longitude reaching 0, 90, 180 and 270 degrees.`);
  }
  if (ruler === 'moon') {
    parts.push(
      `The Moon, ${signName}'s ruler, changes sign every two to three days and passes through ${signName} itself ${moonRuns.length} times in the year, so this sign's year is steered by the lunar cycle more than by any single angle.`,
    );
  } else {
    const rulerChanges = ingressesOf(ruler);
    const rulerStart = at(yearDays[0].positions, ruler).sign;
    if (rulerChanges.length === 0) {
      parts.push(
        `${rulerLabel}, the sign's ruler, stays in ${rulerStart} all year, so the year's pattern for ${signName} comes from its ruler's aspects rather than a change of sign.`,
      );
    } else if (rulerChanges.length <= 4) {
      let sentence = `${rulerLabel}, the sign's ruler, starts the year in ${rulerStart}`;
      for (const c of rulerChanges) sentence += `, enters ${c.sign} on ${fmtDay(c.date)}`;
      parts.push(sentence + '.');
    } else {
      const visited: string[] = [rulerStart];
      for (const c of rulerChanges) if (visited[visited.length - 1] !== c.sign) visited.push(c.sign);
      parts.push(
        `${rulerLabel}, the sign's ruler, changes sign ${rulerChanges.length} times in the year, moving through ${visited.join(', ')}, so the year's tone shifts with it.`,
      );
    }
  }
  // The slow planets frame the year; when the sign's own ruler IS Jupiter
  // or Saturn its movement is already told in the ruler sentence above, so
  // only the other slow planet is named here (no duplicated sentence).
  const slowParts: string[] = [];
  if (ruler !== 'jupiter') slowParts.push(slowLine('jupiter', 'Jupiter'));
  if (ruler !== 'saturn') slowParts.push(slowLine('saturn', 'Saturn'));
  if (slowParts.length > 0) parts.push(`${slowParts.join(', and ')}.`);
  const lunationBits: string[] = [];
  for (const d of newMoons) lunationBits.push(`a new Moon falls in ${signName} near ${fmtDay(d)}`);
  for (const d of fullMoons) lunationBits.push(`a full Moon falls in ${signName} near ${fmtDay(d)}`);
  if (lunationBits.length > 0) {
    parts.push(`${cap(lunationBits.join(' and '))}.`);
  }
  parts.push(
    `By the computed daily meters, ${bestMonth} is ${signName}'s strongest month and ${quietestMonth} its quietest; the year's overall meter is ${overall} of 5, the mean of the daily meters across the year, and the strongest single days fall on ${highlightDates.join(', ')}. Readings are for entertainment only.`,
  );

  const basis =
    `Basis: computed planetary positions for every day of ${year} (noon UTC, Schlyter's Keplerian method): ` +
    `the Sun's season in ${signName}, the year's four turning points, ${rulerLabel}'s sign changes, ` +
    `the signs of Jupiter and Saturn, and the year's daily meters.`;

  return {
    year,
    overall,
    summary: parts.join(' '),
    basis,
    highlightDates,
    bestMonth,
    quietestMonth,
    seasonStart,
    seasonEnd,
  };
}

// ─── Birth date helpers ──────────────────────────────────────────────────────

/**
 * Sun sign for a birth month/day from the sign date ranges in
 * src/types/horoscope.ts. Each sign is matched on its own start AND end
 * (Capricorn wraps the year end), so the first sign whose start has passed
 * can never shadow the correct one.
 */
export function sunSignForDate(month: number, day: number): ZodiacSign {
  for (const s of ZODIAC_SIGNS) {
    if (s.start_month <= s.end_month) {
      const afterStart = month > s.start_month || (month === s.start_month && day >= s.start_day);
      const beforeEnd = month < s.end_month || (month === s.end_month && day <= s.end_day);
      if (afterStart && beforeEnd) return s.key;
    } else {
      const afterStart = month > s.start_month || (month === s.start_month && day >= s.start_day);
      const beforeEnd = month < s.end_month || (month === s.end_month && day <= s.end_day);
      if (afterStart || beforeEnd) return s.key;
    }
  }
  return 'capricorn';
}

export interface BirthChartComputed {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  /** Null when no birth time was given. Approximate when present. */
  risingSign: ZodiacSign | null;
  placements: PlanetPosition[];
}

/**
 * Birth chart from the real engine for the entered birth date: planetary
 * placements from computePositions(birthDate), the Moon sign from the same
 * computed positions, the Sun sign from the date-range logic above, and a
 * rising sign from the birth hour only. The rising sign is an approximation
 * (it advances roughly one sign every two hours from the Sun sign at
 * sunrise) and is labelled as such wherever it is shown; no birth city is
 * used, because no longitude is available to this tool.
 */
export function computeBirthChart(birthDateIso: string, birthTime?: string): BirthChartComputed | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDateIso);
  if (!m) return null;
  const [, ys, ms, ds] = m;
  const year = Number(ys);
  const month = Number(ms);
  const day = Number(ds);
  const date = new Date(Date.UTC(year, month - 1, day, 12));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;

  const placements = computePositions(date);
  const moonSign = placements.find((p) => p.planet === 'moon')!.signKey as ZodiacSign;
  const sunSign = sunSignForDate(month, day);

  let risingSign: ZodiacSign | null = null;
  if (birthTime) {
    const tm = /^(\d{1,2}):(\d{2})/.exec(birthTime);
    if (tm) {
      const hour = Number(tm[1]);
      if (hour >= 0 && hour <= 23) {
        const sunIdx = SIGN_NAMES.findIndex((n) => n.toLowerCase() === sunSign);
        const steps = Math.floor(((hour - 6 + 24) % 24) / 2);
        risingSign = ZODIAC_SIGNS[(sunIdx + steps) % 12].key;
      }
    }
  }

  return { sunSign, moonSign, risingSign, placements };
}
