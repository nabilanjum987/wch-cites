'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { getCityData } from '@/lib/getCityData';
import type { City } from '@/types/city';
import { generateWeatherSchema, generateBreadcrumbSchema } from '@/lib/seo/schemaMarkup';

// Revalidate every hour for fresh weather data
export const revalidate = 3600;

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  uvi: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface HourlyData {
  dt: number;
  temp: number;
  weather: Array<{ main: string; icon: string }>;
  pop: number;
}

interface DailyData {
  dt: number;
  temp: { max: number; min: number };
  weather: Array<{ main: string; icon: string }>;
  pop: number;
}

interface CurrentWeatherResponse {
  current: WeatherData;
  hourly: HourlyData[];
  daily: DailyData[];
  timezone: string;
}

interface SunriseSunsetResponse {
  results: {
    sunrise: string;
    sunset: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
  };
}

const getWeatherIcon = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes('clear') || desc.includes('sunny')) return '☀️';
  if (desc.includes('cloud')) return '☁️';
  if (desc.includes('rain') || desc.includes('shower')) return '🌧️';
  if (desc.includes('snow')) return '❄️';
  if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
  if (desc.includes('mist') || desc.includes('fog')) return '🌫️';
  if (desc.includes('wind')) return '💨';
  return '⛅';
};

const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return 'text-green-400';
  if (aqi <= 100) return 'text-yellow-400';
  if (aqi <= 150) return 'text-orange-400';
  if (aqi <= 200) return 'text-red-400';
  if (aqi <= 300) return 'text-purple-400';
  return 'text-red-600';
};

