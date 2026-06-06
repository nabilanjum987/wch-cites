import { City } from '@/types/city';

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonical?: string;
}

export function generateCityMeta(city: City, weatherData?: any): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const temp = weatherData?.temp || '34';
  
  return {
    title: `${city.name} — Weather, Prayer Times, Gold Rate & News Today | ${city.province} Pakistan`,
    description: `Live ${city.name} information: ${temp}°C weather, next prayer times with Qibla direction, gold PKR 21,500/gram, latest news, events, and complete city guide. Updated hourly.`,
    keywords: `${city.name}, ${city.name} weather, ${city.name} prayer times, ${city.name} gold rate, ${city.name} news, ${city.name} today, ${city.province}, ${city.name} events`,
    ogTitle: `${city.name} — Live Weather, Prayer Times & Rates`,
    ogDescription: `Complete ${city.name} city information including live weather, prayer times, gold rates, news and cultural insights.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}`,
  };
}

export function generateWeatherMeta(city: City, weatherData: any): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const temp = weatherData?.temp || '34';
  const condition = weatherData?.condition || 'Sunny';
  const humidity = weatherData?.humidity || '52';
  const aqi = weatherData?.aqi || '95';
  
  return {
    title: `${city.name} Weather Today — Live Temperature ${temp}°C & 7-Day Forecast | ${date}`,
    description: `${city.name} weather today: ${temp}°C ${condition}. Humidity ${humidity}%, UV index, air quality AQI ${aqi}, hourly forecast, and 7-day weather prediction. Real-time updates every 15 minutes.`,
    keywords: `${city.name} weather today, ${city.name} mausam, ${city.name} temperature today, weather in ${city.name} right now, ${city.name} forecast, ${city.name} air quality`,
    ogTitle: `${city.name} Weather: ${temp}°C ${condition}`,
    ogDescription: `Live weather in ${city.name}: ${temp}°C with ${condition} conditions. Check hourly and 7-day forecast.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/weather`,
  };
}

export function generatePrayerMeta(city: City, prayerData: any): MetaTags {
  const fajr = prayerData?.fajr || '4:45 AM';
  const maghrib = prayerData?.maghrib || '7:05 PM';
  const hijri = prayerData?.hijri || '1445 AH';
  
  return {
    title: `${city.name} Prayer Times Today — Namaz Timings Fajr ${fajr} Maghrib ${maghrib}`,
    description: `${city.name} prayer times today (${hijri}): Fajr ${fajr}, Dhuhr 12:30 PM, Asr 4:15 PM, Maghrib ${maghrib}, Isha 8:30 PM. Qibla direction 262° with weekly timetable and Islamic calendar.`,
    keywords: `${city.name} prayer times today, ${city.name} namaz timings, Fajr time ${city.name}, aaj namaz ka waqt ${city.name}, Qibla direction, Islamic prayer times Pakistan`,
    ogTitle: `${city.name} Prayer Times & Qibla Direction`,
    ogDescription: `Accurate prayer times in ${city.name} with Qibla direction, Hijri date, and weekly timetable.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/prayer-times`,
  };
}

export function generateGoldMeta(city: City, goldData: any): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const gold24k = goldData?.gold24k || '21500';
  const gold22k = goldData?.gold22k || '19708';
  
  return {
    title: `Gold Rate in ${city.name} Today — 24K PKR ${gold24k}/gram | ${date}`,
    description: `Gold rate in ${city.name} today: 24K PKR ${gold24k}/gram, 22K PKR ${gold22k}/gram. Live sona rate, silver price, cryptocurrency (BTC/ETH), currency rates & zakat calculator.`,
    keywords: `gold rate ${city.name} today, sona rate ${city.name}, ${city.name} gold price today, 24 karat gold Pakistan, silver price ${city.name}, cryptocurrency rates`,
    ogTitle: `Gold Rate ${city.name}: PKR ${gold24k}/gram`,
    ogDescription: `Today's gold, silver, cryptocurrency, and currency rates in ${city.name} with zakat calculator.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/rates`,
  };
}

export function generateNewsMeta(city: City): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  
  return {
    title: `${city.name} News Today — Latest Breaking News & Events | ${date}`,
    description: `Latest news from ${city.name}: breaking news, local events, political updates, business developments, weather alerts, and cultural happenings. Real-time coverage of Pakistan's dynamic city.`,
    keywords: `${city.name} news today, ${city.name} news, ${city.name} breaking news, news from ${city.name}, ${city.name} today news, ${city.name} latest updates`,
    ogTitle: `${city.name} News — Latest Updates`,
    ogDescription: `Breaking news and latest updates from ${city.name}, Pakistan's metropolitan hub.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/news`,
  };
}

export function generateSportsMeta(city: City): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return {
    title: `${city.name} Sports — PSL Cricket, News & Updates | ${date}`,
    description: `${city.name} sports: PSL cricket news, Qalandars updates, Pakistan cricket ranking, sports events, and athletic achievements. Coverage of cricket, squash, and other sporting developments.`,
    keywords: `${city.name} sports, ${city.name} cricket, PSL, Qalandars, ${city.name} news sports, Pakistan cricket, sports ${city.name}`,
    ogTitle: `${city.name} Sports — Cricket & Updates`,
    ogDescription: `Latest sports news and cricket updates from ${city.name} including PSL Qalandars coverage.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/sports`,
  };
}

export function generateEconomyMeta(city: City): MetaTags {
  const date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  return {
    title: `${city.name} Economy — Business, GDP & Economic News | ${date}`,
    description: `${city.name} economy: GDP $350B, inflation 23.4%, unemployment 6.2%, economic growth, business developments, and financial insights for Pakistan's premier economic hub.`,
    keywords: `${city.name} economy, ${city.name} business, GDP ${city.name}, inflation Pakistan, economy news, ${city.name} economic indicators`,
    ogTitle: `${city.name} Economy & Business News`,
    ogDescription: `Economic data, business news, and financial insights from ${city.name}.`,
    canonical: `https://worldcityhub.com/pakistan/${city.province.toLowerCase()}/${city.city_slug}/economy`,
  };
}

export interface MetaTagsWithStructuredData extends MetaTags {
  structuredData?: any;
}

export function addStructuredData(metaTags: MetaTags, structuredData: any): MetaTagsWithStructuredData {
  return {
    ...metaTags,
    structuredData,
  };
}
