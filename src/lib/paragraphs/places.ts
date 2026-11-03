/**
 * SEO paragraph generators: WorldCityHub Famous Places Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 *
 * Places family fix (3 Nov 2026): the before paragraphs are placed BEFORE
 * the lists and panels they introduce, so they must not call that content
 * "above". All eight generators were rewritten short and honest, built
 * only from the place's own name and city: no wrong-direction references,
 * no unsourced claims about guidebooks or other publications, no em dashes.
 */

// ─── 1. KEY FACTS ────────────────────────────────────────────────────────────

export function generateFactsParagraph(name: string, city: string): string {
  return `The key facts below set out the concrete details that define ${name} in ${city}: its size, its dates and the features visitors most often ask about. Each fact stands on its own as a quick reference point, and the history and significance sections on this page give the context behind them.`;
}

export function generateFactsAfter(name: string, city: string): string {
  return `Taken together, these facts are the short reference version of ${name}. For the fuller story, the history and significance sections on this page explain how ${name} came to be and why it matters, and the visitor panel covers the practical details of a trip here.`;
}

// ─── 2. INSIDER TIPS ─────────────────────────────────────────────────────────

export function generateTipsParagraph(name: string): string {
  return `The tips below cover the practical side of visiting ${name}: when to go, what to wear and what to allow time for once you are there. They are specific to this place rather than general travel advice, so read them before you set off.`;
}

export function generateTipsAfter(name: string): string {
  return `Following even a few of these tips can make a visit to ${name} smoother and less rushed. Pair them with the visitor information panel on this page, which covers opening hours, entry fees, the best time to visit and how long a visit usually takes.`;
}

// ─── 3. NEARBY PLACES ────────────────────────────────────────────────────────

export function generateNearbyParagraph(name: string, city: string): string {
  return `The places below sit close to ${name} in ${city}, and the distance to each one is shown alongside its name. Combining two or three of them into a single outing is usually straightforward, and each linked place has its own page with its history and visitor information.`;
}

export function generateNearbyAfter(name: string, city: string): string {
  return `These nearby places share this part of ${city} with ${name}, and several of them share a period of its history as well. Visiting them together gives a fuller picture of the area than any one of them gives on its own.`;
}

// ─── 4. VISITOR INFORMATION ──────────────────────────────────────────────────

export function generateVisitorInfoParagraph(name: string): string {
  return `This panel covers the practical details of visiting ${name}: opening hours, entry fees, the best time to visit and how long a visit usually takes. Hours and fees can change, particularly around religious observances or seasonal shifts, so confirming them shortly before a visit is worthwhile.`;
}

export function generateVisitorInfoAfter(name: string): string {
  return `Directions and a map sit below this panel, covering the final step of getting to ${name}. Together with the tips and key facts on this page, that completes the planning picture for a visit.`;
}
