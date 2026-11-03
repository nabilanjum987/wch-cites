import type {
  ZodiacSign, MoonPhaseData, SkyRightNowData, SkyEventData, DailyReading,
  WeeklyForecast, MonthlyForecast, SignsCompatibility, ChineseAnimal, ChineseElement,
  ChineseAnimalData, ChineseZodiacResult, VedicPanchangData, MoonPhaseDay
} from '../../types/horoscope';
import { ZODIAC_SIGNS, CHINESE_ANIMALS, CHINESE_ELEMENT_COLORS } from '../../types/horoscope';
import { deriveDaily, SIGN_RULERS, computePositions } from '../transits';
import { composeDailyNarrative, computeWeekly, computeMonthly, moonPhaseForDate, sunSignForDate } from '../horoscope/compose';

// ─── moon phase calculation (astronomical approximation) ─────────────────────

function getMoonPhaseForDate(date: Date): { phase: number; illumination: number; phase_name: string; emoji: string } {
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const synodicMonth = 29.53058867;
  const daysSinceNew = (date.getTime() - knownNewMoon.getTime()) / 86400000;
  const cycles = daysSinceNew / synodicMonth;
  const phase = cycles - Math.floor(cycles);

  const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

  let phase_name: string;
  let emoji: string;

  if (phase < 0.03 || phase > 0.97) { phase_name = 'New Moon'; emoji = '\uD83C\uDF11'; }
  else if (phase < 0.22) { phase_name = 'Waxing Crescent'; emoji = '\uD83C\uDF12'; }
  else if (phase < 0.28) { phase_name = 'First Quarter'; emoji = '\uD83C\uDF13'; }
  else if (phase < 0.47) { phase_name = 'Waxing Gibbous'; emoji = '\uD83C\uDF14'; }
  else if (phase < 0.53) { phase_name = 'Full Moon'; emoji = '\uD83C\uDF15'; }
  else if (phase < 0.72) { phase_name = 'Waning Gibbous'; emoji = '\uD83C\uDF16'; }
  else if (phase < 0.78) { phase_name = 'Last Quarter'; emoji = '\uD83C\uDF17'; }
  else { phase_name = 'Waning Crescent'; emoji = '\uD83C\uDF18'; }

  return { phase, illumination, phase_name, emoji };
}

export function getMoonPhase() {
  return getMoonPhaseForDate(new Date());
}

// ─── 30-day moon calendar ───────────────────────────────────────────────────

export function getMoonCalendar(month?: number, year?: number): MoonPhaseDay[] {
  const now = new Date();
  const m = month ?? now.getMonth();
  const y = year ?? now.getFullYear();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const calendar: MoonPhaseDay[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    // Engine-computed phase (Schlyter longitudes, noon UTC), the same
    // function the hub Sky Right Now panel uses, so both always agree.
    const phaseData = moonPhaseForDate(new Date(Date.UTC(y, m, d, 12)));
    calendar.push({
      date: new Date(y, m, d),
      phase: phaseData.fraction,
      phaseName: phaseData.name,
      emoji: phaseData.emoji,
    });
  }
  return calendar;
}

// ─── current sun zodiac sign ─────────────────────────────────────────────────

export function getCurrentSunSign(): { sign: ZodiacSign; transitionDate: string } {
  const now = new Date();
  const currentSign = sunSignForDate(now.getMonth() + 1, now.getDate());
  const idx = ZODIAC_SIGNS.findIndex(z => z.key === currentSign);
  const next = ZODIAC_SIGNS[(idx + 1) % 12];
  return { sign: currentSign, transitionDate: `${next.start_month}/${next.start_day}` };
}

// ─── moon zodiac sign (simplified approximation) ─────────────────────────────

export function getMoonSign(date: Date = new Date()): ZodiacSign {
  const moon = computePositions(date).find(p => p.planet === 'moon')!;
  return moon.signKey as ZodiacSign;
}

