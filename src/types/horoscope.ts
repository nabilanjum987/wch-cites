export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export type ChineseAnimal =
  | 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';

export type ChineseElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export interface ZodiacSignData {
  key: ZodiacSign;
  name: string;
  symbol: string;
  dates: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  ruling_planet: string;
  start_month: number;
  start_day: number;
  end_month: number;
  end_day: number;
}

export interface ChineseAnimalData {
  key: ChineseAnimal;
  name: string;
  emoji: string;
  years: number[];
  traits: string;
  forecast_2025: string;
  compatible_with: ChineseAnimal[];
  challenging_with: ChineseAnimal[];
}

export interface ChineseZodiacResult {
  animal: ChineseAnimalData;
  element: ChineseElement;
  elementEmoji: string;
  birthYear: number;
  forecast2025: string;
}

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

export interface MoonPhaseDay {
  date: Date;
  phase: number;
  phaseName: string;
  emoji: string;
}

export interface DailyReading {
  overall: number;
  love: number;
  career: number;
  health: number;
  finance: number;
  spirituality: number;
  summary: string;
  narrative: string;
  lucky_number: number;
  lucky_color: string;
  lucky_gemstone: string;
  lucky_direction: string;
  best_time: string;
  mood: string;
  compatibility: ZodiacSign;
  challenging: ZodiacSign;
}

export interface WeeklyForecast {
  week_start: string;
  week_end: string;
  overall: number;
  summary: string;
  best_days: string[];
  challenging_days: string[];
}

export interface MonthlyForecast {
  month: number;
  month_name: string;
  overall: number;
  summary: string;
  highlight_dates: string[];
}

