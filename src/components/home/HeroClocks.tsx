'use client';

// Hero — "World Time Right Now" (WP2 Slice 3 / Q3, frozen spec §3).
// Six flag-coloured clocks (London, Dubai, Karachi, New York, Tokyo,
// Sydney), ticking every second, plus the visitor's own BIG clock when
// he opts in via the "My Location" button (never forced on load).
// Polish Card 4 (2026-10-23): each clock also carries its country's
// REAL flag as a small chip under the dial (flag artwork is public
// domain). The flag-colour ring is unchanged.
// Billi audit fix (2026-10-23): the six flag files are VENDORED
// locally in public/images/flags/ and referenced same-origin — no
// remote hotlink from this component.
// Owner izafa (2026-10-23): each clock card ALSO carries its own
// country's flag as a soft backdrop (vendored file at 50% opacity
// under a dark scrim); the chip and the dial are unchanged.
// Link rule (link map §3 + L1): a clock links to its city page if the
// city is published, else to its country page ONLY when that page
// renders real content. Verified live 2026-10-22: Karachi city page
// real; /united-states real (21,958 visible chars); /united-kingdom,
// /united-arab-emirates, /japan and /australia are ~600-char shells —
// so London, Dubai, Tokyo and Sydney clocks render WITHOUT links
// until those country pages pass the QA gate.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useVisitorCity } from './useVisitorCity';

interface ClockDef {
  name: string;
  tz: string;
  code: string; // ISO 3166-1 alpha-2, lowercase — selects the vendored flag file
  country: string;
  primary: string; // flag colour used for ring + hands
  href: string | null;
}

const CLOCKS: ClockDef[] = [
  { name: 'London', tz: 'Europe/London', code: 'gb', country: 'United Kingdom', primary: '#4f7ddf', href: null },
  { name: 'Dubai', tz: 'Asia/Dubai', code: 'ae', country: 'United Arab Emirates', primary: '#00a651', href: null },
  { name: 'Karachi', tz: 'Asia/Karachi', code: 'pk', country: 'Pakistan', primary: '#14a44d', href: '/pakistan/sindh/karachi' },
  { name: 'New York', tz: 'America/New_York', code: 'us', country: 'United States', primary: '#e05260', href: '/united-states' },
  { name: 'Tokyo', tz: 'Asia/Tokyo', code: 'jp', country: 'Japan', primary: '#e0576b', href: null },
  { name: 'Sydney', tz: 'Australia/Sydney', code: 'au', country: 'Australia', primary: '#f5c542', href: null },
];

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function parts(now: Date, tz: string) {
  const str24 = now.toLocaleTimeString('en-US', { timeZone: tz, hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const [h, m, s] = str24.split(':').map(Number);
  const str12 = now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' });
  return { h: Number.isFinite(h) ? h : 0, m: m || 0, s: s || 0, str12, date };
}

function AnalogClock({ now, tz, color, size }: { now: Date; tz: string; color: string; size: number }) {
  const { h, m, s } = parts(now, tz);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const end = (angle: number, len: number) => ({ x: cx + len * Math.cos(toRad(angle)), y: cy + len * Math.sin(toRad(angle)) });
  const hE = end(((h % 12) + m / 60) * 30 - 90, r * 0.5);
  const mE = end((m + s / 60) * 6 - 90, r * 0.72);
  const sE = end(s * 6 - 90, r * 0.85);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Clock for ${tz}`}>
      <circle cx={cx} cy={cy} r={r} fill="var(--card)" stroke={color} strokeWidth="2" />
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        return (
          <line key={i}
            x1={cx + (r - 5) * Math.cos(a)} y1={cy + (r - 5) * Math.sin(a)}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="var(--text-25)" strokeWidth="1.5" />
        );
      })}
      <line x1={cx} y1={cy} x2={hE.x} y2={hE.y} stroke={color} strokeWidth="3.5" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={mE.x} y2={mE.y} stroke="var(--text)" strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={sE.x} y2={sE.y} stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3.5" fill={color} />
    </svg>
  );
}

function ClockFace({ now, def, size }: { now: Date; def: ClockDef; size: number }) {
  const { str12, date } = parts(now, def.tz);
  const inner = (
    <div className="relative overflow-hidden rounded-2xl px-2 py-3">
      {/* Flag backdrop (owner izafa): this clock's own country flag —
          the vendored file at 50% opacity, object-cover, decorative.
          Scrim over it: linear-gradient(180deg, rgba(8,12,24,0.55),
          rgba(8,12,24,0.74)) — the hero's own dark tones, so the dial,
          hands and labels keep exactly their previous contrast. The
          card is an always-dark island (its scrim is fixed dark in
          both themes, like Ticker 2's emerald band), so its labels
          keep their white classes; the dial itself stays tokenised
          (var(--card) / var(--text) inside AnalogClock). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/images/flags/${def.code}.png`} alt="" aria-hidden="true" width={160} height={107} loading="lazy" decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-50" />
      <div aria-hidden="true" className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(8,12,24,0.55), rgba(8,12,24,0.74))' }} />
      <div className="relative flex flex-col items-center gap-2">
        <AnalogClock now={now} tz={def.tz} color={def.primary} size={size} />
        <div className="text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/images/flags/${def.code}.png`} alt={`Flag of ${def.country}`} width={36} height={24} loading="lazy" decoding="async"
            className="mx-auto h-6 w-9 rounded-[4px] object-cover shadow ring-1 ring-white/25" />
          <div className="text-white font-bold text-sm mt-1.5">{def.name}</div>
          <div className="text-white/80 font-mono text-sm">{str12}</div>
          <div className="text-white/40 text-xs">{date}</div>
        </div>
      </div>
    </div>
  );
  return def.href ? (
    <Link href={def.href} className="no-underline hover:opacity-90 transition-opacity">{inner}</Link>
  ) : (
    <div>{inner}</div>
  );
}

