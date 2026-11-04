'use client';

// Wish/share card for one special day (or one famous birthday).
// The card carries the WorldCityHub branding on its face, and the
// downloaded image carries it too: the canvas render below draws the
// name and the site address onto the picture itself, so a shared card
// always says where it came from (owner branding rule, 3 Nov 2026).
//
// Actions: native share where the browser offers it, copy the message
// as text, and download the card as a PNG rendered on a local canvas.
// No external images or fonts are used in the canvas render, so the
// download works offline and never fails on a blocked asset.

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import type { DayTone } from '@/lib/day-messages';

const SITE_URL = 'https://worldcityhub.vercel.app';

export interface DayCardProps {
  /** Used for the download file name and the share title. */
  cardKey: string;
  /** The day or person name shown large on the card. */
  name: string;
  scope: string;
  tone: DayTone;
  headline: string;
  message: string;
  shareText: string;
  /** Formatted Gregorian date line, e.g. "Sunday, 8 November 2026". */
  dateLabel: string;
  /** Formatted Islamic date line, shown under the Gregorian date. */
  hijriDateLabel?: string;
  /** Optional profile link (famous birthdays). */
  href?: string;
}

const TONE_STYLES: Record<
  DayTone,
  { panel: string; chip: string; accent: string; canvasA: string; canvasB: string; canvasAccent: string }
> = {
  celebratory: {
    panel: 'border-emerald-300/25 bg-gradient-to-br from-emerald-500/15 via-white/5 to-transparent',
    chip: 'bg-emerald-400/10 text-emerald-300',
    accent: 'text-emerald-300',
    canvasA: '#064e3b',
    canvasB: '#0a0f1e',
    canvasAccent: '#6ee7b7',
  },
  solemn: {
    panel: 'border-slate-300/25 bg-gradient-to-br from-slate-400/15 via-white/5 to-transparent',
    chip: 'bg-slate-400/10 text-slate-300',
    accent: 'text-slate-300',
    canvasA: '#1e293b',
    canvasB: '#0a0f1e',
    canvasAccent: '#cbd5e1',
  },
  reverent: {
    panel: 'border-sky-300/25 bg-gradient-to-br from-sky-500/15 via-white/5 to-transparent',
    chip: 'bg-sky-400/10 text-sky-300',
    accent: 'text-sky-300',
    canvasA: '#0c4a6e',
    canvasB: '#0a0f1e',
    canvasAccent: '#7dd3fc',
  },
  warm: {
    panel: 'border-amber-300/25 bg-gradient-to-br from-amber-500/15 via-white/5 to-transparent',
    chip: 'bg-amber-400/10 text-amber-300',
    accent: 'text-amber-300',
    canvasA: '#78350f',
    canvasB: '#0a0f1e',
    canvasAccent: '#fcd34d',
  },
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    if (ctx.measureText(trial).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function DayCard(props: DayCardProps) {
  const style = TONE_STYLES[props.tone];
  const [feedback, setFeedback] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = useCallback((text: string) => {
    setFeedback(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), 2500);
  }, []);

  const fullShareText = `${props.shareText}\n${props.dateLabel} · via WorldCityHub ${SITE_URL}/special-days`;

  const onShare = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: `${props.name} · WorldCityHub`, text: fullShareText, url: `${SITE_URL}/special-days` });
        return;
      } catch {
        // The user closed the share sheet; fall through to copy.
      }
    }
    try {
      await navigator.clipboard.writeText(fullShareText);
      flash('Message copied. Paste it anywhere to share.');
    } catch {
      flash('Copy was blocked by the browser.');
    }
  }, [flash, fullShareText, props.name]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      flash('Message copied to clipboard.');
    } catch {
      flash('Copy was blocked by the browser.');
    }
  }, [flash, fullShareText]);

  const onDownload = useCallback(() => {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      flash('Image download is not available in this browser.');
      return;
    }
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, style.canvasA);
    grad.addColorStop(1, style.canvasB);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = style.canvasAccent;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 3;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    ctx.globalAlpha = 1;

    const left = 72;
    const right = W - 72;
    let y = 96;
    ctx.fillStyle = style.canvasAccent;
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillText('WORLDCITYHUB', left, y);
    ctx.fillStyle = '#e5e7eb';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText(props.scope.toUpperCase(), left, y + 40);

    y += 118;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 62px system-ui, sans-serif';
    for (const line of wrapText(ctx, props.name, right - left)) {
      ctx.fillText(line, left, y);
      y += 70;
    }
    y += 6;
    ctx.fillStyle = style.canvasAccent;
    ctx.font = '600 34px system-ui, sans-serif';
    for (const line of wrapText(ctx, props.headline, right - left)) {
      ctx.fillText(line, left, y);
      y += 42;
    }
    y += 14;
    ctx.fillStyle = '#d1d5db';
    ctx.font = '400 27px system-ui, sans-serif';
    for (const line of wrapText(ctx, props.message, right - left).slice(0, 5)) {
      ctx.fillText(line, left, y);
      y += 38;
    }

    ctx.fillStyle = '#f3f4f6';
    ctx.font = '600 26px system-ui, sans-serif';
    ctx.fillText(props.dateLabel, left, H - 108);
    if (props.hijriDateLabel) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '400 22px system-ui, sans-serif';
      ctx.fillText(props.hijriDateLabel, left, H - 74);
    }
    ctx.fillStyle = style.canvasAccent;
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.fillText('worldcityhub.vercel.app', left, H - 40);

    canvas.toBlob((blob) => {
      if (!blob) {
        flash('Image download failed in this browser.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${props.cardKey}-wish-card.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      flash('Card image downloaded.');
    }, 'image/png');
  }, [flash, props, style]);

  const buttonClass =
    'rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20';

  return (
    <article className={`rounded-3xl border p-6 sm:p-8 ${style.panel}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className={`text-sm font-bold tracking-[0.2em] ${style.accent}`}>WORLDCITYHUB</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.chip}`}>{props.scope}</span>
      </div>

      <h3 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">{props.name}</h3>
      <p className={`mt-2 text-lg font-semibold ${style.accent}`}>{props.headline}</p>
      <p className="mt-4 max-w-2xl leading-relaxed text-gray-200">{props.message}</p>

      <p className="mt-5 text-sm font-medium text-gray-100">{props.dateLabel}</p>
      {props.hijriDateLabel && <p className="text-sm text-gray-400">Islamic date: {props.hijriDateLabel}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" onClick={onShare} className={buttonClass}>
          Share
        </button>
        <button type="button" onClick={onCopy} className={buttonClass}>
          Copy message
        </button>
        <button type="button" onClick={onDownload} className={buttonClass}>
          Download card image
        </button>
        {props.href && (
          <Link href={props.href} className="text-sm font-medium text-cyan-300 underline">
            View profile
          </Link>
        )}
        <span className="text-xs text-gray-500">worldcityhub.vercel.app</span>
      </div>
      {feedback && (
        <p className="mt-3 text-sm text-gray-300" role="status">
          {feedback}
        </p>
      )}
    </article>
  );
}
