import { useEffect, useState } from 'react';
import { Clock, Sun, Moon, Cloud, Droplets } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TickerItem {
  city: string;
  localTime: string;
  weather: string;
  temperature: number;
  humidity: number;
  isDay: boolean;
}

export default function TickerBar() {
  const [tickerData, setTickerData] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const popularCities = ['London', 'New York', 'Tokyo', 'Dubai', 'Lahore'];

  useEffect(() => {
    fetchTickerData();
  }, []);

  const fetchTickerData = async () => {
    try {
      const { data: cities } = await supabase
        .from('cities')
        .select('name, timezone')
        .in('name', popularCities);

      if (cities) {
        const tickerItems: TickerItem[] = cities.map(city => {
          const now = new Date();
          const localTime = now.toLocaleTimeString('en-US', {
            timeZone: city.timezone || 'UTC',
            hour: '2-digit',
            minute: '2-digit'
          });

          const hour = parseInt(now.toLocaleTimeString('en-US', {
            timeZone: city.timezone || 'UTC',
            hour12: false
          }).split(':')[0]);

          return {
            city: city.name,
            localTime,
            weather: 'Clear',
            temperature: Math.floor(20 + Math.random() * 15),
            humidity: Math.floor(40 + Math.random() * 30),
            isDay: hour >= 6 && hour < 18
          };
        });
        setTickerData(tickerItems);
      }
    } catch (error) {
      console.error('Error fetching ticker data:', error);
      setTickerData(popularCities.map(city => ({
        city,
        localTime: '--:--',
        weather: 'Clear',
        temperature: 25,
        humidity: 50,
        isDay: true
      })));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900 text-white py-2 overflow-hidden">
        <div className="flex items-center space-x-8 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-3 px-4">
              <div className="h-4 w-20 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden border-b border-slate-800">
      <div className="flex animate-scroll">
        {[...tickerData, ...tickerData].map((item, index) => (
          <div
            key={`${item.city}-${index}`}
            className="flex items-center space-x-6 px-8 whitespace-nowrap"
          >
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-gray-200">{item.city}:</span>
              <span className="text-white">{item.localTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              {item.isDay ? (
                <Sun className="w-4 h-4 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-300" />
              )}
              <span className="text-gray-300">{item.temperature}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cloud className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400">{item.weather}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">{item.humidity}%</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
