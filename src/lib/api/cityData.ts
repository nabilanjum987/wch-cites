// lib/api/cityData.ts
// All API calls for the City Main Page (23 sections)
// Uses ISR - called server-side at build/revalidate time

export interface CityParams {
  city: string;
  country: string;
  province: string;
  lat: number;
  lon: number;
  countryCode: string; // e.g. "PK"
  timezone: string;    // e.g. "Asia/Karachi"
}

// ─── 1. WEATHER ───────────────────────────────────────────────────────────────
export async function fetchWeather(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export async function fetchHourlyForecast(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=8&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 2. SUN / MOON ────────────────────────────────────────────────────────────
export async function fetchSunMoon(lat: number, lon: number) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${today}&formatted=0`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 3. PRAYER TIMES ──────────────────────────────────────────────────────────
export async function fetchPrayerTimes(lat: number, lon: number) {
  try {
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const res = await fetch(
      `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=1`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 4. GOLD & METAL RATES ───────────────────────────────────────────────────
export async function fetchGoldRates(currency = 'PKR') {
  try {
    const res = await fetch(
      `https://www.goldapi.io/api/XAU/${currency}`,
      {
        headers: { 'x-access-token': process.env.NEXT_PUBLIC_METAL_KEY || '' },
        next: { revalidate: 86400 }
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 5. CRYPTO (CoinGecko - no key) ──────────────────────────────────────────
export async function fetchCrypto() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd,pkr',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 6. NEWS ──────────────────────────────────────────────────────────────────
export async function fetchCityNews(city: string, country: string) {
  try {
    const query = encodeURIComponent(`${city} ${country}`);
    const res = await fetch(
      `https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&token=${process.env.NEXT_PUBLIC_GNEWS_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 7. SPORTS ────────────────────────────────────────────────────────────────
export async function fetchSports(countryCode: string) {
  try {
    const res = await fetch(
      `https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=${countryCode}&s=Cricket`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 8. WIKIPEDIA CITY INFO ───────────────────────────────────────────────────
export async function fetchWikiSummary(city: string) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(city)}`,
      { next: { revalidate: 2592000 } } // 30 days
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 9. FAMOUS PEOPLE ─────────────────────────────────────────────────────────
export async function fetchFamousPersonalities(city: string) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=notable+people+born+in+${encodeURIComponent(city)}&srlimit=7&format=json&origin=*`,
      { next: { revalidate: 2592000 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 10. FAMOUS PLACES ────────────────────────────────────────────────────────
export async function fetchFamousPlaces(city: string) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=famous+landmarks+${encodeURIComponent(city)}&srlimit=6&format=json&origin=*`,
      { next: { revalidate: 2592000 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 11. ECONOMY (World Bank) ─────────────────────────────────────────────────
export async function fetchEconomy(countryCode: string) {
  try {
    const indicators = ['NY.GDP.PCAP.CD', 'FP.CPI.TOTL.ZG', 'SL.UEM.TOTL.ZS'];
    const results: Record<string, unknown> = {};
    await Promise.all(
      indicators.map(async (ind) => {
        const res = await fetch(
          `https://api.worldbank.org/v2/country/${countryCode}/indicator/${ind}?format=json&mrv=1`,
          { next: { revalidate: 2592000 } }
        );
        if (res.ok) {
          const data = await res.json();
          results[ind] = data[1]?.[0]?.value ?? null;
        }
      })
    );
    return results;
  } catch { return null; }
}

// ─── 12. EMERGENCY CONTACTS ───────────────────────────────────────────────────
export async function fetchEmergencyContacts(countryCode: string) {
  try {
    const res = await fetch(
      `https://emergencynumberapi.com/api/country/${countryCode}`,
      { next: { revalidate: 2592000 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 13. AIR QUALITY ──────────────────────────────────────────────────────────
export async function fetchAirQuality(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 14. CURRENCY RATES ───────────────────────────────────────────────────────
export async function fetchCurrencyRates(base = 'USD') {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${process.env.NEXT_PUBLIC_EXCHANGE_KEY}/latest/${base}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── 15. HOLIDAYS ─────────────────────────────────────────────────────────────
export async function fetchHolidays(countryCode: string) {
  try {
    const year = new Date().getFullYear();
    const res = await fetch(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

// ─── MASTER FETCH — all data for city page ────────────────────────────────────
export async function fetchAllCityData(params: CityParams) {
  const { city, country, lat, lon, countryCode } = params;

  const [
    weather,
    hourlyForecast,
    sunMoon,
    prayerTimes,
    goldRates,
    crypto,
    news,
    sports,
    wikiSummary,
    economy,
    emergencyContacts,
    airQuality,
    currencyRates,
    holidays,
  ] = await Promise.allSettled([
    fetchWeather(lat, lon),
    fetchHourlyForecast(lat, lon),
    fetchSunMoon(lat, lon),
    fetchPrayerTimes(lat, lon),
    fetchGoldRates('PKR'),
    fetchCrypto(),
    fetchCityNews(city, country),
    fetchSports(countryCode),
    fetchWikiSummary(city),
    fetchEconomy(countryCode),
    fetchEmergencyContacts(countryCode),
    fetchAirQuality(lat, lon),
    fetchCurrencyRates('USD'),
    fetchHolidays(countryCode),
  ]);

  const getValue = (result: PromiseSettledResult<unknown>) =>
    result.status === 'fulfilled' ? result.value : null;

  return {
    weather: getValue(weather),
    hourlyForecast: getValue(hourlyForecast),
    sunMoon: getValue(sunMoon),
    prayerTimes: getValue(prayerTimes),
    goldRates: getValue(goldRates),
    crypto: getValue(crypto),
    news: getValue(news),
    sports: getValue(sports),
    wikiSummary: getValue(wikiSummary),
    economy: getValue(economy),
    emergencyContacts: getValue(emergencyContacts),
    airQuality: getValue(airQuality),
    currencyRates: getValue(currencyRates),
    holidays: getValue(holidays),
  };
}
