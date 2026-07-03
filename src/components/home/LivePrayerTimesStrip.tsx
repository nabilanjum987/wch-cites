'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Moon } from 'lucide-react';

const PRAYER_CITIES = [
  { name: 'Mecca',    flag: '🇸🇦', nextPrayer: 'Maghrib', time: '7:02 PM', link: '/saudi-arabia/makkah/mecca/prayer-times' },
  { name: 'Medina',   flag: '🇸🇦', nextPrayer: 'Maghrib', time: '7:08 PM', link: '/saudi-arabia/medina/medina/prayer-times' },
  { name: 'Karachi',  flag: '🇵🇰', nextPrayer: 'Maghrib', time: '7:35 PM', link: '/pakistan/sindh/karachi/prayer-times' },
  { name: 'Lahore',   flag: '🇵🇰', nextPrayer: 'Maghrib', time: '7:38 PM', link: '/pakistan/punjab/lahore/prayer-times' },
  { name: 'Dubai',    flag: '🇦🇪', nextPrayer: 'Maghrib', time: '6:58 PM', link: '/uae/dubai/dubai/prayer-times' },
  { name: 'Istanbul', flag: '🇹🇷', nextPrayer: 'Maghrib', time: '7:15 PM', link: '/turkey/istanbul/istanbul/prayer-times' },
  { name: 'Jakarta',  flag: '🇮🇩', nextPrayer: 'Maghrib', time: '5:58 PM', link: '/indonesia/jakarta/jakarta/prayer-times' },
  { name: 'Cairo',    flag: '🇪🇬', nextPrayer: 'Maghrib', time: '6:45 PM', link: '/egypt/cairo/cairo/prayer-times' },
  { name: 'London',   flag: '🇬🇧', nextPrayer: 'Evening', time: '9:15 PM', link: '/uk/england/london/prayer-times' },
  { name: 'Riyadh',   flag: '🇸🇦', nextPrayer: 'Maghrib', time: '6:55 PM', link: '/saudi-arabia/riyadh/riyadh/prayer-times' },
];

export default function LivePrayerTimesStrip() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    let raf: number;
    const step = () => {
      pos += 0.5;
      const half = track.scrollWidth / 2;
      if (pos >= half) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const doubled = [...PRAYER_CITIES, ...PRAYER_CITIES];

  return (
    <div className="mb-4">
      <div className="overflow-hidden rounded-2xl">
        <div ref={trackRef} className="flex gap-3" style={{ width: 'max-content' }}>
          {doubled.map((city, i) => (
            <Link key={i} href={city.link} className="no-underline flex-shrink-0">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:opacity-80"
                style={{ backgroundColor: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <span className="text-2xl">{city.flag}</span>
                <div>
                  <div className="text-white font-semibold text-sm">{city.name}</div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <Moon size={10} />
                    <span>{city.nextPrayer}: {city.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
