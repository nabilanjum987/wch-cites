'use client';

import { useEffect, useState } from 'react';

// Live clock island for the golden ocean page — the server renders the
// initial time into the HTML; this island only keeps it ticking.
export default function OceanClock({ timezone, initial }: { timezone: string; initial: string }) {
  const [time, setTime] = useState(initial);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span suppressHydrationWarning className="tabular-nums">
      {time}
    </span>
  );
}
