'use client';

import { useEffect, useState } from 'react';
import { WCH_EVENT_CATEGORIES } from '@/lib/events';

// "List Your Event" form — posts to /api/events/submit, which writes to
// the insert-only `event_submissions` table. Every submission is
// reviewed by a human before anything is published.
export default function EventSubmissionForm() {
  const [startedAt] = useState(() => Date.now());
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'not_active' | 'error'>('idle');
  const [form, setForm] = useState({
    title: '', city: '', venue: '', startsAt: '', endsAt: '',
    category: 'community', description: '', organizerName: '',
    organizerEmail: '', sourceUrl: '', fax_number: '',
  });

  useEffect(() => { /* startedAt captured on mount for the time-trap */ }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/events/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, startedAt }),
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
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-emerald-200">
        <h2 className="text-lg font-semibold mb-2">Thank you — your event was received.</h2>
        <p className="text-sm text-emerald-100/80">
          Every submission is checked by a person before it appears on WorldCityHub.
          If your event is verified, it will be listed on the city&apos;s events page.
        </p>
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60';
  const labelCls = 'block text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={labelCls} htmlFor="ev-title">Event title *</label>
        <input id="ev-title" required minLength={3} maxLength={160} value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. Lahore Food Festival 2026" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="ev-city">City *</label>
          <input id="ev-city" required minLength={2} maxLength={80} value={form.city} onChange={set('city')} className={inputCls} placeholder="e.g. Lahore" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ev-venue">Venue</label>
          <input id="ev-venue" maxLength={160} value={form.venue} onChange={set('venue')} className={inputCls} placeholder="Venue or area" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="ev-start">Starts *</label>
          <input id="ev-start" type="datetime-local" required value={form.startsAt} onChange={set('startsAt')} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ev-end">Ends</label>
          <input id="ev-end" type="datetime-local" value={form.endsAt} onChange={set('endsAt')} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls} htmlFor="ev-cat">Category</label>
        <select id="ev-cat" value={form.category} onChange={set('category')} className={inputCls}>
          {WCH_EVENT_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key} className="text-black">{c.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls} htmlFor="ev-desc">Description</label>
        <textarea id="ev-desc" rows={4} maxLength={2000} value={form.description} onChange={set('description')} className={inputCls} placeholder="What is the event, who is it for, is it free or ticketed?" />
      </div>
      <div>
        <label className={labelCls} htmlFor="ev-url">Event website or official page</label>
        <input id="ev-url" type="url" maxLength={300} value={form.sourceUrl} onChange={set('sourceUrl')} className={inputCls} placeholder="https://…" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="ev-name">Your name *</label>
          <input id="ev-name" required maxLength={80} value={form.organizerName} onChange={set('organizerName')} className={inputCls} />
        </div>
        <div>
          <label className={labelCls} htmlFor="ev-email">Your email *</label>
          <input id="ev-email" type="email" required maxLength={120} value={form.organizerEmail} onChange={set('organizerEmail')} className={inputCls} />
        </div>
      </div>
      {/* Honeypot — humans never see or fill this field. */}
      <div className="hidden" aria-hidden="true">
        <label>Fax number<input type="text" tabIndex={-1} autoComplete="off" value={form.fax_number} onChange={set('fax_number')} /></label>
      </div>
      {state === 'not_active' && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          Event submissions are being activated. Please check back soon — nothing was stored.
        </p>
      )}
      {state === 'error' && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          Something went wrong sending your event. Please check the details and try again.
        </p>
      )}
      <button type="submit" disabled={state === 'sending'}
        className="w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60">
        {state === 'sending' ? 'Sending…' : 'Submit event for review'}
      </button>
      <p className="text-xs text-gray-500">
        Listing an event is free. Submissions are reviewed by a person and only verified events are published.
      </p>
    </form>
  );
}
