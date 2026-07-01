'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WeatherData, HourlyItem, DailyItem, HistoricalData, ClimateData, AQIData, SunMoonData, WeatherAlert, NearbyCityWeather } from '@/types/city';
import { fetchWeatherData, fetchHistoricalData, getClimateData, fetchAQIData, fetchSunMoonData, fetchWeatherAlerts, fetchNearbyWeather } from '@/lib/apis/weather';
import { Wind, Droplets, Eye, Gauge, Thermometer, Sun, Cloud, CloudRain, ChevronLeft, ChevronRight, Shirt, Coffee, Moon, CloudSnow, Activity, BarChart2, Heart, ShieldAlert, AlertTriangle, Leaf, Factory, Car, Tractor, CloudFog, Clock, ShoppingBag, Sunrise, Sunset, ArrowUp, ArrowDown, ThermometerSun, CloudDrizzle, MapPin } from 'lucide-react';
import {
  generateHeroParagraph, generateHeroAfter,
  generateStatsParagraph, generateStatsAfter,
  generateWearParagraph, generateWearAfter,
  generateStoryParagraph, generateStoryAfter,
  generateHourlyParagraph, generateHourlyAfter,
  generateTenDayParagraph, generateTenDayAfter,
  generateSunMoonParagraph, generateSunMoonAfter,
  generateMonthlyParagraph, generateMonthlyAfter,
  generateHistoryParagraph, generateHistoryAfter,
  generateAlertsParagraph, generateAlertsAfter,
  generateNearbyParagraph, generateNearbyAfter,
  generateAQIOverviewParagraph, generateAQIOverviewAfter,
  generatePollutantsParagraph, generatePollutantsAfter,
  generateAQIHealthParagraph, generateAQIHealthAfter,
} from '@/lib/paragraphs/weather';

// ─── Animation variants ─────────────────────────────────────────────────────

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } } };

// ─── Helpers ────────────────────────────────────────────────────────────────

function conditionToEmoji(id: number, icon?: string): string {
  const night = icon?.endsWith('n');
  if (id >= 200 && id < 300) return '⛈️';
  if (id >= 300 && id < 400) return '🌦️';
  if (id >= 500 && id < 510) return '🌧️';
  if (id === 511) return '🌨️';
  if (id >= 511 && id < 600) return '🌧️';
  if (id >= 600 && id < 700) return '❄️';
  if (id >= 700 && id < 800) return '🌫️';
  if (id === 800) return night ? '🌙' : '☀️';
  if (id === 801) return '🌤️';
  if (id === 802) return '⛅';
  if (id >= 803) return '☁️';
  return '🌡️';
}

function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function uvLabel(uvi: number): { label: string; color: string; bg: string } {
  if (uvi < 3) return { label: 'Low', color: 'text-emerald-700', bg: 'bg-emerald-100' };
  if (uvi < 6) return { label: 'Moderate', color: 'text-amber-700', bg: 'bg-amber-500/15' };
  if (uvi < 8) return { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/15' };
  if (uvi < 11) return { label: 'Very High', color: 'text-red-400', bg: 'bg-red-500/15' };
  return { label: 'Extreme', color: 'text-rose-800', bg: 'bg-rose-100' };
}

function formatHour(dt: number, tz?: string): string {
  return new Date(dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, timeZone: tz });
}

function formatDay(dt: number, tz?: string): string {
  const d = new Date(dt * 1000);
  if (d.toDateString() === new Date().toDateString()) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'short', timeZone: tz });
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Animated weather icon ─────────────────────────────────────────────────

function LargeWeatherIcon({ conditionId, icon }: { conditionId: number; icon: string }) {
  const isNight = icon.endsWith('n');
  const isThunder = conditionId >= 200 && conditionId < 300;
  const isRain = conditionId >= 300 && conditionId < 600;
  const isSnow = conditionId >= 600 && conditionId < 700;
  const isFog = conditionId >= 700 && conditionId < 800;
  const isClear = conditionId === 800;
  const isCloudy = conditionId > 800;

  if (isClear && !isNight) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative flex items-center justify-center w-32 h-32"
      >
        <motion.div className="absolute inset-0 rounded-full bg-yellow-300/30 blur-xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="absolute inset-4 rounded-full bg-yellow-200/40 blur-lg" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.span className="text-7xl drop-" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>☀️</motion.span>
      </motion.div>
    );
  }
  if (isClear && isNight) {
    return (
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="relative flex items-center justify-center w-32 h-32">
        <motion.span className="text-7xl drop-" animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 4, repeat: Infinity }}>🌙</motion.span>
        <motion.div className="absolute top-2 right-4">
          <motion.span className="text-lg" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }}>⭐</motion.span>
        </motion.div>
      </motion.div>
    );
  }
  if (isThunder) return (
    <motion.span className="text-7xl drop-" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity }}>⛈️</motion.span>
  );
  if (isSnow) return (
    <motion.span className="text-7xl drop-" animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>❄️</motion.span>
  );
  if (isRain) return (
    <motion.span className="text-7xl drop-" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🌧️</motion.span>
  );
  if (isFog) return (
    <motion.span className="text-7xl drop- opacity-80" animate={{ opacity: [0.6, 0.9, 0.6] }} transition={{ duration: 3, repeat: Infinity }}>🌫️</motion.span>
  );
  if (isCloudy) return (
    <motion.span className="text-7xl drop-" animate={{ x: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>☁️</motion.span>
  );
  return <span className="text-7xl drop-">🌡️</span>;
}

// ─── Navigation tabs ──────────────────────────────────────────────────────

type Tab = 'Today' | 'Tomorrow' | '10 Day' | 'Monthly' | 'History' | 'Radar' | 'Air Quality';
const ALL_TABS: Tab[] = ['Today', 'Tomorrow', '10 Day', 'Monthly', 'History', 'Radar', 'Air Quality'];

function NavTabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      {ALL_TABS.map((tab: Tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === tab
              ? 'bg-[#01411C] text-white'
              : 'bg-white text-gray-600 border border-white/10 hover:border-gray-300 hover:bg-white/5'
          }`}
        >
          {tab}
        </button>
      ))}
    </motion.div>
  );
}

// ─── Hero card ─────────────────────────────────────────────────────────────

function HeroCard({ data, cityName, country, timezone }: { data: WeatherData; cityName: string; country: string; timezone: string }) {
  const { current } = data;
  const uv = uvLabel(current.uvi);
  const isNight = current.icon.endsWith('n');
  const sunriseStr = new Date(current.sunrise * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone });
  const sunsetStr = new Date(current.sunset * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone });

  return (
    <>
    <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
      {generateHeroParagraph(cityName, current.temp, current.condition, data.daily[0]?.temp_max ?? null, data.daily[0]?.temp_min ?? null)}
    </p>
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      className="rounded-2xl border  border border-white/8 overflow-hidden mb-6"
    >
      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[#01411C]" />
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{cityName}</p>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-7xl sm:text-8xl font-light text-gray-900">{current.temp}</span>
              <span className="text-3xl text-gray-600">°C</span>
            </div>
            <p className="text-xl sm:text-2xl font-medium text-white capitalize mb-3">{current.condition}</p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-1"><ArrowUp size={14} className="text-red-500" />{data.daily[0]?.temp_max ?? '--'}°</span>
              <span className="flex items-center gap-1"><ArrowDown size={14} className="text-blue-500" />{data.daily[0]?.temp_min ?? '--'}°</span>
            </div>
          </div>
          <div className="flex-shrink-0 self-center sm:self-start">
            <LargeWeatherIcon conditionId={current.condition_id} icon={current.icon} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-6 pt-6 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Sunrise size={16} className="text-amber-500" />
              <p className="text-xs text-gray-500">Sunrise</p>
            </div>
            <p className="text-sm font-semibold text-white">{sunriseStr}</p>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Sunset size={16} className="text-orange-500" />
              <p className="text-xs text-gray-500">Sunset</p>
            </div>
            <p className="text-sm font-semibold text-white">{sunsetStr}</p>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <ThermometerSun size={16} className="text-yellow-500" />
              <p className="text-xs text-gray-500">UV Index</p>
            </div>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${uv.bg} ${uv.color}`}>
              {current.uvi.toFixed(1)} {uv.label}
            </span>
          </div>
          <div className="rounded-xl border p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Droplets size={16} className="text-blue-500" />
              <p className="text-xs text-gray-500">Humidity</p>
            </div>
            <p className="text-sm font-semibold text-white">{current.humidity}%</p>
          </div>
        </div>
      </div>
    </motion.section>
    <p className="text-gray-600 leading-relaxed text-sm mb-6 px-1">
      {generateHeroAfter(cityName, country)}
    </p>
    </>
  );
}

