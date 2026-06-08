// app/[country]/[province]/[city]/page.tsx
// City Main Page — 23 sections, real API data, ISR revalidate 3600
// Test URL: /pakistan/punjab/lahore

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchAllCityData, type CityParams } from '@/lib/api/cityData';
import { generateCityMeta, generateCitySchema } from '@/lib/seo/cityMeta';
import {
  generateCityIntro,
  generateWeatherParagraph,
  generatePrayerParagraph,
  generateGoldParagraph,
  generateNewsParagraph,
  generateEventsParagraph,
  generateEconomyParagraph,
  generateSportsParagraph,
  generateHeritageParagraph,
  generateStreetFoodParagraph,
  generateEmergencyParagraph,
  generateNearbyCitiesParagraph,
  generateCityGlanceParagraph,
} from '@/lib/paragraphs/city';

export const revalidate = 3600;

// ─── CITY DATABASE (expand to all cities) ────────────────────────────────────
// For scale: move this to Supabase / Firebase
const CITY_DB: Record<string, CityParams> = {
  'pakistan/punjab/lahore': {
    city: 'Lahore', country: 'Pakistan', province: 'Punjab',
    lat: 31.5204, lon: 74.3587, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/sindh/karachi': {
    city: 'Karachi', country: 'Pakistan', province: 'Sindh',
    lat: 24.8607, lon: 67.0011, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/islamabad-capital-territory/islamabad': {
    city: 'Islamabad', country: 'Pakistan', province: 'Islamabad Capital Territory',
    lat: 33.6844, lon: 73.0479, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/punjab/faisalabad': {
    city: 'Faisalabad', country: 'Pakistan', province: 'Punjab',
    lat: 31.4504, lon: 73.1350, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
  'pakistan/punjab/rawalpindi': {
    city: 'Rawalpindi', country: 'Pakistan', province: 'Punjab',
    lat: 33.5651, lon: 73.0169, countryCode: 'PK', timezone: 'Asia/Karachi'
  },
};

function getCityParams(country: string, province: string, city: string): CityParams | null {
  const key = `${country}/${province}/${city}`;
   console.log('KEY:', key);
  return CITY_DB[key] ?? null;
}

// ─── GENERATE STATIC PARAMS (for known cities at build time) ─────────────────
export async function generateStaticParams() {
  return Object.keys(CITY_DB).map((key) => {
    const [country, province, city] = key.split('/');
    return { country, province, city };
  });
}

// ─── METADATA ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; province: string; city: string }>;
}): Promise<Metadata> {
  const { country, province, city } = await params;
  const cityParams = getCityParams(country, province, city);
  if (!cityParams) return { title: 'City Not Found | WorldCityHub' };

  const data = await fetchAllCityData(cityParams);
  const weather = data.weather as Record<string, unknown> | null;
  const prayer = data.prayerTimes as Record<string, unknown> | null;
  const gold = data.goldRates as Record<string, unknown> | null;

  const timings = (prayer as Record<string, Record<string, string>> | null)?.data?.timings;
  const meta = generateCityMeta({
    city: cityParams.city,
    country: cityParams.country,
    province: cityParams.province,
    temp: (weather as Record<string, Record<string, number>> | null)?.main?.temp ?? null,
    weatherDesc: ((weather as Record<string, Array<Record<string, string>>> | null)?.weather?.[0]?.description) ?? null,
  fajr: (timings as Record<string, string> | null)?.Fajr ?? null,
maghrib: (timings as Record<string, string> | null)?.Maghrib ?? null,
    goldPerGram: (gold as Record<string, number> | null)?.price_gram_24k ?? null,
  });

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      siteName: 'WorldCityHub',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

// ─── PAGE COMPONENT ──────────────────────────────────────────────────────────
export default async function CityPage({
  params,
}: {
  params: Promise<{ country: string; province: string; city: string }>;
}) {
  const { country, province, city } = await params;
  const cityParams = getCityParams(country, province, city);
  if (!cityParams) notFound();

  const data = await fetchAllCityData(cityParams);

  // ── Destructure API responses safely ──
  const weather = data.weather as Record<string, unknown> | null;
  const hourly = data.hourlyForecast as Record<string, unknown> | null;
  const sunMoon = data.sunMoon as Record<string, unknown> | null;
  const prayer = data.prayerTimes as Record<string, unknown> | null;
  const gold = data.goldRates as Record<string, unknown> | null;
  const crypto = data.crypto as Record<string, unknown> | null;
  const news = data.news as Record<string, unknown> | null;
  const wiki = data.wikiSummary as Record<string, unknown> | null;
  const economy = data.economy as Record<string, unknown> | null;
  const emergency = data.emergencyContacts as Record<string, unknown> | null;
  const airQuality = data.airQuality as Record<string, unknown> | null;
  const currency = data.currencyRates as Record<string, unknown> | null;
  const holidays = data.holidays as unknown[] | null;

  // ── Parsed values ──
  const temp = (weather?.main as Record<string, number> | undefined)?.temp ?? null;
  const feelsLike = (weather?.main as Record<string, number> | undefined)?.feels_like ?? null;
  const humidity = (weather?.main as Record<string, number> | undefined)?.humidity ?? null;
  const windSpeed = (weather?.wind as Record<string, number> | undefined)?.speed ?? null;
  const weatherDesc = ((weather?.weather as Array<Record<string, string>> | undefined)?.[0]?.description) ?? null;

  const timings = (prayer?.data as Record<string, Record<string, string>> | undefined)?.timings ?? null;
  const hijriDate = (prayer?.data as Record<string, Record<string, Record<string, string>>> | undefined)?.date?.hijri ?? null;

  const goldPerGram = (gold as Record<string, number> | null)?.price_gram_24k ?? null;
  const goldPerTola = goldPerGram ? Math.round(goldPerGram * 11.664) : null;

  const sunrise = (sunMoon?.results as Record<string, string> | undefined)?.sunrise ?? null;
  const sunset = (sunMoon?.results as Record<string, string> | undefined)?.sunset ?? null;

  const newsArticles = (news?.articles as Array<Record<string, string>> | undefined) ?? [];
  const topHeadline = newsArticles[0]?.title ?? null;

  const aqi = ((airQuality?.list as Array<Record<string, Record<string, number>>> | undefined)?.[0]?.main?.aqi) ?? null;
  const aqiLabel = aqi === 1 ? 'Good' : aqi === 2 ? 'Fair' : aqi === 3 ? 'Moderate' : aqi === 4 ? 'Poor' : aqi === 5 ? 'Very Poor' : 'N/A';

  const btcUsd = (crypto?.bitcoin as Record<string, number> | undefined)?.usd ?? null;
  const btcPkr = (crypto?.bitcoin as Record<string, number> | undefined)?.pkr ?? null;

  const pkrRate = (currency?.conversion_rates as Record<string, number> | undefined)?.PKR ?? null;

  const gdpPerCapita = (economy as Record<string, number> | null)?.['NY.GDP.PCAP.CD'] ?? null;
  const inflation = (economy as Record<string, number> | null)?.['FP.CPI.TOTL.ZG'] ?? null;
  const unemployment = (economy as Record<string, number> | null)?.['SL.UEM.TOTL.ZS'] ?? null;

  const policeNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.police?.all?.[0] ?? null;
  const ambulanceNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.ambulance?.all?.[0] ?? null;
  const fireNum = (emergency?.data as Record<string, Record<string, string>> | undefined)?.fire?.all?.[0] ?? null;

  const hourlyList = (hourly?.list as Array<Record<string, unknown>> | undefined)?.slice(0, 8) ?? [];

  const upcomingHolidays = ((holidays ?? []) as Array<Record<string, string>>)
    .filter((h) => new Date(h.date) >= new Date())
    .slice(0, 5);

  // ── JSON-LD Schemas ──
  const schemas = generateCitySchema({
    city: cityParams.city,
    country: cityParams.country,
    province: cityParams.province,
    temp, weatherDesc, fajr: timings?.Fajr, maghrib: timings?.Maghrib,
    goldPerGram,
  });


  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const currentMonth = MONTHS[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* ── JSON-LD ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.citySchema) }}
      />

      <main className="min-h-screen bg-[#F5F3EE]" style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* ══ SECTION 1: TICKER BAR ══════════════════════════════════════════ */}
        <div className="bg-[#01411C] text-white text-xs py-1.5 overflow-hidden">
          <div className="flex gap-8 px-4 flex-wrap items-center">
            {goldPerGram && (
              <span>🥇 Gold <strong>PKR {Math.round(goldPerGram).toLocaleString()}/g</strong></span>
            )}
            {btcUsd && (
              <span>₿ BTC <strong>${btcUsd.toLocaleString()}</strong></span>
            )}
            {pkrRate && (
              <span>💱 USD/PKR <strong>{pkrRate.toFixed(2)}</strong></span>
            )}
            {temp && (
              <span>🌡 {city} <strong>{Math.round(temp)}°C</strong></span>
            )}
            {timings?.Maghrib && (
              <span>🕌 Maghrib <strong>{timings.Maghrib}</strong></span>
            )}
            <span className="ml-auto opacity-70">
              {currentMonth} {currentYear} · Live Data
            </span>
          </div>
        </div>

        {/* ══ SECTION 2: HERO + LOCAL TIME ══════════════════════════════════ */}
        <section className="bg-[#01411C] text-white pt-8 pb-10 px-4 md:px-8">
          {/* Breadcrumb */}
          <nav className="text-xs text-green-300 mb-4">
            <a href="/" className="hover:text-white">WorldCityHub</a>
            <span className="mx-1">›</span>
            <a href={`/${params.country}`} className="hover:text-white capitalize">{country}</a>
            <span className="mx-1">›</span>
            <a href={`/${params.country}/${params.province}`} className="hover:text-white capitalize">{province}</a>
            <span className="mx-1">›</span>
            <span className="text-white">{city}</span>
          </nav>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl md:text-5xl font-bold mb-2">
                {city}
              </h1>
              <p className="text-green-200 text-lg mb-1">{province} · {country}</p>
              <p className="text-green-300 text-sm">
                {hijriDate ? `${hijriDate.day} ${(hijriDate.month as Record<string, string>)?.en} ${hijriDate.year} AH · ` : ''}
                {currentMonth} {currentYear}
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <a href={`/${params.country}/${params.province}/${params.city}/weather`}
                  className="bg-[#C8A951] text-[#01411C] text-sm font-semibold px-4 py-2 rounded-full hover:bg-yellow-400 transition">
                  🌤 Weather Detail
                </a>
                <a href={`/${params.country}/${params.province}/${params.city}/prayer-times`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  🕌 Prayer Times
                </a>
                <a href={`/${params.country}/${params.province}/${params.city}/rates`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  💰 Rates
                </a>
              </div>
            </div>

            {/* Live clock placeholder - JS hydrates this */}
            <div className="text-right hidden md:block">
              <div className="text-6xl font-mono font-light" id="city-clock">--:--</div>
              <div className="text-green-300 text-sm mt-1">{cityParams.timezone}</div>
              {sunrise && sunset && (
                <div className="text-green-400 text-xs mt-2">
                  🌅 Sunrise {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                  &nbsp;·&nbsp;
                  🌇 Sunset {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">

          {/* ══ SECTION 3: WEATHER ════════════════════════════════════════════ */}
          <section id="weather" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🌤 Weather in {city} Today — {currentMonth} {currentYear}
            </h2>
            {temp ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                  <div className="text-3xl font-mono text-[#01411C]">{Math.round(temp)}°C</div>
                  <div className="text-xs text-gray-500 mt-1">Temperature</div>
                </div>
                <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                  <div className="text-3xl font-mono text-[#01411C]">{Math.round(feelsLike ?? temp)}°C</div>
                  <div className="text-xs text-gray-500 mt-1">Feels Like</div>
                </div>
                <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                  <div className="text-3xl font-mono text-[#01411C]">{humidity}%</div>
                  <div className="text-xs text-gray-500 mt-1">Humidity</div>
                </div>
                <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                  <div className="text-3xl font-mono text-[#01411C]">{Math.round((windSpeed ?? 0) * 3.6)}</div>
                  <div className="text-xs text-gray-500 mt-1">Wind km/h</div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F5F3EE] rounded-xl p-4 mb-6 text-gray-500 text-sm">
                Live weather data loading... Check back in a moment.
              </div>
            )}

            {/* AQI */}
            {aqi && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
                aqi <= 2 ? 'bg-green-100 text-green-700' :
                aqi === 3 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                💨 Air Quality: <strong>{aqiLabel}</strong> (AQI {aqi}/5)
              </div>
            )}

            {/* Hourly forecast */}
            {hourlyList.length > 0 && (
              <div className="overflow-x-auto">
                <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
                  {hourlyList.map((h, i) => {
                    const t = h.dt_txt as string;
                    const time = new Date(t).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
                    const hTemp = (h.main as Record<string, number>)?.temp;
                    const hDesc = (h.weather as Array<Record<string, string>>)?.[0]?.main;
                    return (
                      <div key={i} className="bg-[#F5F3EE] rounded-xl px-4 py-3 text-center min-w-[72px]">
                        <div className="text-xs text-gray-400">{time}</div>
                        <div className="text-lg">
                          {hDesc === 'Rain' ? '🌧' : hDesc === 'Clouds' ? '☁️' : hDesc === 'Clear' ? '☀️' : '🌤'}
                        </div>
                        <div className="text-sm font-mono font-medium text-[#01411C]">{Math.round(hTemp)}°</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="mt-6 text-gray-700 leading-relaxed text-sm">
              {generateWeatherParagraph(city, temp, feelsLike, humidity, weatherDesc, windSpeed ? windSpeed * 3.6 : null)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/weather`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              View full weather forecast →
            </a>
          </section>

          {/* ══ SECTION 4: SUN/MOON ═══════════════════════════════════════════ */}
          {(sunrise || sunset) && (
            <section id="sun-moon" className="bg-white rounded-2xl shadow-sm p-6">
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
                🌅 Sun & Moon in {city} — {currentMonth} {currentYear}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sunrise && (
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <div className="text-2xl">🌅</div>
                    <div className="font-mono text-[#01411C] font-medium">
                      {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunrise</div>
                  </div>
                )}
                {sunset && (
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-2xl">🌇</div>
                    <div className="font-mono text-[#01411C] font-medium">
                      {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunset</div>
                  </div>
                )}
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-2xl">🌙</div>
                  <div className="font-mono text-[#01411C] font-medium">Tonight</div>
                  <div className="text-xs text-gray-500 mt-1">Moon Phase</div>
                </div>
                {sunrise && sunset && (
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="text-2xl">⏱</div>
                    <div className="font-mono text-[#01411C] font-medium">
                      {Math.round((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 3600000)}h
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Daylight</div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ══ SECTION 5: PRAYER TIMES ═══════════════════════════════════════ */}
          <section id="prayer-times" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-1">
              🕌 Prayer Times in {city} — {currentMonth} {currentYear}
            </h2>
            {hijriDate && (
              <p className="text-sm text-gray-500 mb-4">
                {hijriDate.day} {(hijriDate.month as Record<string, string>)?.en} {hijriDate.year} AH
              </p>
            )}
            {timings ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {[
                  { name: 'Fajr', time: timings.Fajr, emoji: '🌙' },
                  { name: 'Sunrise', time: timings.Sunrise, emoji: '🌅' },
                  { name: 'Dhuhr', time: timings.Dhuhr, emoji: '☀️' },
                  { name: 'Asr', time: timings.Asr, emoji: '🌤' },
                  { name: 'Maghrib', time: timings.Maghrib, emoji: '🌇' },
                  { name: 'Isha', time: timings.Isha, emoji: '🌑' },
                ].map((p) => (
                  <div key={p.name} className="bg-[#F5F3EE] rounded-xl p-3 text-center">
                    <div className="text-lg">{p.emoji}</div>
                    <div className="font-mono text-[#01411C] font-semibold text-sm">{p.time}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F5F3EE] rounded-xl p-4 mb-6 text-gray-500 text-sm">
                Prayer times loading...
              </div>
            )}
            <p className="text-gray-700 leading-relaxed text-sm">
              {generatePrayerParagraph(city, timings)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/prayer-times`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full prayer timetable, Qibla compass & Zakat calculator →
            </a>
          </section>

          {/* ══ SECTION 6: GOLD & METAL RATES ════════════════════════════════ */}
          <section id="gold-rates" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🥇 Gold & Metal Rates in {city} — {currentMonth} {currentYear}
            </h2>
            {goldPerGram ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: '24 Karat / gram', value: `PKR ${Math.round(goldPerGram).toLocaleString()}` },
                  { label: '24 Karat / tola', value: `PKR ${goldPerTola?.toLocaleString()}` },
                  { label: '22 Karat / gram', value: `PKR ${Math.round(goldPerGram * 0.9167).toLocaleString()}` },
                  { label: '18 Karat / gram', value: `PKR ${Math.round(goldPerGram * 0.75).toLocaleString()}` },
                ].map((item) => (
                  <div key={item.label} className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="text-xs text-amber-700 mb-1">{item.label}</div>
                    <div className="font-mono font-bold text-amber-900 text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F5F3EE] rounded-xl p-4 mb-6 text-gray-500 text-sm">
                Gold rates loading...
              </div>
            )}

            {/* Crypto */}
            {btcUsd && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Cryptocurrency Today</h3>
                <div className="flex gap-4 flex-wrap">
                  <div className="bg-orange-50 rounded-lg px-4 py-2">
                    <span className="text-xs text-gray-500">Bitcoin (BTC)</span>
                    <div className="font-mono font-bold text-orange-700">${btcUsd.toLocaleString()}</div>
                    {btcPkr && <div className="text-xs text-gray-500">PKR {btcPkr.toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-gray-700 leading-relaxed text-sm">
              {generateGoldParagraph(city, goldPerGram)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/rates`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full rates page — oil, silver, crypto, currency, stocks →
            </a>
          </section>

          {/* ══ SECTION 7: TODAY'S NEWS ═══════════════════════════════════════ */}
          <section id="news" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              📰 {city} News Today — {currentMonth} {currentYear}
            </h2>
            {newsArticles.length > 0 ? (
              <div className="space-y-4 mb-6">
                {newsArticles.slice(0, 5).map((article, i) => (
                  <article key={i} className="flex gap-4 items-start border-b pb-4 last:border-0">
                    <span className="text-gray-300 font-mono text-lg mt-0.5 min-w-[24px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 hover:text-[#01411C] leading-snug"
                      >
                        {article.title}
                      </a>
                      <p className="text-xs text-gray-400 mt-1">
                        {typeof article.source === 'object' ? (article.source as Record<string, string>)?.name : article.source} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-[#F5F3EE] rounded-xl p-4 mb-6 text-gray-500 text-sm">
                News articles loading...
              </div>
            )}
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateNewsParagraph(city, topHeadline)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/news`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full news page — 12 categories, archive, Urdu feed →
            </a>
          </section>

          {/* ══ SECTION 8: EVENTS ═════════════════════════════════════════════ */}
          <section id="events" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🎉 Events in {city} — {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Sports', 'Culture', 'Music', 'Food', 'Religion', 'Business', 'Art', 'Family'].map((cat) => (
                <a
                  key={cat}
                  href={`/${params.country}/${params.province}/${params.city}/events?category=${cat.toLowerCase()}`}
                  className="bg-[#F5F3EE] hover:bg-green-50 rounded-xl p-3 text-center text-sm text-gray-700 hover:text-[#01411C] transition"
                >
                  {cat}
                </a>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateEventsParagraph(city)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/events`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full events calendar — map view, 16 categories, submit event →
            </a>
          </section>

          {/* ══ SECTION 9: ECONOMY ════════════════════════════════════════════ */}
          <section id="economy" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              📊 Economy of {city} — {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">GDP per Capita</div>
                <div className="font-mono font-bold text-[#01411C]">
                  ${gdpPerCapita ? Math.round(gdpPerCapita).toLocaleString() : '--'}
                </div>
              </div>
              <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Inflation</div>
                <div className="font-mono font-bold text-[#01411C]">
                  {inflation ? `${Math.round(inflation)}%` : '--'}
                </div>
              </div>
              <div className="bg-[#F5F3EE] rounded-xl p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Unemployment</div>
                <div className="font-mono font-bold text-[#01411C]">
                  {unemployment ? `${Math.round(unemployment)}%` : '--'}
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateEconomyParagraph(city, country, gdpPerCapita, inflation, unemployment)}
            </p>
            <a href={`/${params.country}/${params.province}/${params.city}/economy`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full economy page — GDP charts, misery index, jobs →
            </a>
          </section>

          {/* ══ SECTION 10: SPORTS ════════════════════════════════════════════ */}
          <section id="sports" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🏏 Sports in {city} — {currentMonth} {currentYear}
            </h2>
            <div className="flex gap-3 flex-wrap mb-6">
              {['Cricket', 'PSL', 'Hockey', 'Football', 'Squash', 'Kabaddi'].map((sport) => (
                <span key={sport} className="bg-[#01411C] text-white text-xs px-3 py-1.5 rounded-full">
                  {sport}
                </span>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateSportsParagraph(city)}
            </p>
            <a href={`/${params.country}/sports`}
              className="inline-block mt-3 text-[#01411C] text-sm font-medium hover:underline">
              Full sports page — live scores, PSL standings, schedules →
            </a>
          </section>

          {/* ══ SECTION 11: FAMOUS PERSONALITIES ═════════════════════════════ */}
          <section id="personalities" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              👤 Famous People from {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { name: 'Allama Iqbal', role: 'Poet-Philosopher', slug: 'allama-iqbal' },
                { name: 'Faiz Ahmed Faiz', role: 'Poet', slug: 'faiz-ahmed-faiz' },
                { name: 'Nusrat Fateh Ali Khan', role: 'Qawwali Singer', slug: 'nusrat-fateh-ali-khan' },
                { name: 'Wasim Akram', role: 'Cricketer', slug: 'wasim-akram' },
              ].map((p) => (
                <a
                  key={p.slug}
                  href={`/personalities/${p.slug}`}
                  className="bg-[#F5F3EE] hover:bg-green-50 rounded-xl p-4 transition"
                >
                  <div className="w-10 h-10 bg-[#01411C] text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">
                    {p.name[0]}
                  </div>
                  <div className="font-medium text-sm text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.role}</div>
                </a>
              ))}
            </div>
          </section>

          {/* ══ SECTION 12: FAMOUS PLACES ════════════════════════════════════ */}
          <section id="places" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🏛 Famous Places in {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'Badshahi Mosque', type: 'Mughal Mosque', slug: 'badshahi-mosque-lahore' },
                { name: 'Lahore Fort', type: 'UNESCO Heritage', slug: 'lahore-fort' },
                { name: 'Shalimar Gardens', type: 'Mughal Gardens', slug: 'shalimar-gardens-lahore' },
                { name: 'Data Darbar', type: 'Sufi Shrine', slug: 'data-darbar-lahore' },
                { name: 'Walled City', type: 'Historic District', slug: 'walled-city-lahore' },
                { name: 'Lahore Museum', type: 'Museum', slug: 'lahore-museum' },
              ].map((place) => (
                <a
                  key={place.slug}
                  href={`/places/${place.slug}`}
                  className="bg-[#F5F3EE] hover:bg-green-50 rounded-xl p-4 transition"
                >
                  <div className="font-medium text-sm text-gray-800">{place.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{place.type}</div>
                  <div className="text-xs text-[#01411C] mt-2 font-medium">Open today? →</div>
                </a>
              ))}
            </div>
          </section>

          {/* ══ SECTION 13: HERITAGE PRODUCTS ════════════════════════════════ */}
          <section id="heritage" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🧶 Heritage Products of {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { name: 'Phulkari Embroidery', slug: 'phulkari-lahore' },
                { name: 'Lahori Chappals', slug: 'lahori-chappals' },
                { name: 'Hand-knotted Rugs', slug: 'lahore-rugs' },
                { name: 'Kashmiri Shawls', slug: 'kashmiri-shawls-lahore' },
                { name: 'Lacquerware', slug: 'lahore-lacquerware' },
                { name: 'Brass & Copperware', slug: 'lahore-brassware' },
              ].map((p) => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="bg-amber-50 border border-amber-100 hover:border-amber-300 rounded-xl p-4 transition"
                >
                  <div className="font-medium text-sm text-amber-900">{p.name}</div>
                  <div className="text-xs text-amber-600 mt-1">View story & buy →</div>
                </a>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateHeritageParagraph(city)}
            </p>
          </section>

          {/* ══ SECTION 14: STREET FOOD ═══════════════════════════════════════ */}
          <section id="food" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🍛 Street Food of {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Nihari', 'Seekh Kebabs', 'Paye', 'Halwa Puri', 'Brain Masala', 'Karahi', 'Jalebi', 'Murgh Cholay'].map((dish) => (
                <div key={dish} className="bg-orange-50 rounded-xl p-3 text-center text-sm font-medium text-orange-800">
                  {dish}
                </div>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateStreetFoodParagraph(city)}
            </p>
          </section>

          {/* ══ SECTION 15: EMERGENCY CONTACTS ═══════════════════════════════ */}
          <section id="emergency" className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-red-500">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-red-700 mb-4">
              🚨 Emergency Contacts — {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Police', number: policeNum ?? '15', emoji: '👮' },
                { label: 'Rescue / Ambulance', number: ambulanceNum ?? '1122', emoji: '🚑' },
                { label: 'Fire Brigade', number: fireNum ?? '16', emoji: '🚒' },
                { label: 'Women Helpline', number: '1043', emoji: '👩' },
              ].map((contact) => (
                <a
                  key={contact.label}
                  href={`tel:${contact.number}`}
                  className="bg-red-50 border border-red-100 hover:bg-red-100 rounded-xl p-4 text-center transition"
                >
                  <div className="text-2xl mb-1">{contact.emoji}</div>
                  <div className="font-mono font-bold text-red-700 text-xl">{contact.number}</div>
                  <div className="text-xs text-gray-600 mt-1">{contact.label}</div>
                </a>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateEmergencyParagraph(city, policeNum, ambulanceNum, fireNum)}
            </p>
          </section>

          {/* ══ SECTION 16: NATURAL RESOURCES ════════════════════════════════ */}
          <section id="resources" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              ⛏ Natural Resources of {province}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Salt (Khewra Mines)', 'Coal (Balochistan)', 'Natural Gas', 'Limestone', 'Marble', 'Gypsum', 'Silica Sand', 'Iron Ore'].map((r) => (
                <div key={r} className="bg-stone-50 rounded-xl p-3 text-sm text-stone-700">{r}</div>
              ))}
            </div>
          </section>

          {/* ══ SECTION 17: CITY AT A GLANCE ═════════════════════════════════ */}
          <section id="glance" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              📋 {city} at a Glance — {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Population', value: '13M+' },
                { label: 'Area', value: '1,772 km²' },
                { label: 'Elevation', value: '217 m' },
                { label: 'Province', value: province },
                { label: 'Time Zone', value: 'PKT (UTC+5)' },
                { label: 'Languages', value: 'Urdu, Punjabi' },
              ].map((item) => (
                <div key={item.label} className="bg-[#F5F3EE] rounded-xl p-4">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="font-semibold text-[#01411C] mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            {wiki?.extract && (
              <p className="text-gray-700 leading-relaxed text-sm">
                {String(generateCityIntro(city, country, province, '13M+', wiki.extract as string))}
              </p>
            )}
          </section>

          {/* ══ SECTION 18: NEARBY CITIES ════════════════════════════════════ */}
          <section id="nearby" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              🗺 Nearby Cities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { name: 'Islamabad', dist: '280 km', slug: 'pakistan/islamabad-capital-territory/islamabad' },
                { name: 'Faisalabad', dist: '130 km', slug: 'pakistan/punjab/faisalabad' },
                { name: 'Gujranwala', dist: '80 km', slug: 'pakistan/punjab/gujranwala' },
                { name: 'Rawalpindi', dist: '280 km', slug: 'pakistan/punjab/rawalpindi' },
                { name: 'Sialkot', dist: '130 km', slug: 'pakistan/punjab/sialkot' },
                { name: 'Multan', dist: '340 km', slug: 'pakistan/punjab/multan' },
              ].map((c) => (
                <a
                  key={c.name}
                  href={`/${c.slug}`}
                  className="bg-[#F5F3EE] hover:bg-green-50 rounded-xl p-4 flex justify-between items-center transition"
                >
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.dist}</div>
                </a>
              ))}
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {generateNearbyCitiesParagraph(city)}
            </p>
          </section>

          {/* ══ SECTION 19: PUBLIC HOLIDAYS ══════════════════════════════════ */}
          {upcomingHolidays.length > 0 && (
            <section id="holidays" className="bg-white rounded-2xl shadow-sm p-6">
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
                📅 Upcoming Holidays in {country}
              </h2>
              <div className="space-y-3">
                {upcomingHolidays.map((h, i) => (
                  <div key={i} className="flex justify-between items-center bg-[#F5F3EE] rounded-xl px-4 py-3">
                    <div className="font-medium text-gray-800">{h.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(h.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ SECTION 20: COMPARE THIS CITY ════════════════════════════════ */}
          <section id="compare" className="bg-[#01411C] text-white rounded-2xl p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold mb-4">
              ⚖️ Compare {city} with Another City
            </h2>
            <div className="flex gap-3 flex-wrap">
              {['Karachi', 'Islamabad', 'Faisalabad', 'Dubai', 'Mumbai', 'London'].map((c) => (
                <a
                  key={c}
                  href={`/compare/${city.toLowerCase()}-vs-${c.toLowerCase()}`}
                  className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-2 rounded-full transition"
                >
                  {city} vs {c}
                </a>
              ))}
            </div>
          </section>

          {/* ══ SECTION 21: JOBS IN CITY ══════════════════════════════════════ */}
          <section id="jobs" className="bg-white rounded-2xl shadow-sm p-6">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-4">
              💼 Jobs in {city} — {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {[
                { sector: 'IT & Software', growth: '↑ Fast growing' },
                { sector: 'Textiles & Garments', growth: '→ Stable' },
                { sector: 'Banking & Finance', growth: '↑ Growing' },
                { sector: 'Education', growth: '→ Stable' },
                { sector: 'Healthcare', growth: '↑ Growing' },
                { sector: 'E-commerce', growth: '↑ Fast growing' },
              ].map((job) => (
                <div key={job.sector} className="bg-[#F5F3EE] rounded-xl p-3">
                  <div className="font-medium text-sm text-gray-800">{job.sector}</div>
                  <div className={`text-xs mt-1 ${job.growth.includes('Fast') ? 'text-green-600' : 'text-gray-500'}`}>
                    {job.growth}
                  </div>
                </div>
              ))}
            </div>
            <a href="https://www.rozee.pk" target="_blank" rel="noopener noreferrer"
              className="inline-block text-[#01411C] text-sm font-medium hover:underline">
              Browse jobs in {city} on Rozee.pk →
            </a>
          </section>

          {/* ══ SECTION 22: CHATBOT CTA ═══════════════════════════════════════ */}
          <section id="chatbot" className="bg-[#C8A951] rounded-2xl p-6 text-center">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-[#01411C] mb-2">
              💬 Ask Anything About {city}
            </h2>
            <p className="text-[#01411C]/80 text-sm mb-4">
              Weather, prayer times, gold rates, events — ask the {city} City Assistant
            </p>
            <button className="bg-[#01411C] text-white px-6 py-3 rounded-full font-medium hover:bg-green-900 transition">
              Start Chat →
            </button>
          </section>

          {/* ══ SECTION 23: FOOTER NAV ════════════════════════════════════════ */}
          <section className="text-center py-6 text-sm text-gray-400">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <a href={`/${params.country}/${params.province}/${params.city}/weather`} className="hover:text-[#01411C]">Weather</a>
              <a href={`/${params.country}/${params.province}/${params.city}/prayer-times`} className="hover:text-[#01411C]">Prayer Times</a>
              <a href={`/${params.country}/${params.province}/${params.city}/rates`} className="hover:text-[#01411C]">Rates</a>
              <a href={`/${params.country}/${params.province}/${params.city}/news`} className="hover:text-[#01411C]">News</a>
              <a href={`/${params.country}/${params.province}/${params.city}/events`} className="hover:text-[#01411C]">Events</a>
              <a href={`/${params.country}/${params.province}/${params.city}/economy`} className="hover:text-[#01411C]">Economy</a>
              <a href={`/${params.country}/sports`} className="hover:text-[#01411C]">Sports</a>
            </div>
            <p className="text-xs">
              Data updates every hour. Prayer times: Karachi method. Gold: LBMA + SBP rate.
              <br />© {currentYear} WorldCityHub · <a href="/privacy" className="hover:underline">Privacy</a> · <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
            </p>
          </section>

        </div>
      </main>

      {/* Live clock script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function updateClock() {
              const el = document.getElementById('city-clock');
              if (!el) return;
              el.textContent = new Date().toLocaleTimeString('en-PK', {
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                timeZone: '${cityParams.timezone}'
              });
            }
            updateClock();
            setInterval(updateClock, 1000);
          `,
        }}
      />
    </>
  );
}
