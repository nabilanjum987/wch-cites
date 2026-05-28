export interface AladhanPrayerTimes {
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

export interface AladhanResponse {
  timings: AladhanPrayerTimes;
  date: {
    readable: string;
    timestamp: string;
    hijri: {
      date: string;
      month: { en: string; ar: string; number: number };
      year: string;
    };
    gregorian: {
      date: string;
      month: { en: string; number: number };
      year: string;
    };
  };
  meta: {
    method: { id: number; name: string; params: Record<string, number> };
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

const ALADHAN_API = 'https://api.aladhan.com/v1/timings';

export async function fetchPrayerTimes(
  lat: number,
  lng: number,
  date: Date
): Promise<AladhanResponse> {
  const timestamp = Math.floor(date.getTime() / 1000);
  const res = await fetch(
    `${ALADHAN_API}/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  return res.json();
}

export async function fetchWeeklyPrayerTimes(
  lat: number,
  lng: number
): Promise<AladhanResponse[]> {
  const times: AladhanResponse[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const data = await fetchPrayerTimes(lat, lng, date);
    times.push(data);
  }

  return times;
}

export async function fetchMonthlyPrayerTimes(
  lat: number,
  lng: number,
  month: number,
  year: number
): Promise<AladhanResponse[]> {
  const timestamp = Math.floor(new Date(year, month - 1, 1).getTime() / 1000);
  const res = await fetch(
    `${ALADHAN_API}/${timestamp}?latitude=${lat}&longitude=${lng}&method=2`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  return res.json();
}
