// City page imagery (Final28 P12) — licensed/open photos, local files only.
// Every entry has a stored record in docs/media-registry/subjects/<city>.json
// (new harvests) or maps to an existing VERIFIED record there (the 5 reuse
// conversions, listed in each subject file's `city_pages` note). Cities not
// listed here render NO image — missing data is omitted, never faked.
// The unverified Iqbal portrait is never used here.
export type CityImageVariant =
  | 'hero'
  | 'prayer'
  | 'sports'
  | 'weather'
  | 'news'
  | 'economy'
  | 'events'
  | 'rates';

export interface CityImage {
  src: string;
  alt: string;
  credit: string;
  width: number;
  height: number;
}

const img = (
  file: string,
  alt: string,
  credit: string,
  width: number,
  height: number,
): CityImage => ({ src: `/images/cities/${file}`, alt, credit, width, height });

export const CITY_IMAGES: Record<string, Partial<Record<CityImageVariant, CityImage>>> = {
  lahore: {
    hero: img('lahore-hero.webp', 'Badshahi Mosque, Lahore', 'Photo: Romero Maia · CC BY-SA 4.0', 1600, 1066),
    prayer: img('lahore-prayer.webp', 'Courtyard of Badshahi Mosque, Lahore', 'Photo: Zapata1000 · CC BY-SA 4.0', 1600, 1054),
    sports: img('lahore-sports.webp', 'Gaddafi Stadium, Lahore, at night', 'Photo: Younisjunejo · CC BY-SA 4.0', 1600, 562),
    weather: img('lahore-weather.webp', 'Lahore skyline over Badshahi Mosque', 'Photo: Tahira Ahmed · CC BY-SA 4.0', 1600, 1062),
    news: img('lahore-news.webp', 'Minar-e-Pakistan, Lahore', 'Photo: Shaheryarkhokhar · CC BY-SA 4.0', 1600, 1066),
    economy: img('lahore-economy.webp', 'Traffic on M. M. Alam Road, Lahore', 'Photo: Jugni · CC BY-SA 3.0', 1600, 990),
    events: img('lahore-events.webp', 'Gathering at Minar-e-Pakistan, Lahore', 'Photo: Minhaj-ul-Quran International · CC BY-SA 4.0', 1600, 1162),
    rates: img('lahore-rates.webp', 'Anarkali Bazaar street, Lahore', 'Photo: Ali lahoti · CC BY-SA 4.0', 1600, 900),
  },
  karachi: {
    hero: img('karachi-hero.webp', 'Mazar-e-Quaid, Karachi', 'Photo: Jan Kranendonk · CC BY-SA 4.0', 1600, 1064),
    prayer: img('karachi-prayer.webp', 'Masjid-e-Tooba, Karachi', 'Photo: Muhammad Saqib Khan · CC BY-SA 3.0', 1600, 1200),
    sports: img('karachi-sports.webp', 'National Stadium, Karachi', 'Photo: Umair ua · Public domain', 1600, 1214),
    weather: img('karachi-weather.webp', 'Clifton skyline, Karachi', 'Photo: Ahmad Haq · CC BY-SA 4.0', 1600, 708),
    news: img('karachi-news.webp', 'Karachi skyline, Clifton', 'Photo: Ktownboy103 · CC0', 1600, 608),
    economy: img('karachi-economy.webp', 'I. I. Chundrigar Road skyline, Karachi', 'Photo: User:Swerveut · Public domain', 1600, 704),
    events: img('karachi-events.webp', 'Frere Hall, Karachi', 'Photo: Aliubair · CC BY-SA 4.0', 1600, 1066),
    rates: img('karachi-rates.webp', 'Empress Market, Saddar, Karachi', 'Photo: Siddiqi · CC BY 4.0', 1600, 1132),
  },
  islamabad: {
    hero: img('islamabad-hero.webp', 'Faisal Mosque, Islamabad', 'Photo: Guilhem Vellut · CC BY 2.0', 1600, 1200),
    prayer: img('islamabad-prayer.webp', 'Faisal Mosque fountain area, Islamabad', 'Photo: Shahzaib Damn Cruze · CC BY-SA 4.0', 1600, 634),
    sports: img('islamabad-sports.webp', 'Jinnah Sports Stadium, Islamabad', 'Photo: Zainii7 · CC BY-SA 3.0', 1600, 454),
    weather: img('islamabad-weather.webp', 'Islamabad skyline from Pakistan Monument', 'Photo: Bilalnaqeeb · CC BY-SA 4.0', 1600, 900),
    news: img('islamabad-news.webp', 'Islamabad cityscape from Daman-e-Koh', 'Photo: Zeeshanhkofficial · CC BY-SA 4.0', 1600, 136),
    economy: img('islamabad-economy.webp', 'Blue Area (Jinnah Avenue) skyline, Islamabad', 'Photo: Ahabb · CC BY-SA 4.0', 1600, 946),
    events: img('islamabad-events.webp', 'Pakistan Monument, Islamabad, at blue hour', 'Photo: Muhammad Ashar · CC BY-SA 4.0', 1600, 1066),
    rates: img('islamabad-rates.webp', 'Jinnah Super Market, Islamabad', 'Photo: Executioner · CC BY-SA 3.0', 1600, 1200),
  },
};

export function getCityImage(citySlug: string, variant: CityImageVariant): CityImage | null {
  return CITY_IMAGES[citySlug]?.[variant] ?? null;
}
