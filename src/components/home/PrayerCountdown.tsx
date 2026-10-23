'use client';

// Live countdown to the next Lahore prayer for the fact-cards row.
// The target instant comes from the server (Aladhan via getMyCityData);
// this leaf only counts down to it — it computes no prayer times itself.

import { useEffect, useState } from 'react';

export default function PrayerCountdown({ atMs }: { atMs: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, Math.floor((atMs - now) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  const label = diff === 0 ? 'now' : `in ${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return <span className="tabular-nums">{label}</span>;
}
