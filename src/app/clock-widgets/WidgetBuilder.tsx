'use client';

// Free Clock Widgets — the builder (feat/pin-clock): pick a city,
// pick a design, preview the exact widget, copy the exact snippet.
// The preview iframes the real embed route, so what a visitor sees
// here is byte-for-byte what their own website will show — including
// the WorldCityHub branding line, which is part of the widget and
// cannot be switched off in the snippet (that is stated plainly
// beside the code, not hidden).

import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { CLOCK_CATALOGUE, getClock } from '@/components/clocks/clock-data';
import { CLOCK_DESIGNS } from '@/components/clocks/designs';

const ORIGIN = 'https://worldcityhub.vercel.app';

export default function WidgetBuilder({ initialCity }: { initialCity: string }) {
  const [cityId, setCityId] = useState(() => getClock(initialCity)?.id ?? 'karachi');
  const [designId, setDesignId] = useState('auto');
  const [copied, setCopied] = useState(false);

  const city = getClock(cityId) ?? CLOCK_CATALOGUE[2];
  const embedPath = useMemo(() => {
    const q = new URLSearchParams({ city: city.id });
    if (designId !== 'auto') q.set('design', designId);
    return `/embed/clock?${q.toString()}`;
  }, [city.id, designId]);

  const snippet = `<iframe src="${ORIGIN}${embedPath}" width="340" height="330" style="border:0" loading="lazy" title="${city.name} live clock by WorldCityHub"></iframe>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard refused (permissions / insecure context): select the
      // text so the visitor can copy it by hand — never fake success.
      const el = document.getElementById('wch-widget-snippet') as HTMLTextAreaElement | null;
      el?.focus();
      el?.select();
    }
  };

  const selectCls =
    'w-full rounded-xl border border-white/15 bg-[#101828] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60';
  const labelCls = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300';

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <label className={labelCls} htmlFor="wch-city-select">1 · City</label>
        <select
          id="wch-city-select"
          className={selectCls}
          value={city.id}
          onChange={(e) => setCityId(e.target.value)}
        >
          {CLOCK_CATALOGUE.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.country}
            </option>
          ))}
        </select>

        <label className={`${labelCls} mt-5`} htmlFor="wch-design-select">2 · Design</label>
        <select
          id="wch-design-select"
          className={selectCls}
          value={designId}
          onChange={(e) => setDesignId(e.target.value)}
        >
          <option value="auto">The city&apos;s own colours</option>
          {CLOCK_DESIGNS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <label className={`${labelCls} mt-5`} htmlFor="wch-widget-snippet">3 · Your code</label>
        <textarea
          id="wch-widget-snippet"
          readOnly
          rows={4}
          value={snippet}
          className="w-full resize-none rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 font-mono text-xs leading-relaxed text-white/85 outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/90 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-400"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy the code'}
        </button>
        <p className="mt-3 text-xs leading-relaxed text-white/45">
          One line of HTML, no account, no script of ours running on your page, the clock sits
          in its own frame and keeps its own time. The small WorldCityHub line at the bottom of
          the widget is part of it and stays on every copy: that line is the whole price.
        </p>
      </div>

      <div>
        <span className={labelCls}>Preview: exactly what your visitors get</span>
        <div className="overflow-hidden rounded-2xl border border-white/15 shadow-2xl" style={{ width: 340, maxWidth: '100%' }}>
          <iframe
            key={embedPath}
            src={embedPath}
            width={340}
            height={330}
            style={{ border: 0, display: 'block', width: '100%' }}
            loading="lazy"
            title={`${city.name} live clock by WorldCityHub (preview)`}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/45">
          Live, not a picture: the hands move, and the time is {city.name}&apos;s own, worked out
          from its time zone on the visitor&apos;s device.
        </p>
      </div>
    </div>
  );
}
