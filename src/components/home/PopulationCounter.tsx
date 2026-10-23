'use client';

// World Population counter (§12) — ticks client-side from the World
// Bank anchor the server computed (latest actual total + the Bank's
// published growth rate). The panel labels it an estimate, per spec.

import { useEffect, useState } from 'react';

export default function PopulationCounter({ base, perSecond, at }: { base: number; perSecond: number; at: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const est = Math.round(base + perSecond * ((now - at) / 1000));
  return <span className="tabular-nums">{est.toLocaleString('en-US')}</span>;
}
