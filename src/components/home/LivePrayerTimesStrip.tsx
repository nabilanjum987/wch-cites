import Link from 'next/link';
import { Moon, ArrowRight } from 'lucide-react';

interface PrayerCity {
  name: string;
  flag: string;
  nextPrayer: string;
  time: string;
  link: string;
}

const PRAYER_CITIES: PrayerCity[] = [
  { name: 'Mecca', flag: '🇸🇦', nextPrayer: 'Maghrib', time: '7:02 PM', link: '/saudi-arabia/makkah/mecca/prayer-times' },
  { name: 'Medina', flag: '🇸🇦', nextPrayer: 'Maghrib', time: '7:08 PM', link: '/saudi-arabia/medina/medina/prayer-times' },
  { name: 'Karachi', flag: '🇵🇰', nextPrayer: 'Maghrib', time: '7:35 PM', link: '/pakistan/sindh/karachi/prayer-times' },
  { name: 'Lahore', flag: '🇵🇰', nextPrayer: 'Maghrib', time: '7:38 PM', link: '/pakistan/punjab/lahore/prayer-times' },
  { name: 'Dubai', flag: '🇦🇪', nextPrayer: 'Maghrib', time: '6:58 PM', link: '/uae/dubai/dubai/prayer-times' },
  { name: 'Istanbul', flag: '🇹🇷', nextPrayer: 'Maghrib', time: '7:15 PM', link: '/turkey/istanbul/istanbul/prayer-times' },
  { name: 'Jakarta', flag: '🇮🇩', nextPrayer: 'Maghrib', time: '5:58 PM', link: '/indonesia/jakarta/jakarta/prayer-times' },
  { name: 'London', flag: '🇬🇧', nextPrayer: 'Evening', time: '9:15 PM', link: '/uk/england/london/prayer-times' },
];

export default function LivePrayerTimesStrip() {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">Live Prayer Times</h2>
        </div>
        <Link href="/prayer-times">
          <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
            <span>Find prayer times for your city</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {PRAYER_CITIES.map((city) => (
          <Link key={city.name} href={city.link}>
            <button className="min-w-[180px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30 hover:border-emerald-400/50 transition-all flex-shrink-0 hover:scale-105">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl">{city.flag}</span>
                <span className="font-semibold text-white">{city.name}</span>
              </div>
              <div className="text-emerald-400 font-bold text-lg">{city.nextPrayer}</div>
              <div className="text-gray-400 text-sm">{city.time}</div>
            </button>
          </Link>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
