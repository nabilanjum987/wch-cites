'use client';

import { useEffect, useState } from 'react';

// Live capital-clocks island for the golden continent page: the server
// renders each capital's initial local time into the HTML; this island
// only keeps them ticking (same pattern as OceanClock / WonderClock).
export interface CapitalClockInit {
  city: string;
  country: string;
  timezone: string;
  initial: string;
}

function makeFmt(timezone: string) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

export default function ContinentClocks({ capitals }: { capitals: CapitalClockInit[] }) {
  const [times, setTimes] = useState<string[]>(() => capitals.map((c) => c.initial));

  useEffect(() => {
    const fmts = capitals.map((c) => makeFmt(c.timezone));
    const tick = () => {
      const now = new Date();
      setTimes(fmts.map((f) => f.format(now)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // capitals is a static record array; run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {capitals.map((c, i) => (
        <div key={c.timezone} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="text-sm font-semibold text-white">{c.city}</div>
          <div className="text-xs text-gray-400">{c.country}</div>
          <div suppressHydrationWarning className="mt-1 text-lg font-bold tabular-nums text-amber-300">
            {times[i] ?? c.initial}
          </div>
        </div>
      ))}
    </div>
  );
}
