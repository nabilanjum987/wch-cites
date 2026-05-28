'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function LiveClock({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return <span className="font-mono text-lg">{time || '--:--:--'}</span>;
}

export function CityHeader({ city }: { city: City }) {
  const darkerColor = darkenColor(city.primary_color, 15);
  const gradientStyle = {
    background: `linear-gradient(135deg, ${city.primary_color} 0%, ${darkerColor} 15%)`,
  };

  return (
    <motion.header
      className="w-full text-white py-8 px-4"
      style={gradientStyle}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <nav className="text-xs opacity-75 mb-2">
            <span>{city.country}</span>
            <span className="mx-1">/</span>
            <span>{city.province}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{city.name}</h1>
          <p className="text-sm italic opacity-80 mt-1">
            {city.province}, {city.country}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span className="text-xs opacity-75 uppercase tracking-wider">Local Time</span>
          <LiveClock timezone={city.timezone} />
        </div>
      </div>
    </motion.header>
  );
}
