import Link from 'next/link';
import { Sunrise, Thermometer, Snowflake, CalendarDays } from 'lucide-react';
import { getTodaysWorld } from '@/lib/home-today';

// Today's World (WP2 Slice 5 / Q5, frozen spec §5) — SERVER component.
// Every line is computed at render time from live Open-Meteo data
// across a 16-city world sample; the event line appears only when a
// real public holiday falls today in a sampled country (nager.at).
// Lines link inward only where the target city is published.

export default async function TodaysWorld() {
  const d = await getTodaysWorld().catch(() => null);
  if (!d || (!d.sunrise && !d.hottest && !d.coldest)) {
    return (
      <p className="sub-desc">
        The world sample is unreachable right now, so this panel shows nothing rather than yesterday's numbers.
      </p>
    );
  }

  const line = 'flex items-start gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3';
  const wrap = (href: string | null, inner: React.ReactNode, key: string) =>
    href ? (
      <Link key={key} href={href} className={`${line} hover:border-white/25 transition-colors no-underline`}>{inner}</Link>
    ) : (
      <div key={key} className={line}>{inner}</div>
    );

  const lines: React.ReactNode[] = [];
  if (d.sunrise) {
    lines.push(wrap(d.sunrise.city.href, (
      <>
        <Sunrise className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-semibold text-sm">First sunrise — {d.sunrise.city.name}, {d.sunrise.city.country}</div>
          <div className="sub-desc">The sun rises there next, at {d.sunrise.localTime} local (in about {d.sunrise.inHours}h).</div>
        </div>
      </>
    ), 'sunrise'));
  }
  if (d.hottest) {
    lines.push(wrap(d.hottest.city.href, (
      <>
        <Thermometer className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-semibold text-sm">Hottest right now — {d.hottest.city.name}, {d.hottest.city.country}</div>
          <div className="sub-desc">{d.hottest.temp}°C at the latest reading in our world sample.</div>
        </div>
      </>
    ), 'hot'));
  }
  if (d.coldest) {
    lines.push(wrap(d.coldest.city.href, (
      <>
        <Snowflake className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-semibold text-sm">Coldest right now — {d.coldest.city.name}, {d.coldest.city.country}</div>
          <div className="sub-desc">{d.coldest.temp}°C at the latest reading in our world sample.</div>
        </div>
      </>
    ), 'cold'));
  }
  if (d.event) {
    lines.push(wrap(d.event.href, (
      <>
        <CalendarDays className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
        <div>
          <div className="text-white font-semibold text-sm">Today in {d.event.country} — {d.event.name}</div>
          <div className="sub-desc">A public holiday today in {d.event.country}.</div>
        </div>
      </>
    ), 'event'));
  }

  return <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{lines}</div>;
}
