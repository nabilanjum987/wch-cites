// app/[country]/[province]/[city]/page.tsx
// City Main Page — 23 sections, real API data, rendered on-demand per request.
// force-dynamic prevents pre-rendering at build time, which would fire 14
// external API calls per city simultaneously and crash Vercel on rate limits.
// Test URL: /pakistan/punjab/lahore

import type { Metadata } from 'next';
import FlagSymbolBackground from '@/components/shared/FlagSymbolBackground';
import { notFound } from 'next/navigation';
import { fetchAllCityData, type CityParams } from '@/lib/apis/cityData';
import { generateCityMeta, generateCitySchema } from '@/lib/seo/cityMeta';
import {
  generateCityIntro,
  generateCityIntroAfter,
  generateWeatherParagraph,
  generateWeatherAfter,
  generateSunMoonParagraph,
  generateSunMoonAfter,
  generatePrayerParagraph,
  generatePrayerAfter,
  generateGoldParagraph,
  generateGoldAfter,
  generateNewsParagraph,
  generateNewsAfter,
  generateEventsParagraph,
  generateEventsAfter,
  generateEconomyParagraph,
  generateEconomyAfter,
  generateSportsParagraph,
  generateSportsAfter,
  generatePersonalitiesParagraph,
  generatePersonalitiesAfter,
  generatePlacesParagraph,
  generatePlacesAfter,
  generateHeritageParagraph,
  generateHeritageAfter,
  generateStreetFoodParagraph,
  generateStreetFoodAfter,
  generateEmergencyParagraph,
  generateEmergencyAfter,
  generateCityGlanceParagraph,
  generateCityGlanceAfter,
  generateNearbyCitiesParagraph,
  generateNearbyCitiesAfter,
  generateMultiFaithParagraph,
  generateMultiFaithAfter,
} from '@/lib/paragraphs/city';

