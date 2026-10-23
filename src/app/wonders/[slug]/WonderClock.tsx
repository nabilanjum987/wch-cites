'use client';

import { useEffect, useState } from 'react';

// Live local-time island for the golden wonder page. The server renders
// the initial time (so it is present in the raw HTML); this island only
// keeps it ticking. The timezone is the site's stored IANA zone.
export default function WonderClock({ timezone, initial }: { timezone: string; initial: string }) {
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