// ─── visible constellation tonight ───────────────────────────────────────────

export function getVisibleConstellation(): string {
  const month = new Date().getMonth();
  const constellations = ['Orion', 'Orion', 'Leo', 'Virgo', 'Scorpius', 'Sagittarius', 'Lyra', 'Cygnus', 'Pegasus', 'Andromeda', 'Taurus', 'Gemini'];
  return constellations[month];
}

// ─── upcoming sky events ─────────────────────────────────────────────────────

export function getUpcomingSkyEvents(): SkyEventData[] {
  const now = new Date();
  const year = now.getFullYear();

  const fullMoons: SkyEventData[] = [
    { name: 'Wolf Moon',       date: `${year}-01-13`, type: 'full_moon' },
    { name: 'Snow Moon',       date: `${year}-02-12`, type: 'full_moon' },
    { name: 'Worm Moon',       date: `${year}-03-14`, type: 'full_moon' },
    { name: 'Pink Moon',       date: `${year}-04-12`, type: 'full_moon' },
    { name: 'Flower Moon',     date: `${year}-05-12`, type: 'full_moon' },
    { name: 'Strawberry Moon', date: `${year}-06-11`, type: 'full_moon' },
    { name: 'Buck Moon',       date: `${year}-07-10`, type: 'full_moon' },
    { name: 'Sturgeon Moon',   date: `${year}-08-09`, type: 'full_moon' },
    { name: 'Harvest Moon',    date: `${year}-09-07`, type: 'full_moon' },
    { name: 'Hunter Moon',     date: `${year}-10-07`, type: 'full_moon' },
    { name: 'Beaver Moon',     date: `${year}-11-05`, type: 'full_moon' },
    { name: 'Cold Moon',       date: `${year}-12-04`, type: 'full_moon' },
  ];

  const eclipses: SkyEventData[] = [
    { name: 'Lunar Eclipse',    date: `${year}-03-14`, type: 'eclipse' },
    { name: 'Solar Eclipse',    date: `${year}-03-29`, type: 'eclipse' },
    { name: 'Lunar Eclipse',    date: `${year}-09-07`, type: 'eclipse' },
    { name: 'Solar Eclipse',    date: `${year}-09-21`, type: 'eclipse' },
  ];

  const planets: SkyEventData[] = [
    { name: 'Jupiter at Opposition',  date: `${year}-01-10`, type: 'planet' },
    { name: 'Venus at Greatest Elongation', date: `${year}-03-20`, type: 'planet' },
    { name: 'Mars at Opposition',     date: `${year}-06-15`, type: 'planet' },
    { name: 'Saturn at Opposition',   date: `${year}-09-21`, type: 'planet' },
    { name: 'Perseid Meteor Shower',  date: `${year}-08-12`, type: 'meteor' },
    { name: 'Geminid Meteor Shower',  date: `${year}-12-14`, type: 'meteor' },
  ];

  const all = [...fullMoons, ...eclipses, ...planets]
    .filter((e) => new Date(e.date) >= new Date(now.toISOString().slice(0, 10)))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  if (all.length === 0) {
    all.push({ name: 'Next Full Moon', date: `${year + 1}-01-13`, type: 'full_moon' });
  }

  return all;
}

// ─── fetch sky right now ─────────────────────────────────────────────────────

