import Link from 'next/link';

// Personalities panel (§16) — cards ONLY for profiles that exist and
// render today (link map §16 / L1). The site's profile pool currently
// holds exactly two profiles; both were verified live before linking
// (2026-10-22: /personalities/allama-iqbal ≈8,328 visible chars,
// /personalities/imran-khan ≈7,326 — real rendered pages).

// Homepage-imagery pass (2026-10-28): each card now carries the
// person's real profile photo (vendored under public/images/home28/;
// licence + creator records in
// docs/media-registry/subjects/homepage-imagery-2026-10-28.json).
// The Iqbal portrait is NOT the old image-bank file: that file was
// UNVERIFIED in the registry (licence/creator unrecorded) and is never
// reused here. The portrait used is a different Commons file
// ("Allama Iqbal.jpg" as served from the Muhammad Iqbal article),
// whose LIVE metadata was verified for this PR on 2026-10-28:
// public domain, credited to Iqbal Academy Pakistan. The sibling profile-photos item
// (P9) had no PR up when this was built, so both photos were sourced
// independently under the same licensed rule; P9 may reuse these
// records. No link or copy changes.
// Stage 3 face framing (2026-11-03, owner review): the old wide,
// short photo strip (h-52 across a full card width) could only show
// the top slice of each portrait, so both men appeared cut off at
// the forehead. The photo area is now square, which shows about
// three quarters of each portrait's height, and each photo carries
// its own object-position (pos) measured from the source file so
// the complete face, hair to chin, sits inside the frame: Iqbal's
// face spans roughly the top 2% to 76% of his portrait, Imran
// Khan's roughly 8% to 62%. Same licensed photos, no substitutes.
const PROFILES = [
  {
    slug: 'allama-iqbal',
    name: 'Allama Iqbal',
    line: 'Poet-philosopher of the East',
    tag: 'Lahore · 1877–1938',
    img: '/images/home28/pers-iqbal.webp', imgAlt: 'Portrait of Allama Iqbal', credit: 'Iqbal Academy Pakistan · public domain',
    pos: 'object-[center_3%]',
  },
  {
    slug: 'imran-khan',
    name: 'Imran Khan',
    line: 'World Cup-winning captain & politician',
    tag: 'Lahore · born 1952',
    img: '/images/home28/pers-imran.webp', imgAlt: 'Imran Khan addressing a forum', credit: 'Imran Khan · CC BY 3.0',
    pos: 'object-[center_8%]',
  },
];

export default function PersonalitiesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROFILES.map((p) => (
        <Link key={p.slug} href={`/personalities/${p.slug}`} className="no-underline group">
          <div className="rounded-2xl border t-border t-card overflow-hidden transition-all t-group-border-hover-25 h-full">
            <div className="relative aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.imgAlt} width={600} height={600} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full object-cover ${p.pos}`} />
            </div>
            <div className="p-5">
              <div className="t-text-40 text-xs uppercase tracking-wide mb-1">{p.tag}</div>
              <div className="t-text font-bold text-lg">{p.name}</div>
              <p className="sub-desc mt-1">{p.line}</p>
              <div className="t-cyan text-sm font-medium mt-3">Read the full profile →</div>
              <div className="text-[10px] t-text-40 mt-2">Photo: {p.credit}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
