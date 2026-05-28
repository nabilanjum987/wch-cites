'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface WeatherCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: Array<{ main: string; icon: string }>;
  uvi?: number;
  dew_point?: number;
}

interface WeatherForecast {
  list: Array<{
    dt: number;
    main: { temp_max: number; temp_min: number };
    weather: Array<{ main: string; icon: string }>;
  }>;
}

function getWeatherEmoji(code: string): string {
  if (code === '800') return '☀️';
  if (code.startsWith('80')) return '⛅';
  if (code.startsWith('804')) return '☁️';
  if (code.startsWith('5')) return '🌧️';
  if (code.startsWith('6')) return '❄️';
  if (code.startsWith('2')) return '⛈️';
  return '🌤️';
}

function getWindDirection(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 22.5) % 16];
}

function getWearSuggestions(temp: number): string {
  if (temp > 35) return '👕🧢🕶️🧴';
  if (temp >= 25) return '👕🕶️';
  if (temp >= 15) return '🧥';
  return '🧥🧣';
}

async function fetchWeather(
  lat: number,
  lng: number,
  apiKey: string
): Promise<WeatherCurrent | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

async function fetchForecast(
  lat: number,
  lng: number,
  apiKey: string
): Promise<WeatherForecast | null> {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

function Skeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 mb-6">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function WeatherSnapshot({ city }: { city: City }) {
  const [weather, setWeather] = useState<WeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!key) {
      setLoading(false);
      return;
    }

    async function load() {
      const [w, f] = await Promise.all([
        fetchWeather(city.lat, city.lng, key!),
        fetchForecast(city.lat, city.lng, key!),
      ]);
      setWeather(w);
      setForecast(f);
      setLoading(false);
    }

    load();
  }, [city.lat, city.lng]);

  if (loading) return <Skeleton />;
  if (!weather) {
    return (
      <div className="bg-white rounded-2xl p-6 mb-6 text-gray-500 text-sm">
        Weather data unavailable
      </div>
    );
  }

  const tempInt = Math.round(weather.temp);
  const emoji = getWeatherEmoji(weather.weather[0]?.icon || '');
  const condition = weather.weather[0]?.main || 'N/A';
  const windDir = getWindDirection(weather.wind_deg);
  const wearSuggestions = getWearSuggestions(weather.temp);

  // Get 7 day forecast (unique days)
  const seenDates = new Set<string>();
  const dailyForecast = forecast?.list.filter((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (seenDates.has(date)) return false;
    seenDates.add(date);
    return true;
  }).slice(0, 7) || [];

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wider">Current Weather</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-6xl font-bold text-gray-900">{tempInt}°C</span>
            <span className="text-2xl">{emoji}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{condition}</p>
          <p className="text-xs text-gray-400">Feels like {Math.round(weather.feels_like)}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">Humidity</p>
          <p className="text-lg font-bold text-gray-900">{weather.humidity}%</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">Wind</p>
          <p className="text-lg font-bold text-gray-900">
            {Math.round(weather.wind_speed)} m/s {windDir}
          </p>
        </div>

        {weather.uvi !== undefined && (
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">UV Index</p>
            <p className="text-lg font-bold text-gray-900">{Math.round(weather.uvi)}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">Pressure</p>
          <p className="text-lg font-bold text-gray-900">{weather.pressure} mb</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">Visibility</p>
          <p className="text-lg font-bold text-gray-900">
            {(weather.visibility / 1000).toFixed(1)} km
          </p>
        </div>

        {weather.dew_point !== undefined && (
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Dew Point</p>
            <p className="text-lg font-bold text-gray-900">{Math.round(weather.dew_point)}°C</p>
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">What to Wear</p>
        <div className="text-3xl flex gap-2">
          {wearSuggestions.split('').map((icon, i) => (
            <span key={i}>{icon}</span>
          ))}
        </div>
      </div>

      {dailyForecast.length > 0 && (
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">7-Day Forecast</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {dailyForecast.map((day, i) => {
              const date = new Date(day.dt * 1000);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              const emoji = getWeatherEmoji(day.weather[0]?.icon || '');
              return (
                <div
                  key={i}
                  className="flex-shrink-0 bg-gray-50 rounded-lg p-3 text-center border border-gray-200"
                >
                  <p className="text-xs font-semibold text-gray-600">{dayName}</p>
                  <p className="text-xl my-1">{emoji}</p>
                  <p className="text-xs text-gray-700">
                    <span className="font-bold">{Math.round(day.main.temp_max)}°</span>
                    <span className="text-gray-400"> {Math.round(day.main.temp_min)}°</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
