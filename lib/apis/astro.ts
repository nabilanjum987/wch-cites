// lib/apis/astro.ts
import { ZodiacResult, ChineseZodiacResult, MoonPhaseResult } from '../../types/horoscope';

const ELEMENT_CYCLE = ['metal','metal','water','water','wood','wood','fire','fire','earth','earth'];
const ELEMENT_EMOJI: Record<string,string> = { wood:'🌿', fire:'🔥', earth:'🌍', metal:'⚪', water:'💧' };

function getElementForYear(year: number): string {
  return ELEMENT_CYCLE[((year - 1900) % 10 + 10) % 10];
}

export function getZodiacFor2025(birthMonth: number, birthDay: number): ZodiacResult {
  const signs: ZodiacResult[] = [
    { sign: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19', rulingPlanet: 'Saturn', quality: 'Cardinal' },
    { sign: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18', rulingPlanet: 'Uranus', quality: 'Fixed' },
    { sign: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20', rulingPlanet: 'Neptune', quality: 'Mutable' },
    { sign: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19', rulingPlanet: 'Mars', quality: 'Cardinal' },
    { sign: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20', rulingPlanet: 'Venus', quality: 'Fixed' },
    { sign: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20', rulingPlanet: 'Mercury', quality: 'Mutable' },
    { sign: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22', rulingPlanet: 'Moon', quality: 'Cardinal' },
    { sign: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22', rulingPlanet: 'Sun', quality: 'Fixed' },
    { sign: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22', rulingPlanet: 'Mercury', quality: 'Mutable' },
    { sign: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22', rulingPlanet: 'Venus', quality: 'Cardinal' },
    { sign: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21', rulingPlanet: 'Pluto', quality: 'Fixed' },
    { sign: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21', rulingPlanet: 'Jupiter', quality: 'Mutable' },
  ];
  const zodiacMap = [
    { month: 1, day: 19, index: 0 }, { month: 2, day: 18, index: 1 },
    { month: 3, day: 20, index: 2 }, { month: 4, day: 19, index: 3 },
    { month: 5, day: 20, index: 4 }, { month: 6, day: 20, index: 5 },
    { month: 7, day: 22, index: 6 }, { month: 8, day: 22, index: 7 },
    { month: 9, day: 22, index: 8 }, { month: 10, day: 22, index: 9 },
    { month: 11, day: 21, index: 10 }, { month: 12, day: 21, index: 11 },
  ];
  for (const entry of zodiacMap) {
    if (birthMonth === entry.month && birthDay <= entry.day) return signs[entry.index];
    if (birthMonth < entry.month) return signs[entry.index];
  }
  return signs[0];
}

export function getChineseAnimalData(birthYear: number): ChineseZodiacResult {
  const baseData = [
    { name: 'Rat',     emoji: '🐭', traits: 'Quick-witted, resourceful, versatile, kind',         description: 'The Rat is clever and quick-witted, thriving in complex situations.',          forecast2025: 'A year of smart opportunities. Trust your instincts in business.' },
    { name: 'Ox',      emoji: '🐂', traits: 'Diligent, dependable, strong, determined',            description: 'The Ox is dependable and strong, achieving through sheer persistence.',          forecast2025: 'Hard work pays off. A strong year for career advancement.' },
    { name: 'Tiger',   emoji: '🐯', traits: 'Brave, confident, competitive, unpredictable',        description: 'The Tiger is brave and confident, a natural born leader.',                       forecast2025: 'Channel energy wisely. Partnerships bring unexpected success.' },
    { name: 'Rabbit',  emoji: '🐰', traits: 'Gentle, elegant, alert, quick',                       description: 'The Rabbit is gentle and elegant, bringing peace wherever they go.',             forecast2025: 'Creative ventures flourish. Strong year for love and beauty.' },
    { name: 'Dragon',  emoji: '🐉', traits: 'Energetic, fearless, warm, charismatic',              description: 'The Dragon is energetic and fearless, the most powerful sign of all.',           forecast2025: 'Post-Dragon year reflection. Financial planning is key.' },
    { name: 'Snake',   emoji: '🐍', traits: 'Wise, intuitive, elegant, creative',                  description: 'The Snake is wise and intuitive, possessing deep thinking and elegance.',        forecast2025: 'YOUR YEAR! Transformative and powerful. Major life changes ahead.' },
    { name: 'Horse',   emoji: '🐴', traits: 'Animated, active, energetic, passionate',             description: 'The Horse is animated and energetic, always chasing freedom.',                   forecast2025: 'Travel and adventure call. Stay grounded in relationships.' },
    { name: 'Goat',    emoji: '🐏', traits: 'Calm, gentle, sympathetic, creative',                 description: 'The Goat is calm and creative, with a strong artistic sensibility.',             forecast2025: 'Artistic pursuits rewarded. Home and family bring joy.' },
    { name: 'Monkey',  emoji: '🐒', traits: 'Smart, energetic, witty, versatile',                  description: 'The Monkey is smart and witty, solving problems with innovative flair.',         forecast2025: 'Innovation wins. New tech and business ideas take off.' },
    { name: 'Rooster', emoji: '🐓', traits: 'Observant, hardworking, courageous, talented',        description: 'The Rooster is observant and hardworking, with an eye for detail.',              forecast2025: 'Recognition for past effort arrives. Health requires attention.' },
    { name: 'Dog',     emoji: '🐶', traits: 'Loyal, sociable, carefree, considerate',              description: 'The Dog is loyal and honest, standing by loved ones with fierce devotion.',      forecast2025: 'Deepen meaningful relationships. Avoid impulsive decisions.' },
    { name: 'Pig',     emoji: '🐷', traits: 'Compassionate, generous, diligent, courageous',       description: 'The Pig is compassionate and generous, living with sincerity.',                  forecast2025: 'Abundance rewards generosity. Investments made wisely grow.' },
  ];
  const index = ((birthYear - 1900) % 12 + 12) % 12;
  const d = baseData[index];
  const el = getElementForYear(birthYear);
  return {
    animal: { name: d.name, emoji: d.emoji, traits: d.traits },
    emoji: d.emoji,
    description: d.description,
    element: el,
    elementEmoji: ELEMENT_EMOJI[el] || '✨',
    birthYear: birthYear,
    element2025: 'Wood Snake energy',
    years: [],
    traits: d.traits,
    forecast2025: d.forecast2025,
    yearAnimal: { name: 'Snake', emoji: '🐍', traits: 'Wise, intuitive, elegant, creative' },
  };
}

export function getChineseZodiacForYear(year: number): ChineseZodiacResult {
  return getChineseAnimalData(year);
}

export function getChineseZodiacFor2025(): ChineseZodiacResult {
  return getChineseAnimalData(2025);
}

export function getCurrentSunSign(): ZodiacResult {
  const now = new Date();
  return getZodiacFor2025(now.getMonth() + 1, now.getDate());
}

export async function getMoonPhase(lat: number, lng: number): Promise<MoonPhaseResult> {
  const now = new Date();
  const known = new Date('2025-01-13');
  const daysSince = (now.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycleDay = ((daysSince % 29.53) + 29.53) % 29.53;
  let phase: string; let illumination: number;
  if (cycleDay < 1.85) { phase = 'New Moon'; illumination = 0; }
  else if (cycleDay < 7.38) { phase = 'Waxing Crescent'; illumination = Math.round((cycleDay / 7.38) * 50); }
  else if (cycleDay < 9.22) { phase = 'First Quarter'; illumination = 50; }
  else if (cycleDay < 14.77) { phase = 'Waxing Gibbous'; illumination = Math.round(50 + ((cycleDay - 9.22) / 5.55) * 50); }
  else if (cycleDay < 16.61) { phase = 'Full Moon'; illumination = 100; }
  else if (cycleDay < 22.15) { phase = 'Waning Gibbous'; illumination = Math.round(100 - ((cycleDay - 16.61) / 5.54) * 50); }
  else if (cycleDay < 23.99) { phase = 'Last Quarter'; illumination = 50; }
  else { phase = 'Waning Crescent'; illumination = Math.round(50 - ((cycleDay - 23.99) / 5.54) * 50); }
  const moonEmojis: Record<string,string> = { 'New Moon':'🌑','Waxing Crescent':'🌒','First Quarter':'🌓','Waxing Gibbous':'🌔','Full Moon':'🌕','Waning Gibbous':'🌖','Last Quarter':'🌗','Waning Crescent':'🌘' };
  return { phase, illumination, emoji: moonEmojis[phase] || '🌙', moonrise: null, moonset: null, distance: null };
}

export async function getNasaSkyEvents(): Promise<{ events: string[] }> {
  return { events: ['Meteor showers visible this month', 'Jupiter visible after sunset', 'Milky Way core season approaching'] };
}

// ─── Vedic Panchang ───────────────────────────────────────────────────────────

export interface VedicPanchangData {
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  auspicious_times: string[];
  inauspicious_times: string[];
  deity: string;
  practice: string;
}

export function fetchVedicPanchang(): VedicPanchangData {
  const now = new Date();
  const day = now.getDay();

  const tithis = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima'];
  const nakshatras = ['Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishtha','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'];
  const yogas = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyana','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'];
  const karanas = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Bhadra','Shakuni','Chatushpada','Naga'];

  const deities = ['Lord Ganesha','Goddess Saraswati','Lord Vishnu','Goddess Lakshmi','Lord Shiva','Goddess Durga','Lord Surya'];
  const practices = ['Meditation & Mantra','Charity & Service','Fasting & Prayer','Study of Scripture','Yoga & Breathwork','Devotional Singing','Gratitude Practice'];

  const auspiciousSlots = [
    ['06:00 – 07:30','10:00 – 11:30','15:00 – 16:30'],
    ['07:00 – 08:30','11:00 – 12:30','16:00 – 17:30'],
    ['06:30 – 08:00','12:00 – 13:30','17:00 – 18:30'],
    ['08:00 – 09:30','13:00 – 14:30','18:00 – 19:30'],
    ['07:30 – 09:00','11:30 – 13:00','15:30 – 17:00'],
    ['06:00 – 08:00','10:30 – 12:00','14:00 – 15:30'],
    ['09:00 – 10:30','13:30 – 15:00','17:30 – 19:00'],
  ];

  const inauspiciousSlots = [
    ['08:00 – 09:00 (Rahu Kaal)','12:00 – 13:30 (Gulika)'],
    ['15:00 – 16:30 (Rahu Kaal)','09:00 – 10:30 (Gulika)'],
    ['12:00 – 13:30 (Rahu Kaal)','06:00 – 07:30 (Gulika)'],
    ['13:30 – 15:00 (Rahu Kaal)','10:30 – 12:00 (Gulika)'],
    ['10:30 – 12:00 (Rahu Kaal)','13:30 – 15:00 (Gulika)'],
    ['09:00 – 10:30 (Rahu Kaal)','15:00 – 16:30 (Gulika)'],
    ['16:30 – 18:00 (Rahu Kaal)','07:30 – 09:00 (Gulika)'],
  ];

  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);

  return {
    tithi: tithis[dayOfYear % tithis.length],
    nakshatra: nakshatras[dayOfYear % nakshatras.length],
    yoga: yogas[dayOfYear % yogas.length],
    karana: karanas[dayOfYear % karanas.length],
    auspicious_times: auspiciousSlots[day],
    inauspicious_times: inauspiciousSlots[day],
    deity: deities[day],
    practice: practices[day],
  };
}