export function fetchSkyRightNow(): SkyRightNowData {
  // Sun and Moon signs come from the same computed engine (Schlyter
  // Keplerian positions, noon UTC) as the sign pages' transit tables, so
  // the hub and the sign pages always agree on the same day. The Moon
  // phase label comes from the computed Sun-Moon elongation via the same
  // function the Moon calendar uses.
  const positions = computePositions(new Date());
  const sun = positions.find(p => p.planet === 'sun')!;
  const moon = positions.find(p => p.planet === 'moon')!;
  const moonPhase = moonPhaseForDate(new Date());
  const sunSign = sun.signKey as ZodiacSign;
  const moonSign = moon.signKey as ZodiacSign;

  // Next Sun sign change, found by scanning the engine forward.
  let transitionDate = '';
  for (let i = 1; i <= 40; i++) {
    const d = new Date(Date.now() + i * 86400000);
    const s2 = computePositions(d).find(p => p.planet === 'sun')!;
    if (s2.signKey !== sunSign) {
      transitionDate = `${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
      break;
    }
  }

  return {
    moon: {
      phase: moonPhase.fraction,
      illumination: moonPhase.illumination,
      phase_name: moonPhase.name,
      moon_sign: moonSign,
      emoji: moonPhase.emoji,
    },
    sun_sign: sunSign,
    sun_sign_transition_date: transitionDate,
    visible_constellation: getVisibleConstellation(),
    upcoming_events: getUpcomingSkyEvents(),
  };
}

// ─── chinese zodiac ──────────────────────────────────────────────────────────

export function getChineseZodiacForYear(birthYear: number): ChineseZodiacResult | null {
  // The 12 animals repeat in a fixed cycle anchored on 4 CE (a Rat year);
  // the element follows the 10-year stem cycle, two years per element.
  // Computed from the birth year itself, so any year resolves and no
  // single year's forecast text is reused for other years.
  const animalIndex = (((birthYear - 4) % 12) + 12) % 12;
  const animal = CHINESE_ANIMALS[animalIndex];
  if (!animal) return null;

  const elements: ChineseElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const elementIndex = Math.floor(((((birthYear - 4) % 10) + 10) % 10) / 2);
  const element = elements[elementIndex] ?? 'wood';

  const elementEmojis: Record<ChineseElement, string> = {
    wood: '\uD83C\uDF33', fire: '\uD83D\uDD25', earth: '\uD83D\uDDA4', metal: '\uD83E\uDD4A', water: '\uD83D\uDCA7'
  };

  const elementForecast: Record<ChineseElement, string> = {
    wood: 'Growth and new beginnings. Plant seeds for the future.',
    fire: 'Energy and passion. Bold moves lead to breakthrough.',
    earth: 'Stability and nurturing. Build strong foundations.',
    metal: 'Precision and focus. Refine your path to success.',
    water: 'Intuition and flow. Trust the currents of change.',
  };

  return {
    animal,
    element,
    elementEmoji: elementEmojis[element],
    birthYear,
    forecast2025: `${animal.name} is traditionally associated with: ${animal.traits.toLowerCase()}. ${elementForecast[element]}`,
  };
}

export function getChineseZodiacFor2025(): { yearAnimal: ChineseAnimalData; element: ChineseElement; description: string } {
  const snake = CHINESE_ANIMALS.find(a => a.key === 'snake')!;
  return {
    yearAnimal: snake,
    element: 'wood',
    description: `2025 is the Year of the Wood Snake \uD83D\uDC0D. The Wood element adds growth, creativity, and flexibility to the Snake's natural wisdom and intuition. This combination favors strategic planning, personal transformation, and nurturing relationships. A year for deep reflection before decisive action.`,
  };
}

// ─── vedic panchang ───────────────────────────────────────────────────────────

export function fetchVedicPanchang(): VedicPanchangData {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'];
  const nakshatras = ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'];
  const yogas = ['Vishkumbha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva', 'Siddha', 'Sadhya', 'Subha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'];
  const karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kistughna'];

  const deities = ['Ganesha', 'Shiva', 'Vishnu', 'Lakshmi', 'Durga', 'Surya', 'Hanuman', 'Krishna', 'Saraswati', 'Brahma', 'Kali', 'Rama'];
  const practices = ['Meditation', 'Charity', 'Prayer', 'Fasting', 'Mantra chanting', 'Temple visit', 'Study scriptures', 'Nature walk', 'Journaling', 'Yoga practice', 'Family gathering', 'Silence retreat'];

  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return {
    tithi: tithis[dayOfYear % tithis.length],
    nakshatra: nakshatras[dayOfYear % nakshatras.length],
    yoga: yogas[dayOfYear % yogas.length],
    karana: karanas[dayOfYear % karanas.length],
    auspicious_times: [
      `${6 + Math.floor(seededRandom(dayOfYear) * 4)}:${Math.floor(seededRandom(dayOfYear + 1) * 60).toString().padStart(2, '0')} AM - ${8 + Math.floor(seededRandom(dayOfYear + 2) * 2)} AM`,
      `${10 + Math.floor(seededRandom(dayOfYear + 3) * 2)} AM - ${12}:00 PM`,
      `Abhijit Muhurta (12:00 PM - 12:45 PM)`,
    ],
    inauspicious_times: [
      'Rahu Kalam: ' + (3 + Math.floor(seededRandom(dayOfYear + 4) * 2)) + ':00 PM - ' + (5 + Math.floor(seededRandom(dayOfYear + 5))) + ':00 PM',
      'Yamaganda: ' + Math.floor(seededRandom(dayOfYear + 6) * 3) + ':00 PM - ' + Math.floor(seededRandom(dayOfYear + 7) * 2 + 2) + ':00 PM',
    ],
    deity: deities[dayOfYear % deities.length],
    practice: practices[dayOfYear % practices.length],
  };
}

// ─── daily horoscope reading (extended) ───────────────────────────────────────

const GEMSTONES: Record<ZodiacSign, string> = {
  aries: 'Diamond', taurus: 'Emerald', gemini: 'Citrine', cancer: 'Pearl',
  leo: 'Ruby', virgo: 'Sapphire', libra: 'Opal', scorpio: 'Topaz',
  sagittarius: 'Turquoise', capricorn: 'Garnet', aquarius: 'Amethyst', pisces: 'Aquamarine',
};

const DIRECTIONS = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];


