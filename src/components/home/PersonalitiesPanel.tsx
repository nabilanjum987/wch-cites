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
// the forehead. Owner's rule: the COMPLETE head, hair to chin, inside
// the frame — verified 3 Nov 2026 by measuring every source file:
// Iqbal's head spans y 0–83% of his 900×1290 portrait, Imran Khan's
// y 3–62% of his 900×1168 portrait. A square frame shows only ~70–77%
// of a portrait's height and cut both chins, so the photo area is now
// 4/5 portrait (shows ~87–96% of the height), anchored to the top so
// each head sits whole inside it. Same licensed photos, no substitutes.
const PROFILES = [
  {
    slug: 'allama-iqbal',
    name: 'Allama Iqbal',
    line: 'Poet-philosopher of the East',
    tag: 'Lahore · 1877–1938',
    img: '/images/home28/pers-iqbal.webp', imgAlt: 'Portrait of Allama Iqbal', credit: 'Iqbal Academy Pakistan · public domain',
    pos: 'object-top',
    // Iqbal's head fills his portrait edge to edge (hair touches the
    // source's own top), so cover-cropping always reads as a cut face
    // on this wide card. He is shown whole instead: the full photo,
    // contained on a mat sampled from the portrait's own backdrop.
    fit: 'contain',
    mat: 'radial-gradient(120% 120% at 50% 30%, #5a5452 0%, #3c3839 55%, #2a2728 100%)',
  },
  {
    slug: 'imran-khan',
    name: 'Imran Khan',
    line: 'World Cup-winning captain & politician',
    tag: 'Lahore · born 1952',
    img: '/images/home28/pers-imran.webp', imgAlt: 'Imran Khan addressing a forum', credit: 'Imran Khan · CC BY 3.0',
    pos: 'object-top',
  },
];

export default function PersonalitiesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {PROFILES.map((p) => (
        <Link key={p.slug} href={`/personalities/${p.slug}`} className="no-underline group">
          <div className="rounded-2xl border t-border t-card overflow-hidden transition-all t-group-border-hover-25 h-full">
            <div className="relative aspect-[4/5] overflow-hidden" style={p.mat ? { background: p.mat } : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.imgAlt} width={600} height={600} loading="lazy" decoding="async" className={`absolute inset-0 h-full w-full ${p.fit === 'contain' ? 'object-contain' : `object-cover ${p.pos}`}`} />
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
