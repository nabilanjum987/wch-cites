// Entity comparison view (Round 2, R5) — the province/country sibling of
// CompareView: same figure set both sides, one-line verdict, sources named.
// Server-rendered; all data arrives via props from src/lib/compare.ts.
import type { EntityCompareData } from '@/lib/compare';

export default function EntityCompareView({ data }: { data: EntityCompareData }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white">{data.a.name}</h2>
          <p className="mt-0.5 text-xs text-gray-400">{data.a.sub}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">vs</span>
        <div className="text-right">
          <h2 className="text-xl font-bold text-white">{data.b.name}</h2>
          <p className="mt-0.5 text-xs text-gray-400">{data.b.sub}</p>
        </div>
      </div>
      <dl>
        {data.rows.map((r) => (
          <div key={r.label} className="border-b border-white/5 py-3 last:border-0">
            <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-3">
              <dd className="text-base font-semibold text-white">{r.a}</dd>
              <dt className="text-center text-xs uppercase tracking-wide text-gray-400">{r.label}</dt>
              <dd className="text-right text-base font-semibold text-white">{r.b}</dd>
            </div>
            {r.note && <p className="mt-1 text-center text-[11px] text-gray-500">{r.note}</p>}
          </div>
        ))}
      </dl>
      {data.verdict && (
        <p className="mt-4 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm leading-relaxed text-emerald-100">
          <span className="font-semibold">Verdict: </span>
          {data.verdict}
        </p>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-gray-500">{data.sourceNote}</p>
    </section>
  );
}
