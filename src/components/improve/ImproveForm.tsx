'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const titleCase = (s: string) =>
  s.replace(/-/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());

type State = 'idle' | 'sending' | 'done' | 'error' | 'inactive';

const inputCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-emerald-400/60';

export default function ImproveForm() {
  const params = useSearchParams();
  const [state, setState] = useState<State>('idle');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    const c = params.get('country');
    const ci = params.get('city');
    if (c) setCountry(titleCase(c));
    if (ci) setCity(titleCase(ci));
    startedAt.current = Date.now();
  }, [params]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === 'sending') return;
    const form = new FormData(e.currentTarget);
    setState('sending');
    try {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          city,
          pageType: form.get('pageType'),
          category: form.get('category'),
          message: form.get('message'),
          name: form.get('name'),
          email: form.get('email'),
          website: form.get('website'), // honeypot — humans never see this field
          startedAt: startedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: string };
      if (res.ok && data.ok) setState('done');
      else if (data.code === 'not_active') setState('inactive');
      else setState('error');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/[0.07] p-6 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-2 text-lg font-bold text-white">Suggestion received — thank you</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-300">
          Nothing changes automatically. A human reviews every suggestion and checks it against a
          reliable source before any page is updated.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Country *</span>
          <input required maxLength={60} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Pakistan" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">City (if it is about one city)</span>
          <input maxLength={60} value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Which page?</span>
          <select name="pageType" className={inputCls} defaultValue="City guide">
            {['City guide', 'Country page', 'Province page', 'Weather', 'Prayer times', 'Rates', 'News', 'Economy', 'Events', 'Sports', 'Other'].map((o) => (
              <option key={o} value={o} className="bg-neutral-900">{o}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Type of improvement *</span>
          <select name="category" className={inputCls} defaultValue="Correction">
            {['Correction', 'Missing information', 'New place or fact', 'Broken or wrong data', 'Other'].map((o) => (
              <option key={o} value={o} className="bg-neutral-900">{o}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Your suggestion *</span>
        <textarea required name="message" minLength={10} maxLength={2000} rows={5}
          placeholder="What should change, and how do you know? A source (book, official site, your own local knowledge) helps us verify it faster."
          className={inputCls} />
      </label>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Your name (optional)</span>
          <input name="name" maxLength={80} className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-400">Email (optional, never published)</span>
          <input name="email" type="email" maxLength={120} className={inputCls} />
        </label>
      </div>
      {/* Honeypot: invisible to humans, bots fill it and are silently dropped. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, overflow: 'hidden' }}>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state === 'error' && (
        <p className="mt-4 rounded-xl border border-red-300/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          Something went wrong sending that. Please check the fields and try again.
        </p>
      )}
      {state === 'inactive' && (
        <p className="mt-4 rounded-xl border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Submissions are being activated right now — please try again shortly. Your suggestion was not stored yet.
        </p>
      )}
      <button
        type="submit"
        disabled={state === 'sending'}
        className="mt-5 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : 'Send suggestion'}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-gray-500">
        We store only what you type here, use it only to review your suggestion, and never publish your
        name or email. Suggestions are never published automatically.
      </p>
    </form>
  );
}
