export interface HijriDate {
  date: string;
  month: { en: string; ar: string; number: number };
  year: string;
  weekday: { en: string };
  holidays: string[];
}

export interface MoonPhase {
  phase: string;
  illumination: number;
  age: number;
}

export const HIJRI_MONTHS = [
  { en: 'Muharram', ar: 'محرم', days: 30 },
  { en: 'Safar', ar: 'صفر', days: 29 },
  { en: 'Rabi al-Awwal', ar: 'ربيع الأول', days: 30 },
  { en: 'Rabi al-Thani', ar: 'ربيع الثاني', days: 29 },
  { en: 'Jumada al-Ula', ar: 'جمادى الأولى', days: 30 },
  { en: 'Jumada al-Thani', ar: 'جمادى الثانية', days: 29 },
  { en: 'Rajab', ar: 'رجب', days: 30 },
  { en: 'Sha\'ban', ar: 'شعبان', days: 29 },
  { en: 'Ramadan', ar: 'رمضان', days: 30 },
  { en: 'Shawwal', ar: 'شوال', days: 29 },
  { en: 'Dhul Qi\'dah', ar: 'ذوالقعدہ', days: 30 },
  { en: 'Dhul Hijjah', ar: 'ذوالحجہ', days: 29 },
];

export const ISLAMIC_EVENTS = [
  { name: 'Laylat al-Qadr', month: 9, day: 27, icon: '🌙' },
  { name: 'Eid ul-Fitr', month: 10, day: 1, icon: '🎉' },
  { name: 'Hajj', month: 12, day: 8, icon: '🕋' },
  { name: 'Eid ul-Adha', month: 12, day: 10, icon: '🐑' },
  { name: 'Islamic New Year', month: 1, day: 1, icon: ' Islamic' },
  { name: 'Ashura', month: 1, day: 10, icon: '⚫' },
  { name: 'Mawlid al-Nabi', month: 3, day: 12, icon: 'ﷺ' },
  { name: 'Shab-e-Meraj', month: 7, day: 27, icon: '✨' },
  { name: 'Shab-e-Barat', month: 8, day: 15, icon: '🌟' },
];

export function calcTahajjud(fajr: string): string {
  const fajrDate = new Date(`1970-01-01T${fajr}`);
  const midnightDate = new Date('1970-01-01T00:00');
  const diff = (fajrDate.getTime() - midnightDate.getTime() / 2);
  const tahajjudDate = new Date(midnightDate.getTime() + diff);
  return tahajjudDate.toTimeString().slice(0, 5);
}

export function calcIshraq(sunrise: string): string {
  const sunriseDate = new Date(`1970-01-01T${sunrise}`);
  sunriseDate.setMinutes(sunriseDate.getMinutes() + 20);
  return sunriseDate.toTimeString().slice(0, 5);
}

export function calcDuha(sunrise: string): string {
  const sunriseDate = new Date(`1970-01-01T${sunrise}`);
  sunriseDate.setMinutes(sunriseDate.getMinutes() + 45);
  return sunriseDate.toTimeString().slice(0, 5);
}

export function calcWitr(isha: string): string {
  const ishaDate = new Date(`1970-01-01T${isha}`);
  ishaDate.setHours(ishaDate.getHours() + 2);
  return ishaDate.toTimeString().slice(0, 5);
}

export interface Hadith {
  text: string;
  narrator: string;
  book: string;
}

export async function fetchHadith(): Promise<Hadith | null> {
  try {
    const res = await fetch('https://api.hadith.sutanlab.id/books/muslim?random');
    if (!res.ok) return null;
    const data = await res.json();
    return {
      text: data.data?.contents?.arab || '',
      narrator: data.data?.contents?.number?.replaceAll('hr', '').trim() || '',
      book: 'Sahih Muslim',
    };
  } catch {
    return null;
  }
}
