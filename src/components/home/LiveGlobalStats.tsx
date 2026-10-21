'use client';
import { useEffect, useState } from 'react';
import { Globe, Moon, TrendingUp, Thermometer, ArrowUp, ArrowDown } from 'lucide-react';
import { getSupabase } from '../../lib/supabase';

interface GlobalStats {
  cityCount: number | null;
  nextMeccaPrayer: { name: string; time: string } | null;
  goldPrice: { price: number; change: number } | null;
  hottestCity: { name: string; temp: number; country: string } | null;
}

export default function LiveGlobalStats() {
  // Every card starts empty and is filled only by a real API response.
  // Truth rule: no invented fallback numbers — a card whose data failed
  // to load says so in words instead of showing a made-up value.
  const [stats, setStats] = useState<GlobalStats>({
    cityCount: null,
    nextMeccaPrayer: null,
    goldPrice: null,
    hottestCity: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const supabase = getSupabase();
      const fetchJson = async (url: string) => {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      };
      const meccaNextPrayer = async () => {
        const ts = Math.floor(Date.now() / 1000);
        const data = await fetchJson(`https://api.aladhan.com/v1/timings/${ts}?latitude=21.4225&longitude=39.8262&method=1`);
        const timings = data?.data?.timings;
        const tz = data?.data?.meta?.timezone;
        if (!timings || !tz) return null;
        const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: tz }));
        for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
          const raw: string | undefined = timings[name];
          if (!raw) continue;
          const [hh, mm] = raw.split(' ')[0].split(':').map(Number);
          const at = new Date(nowLocal);
          at.setHours(hh, mm, 0, 0);
          if (at.getTime() > nowLocal.getTime()) {
            const mins = Math.round((at.getTime() - nowLocal.getTime()) / 60000);
            const h = Math.floor(mins / 60);
            return { name, time: h > 0 ? `${h}h ${mins % 60}m` : `${mins}m` };
          }
        }
        return null;
      };
      const hottest = async () => {
        const candidates = [
          { name: 'Lahore', lat: 31.5497, lon: 74.3436 },
          { name: 'Karachi', lat: 24.8607, lon: 67.0011 },
          { name: 'Multan', lat: 30.1575, lon: 71.5249 },
          { name: 'Jacobabad', lat: 28.2769, lon: 68.4314 },
          { name: 'Islamabad', lat: 33.6844, lon: 73.0479 },
        ];
        const results = await Promise.allSettled(candidates.map(c =>
          fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m`)
        ));
        let best: { name: string; temp: number; country: string } | null = null;
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            const t = r.value?.current?.temperature_2m;
            if (typeof t === 'number' && (!best || t > best.temp)) {
              best = { name: candidates[i].name, temp: Math.round(t), country: 'PK' };
            }
          }
        });
        return best;
      };

      const [countRes, cgRes, prayerRes, hotRes] = await Promise.allSettled([
        supabase.from('cities').select('*', { count: 'exact', head: true }),
        fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd&include_24hr_change=true'),
        meccaNextPrayer(),
        hottest(),
      ]);

      setStats({
        cityCount: countRes.status === 'fulfilled' ? (countRes.value.count ?? null) : null,
        goldPrice: cgRes.status === 'fulfilled' && cgRes.value?.['pax-gold']?.usd
          ? { price: Math.round(cgRes.value['pax-gold'].usd), change: Math.round((cgRes.value['pax-gold'].usd_24h_change ?? 0) * 10) / 10 }
          : null,
        nextMeccaPrayer: prayerRes.status === 'fulfilled' ? prayerRes.value : null,
        hottestCity: hotRes.status === 'fulfilled' ? hotRes.value : null,
      });
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
        <div className="text-white text-2xl font-bold">{stats.cityCount != null ? `${formatNumber(stats.cityCount)} cities live` : 'New cities weekly'}</div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-6 border border-emerald-400/30 hover:border-emerald-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-emerald-500/20 rounded-full p-3">
            <Moon className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-emerald-400 text-3xl">🕌</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Prayer</div>
        {stats.nextMeccaPrayer ? (
          <>
            <div className="text-white text-lg font-bold">
              Next Mecca prayer: <span className="text-emerald-400">{stats.nextMeccaPrayer.name}</span>
            </div>
            <div className="text-gray-300 text-sm">in {stats.nextMeccaPrayer.time}</div>
          </>
        ) : (
          <div className="text-white text-lg font-bold">Live prayer times on every city page</div>
        )}
      </div>

      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-yellow-500/20 rounded-full p-3">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
          </div>
          <span className="text-yellow-400 text-3xl">💰</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Gold</div>
        {stats.goldPrice ? (
          <>
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
          </>
        ) : (
          <div className="text-white text-lg font-bold">Live gold rates on the Rates page</div>
        )}
      </div>

      <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-red-400/30 hover:border-red-400/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="bg-red-500/20 rounded-full p-3">
            <Thermometer className="w-6 h-6 text-red-400" />
          </div>
          <span className="text-red-400 text-3xl">🌡️</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">Hottest</div>
        {stats.hottestCity ? (
          <div className="text-white text-2xl font-bold flex items-center">
            {stats.hottestCity.name} {getCountryFlag(stats.hottestCity.country)} <span className="text-red-400 ml-2">{stats.hottestCity.temp}°C</span>
          </div>
        ) : (
          <div className="text-white text-lg font-bold">Live weather on every city page</div>
        )}
      </div>
    </div>
  );
}
