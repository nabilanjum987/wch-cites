'use client'
import { useEffect, useState } from 'react';

// Live ticker — every value is fetched from a free, keyless API at
// runtime (CoinGecko, Alternative.me Fear & Greed, Open-Meteo, Aladhan).
// Truth rule: an item appears only when its real value loaded. If an API
// fails, the ticker shows less — it never falls back to invented numbers,
// and the LIVE label is shown only when live market data actually loaded.

interface TickerCity { name: string; flag: string; lat: number; lon: number }

const TEMP_CITIES: TickerCity[] = [
  { name: 'Lahore', flag: '🇵🇰', lat: 31.5497, lon: 74.3436 },
  { name: 'Dubai', flag: '🇦🇪', lat: 25.2048, lon: 55.2708 },
  { name: 'Mecca', flag: '🇸🇦', lat: 21.4225, lon: 39.8262 },
  { name: 'London', flag: '🇬🇧', lat: 51.5074, lon: -0.1278 },
];

const PRAYER_CITIES = [
  { name: 'Lahore', lat: 31.5497, lon: 74.3436 },
  { name: 'Mecca', lat: 21.4225, lon: 39.8262 },
];

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌧️';
}

function fmtCountdown(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Next prayer + countdown for a city, computed in the city's own timezone
// from today's real Aladhan timings. Returns null when nothing is ahead
// today or the API failed.
async function nextPrayer(city: { name: string; lat: number; lon: number }): Promise<string | null> {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const data = await fetchJson(
      `https://api.aladhan.com/v1/timings/${ts}?latitude=${city.lat}&longitude=${city.lon}&method=1`
    );
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
        return `🕌 ${city.name} ${name} in ${fmtCountdown(at.getTime() - nowLocal.getTime())}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export default function TickerBar() {
  const [items, setItems] = useState<string[]>([
    'WorldCityHub', 'Every City · Every Culture · Every Day',
  ]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const out: string[] = [];
      let hasLiveMarket = false;

      const [cg, fng, temps, prayers] = await Promise.allSettled([
        fetchJson('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,pax-gold,tether&vs_currencies=usd,pkr&include_24hr_change=true'),
        fetchJson('https://api.alternative.me/fng/?limit=1'),
        Promise.allSettled(TEMP_CITIES.map(c =>
          fetchJson(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code`)
        )),
        Promise.allSettled(PRAYER_CITIES.map(nextPrayer)),
      ]);

      if (cg.status === 'fulfilled') {
        const btc = cg.value?.bitcoin;
        const gold = cg.value?.['pax-gold'];
        const usdt = cg.value?.tether;
        if (gold?.usd) {
          hasLiveMarket = true;
          const arrow = (gold.usd_24h_change ?? 0) >= 0 ? '▲' : '▼';
          out.push(`🥇 Gold $${Math.round(gold.usd).toLocaleString()}/oz ${arrow}`);
        }
        if (btc?.usd) {
          hasLiveMarket = true;
          const arrow = (btc.usd_24h_change ?? 0) >= 0 ? '▲' : '▼';
          out.push(`₿ BTC $${Math.round(btc.usd).toLocaleString()} ${arrow}`);
        }
        if (usdt?.pkr) out.push(`💵 USD/PKR ${usdt.pkr.toFixed(2)}`);
      }

      if (temps.status === 'fulfilled') {
        temps.value.forEach((r, i) => {
          if (r.status === 'fulfilled') {
            const cur = r.value?.current;
            if (cur && typeof cur.temperature_2m === 'number') {
              const c = TEMP_CITIES[i];
              out.push(`${c.flag} ${c.name} ${Math.round(cur.temperature_2m)}°C ${weatherEmoji(cur.weather_code ?? 3)}`);
            }
          }
        });
      }

      if (prayers.status === 'fulfilled') {
        prayers.value.forEach(r => {
          if (r.status === 'fulfilled' && r.value) out.push(r.value);
        });
      }

      if (fng.status === 'fulfilled') {
        const f = fng.value?.data?.[0];
        if (f?.value) out.push(`📈 Fear & Greed: ${f.value} ${f.value_classification ?? ''}`.trim());
      }

      if (!cancelled && out.length > 0) {
        setItems([hasLiveMarket ? '🔴 LIVE' : 'WorldCityHub', ...out]);
      }
    };

    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  const doubled = [...items, ...items];
  return (
    <div className="w-full bg-[#0a0f1e] border-b border-[#6366f1]/20 overflow-hidden h-7 flex items-center">
      <div style={{ display: 'flex', width: 'max-content', animation: 'tickerScroll 50s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} className={`text-xs px-3 whitespace-nowrap ${item.includes('LIVE') ? 'text-red-400 font-bold' : item.includes('▲') ? 'text-emerald-400' : item.includes('▼') ? 'text-red-400' : item.includes('🕌') ? 'text-indigo-400' : 'text-slate-300'}`}>
            {item}
            <span className="text-white/20 pl-6">│</span>
          </span>
        ))}
      </div>
      <style jsx>{`@keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}
