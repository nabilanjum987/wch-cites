// CITY FAQ BANK (R5-C2) — for the city template (city main page + its
// FAQ JSON-LD, today generated in src/lib/seo/cityMeta.ts).
//
// Slot mapping (all fields the city page already computes):
//   {city} {country} {province} — display names from the city record
//   {temp} {weatherDesc}         — fetchWeather (OpenWeatherMap)
//   {fajr} {maghrib}             — fetchPrayerTimes (Aladhan, Karachi method)
//   {sunrise} {sunset}           — fetchSunMoon (sunrise-sunset.org)
//   {aqi}                        — fetchAirQuality (OpenWeatherMap)
//   {goldPerGram}                — the page's gold fetch (gold-api XAU);
//                                  per-tola = per-gram × 11.6638 (definitional)
//   {usdPkr}                     — fetchCurrencyRates (ExchangeRate-API open endpoint)
//   {population}                 — the city dataset figure (registry)
//   {year}                       — current year
// Entries 1–8 align 1:1 with the questions the live city FAQ schema
// already asks, so adoption is mechanical; 9–12 are additions the same
// page data answers. Pakistan-specific entries (7, 8) reflect the only
// published country today and are marked as such.

import type { FaqBank } from './types';

export const CITY_FAQ_BANK: FaqBank = [
  {
    id: 'city-weather-today',
    question: 'What is the weather in {city} today?',
    answer:
      'The current temperature in {city} is {temp}°C with {weatherDesc}. This page shows live weather from OpenWeatherMap — temperature, feels-like, humidity, wind and UV — refreshed hourly, with the hourly forecast in the weather section above.',
    slots: ['city', 'temp', 'weatherDesc'],
    source: 'Live page data — OpenWeatherMap current weather via the city data layer (fetchWeather).',
    demand: 'Weather is a core cluster of the keyword phrase bank (city + weather queries).',
  },
  {
    id: 'city-prayer-times',
    question: "What are today's prayer times in {city}?",
    answer:
      "Today's prayer times in {city}: Fajr at {fajr} and Maghrib at {maghrib}, with Dhuhr, Asr and Isha shown in the prayer section of this page. Times are calculated daily by Aladhan using the Karachi method (University of Islamic Sciences), and the full monthly timetable is on this city's prayer-times page.",
    slots: ['city', 'fajr', 'maghrib'],
    source: 'Live page data — Aladhan timings via the city data layer (fetchPrayerTimes), Karachi method.',
    demand: 'Strongest cluster in the phrase bank: 841 prayer/namaz-time phrases (e.g. "isha namaz time lahore").',
  },
  {
    id: 'city-gold-rate',
    question: 'What is the gold rate in {city} today?',
    answer:
      'Gold in {city} is priced from the same international spot market as the rest of Pakistan: 24K at PKR {goldPerGram} per gram, which is PKR {goldPerTola} per tola (one tola = 11.664 grams). All karats — 24K, 22K, 21K and 18K — are shown in the rates section of this page and on the full rates page.',
    slots: ['city', 'goldPerGram', 'goldPerTola'],
    source: 'Live page data — gold-api.com XAU via the page gold fetch; tola conversion is definitional (× 11.6638).',
    demand: '"gold price" / "gold rate today" cluster across all markets in the phrase bank.',
  },
  {
    id: 'city-famous-for',
    question: 'What is {city} famous for?',
    answer:
      '{city} is known for its historic landmarks, its food culture, and its people — the poets, athletes, scholars and artists who shaped {country}. The Famous Places and Famous People sections of this page list the highlights for {city} itself; no other city’s landmarks are ever substituted.',
    slots: ['city', 'country'],
    source: "The page's own Famous Places / Famous People sections (Wikipedia-sourced lists in the city data layer). City-neutral by design — the Q11 de-Lahoring rule.",
  },
  {
    id: 'city-population',
    question: 'What is the population of {city} in {year}?',
    answer:
      "{city}'s population is {population} (the city dataset figure carried on this page). Where a verified figure is not available, this answer is shortened rather than estimated — WorldCityHub does not publish population guesses.",
    slots: ['city', 'year', 'population'],
    source: 'City dataset (registry) figure — the same population value the page displays.',
  },
  {
    id: 'city-language',
    question: 'What language is spoken in {city}?',
    answer:
      'Urdu — the national language, used in education, government and media — and the regional language of {province} are the primary languages spoken in {city}. English is widely used in business, universities and government, and many residents switch between languages in daily life.',
    slots: ['province', 'city'],
    source: 'Country/province language facts as carried in the verified city FAQ set (cityMeta.ts, Q11 pass).',
  },
  {
    id: 'city-emergency',
    question: 'What is the emergency number in {city}?',
    answer:
      'In {city}, call 15 for Police, 1122 for Rescue and ambulance, and 16 for the Fire Brigade. The Edhi Foundation ambulance is reachable at 115, and the women’s helpline is 1043. All of these numbers are free to call from any mobile or landline.',
    slots: ['city'],
    source: 'Pakistan emergency numbers as verified in the live city FAQ set; cross-checked against the page’s emergency-contacts data (emergency number dataset). Pakistan template entry.',
  },
  {
    id: 'city-best-time',
    question: 'What is the best time to visit {city}?',
    answer:
      'For most of Pakistan’s published cities, October to March brings the most pleasant weather, with milder temperatures and better air quality; May to July is the hottest stretch, and the monsoon follows in July to September. Treat this as general guidance and check the live weather section of this page before travelling.',
    slots: ['city'],
    source: 'General Pakistan climate guidance as carried in the verified city FAQ set (cityMeta.ts, Q11 pass) — guidance, not a measurement. Pakistan template entry.',
  },
  {
    id: 'city-sunrise-sunset',
    question: 'What time is sunrise and sunset in {city} today?',
    answer:
      'Sunrise in {city} today is at {sunrise} and sunset at {sunset}. The Sun & Moon section of this page also shows the day length and moon phase, calculated for the city’s own coordinates.',
    slots: ['city', 'sunrise', 'sunset'],
    source: 'Live page data — sunrise-sunset.org via the city data layer (fetchSunMoon).',
  },
  {
    id: 'city-air-quality',
    question: 'What is the air quality in {city} today?',
    answer:
      'The air quality index in {city} right now is {aqi} on the US EPA scale used by OpenWeatherMap. When the air-quality feed is unavailable, this page leaves the value out rather than estimating it.',
    slots: ['city', 'aqi'],
    source: 'Live page data — OpenWeatherMap Air Pollution via the city data layer (fetchAirQuality).',
  },
  {
    id: 'city-usd-pkr',
    question: 'What is the USD to PKR rate in {city} today?',
    answer:
      'One US dollar is PKR {usdPkr} today. The rate is national — it does not vary by city — and the rates page shows interbank and open-market figures side by side, with the day’s movement.',
    slots: ['city', 'usdPkr'],
    source: 'Live page data — ExchangeRate-API via the city data layer (fetchCurrencyRates); the rates page carries the full pair table.',
    demand: '"usd to pkr" is the strongest FX term in the trends data (mean interest 72.8, 2026-10-21 pull).',
  },
  {
    id: 'city-data-sources',
    question: 'How does WorldCityHub get its data for {city}?',
    answer:
      'Every figure on this page is fetched from a named public source — OpenWeatherMap for weather and air quality, Aladhan for prayer times, CoinGecko for gold, the ExchangeRate-API for currency, GNews for headlines — and the full list is published on the Sources page. If a feed is down, the section shows less instead of filling the gap with invented numbers, and the improvement form reaches the team if you spot an error.',
    slots: ['city'],
    source: 'The city data layer itself (fetchAllCityData in src/lib/apis/cityData.ts) + the published /sources page.',
  },
];