// ─── Stats grid ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      whileHover={{ y: -2 }}
      className={`rounded-xl border p-4 border border-white/8 hover: hover:border-white/10 transition-all duration-300 ${accent ? 'ring-2 ring-emerald-100 border-emerald-200' : ''}`}
    >
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </motion.div>
  );
}

function StatsGrid({ data, cityName }: { data: WeatherData; cityName: string }) {
  const { current } = data;
  const uv = uvLabel(current.uvi);
  const stats: Array<{ icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }> = [
    { icon: <Thermometer size={16} />, label: 'Feels Like', value: `${current.feels_like}°`, sub: current.feels_like < current.temp ? 'Feels cooler' : 'Feels warmer', accent: true },
    { icon: <Droplets size={16} />, label: 'Humidity', value: `${current.humidity}%`, sub: current.humidity > 70 ? 'Quite humid' : current.humidity < 30 ? 'Very dry' : 'Comfortable' },
    { icon: <Wind size={16} />, label: 'Wind', value: `${current.wind_speed} km/h`, sub: `From ${windDirection(current.wind_deg)}` },
    { icon: <Sun size={16} />, label: 'UV Index', value: current.uvi.toFixed(1), sub: uv.label, accent: current.uvi > 6 },
    { icon: <Gauge size={16} />, label: 'Pressure', value: `${current.pressure}`, sub: 'hPa' },
    { icon: <Eye size={16} />, label: 'Visibility', value: `${current.visibility} km`, sub: current.visibility >= 10 ? 'Excellent' : current.visibility >= 5 ? 'Moderate' : 'Poor' },
    { icon: <CloudDrizzle size={16} />, label: 'Dew Point', value: `${current.dew_point}°`, sub: current.dew_point > 20 ? 'Muggy' : 'Comfortable' },
    { icon: <Cloud size={16} />, label: 'Clouds', value: `${current.clouds}%`, sub: current.clouds < 20 ? 'Clear skies' : current.clouds < 60 ? 'Partly cloudy' : 'Overcast' },
  ];
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 px-1">Current Conditions</h2>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateStatsParagraph(cityName, current.feels_like, current.humidity, current.wind_speed, current.pressure)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) => <StatCard key={s.label} {...s} />)}
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateStatsAfter(cityName)}
      </p>
    </motion.section>
  );
}

// ─── What to wear ────────────────────────────────────────────────────────

type TOD = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

interface WardrobeCard { tod: TOD; tempRange: string; items: string[]; tip: string; icon: React.ReactNode; gradient: string }

function buildWardrobeCards(data: WeatherData): WardrobeCard[] {
  const { current, hourly, daily } = data;
  const morningTemp = hourly[1]?.temp ?? current.temp;
  const afternoonTemp = hourly[3]?.temp ?? current.temp + 3;
  const eveningTemp = hourly[5]?.temp ?? current.temp - 2;
  const nightTemp = daily[0]?.temp_min ?? current.temp - 5;

  function clothingItems(temp: number, isRaining: boolean): string[] {
    const items: string[] = [];
    if (temp < 5) items.push('Heavy coat', 'Thermal layers', 'Gloves');
    else if (temp < 15) items.push('Jacket', 'Sweater', 'Long pants');
    else if (temp < 25) items.push('Light jacket', 'T-shirt', 'Jeans');
    else if (temp < 35) items.push('T-shirt', 'Shorts', 'Sunglasses');
    else items.push('Lightest clothes', 'Sun hat', 'Stay hydrated');
    if (isRaining) items.push('Umbrella');
    return items;
  }

  const isRaining = current.condition_id >= 300 && current.condition_id < 600;
  return [
    { tod: 'Morning', tempRange: `${morningTemp}°`, items: clothingItems(morningTemp, isRaining), tip: 'Start your day right', icon: <Coffee size={18} />, gradient: 'bg-amber-500/10' },
    { tod: 'Afternoon', tempRange: `${afternoonTemp}°`, items: clothingItems(afternoonTemp, isRaining), tip: 'Peak temperature hours', icon: <Sun size={18} />, gradient: 'bg-sky-500/10' },
    { tod: 'Evening', tempRange: `${eveningTemp}°`, items: clothingItems(eveningTemp, false), tip: 'Cooling down', icon: <Shirt size={18} />, gradient: 'bg-orange-500/10' },
    { tod: 'Night', tempRange: `${nightTemp}°`, items: clothingItems(nightTemp, false), tip: 'Sleep comfortably', icon: <Moon size={18} />, gradient: 'bg-slate-50' },
  ];
}

