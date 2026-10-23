import Link from 'next/link';

// Personalities panel (§16) — cards ONLY for profiles that exist and
// render today (link map §16 / L1). The site's profile pool currently
// holds exactly two profiles; both were verified live before linking
// (2026-10-22: /personalities/allama-iqbal ≈8,328 visible chars,
// /personalities/imran-khan ≈7,326 — real rendered pages).

const PROFILES = [
  {
    slug: 'allama-iqbal',
    name: 'Allama Iqbal',
    line: 'Poet-philosopher of the East — the thinker whose 1930 address first mapped a homeland for South Asia\'s Muslims.',
    tag: 'Lahore · 1877–1938',
  },
  {
    slug: 'imran-khan',
    name: 'Imran Khan',
    line: 'Cricket World Cup-winning captain turned politician — still the most talked-about Lahori of his generation.',
    tag: 'Lahore · born 1952',
  },
];

export default function PersonalitiesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {PROFILES.map((p) => (
        <Link key={p.slug} href={`/personalities/${p.slug}`} className="no-underline group">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all group-hover:border-white/25">
            <div className="text-white/40 text-xs uppercase tracking-wide mb-1">{p.tag}</div>
            <div className="text-white font-bold text-lg">{p.name}</div>
            <p className="sub-desc mt-1">{p.line}</p>
            <div className="text-cyan-300 text-sm font-medium mt-3">Read the full profile →</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
