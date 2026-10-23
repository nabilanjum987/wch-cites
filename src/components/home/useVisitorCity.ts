'use client';

// Shared visitor-city state (WP2 Slice 3 / Q3) — used by the hero's
// big clock now and by the My City panel next. OPT-IN ONLY: nothing
// here runs until the visitor presses the "My Location" button.
// Trust rule (frozen spec): location stays on his device, never saved
// on any server. The resolved city is kept in localStorage on THIS
// device only; coordinates are never transmitted anywhere by us.
// Fallback chain: browser geolocation → IP approximation (ipwho.is,
// keyless) → nothing (no big clock, no error shown).
// ipapi.co was the first-choice IP endpoint but is rate-limited from
// our network (verified 2026-10-22); ipwho.is responds correctly.

import { useEffect, useState } from 'react';

export interface VisitorCity {
  name: string;
  tz: string;
  lat: number | null;
  lng: number | null;
  source: 'geo' | 'ip';
}

const KEY = 'wch-visitor-city-v1';
let cache: VisitorCity | null | undefined; // undefined = not yet read
const listeners = new Set<() => void>();

function readCache(): VisitorCity | null {
  if (cache !== undefined) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as VisitorCity) : null;
  } catch {
    cache = null;
  }
  return cache;
}

function save(v: VisitorCity | null) {
  cache = v;
  try {
    if (v) window.localStorage.setItem(KEY, JSON.stringify(v));
    else window.localStorage.removeItem(KEY);
  } catch { /* storage unavailable — session-only */ }
  listeners.forEach((fn) => fn());
}

function cityFromTimezone(tz: string): string {
  const seg = tz.split('/').pop() || '';
  return seg.replace(/_/g, ' ');
}

async function fromIp(): Promise<VisitorCity | null> {
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const d = await res.json();
    if (!d?.success || !d?.city || !d?.timezone?.id) return null;
    return {
      name: String(d.city),
      tz: String(d.timezone.id),
      lat: typeof d.latitude === 'number' ? d.latitude : null,
      lng: typeof d.longitude === 'number' ? d.longitude : null,
      source: 'ip',
    };
  } catch {
    return null;
  }
}

export function useVisitorCity() {
  const [visitor, setVisitor] = useState<VisitorCity | null>(null);
  const [locating, setLocating] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setVisitor(readCache());
    const fn = () => setVisitor(readCache());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const request = async () => {
    const existing = readCache();
    if (existing) { setVisitor(existing); return; }
    setLocating(true);
    const finish = (v: VisitorCity | null) => {
      setLocating(false);
      if (v) { save(v); setVisitor(v); }
      else setUnavailable(true);
    };
    if (!('geolocation' in navigator)) {
      finish(await fromIp());
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        finish({
          name: cityFromTimezone(tz),
          tz,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: 'geo',
        });
      },
      async () => { finish(await fromIp()); },
      { timeout: 8000, maximumAge: 600000 },
    );
  };

  return { visitor, locating, unavailable, request };
}

// Nearest PUBLISHED city to the visitor (for the My City panel's quiet
// substitution). Distances in km, haversine.
export function nearestPublished(
  lat: number, lng: number,
  cities: readonly { slug: string; lat: number; lng: number }[],
): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const c of cities) {
    const dLat = ((c.lat - lat) * Math.PI) / 180;
    const dLng = ((c.lng - lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat * Math.PI) / 180) * Math.cos((c.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const d = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (d < bestD) { bestD = d; best = c.slug; }
  }
  return best;
}
