'use client';

import { useState } from 'react';
import { NEWS_CATEGORIES, type WchNewsCategory } from '@/lib/apis/news';

// News subscription opt-in (Q13). Mount this in the /news hub (and,
// later, inside the homepage news panel) — see the hand-off note in
// the Q13 evidence pack. GROUNDWORK ONLY: subscribing stores the
// opt-in; no email or push is sent yet (the owner's sender setup
// comes later, and the success copy below says exactly that).
export default function NewsSubscribeForm({
  defaultCategories = [],
  heading = 'Get the news you care about',
}: {
  defaultCategories?: WchNewsCategory[];
  heading?: string;
}) {
  const [startedAt] = useState(() => Date.now());
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState<Set<WchNewsCategory>>(
    () => new Set(defaultCategories.length ? defaultCategories : ['world', 'pakistan']),
  );
  const [website, setWebsite] = useState(''); // honeypot
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'not_active' | 'error'>('idle');

  const toggle = (key: WchNewsCategory) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selected.size === 0) { setState('error'); return; }
    setState('sending');
    try {
      const res = await fetch('/api/news-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, categories: [...selected], website, startedAt }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) setState('done');
      else if (json.code === 'not_active') setState('not_active');
      else setState('error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-emerald-200">
        <p className="font-semibold mb-1">You are on the list.</p>
        <p className="text-sm text-emerald-100/80">
          Your categories are saved. News digests are being set up — we will only ever
          send the categories you chose, and every message will carry an unsubscribe link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-white font-semibold mb-1">{heading}</h3>
      <p className="text-xs text-gray-400 mb-4">
        Choose your categories. A morning digest and an evening roundup — no hourly spam, ever.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {NEWS_CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => toggle(c.key)}
            aria-pressed={selected.has(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              selected.has(c.key)
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-transparent text-gray-300 border-white/15 hover:border-white/30'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          required
          maxLength={160}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 min-w-0 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {state === 'sending' ? 'Saving…' : 'Subscribe'}
        </button>
      </div>
      {/* Honeypot — humans never see or fill this field. */}
      <div className="hidden" aria-hidden="true">
        <label>Website<input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>
      {state === 'not_active' && (
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          Subscriptions are being activated. Please check back soon — nothing was stored.
        </p>
      )}
      {state === 'error' && (
        <p className="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          Please enter a valid email and choose at least one category.
        </p>
      )}
    </form>
  );
}
