// types/horoscope.ts

export interface ChineseAnimalInfo {
  name: string;
  emoji: string;
  traits: string;
}

export interface ZodiacResult {
  sign: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: string;
  rulingPlanet: string;
  quality: 'Cardinal' | 'Fixed' | 'Mutable';
}

export interface ChineseZodiacResult {
  animal: ChineseAnimalInfo;
  emoji: string;
  description: string;
  element: string;
  elementEmoji: string;
  birthYear: number;
  element2025: string;
  years: number[];
  traits: string;
  forecast2025: string;
  yearAnimal: ChineseAnimalInfo;
}

export interface MoonPhaseResult {
  phase: string;
  illumination: number;
  emoji: string;
  moonrise: string | null;
  moonset: string | null;
  distance: number | null;
}

export interface ChineseAnimalEntry {
  key: string;
  name: string;
  emoji: string;
  years: number[];
}

export type ChineseAnimal = ChineseAnimalEntry;

export const CHINESE_ANIMALS: ChineseAnimalEntry[] = [
  { key: 'rat',     name: 'Rat',     emoji: '🐭', years: [1948,1960,1972,1984,1996,2008,2020] },
  { key: 'ox',      name: 'Ox',      emoji: '🐂', years: [1949,1961,1973,1985,1997,2009,2021] },
  { key: 'tiger',   name: 'Tiger',   emoji: '🐯', years: [1950,1962,1974,1986,1998,2010,2022] },
  { key: 'rabbit',  name: 'Rabbit',  emoji: '🐰', years: [1951,1963,1975,1987,1999,2011,2023] },
  { key: 'dragon',  name: 'Dragon',  emoji: '🐉', years: [1952,1964,1976,1988,2000,2012,2024] },
  { key: 'snake',   name: 'Snake',   emoji: '🐍', years: [1953,1965,1977,1989,2001,2013,2025] },
  { key: 'horse',   name: 'Horse',   emoji: '🐴', years: [1954,1966,1978,1990,2002,2014,2026] },
  { key: 'goat',    name: 'Goat',    emoji: '🐏', years: [1955,1967,1979,1991,2003,2015,2027] },
  { key: 'monkey',  name: 'Monkey',  emoji: '🐒', years: [1956,1968,1980,1992,2004,2016,2028] },
  { key: 'rooster', name: 'Rooster', emoji: '🐓', years: [1957,1969,1981,1993,2005,2017,2029] },
  { key: 'dog',     name: 'Dog',     emoji: '🐶', years: [1958,1970,1982,1994,2006,2018,2030] },
  { key: 'pig',     name: 'Pig',     emoji: '🐷', years: [1959,1971,1983,1995,2007,2019,2031] },
];

export const CHINESE_ELEMENT_COLORS: Record<string, string> = {
  wood:  '#4CAF50',
  fire:  '#F44336',
  earth: '#FF9800',
  metal: '#9E9E9E',
  water: '#2196F3',
  Wood:  '#4CAF50',
  Fire:  '#F44336',
  Earth: '#FF9800',
  Metal: '#9E9E9E',
  Water: '#2196F3',
};

export interface HoroscopeReading {
  sign: string;
  date: string;
  overall: number;
  love: number;
  career: number;
  finance: number;
  health: number;
  narrative: string;
  luckyNumber: number;
  luckyColor: string;
}