export function fetchDailyReading(sign: ZodiacSign, date: Date = new Date()): DailyReading {
  // The daily reading is DERIVED from computed planetary positions
  // (src/lib/transits.ts). The narrative is COMPOSED from the day's computed
  // transits by src/lib/horoscope/compose.ts (aspect sentences keyed to the
  // aspects actually present, the Moon's computed sign and phase, and the
  // sign ruler's aspects), so the text differs because the sky differs.
  // There is no static narrative pool and no seeded randomness anywhere in
  // the daily, weekly or monthly readings.
  const derived = deriveDaily(sign, date);
  const narrative = composeDailyNarrative(sign, date);
  const label = (k: string) => derived.positions.find((p) => p.planet === k)?.label ?? k;
  const rulerAspects = derived.aspects
    .filter((a) => a.a === SIGN_RULERS[sign] || a.b === SIGN_RULERS[sign])
    .slice(0, 4)
    .map((a) => `${label(a.a)} ${a.kind} ${label(a.b)} (orb ${a.orb.toFixed(1)}\u00B0)`);

  return {
    overall: derived.meters.overall,
    love: derived.meters.love,
    career: derived.meters.career,
    health: derived.meters.health,
    finance: derived.meters.finance,
    spirituality: derived.meters.spirituality,
    summary: narrative.slice(0, 150) + '...',
    narrative,
    lucky_number: derived.luckyNumber,
    lucky_color: derived.luckyColor,
    lucky_gemstone: GEMSTONES[sign],
    lucky_direction: derived.luckyDirection,
    best_time: derived.bestTime,
    mood: derived.mood,
    compatibility: derived.compatibility as ZodiacSign,
    challenging: derived.challenging as ZodiacSign,
    transits: derived.positions.map((p) => ({
      planet: p.label,
      sign: p.sign,
      degree: Math.round(p.degreeInSign * 10) / 10,
      retrograde: p.retrograde,
    })),
    transit_aspects: rulerAspects,
    transit_method: derived.method,
  };
}

