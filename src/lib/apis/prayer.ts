export type CalcMethod = 0 | 1 | 2 | 3 | 4 | 5 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 99;
export type MadhabMethod = 0 | 1; // 0 = Shafi'i, 1 = Hanafi

export const CALC_METHODS: { label: string; value: CalcMethod }[] = [
  { label: 'Karachi', value: 1 },
  { label: 'Muslim World League', value: 3 },
  { label: 'Egypt', value: 5 },
  { label: 'Umm Al-Qura', value: 4 },
  { label: 'ISNA', value: 2 },
  { label: 'Tehran', value: 7 },
];

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface DayData {
  timings: PrayerTimings;
  date: {
    readable: string;
    timestamp: string;
    hijri: { date: string; month: { en: string }; year: string; weekday: { en: string } };
    gregorian: { date: string; month: { en: string }; year: string; weekday: { en: string } };
  };
}

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  method: CalcMethod,
  madhab: MadhabMethod,
  date?: string
): Promise<DayData | null> {
  const d = date || new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  const url = `https://api.aladhan.com/v1/timings/${d}?latitude=${lat}&longitude=${lng}&method=${method}&school=${madhab}`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } } as RequestInit);
    const json = await res.json();
    if (json.code === 200) return json.data as DayData;
    return null;
  } catch {
    return null;
  }
}

export async function fetchMonthlyPrayerTimes(
  lat: number,
  lng: number,
  method: CalcMethod,
  madhab: MadhabMethod,
  month: number,
  year: number
): Promise<DayData[]> {
  const url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=${method}&school=${madhab}`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } } as RequestInit);
    const json = await res.json();
    if (json.code === 200) return json.data as DayData[];
    return [];
  } catch {
    return [];
  }
}

export async function fetchWeeklyPrayerTimes(
  lat: number,
  lng: number,
  method: CalcMethod,
  madhab: MadhabMethod
): Promise<DayData[]> {
  const results: DayData[] = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toLocaleDateString('en-GB').replace(/\//g, '-');
    const data = await fetchPrayerTimes(lat, lng, method, madhab, dateStr);
    if (data) results.push(data);
  }
  return results;
}

export function calcTahajjud(isha: string, fajr: string): string {
  const toMins = (t: string) => {
    const [h, m] = t.replace(/\s*(AM|PM).*/i, '').split(':').map(Number);
    return h * 60 + m;
  };
  const ishaMins = toMins(isha);
  const fajrMins = toMins(fajr) + (toMins(fajr) < ishaMins ? 1440 : 0);
  const mid = Math.floor((ishaMins + fajrMins) / 2) % 1440;
  const hh = Math.floor(mid / 60).toString().padStart(2, '0');
  const mm = (mid % 60).toString().padStart(2, '0');
  return `${hh}:${mm}`;
}

export function calcIshraq(sunrise: string): string {
  const [h, m] = sunrise.replace(/\s*(AM|PM).*/i, '').split(':').map(Number);
  const mins = h * 60 + m + 15;
  const hh = Math.floor(mins / 60) % 24;
  const mm = mins % 60;
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export function calcDuha(sunrise: string): string {
  const [h, m] = sunrise.replace(/\s*(AM|PM).*/i, '').split(':').map(Number);
  const mins = h * 60 + m + 45;
  const hh = Math.floor(mins / 60) % 24;
  const mm = mins % 60;
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export function calcWitr(isha: string): string {
  const [h, m] = isha.replace(/\s*(AM|PM).*/i, '').split(':').map(Number);
  const mins = h * 60 + m + 30;
  const hh = Math.floor(mins / 60) % 24;
  const mm = mins % 60;
  return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
}

export function formatTime(raw: string): string {
  const cleaned = raw.replace(/\s*(AM|PM).*/i, '').trim();
  const [h, m] = cleaned.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${m.toString().padStart(2, '0')} ${period}`;
}

export function getTimeInMinutes(raw: string): number {
  const cleaned = raw.replace(/\s*(AM|PM).*/i, '').trim();
  const [h, m] = cleaned.split(':').map(Number);
  return h * 60 + m;
}
