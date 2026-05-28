import { useEffect, useState } from 'react';
import { Globe, Moon, TrendingUp, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GlobalStats {
  cityCount: number;
  nextMeccaPrayer: { name: string; time: string };
  goldPrice: { price: number; change: number };
  hottestCity: { name: string; temp: number; country: string };
}

export default function LiveGlobalStats() {
  const [stats, setStats] = useState<GlobalStats>({
    cityCount: 0,
    nextMeccaPrayer: { name: 'Maghrib', time: '2h 15m' },
    goldPrice: { price: 2351, change: 0.3 },
    hottestCity: { name: 'Multan', temp: 42, country: 'PK' }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count } = await supabase
        .from('cities')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      setStats(prev => ({
        ...prev,
        cityCount: count || 10247
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-pulse">
            <div className="h-12 w-12 bg-white/20 rounded-full mb-4"></div>
            <div className="h-4 w-20 bg-white/20 rounded mb-2"></div>
            <div className="h-6 w-32 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const getCountryFlag = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      <div className="bg-gradient-to-br from-teal-500/20 to-teal-600/20 backdrop-blur-sm rounded-2xl p-6 border border-teal-400/30 hover:border-teal-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-teal-500/20 rounded-full p-3">
            <Globe className="w-6 h-6 text-teal-400" />
          </div>
          <span className="text-teal-400 text-3xl">🌍</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Cities</div>
        <div className="text-white text-2xl font-bold">{formatNumber(stats.cityCount)}+ cities covered</div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-emerald-500/20 rounded-full p-3">
            <Moon className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-emerald-400 text-3xl">🕌</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Prayer</div>
        <div className="text-white text-lg font-bold">
          Next Mecca prayer: <span className="text-emerald-400">{stats.nextMeccaPrayer.name}</span>
        </div>
        <div className="text-gray-300 text-sm">in {stats.nextMeccaPrayer.time}</div>
      </div>

      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-yellow-500/20 rounded-full p-3">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
          </div>
          <span className="text-yellow-400 text-3xl">💰</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Gold</div>
        <div className="text-white text-2xl font-bold">
          ${stats.goldPrice.price.toLocaleString()}/oz
        </div>
        <div className={`flex items-center text-sm ${stats.goldPrice.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {stats.goldPrice.change >= 0 ? (
            <ArrowUp className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-1" />
          )}
          {stats.goldPrice.change >= 0 ? '+' : ''}{stats.goldPrice.change}%
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30 hover:border-red-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-red-500/20 rounded-full p-3">
            <Thermometer className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-red-400 text-3xl">🌡️</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Hottest</div>
        <div className="text-white text-2xl font-bold flex items-center">
          {stats.hottestCity.name} {getCountryFlag(stats.hottestCity.country)} <span className="text-red-400 ml-2">{stats.hottestCity.temp}°C</span>
          <span className="ml-2 text-xl">🔴</span>
        </div>
      </div>
    </div>
  );
}