// ─── weekly forecast ─────────────────────────────────────────────────────────

export function fetchWeeklyForecast(sign: ZodiacSign, refDate: Date = new Date()): WeeklyForecast {
  // Aggregated from the daily engine per the monthly framework method:
  // deriveDaily runs for each of the week's seven days, best and
  // challenging days are ranked from those computed daily meters and the
  // aspects to the sign's ruler. No seeded randomness.
  const w = computeWeekly(sign, refDate);
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  return {
    week_start: fmt(w.weekStart),
    week_end: fmt(w.weekEnd),
    overall: w.overall,
    summary: w.summary,
    best_days: w.bestDays,
    challenging_days: w.challengingDays,
  };
}

// ─── monthly forecast ─────────────────────────────────────────────────────────

export function fetchMonthlyForecast(sign: ZodiacSign, refDate: Date = new Date()): MonthlyForecast {
  // Aggregated from the daily engine per content-bank/horoscope/
  // monthly-framework.md: the summary is composed from the month's real
  // computed ingresses, Moon phase dates and strongest days for the sign,
  // and the overall meter is the mean of the daily meters. No seeded
  // randomness and no fixed highlight-date table.
  const m = computeMonthly(sign, refDate);
  return {
    month: m.month,
    month_name: m.monthName,
    overall: m.overall,
    summary: m.summary,
    highlight_dates: m.highlightDates,
  };
}

// ─── sign compatibility ───────────────────────────────────────────────────────

const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  aries:       { aries: 70, taurus: 50, gemini: 85, cancer: 45, leo: 95, virgo: 55, libra: 65, scorpio: 60, sagittarius: 93, capricorn: 50, aquarius: 80, pisces: 55 },
  taurus:      { aries: 50, taurus: 80, gemini: 45, cancer: 85, leo: 55, virgo: 90, libra: 70, scorpio: 88, sagittarius: 40, capricorn: 95, aquarius: 50, pisces: 85 },
  gemini:      { aries: 85, taurus: 45, gemini: 65, cancer: 50, leo: 80, virgo: 55, libra: 90, scorpio: 45, sagittarius: 70, capricorn: 40, aquarius: 95, pisces: 55 },
  cancer:      { aries: 45, taurus: 85, gemini: 50, cancer: 70, leo: 55, virgo: 80, libra: 45, scorpio: 95, sagittarius: 40, capricorn: 60, aquarius: 45, pisces: 95 },
  leo:         { aries: 95, taurus: 55, gemini: 80, cancer: 55, leo: 75, virgo: 50, libra: 85, scorpio: 65, sagittarius: 93, capricorn: 45, aquarius: 70, pisces: 60 },
  virgo:       { aries: 55, taurus: 90, gemini: 55, cancer: 80, leo: 50, virgo: 70, libra: 65, scorpio: 85, sagittarius: 45, capricorn: 93, aquarius: 55, pisces: 80 },
  libra:       { aries: 65, taurus: 70, gemini: 90, cancer: 45, leo: 85, virgo: 65, libra: 75, scorpio: 55, sagittarius: 80, capricorn: 55, aquarius: 93, pisces: 65 },
  scorpio:     { aries: 60, taurus: 88, gemini: 45, cancer: 95, leo: 65, virgo: 85, libra: 55, scorpio: 80, sagittarius: 50, capricorn: 75, aquarius: 45, pisces: 97 },
  sagittarius: { aries: 93, taurus: 40, gemini: 70, cancer: 40, leo: 93, virgo: 45, libra: 80, scorpio: 50, sagittarius: 75, capricorn: 55, aquarius: 88, pisces: 50 },
  capricorn:   { aries: 50, taurus: 95, gemini: 40, cancer: 60, leo: 45, virgo: 93, libra: 55, scorpio: 75, sagittarius: 55, capricorn: 80, aquarius: 50, pisces: 85 },
  aquarius:    { aries: 80, taurus: 50, gemini: 95, cancer: 45, leo: 70, virgo: 55, libra: 93, scorpio: 45, sagittarius: 88, capricorn: 50, aquarius: 75, pisces: 60 },
  pisces:      { aries: 55, taurus: 85, gemini: 55, cancer: 95, leo: 60, virgo: 80, libra: 65, scorpio: 97, sagittarius: 50, capricorn: 85, aquarius: 60, pisces: 80 },
};

