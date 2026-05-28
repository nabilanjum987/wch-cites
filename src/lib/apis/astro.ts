import type {
  ZodiacSign, MoonPhaseData, SkyRightNowData, SkyEventData, DailyReading,
  WeeklyForecast, MonthlyForecast, SignsCompatibility, ChineseAnimal, ChineseElement,
  ChineseZodiacResult, VedicPanchangData, MoonPhaseDay
} from '../../types/horoscope';
import { ZODIAC_SIGNS, CHINESE_ANIMALS, CHINESE_ELEMENT_COLORS } from '../../types/horoscope';

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
    const date = new Date(y, m, d);
    const phaseData = getMoonPhaseForDate(date);
    calendar.push({
      date,
      phase: phaseData.phase,
      phaseName: phaseData.phase_name,
      emoji: phaseData.emoji,
    });
  }
  return calendar;
}

// ─── current sun zodiac sign ─────────────────────────────────────────────────

export function getCurrentSunSign(): { sign: ZodiacSign; transitionDate: string } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  let currentSign: ZodiacSign = 'capricorn';
  let transitionDate = '';

  for (const s of ZODIAC_SIGNS) {
    const startsAfter = month > s.start_month || (month === s.start_month && day >= s.start_day);
    if (s.key === 'capricorn') {
      const inCapricorn = (month === 12 && day >= 22) || (month === 1 && day <= 19);
      if (inCapricorn) {
        currentSign = 'capricorn';
        const aquarius = ZODIAC_SIGNS.find(z => z.key === 'aquarius')!;
        transitionDate = `${aquarius.start_month}/${aquarius.start_day}`;
      }
    } else if (startsAfter) {
      currentSign = s.key;
      const idx = ZODIAC_SIGNS.indexOf(s);
      const next = ZODIAC_SIGNS[(idx + 1) % 12];
      transitionDate = `${next.start_month}/${next.start_day}`;
    }
  }

  return { sign: currentSign, transitionDate };
}

// ─── moon zodiac sign (simplified approximation) ─────────────────────────────