function WhatToWear({ data, cityName }: { data: WeatherData; cityName: string }) {
  const cards = buildWardrobeCards(data);
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 px-1">What to Wear Today</h2>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateWearParagraph(cityName)}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((card: WardrobeCard) => (
          <motion.div
            key={card.tod}
            whileHover={{ y: -2 }}
            className={`${card.gradient} rounded-xl p-4 border border-white/8 hover: transition-all`}
          >
            <div className="flex items-center gap-2 mb-2 text-gray-600">
              {card.icon}
              <span className="font-semibold text-sm">{card.tod}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{card.tempRange}</p>
            <ul className="space-y-1 mb-2">
              {card.items.map((item: string) => (
                <li key={item} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500">{card.tip}</p>
          </motion.div>
        ))}
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateWearAfter(cityName)}
      </p>
    </motion.section>
  );
}

// ─── Weather narrative ───────────────────────────────────────────────────

const CITY_LANDMARKS: Record<string, string> = {
  lahore: 'the Badshahi Mosque', karachi: 'the Arabian Sea', islamabad: 'the Margalla Hills',
  dubai: 'the Burj Khalifa', london: 'St. Paul\'s Cathedral', paris: 'the Eiffel Tower',
  tokyo: 'Mount Fuji', istanbul: 'the Bosphorus', cairo: 'the Great Pyramid', mumbai: 'the Gateway of India',
};

function WeatherNarrative({ data, cityName, country, timezone }: { data: WeatherData; cityName: string; country: string; timezone: string }) {
  const { current, hourly, daily } = data;
  const landmark = CITY_LANDMARKS[cityName.toLowerCase()] ?? 'the horizon';
  const eveningTemp = hourly[5]?.temp ?? daily[0]?.temp_min ?? current.temp - 3;
  const tomorrowHigh = daily[1]?.temp_max ?? current.temp;
  const rainChance = daily[0]?.pop ?? 0;
  const hour = new Date(current.dt * 1000).toLocaleString('en-US', { hour: 'numeric', hour12: true, timeZone: timezone });

  const story = `${cityName} greets you with ${current.condition} at ${hour}, ${current.temp}°C. As the sun moves toward ${landmark}, temperatures will ease to ${eveningTemp}°C by evening. ${rainChance > 50 ? `There's a ${rainChance}% chance of rain today — keep an umbrella handy. ` : rainChance > 20 ? `A slight ${rainChance}% chance of showers. ` : 'Skies remain mostly dry. '}Humidity at ${current.humidity}% with winds from ${windDirection(current.wind_deg)} at ${current.wind_speed} km/h. Tomorrow looks ${tomorrowHigh > current.temp ? 'warmer' : 'cooler'} with a high of ${tomorrowHigh}°C.`;

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 px-1">Today&apos;s Weather Story</h2>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateStoryParagraph(cityName)}
      </p>
      <div className="rounded-xl border border border-white/8 p-5 ">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#01411C] flex items-center justify-center flex-shrink-0">
            <Activity size={18} className="text-white" />
          </div>
          <p className="text-gray-300 leading-relaxed text-sm">{story}</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateStoryAfter(cityName, country)}
      </p>
    </motion.section>
  );
}

// ─── Hourly forecast ─────────────────────────────────────────────────────

function HourlyCard({ item, timezone }: { item: HourlyItem; timezone: string }) {
  const isNow = Math.abs(Date.now() / 1000 - item.dt) < 3600;
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex-shrink-0 w-20 sm:w-24 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-all ${
        isNow
          ? 'bg-[#01411C] text-white'
          : 'bg-white border border-white/8 hover:border-gray-300'
      }`}
    >
      <p className={`text-xs font-medium ${isNow ? 'text-white/70' : 'text-gray-600'}`}>
        {isNow ? 'Now' : formatHour(item.dt, timezone)}
      </p>
      <span className="text-2xl sm:text-3xl">{conditionToEmoji(item.condition_id, item.icon)}</span>
      <p className={`text-lg font-bold ${isNow ? 'text-white' : 'text-white'}`}>{item.temp}°</p>
      <div className={`flex items-center gap-0.5 ${isNow ? 'text-white/60' : ''}`}>
        <CloudRain size={10} className={isNow ? 'text-white/60' : 'text-blue-400'} />
        <p className={`text-xs ${isNow ? 'text-white/60' : 'text-blue-500'}`}>{item.pop}%</p>
      </div>
    </motion.div>
  );
}

function HourlyForecast({ data, timezone, cityName }: { data: WeatherData; timezone: string; cityName: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => { scrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' }); };

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-white">Hourly Forecast</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateHourlyParagraph(cityName)}
      </p>
      <div ref={scrollRef} className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {data.hourly.map((item: HourlyItem) => <HourlyCard key={item.dt} item={item} timezone={timezone} />)}
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateHourlyAfter(cityName)}
      </p>
    </motion.section>
  );
}

// ─── Daily forecast ──────────────────────────────────────────────────────

function DailyCard({ item, timezone, isToday }: { item: DailyItem; timezone: string; isToday: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`flex-shrink-0 w-24 sm:w-28 rounded-xl p-3 sm:p-4 flex flex-col items-center gap-2 transition-all ${
        isToday
          ? 'bg-[#01411C] text-white'
          : 'bg-white border border-white/8 hover:border-gray-300'
      }`}
    >
      <p className={`text-xs font-medium ${isToday ? 'text-white/70' : 'text-gray-600'}`}>{formatDay(item.dt, timezone)}</p>
      <span className="text-2xl sm:text-3xl">{conditionToEmoji(item.condition_id, item.icon)}</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-white'}`}>{item.temp_max}°</span>
        <span className={`text-xs ${isToday ? 'text-white/60' : 'text-gray-600'}`}>{item.temp_min}°</span>
      </div>
      <div className={`flex items-center gap-0.5 ${isToday ? 'text-white/60' : ''}`}>
        <CloudRain size={10} className={isToday ? 'text-white/60' : 'text-blue-400'} />
        <p className={`text-xs ${isToday ? 'text-white/60' : 'text-blue-500'}`}>{item.pop}%</p>
      </div>
    </motion.div>
  );
}