const COMPATIBILITY_DESCRIPTIONS: Record<string, string> = {
  fire_fire: 'Two fire signs create passionate energy. Excitement and spontaneity abound, but both mustlearn patience.',
  fire_earth: 'Fire ignites earth\'s practicality. Together you build lasting structures, but respect each other\'s pace.',
  fire_air: 'Fire and air fuel each other magnificently. Ideas become action; action inspires ideas.',
  fire_water: 'Fire meets water, steam or warmth depends on approach. Deep emotional lessons await.',
  earth_earth: 'Two earth signs build solid foundations. Security and sensuality flourish. Add occasional flexibility.',
  earth_air: 'Earth grounds air\'s ideas; air lifts earth\'s practicality. Balance logic with material results.',
  earth_water: 'Earth and water grow beautiful gardens together. Emotional security meets practical support.',
  air_air: 'Two air signs create intellectual fireworks. Communication flows endlessly, remember to feel too.',
  air_water: 'Air and water navigate the depths. Emotional understanding meets mental clarity, embrace both.',
  water_water: 'Two water signs create deep emotional seas. Intuitive understanding is profound, avoid drowning.',
};

export function fetchSignsCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): SignsCompatibility {
  const score1 = COMPATIBILITY_MATRIX[sign1]?.[sign2] ?? 50;
  const score2 = COMPATIBILITY_MATRIX[sign2]?.[sign1] ?? 50;
  const percentage = Math.round((score1 + score2) / 2);

  const getElementPair = (s: ZodiacSign) => ZODIAC_SIGNS.find(z => z.key === s)?.element ?? 'fire';
  const e1 = getElementPair(sign1);
  const e2 = getElementPair(sign2);
  const pairKey = [e1, e2].sort().join('_');

  const description = COMPATIBILITY_DESCRIPTIONS[pairKey] ?? 'This combination creates unique dynamics that require mutual understanding and adaptation.';

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (percentage >= 85) {
    strengths.push('Natural understanding', 'Harmonious energy', 'Complementary strengths');
    challenges.push('May avoid necessary conflicts');
  } else if (percentage >= 70) {
    strengths.push('Good communication potential', 'Shared values', 'Balanced energy');
    challenges.push('Different approaches', 'Occasional tension');
  } else if (percentage >= 50) {
    strengths.push('Growth opportunity', 'Different perspectives', 'Can learn from each other');
    challenges.push('Different priorities', 'Misunderstandings possible', 'Effort needed');
  } else {
    strengths.push('Challenge brings growth', 'Very different energies');
    challenges.push('Fundamental differences', 'Requires conscious effort', 'Patient understanding needed');
  }

  return {
    sign1,
    sign2,
    percentage,
    description,
    strengths,
    challenges,
  };
}

// ─── numerology ───────────────────────────────────────────────────────────────

export interface NumerologyData {
  universalDayNumber: number;
  date: string;
  meaning: string;
  focus: string;
  color: string;
  affirmation: string;
}

export interface BirthNumerology {
  lifePathNumber: number;
  personalYearNumber: number;
  lifePathMeaning: string;
  lifePathFocus: string;
  personalYearMeaning: string;
  personalYearFocus: string;
}

