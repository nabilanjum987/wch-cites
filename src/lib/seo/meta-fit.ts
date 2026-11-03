// ── Meta title / description fitting (personalities family fix, B2) ───────
// Shared by the profile template (src/app/personalities/[slug]/page.tsx)
// and the acceptance script (scripts/verify-meta-fit.mjs), so the exact
// code that renders the live meta tags is what the test exercises.
//
// Rules (owner SEO gate + B2 audit):
//   • Title ≤ 60 chars, description ≤ 155 chars (decoded).
//   • A cut never ends mid-word: cut at the cap, back off to the last
//     whitespace inside the cap.
//   • After the word-boundary cut, trailing conjunctions, prepositions,
//     articles and separators (&, and, of, the, a, an, to, —, , …) are
//     stripped REPEATEDLY, so a title can never render as
//     "Faiz Ahmed Faiz — Poet of Resistance & | WorldCityHub".
//   • If what remains after cleaning is empty or under 40% of the
//     budget, fall back to a clean short form ("{Name} | WorldCityHub"
//     for titles; "{Name} — {Title}" for descriptions) rather than a
//     dangling fragment.
//   • Text that already fits is returned byte-identical; nothing is
//     ever padded or invented.

export const META_TITLE_MAX = 60;
export const META_DESC_MAX = 155;
export const SITE_SUFFIX = ' | WorldCityHub';

export function cutAtWordBoundary(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  const head = t.slice(0, max);
  let lastSpace = -1;
  for (const m of head.matchAll(/\s/g)) lastSpace = m.index;
  if (lastSpace > 0) return head.slice(0, lastSpace).trimEnd();
  return '';
}

// Words and marks a cut may never end on: conjunctions, prepositions,
// articles and separators. Compared case-insensitively, as whole words.
const TRAILING_FUNCTION_WORDS = new Set([
  '&', 'and', 'or', 'of', 'the', 'a', 'an', 'to', 'for', 'in', 'on',
  'at', 'by', 'with', 'from', 'per', 'vs', 'as', 'into', 'over',
]);
const TRAILING_SEPARATORS = /[\s\-—–&,;:·•/(]+$/u;

// Strip trailing separators and function words until the text ends on
// a content word. Applied ONLY to a cut fragment, never to text that
// already fits.
export function cleanMetaCut(text: string): string {
  let t = text.trim();
  for (;;) {
    const before = t;
    t = t.replace(TRAILING_SEPARATORS, '');
    const m = t.match(/(\S+)$/);
    if (m && TRAILING_FUNCTION_WORDS.has(m[1].toLowerCase())) {
      t = t.slice(0, t.length - m[1].length).trimEnd();
    }
    if (t === before) break;
  }
  return t.trim();
}

export function fitMetaTitle(name: string, title: string): string {
  const full = `${name} — ${title}${SITE_SUFFIX}`;
  if (full.length <= META_TITLE_MAX) return full;
  const titleBudget = META_TITLE_MAX - name.length - 3 - SITE_SUFFIX.length;
  if (titleBudget >= 1) {
    const cut = cleanMetaCut(cutAtWordBoundary(title, titleBudget));
    if (cut && cut.length >= Math.ceil(titleBudget * 0.4)) {
      return `${name} — ${cut}${SITE_SUFFIX}`;
    }
    return `${name}${SITE_SUFFIX}`;
  }
  // Even name + suffix alone exceeds the cap (no live profile does):
  // cut the name itself at a word boundary rather than dropping the
  // suffix.
  const cutName = cleanMetaCut(cutAtWordBoundary(name, META_TITLE_MAX - SITE_SUFFIX.length));
  return `${cutName}${SITE_SUFFIX}`;
}

export function fitMetaDescription(description: string, name: string, title: string): string {
  const t = description.trim();
  if (t.length <= META_DESC_MAX) return t;
  const cut = cleanMetaCut(cutAtWordBoundary(t, META_DESC_MAX));
  if (cut && cut.length >= Math.ceil(META_DESC_MAX * 0.4)) return cut;
  // Fallback: a clean shorter description composed only from the
  // record's own name + title (never invented facts).
  const composed = cleanMetaCut(cutAtWordBoundary(`${name} — ${title}`, META_DESC_MAX));
  return composed || name;
}

export function fitOgTitle(name: string): string {
  const full = `${name}${SITE_SUFFIX}`;
  if (full.length <= META_TITLE_MAX) return full;
  return `${cleanMetaCut(cutAtWordBoundary(name, META_TITLE_MAX - SITE_SUFFIX.length))}${SITE_SUFFIX}`;
}
