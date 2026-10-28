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
  // Homepage-imagery pass (2026-10-28): an empty stat box is a
  // defect, not a design — a box renders ONLY when its figure is a
  // real number above zero. (Verified 2026-10-28: the live UNHCR feed
  // returns all four 2024 totals, so all four boxes show today; the
  // guard covers the feed returning a missing/zero field.) The section
  // also gains a real photo in both states, so it is never a bare
  // text block: an aerial view of Za'atari refugee camp (U.S.
  // Department of State, public domain; record in
  // docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
  const stats = t
    ? [
        { label: 'Refugees', n: t.refugees },
        { label: 'Internally displaced', n: t.idps },
        { label: 'Asylum seekers', n: t.asylumSeekers },
        { label: 'Stateless people', n: t.stateless },
      ].filter((s) => typeof s.n === 'number' && s.n > 0)
    : [];
  return (
    <div>
      <figure className="relative h-40 sm:h-48 overflow-hidden rounded-2xl border t-border mb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/home28/conflicts-displacement.webp" alt="An aerial view of the Za'atari refugee camp" width={900} height={400} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
        <figcaption className="absolute bottom-0 right-0 bg-black/60 text-white/70 text-[11px] px-2.5 py-1 rounded-tl-lg">
          Za'atari refugee camp from above — U.S. Department of State · public domain
        </figcaption>
      </figure>
      {stats.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl t-card border t-border px-4 py-3">
                <div className="t-text font-bold text-xl">{fmt(s.n)}</div>
                <div className="sub-desc mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[11px] t-text-40 -mt-3 mb-1">Source: UNHCR {t!.year}</p>
        </>
      ) : (
        <p className="sub-desc">
          The UNHCR figures feed is unreachable right now — the conflicts hub carries the full picture.
        </p>
      )}
      <Link href="/conflicts" className="inline-flex items-center gap-2 t-link text-sm font-medium no-underline">
        The conflicts hub — verified figures, peace efforts, how to help →
      </Link>
    </div>
  );
}
