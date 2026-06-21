/**
 * SEO paragraph generators — WorldCityHub Conflicts Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 7 sections × ~150 words × 2 = 2,000+ words per conflict page.
 * Each conflict gets unique copy using its name/region.
 * STRICT NEUTRALITY: paragraphs describe structure and purpose of each section
 * only — no causal claims, no attribution of blame, no political framing.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

// ─── 1. HUMANITARIAN IMPACT ──────────────────────────────────────────────────

export function generateHumanitarianParagraph(name: string): string {
  return `The humanitarian figures above for ${name} are sourced from established international monitoring organizations, tracking the human toll of this situation in concrete, verifiable terms — displacement, casualties, and access to essential services. These figures are presented as factual data points rather than narrative, reflecting WorldCityHub's commitment to neutral, source-based reporting on conflicts and crises affecting civilian populations.`;
}

export function generateHumanitarianAfter(name: string): string {
  return `These figures for ${name} are updated as new verified data becomes available from monitoring organizations, and like all humanitarian statistics in active or recent crises, they should be understood as estimates subject to revision rather than final counts. The humanitarian aid organizations listed further down this page offer direct ways to support people affected by this situation, regardless of how the broader political or military dimensions are understood or debated.`;
}

// ─── 2. ECONOMIC IMPACT ──────────────────────────────────────────────────────

export function generateEconomicParagraph(name: string): string {
  return `The economic impact data above traces how ${name} has affected markets, trade, and commodity prices both regionally and globally, presented as observable economic data rather than commentary on causes or responsibility. Conflicts and crises of this scale typically ripple through global supply chains and pricing in ways that extend well beyond the immediate region, and this section documents those connections factually.`;
}

export function generateEconomicAfter(name: string): string {
  return `The affected industries and price impacts listed above for ${name} reflect documented market data rather than projection or speculation, sourced from the same kind of established economic reporting referenced throughout this site's Rates and Economy pages. Understanding these economic ripple effects helps explain why a situation like ${name}, even when geographically contained, can still affect prices and markets for people far from the region directly involved.`;
}

// ─── 3. PEACE EFFORTS ────────────────────────────────────────────────────────

export function generatePeaceParagraph(name: string): string {
  return `The diplomatic and peace efforts above document formal initiatives aimed at resolving or de-escalating ${name}, presented factually and without endorsement of any particular framework or outcome. Tracking these efforts, including their current status, gives a clearer picture of the diplomatic dimension of this situation alongside the humanitarian and economic data covered elsewhere on this page.`;
}

export function generatePeaceAfter(name: string): string {
  return `Peace processes connected to ${name}, like most diplomatic efforts of this kind, often unfold over extended timeframes with periods of progress and setback, which is why the status shown above reflects the current documented state rather than a prediction of eventual outcome. This page is updated as the status of these efforts changes, maintaining the same neutral, fact-based approach applied throughout the rest of this coverage.`;
}

// ─── 4. AFFECTED CITIES ──────────────────────────────────────────────────────

export function generateCitiesParagraph(name: string): string {
  return `The cities above are directly affected by ${name}, each shown with current status and official travel advisory guidance sourced from recognised government travel advisory services. This information is intended to be practically useful for anyone with reason to travel to or communicate with people in this region, presented with the same factual, non-partisan approach used throughout this page.`;
}

export function generateCitiesAfter(name: string): string {
  return `Travel advisories shown above for cities affected by ${name} can change as conditions evolve, so anyone with an actual need to travel to the region should verify current guidance directly through official government sources before making plans. Each city listed links through to its own dedicated page elsewhere on this site for broader, non-conflict-specific information about daily life, weather, and local conditions.`;
}

// ─── 5. HUMANITARIAN AID ORGANIZATIONS ──────────────────────────────────────

export function generateAidParagraph(name: string): string {
  return `The organizations listed above are established humanitarian groups actively working to address the impact of ${name}, included here with no affiliate relationships or financial incentive — purely as a resource for anyone wanting to support relief efforts directly. Each organization listed has a verifiable track record of humanitarian work, distinct from any political or military dimension of the underlying situation.`;
}

export function generateAidAfter(name: string): string {
  return `Supporting humanitarian relief connected to ${name} through these established organizations is one of the most direct ways individuals can contribute to addressing the human impact documented in the statistics earlier on this page, regardless of how the broader situation is understood politically. WorldCityHub includes these links specifically because they represent legitimate, verifiable humanitarian channels rather than any commercial arrangement.`;
}

// ─── 6. LATEST NEWS ──────────────────────────────────────────────────────────

export function generateNewsParagraph(name: string): string {
  return `News coverage of ${name} above is sourced exclusively from established, internationally recognised wire services and broadcasters — Reuters, AP, BBC, and Al Jazeera — chosen specifically for their editorial standards and broad international sourcing rather than any single national or partisan perspective. This sourcing approach reflects this page's commitment to presenting information about ${name} as neutrally as possible.`;
}

export function generateNewsAfter(name: string): string {
  return `Each article above links directly to its original source, allowing readers to evaluate the full reporting on ${name} themselves rather than relying solely on the headline and summary shown here. Coverage of an evolving situation like ${name} continues developing, and checking back for updated reporting from these same established sources remains the most reliable way to stay informed as the situation unfolds.`;
}

// ─── 7. TRAVEL ADVISORIES ────────────────────────────────────────────────────

export function generateAdvisoriesParagraph(name: string): string {
  return `The travel advisory information above for the region affected by ${name} is sourced from official government travel advisory services, reflecting their official current guidance for travellers considering or required to travel to the area. This information is presented purely for practical safety purposes, separate from any political dimension of the underlying situation.`;
}

export function generateAdvisoriesAfter(name: string): string {
  return `Travel advisories related to ${name} can shift with little notice as conditions change, so anyone with an actual need to travel should check directly with their own government's current official guidance rather than relying solely on the summary shown here. This advisory information complements the affected cities section earlier on this page, together giving practical guidance for anyone with genuine reason to consider travel to the region.`;
}
