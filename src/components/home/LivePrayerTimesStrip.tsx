import { useEffect, useState } from 'react';
import { Moon, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PrayerCity {
  name: string;
  city_slug: string;
  country_code: string;
  nextPrayer: string;
  countdown: string;
}

const prayerCities = ['mecca', 'medina', 'karachi', 'lahore', 'dubai', 'istanbul', 'jakarta', 'london'];

const getCountryFlag = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const getPrayerTime = (cityName: string): { prayer: string; countdown: string } => {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const baseMinutes = hour * 60 + minute;

  const prayerTimes = [5 * 60 + 30, 12 * 60 + 15, 15 * 60 + 45, 18 * 60 + 20, 19 * 60 + 50];
  const cityOffset = cityName.length * 7;

  for (let i = 0; i < prayerTimes.length; i++) {
    const prayerMinutes = (prayerTimes[i] + cityOffset) % (24 * 60);
    const diff = prayerMinutes - baseMinutes;

    if (diff > 0) {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return {
        prayer: prayers[i],
        countdown: hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
      };
    }
  }

  const nextPrayerMinutes = prayerTimes[0] + 24 * 60 - baseMinutes;
  const h = Math.floor(nextPrayerMinutes / 60);
  const m = nextPrayerMinutes % 60;
  return {
    prayer: prayers[0],
    countdown: h > 0 ? `${h}h ${m}m` : `${m}m`
  };
};

export default function LivePrayerTimesStrip() {
  const [cities, setCities] = useState<PrayerCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setTime] = useState(new Date());

  useEffect(() => {
    fetchCities();
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('name, city_slug, country_code')
        .in('city_slug', prayerCities)
        .eq('is_active', true);

      if (!error && data) {
        const sortedCities = prayerCities
          .map(slug => {
            const city = data.find(c => c.city_slug === slug);
            if (!city) return null;

            const { prayer, countdown } = getPrayerTime(city.name);
            return {
              name: city.name,
              city_slug: city.city_slug,
              country_code: city.country_code,
              nextPrayer: prayer,
              countdown
            };
          })
          .filter(Boolean) as PrayerCity[];

        setCities(sortedCities);
      }
    } catch (error) {
      console.error('Error fetching prayer cities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Moon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Live Prayer Times</h2>
          </div>
        </div>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="min-w-[180px] animate-pulse bg-white/10 rounded-xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-2xl font-bold text-white">Live Prayer Times</h2>
        </div>
        <button className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
          <span>Find prayer times for your city</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {cities.map((city) => (
          <button
            key={city.city_slug}
            className="min-w-[180px] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-400/30 hover:border-emerald-400/50 transition-all flex-shrink-0"
          >
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{getCountryFlag(city.country_code)}</span>
              <span className="font-semibold text-white">{city.name}</span>
            </div>
            <div className="text-emerald-400 font-bold text-lg">{city.nextPrayer}</div>
            <div className="text-gray-400 text-sm">in {city.countdown}</div>
          </button>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