const getAQILabel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export default function WeatherPage() {
  const params = useParams();
  const [city, setCity] = useState<City | null>(null);
  const [weather, setWeather] = useState<CurrentWeatherResponse | null>(null);
  const [sunTimes, setSunTimes] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aqi, setAqi] = useState<number>(100);

  useEffect(() => {
    const loadData = async () => {
      try {
        const country = Array.isArray(params.country) ? params.country[0] : params.country || '';
        const province = Array.isArray(params.province) ? params.province[0] : params.province || '';
        const citySlug = Array.isArray(params.city) ? params.city[0] : params.city || '';

        const cityData = await getCityData(country, province, citySlug);
        if (!cityData) {
          setError('City not found');
          setLoading(false);
          return;
        }

        setCity(cityData);

        // Fetch weather data - Note: You need to add NEXT_PUBLIC_OPENWEATHER_KEY to .env.local
        const weatherKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || 'demo';
        const weatherUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${cityData.lat}&lon=${cityData.lng}&appid=${weatherKey}&units=metric`;

        let weatherData: Record<string, unknown> | null = null;

        // Try real API first
        if (weatherKey !== 'demo') {
          try {
            const weatherResponse = await fetch(weatherUrl);
            if (weatherResponse.ok) {
              weatherData = await weatherResponse.json();
            }
          } catch {
            console.warn('OpenWeather API failed, using mock data');
          }
        }

        // Use mock data if API fails (for development)
        if (!weatherData) {
          weatherData = {
            current: {
              temp: 34,
              feels_like: 36,
              humidity: 52,
              pressure: 1010,
              wind_speed: 12,
              wind_deg: 230,
              uvi: 8,
              weather: [{ main: 'Sunny', description: 'clear sky', icon: '01d' }],
            },
            hourly: Array.from({ length: 24 }, (_, i) => ({
              dt: Date.now() / 1000 + i * 3600,
              temp: 34 - Math.random() * 8,
              weather: [{ main: 'Sunny', icon: '01d' }],
              pop: Math.random() * 0.2,
            })),
            daily: Array.from({ length: 7 }, (_, i) => ({
              dt: Date.now() / 1000 + i * 86400,
              temp: { max: 36 - i * 0.5, min: 24 + i * 0.5 },
              weather: [{ main: 'Sunny', icon: '01d' }],
              pop: Math.random() * 0.1,
            })),
            timezone: cityData.timezone,
          };
        }

        setWeather(weatherData as unknown as CurrentWeatherResponse);

        // Fetch sunrise/sunset
        try {
          const sunResponse = await fetch(`https://api.sunrise-sunset.org/json?lat=${cityData.lat}&lng=${cityData.lng}&formatted=0`);
          const sunData = (await sunResponse.json()) as SunriseSunsetResponse;
          setSunTimes(sunData.results);
        } catch {
          console.warn('Sunrise/sunset API failed');
          setSunTimes({
            sunrise: '06:00:00',
            sunset: '18:00:00',
          });
        }

        // Set mock AQI (in real scenario, fetch from AQI API)
        setAqi(Math.floor(Math.random() * 200) + 50);
      } catch (err) {
        console.error(err);
        setError('Error loading weather data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const currentWeather = weather?.current;
  const weatherDescription = currentWeather?.weather[0]?.description || 'Unknown';
  const weatherIcon = getWeatherIcon(weatherDescription);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Inject schema markup for SEO
  useEffect(() => {
    if (!city || !weather) return;

    // Create and inject breadcrumb schema
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = 'breadcrumb-schema-weather';
    breadcrumbScript.textContent = JSON.stringify(generateBreadcrumbSchema(city, 'weather'));
    document.head.appendChild(breadcrumbScript);

    // Create and inject weather schema
    const weatherScript = document.createElement('script');
    weatherScript.type = 'application/ld+json';
    weatherScript.id = 'weather-schema';
    const weatherData = {
      temp: weather.current?.temp || 34,
      condition: weather.current?.weather[0]?.description || 'Sunny',
      humidity: weather.current?.humidity || 52,
      aqi: aqi,
      wind_speed: weather.current?.wind_speed || 15,
    };
    weatherScript.textContent = JSON.stringify(generateWeatherSchema(city, weatherData));
    document.head.appendChild(weatherScript);

    // Update meta tags
    document.title = `${city.name} Weather Today — Live Temperature & 7-Day Forecast`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      const temp = weather.current?.temp || '34';
      const condition = weather.current?.weather[0]?.description || 'Sunny';
      metaDescription.setAttribute(
        'content',
        `${city.name} weather today: ${temp}°C ${condition}. Live temperature, hourly & 7-day forecast, AQI, and sunrise/sunset times.`
      );
    }

    return () => {
      breadcrumbScript.remove();
      weatherScript.remove();
    };
  }, [city, weather, aqi]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c3a66] via-[#030712] to-[#030712]">
      {/* HERO SECTION */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full py-12 px-4 md:py-20 border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            🌤️ Weather
          </h1>
          <p className="text-xl text-gray-300">
            {city?.name}, {city?.province}, {city?.country}
          </p>
        </div>
      </motion.header>

      <div className="w-full px-4 py-12 md:py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          {loading ? (
            <div className="text-center text-gray-400">Loading weather data...</div>
          ) : error ? (
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : currentWeather ? (
            <>
              {/* CURRENT CONDITIONS HERO */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants}>
                  <GlassCard variant="premium" glowColor="cyan" className="p-8 md:p-12">
                    <div className="flex items-center justify-between gap-8">
                      <div>
                        <p className="text-cyan-300 text-lg font-semibold mb-2">RIGHT NOW</p>
                        <div className="flex items-baseline gap-4">
                          <span className="text-7xl md:text-8xl font-bold text-white">
                            {Math.round(currentWeather.temp)}°
                          </span>
                          <span className="text-3xl text-cyan-300">{weatherIcon}</span>
                        </div>
                        <p className="text-xl text-gray-400 mt-2 capitalize">{weatherDescription}</p>
                        <p className="text-gray-400 mt-4">
                          Feels like <span className="font-semibold text-white">{Math.round(currentWeather.feels_like)}°</span>
                        </p>
                      </div>
                      <div className="hidden md:flex flex-col gap-6 text-right">
                        <div>
                          <p className="text-gray-400">Humidity</p>
                          <p className="text-3xl font-bold text-white">{currentWeather.humidity}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Wind</p>
                          <p className="text-3xl font-bold text-white">{Math.round(currentWeather.wind_speed)} km/h</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              </motion.div>

              {/* MOBILE CURRENT STATS */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:hidden">
                <motion.div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Humidity', value: `${currentWeather.humidity}%` },
                    { label: 'Wind', value: `${Math.round(currentWeather.wind_speed)} km/h` },
                    { label: 'Pressure', value: `${currentWeather.pressure} mb` },
                  ].map((item) => (
                    <motion.div key={item.label} variants={itemVariants}>
                      <GlassCard variant="default" className="p-4 text-center">
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-lg font-bold text-cyan-400 mt-2">{item.value}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* WHAT TO WEAR */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">👕 What to Wear</h3>
                <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { time: 'Morning', temp: 28, items: '👕 Light shirt | 🧢 Cap' },
                    { time: 'Afternoon', temp: 36, items: '👕 Cotton tee | 🕶️ Sunglasses | 🧢 Cap' },
                    { time: 'Evening', temp: 32, items: '👕 Light jacket | 🧢 Hat' },
                    { time: 'Night', temp: 26, items: '🧥 Light sweater' },
                  ].map((item) => (
                    <motion.div key={item.time} variants={itemVariants}>
                      <GlassCard variant="default" className="p-4 text-center">
                        <p className="font-semibold text-white mb-2">{item.time}</p>
                        <p className="text-sm text-cyan-400 mb-3">{item.temp}°C</p>
                        <p className="text-xs text-gray-400">{item.items}</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* HOURLY FORECAST */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">⏰ Hourly Forecast (24h)</h3>
                <GlassCard variant="default" className="p-4 overflow-x-auto">
                  <div className="flex gap-3 pb-2">
                    {weather?.hourly?.slice(0, 24).map((hour, idx) => (
                      <div key={idx} className="flex-shrink-0 p-3 bg-white/5 rounded-lg text-center min-w-20">
                        <p className="text-xs text-gray-400">{formatTime(hour.dt)}</p>
                        <p className="text-lg my-2">{getWeatherIcon(hour.weather[0]?.main)}</p>
                        <p className="font-bold text-white">{Math.round(hour.temp)}°</p>
                        <p className="text-xs text-cyan-400">{Math.round(hour.pop * 100)}%</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>

              {/* 7-DAY FORECAST */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">📅 7-Day Forecast</h3>
                <motion.div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {weather?.daily?.slice(0, 7).map((day, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                      <GlassCard
                        variant="default"
                        className="p-4 text-center hover:bg-cyan-500/15 transition-colors"
                      >
                        <p className="text-sm font-semibold text-white mb-2">
                          {formatDate(day.dt)}
                        </p>
                        <p className="text-2xl my-3">{getWeatherIcon(day.weather[0]?.main)}</p>
                        <div className="flex justify-center gap-2 text-sm font-mono">
                          <span className="text-cyan-400">{Math.round(day.temp.max)}°</span>
                          <span className="text-gray-500">{Math.round(day.temp.min)}°</span>
                        </div>
                        <p className="text-xs text-cyan-400 mt-2">{Math.round(day.pop * 100)}% rain</p>
                      </GlassCard>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* SUN & MOON */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">☀️ Sun & Moon</h3>
                {sunTimes && (
                  <GlassCard variant="default" className="p-8">
                    <div className="space-y-8">
                      <div>
                        <p className="text-gray-400 mb-4">Sun Position Today</p>
                        <svg className="w-full h-24" viewBox="0 0 400 100">
                          {/* Arc */}
                          <path
                            d="M 50 90 A 150 150 0 0 1 350 90"
                            fill="none"
                            stroke="rgba(6, 182, 212, 0.2)"
                            strokeWidth="2"
                          />

                          {/* Sunrise marker */}
                          <circle cx="50" cy="90" r="4" fill="#fbbf24" />
                          <text x="50" y="110" textAnchor="middle" fill="#fbbf24" fontSize="12">
                            Sunrise
                          </text>

                          {/* Sun position (approximate) */}
                          <circle cx="200" cy="50" r="6" fill="#fbbf24" />
                          <text x="200" y="35" textAnchor="middle" fill="#fbbf24" fontSize="12">
                            Now
                          </text>

                          {/* Sunset marker */}
                          <circle cx="350" cy="90" r="4" fill="#f97316" />
                          <text x="350" y="110" textAnchor="middle" fill="#f97316" fontSize="12">
                            Sunset
                          </text>
                        </svg>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Sunrise</p>
                          <p className="text-xl font-mono font-bold text-amber-400">
                            {sunTimes?.sunrise ? new Date(sunTimes.sunrise as unknown as string).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Solar Noon</p>
                          <p className="text-xl font-mono font-bold text-yellow-400">12:00</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Sunset</p>
                          <p className="text-xl font-mono font-bold text-orange-400">
                            {sunTimes?.sunset ? new Date(sunTimes.sunset as unknown as string).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) : '--:--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                )}
              </motion.div>

              {/* AIR QUALITY */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">💨 Air Quality Index</h3>
                <GlassCard variant="default" className="p-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-gray-400">AQI Level</p>
                        <p className={`text-3xl font-bold ${getAQIColor(aqi)}`}>{aqi}</p>
                      </div>
                      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${aqi <= 50 ? 'bg-green-500' : aqi <= 100 ? 'bg-yellow-500' : aqi <= 150 ? 'bg-orange-500' : aqi <= 200 ? 'bg-red-500' : 'bg-purple-600'}`}
                          style={{ width: `${Math.min(aqi / 5, 100)}%` }}
                        />
                      </div>
                      <p className={`text-sm mt-2 font-semibold ${getAQIColor(aqi)}`}>
                        {getAQILabel(aqi)}
                      </p>
                    </div>

                    {aqi > 100 && (
                      <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-4">
                        <p className="text-orange-200 text-sm">
                          😷 <strong>Air Quality Alert:</strong> Sensitive groups should wear N95 masks outdoors
                        </p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </motion.div>

              {/* WEATHER STORY */}
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <h3 className="text-2xl font-bold text-white mb-6">📖 Weather Story</h3>
                <GlassCard variant="default" className="p-8">
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {currentWeather.temp > 35
                      ? `${city?.name} greets you with a blazing ${Math.round(currentWeather.temp)}°C afternoon. The sun beats down relentlessly with ${currentWeather.humidity}% humidity creating a hazy atmosphere. A light breeze of ${Math.round(currentWeather.wind_speed)} km/h provides some relief. It's a day to stay hydrated and seek shade.`
                      : `The weather in ${city?.name} is ${weatherDescription} with a temperature of ${Math.round(currentWeather.temp)}°C. With ${currentWeather.humidity}% humidity and winds at ${Math.round(currentWeather.wind_speed)} km/h, it's a ${currentWeather.temp < 20 ? 'cool' : 'pleasant'} day. Perfect for outdoor activities.`}
                  </p>
                </GlassCard>
              </motion.div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
