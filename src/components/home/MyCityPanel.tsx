'use client';

// My City panel view (WP2 Slice 4 / Q4, frozen spec §4).
// Panel = trailer, city page = film: glanceable figures only, no ads,
// every figure clicks through to its city subpage. Initial data is
// fetched SERVER-side for the default city (Lahore) and arrives as
// props, so the figures are in the server HTML. If the visitor opted
// in to location earlier (hero), the panel quietly switches to his
// nearest PUBLISHED city and refetches that city's figures client-side
// from the same keyless APIs; a small note says the city was chosen
// from his location. Clock + prayer countdown tick every second.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CloudSun, Moon, Sunrise, Sunset, Coins, Newspaper, ArrowRight, MapPin } from 'lucide-react';
import type { MyCityData } from '@/lib/home-mycity';
import { useVisitorCity, nearestPublished } from './useVisitorCity';

interface Meta {
  name: string; province: string; provinceSlug: string; lat: number; lng: number; tz: string;
  population: number | null; famousFor: string | null; capitalFact: string | null;
}

const WMO: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 71: 'Light snow', 73: 'Snow',
  75: 'Heavy snow', 80: 'Rain showers', 81: 'Rain showers', 82: 'Violent showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

async function jget(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

const fmt12 = (raw: string | undefined): string | null => {
  if (!raw) return null;
  const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
  if (!Number.isFinite(hh)) return null;
  const h12 = ((hh + 11) % 12) + 1;
  return `${h12}:${String(mi).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`;
};

async function fetchCityClient(slug: string, meta: Meta, moonPhase: string): Promise<MyCityData> {
  const path = `/pakistan/${meta.provinceSlug}/${slug}`;
  const now = new Date();
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const key = process.env.NEXT_PUBLIC_GNEWS_KEY ?? '';
  const [w, al, cg, silver, news] = await Promise.all([
    jget(`https://api.open-meteo.com/v1/forecast?latitude=${meta.lat}&longitude=${meta.lng}&current=temperature_2m,apparent_temperature,weather_code`),
    jget(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${now.getUTCFullYear()}?latitude=${meta.lat}&longitude=${meta.lng}&method=1`),
    jget('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=pkr'),
    jget('https://api.gold-api.com/price/XAG'),
    key ? jget(`https://gnews.io/api/v4/search?q=${encodeURIComponent(meta.name)}&lang=en&max=2&sortby=publishedAt&apikey=${key}`) : Promise.resolve(null),
  ]);
  const temp = w?.current?.temperature_2m;
  const timings = al?.data?.timings;
  const hijriRaw = al?.data?.date?.hijri;
  let nextPrayer: MyCityData['nextPrayer'] = null;
  if (timings) {
    const nowLocal = new Date(new Date().toLocaleString('en-US', { timeZone: meta.tz }));
    for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
      const raw: string | undefined = timings[name];
      if (!raw) continue;
      const [hh, mi] = raw.split(' ')[0].split(':').map(Number);
      const at = new Date(nowLocal);
      at.setHours(hh, mi, 0, 0);
      if (at.getTime() > nowLocal.getTime()) {
        nextPrayer = { name, time: fmt12(raw) ?? raw, atMs: Date.now() + (at.getTime() - nowLocal.getTime()) };
        break;
      }
    }
  }
  let dayLength: string | null = null;
  if (timings?.Sunrise && timings?.Sunset) {
    const [sh, sm] = timings.Sunrise.split(' ')[0].split(':').map(Number);
    const [eh, em] = timings.Sunset.split(' ')[0].split(':').map(Number);
    const mins = eh * 60 + em - (sh * 60 + sm);
    if (mins > 0) dayLength = `${Math.floor(mins / 60)}h ${mins % 60}m of daylight`;
  }
  const facts: string[] = [];
  if (meta.population) facts.push(`${meta.name} is home to about ${(meta.population / 1e6).toFixed(1)} million people.`);
  if (meta.famousFor) facts.push(`${meta.name} is famous for ${meta.famousFor.toLowerCase()}.`);
  if (meta.capitalFact) facts.push(meta.capitalFact + '.');
  if (typeof w?.elevation === 'number') facts.push(`${meta.name} sits ${Math.round(w.elevation)} metres above sea level, at ${meta.lat.toFixed(2)}°N, ${meta.lng.toFixed(2)}°E.`);
  if (dayLength) facts.push(`Today ${meta.name} gets ${dayLength}.`);
  const pkr = cg?.['pax-gold']?.pkr;
  return {
    slug, name: meta.name, province: meta.province, country: 'Pakistan', path,
    color: '#01411C', tz: meta.tz,
    weather: typeof temp === 'number' ? { temp: Math.round(temp), feels: Math.round(w.current.apparent_temperature ?? temp), condition: WMO[w.current.weather_code] ?? '' } : null,
    nextPrayer,
    goldTola: typeof pkr === 'number' ? Math.round((pkr * 11.6638) / 31.1035) : null,
    silverOz: typeof silver?.price === 'number' ? Math.round(silver.price * 100) / 100 : null,
    sunrise: fmt12(timings?.Sunrise), sunset: fmt12(timings?.Sunset), dayLength,
    hijri: hijriRaw ? `${hijriRaw.day} ${hijriRaw.month?.en ?? ''} ${hijriRaw.year} AH` : null,
    moonPhase,
    facts,
    headlines: Array.isArray(news?.articles) ? news.articles.map((a: any) => a.title).filter(Boolean).slice(0, 2) : [],
    image: null,
  };
}

export default function MyCityPanel({ initial, metas }: { initial: MyCityData; metas: Record<string, Meta> }) {
  const [data, setData] = useState<MyCityData>(initial);
  const [substituted, setSubstituted] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [factIdx, setFactIdx] = useState(0);
  const { visitor } = useVisitorCity();

  useEffect(() => {
    const t = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (data.facts.length < 2) return;
    const t = setInterval(() => setFactIdx((i) => (i + 1) % data.facts.length), 8000);
    return () => clearInterval(t);
  }, [data.facts.length]);

  useEffect(() => {
    if (!visitor || visitor.lat == null || visitor.lng == null) return;
    const list = Object.entries(metas).map(([slug, m]) => ({ slug, lat: m.lat, lng: m.lng }));
    const near = nearestPublished(visitor.lat, visitor.lng, list);
    if (near && near !== data.slug) {
      fetchCityClient(near, metas[near], data.moonPhase).then((d) => {
        setData(d);
        setSubstituted(true);
        setFactIdx(0);
      }).catch(() => { /* keep the default city silently */ });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitor]);

  const localTime = useMemo(
    () => new Date(nowMs).toLocaleTimeString('en-US', { timeZone: data.tz, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
    [nowMs, data.tz],
  );
  const gregorian = useMemo(
    () => new Date(nowMs).toLocaleDateString('en-US', { timeZone: data.tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    [nowMs, data.tz],
  );
  const countdown = useMemo(() => {
    if (!data.nextPrayer) return null;
    const diff = Math.max(0, data.nextPrayer.atMs - nowMs);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  }, [data.nextPrayer, nowMs]);

  const openSearch = () => {
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Search cities and countries"]');
    if (input) {
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => input.focus(), 450);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const card = 'rounded-xl bg-white/5 border border-white/10 px-4 py-3 block hover:border-white/25 transition-colors no-underline';

  return (
    <section className="py-14 px-4 lg:py-6" style={{ backgroundColor: '#080c18' }} aria-label="My City">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl overflow-hidden border border-white/10" style={{ background: `linear-gradient(135deg, ${data.color}33, #0a0f1e 55%)` }}>
          {data.image && (
            <figure className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.image.url} alt={data.image.alt} className="w-full h-52 md:h-64 lg:h-36 object-cover" loading="lazy" />
              <figcaption className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[11px] px-2.5 py-1 rounded-tl-lg">
                {data.image.credit}
              </figcaption>
            </figure>
          )}
          <div className="p-6 md:p-8 lg:p-5">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 lg:flex-col lg:items-start lg:gap-1">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300 mb-1">
                  My City{substituted ? ' · chosen from your location' : ''}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-2xl font-bold text-white">
                  {data.name} <span className="text-white/50 text-xl font-medium">· {data.country}</span>
                </h2>
                <p className="text-white/50 text-sm mt-1">{gregorian}{data.hijri ? ` · ${data.hijri}` : ''}</p>
              </div>
              <div className="text-right lg:text-left">
                <div className="text-white font-mono text-2xl md:text-3xl lg:text-xl font-semibold">{localTime}</div>
                <div className="text-white/40 text-xs">local time in {data.name}</div>
              </div>
            </div>

            {/* Block 1 — Right now */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 mb-3">
              {data.weather && (
                <Link href={`${data.path}/weather`} className={card}>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-1"><CloudSun className="w-4 h-4" /> Weather now</div>
                  <div className="text-white font-bold text-xl">{data.weather.temp}°C · {data.weather.condition}</div>
                  <div className="text-white/50 text-sm">Feels like {data.weather.feels}°C</div>
                </Link>
              )}
              {data.nextPrayer && (
                <Link href={`${data.path}/prayer-times`} className={card}>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-1"><Moon className="w-4 h-4" /> Next prayer</div>
                  <div className="text-white font-bold text-xl">{data.nextPrayer.name} · {data.nextPrayer.time}</div>
                  <div className="text-emerald-300 text-sm font-medium">{countdown ? `in ${countdown}` : ''}</div>
                </Link>
              )}
              {data.goldTola != null && (
                <Link href={`${data.path}/rates`} className={card}>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-1"><Coins className="w-4 h-4" /> Gold in {data.name}</div>
                  <div className="text-white font-bold text-xl">Rs {data.goldTola.toLocaleString('en-US')} <span className="text-sm font-medium text-white/60">/ tola</span></div>
                  <div className="text-white/50 text-sm">{data.silverOz != null ? `Silver $${data.silverOz.toFixed(2)} / oz` : ''}</div>
                </Link>
              )}
            </div>

            {/* Block 2 — Today */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 mb-3">
              {(data.sunrise || data.sunset) && (
                <Link href={`${data.path}/weather`} className={card}>
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-1"><Sunrise className="w-4 h-4" /> Sun today</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2 flex-wrap">
                    <span>↑ {data.sunrise}</span><span className="text-white/30">·</span>
                    <span className="flex items-center gap-1"><Sunset className="w-3.5 h-3.5" /> {data.sunset}</span>
                  </div>
                  <div className="text-white/50 text-sm">{data.dayLength}</div>
                </Link>
              )}
              <div className={`${card} cursor-default`}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-1"><Moon className="w-4 h-4" /> Moon tonight</div>
                <div className="text-white font-semibold text-sm">{data.moonPhase}</div>
                <div className="text-white/50 text-sm">phase of the moon, worldwide</div>
              </div>
              {data.facts.length > 0 && (
                <div className={`${card} cursor-default`}>
                  <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-1">Did you know</div>
                  <div className="text-white font-medium text-sm leading-snug">{data.facts[factIdx % data.facts.length]}</div>
                </div>
              )}
            </div>

            {/* Block 3 — City voice */}
            {data.headlines.length > 0 && (
              <Link href={`${data.path}/news`} className={`${card} mb-6`}>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-2"><Newspaper className="w-4 h-4" /> {data.name} is talking about</div>
                <ul className="space-y-1.5">
                  {data.headlines.map((h, i) => (
                    <li key={i} className="text-white/90 text-sm font-medium leading-snug">• {h}</li>
                  ))}
                </ul>
              </Link>
            )}

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href={data.path}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/90 hover:bg-emerald-400 px-6 py-3 text-sm font-semibold text-white transition-colors no-underline">
                Full {data.name} Page <ArrowRight className="w-4 h-4" />
              </Link>
              <button onClick={openSearch} className="inline-flex items-center gap-1.5 text-sm text-cyan-300 hover:text-cyan-200 font-medium">
                <MapPin className="w-4 h-4" /> Change city
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
