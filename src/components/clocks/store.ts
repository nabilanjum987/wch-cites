'use client';

// Pin / Take This Clock — device-local store (feat/pin-clock).
// Everything lives in localStorage on the visitor's own device and is
// never sent anywhere: the pinned clocks, the chosen design, the
// dismissed hint and the first-pin welcome. Components subscribe via
// useSyncExternalStore so the hero clocks, the pinned strip and the
// My City panel always agree, and the `storage` event keeps other
// open tabs in step. Server snapshot is the empty state, so SSR HTML
// never claims pins the server cannot know about.

import { useMemo, useSyncExternalStore } from 'react';
import type { PinnedClock } from './clock-data';
import { DEFAULT_DESIGN_ID } from './designs';

const PINS_KEY = 'wch-pinned-clocks';
const DESIGN_KEY = 'wch-clock-design';
const HINT_KEY = 'wch-clock-hint-dismissed';
const WELCOMED_KEY = 'wch-clock-pin-welcomed';

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PINS_KEY || e.key === DESIGN_KEY || e.key === HINT_KEY || e.key === WELCOMED_KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* private mode / storage full: pins simply do not persist */
  }
  emit();
}

// ── Pinned clocks ────────────────────────────────────────────────────
// Snapshots are the raw localStorage strings, so useSyncExternalStore
// sees a stable value between writes.

export function usePinnedClocks(): PinnedClock[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(PINS_KEY),
    () => null,
  );
  return useMemo(() => {
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (p): p is PinnedClock =>
          !!p && typeof p.id === 'string' && typeof p.name === 'string' && typeof p.tz === 'string',
      );
    } catch {
      return [];
    }
  }, [raw]);
}

export function isPinned(pins: PinnedClock[], id: string): boolean {
  return pins.some((p) => p.id === id);
}

/** Toggle a pin. Returns 'pinned' when the clock is now pinned. */
export function togglePin(clock: PinnedClock): 'pinned' | 'unpinned' {
  const pins = readPinsSync();
  if (pins.some((p) => p.id === clock.id)) {
    writeRaw(PINS_KEY, JSON.stringify(pins.filter((p) => p.id !== clock.id)));
    return 'unpinned';
  }
  writeRaw(PINS_KEY, JSON.stringify([...pins, clock]));
  return 'pinned';
}

export function unpin(id: string) {
  const pins = readPinsSync();
  writeRaw(PINS_KEY, JSON.stringify(pins.filter((p) => p.id !== id)));
}

function readPinsSync(): PinnedClock[] {
  const raw = readRaw(PINS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// ── Chosen design ────────────────────────────────────────────────────

export function useClockDesignId(): string {
  return (
    useSyncExternalStore(
      subscribe,
      () => readRaw(DESIGN_KEY),
      () => null,
    ) ?? DEFAULT_DESIGN_ID
  );
}

export function setClockDesignId(id: string) {
  writeRaw(DESIGN_KEY, id);
}

// ── Hint line ────────────────────────────────────────────────────────

export function useHintDismissed(): boolean {
  return (
    useSyncExternalStore(
      subscribe,
      () => readRaw(HINT_KEY),
      () => null,
    ) === '1'
  );
}

export function dismissHint() {
  writeRaw(HINT_KEY, '1');
}

// ── First-pin welcome ────────────────────────────────────────────────
// The first time a visitor pins any clock, one small confirmation
// points at the home-screen and embed options (owner's discovery
// design). It fires once per device, ever.

export const FIRST_PIN_EVENT = 'wch:first-pin';

export function claimFirstPinWelcome(): boolean {
  if (readRaw(WELCOMED_KEY) === '1') return false;
  writeRaw(WELCOMED_KEY, '1');
  window.dispatchEvent(new CustomEvent(FIRST_PIN_EVENT));
  return true;
}