export function getMoonSign(): ZodiacSign {
  const now = new Date();
  const epoch = new Date('2024-01-01T00:00:00Z');
  const daysSince = (now.getTime() - epoch.getTime()) / 86400000;
  const signIndex = Math.floor((daysSince / 2.5) % 12);
  const signs: ZodiacSign[] = ['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'];
  return signs[signIndex];
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
  const moonPhase = getMoonPhaseForDate(new Date());
  const { sign: sunSign, transitionDate } = getCurrentSunSign();
  const moonSign = getMoonSign();

  return {
    moon: {
      phase: moonPhase.phase,
      illumination: moonPhase.illumination,
      phase_name: moonPhase.phase_name,
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
  const animal = CHINESE_ANIMALS.find(a => a.years.includes(birthYear));
  if (!animal) return null;

  const elements: ChineseElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const elementIndex = Math.floor((birthYear - 4) % 10 / 2);
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
    forecast2025: `${animal.forecast_2025} ${elementForecast[element]}`,
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

const NARRATIVES: Record<ZodiacSign, string[]> = {
  aries: [
    "The cosmos ignites your pioneering spirit today, Aries. Mars fuels your courage, making this an ideal time to initiate projects you've been contemplating. Your natural leadership abilities shine, drawing others to your vision. However, remember that even warriors need rest—pacing yourself ensures you'll have energy for the battles that truly matter. A surprise encounter midday could shift your perspective entirely.",
    "Today's celestial configuration creates a powerful trine to your sign, energizing your communication sector. Words flow easily, making this perfect for important conversations or presentations. The morning hours favor bold moves, while afternoon brings reflective clarity. Someone from your past may resurface with unexpected news.",
    "You're operating at peak capacity today, Aries. Your decisiveness cuts through confusion like a blade. Trust your gut instincts—they're aligned with cosmic wisdom right now. Financial matters look promising, especially around mid-afternoon. Channel any restlessness into physical activity rather than impulsive spending.",
  ],
  taurus: [
    "Venus graces your sector of values today, Taurus, bringing harmony to both material and spiritual pursuits. Your famous patience proves its worth as a situation unfolds exactly as you'd hoped it would. The afternoon brings a chance for meaningful connection—whether romance or deep friendship. Your practical wisdom solves a problem that's been puzzling others.",
    "Stability meets opportunity today. The ground beneath you feels solid, yet doors are opening you hadn't noticed before. Your appreciation for quality helps youspot a genuine investment or relationship opportunity. Evening hours favor luxury and self-care—you've earned it. Family matters bring unexpected joy.",
    "Your ruling planet Venus forms a supportive aspect that enhances both creativity and romance. Artistic Taureans find their muse cooperative today; those in relationships discover new depths of intimacy. Practical matters also flourish—your methodical approach to a complex project yields breakthrough results. Listen to advice from an elder.",
  ],
  gemini: [
    "Mercury's dance through your sign amplifies your natural curiosity and wit, Gemini. Information flows your way effortlessly, and your ability to connect disparate insights could lead to a breakthrough understanding. Social interactions sparkle with your usual charm, but a deeper conversation reveals something unexpected about a friend or colleague.",
    "Your twin nature serves you exceptionally well today—you can toggle between detailed analysis and big-picture thinking with remarkable ease. Morning favors communication projects, while afternoon welcomes creative exploration. A sibling or neighbor brings important news. Travel, even local, opens surprising doors.",
    "The cosmic messenger aligns in your favor, Gemini, making today flow differently—words carry more weight, connections happen more easily. Your adaptability is your superpower now, allowing you to navigate a shifting situation with grace while others struggle. An old idea resurfaces, but now you have the context to understand its true value.",
  ],
  cancer: [
    "The Moon's nurturing energy wraps around you protectively today, Cancer. Your famous intuition is especially sharp, helping you sense the emotional undercurrents in any room. A family matter that's been weighing on you begins to resolve itself. Evening brings a nostalgic moment that proves unexpectedly healing.",
    "Home is your sanctuary and your strength today. Your ability to create comfort and safety for others opens a door you didn't expect. Financial matters favor patience—a long-term approach yields better results than quick fixes. Your nurturing nature attracts someone who needs exactly your kind of care.",
    "Emotional depth serves you well today, Cancer. What others dismiss as sentimentality, you recognize as wisdom. Your dreams tonight may carry messages about an ongoing situation. The afternoon brings a chance to deepen a bond with someone you've kept at arm's length. Your home could benefit from a small change that makes a big difference.",
  ],
  leo: [
    "The Sun's golden spotlight finds you naturally today, Leo—no effort required. Your radiance attracts admiration and opportunity in equal measure. Creative projects that have been simmering are ready to show the world. Your generousspirit helps someone who will remember this kindness. Romance glows in the evening hours.",
    "Your natural charisma reaches peak form today. Leadership opportunities present themselves—some obvious, others disguised as challenges. Trust your dramatic instincts; they know when to take center stage and when to let others shine. A child or young person teaches you something profound. Financial matters look favorable.",
    "Royalty is earned, not inherited, and today you earn yours, Leo. Your ability to uplift others while pursuing your own goals creates a virtuous cycle. The afternoon brings recognition for past efforts. Love affairs take on a storybook quality—not superficial fantasy, but genuine romance with depth.",
  ],
  virgo: [
    "Mercury sharpens your analytical powers to laser precision today, Virgo. Problems that have resisted solution suddenly reveal their missing pieces. Your attention to detail, far from being nitpicking, saves someone from a costly mistake. Health matters focus on small improvements that compound significantly over time.",
    "Your dedication to improvement shines today, Virgo—both self-improvement and helping others refine their approach. A work project benefits immensely from your methodical review. Your critical eye, often misunderstood, is recognized today for the gift it truly is. Evening hours favor peaceful domestic rituals.",
    "Service without sacrifice: that's today's theme for you, Virgo. You can give generously while still maintaining your boundaries. A health routine you've been considering shows promise—research supports your instincts. Your practical wisdom helps a friend sort through excessive options to find what truly fits.",
  ],
  libra: [
    "Venus enhances your natural harmony-seeking today, Libra, making you the peacemaker others turn to in conflicts. Your diplomatic skills prevent a misunderstandings that could have lasting consequences. Aesthetic matters bring joy—whether art, fashion, or beautifying your space. Romance flourishes under today's softer aspects.",
    "Balance isn't passive, Libra—today it requires active adjustment. You'll know exactly when to speak up and when to hold back, when to push and when to yield. A partnership that's been unbalanced begins to even out. Financial harmony could come through compromise that actually benefits everyone.",
    "Your gift for seeing all sides reaches new depths today, Libra. While others polarize, you synthesize—and that synthesis is valuable beyond measure. A legal or contractual matter moves toward resolution. Your social circle brings a delightful surprise. Evening favorselegant entertainment or refined romance.",
  ],
  scorpio: [
    "Pluto's transformative power courses through your day, Scorpio. What others fear, you embrace: necessary endings and powerful beginnings. A situation that seemed stuck suddenly shifts. Your penetrating insight sees through pretenses to the truth underneath. This knowledge, used wisely, becomes power.",
    "The day demands depth that only you can provide, Scorpio. Superficial interactions drain you; meaningful exchanges energize. Someone finally tells you the truth about a matter you've been sensing—and it confirms your instincts. Evening favors privacy and intimate conversation over public appearances.",
    "Your intensity is an asset today, Scorpio, not something to moderate. Research, investigation, detection—all Scorpio skills that the cosmos activates now. A financial matter involving shared resources shows a path forward. Your ability to keep secrets makes someone trust you with precious information.",
  ],
  sagittarius: [
    "Jupiter expands your horizons today, Sagittarius—in more ways than one. Physical travel could take you somewhere significant; mental journeys prove equally rewarding. Your optimism, far from being blind, is rooted in genuine possibility. Teaching and learning experiences bring mutual rewards. Truth reveals itself.",
    "Adventure doesn't require leaving home today, Sagittarius—you can find it in ideas, conversations, or even restructuring your daily routine. A philosophical discussion changes your perspective on something you thought you knew. International connections spark joy. Your sense of humor disarms tension effectively.",
    "Your arrow flies true today, Sagittarius, hitting targets you've been aiming at for some time. The freedom you've been seeking appears, but it may not look like what you expected. A mentor or mentorship opportunity emerges naturally. Evening hours favor big plans and grand visions—share them with kindred spirits.",
  ],
  capricorn: [
    "Saturn rewards your discipline today, Capricorn—results you've been working toward start materializing. Your reputation for reliability brings a serious opportunity your way. Authority figures take notice of your quiet competence. Career matters favor the strategic, long-game approach you excel at.",
    "Ambition meets opportunity today, Capricorn. Your careful planning pays off, but unexpectedly—results exceed projections. A mentor from your past influences your present thinking. Material matters solidify: property, investments, legacy considerations. Your respect for tradition opens a door to genuine innovation.",
    "The mountain doesn't look as steep today, Capricorn—you can see the route more clearly. Your pragmatic approach to a sentimental situation helps everyone involved. Family responsibilities and career ambitions find a workable balance. Someone finally acknowledges how much you contribute.",
  ],
  aquarius: [
    "Uranus electrifies your day with unexpected but welcome developments, Aquarius. What you thought was a detour turns out to be a shortcut through new territory. Community and friendship networks activate in your favor—people you've helped before are ready to help you now. Innovation distinguishes your approach from everyone else's.",
    "Your uniqueness is your strength today, Aquarius—and others finally see it clearly. A group or community project benefits from your vision. Technology or scientific matters hold special promise. An unusual approach to an ordinary problem yields extraordinary results. Romance favors the unconventional.",
    "The future arrives early today, Aquarius—you feel ahead of the curve in every meaningful way. Your humanitarian instincts guide you to exactly where you're needed without sacrificing your own needs. A social innovation you've proposed gains traction. Independence and connection find surprising synthesis.",
  ],
  pisces: [
    "Neptune opens doors between worlds today, Pisces, and you slip through them with natural grace. Your dreams contain useful information—write them down before they fade. Creative inspiration flows as easily as breathing. Your compassion heals someone who desperately needs it, though you may not know it until later.",
    "Intuition over intellect today, Pisces—your usual strength reversed. What can't be known logically can be sensed accurately. Water-related matters hold significance. Your ability to dissolve boundaries helps someone stuck in rigid thinking. Artistic pursuits bring both joy and potentially recognition.",
    "The ocean of the unconscious rises close to the surface today, Pisces, making everything more fluid and meaningful. A creative project that's been eluding you finally takes shape. Your sensitivity to atmosphere helps you avoid a difficult situation. Evening hours favor music, meditation, and mystical exploration.",
  ],
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function fetchDailyReading(sign: ZodiacSign): DailyReading {
  const now = new Date();
  const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.key === sign);
  const seed = daySeed + signIndex * 31;

  const r = (offset: number) => seededRandom(seed + offset);

  const overall = Math.max(1, Math.min(5, Math.round(r(1) * 4 + 1)));
  const love = Math.max(1, Math.min(5, Math.round(r(2) * 4 + 1)));
  const career = Math.max(1, Math.min(5, Math.round(r(3) * 4 + 1)));
  const health = Math.max(1, Math.min(5, Math.round(r(4) * 4 + 1)));
  const finance = Math.max(1, Math.min(5, Math.round(r(5) * 4 + 1)));
  const spirituality = Math.max(1, Math.min(5, Math.round(r(6) * 4 + 1)));

  const narratives = NARRATIVES[sign];
  const narrative = narratives[Math.floor(r(7) * narratives.length)];

  const luckyNumber = Math.floor(r(8) * 99) + 1;
  const COLORS_SHORT = ['Red', 'Blue', 'Green', 'Gold', 'Silver', 'Purple', 'Orange', 'Turquoise', 'Coral', 'Ivory', 'Navy', 'Amber'];
  const luckyColor = COLORS_SHORT[Math.floor(r(9) * COLORS_SHORT.length)];
  const luckyGemstone = GEMSTONES[sign];
  const luckyDirection = DIRECTIONS[Math.floor(r(10) * DIRECTIONS.length)];
  const bestHour = 6 + Math.floor(r(11) * 12);
  const ampm = bestHour >= 12 ? 'PM' : 'AM';
  const displayHour = bestHour > 12 ? bestHour - 12 : bestHour || 12;
  const bestTime = `${displayHour}:00 ${ampm}`;

  const MOODS = ['Energetic', 'Reflective', 'Passionate', 'Calm', 'Curious', 'Determined', 'Playful', 'Introspective', 'Bold', 'Harmonious'];
  const mood = MOODS[Math.floor(r(12) * MOODS.length)];

  const compatIndex = Math.floor(r(13) * 12);
  const compatibility = ZODIAC_SIGNS[compatIndex].key;
  const challengeIndex = Math.floor(r(14) * 12);
  const challenging = ZODIAC_SIGNS[challengeIndex].key;

  return {
    overall, love, career, health, finance, spirituality,
    summary: narrative.slice(0, 150) + '...',
    narrative,
    lucky_number: luckyNumber,
    lucky_color: luckyColor,
    lucky_gemstone: luckyGemstone,
    lucky_direction: luckyDirection,
    best_time: bestTime,
    mood,
    compatibility,
    challenging,
  };
}

// ─── weekly forecast ─────────────────────────────────────────────────────────

export function fetchWeeklyForecast(sign: ZodiacSign): WeeklyForecast {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const signIndex = ZODIAC_SIGNS.findIndex(s => s.key === sign);
  const weekSeed = now.getFullYear() * 100 + now.getMonth() + signIndex;
  const r = (offset: number) => seededRandom(weekSeed + offset);

  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const bestDays = dayNames.filter((_, i) => r(i + 10) > 0.6).slice(0, 2);
  const challengingDays = dayNames.filter((_, i) => r(i + 20) < 0.3 && !bestDays.includes(dayNames[i])).slice(0, 1);

  const overall = Math.max(1, Math.min(5, Math.round(r(5) * 4 + 1)));

  const SUMMARIES: Record<ZodiacSign, string> = {
    aries: 'This week favors bold initiation mid-week, with Tuesday and Wednesday being your power days. Take action before overthinking.',
    taurus: 'Financial matters come into focus. Patience early in the week yields results by weekend. Avoid impulsive purchases Wednesday.',
    gemini: 'Communication flows brilliantly. Important conversations succeed, especially Thursday. Social connections bring opportunities.',
    cancer: 'Family and home matters take precedence. Nurture loved ones and yourself. Weekend brings emotional clarity and bonding.',
    leo: 'Creative energy peaks this week. Share your ideas boldly. Recognition comes from unexpected quarters on Friday.',
    virgo: 'Details matter more than usual. Your analytical approach saves the day mid-week. Health improvements show results.',
    libra: 'Relationships flourish under this week\'s aspects. Harmony comes through compromise that is actually wise strategy.',
    scorpio: 'Transformation continues. Let go of what no longer serves you. Thursday reveals something previously hidden.',
    sagittarius: 'Adventure calls, even locally. New perspectives refresh your thinking. Learning something new opens doors.',
    capricorn: 'Career advancement is favored. Your disciplined approach impresses decision-makers. Friday brings good news.',
    aquarius: 'Innovation distinguishes you. Community ventures thrive. An unusual collaboration proves surprisingly effective.',
    pisces: 'Intuition guides you correctly all week. Creative projects flow. Spiritual practices deepen your clarity.',
  };

  return {
    week_start: monday.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    week_end: sunday.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    overall,
    summary: SUMMARIES[sign],
    best_days: bestDays.length > 0 ? bestDays : ['Wednesday', 'Friday'],
    challenging_days: challengingDays.length > 0 ? challengingDays : [],
  };
}

// ─── monthly forecast ─────────────────────────────────────────────────────────

export function fetchMonthlyForecast(sign: ZodiacSign): MonthlyForecast {
  const now = new Date();
  const month = now.getMonth();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const signIndex = ZODIAC_SIGNS.findIndex(s => s.key === sign);
  const monthSeed = now.getFullYear() * 100 + month + signIndex * 7;
  const r = (offset: number) => seededRandom(monthSeed + offset);

  const overall = Math.max(1, Math.min(5, Math.round(r(1) * 4 + 1)));

  const HIGHLIGHTS: Record<number, string[]> = {
    0: ['5th', '12th', '20th', '28th'],
    1: ['3rd', '14th', '19th', '25th'],
    2: ['7th', '15th', '21st', '29th'],
    3: ['4th', '11th', '18th', '26th'],
    4: ['2nd', '13th', '22nd', '27th'],
    5: ['6th', '16th', '23rd', '30th'],
    6: ['1st', '12th', '17th', '24th'],
    7: ['5th', '14th', '20th', '29th'],
    8: ['3rd', '11th', '19th', '27th'],
    9: ['7th', '15th', '22nd', '28th'],
    10: ['4th', '12th', '18th', '25th'],
    11: ['2nd', '13th', '21st', '26th'],
  };

  const MONTH_SUMMARIES: Record<ZodiacSign, string> = {
    aries: 'This month fuels your pioneering spirit. New projects, especially those involving leadership or physical activity, thrive. The second week is most powerful for initiating.',
    taurus: 'Material matters come into focus. Financial decisions made carefully at month\'s start. A relationship deepens mid-month. Home improvements bring lasting satisfaction.',
    gemini: 'Communication dominates this month\'s themes. Important documents, negotiations, or learning ventures succeed. Social connections open unexpected doors.',
    cancer: 'Emotional foundations strengthen. Family bonds grow through acts of care. A nostalgic moment leads to healing. Financial matters favor traditional approaches.',
    leo: 'Creativity and romance color this month beautifully. Express yourself boldly. Recognition comes, perhaps from an unexpected quarter. Children or creative projects bring joy.',
    virgo: 'Details are your domain, and this month rewards your careful attention. Health matters improve with consistency. Work projects gain momentum toward month\'s end.',
    libra: 'Partnerships are the focus now, both personal and professional. Harmony comes not from avoiding conflict but through gracefully navigating it. Artistic projects flourish.',
    scorpio: 'Transformation continues its work, sometimes visible, often subtle. Research and investigation reveal valuable truths. Financial matters involving others yield results.',
    sagittarius: 'Expansion is the month\'s theme—mentally, physically, or spiritually. Travel, even short-distance, refreshes perspective. Teaching or learning proves rewarding.',
    capricorn: 'Career matters climb steadily. Authority figures respond to your competence. A long-term investment matures. Structure what you\'ve built for lasting impact.',
    aquarius: 'Innovation leads to breakthrough this month. Community connections prove valuable. An unconventional approach solves what standard methods could not.',
    pisces: 'Intuition proves remarkably accurate this month. Creative work or spiritual practice deepens. Dreams offer guidance; compassionate acts ripple outward.',
  };

  return {
    month: month + 1,
    month_name: monthNames[month],
    overall,
    summary: MONTH_SUMMARIES[sign],
    highlight_dates: HIGHLIGHTS[month] ?? ['10th', '20th'],
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
  fire_earth: 'Fire ignites earth\'s practicality. Together you build lasting structures—but respect each other\'s pace.',
  fire_air: 'Fire and air fuel each other magnificently. Ideas become action; action inspires ideas.',
  fire_water: 'Fire meets water—steam or warmth depends on approach. Deep emotional lessons await.',
  earth_earth: 'Two earth signs build solid foundations. Security and sensuality flourish. Add occasional flexibility.',
  earth_air: 'Earth grounds air\'s ideas; air lifts earth\'s practicality. Balance logic with material results.',
  earth_water: 'Earth and water grow beautiful gardens together. Emotional security meets practical support.',
  air_air: 'Two air signs create intellectual fireworks. Communication flows endlessly—remember to feel too.',
  air_water: 'Air and water navigate the depths. Emotional understanding meets mental clarity—embrace both.',
  water_water: 'Two water signs create deep emotional seas. Intuitive understanding is profound—avoid drowning.',
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
