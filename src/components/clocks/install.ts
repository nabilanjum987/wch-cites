'use client';

// Add to Home Screen — the honest platform mechanism (feat/pin-clock).
// Where the browser offers `beforeinstallprompt` (Chromium on Android
// and desktop, with a manifest + icons in place), we capture it and
// fire the real prompt from the visitor's tap. Where it does not —
// iOS Safari above all — there is NO programmatic install, so the UI
// shows the platform's own manual steps instead of a button that
// pretends. Known gap, stated plainly: this site ships no service
// worker, so a browser that insists on one before offering its prompt
// will land on the manual steps too.

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let listening = false;
const subs = new Set<() => void>();

function notify() {
  subs.forEach((f) => f());
}

export function initInstallCapture() {
  if (typeof window === 'undefined' || listening) return;
  listening = true;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferred = null;
    notify();
  });
}

export function useCanInstall(): boolean {
  const [can, setCan] = useState(false);
  useEffect(() => {
    initInstallCapture();
    const check = () => setCan(!!deferred);
    check();
    subs.add(check);
    return () => {
      subs.delete(check);
    };
  }, []);
  return can;
}

export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferred) return 'unavailable';
  try {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === 'accepted') deferred = null;
    notify();
    return choice.outcome;
  } catch {
    return 'unavailable';
  }
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes('Macintosh') && 'ontouchend' in document);
}
