// FAQ BANKS (R5-C2) — verified question banks per template.
//
// Adoption (for each template's owner — the banks change no template
// by themselves):
//   city    → the FAQ JSON-LD builder in src/lib/seo/cityMeta.ts can
//             render CITY_FAQ_BANK entries through renderFaqText with
//             the same props it already receives.
//   country → country template has no FAQ block yet; COUNTRY_FAQ_BANK
//             is the verified content for one when it is added.
//   wonder  → golden pages keep their per-instance `faqs` in the data
//             row; WONDER_FAQ_BANK adds the template-level set.
//   ocean   → golden pages keep their per-instance `faqs` in the data
//             row. (The unused OCEAN_FAQ_BANK module was deleted in the
//             oceans family fix, 3 Nov 2026, M6.)
// Rule for editors: an answer that needs an unverified fact is
// dropped, not guessed (see types.ts).

export type { FaqEntry, FaqBank } from './types';
export { renderFaqText } from './types';
export { CITY_FAQ_BANK } from './city';
export { COUNTRY_FAQ_BANK } from './country';
export { WONDER_FAQ_BANK } from './wonder';
