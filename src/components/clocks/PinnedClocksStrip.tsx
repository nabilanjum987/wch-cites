'use client';

// Pinned clocks strip (feat/pin-clock): the clocks a visitor pinned
// on this device, rendered live with the chosen design applied, each
// with an unpin control. Renders NOTHING when no clock is pinned, so
// hosts can drop it in unconditionally. Two shapes from one source:
//   · variant "section" — a centred wrap of mini cards (hero clocks
//     section, under the six world clocks)
//   · variant "panel" — a compact vertical list (the My City side
//     panel, in both its invitation and revealed states)
// Pins live only in localStorage (store.ts); nothing is sent anywhere.

import Link from 'next/link';
import { Pin, X } from 'lucide-react';
import type { PinnedClock } from './clock-data';
import { getDesign } from './designs';
import { unpin, useClockDesignId, usePinnedClocks } from './store';
import AnalogClock, { clockParts, useNow } from './AnalogClock';

function MiniClock({ clock, size }: { clock: PinnedClock; size: number }) {
  const now = useNow();
  const design = getDesign(useClockDesignId());
  const { str12, date } = clockParts(now, clock.tz);
  const ring = design.ring ?? clock.primary;
  return (
    <div className="t-force-dark relative overflow-hidden rounded-2xl px-3 py-3">
      {design.flagCode && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/flags/${design.flagCode}.png`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(8,12,24,0.55), rgba(8,12,24,0.78))' }}
          />
        </>
      )}
      <button
        type="button"
        onClick={() => unpin(clock.id)}
        aria-label={`Unpin ${clock.name}`}
        title={`Unpin ${clock.name}`}
        className="absolute right-1.5 top-1.5 z-10 rounded-full bg-black/40 p-1 text-white/70 transition-colors hover:bg-black/70 hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="relative flex flex-col items-center gap-1.5">
        <AnalogClock now={now} tz={clock.tz} color={ring} size={size} />
        <div className="text-center">
          <div className="text-sm font-bold text-white">{clock.name}</div>
          <div className="font-mono text-sm text-white/80">{str12}</div>
          <div className="text-xs text-white/40">{date}</div>
        </div>
      </div>
    </div>
  );
}

export default function PinnedClocksStrip({ variant = 'section' }: { variant?: 'section' | 'panel' }) {
  const pins = usePinnedClocks();
  if (pins.length === 0) return null;

  if (variant === 'panel') {
    return (
      <div className="mt-6 border-t t-border-5 pt-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] t-cyan">
          <Pin className="h-3.5 w-3.5" /> Your pinned clocks
        </div>
        <div className="grid grid-cols-2 gap-3">
          {pins.map((p) => (
            <MiniClock key={p.id} clock={p} size={56} />
          ))}
        </div>
        <p className="sub-desc mt-3">
          Pinned on this device only.{' '}
          <Link href="/clock-widgets" className="t-link font-medium">
            Take a clock to your own website →
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <div className="mb-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] t-cyan">
        <Pin className="h-3.5 w-3.5" /> Your pinned clocks
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {pins.map((p) => (
          <div key={p.id} className="w-[132px]">
            <MiniClock clock={p} size={72} />
          </div>
        ))}
      </div>
      <p className="sub-desc mt-3 text-center">
        Kept on this device, in your browser, nothing is saved on our side.
      </p>
    </div>
  );
}
