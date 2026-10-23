import Link from 'next/link';
import { fetchUnhcrTotals } from '@/lib/conflicts';

// Conflicts panel (§21) — SERVER component. Headline displacement
// figures from the UNHCR Population Statistics API (the same helper
// the /conflicts hub uses). ONLY the hub is linked — detail pages
// are on HOLD (link map §21) until their whitelist-based rebuild
// passes; the old widget's per-region detail links are removed.

const fmt = (n: number) => `${(n / 1e6).toFixed(1)}M`;

export default async function ConflictsPanel() {
  const t = await fetchUnhcrTotals().catch(() => null);
  return (
    <div>
      {t ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Refugees', value: fmt(t.refugees) },
            { label: 'Internally displaced', value: fmt(t.idps) },
            { label: 'Asylum seekers', value: fmt(t.asylumSeekers) },
            { label: 'Stateless people', value: fmt(t.stateless) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <div className="text-white font-bold text-xl">{s.value}</div>
              <div className="text-white/40 text-xs mt-0.5">{s.label} · UNHCR {t.year}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/50 text-sm mb-5">
          The UNHCR figures feed is unreachable right now — the conflicts hub carries the full picture.
        </p>
      )}
      <Link href="/conflicts" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-medium no-underline">
        The conflicts hub — verified figures, peace efforts, how to help →
      </Link>
    </div>
  );
}