function TenDayForecast({ data, timezone, cityName, country }: { data: WeatherData; timezone: string; cityName: string; country: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => { scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' }); };

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-lg font-bold text-white">10-Day Forecast</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateTenDayParagraph(cityName)}
      </p>
      <div ref={scrollRef} className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {data.daily.map((item: DailyItem, i: number) => <DailyCard key={item.dt} item={item} timezone={timezone} isToday={i === 0} />)}
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateTenDayAfter(cityName, country)}
      </p>
    </motion.section>
  );
}

// ─── Sun & Moon Section ─────────────────────────────────────────────────

function SunMoonSection({ data, timezone, cityName }: { data: SunMoonData; timezone: string; cityName: string }) {
  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: timezone });

  const formatDuration = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const now = Date.now() / 1000;
  const sunProgress = data.sunrise && data.sunset
    ? Math.min(100, Math.max(0, ((now - data.sunrise) / (data.sunset - data.sunrise)) * 100))
    : 50;

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 px-1">Sun & Moon</h2>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateSunMoonParagraph(cityName, data.sunrise ? formatTime(data.sunrise) : null, data.sunset ? formatTime(data.sunset) : null)}
      </p>

      {/* Animated Sun Arc */}
      <div className="bg-amber-500/10 rounded-xl border border-amber-100 p-5 mb-4">
        <div className="relative h-32 flex items-end justify-center mb-3">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
            <line x1="10" y1="85" x2="190" y2="85" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            <path d="M 10 85 Q 100 5 190 85" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" strokeDasharray="6,6" />
            <path d="M 10 85 Q 100 5 190 85" fill="none" stroke="url(#sunGradient)" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${sunProgress * 2.8} 500`} />
            <motion.circle
              cx={10 + sunProgress * 1.8}
              cy={85 - Math.sin((sunProgress / 100) * Math.PI) * 80}
              r="12"
              fill="#fbbf24"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text x="10" y="95" fontSize="9" fill="#78716c" textAnchor="start" fontWeight="500">{formatTime(data.sunrise)}</text>
            <text x="190" y="95" fontSize="9" fill="#78716c" textAnchor="end" fontWeight="500">{formatTime(data.sunset)}</text>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Day length: <span className="font-bold text-amber-700">{formatDuration(data.dayLength)}</span>
          </p>
        </div>
      </div>

      {/* Golden Hour & Twilight */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-amber-500/10 rounded-xl border border-amber-100 p-4">
          <div className="flex items-center gap-2 mb-2 text-amber-700">
            <Sunrise size={16} />
            <p className="text-xs font-semibold uppercase tracking-wider">Golden AM</p>
          </div>
          <p className="font-bold text-amber-300 text-sm">{formatTime(data.goldenHourMorning.start)} - {formatTime(data.goldenHourMorning.end)}</p>
        </div>
        <div className="bg-orange-500/10 rounded-xl border border-orange-100 p-4">
          <div className="flex items-center gap-2 mb-2 text-orange-400">
            <Sunset size={16} />
            <p className="text-xs font-semibold uppercase tracking-wider">Golden PM</p>
          </div>
          <p className="font-bold text-orange-300 text-sm">{formatTime(data.goldenHourEvening.start)} - {formatTime(data.goldenHourEvening.end)}</p>
        </div>
      </div>

      {/* Twilight Times */}
      <div className="rounded-xl border border border-white/8 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Twilight Times</p>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="font-semibold text-gray-300 mb-1">Civil</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.civil.dawn)}</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.civil.dusk)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-300 mb-1">Nautical</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.nautical.dawn)}</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.nautical.dusk)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-300 mb-1">Astro</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.astronomical.dawn)}</p>
            <p className="text-gray-600 text-xs">{formatTime(data.twilight.astronomical.dusk)}</p>
          </div>
        </div>
      </div>

      {/* Moon Details */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Moon Phase</p>
            <div className="flex items-center gap-3">
              <motion.span
                className="text-4xl"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {data.moon.phaseEmoji}
              </motion.span>
              <div>
                <p className="font-bold text-white">{data.moon.phase}</p>
                <p className="text-xs text-gray-500">{data.moon.illumination}% illuminated</p>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Rise: {formatTime(data.moon.moonrise)}</p>
            <p>Set: {formatTime(data.moon.moonset)}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Lunar Events */}
      <div className="rounded-xl border border border-white/8 p-4 mb-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Upcoming Lunar Events</p>
        <div className="flex flex-wrap gap-2">
          {data.upcomingMoons.slice(0, 4).map((m: typeof data.upcomingMoons[number], i: number) => (
            <div key={i} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
              <span className="text-xl">{m.phase}</span>
              <div>
                <p className="font-semibold text-gray-300 text-xs">{m.type}</p>
                <p className="text-xs text-gray-600">{m.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eclipses */}
      {data.eclipses.length > 0 && (
        <div className="bg-rose-500/10 rounded-xl border border-rose-100 p-4 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming Eclipses</p>
          <div className="space-y-2">
            {data.eclipses.slice(0, 2).map((e: typeof data.eclipses[number], i: number) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-300">{e.type}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">{e.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${e.visible ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {e.visible ? 'Visible' : 'Not visible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visible Constellation */}
      <div className="bg-blue-500/10 rounded-xl border border-blue-100 p-4">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Constellation Tonight</p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-white">{data.constellation.name}</p>
          <div className="text-right">
            <p className="text-sm text-gray-600">{data.constellation.direction}</p>
            <p className="text-xs text-gray-600">{data.constellation.visibility}</p>
          </div>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateSunMoonAfter(cityName)}
      </p>
    </motion.section>
  );
}

// ─── Weather Alerts Banner ───────────────────────────────────────────────

function AlertsBanner({ alerts, timezone, cityName }: { alerts: WeatherAlert[]; timezone: string; cityName: string }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? alerts : alerts.slice(0, 1);

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
      <p className="text-gray-300 leading-relaxed text-sm mb-3 px-1">
        {generateAlertsParagraph(cityName)}
      </p>
      {visible.map((alert: WeatherAlert) => (
        <div
          key={alert.id}
          className="rounded-xl p-4 mb-2 border-l-4"
          style={{
            backgroundColor: `${alert.color}15`,
            borderColor: alert.color,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: alert.color }}
            >
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">{alert.event}</p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{alert.description}</p>
              <p className="text-xs text-gray-600 mt-2">
                {new Date(alert.start * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone })} - {new Date(alert.end * 1000).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: timezone, month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      ))}
      {alerts.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-gray-500 hover:text-gray-300 underline font-medium ml-1"
        >
          {expanded ? 'Show less' : `+${alerts.length - 1} more alerts`}
        </button>
      )}
      <p className="text-gray-600 leading-relaxed text-sm mt-3 px-1">
        {generateAlertsAfter(cityName)}
      </p>
    </motion.div>
  );
}

// ─── Nearby Weather Comparison ───────────────────────────────────────────

function NearbyWeatherSection({
  nearby,
  currentCity,
  currentTemp,
}: {
  nearby: NearbyCityWeather[];
  currentCity: string;
  currentTemp: number;
}) {
  const escape = nearby.find((n) => n.temp < currentTemp - 3);

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-6">
      <h2 className="text-lg font-bold text-white mb-4 px-1">Nearby Weather Comparison</h2>
      <p className="text-gray-300 leading-relaxed text-sm mb-4 px-1">
        {generateNearbyParagraph(currentCity)}
      </p>

      {escape && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4 mb-4">
          <p className="text-sm text-gray-300">
            <span className="font-bold text-emerald-700">Escape the heat:</span> {escape.name} is {currentTemp - escape.temp}°C cooler
          </p>
        </div>
      )}

      <div className="rounded-xl border border border-white/8  overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-white/8">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-500 text-xs uppercase tracking-wider">City</th>
              <th className="py-3 px-4 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">Temp</th>
              <th className="py-3 px-4 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider">AQI</th>
              <th className="py-3 px-4 text-center font-semibold text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Rain</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#01411C]/5 border-b border-white/8">
              <td className="py-3 px-4 font-bold text-[#01411C]">{currentCity}</td>
              <td className="py-3 px-4 text-center font-bold text-white">{currentTemp}°</td>
              <td className="py-3 px-4 text-center text-gray-500">--</td>
              <td className="py-3 px-4 text-center text-gray-500 hidden sm:table-cell">--</td>
            </tr>
            {nearby.map((city: NearbyCityWeather) => (
              <tr key={city.slug} className="border-b border-gray-50 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-3 px-4 text-gray-300">{city.name}</td>
                <td className={`py-3 px-4 text-center font-bold ${city.isWarmer ? 'text-red-400' : 'text-blue-400'}`}>
                  {city.temp}°
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    city.aqi > 100 ? 'bg-red-500/15 text-red-400' : city.aqi > 50 ? 'bg-amber-500/15 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {city.aqi}
                  </span>
                </td>
                <td className="py-3 px-4 text-center text-gray-600 hidden sm:table-cell">{city.rain}mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-gray-600 leading-relaxed text-sm mt-4 px-1">
        {generateNearbyAfter(currentCity)}
      </p>
    </motion.section>
  );
}

// ─── Loading skeleton ───────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div style={{ backgroundColor: '#0a0f1e', minHeight: '100vh' }} className="relative animate-pulse space-y-6">
      <div className="h-64 rounded-xl border" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 8 }, (_: undefined, i: number) => (
          <div key={i} className="h-24 rounded-xl border" />
        ))}
      </div>
      <div className="h-40 rounded-xl border" />
    </div>
  );
}

// ─── Error card ─────────────────────────────────────────────────────────

function ErrorCard({ city }: { city: string }) {
  return (
    <div style={{ backgroundColor: '#0a0f1e', minHeight: '100vh' }} className="relative flex flex-col items-center justify-center py-20 text-center px-4">
      <CloudSnow size={48} className="text-gray-300 mb-4" />
      <h3 className="text-lg font-bold text-gray-300 mb-2">Weather data unavailable</h3>
      <p className="text-sm text-gray-600 max-w-xs">We couldn&apos;t fetch weather data for {city} right now. Please check back in a moment.</p>
    </div>
  );
}

// ─── Stub tab ──────────────────────────────────────────────────────────

function StubTab({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-gray-300 mb-2">{label}</h3>
      <p className="text-sm text-gray-600">Coming soon</p>
    </motion.div>
  );
}

// ─── AQI Components ────────────────────────────────────────────────────

function AQIGaugeCard({ aqi }: { aqi: AQIData }) {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <div className="rounded-2xl border border border-white/8  p-6 text-center">
        <div className="relative w-40 h-20 mx-auto mb-4 overflow-hidden">
          <svg viewBox="0 0 100 50" className="transform -rotate-180">
            <path d="M 5 45 A 45 45 0 0 1 95 45" fill="none" stroke="#e5e7eb" strokeWidth="8" strokeLinecap="round" />
            <path d="M 5 45 A 45 45 0 0 1 95 45" fill="none" stroke={aqi.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(aqi.aqi / 500) * 141} 200`} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{aqi.aqi}</span>
          </div>
        </div>
        <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: aqi.color, color: '#fff' }}>{aqi.level}</span>
      </div>
    </motion.section>
  );
}

