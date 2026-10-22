// Prayer timetable data (Round 3 / S5) — DATA ONLY, no pages, no
// components. One package per city: the current month + next month of
// daily times generated from Aladhan at the city's canonical
// coordinates with the country's standard calculation method.
// Row format: "DD|Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha" (24h local).
export interface PrayerTable {
  slug: string; city: string; country: string;
  lat: number; lng: number;
  method: { id: number; name: string; registryName: string | null; note: string };
  format: string; source: string;
  months: Record<string, string[]>;
}