export default function HeroClocks() {
  const now = useNow();
  const { visitor, locating, unavailable, request } = useVisitorCity();

  return (
    <div className="w-full">
      {/* Visitor's BIG clock — opt-in only */}
      <div className="mb-10 flex flex-col items-center">
        {visitor ? (
          <>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] t-cyan mb-3">
              Your time{visitor.source === 'ip' ? ' · approximate, from your connection' : ''}
            </div>
            <AnalogClock now={now} tz={visitor.tz} color="#22d3ee" size={168} />
            <div className="mt-3 text-center">
              <div className="t-text font-bold text-2xl">{visitor.name}</div>
              <div className="t-text-90 font-mono text-xl">{parts(now, visitor.tz).str12}</div>
              <div className="t-text-40 text-sm">{parts(now, visitor.tz).date}</div>
            </div>
          </>
        ) : (
          <div className="text-center">
            <button
              onClick={request}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-full bg-cyan-500/90 hover:bg-cyan-400 disabled:opacity-60 px-6 py-3 text-sm font-semibold t-onbrand transition-colors"
            >
              <MapPin className="w-4 h-4" />
              {locating ? 'Finding your city…' : 'My Location'}
            </button>
            <p className="sub-desc mt-2">
              {unavailable
                ? 'Location is unavailable right now — the world clocks below are all yours.'
                : 'See your own city as the big clock. Location stays on your device — never saved.'}
            </p>
          </div>
        )}
      </div>

      {/* The six world clocks */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 max-w-3xl mx-auto">
        {CLOCKS.map((def) => (
          <ClockFace key={def.name} now={now} def={def} size={84} />
        ))}
      </div>
      <p className="sub-desc mt-6 text-center max-w-xl mx-auto">
        Six cities. Six time zones. One planet turning — somewhere on earth it is already tomorrow.
      </p>
    </div>
  );
}
