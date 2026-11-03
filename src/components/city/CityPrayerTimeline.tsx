'use client';

// CityPrayerTimeline — the city main page's ONE prayer representation.
// A timeline of today's prayers in order: prayers already offered are
// dimmed and marked "Passed", the NEXT prayer is highlighted and carries
// a live countdown. Times come from the same Aladhan timings object the
// page already fetched; nothing is fetched or invented here.
//
// Hydration: the server passes `serverNowIso` (its render instant). The
// first client render computes state from that same instant, so server
// and client HTML agree; an interval then takes over with the live clock.

import { useEffect, useMemo, useState } from 'react';

export interface PrayerTimelineEntry {
  name: string;
  /** Raw Aladhan time, e.g. "05:12" or "05:12 (PKT)". */
  time: string;
  emoji: string;
}

interface Props {
  entries: PrayerTimelineEntry[];
  /** IANA timezone of the city, e.g. "Asia/Karachi". */
  timezone: string;
  /** ISO instant of the server render, for a hydration-safe first paint. */
  serverNowIso: string;
}

function parseMinutes(raw: string): number | null {
  const m = raw.match(/(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function cleanTime(raw: string): string {
  const mins = parseMinutes(raw);
  if (mins === null) return raw;
  const h = Math.floor(mins / 60);
  const min = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

/** Seconds since midnight in the city's timezone for an instant. */
function secondsInTimezone(instantMs: number, timezone: string): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date(instantMs));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return (get('hour') % 24) * 3600 + get('minute') * 60 + get('second');
}

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds < 60) return 'in under a minute';
  const totalMinutes = Math.floor(totalSeconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h <= 0) return `in ${m}m`;
  return `in ${h}h ${String(m).padStart(2, '0')}m`;
}

export default function CityPrayerTimeline({ entries, timezone, serverNowIso }: Props) {
  const serverNowMs = useMemo(() => new Date(serverNowIso).getTime(), [serverNowIso]);
  const [nowMs, setNowMs] = useState<number>(serverNowMs);

  useEffect(() => {
    setNowMs(Date.now());
    const id = setInterval(() => setNowMs(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const parsed = useMemo(
    () =>
      entries
        .map((e) => ({ ...e, minutes: parseMinutes(e.time), display: cleanTime(e.time) }))
        .filter((e) => e.minutes !== null)
        .sort((a, b) => (a.minutes as number) - (b.minutes as number)),
    [entries]
  );

  if (parsed.length === 0) return null;

  const nowSeconds = secondsInTimezone(nowMs, timezone);
  const nowMinutes = Math.floor(nowSeconds / 60);

  // Next prayer: the first one still ahead today; after Isha it is
  // tomorrow's first prayer and the countdown wraps past midnight.
  let nextIdx = parsed.findIndex((e) => (e.minutes as number) > nowMinutes);
  const wrapsToTomorrow = nextIdx === -1;
  if (wrapsToTomorrow) nextIdx = 0;
  const next = parsed[nextIdx];
  const nextAtSeconds = (next.minutes as number) * 60 + (wrapsToTomorrow ? 86400 : 0);
  const countdown = formatCountdown(Math.max(0, nextAtSeconds - nowSeconds));

  return (
    <div className="mb-6">
      <div className="flex gap-3 flex-wrap">
        {parsed.map((p, i) => {
          const isNext = i === nextIdx;
          const isPassed = !wrapsToTomorrow && (p.minutes as number) <= nowMinutes;
          return (
            <div
              key={p.name}
              className="rounded-xl p-3 text-center min-w-[92px] flex-1 border"
              style={{
                backgroundColor: isNext ? 'rgba(12,122,61,0.28)' : 'rgba(255,255,255,0.05)',
                borderColor: isNext ? 'rgba(52,211,153,0.8)' : 'rgba(12,122,61,0.25)',
                opacity: isPassed ? 0.45 : 1,
              }}
            >
              <div className="text-lg">{p.emoji}</div>
              <div className="font-mono font-semibold text-sm" style={{ color: '#34d399' }}>
                {p.display}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{p.name}</div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wide mt-1"
                style={{ color: isNext ? '#34d399' : '#6b7280' }}
              >
                {isNext ? 'Next' : isPassed ? 'Passed' : ' '}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm" style={{ color: '#34d399' }} role="status">
        Next prayer: <strong>{next.name}</strong> at {next.display}
        {wrapsToTomorrow ? ' tomorrow' : ''}, {countdown}.
      </p>
    </div>
  );
}
