// Weather "today" keyword layer (A3, extended 3 Nov 2026).
// ONE source for the keyword H1 map and the AEO FAQ array: the client
// (WeatherPageClient) renders the visible FAQ from weatherTodayFaqs(),
// and the server template (weather/page.tsx) emits the FAQPage JSON-LD
// from the SAME array, so visible text and schema can never drift.
// FAQ answers describe only what the page itself shows and name the
// live sources (OpenWeatherMap / Open-Meteo); no invented figures.
import type { AeoFaq } from '@/components/aeo/AnswerLayer';

export const WEATHER_TODAY_H1: Record<string, string> = {
  lahore: 'Lahore Weather Today',
  multan: 'Multan Weather Today',
  islamabad: 'Islamabad Weather Today',
  karachi: 'Karachi Weather Today',
  peshawar: 'Peshawar Weather Today',
};

export function weatherTodayFaqs(cityName: string): AeoFaq[] {
  return [
    {
      q: `What is the weather in ${cityName} today?`,
      a: `The live conditions card at the top of this page shows ${cityName}’s current temperature and condition, plus feels-like temperature, humidity, wind, pressure, visibility and UV index, sourced from OpenWeatherMap and Open-Meteo data. Check the hourly forecast below it for the next hours, and the 10-day forecast for the week ahead. If the live feed is briefly unavailable, the page says so instead of showing an estimate.`,
    },
    {
      q: `Will it rain in ${cityName} today?`,
      a: `Check the hourly forecast on this page: each hour shows a rain probability, and the 10-day forecast shows the same chance for each day ahead. A high percentage means rain is likely at that hour, so carry an umbrella and allow extra travel time. A low percentage means mostly dry conditions, but a brief shower can still occur, so recheck the hourly forecast before heading out.`,
    },
    {
      q: `What should I wear in ${cityName} today?`,
      a: `Use the What to Wear section on this page, which suggests clothing for morning, afternoon, evening and night based on the live temperature at each time of day. Light layers suit warm afternoons, while a jacket helps on cooler mornings and evenings. If rain is forecast, add a waterproof layer or umbrella. Always recheck the live temperature before leaving, since conditions can change during the day.`,
    },
  ];
}