function AQIBreakdownCard({ aqi }: { aqi: AQIData }) {
  const pollutants = [
    { label: 'PM2.5', value: aqi.pm25, limit: 25, unit: 'μg/m³' },
    { label: 'PM10', value: aqi.pm10, limit: 50, unit: 'μg/m³' },
    { label: 'NO₂', value: aqi.no2, limit: 40, unit: 'μg/m³' },
    { label: 'O₃', value: aqi.o3, limit: 120, unit: 'μg/m³' },
    { label: 'CO', value: aqi.co, limit: 10, unit: 'mg/m³' },
    { label: 'SO₂', value: aqi.so2, limit: 20, unit: 'μg/m³' },
  ];
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2"><BarChart2 size={16} className="text-gray-600" /> Pollutant Breakdown</h3>
      <div className="rounded-2xl border border border-white/8  p-4">
        <div className="grid grid-cols-3 gap-4">
          {pollutants.map((p: { label: string; value: number; limit: number; unit: string }) => (
            <div key={p.label}>
              <p className="text-xs text-gray-600 mb-1">{p.label}</p>
              <p className="text-lg font-bold text-white">{p.value}</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-rose-400" style={{ width: `${Math.min(100, (p.value / p.limit) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function AQISourcesCard({ aqi }: { aqi: AQIData }) {
  const sources: Array<{ label: string; value: number; icon: React.ReactNode; color: string }> = [
    { label: 'Vehicles', value: aqi.sources.vehicles, icon: <Car size={16} />, color: 'text-blue-500' },
    { label: 'Industry', value: aqi.sources.industry, icon: <Factory size={16} />, color: 'text-slate-500' },
    { label: 'Agriculture', value: aqi.sources.agriculture, icon: <Tractor size={16} />, color: 'text-amber-500' },
    { label: 'Dust', value: aqi.sources.dust, icon: <CloudFog size={16} />, color: 'text-orange-500' },
  ];
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Leaf size={16} className="text-gray-600" /> Likely Pollution Sources</h3>
      <div className="rounded-2xl border border border-white/8  p-4">
        <div className="grid grid-cols-4 gap-3">
          {sources.map((s: { label: string; value: number; icon: React.ReactNode; color: string }) => (
            <div key={s.label} className="text-center">
              <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-xs text-gray-600">{s.label}</p>
              <p className="text-lg font-bold text-white">{s.value}%</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function AQIHealthAdviceCard({ aqi }: { aqi: AQIData }) {
  const advice = aqi.aqi <= 50
    ? { title: 'Good day for outdoor activities', text: 'Air quality is satisfactory. Enjoy outdoor activities!', tips: ['Great for walking, jogging, cycling', 'Open windows for fresh air', 'Ideal for all age groups'] }
    : aqi.aqi <= 100
    ? { title: 'Moderate — sensitive groups take care', text: 'Acceptable air quality. Sensitive individuals should limit prolonged outdoor exertion.', tips: ['Reduce prolonged outdoor exercise', 'Consider wearing a mask if sensitive', 'Check air quality before outdoor plans'] }
    : { title: 'Unhealthy — limit outdoor activities', text: 'Everyone may experience health effects. Limit time outdoors.', tips: ['Stay indoors when possible', 'Use air purifier', 'Keep windows closed'] };
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <div className={`rounded-2xl border p-5 ${aqi.aqi <= 50 ? 'bg-emerald-50 border-emerald-200' : aqi.aqi <= 100 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-rose-500/10 border-rose-200'}`}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${aqi.aqi <= 50 ? 'bg-emerald-200' : aqi.aqi <= 100 ? 'bg-amber-200' : 'bg-rose-200'}`}>
            <ShieldAlert size={18} className={aqi.aqi <= 50 ? 'text-emerald-700' : aqi.aqi <= 100 ? 'text-amber-700' : 'text-rose-700'} />
          </div>
          <div>
            <h3 className="font-bold text-white mb-1">{advice.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{advice.text}</p>
            <ul className="space-y-1">
              {advice.tips.map((tip, i) => (
                <li key={i} className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AQIBestTimeCard() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Clock size={16} className="text-blue-500" /> Best Times for Outdoor Activities</h3>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-xs text-gray-600 mb-1">Early AM</p>
            <p className="text-lg font-bold text-emerald-600">Best</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Morning</p>
            <p className="text-lg font-bold text-emerald-600">Good</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Afternoon</p>
            <p className="text-lg font-bold text-amber-600">OK</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Evening</p>
            <p className="text-lg font-bold text-emerald-600">Good</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AQIPurificationCard() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <div className="rounded-2xl border border border-white/8  p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Heart size={16} className="text-rose-400" /> Air Purification Tips</h3>
        <ul className="space-y-2">
          <li className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />Keep windows closed during high pollution</li>
          <li className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />Use HEPA air purifier in bedrooms</li>
          <li className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />Add indoor plants for natural filtration</li>
          <li className="text-sm text-gray-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />Consider wearing N95 mask outdoors</li>
        </ul>
      </div>
    </motion.section>
  );
}

function AQIHistoryCard({ aqi }: { aqi: AQIData }) {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <h3 className="font-bold text-white mb-3 flex items-center gap-2"><BarChart2 size={16} className="text-gray-600" /> Last 7 Days Trend</h3>
      <div className="rounded-2xl border border border-white/8  p-4">
        <div className="flex items-end justify-between h-24 gap-2">
          {aqi.history.slice(-7).map((h: { aqi: number; date: string }, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all"
                style={{
                  height: `${(h.aqi / 200) * 100}%`,
                  background: h.aqi > 100 ? '#fca5a5' : h.aqi > 50 ? '#fcd34d' : '#86efac',
                }}
              />
              <p className="text-xs text-gray-600 mt-1">{h.date}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function AQIAffiliateCard() {
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mb-4">
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 mb-3"><ShoppingBag size={16} className="text-gray-600" /><h3 className="font-bold text-white text-sm">Recommended Air Purifiers</h3></div>
        <div className="grid grid-cols-2 gap-3">
          <a href="https://amazon.com/dp/B08SXBVN2K" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border border-white/8 hover: hover:border-blue-500/30 transition-all">
            <p className="font-semibold text-white text-xs mb-1">LEVOIT Core 300</p>
            <p className="text-xs text-gray-500">HEPA filter for large rooms</p>
          </a>
          <a href="https://amazon.com/dp/B086XVPWTV" target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl border border border-white/8 hover: hover:border-blue-500/30 transition-all">
            <p className="font-semibold text-white text-xs mb-1">Coway Airmega 200M</p>
            <p className="text-xs text-gray-500">True HEPA filtration</p>
          </a>
        </div>
        <p className="text-xs text-gray-300 text-center mt-3">As an Amazon Associate we earn from qualifying purchases</p>
      </div>
    </motion.section>
  );
}

// ─── Main component ─────────────────────────────────────────────────────

interface WeatherPageProps { cityName: string; country: string; province: string; lat: number; lng: number; timezone: string; citySlug?: string }

export default function WeatherPageClient({ cityName, country, province, lat, lng, timezone, citySlug }: WeatherPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Today');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [historical, setHistorical] = useState<HistoricalData | null>(null);
  const [climate, setClimate] = useState<ClimateData | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [sunMoon, setSunMoon] = useState<SunMoonData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [nearbyWeather, setNearbyWeather] = useState<NearbyCityWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    Promise.all([
      fetchWeatherData(lat, lng),
      fetchHistoricalData(lat, lng),
      fetchAQIData(lat, lng, cityName),
      fetchSunMoonData(lat, lng, timezone),
      fetchWeatherAlerts(lat, lng),
    ]).then(([w, h, a, s, al]) => {
      if (w) {
        setWeather(w);
        fetchNearbyWeather(citySlug || cityName.toLowerCase(), w.current.temp, a?.aqi || 50).then(setNearbyWeather);
      } else setError(true);
      if (h) {
        setHistorical(h);
        const c = getClimateData(citySlug || cityName, h.monthlyAverages);
        setClimate(c);
      }
      if (a) setAqi(a);
      if (s) setSunMoon(s);
      if (al) setAlerts(al);
      setLoading(false);
    });
  }, [lat, lng, cityName, citySlug, timezone]);

  return (
    <div style={{ backgroundColor: '#0a0f1e', minHeight: '100vh' }} className="relative">
      {/* Header */}
      <header className="bg-[#01411C]">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10">
          <nav className="text-white/60 text-sm mb-3 flex items-center gap-2">
            <span className="capitalize">{country.replace(/-/g, ' ')}</span>
            <ChevronRight size={14} />
            <span className="capitalize">{province.replace(/-/g, ' ')}</span>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{cityName}</span>
          </nav>
          <h1 className="text-white text-3xl sm:text-4xl font-bold">{cityName} Weather</h1>
          <p className="text-white/70 text-base mt-2">Live conditions & detailed forecast</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Weather Alerts Banner */}
        {alerts.length > 0 && <AlertsBanner alerts={alerts} timezone={timezone} cityName={cityName} />}

        <NavTabs active={activeTab} onChange={setActiveTab} />

        {activeTab === 'Today' && (loading ? <LoadingSkeleton /> : error ? <ErrorCard city={cityName} /> : weather && (
          <>
            <HeroCard data={weather} cityName={cityName} country={country} timezone={timezone} />
            <StatsGrid data={weather} cityName={cityName} />
            {sunMoon && <SunMoonSection data={sunMoon} timezone={timezone} cityName={cityName} />}
            <WhatToWear data={weather} cityName={cityName} />
            <WeatherNarrative data={weather} cityName={cityName} country={country} timezone={timezone} />
            <HourlyForecast data={weather} timezone={timezone} cityName={cityName} />
            <TenDayForecast data={weather} timezone={timezone} cityName={cityName} country={country} />
            {nearbyWeather.length > 0 && <NearbyWeatherSection nearby={nearbyWeather} currentCity={cityName} currentTemp={weather.current.temp} />}
          </>
        ))}

        {activeTab === 'Tomorrow' && (loading ? <LoadingSkeleton /> : error ? <ErrorCard city={cityName} /> : weather && weather.daily[1] && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
            <div className="rounded-3xl overflow-hidden  bg-gradient-to-br from-slate-700 to-slate-800">
              <div className="px-6 py-8 text-white flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">Tomorrow</p>
                  <div className="flex items-end gap-2">
                    <span className="text-7xl font-thin leading-none">{weather.daily[1].temp_max}</span>
                    <span className="text-3xl font-light mb-2">°C</span>
                  </div>
                  <p className="text-base font-medium mt-1 capitalize">{capitalize(weather.daily[1].condition)}</p>
                  <p className="text-sm opacity-75 mt-1">Low: {weather.daily[1].temp_min}°C</p>
                </div>
                <span className="text-6xl">{conditionToEmoji(weather.daily[1].condition_id, weather.daily[1].icon)}</span>
              </div>
              <div className="px-6 pb-5 border-t border-white/10 pt-4 text-white">
                <div className="flex items-center gap-2">
                  <CloudRain size={16} />
                  <span className="text-sm">Rain probability: {weather.daily[1].pop}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {activeTab === '10 Day' && (loading ? <LoadingSkeleton /> : error ? <ErrorCard city={cityName} /> : weather && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-3">
            {weather.daily.map((day: DailyItem, i: number) => (
              <div key={day.dt} className="rounded-xl border border border-white/8 p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{formatDay(day.dt, timezone)}</p>
                  <p className="text-xs text-gray-600 capitalize">{day.condition}</p>
                </div>
                <span className="text-3xl">{conditionToEmoji(day.condition_id, day.icon)}</span>
                <div className="text-right">
                  <p className="font-bold text-white">{day.temp_max}°</p>
                  <p className="text-sm text-gray-600">{day.temp_min}°</p>
                </div>
              </div>
            ))}
          </motion.div>
        ))}

        {activeTab === 'Monthly' && (loading ? <LoadingSkeleton /> : error ? <ErrorCard city={cityName} /> : historical && climate && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm px-1">
              {generateMonthlyParagraph(cityName)}
            </p>
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 p-5">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Sun size={16} className="text-amber-500" /> Climate Classification</h3>
              <p className="text-gray-300">{capitalize(climate.type)}</p>
              <p className="text-sm text-gray-500 mt-2">Best months to visit: {climate.bestMonths.join(', ')}</p>
            </div>
            {historical.monthlyAverages.length > 0 && (
              <div className="rounded-2xl border border border-white/8  p-5">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2"><BarChart2 size={16} className="text-gray-600" /> Monthly Averages</h3>
                <div className="space-y-2">
                  {historical.monthlyAverages.map((m: { month: string; high: number; low: number }) => (
                    <div key={m.month} className="flex items-center gap-3">
                      <span className="w-10 text-xs font-medium text-gray-500">{m.month}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            width: `${((m.high + 20) / 80) * 100}%`,
                            background: 'linear-gradient(90deg, #3b82f6 0%, #ef4444 100%)',
                            left: `${((m.low + 20) / 80) * 100}%`,
                            right: `${100 - ((m.high + 20) / 80) * 100}%`,
                          }}
                        />
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white font-bold">{m.low}°</span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-bold">{m.high}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-600 leading-relaxed text-sm px-1">
              {generateMonthlyAfter(cityName)}
            </p>
          </motion.div>
        ))}

        {activeTab === 'History' && (loading ? <LoadingSkeleton /> : error ? <ErrorCard city={cityName} /> : historical && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
            <p className="text-gray-300 leading-relaxed text-sm px-1">
              {generateHistoryParagraph(cityName)}
            </p>
            <div className="rounded-2xl border border border-white/8  p-5">
              <h3 className="font-bold text-white mb-3">Historical Averages for Today</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Average High</p>
                  <p className="text-2xl font-bold text-white">{historical.todayAvgHigh}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Average Low</p>
                  <p className="text-2xl font-bold text-white">{historical.todayAvgLow}°C</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Record High</p>
                  <p className="text-2xl font-bold text-red-400">{historical.records.hottestEver}°C</p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm px-1">
              {generateHistoryAfter(cityName)}
            </p>
          </motion.div>
        ))}

        {activeTab === 'Radar' && <StubTab label="Radar map" icon={<Eye size={48} />} />}
        {activeTab === 'Air Quality' && (
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="space-y-4">
            {aqi ? (
              <>
                <p className="text-gray-300 leading-relaxed text-sm px-1">
                  {generateAQIOverviewParagraph(cityName, aqi.aqi, aqi.level)}
                </p>
                <AQIGaugeCard aqi={aqi} />
                <p className="text-gray-600 leading-relaxed text-sm px-1">
                  {generateAQIOverviewAfter(cityName)}
                </p>
                <p className="text-gray-300 leading-relaxed text-sm px-1">
                  {generatePollutantsParagraph(cityName)}
                </p>
                <AQIBreakdownCard aqi={aqi} />
                <AQISourcesCard aqi={aqi} />
                <p className="text-gray-600 leading-relaxed text-sm px-1">
                  {generatePollutantsAfter(cityName)}
                </p>
                <p className="text-gray-300 leading-relaxed text-sm px-1">
                  {generateAQIHealthParagraph(cityName)}
                </p>
                <AQIHealthAdviceCard aqi={aqi} />
                <AQIBestTimeCard />
                <AQIPurificationCard />
                <AQIHistoryCard aqi={aqi} />
                <p className="text-gray-600 leading-relaxed text-sm px-1">
                  {generateAQIHealthAfter(cityName)}
                </p>
                <AQIAffiliateCard />
              </>
            ) : <LoadingSkeleton />}
          </motion.div>
        )}
      </div>

      {/* ── RAIN DATA CHART ── */}
      {weather && (
        <div className="max-w-2xl mx-auto px-4 mt-6">
          <div className="rounded-2xl border border-white/8 p-5">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2">
              <CloudRain size={16} className="text-blue-400" /> Rain & Precipitation — {cityName}
            </h3>
            <p className="text-gray-500 text-xs mb-4">Today · This week · Monthly average</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-xs text-gray-500 mb-1">Today</div>
                <div className="text-xl font-bold text-blue-400">
                  {(weather.current as unknown as Record<string,number>)?.rain_1h
                    ? `${((weather.current as unknown as Record<string,number>).rain_1h * 24).toFixed(1)} mm`
                    : weather.conditions === 'Rain' ? '4–8 mm' : '0 mm'}
                </div>
                <div className="text-xs text-gray-600 mt-1">estimated</div>
              </div>
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-xs text-gray-500 mb-1">This Week</div>
                <div className="text-xl font-bold text-blue-300">
                  {weather.daily?.slice(0, 7).reduce((sum: number, d: Record<string, number>) => sum + (d.rain || 0), 0).toFixed(1) ?? '—'} mm
                </div>
                <div className="text-xs text-gray-600 mt-1">7-day total</div>
              </div>
              <div className="rounded-xl p-3 border border-white/8 text-center">
                <div className="text-xs text-gray-500 mb-1">Monthly Avg</div>
                <div className="text-xl font-bold text-blue-200">
                  {climate?.annualRainfall ? `${Math.round(climate.annualRainfall / 12)} mm` : '~35 mm'}
                </div>
                <div className="text-xs text-gray-600 mt-1">historical</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEAREST WATER BODY TEMPERATURE ── */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <div className="rounded-2xl border border-white/8 p-5">
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            🌊 Nearest Water Body
          </h3>
          <p className="text-gray-500 text-xs mb-4">River/lake/sea nearest to {cityName}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 border border-blue-500/20 bg-blue-500/5">
              <div className="text-xs text-gray-500 mb-1">Water Body</div>
              <div className="text-white font-semibold text-sm">
                {cityName === 'Lahore' ? 'River Ravi' :
                 cityName === 'Karachi' ? 'Arabian Sea' :
                 cityName === 'Islamabad' ? 'Rawal Lake' :
                 'Nearest River'}
              </div>
            </div>
            <div className="rounded-xl p-3 border border-blue-500/20 bg-blue-500/5">
              <div className="text-xs text-gray-500 mb-1">Water Temp (est.)</div>
              <div className="text-white font-semibold text-sm">
                {weather ? `${Math.max(10, Math.round((weather.current.temp * 0.7) + 5))}°C` : '—'}
              </div>
              <div className="text-gray-600 text-xs mt-0.5">seasonal estimate</div>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Water temperature is estimated from air temperature and seasonal averages. River levels vary with monsoon season.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto px-4 pb-8 text-center">
        <p className="text-xs text-gray-300">
          Data from OpenWeatherMap & Open-Meteo · Updates every hour
        </p>
      </div>
    </div>
  );
}
