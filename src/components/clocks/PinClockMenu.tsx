'use client';

// "Pin / Take this clock" — the labelled button + menu on every hero
// clock (owner's settled shape, 3 Nov): icon AND text, never a hidden
// icon. The menu carries the four settled destinations:
//   · Pin on this site (device-local, see store.ts)
//   · Add to Home Screen (real beforeinstallprompt where the platform
//     offers one; the platform's manual steps where it does not)
//   · Embed on your website (the Free Clock Widgets page, preselected
//     to this clock, where the copyable snippet lives)
//   · Choose design (applies to the pinned clocks + future embeds)
// After the FIRST pin on a device, one small confirmation toast
// points at the home-screen and embed options (FirstPinToast below).

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Code2, Palette, Pin, PinOff, Smartphone, X } from 'lucide-react';
import type { PinnedClock } from './clock-data';
import { CLOCK_DESIGNS, getDesign } from './designs';
import {
  FIRST_PIN_EVENT, claimFirstPinWelcome, isPinned, setClockDesignId,
  togglePin, useClockDesignId, usePinnedClocks,
} from './store';
import { isIOSDevice, promptInstall, useCanInstall } from './install';

const OPEN_EVENT = 'wch:pin-menu-open';

export default function PinClockMenu({ clock, compact = false }: { clock: PinnedClock; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [showDesigns, setShowDesigns] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [installNote, setInstallNote] = useState<string | null>(null);
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const pins = usePinnedClocks();
  const designId = useClockDesignId();
  const canInstall = useCanInstall();
  const pinned = isPinned(pins, clock.id);

  // Only one pin menu open at a time, across every clock on the page.
  useEffect(() => {
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== uid) setOpen(false);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [uid]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open ]);

  const toggleOpen = () => {
    if (!open) window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: uid }));
    setOpen(!open);
    setShowDesigns(false);
    setShowSteps(false);
    setInstallNote(null);
  };

  const onPin = () => {
    const result = togglePin(clock);
    if (result === 'pinned') {
      claimFirstPinWelcome();
      setOpen(false);
    }
  };

  const onInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === 'accepted') {
      setInstallNote('Added. WorldCityHub is on its way to your home screen.');
      setShowSteps(false);
    } else if (outcome === 'dismissed') {
      setInstallNote('No problem, the option stays here whenever you want it.');
      setShowSteps(false);
    } else {
      // No native prompt on this browser: show the honest manual steps.
      setInstallNote(null);
      setShowSteps(true);
    }
  };

  const itemCls =
    'flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm t-text-90 hover:bg-white/10 transition-colors';

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-semibold transition-colors ${
          pinned
            ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
            : 'border-white/25 bg-black/30 text-white hover:bg-black/50'
        } ${compact ? 'text-[11px]' : 'text-xs'}`}
      >
        {pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
        {pinned ? 'Pinned' : 'Pin / Take this clock'}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          {/* Click-away layer */}
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 cursor-default bg-transparent"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="t-force-dark absolute left-1/2 top-full z-40 mt-2 w-64 max-w-[82vw] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-[#0c1226] shadow-2xl"
          >
            <button type="button" role="menuitem" onClick={onPin} className={itemCls}>
              {pinned ? <PinOff className="h-4 w-4 shrink-0 text-cyan-300" /> : <Pin className="h-4 w-4 shrink-0 text-cyan-300" />}
              <span>
                {pinned ? `Unpin ${clock.name}` : `Pin ${clock.name} on this site`}
                <span className="block text-xs text-white/50">
                  {pinned ? 'Remove it from your pinned clocks' : 'Keep it in your pinned clocks, on this device'}
                </span>
              </span>
            </button>

            <button type="button" role="menuitem" onClick={onInstall} className={itemCls}>
              <Smartphone className="h-4 w-4 shrink-0 text-cyan-300" />
              <span>
                Add to Home Screen
                <span className="block text-xs text-white/50">
                  {canInstall ? 'Your browser can add it right now' : 'WorldCityHub, one tap from your home screen'}
                </span>
              </span>
            </button>
            {installNote && <p className="px-3.5 pb-2 text-xs leading-relaxed text-cyan-200">{installNote}</p>}
            {showSteps && (
              <div className="px-3.5 pb-3 text-xs leading-relaxed text-white/70">
                {isIOSDevice() ? (
                  <p>
                    On iPhone and iPad there is no install button for a website to press, so it
                    takes two taps of your own: tap the <strong className="text-white">Share</strong> icon
                    in Safari, then <strong className="text-white">Add to Home Screen</strong>.
                  </p>
                ) : (
                  <p>
                    Your browser has not offered its install prompt here, so use its own menu:
                    open the browser menu and choose{' '}
                    <strong className="text-white">Install WorldCityHub</strong> or{' '}
                    <strong className="text-white">Add to Home screen</strong>. On desktop Chrome
                    and Edge, an install icon may also sit at the right end of the address bar.
                  </p>
                )}
              </div>
            )}

            <Link
              role="menuitem"
              href={`/clock-widgets?city=${encodeURIComponent(clock.id)}#embed`}
              className={itemCls}
              onClick={() => setOpen(false)}
            >
              <Code2 className="h-4 w-4 shrink-0 text-cyan-300" />
              <span>
                Embed on your website
                <span className="block text-xs text-white/50">A free live {clock.name} clock, with our name on it</span>
              </span>
            </Link>

            <button
              type="button"
              role="menuitem"
              aria-expanded={showDesigns}
              onClick={() => setShowDesigns(!showDesigns)}
              className={itemCls}
            >
              <Palette className="h-4 w-4 shrink-0 text-cyan-300" />
              <span>
                Choose design
                <span className="block text-xs text-white/50">
                  Now: {getDesign(designId).name}. Applies to your pinned clocks
                </span>
              </span>
            </button>
            {showDesigns && (
              <div className="border-t border-white/10 py-1">
                {CLOCK_DESIGNS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setClockDesignId(d.id)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-white/85 hover:bg-white/10 transition-colors"
                  >
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 rounded-full border border-white/30"
                      style={{ background: `linear-gradient(135deg, ${d.swatch[0]} 50%, ${d.swatch[1]} 50%)` }}
                    />
                    <span className="flex-1">{d.name}</span>
                    {d.id === designId && <Check className="h-4 w-4 text-cyan-300" />}
                  </button>
                ))}
                <p className="px-3.5 pb-2 pt-1 text-[11px] leading-relaxed text-white/40">
                  More country designs are on the way; the list grows to fifty.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// The one-time confirmation after a visitor's first pin on a device:
// it points at the other two ways to take the clock (home screen,
// embed) exactly once, then never nags again (store.ts gates it).
export function FirstPinToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onFirst = () => {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 14000);
      return () => clearTimeout(t);
    };
    window.addEventListener(FIRST_PIN_EVENT, onFirst);
    return () => window.removeEventListener(FIRST_PIN_EVENT, onFirst);
  }, []);

  if (!visible) return null;
  return (
    <div
      role="status"
      className="t-force-dark mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-cyan-400/30 bg-[#0c1226] px-4 py-3 text-left shadow-xl"
    >
      <Pin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
      <p className="flex-1 text-sm leading-relaxed text-white/85">
        Pinned, it now sits in your pinned clocks below and in the My City panel. Two more ways
        to take a clock with you:{' '}
        <Link href="/clock-widgets#take" className="font-semibold text-cyan-300 hover:underline">
          add it to your home screen
        </Link>{' '}
        or{' '}
        <Link href="/clock-widgets#embed" className="font-semibold text-cyan-300 hover:underline">
          embed it on your website
        </Link>
        .
      </p>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setVisible(false)}
        className="shrink-0 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
