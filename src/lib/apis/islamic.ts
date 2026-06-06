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
  { en: 'Shaban', ar: 'شعبان', days: 29 },
  { en: 'Ramadan', ar: 'رمضان', days: 30 },
  { en: 'Shawwal', ar: 'شوال', days: 29 },
  { en: 'Dhu al-Qadah', ar: 'ذو القعدة', days: 30 },
  { en: 'Dhu al-Hijjah', ar: 'ذو الحجة', days: 29 },
];

export const ISLAMIC_EVENTS_2025 = [
  { name: 'Eid ul-Fitr', nameAr: 'عيد الفطر', hijriDate: '1 Shawwal 1446', gregorian: '2025-03-30', type: 'eid' },
  { name: 'Eid ul-Adha', nameAr: 'عيد الأضحى', hijriDate: '10 Dhu al-Hijjah 1446', gregorian: '2025-06-07', type: 'eid' },
  { name: 'Muharram / Islamic New Year', nameAr: 'محرّم', hijriDate: '1 Muharram 1447', gregorian: '2025-06-27', type: 'sacred' },
  { name: 'Ashura', nameAr: 'عاشوراء', hijriDate: '10 Muharram 1447', gregorian: '2025-07-06', type: 'sacred' },
  { name: 'Mawlid al-Nabi', nameAr: 'المولد النبوي', hijriDate: '12 Rabi al-Awwal 1448', gregorian: '2025-08-27', type: 'sacred' },
  { name: 'Isra and Miraj', nameAr: 'الإسراء والمعراج', hijriDate: '27 Rajab 1447', gregorian: '2025-01-27', type: 'sacred' },
  { name: 'Shab e-Barat', nameAr: 'ليلة البراءة', hijriDate: '15 Shaban 1447', gregorian: '2025-02-13', type: 'sacred' },
  { name: 'Ramadan Start', nameAr: 'رمضان', hijriDate: '1 Ramadan 1447', gregorian: '2026-02-28', type: 'ramadan' },
];

export async function fetchMoonPhase(lat: number, lng: number): Promise<MoonPhase | null> {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const url = `https://api.astronautica.com/v1/moon?date=${yyyy}-${mm}-${dd}&lat=${lat}&lon=${lng}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      phase: data.phase || 'Unknown',
      illumination: data.illumination || 0,
      age: data.age || 0,
    };
  } catch {
    return null;
  }
}

export function getMoonPhaseEmoji(illumination: number): string {
  if (illumination < 5) return '🌑';
  if (illumination < 20) return '🌒';
  if (illumination < 35) return '🌓';
  if (illumination < 65) return '🌔';
  if (illumination < 80) return '🌕';
  if (illumination < 95) return '🌖';
  return '🌙';
}

export function getMoonPhaseName(illumination: number): string {
  if (illumination < 5) return 'New Moon';
  if (illumination < 20) return 'Waxing Crescent';
  if (illumination < 35) return 'First Quarter';
  if (illumination < 65) return 'Waxing Gibbous';
  if (illumination < 80) return 'Full Moon';
  if (illumination < 95) return 'Waning Gibbous';
  return 'Waning Crescent';
}

export async function fetchGoldPrice(): Promise<number | null> {
  try {
    const res = await fetch('https://api.metals.live/v1/spot/gold');
    if (!res.ok) return null;
    const data = await res.json();
    return data[0]?.price || null;
  } catch {
    return null;
  }
}

export async function fetchSilverPrice(): Promise<number | null> {
  try {
    const res = await fetch('https://api.metals.live/v1/spot/silver');
    if (!res.ok) return null;
    const data = await res.json();
    return data[0]?.price || null;
  } catch {
    return null;
  }
}

export async function fetchQuranVerse(): Promise<{ text: string; surah: string; ayah: number } | null> {
  try {
    const ayahNum = Math.floor(Math.random() * 6236) + 1;
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/en.sahih`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code === 200) {
      return {
        text: data.data.text,
        surah: data.data.surah.englishName,
        ayah: data.data.numberInSurah,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchHadith(): Promise<{ text: string; narrator: string; book: string } | null> {
  try {
    const res = await fetch('https://hadithapi.com/api/hadiths?limit=1&random=true', {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.hadiths?.data?.[0]) {
      const h = data.hadiths.data[0];
      return {
        text: h.hadith_english || h.hadith,
        narrator: h.narrator || 'Unknown',
        book: h.book?.name || 'Sahih Bukhari',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export const NAMES_OF_ALLAH = [
  { en: 'Ar-Rahman', ar: 'الرَّحْمَنُ', meaning: 'The Most Gracious' },
  { en: 'Ar-Rahim', ar: 'الرَّحِيمُ', meaning: 'The Most Merciful' },
  { en: 'Al-Malik', ar: 'الْمَلِكُ', meaning: 'The King' },
  { en: 'Al-Quddus', ar: 'الْقُدُّوسُ', meaning: 'The Most Holy' },
  { en: 'As-Salam', ar: 'السَّلَامُ', meaning: 'The Source of Peace' },
  { en: 'Al-Mumin', ar: 'الْمُؤْمِنُ', meaning: 'The Guardian of Faith' },
  { en: 'Al-Muhaymin', ar: 'الْمُهَيْمِنُ', meaning: 'The Protector' },
  { en: 'Al-Aziz', ar: 'الْعَزِيزُ', meaning: 'The Almighty' },
  { en: 'Al-Jabbar', ar: 'الْجَبَّارُ', meaning: 'The Compeller' },
  { en: 'Al-Mutakabbir', ar: 'الْمُتَكَبِّرُ', meaning: 'The Greatest' },
];

export function getNameOfAllahForToday(): typeof NAMES_OF_ALLAH[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return NAMES_OF_ALLAH[dayOfYear % 99] || NAMES_OF_ALLAH[0];
}

export function daysUntilEvent(gregorianDate: string): number {
  const target = new Date(gregorianDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / 86400000);
}