const NUMEROLOGY_MEANINGS: Record<number, { meaning: string; focus: string; color: string; affirmation: string }> = {
  1: {
    meaning: 'Leadership',
    focus: 'New beginnings, independence, initiative, pioneering spirit',
    color: 'Red',
    affirmation: 'I lead with confidence and embrace new beginnings.',
  },
  2: {
    meaning: 'Harmony',
    focus: 'Partnership, balance, cooperation, diplomacy, sensitivity',
    color: 'Orange',
    affirmation: 'I create harmony through cooperation and understanding.',
  },
  3: {
    meaning: 'Creativity',
    focus: 'Self-expression, joy, communication, artistic pursuits, optimism',
    color: 'Yellow',
    affirmation: 'I express my creativity freely and joyfully.',
  },
  4: {
    meaning: 'Structure',
    focus: 'Stability, hard work, practicality, building foundations, discipline',
    color: 'Green',
    affirmation: 'I build strong foundations for lasting success.',
  },
  5: {
    meaning: 'Freedom',
    focus: 'Change, adventure, adaptability, versatility, resourcefulness',
    color: 'Turquoise',
    affirmation: 'I embrace change and move freely through life.',
  },
  6: {
    meaning: 'Nurturing',
    focus: 'Love, family, responsibility, care, harmony in relationships, service',
    color: 'Indigo',
    affirmation: 'I nurture with love and create harmony in my relationships.',
  },
  7: {
    meaning: 'Wisdom',
    focus: 'Spirituality, introspection, analysis, inner knowledge, seeking truth',
    color: 'Violet',
    affirmation: 'I seek wisdom through reflection and inner knowing.',
  },
  8: {
    meaning: 'Power',
    focus: 'Abundance, success, authority, material mastery, karma, achievement',
    color: 'Gold',
    affirmation: 'I step into my power and attract abundance.',
  },
  9: {
    meaning: 'Completion',
    focus: 'Humanitarianism, compassion, endings, transformation, universal love',
    color: 'White',
    affirmation: 'I release what no longer serves and embrace transformation.',
  },
};

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
  }
  return num;
}

export function getNumerologyForToday(): NumerologyData {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const sum = day + month + year;
  const universalNumber = reduceToSingleDigit(sum);

  const data = NUMEROLOGY_MEANINGS[universalNumber];

  return {
    universalDayNumber: universalNumber,
    date: now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    meaning: data.meaning,
    focus: data.focus,
    color: data.color,
    affirmation: data.affirmation,
  };
}

export function getBirthNumerology(birthDate: string): BirthNumerology {
  // Parse birth date (YYYY-MM-DD)
  const [year, month, day] = birthDate.split('-').map(Number);

  // Life Path Number: reduce all digits of birth date
  const lifePathSum = String(day).split('').reduce((s, d) => s + parseInt(d, 10), 0) +
                      String(month).split('').reduce((s, m) => s + parseInt(m, 10), 0) +
                      String(year).split('').reduce((s, y) => s + parseInt(y, 10), 0);
  const lifePathNumber = reduceToSingleDigit(lifePathSum);

  // Personal Year Number: day + month + current year
  const currentYear = new Date().getFullYear();
  const personalYearSum = day + month + parseInt(String(currentYear).split('').reduce((s, n) => s + parseInt(n, 10), 0).toString());
  const personalYearNumber = reduceToSingleDigit(personalYearSum);

  const lifePathData = NUMEROLOGY_MEANINGS[lifePathNumber];
  const personalYearData = NUMEROLOGY_MEANINGS[personalYearNumber];

  return {
    lifePathNumber,
    personalYearNumber,
    lifePathMeaning: lifePathData.meaning,
    lifePathFocus: lifePathData.focus,
    personalYearMeaning: personalYearData.meaning,
    personalYearFocus: personalYearData.focus,
  };
}
export function getSignData(sign: ZodiacSign) {
  return ZODIAC_SIGNS.find(s => s.key === sign)!;
}

export function getChineseAnimalData(animal: ChineseAnimal) {
  return CHINESE_ANIMALS.find(a => a.key === animal)!;
}
