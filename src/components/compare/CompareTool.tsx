'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftRight } from 'lucide-react';
import { COMPARE_CITIES } from '@/lib/compare';

export default function CompareTool({ initialA = 'lahore', initialB = 'karachi' }: { initialA?: string; initialB?: string }) {
  const router = useRouter();
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);

  const selectCls = 'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-white/40 [&>option]:text-gray-900';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">City 1</label>
          <select value={a} onChange={(e) => setA(e.target.value)} className={selectCls}>
            {COMPARE_CITIES.map((c) => (
              <option key={c.citySlug} value={c.citySlug}>{c.label}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          aria-label="Swap cities"
          onClick={() => { setA(b); setB(a); }}
          className="mb-0.5 rounded-full border border-white/15 bg-white/5 p-2.5 text-gray-300 transition hover:bg-white/10"
        >
          <ArrowLeftRight size={16} />
        </button>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-400">City 2</label>
          <select value={b} onChange={(e) => setB(e.target.value)} className={selectCls}>
            {COMPARE_CITIES.map((c) => (
              <option key={c.citySlug} value={c.citySlug}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="button"
        disabled={a === b}
        onClick={() => router.push(`/compare/${a}-vs-${b}`)}
        className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {a === b ? 'Choose two different cities' : `Compare ${COMPARE_CITIES.find((c) => c.citySlug === a)?.label} vs ${COMPARE_CITIES.find((c) => c.citySlug === b)?.label}`}
      </button>
    </div>
  );
}