export const dynamic = 'force-dynamic';

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

  // Do NOT call fetchAllCityData here — it fires 14 external API calls for
  // every static page at build time, crashing the Vercel worker on rate limits
  // and timeouts. Metadata is generated from static slug data only; live
  // enrichment (temp, prayer times, gold) is loaded client-side at runtime.
  const meta = generateCityMeta({
    city,
    country,
    province,
    temp: null,
    weatherDesc: null,
    fajr: null,
    maghrib: null,
    goldPerGram: null,
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
  const resolvedParams = await params;
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
    city: city,
    country: country,
    province: province,
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

      <main className="min-h-screen relative" style={{ backgroundColor: '#0a0f1e', fontFamily: 'Inter, sans-serif' }}>

        {/* ══ SECTION 1: TICKER BAR ══════════════════════════════════════════ */}
        <div className="text-white text-xs py-1.5 overflow-hidden" style={{ backgroundColor: 'rgba(12,122,61,0.9)', backdropFilter: 'blur(10px)' }}>
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
        <section className="relative text-white pt-8 pb-10 px-4 md:px-8" style={{ background: 'linear-gradient(160deg, #0C7A3D22, #0a0f1e 60%)', borderBottom: '1px solid rgba(12,122,61,0.3)' }}>
          {/* Breadcrumb */}
          <nav className="text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-gray-300 transition-colors">WorldCityHub</a>
            <span className="mx-1">›</span>
            <a href={`/${resolvedParams.country}`} className="hover:text-gray-300 transition-colors capitalize">{country}</a>
            <span className="mx-1">›</span>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}`} className="hover:text-gray-300 transition-colors capitalize">{province}</a>
            <span className="mx-1">›</span>
            <span className="text-white">{city}</span>
          </nav>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#34d399' }} className="text-4xl md:text-5xl font-bold mb-2">
                {city}
              </h1>
              <p className="text-gray-400 text-lg mb-1">{province} · {country}</p>
              <p className="text-gray-500 text-sm">
                {hijriDate ? `${hijriDate.day} ${((hijriDate.month as unknown as Record<string, string>))?.en} ${hijriDate.year} AH · ` : ''}
                {currentMonth} {currentYear}
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`}
                  className="bg-[#C8A951] text-[#01411C] text-sm font-semibold px-4 py-2 rounded-full hover:bg-yellow-400 transition">
                  🌤 Weather Detail
                </a>
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  🕌 Prayer Times
                </a>
                <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`}
                  className="border border-green-400 text-green-200 text-sm px-4 py-2 rounded-full hover:bg-green-800 transition">
                  💰 Rates
                </a>
              </div>
            </div>

            {/* Live clock placeholder - JS hydrates this */}
            <div className="text-right hidden md:block">
              <div className="text-6xl font-mono font-light text-white" id="city-clock">--:--</div>
              <div className="text-gray-500 text-sm mt-1">{cityParams.timezone}</div>
              {sunrise && sunset && (
                <div className="text-gray-500 text-xs mt-2">
                  🌅 Sunrise {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                  &nbsp;·&nbsp;
                  🌇 Sunset {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10 relative z-10">

          {/* ══ SECTION 3: WEATHER ════════════════════════════════════════════ */}
          <section id="weather" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🌤 Weather in {city} Today — {currentMonth} {currentYear}
            </h2>
            {temp ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#0C7A3D' }}>{Math.round(temp)}°C</div>
                  <div className="text-xs text-gray-500 mt-1">Temperature</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#0C7A3D' }}>{Math.round(feelsLike ?? temp)}°C</div>
                  <div className="text-xs text-gray-500 mt-1">Feels Like</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#0C7A3D' }}>{humidity}%</div>
                  <div className="text-xs text-gray-500 mt-1">Humidity</div>
                </div>
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                  <div className="text-3xl font-mono" style={{ color: '#0C7A3D' }}>{Math.round((windSpeed ?? 0) * 3.6)}</div>
                  <div className="text-xs text-gray-500 mt-1">Wind km/h</div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Live weather data loading... Check back in a moment.
              </div>
            )}

            {/* AQI */}
            {aqi && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6 ${
                aqi <= 2 ? 'bg-green-900/40 text-green-400' :
                aqi === 3 ? 'bg-yellow-900/40 text-yellow-400' :
                'bg-red-900/40 text-red-400'
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

            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              {generateWeatherParagraph(city, temp, feelsLike, humidity, weatherDesc, windSpeed ? windSpeed * 3.6 : null)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateWeatherAfter(city, country)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              View full weather forecast →
            </a>
          </section>

          {/* ══ SECTION 4: SUN/MOON ═══════════════════════════════════════════ */}
          {(sunrise || sunset) && (
            <section id="sun-moon" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
                🌅 Sun & Moon in {city} — {currentMonth} {currentYear}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sunrise && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.2)' }}>
                    <div className="text-2xl">🌅</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunrise</div>
                  </div>
                )}
                {sunset && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(249,115,22,0.06)', borderColor: 'rgba(249,115,22,0.2)' }}>
                    <div className="text-2xl">🌇</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Sunset</div>
                  </div>
                )}
                <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
                  <div className="text-2xl">🌙</div>
                  <div className="font-mono font-medium" style={{ color: '#34d399' }}>Tonight</div>
                  <div className="text-xs text-gray-500 mt-1">Moon Phase</div>
                </div>
                {sunrise && sunset && (
                  <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(234,179,8,0.06)', borderColor: 'rgba(234,179,8,0.2)' }}>
                    <div className="text-2xl">⏱</div>
                    <div className="font-mono font-medium" style={{ color: '#34d399' }}>
                      {Math.round((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 3600000)}h
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Daylight</div>
                  </div>
                )}
              </div>
              <p className="mt-6 text-gray-400 leading-relaxed text-sm">
                {generateSunMoonParagraph(city,
                  sunrise ? new Date(sunrise).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone }) : null,
                  sunset ? new Date(sunset).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', timeZone: cityParams.timezone }) : null
                )}
              </p>
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateSunMoonAfter(city)}
              </p>
            </section>
          )}

          {/* ══ SECTION 5: PRAYER TIMES ═══════════════════════════════════════ */}
          <section id="prayer-times" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-1">
              🕌 Prayer Times in {city} — {currentMonth} {currentYear}
            </h2>
            {hijriDate && (
              <p className="text-sm text-gray-500 mb-4">
                {hijriDate.day} {((hijriDate.month as unknown as Record<string, string>))?.en} {hijriDate.year} AH
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
                    <div className="font-mono font-semibold text-sm" style={{ color: '#34d399' }}>{p.time}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{p.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Prayer times loading...
              </div>
            )}
            <p className="text-gray-400 leading-relaxed text-sm">
              {generatePrayerParagraph(city, timings)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePrayerAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full prayer timetable, Qibla compass & Zakat calculator →
            </a>
          </section>

          {/* ══ SECTION 6: GOLD & METAL RATES ════════════════════════════════ */}
          <section id="gold-rates" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
                  <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderColor: 'rgba(251,191,36,0.3)' }}>
                    <div className="text-xs text-amber-400 mb-1">{item.label}</div>
                    <div className="font-mono font-bold text-amber-300 text-lg">{item.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                Gold rates loading...
              </div>
            )}

            {/* Crypto */}
            {btcUsd && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Cryptocurrency Today</h3>
                <div className="flex gap-4 flex-wrap">
                  <div className="rounded-lg px-4 py-2 border" style={{ backgroundColor: 'rgba(249,115,22,0.08)', borderColor: 'rgba(249,115,22,0.3)' }}>
                    <span className="text-xs text-gray-500">Bitcoin (BTC)</span>
                    <div className="font-mono font-bold text-orange-400">${btcUsd.toLocaleString()}</div>
                    {btcPkr && <div className="text-xs text-gray-500">PKR {btcPkr.toLocaleString()}</div>}
                  </div>
                </div>
              </div>
            )}

            <p className="mt-6 text-gray-400 leading-relaxed text-sm">
              {generateGoldParagraph(city, goldPerGram)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateGoldAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full rates page — oil, silver, crypto, currency, stocks →
            </a>
          </section>

          {/* ══ SECTION 7: TODAY'S NEWS ═══════════════════════════════════════ */}
          <section id="news" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
              <div className="rounded-xl p-4 mb-6 text-gray-500 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                News articles loading...
              </div>
            )}
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateNewsParagraph(city, topHeadline)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateNewsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/news`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full news page — 12 categories, archive, Urdu feed →
            </a>
          </section>

          {/* ══ SECTION 8: EVENTS ═════════════════════════════════════════════ */}
          <section id="events" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🎉 Events in {city} — {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Sports', 'Culture', 'Music', 'Food', 'Religion', 'Business', 'Art', 'Family'].map((cat) => (
                <a
                  key={cat}
                  href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events?category=${cat.toLowerCase()}`}
                  className="bg-[#F5F3EE] hover:bg-green-50 rounded-xl p-3 text-center text-sm text-gray-700 hover:text-[#01411C] transition"
                >
                  {cat}
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEventsParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEventsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full events calendar — map view, 16 categories, submit event →
            </a>
          </section>

          {/* ══ SECTION 9: ECONOMY ════════════════════════════════════════════ */}
          <section id="economy" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              📊 Economy of {city} — {currentMonth} {currentYear}
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">GDP per Capita</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  ${gdpPerCapita ? Math.round(gdpPerCapita).toLocaleString() : '--'}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">Inflation</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  {inflation ? `${Math.round(inflation)}%` : '--'}
                </div>
              </div>
              <div className="rounded-xl p-4 text-center border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.25)' }}>
                <div className="text-xs text-gray-500 mb-1">Unemployment</div>
                <div className="font-mono font-bold" style={{ color: '#34d399' }}>
                  {unemployment ? `${Math.round(unemployment)}%` : '--'}
                </div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEconomyParagraph(city, country, gdpPerCapita, inflation, unemployment)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEconomyAfter(city, country)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/economy`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full economy page — GDP charts, misery index, jobs →
            </a>
          </section>

          {/* ══ SECTION 10: SPORTS ════════════════════════════════════════════ */}
          <section id="sports" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🏏 Sports in {city} — {currentMonth} {currentYear}
            </h2>
            <div className="flex gap-3 flex-wrap mb-6">
              {['Cricket', 'PSL', 'Hockey', 'Football', 'Squash', 'Kabaddi'].map((sport) => (
                <span key={sport} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(12,122,61,0.3)', color: '#34d399', border: '1px solid rgba(12,122,61,0.5)' }}>
                  {sport}
                </span>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateSportsParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateSportsAfter(city)}
              </p>
            </p>
            <a href={`/${resolvedParams.country}/sports`}
              className="inline-block mt-3 text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Full sports page — live scores, PSL standings, schedules →
            </a>
          </section>

          {/* ══ SECTION 11: FAMOUS PERSONALITIES ═════════════════════════════ */}
          <section id="personalities" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              👤 Famous People from {city}
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
                {generatePersonalitiesParagraph(city)}
              </p>
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
                  className="rounded-xl p-4 border border-white/10 hover:border-green-500/40 transition" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2" style={{ backgroundColor: 'rgba(12,122,61,0.4)', border: '2px solid rgba(12,122,61,0.6)', color: '#34d399' }}>
                    {p.name[0]}
                  </div>
                  <div className="font-medium text-sm text-white">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.role}</div>
                </a>
              ))}
            </div>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePersonalitiesAfter(city)}
              </p>
          </section>

          {/* ══ SECTION 12: FAMOUS PLACES ════════════════════════════════════ */}
          <section id="places" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🏛 Famous Places in {city}
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-6">
                {generatePlacesParagraph(city)}
              </p>
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
                  className="rounded-xl p-4 border border-white/10 hover:border-green-500/40 transition" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="font-medium text-sm text-white">{place.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{place.type}</div>
                  <div className="text-xs text-[#01411C] mt-2 font-medium">Open today? →</div>
                </a>
              ))}
            </div>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generatePlacesAfter(city)}
              </p>
          </section>

          {/* ══ SECTION 13: HERITAGE PRODUCTS ════════════════════════════════ */}
          <section id="heritage" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
                  className="rounded-xl p-4 border hover:border-amber-400/50 transition" style={{ backgroundColor: 'rgba(251,191,36,0.06)', borderColor: 'rgba(251,191,36,0.2)' }}
                >
                  <div className="font-medium text-sm text-amber-300">{p.name}</div>
                  <div className="text-xs text-amber-500 mt-1">View story & buy →</div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateHeritageParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateHeritageAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 14: STREET FOOD ═══════════════════════════════════════ */}
          <section id="food" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              🍛 Street Food of {city}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Nihari', 'Seekh Kebabs', 'Paye', 'Halwa Puri', 'Brain Masala', 'Karahi', 'Jalebi', 'Murgh Cholay'].map((dish) => (
                <div key={dish} className="rounded-xl p-3 text-center text-sm font-medium border" style={{ backgroundColor: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.3)', color: '#fb923c' }}>
                  {dish}
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateStreetFoodParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateStreetFoodAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 15: EMERGENCY CONTACTS ═══════════════════════════════ */}
          <section id="emergency" className="rounded-2xl p-6 border-l-4 border-red-500" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-red-400 mb-4">
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
                  className="rounded-xl p-4 text-center border hover:border-red-400/60 transition" style={{ backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.3)' }}
                >
                  <div className="text-2xl mb-1">{contact.emoji}</div>
                  <div className="font-mono font-bold text-red-400 text-xl">{contact.number}</div>
                  <div className="text-xs text-gray-500 mt-1">{contact.label}</div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateEmergencyParagraph(city, policeNum, ambulanceNum, fireNum)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateEmergencyAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 16: NATURAL RESOURCES ════════════════════════════════ */}
          <section id="resources" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
              ⛏ Natural Resources of {province}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Salt (Khewra Mines)', 'Coal (Balochistan)', 'Natural Gas', 'Limestone', 'Marble', 'Gypsum', 'Silica Sand', 'Iron Ore'].map((r) => (
                <div key={r} className="rounded-xl p-3 text-sm border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: '#d1d5db' }}>{r}</div>
              ))}
            </div>
          </section>

          {/* ══ SECTION 17: CITY AT A GLANCE ═════════════════════════════════ */}
          <section id="glance" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
                <div key={item.label} className="rounded-xl p-4 border" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(12,122,61,0.2)' }}>
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="font-semibold text-[#01411C] mt-1">{item.value}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateCityGlanceParagraph(city, country, province, '1,772', '217', 'antiquity')}
            </p>
            <p className="mt-4 text-gray-500 leading-relaxed text-sm">
              {generateCityGlanceAfter(city, country)}
            </p>
          </section>

          {/* ══ SECTION 18: NEARBY CITIES ════════════════════════════════════ */}
          <section id="nearby" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
                  className="rounded-xl p-4 border border-white/10 hover:border-green-500/40 flex justify-between items-center transition" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="font-medium text-white">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.dist}</div>
                </a>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateNearbyCitiesParagraph(city)}
              <p className="mt-4 text-gray-500 leading-relaxed text-sm">
                {generateNearbyCitiesAfter(city)}
              </p>
            </p>
          </section>

          {/* ══ SECTION 19: MULTI-FAITH CALENDAR ════════════════════════════ */}
          <section id="multi-faith-calendar" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-2">
              🗓️ All Faiths Calendar — {city} Today
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {generateMultiFaithParagraph(city, country)}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                {
                  emoji: '☪️',
                  label: 'Islamic (Hijri)',
                  value: hijriDate
                    ? `${hijriDate.day} ${(hijriDate.month as unknown as Record<string,string>)?.en} ${hijriDate.year} AH`
                    : `${currentMonth} ${currentYear}`,
                  sub: 'Lunar calendar · Since 622 CE',
                  color: '#0C7A3D',
                },
                {
                  emoji: '✝️',
                  label: 'Christian (Gregorian)',
                  value: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
                  sub: 'Solar calendar · Global civil standard',
                  color: '#3b82f6',
                },
                {
                  emoji: '✡️',
                  label: 'Hebrew',
                  value: new Date().toLocaleDateString('he-IL-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' }),
                  sub: 'Lunisolar calendar · Since antiquity',
                  color: '#6366f1',
                },
                {
                  emoji: '🕉️',
                  label: 'Hindu (Panchang)',
                  value: `${currentMonth} ${currentYear} VS`,
                  sub: 'Lunisolar calendar · Vikram Samvat',
                  color: '#f59e0b',
                },
                {
                  emoji: '☸️',
                  label: 'Buddhist Era',
                  value: `${new Date().getFullYear() + 543} BE`,
                  sub: 'Solar calendar · Since parinirvana',
                  color: '#ec4899',
                },
                {
                  emoji: '🪯',
                  label: 'Sikh (Nanakshahi)',
                  value: `${currentMonth} ${new Date().getFullYear() - 1469} NS`,
                  sub: 'Solar calendar · Since 1469 CE',
                  color: '#f97316',
                },
              ].map((cal) => (
                <div key={cal.label} className="rounded-xl p-4 border" style={{ backgroundColor: `${cal.color}10`, borderColor: `${cal.color}30` }}>
                  <div className="text-2xl mb-2">{cal.emoji}</div>
                  <div className="text-xs text-gray-500 mb-1">{cal.label}</div>
                  <div className="text-white font-semibold text-sm">{cal.value}</div>
                  <div className="text-gray-600 text-xs mt-1">{cal.sub}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mt-6">
              {generateMultiFaithAfter(city)}
            </p>
          </section>

          {/* ══ SECTION 20: PUBLIC HOLIDAYS ══════════════════════════════════ */}
          {upcomingHolidays.length > 0 && (
            <section id="holidays" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
                📅 Upcoming Holidays in {country}
              </h2>
              <div className="space-y-3">
                {upcomingHolidays.map((h, i) => (
                  <div key={i} className="flex justify-between items-center rounded-xl px-4 py-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.2)' }}>
                    <div className="font-medium text-white">{h.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(h.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ══ SECTION 20: COMPARE THIS CITY ════════════════════════════════ */}
          <section id="compare" className="rounded-2xl p-6 border" style={{ background: 'linear-gradient(135deg, rgba(12,122,61,0.3), rgba(12,122,61,0.1))', borderColor: 'rgba(12,122,61,0.5)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold mb-4">
              ⚖️ Compare {city} with Another City
            </h2>
            <div className="flex gap-3 flex-wrap">
              {['Karachi', 'Islamabad', 'Faisalabad', 'Dubai', 'Mumbai', 'London'].map((c) => (
                <a
                  key={c}
                  href={`/compare/${city.toLowerCase()}-vs-${c.toLowerCase()}`}
                  className="text-sm px-4 py-2 rounded-full transition border border-green-500/30 hover:border-green-400/60 hover:bg-green-500/20 text-gray-300 hover:text-white"
                >
                  {city} vs {c}
                </a>
              ))}
            </div>
          </section>

          {/* ══ SECTION 21: JOBS IN CITY ══════════════════════════════════════ */}
          <section id="jobs" className="rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'rgba(12,122,61,0.3)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-4">
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
                  <div className="font-medium text-sm text-white">{job.sector}</div>
                  <div className={`text-xs mt-1 ${job.growth.includes('Fast') ? 'text-green-600' : 'text-gray-500'}`}>
                    {job.growth}
                  </div>
                </div>
              ))}
            </div>
            <a href="https://www.rozee.pk" target="_blank" rel="noopener noreferrer"
              className="inline-block text-sm font-medium hover:underline" style={{ color: '#34d399' }}>
              Browse jobs in {city} on Rozee.pk →
            </a>
          </section>

          {/* ══ SECTION 22: CHATBOT CTA ═══════════════════════════════════════ */}
          <section id="chatbot" className="rounded-2xl p-6 text-center border" style={{ background: 'linear-gradient(135deg, rgba(200,169,81,0.2), rgba(200,169,81,0.1))', borderColor: 'rgba(200,169,81,0.4)' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl font-bold text-white mb-2">
              💬 Ask Anything About {city}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Weather, prayer times, gold rates, events — ask the {city} City Assistant
            </p>
            <button className="text-white px-6 py-3 rounded-full font-medium transition border border-green-500/50 hover:border-green-400" style={{ backgroundColor: 'rgba(12,122,61,0.6)' }}>
              Start Chat →
            </button>
          </section>

          {/* ══ SECTION 23: FOOTER NAV ════════════════════════════════════════ */}
          <section className="text-center py-6 text-sm text-gray-600">
            <div className="flex flex-wrap justify-center gap-4 mb-4 text-gray-500">
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/weather`} className="hover:text-green-400 transition-colors">Weather</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/prayer-times`} className="hover:text-green-400 transition-colors">Prayer Times</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/rates`} className="hover:text-green-400 transition-colors">Rates</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/news`} className="hover:text-green-400 transition-colors">News</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/events`} className="hover:text-green-400 transition-colors">Events</a>
              <a href={`/${resolvedParams.country}/${resolvedParams.province}/${resolvedParams.city}/economy`} className="hover:text-green-400 transition-colors">Economy</a>
              <a href={`/${resolvedParams.country}/sports`} className="hover:text-green-400 transition-colors">Sports</a>
            </div>
            <p className="text-xs text-gray-600">
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




