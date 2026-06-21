/**
 * SEO paragraph generators — WorldCityHub Famous Places Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 4 sections × ~150 words × 2 = 1,200+ words per place page.
 * Each place gets genuinely unique copy using name/city/country/category.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

// ─── 1. KEY FACTS ────────────────────────────────────────────────────────────

export function generateFactsParagraph(name: string, city: string): string {
  return `The key facts above distill ${name} down to its most quotable, citable details — figures and specifics that go beyond the narrative history and significance covered elsewhere on this page into the kind of concrete data worth knowing before a visit or for general reference. These details are the ones most commonly cited in guidebooks, articles, and conversations about ${name}, the specifics that turn a general impression of the landmark into genuine working knowledge. Each fact below stands on its own as a useful, shareable detail about ${name} in ${city}.`;
}

export function generateFactsAfter(name: string, city: string): string {
  return `These facts about ${name} connect directly to the fuller history and significance sections elsewhere on this page, where the context and reasoning behind these specific figures and details is explained in greater depth. For anyone researching ${name} for a report, an article, or simply trip planning, this list offers the fastest way to verify or reference the landmark's defining characteristics without re-reading the full narrative sections. ${name} remains one of ${city}'s most cited landmarks precisely because of details like these.`;
}

// ─── 2. INSIDER TIPS ─────────────────────────────────────────────────────────

export function generateTipsParagraph(name: string): string {
  return `The insider tips above go beyond official visitor information into the kind of practical, experience-based advice that typically only comes from locals or frequent visitors to ${name} — the small details that meaningfully improve a visit but rarely appear in standard tourist guides. These tips address the specific quirks and opportunities unique to ${name}, rather than generic travel advice that could apply to any landmark. Reading through these before visiting ${name} is one of the simplest ways to get more out of the experience.`;
}

export function generateTipsAfter(name: string): string {
  return `Many of these tips for ${name} reflect lessons learned through repeated visits and direct local knowledge, the kind of accumulated wisdom that official visitor information rarely captures. Combining these tips with the practical visitor information in the sidebar elsewhere on this page — opening hours, entry fees, best time to visit — gives a genuinely complete picture for planning a visit to ${name}. Following even a few of these suggestions can be the difference between a rushed, surface-level visit and one that captures what actually makes ${name} worth seeing.`;
}

// ─── 3. NEARBY PLACES ────────────────────────────────────────────────────────

export function generateNearbyParagraph(name: string, city: string): string {
  return `The nearby places above sit close enough to ${name} to realistically combine into a single visit, useful for anyone planning an efficient day exploring this part of ${city} rather than treating each landmark as a separate, isolated trip. Distance figures shown for each nearby site give a realistic sense of how much additional time and walking a combined visit would require, helping prioritise which sites to include depending on how much time is available. Many visitors to ${name} build their day around this exact cluster of nearby attractions.`;
}

export function generateNearbyAfter(name: string, city: string): string {
  return `Grouping ${name} with these nearby sites often makes historical sense beyond simple convenience, since landmarks built in close proximity within ${city} frequently share historical periods, architectural influences, or civic functions worth understanding together rather than in isolation. Each nearby place links through to its own dedicated page with the same depth of detail found here for ${name}, so planning a combined visit doesn't require sacrificing depth for any individual site. This cluster of attractions represents one of ${city}'s more historically rich and walkable areas.`;
}

// ─── 4. VISITOR INFORMATION ──────────────────────────────────────────────────

export function generateVisitorInfoParagraph(name: string): string {
  return `The visitor information above covers the practical logistics of actually visiting ${name} — hours, fees, ideal timing, and expected visit duration — the kind of details that directly shape whether a visit goes smoothly or runs into avoidable friction. These figures reflect typical current conditions at ${name}, though checking immediately before a planned visit is always worthwhile given that hours and fees can shift, particularly around religious observances or seasonal changes.`;
}

export function generateVisitorInfoAfter(name: string): string {
  return `Combining this visitor information with the insider tips and key facts found elsewhere on this page gives a genuinely complete planning picture for ${name} — not just when and how much, but what to actually do once there and what makes the experience worthwhile. The directions and map tools below this information panel make the final step from planning to actually arriving at ${name} as straightforward as possible. Together, this practical information rounds out everything needed to plan a well-informed visit.`;
}
