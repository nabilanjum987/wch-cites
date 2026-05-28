'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  dominant: string;
}

const AQI_LEVELS = [
  { max: 50, label: 'Good', color: '#22c55e', bg: 'bg-green-500' },
  { max: 100, label: 'Moderate', color: '#eab308', bg: 'bg-yellow-500' },
  { max: 150, label: 'Unhealthy for Sensitive', color: '#f97316', bg: 'bg-orange-500' },
  { max: 200, label: 'Unhealthy', color: '#ef4444', bg: 'bg-red-500' },
  { max: 300, label: 'Very Unhealthy', color: '#a855f7', bg: 'bg-purple-500' },
  { max: 500, label: 'Hazardous', color: '#7f1d1d', bg: 'bg-red-900' },
];

const PURIFICATION_PLANTS = [
  { name: 'Snake Plant', emoji: '🌿', benefit: 'Removes formaldehyde, benzene' },
  { name: 'Peace Lily', emoji: '🌸', benefit: 'Filters VOCs, mold spores' },
  { name: 'Spider Plant', emoji: '🌱', benefit: 'Absorbs carbon monoxide' },
  { name: 'Aloe Vera', emoji: '🌵', benefit: 'Clears benzene & formaldehyde' },
  { name: 'Boston Fern', emoji: '蕨', benefit: 'Natural air humidifier' },
];

async function fetchAQI(cityName: string): Promise<AQIData | null> {
  try {
    const response = await fetch(
      `https://api.openaq.org/v2/latest?city=${encodeURIComponent(cityName)}&limit=1`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    const result = data.results[0];
    const pm25Param = result.measurements.find(
      (m: { parameter: string }) => m.parameter === 'pm25'
    );
    const pm10Param = result.measurements.find(
      (m: { parameter: string }) => m.parameter === 'pm10'
    );

    const aqi = pm25Param?.value ? calculateAQI(pm25Param.value) : 0;

    return {
      aqi,
      pm25: pm25Param?.value || 0,
      pm10: pm10Param?.value || 0,
      dominant: 'PM2.5',
    };
  } catch {
    return null;
  }
}

function calculateAQI(pm25: number): number {
  return Math.min(500, Math.max(0, Math.round(pm25 * 4)));
}

function getAQILevel(aqi: number) {
  return AQI_LEVELS.find((level) => aqi <= level.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

function getHealthAdvice(aqi: number, group: string): string {
  const level = getAQILevel(aqi);

  if (group === 'children') {
    if (aqi <= 50) return 'Safe for outdoor play';
    if (aqi <= 100) return 'Limit prolonged outdoor activity';
    if (aqi <= 150) return 'Reduce outdoor exertion';
    return 'Stay indoors, use air purifier';
  }

  if (group === 'elderly') {
    if (aqi <= 50) return 'Safe for daily activities';
    if (aqi <= 100) return 'Monitor breathing outdoors';
    if (aqi <= 150) return 'Minimize outdoor time';
    return 'Remain indoors, keep medications handy';
  }

  if (group === 'athletes') {
    if (aqi <= 50) return 'Good conditions for training';
    if (aqi <= 100) return 'Reduce intensity by 20%';
    if (aqi <= 150) return 'Train early morning or indoors';
    return 'Indoor training only';
  }

  if (aqi <= 50) return 'Air quality is satisfactory';
  if (aqi <= 100) return 'Acceptable for most people';
  if (aqi <= 150) return 'Sensitive groups may experience effects';
  return 'Health alert: everyone may experience effects';
}

function getBestTimeOutdoors(aqi: number, temp: number): string {
  if (aqi <= 50) {
    if (temp >= 15 && temp <= 25) return 'All day - perfect conditions';
    if (temp > 30) return 'Early morning (6-8 AM)';
    return 'Mid-morning (9-11 AM)';
  }

  if (aqi <= 100) {
    return 'Early morning (6-8 AM) or late evening (7-9 PM)';
  }

  if (aqi <= 150) {
    return 'Very early morning (5-7 AM) only';
  }

  return 'Avoid outdoor activities today';
}

export function AirQuality({ city }: { city: City }) {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await fetchAQI(city.name);
      setAqiData(data);
      setLoading(false);
    }
    load();
  }, [city.name]);

  const aqi = aqiData?.aqi || 45;
  const level = getAQILevel(aqi);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🌬️</span>
        Air Quality Index
      </h2>

      {loading ? (
        <div className="bg-gray-50 rounded-lg p-8 animate-pulse h-48"></div>
      ) : !aqiData ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-3xl mb-2">🌡️</p>
          <p>Air quality data not available</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-6 mb-6">
            <motion.div
              className="relative w-32 h-32 rounded-full flex items-center justify-center"
              style={{ backgroundColor: level.color + '20' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="absolute inset-2 rounded-full flex items-center justify-center"
                style={{ backgroundColor: level.color + '40' }}
              >
                <div className="text-center">
                  <span
                    className="text-4xl font-bold"
                    style={{ color: level.color }}
                  >
                    {aqi}
                  </span>
                  <p className="text-xs text-gray-600 mt-1">{level.label}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PM2.5</span>
                <span className="font-medium">{aqiData.pm25.toFixed(1)} µg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PM10</span>
                <span className="font-medium">{aqiData.pm10.toFixed(1)} µg/m³</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dominant Pollutant</span>
                <span className="font-medium">{aqiData.dominant}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="h-4 rounded-full bg-gray-100 overflow-hidden flex">
              {AQI_LEVELS.map((l, idx) => (
                <div
                  key={idx}
                  className="flex-1 h-full relative"
                  style={{ backgroundColor: l.color }}
                >
                  {aqi >= (AQI_LEVELS[idx - 1]?.max || 0) &&
                    aqi <= l.max && (
                    <div
                      className="absolute w-1 h-6 bg-white -top-1 rounded shadow-md"
                      style={{ left: `${((aqi - (AQI_LEVELS[idx - 1]?.max || 0)) / (l.max - (AQI_LEVELS[idx - 1]?.max || 0))) * 100}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>Good</span>
              <span>Moderate</span>
              <span>Unhealthy</span>
              <span>Hazardous</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { group: 'children', icon: '👨‍👧' },
              { group: 'elderly', icon: '👴' },
              { group: 'athletes', icon: '🏃' },
              { group: 'general', icon: '👤' },
            ].map(({ group, icon }) => (
              <div
                key={group}
                className="bg-gray-50 rounded-lg p-3 text-center"
              >
                <span className="text-2xl">{icon}</span>
                <p className="text-xs font-medium text-gray-600 capitalize mt-1">
                  {group}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {getHealthAdvice(aqi, group)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-emerald-700">
              <span className="font-bold">Best time outdoors today: </span>
              {getBestTimeOutdoors(aqi, 25)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Indoor Plants That Purify Air
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {PURIFICATION_PLANTS.map((plant) => (
                <div
                  key={plant.name}
                  className="flex-shrink-0 bg-green-50 rounded-lg p-3 border border-green-200 min-w-[140px]"
                >
                  <span className="text-2xl">{plant.emoji}</span>
                  <p className="text-sm font-medium text-green-900 mt-1">
                    {plant.name}
                  </p>
                  <p className="text-xs text-green-700 mt-0.5">{plant.benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
}