export interface SignsCompatibility {
  sign1: ZodiacSign;
  sign2: ZodiacSign;
  percentage: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

export const ZODIAC_SIGNS: ZodiacSignData[] = [
  { key: 'aries',       name: 'Aries',       symbol: '\u2648', dates: 'Mar 21 – Apr 19',  element: 'fire',  ruling_planet: 'Mars',    start_month: 3,  start_day: 21, end_month: 4,  end_day: 19 },
  { key: 'taurus',      name: 'Taurus',      symbol: '\u2649', dates: 'Apr 20 – May 20',  element: 'earth', ruling_planet: 'Venus',   start_month: 4,  start_day: 20, end_month: 5,  end_day: 20 },
  { key: 'gemini',      name: 'Gemini',      symbol: '\u264A', dates: 'May 21 – Jun 20',  element: 'air',   ruling_planet: 'Mercury', start_month: 5,  start_day: 21, end_month: 6,  end_day: 20 },
  { key: 'cancer',      name: 'Cancer',      symbol: '\u264B', dates: 'Jun 21 – Jul 22',  element: 'water', ruling_planet: 'Moon',    start_month: 6,  start_day: 21, end_month: 7,  end_day: 22 },
  { key: 'leo',         name: 'Leo',         symbol: '\u264C', dates: 'Jul 23 – Aug 22',  element: 'fire',  ruling_planet: 'Sun',     start_month: 7,  start_day: 23, end_month: 8,  end_day: 22 },
  { key: 'virgo',       name: 'Virgo',       symbol: '\u264D', dates: 'Aug 23 – Sep 22',  element: 'earth', ruling_planet: 'Mercury', start_month: 8,  start_day: 23, end_month: 9,  end_day: 22 },
  { key: 'libra',       name: 'Libra',       symbol: '\u264E', dates: 'Sep 23 – Oct 22',  element: 'air',   ruling_planet: 'Venus',   start_month: 9,  start_day: 23, end_month: 10, end_day: 22 },
  { key: 'scorpio',     name: 'Scorpio',     symbol: '\u264F', dates: 'Oct 23 – Nov 21',  element: 'water', ruling_planet: 'Pluto',   start_month: 10, start_day: 23, end_month: 11, end_day: 21 },
  { key: 'sagittarius', name: 'Sagittarius', symbol: '\u2650', dates: 'Nov 22 – Dec 21',  element: 'fire',  ruling_planet: 'Jupiter', start_month: 11, start_day: 22, end_month: 12, end_day: 21 },
  { key: 'capricorn',   name: 'Capricorn',   symbol: '\u2651', dates: 'Dec 22 – Jan 19',  element: 'earth', ruling_planet: 'Saturn',  start_month: 12, start_day: 22, end_month: 1,  end_day: 19 },
  { key: 'aquarius',    name: 'Aquarius',    symbol: '\u2652', dates: 'Jan 20 – Feb 18',  element: 'air',   ruling_planet: 'Uranus',  start_month: 1,  start_day: 20, end_month: 2,  end_day: 18 },
  { key: 'pisces',      name: 'Pisces',      symbol: '\u2653', dates: 'Feb 19 – Mar 20',  element: 'water', ruling_planet: 'Neptune', start_month: 2,  start_day: 19, end_month: 3,  end_day: 20 },
];

export const CHINESE_ANIMALS: ChineseAnimalData[] = [
  { key: 'rat',     name: 'Rat',     emoji: '\uD83D\uDC00', years: [1924,1936,1948,1960,1972,1984,1996,2008,2020], traits: 'Clever, resourceful, quick-witted', forecast_2025: '2025 brings opportunities for career advancement. Your natural adaptability serves you well in navigating changes. Focus on building lasting partnerships.', compatible_with: ['ox','dragon','monkey'], challenging_with: ['horse','goat'] },
  { key: 'ox',     name: 'Ox',     emoji: '\uD83D\uDC02', years: [1925,1937,1949,1961,1973,1985,1997,2009,2021], traits: 'Diligent, dependable, strong', forecast_2025: 'Your steady approach yields results this year. Financial stability improves through patience. Avoid rushing major decisions.', compatible_with: ['rat','snake','rooster'], challenging_with: ['tiger','dragon'] },
  { key: 'tiger',  name: 'Tiger',  emoji: '\uD83D\uDC05', years: [1926,1938,1950,1962,1974,1986,1998,2010,2022], traits: 'Brave, competitive, confident', forecast_2025: 'Your courage opens doors in 2025. Take calculated risks in Q2 and Q3. Romance may surprise you unexpectedly.', compatible_with: ['horse','dog','pig'], challenging_with: ['ox','snake'] },
  { key: 'rabbit', name: 'Rabbit', emoji: '\uD83D\uDC07', years: [1927,1939,1951,1963,1975,1987,1999,2011,2023], traits: 'Gentle, elegant, vigilant', forecast_2025: 'A harmonious year awaits. Relationships deepen and creative projects flourish. Trust your intuition in autumn.', compatible_with: ['goat','pig','dog'], challenging_with: ['rooster','dragon'] },
  { key: 'dragon', name: 'Dragon', emoji: '\uD83D\uDC09', years: [1928,1940,1952,1964,1976,1988,2000,2012,2024], traits: 'Confident, ambitious, noble', forecast_2025: 'Transformation continues. Embrace new beginnings. Your charisma attracts helpful allies. Health needs mindful attention.', compatible_with: ['rat','monkey','rooster'], challenging_with: ['dog','rabbit'] },
  { key: 'snake',  name: 'Snake',  emoji: '\uD83D\uDC0D', years: [1929,1941,1953,1965,1977,1989,2001,2013,2025], traits: 'Wise, enigmatic, intuitive', forecast_2025: 'Your year! The Wood Snake brings growth through wisdom. Reflect before acting. Unexpected windfall possible mid-year.', compatible_with: ['ox','rooster','dragon'], challenging_with: ['tiger','pig'] },
  { key: 'horse',  name: 'Horse',  emoji: '\uD83D\uDC0E', years: [1930,1942,1954,1966,1978,1990,2002,2014,2026], traits: 'Free-spirited, energetic, independent', forecast_2025: 'Travel and movement feature strongly. Career momentum builds. Balance adventure with rest to avoid burnout.', compatible_with: ['tiger','goat','dog'], challenging_with: ['rat','ox'] },
  { key: 'goat',   name: 'Goat',   emoji: '\uD83D\uDC10', years: [1931,1943,1955,1967,1979,1991,2003,2015], traits: 'Creative, gentle, compassionate', forecast_2025: 'Artistic pursuits thrive. Financial caution advised in spring. Family connections bring joy and support.', compatible_with: ['rabbit','horse','pig'], challenging_with: ['ox','rat'] },
  { key: 'monkey', name: 'Monkey', emoji: '\uD83D\uDC12', years: [1932,1944,1956,1968,1980,1992,2004,2016], traits: 'Witty, curious, innovative', forecast_2025: 'Innovation pays off. Your ideas gain traction. Stay grounded amid excitement. Watch for deception in fall.', compatible_with: ['rat','dragon','snake'], challenging_with: ['tiger','pig'] },
  { key: 'rooster',name: 'Rooster',emoji: '\uD83D\uDC13', years: [1933,1945,1957,1969,1981,1993,2005,2017], traits: 'Observant, confident, hardworking', forecast_2025: 'Recognition comes for past efforts. Financial opportunities arise. Romance blooms for singles in summer.', compatible_with: ['ox','snake','dragon'], challenging_with: ['rabbit','dog'] },
  { key: 'dog',    name: 'Dog',    emoji: '\uD83D\uDC15', years: [1934,1946,1958,1970,1982,1994,2006,2018], traits: 'Loyal, honest, reliable', forecast_2025: 'Friendships deepen. Career takes positive turn. Your honesty is rewarded. Guard against overthinking.', compatible_with: ['tiger','rabbit','horse'], challenging_with: ['dragon','rooster'] },
  { key: 'pig',    name: 'Pig',    emoji: '\uD83D\uDC16', years: [1935,1947,1959,1971,1983,1995,2007,2019], traits: 'Generous, sincere, diligent', forecast_2025: 'Abundance flows. Generosity returns multiplied. Health focus benefits you. Property matters favor you.', compatible_with: ['tiger','rabbit','goat'], challenging_with: ['snake','monkey'] },
];

export const FAMOUS_PEOPLE: Record<ZodiacSign, string[]> = {
  aries:       ['Lady Gaga', 'Leonardo da Vinci', 'Maya Angelou', 'Robert Downey Jr.'],
  taurus:      ['Adele', 'William Shakespeare', 'David Beckham', 'Queen Elizabeth II'],
  gemini:      ['Marilyn Monroe', 'Kanye West', 'Angelina Jolie', 'Prince'],
  cancer:      ['Tom Cruise', 'Princess Diana', 'Nelson Mandela', 'Elon Musk'],
  leo:         ['Barack Obama', 'Jennifer Lopez', 'Madonna', 'Usain Bolt'],
  virgo:       ['Beyonce', 'Michael Jackson', 'Mother Teresa', 'Keanu Reeves'],
  libra:       ['Will Smith', 'Mahatma Gandhi', 'Kim Kardashian', 'John Lennon'],
  scorpio:     ['Bill Gates', 'Marie Curie', 'Leonardo DiCaprio', 'Katy Perry'],
  sagittarius: ['Taylor Swift', 'Winston Churchill', 'Brad Pitt', 'Mark Twain'],
  capricorn:   ['Michelle Obama', 'Isaac Newton', 'Martin Luther King Jr.', 'Kate Middleton'],
  aquarius:    ['Oprah Winfrey', 'Abraham Lincoln', 'The Weeknd', 'Ed Sheran'],
  pisces:      ['Albert Einstein', 'Rihanna', 'Steve Jobs', 'George Washington'],
};

export const ELEMENT_COLORS: Record<string, string> = {
  fire:  '#EF4444',
  earth: '#A16207',
  air:   '#3B82F6',
  water: '#06B6D4',
  wood:  '#22C55E',
  metal: '#94A3B8',
};

export const ELEMENT_BG: Record<string, string> = {
  fire:  'bg-red-50',
  earth: 'bg-amber-50',
  air:   'bg-blue-50',
  water: 'bg-cyan-50',
  wood:  'bg-green-50',
  metal: 'bg-slate-50',
};

export const ELEMENT_TEXT: Record<string, string> = {
  fire:  'text-red-700',
  earth: 'text-amber-700',
  air:   'text-blue-700',
  water: 'text-cyan-700',
  wood:  'text-green-700',
  metal: 'text-slate-700',
};

export const CHINESE_ELEMENT_COLORS: Record<ChineseElement, string> = {
  wood:  '#22C55E',
  fire:  '#EF4444',
  earth: '#A16207',
  metal: '#94A3B8',
  water: '#3B82F6',
};
