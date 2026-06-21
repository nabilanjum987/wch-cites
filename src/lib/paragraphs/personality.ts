/**
 * SEO paragraph generators — WorldCityHub Personality Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 4 sections × ~150 words × 2 = 1,200+ words per personality page.
 * Each personality gets genuinely unique copy using name/city/country/title.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

// ─── 1. LIFE TIMELINE ────────────────────────────────────────────────────────

export function generateTimelineParagraph(name: string, city: string): string {
  return `The timeline above traces ${name}'s life chronologically, marking the milestones that shaped both an individual life story and a wider legacy connected to ${city}. Reading a life in sequence like this reveals connections a standalone biography section often can't — how early experiences shaped later decisions, how one achievement opened the door to the next, and how ${name}'s path unfolded across the years rather than arriving fully formed. Each entry below links a specific year to a specific turning point worth understanding in its own right.`;
}

export function generateTimelineAfter(name: string, city: string): string {
  return `This timeline connects directly to ${city}'s own history elsewhere on this site, since ${name}'s story and the city's story are genuinely intertwined — a connection this page is specifically designed to surface for anyone researching either the individual or the place. Major milestones above often correspond to broader historical moments that shaped ${city} and the wider region during the same period, context worth keeping in mind while reading. Returning to this timeline after reading the fuller description sections above often reveals connections that weren't obvious on a first pass.`;
}

// ─── 2. ACHIEVEMENTS ─────────────────────────────────────────────────────────

export function generateAchievementsParagraph(name: string): string {
  return `The achievements above represent the specific, verifiable accomplishments that distinguish ${name}'s career and legacy from a more general biography — concrete markers of impact rather than vague claims to significance. Each achievement carries its own context for why it matters, whether a record, a title, an institution founded, or a recognition earned, giving a fuller sense of ${name}'s actual measurable impact beyond reputation alone. Together, these accomplishments form the evidentiary backbone behind ${name}'s broader historical significance.`;
}

export function generateAchievementsAfter(name: string): string {
  return `These achievements above didn't happen in isolation — each connects back to the fuller narrative covered in the timeline and description sections elsewhere on this page, where the path leading to each accomplishment is explained in greater depth. For anyone researching ${name} specifically, this achievements list offers the fastest way to verify the concrete basis behind ${name}'s reputation, useful for citations, reports, or simply confirming claims found elsewhere. Each entry reflects an accomplishment that has stood the test of historical scrutiny.`;
}

// ─── 3. FAMOUS WORKS ─────────────────────────────────────────────────────────

export function generateWorksParagraph(name: string): string {
  return `${name}'s body of work above represents the tangible output behind the achievements and reputation covered elsewhere on this page — the actual books, creative output, or documented contributions that future generations can directly engage with rather than simply read about secondhand. Each entry includes its own context for significance and, where relevant, the year it was produced, situating individual works within ${name}'s broader career arc shown in the timeline above. This list offers a practical starting point for anyone wanting to engage directly with ${name}'s output.`;
}

export function generateWorksAfter(name: string): string {
  return `Many of ${name}'s works listed above remain in print or otherwise accessible today, meaning this list doubles as a practical reading or research list rather than purely a historical record of past output. The progression of works across different years often mirrors the broader timeline covered earlier on this page, with later works frequently reflecting maturity or shifts in focus compared to earlier output. For deeper engagement with ${name}'s actual contributions beyond this page's summary, seeking out these works directly remains the most authentic path.`;
}

// ─── 4. FAMOUS QUOTES ────────────────────────────────────────────────────────

export function generateQuotesParagraph(name: string): string {
  return `The quotes above, each given context for when and why they were said, offer a more direct window into ${name}'s own voice and thinking than the third-person biographical sections elsewhere on this page can provide. Quotes carry a particular kind of authenticity — they're ${name}'s own words rather than later interpretation or summary, giving readers direct access to how ${name} actually articulated ideas, values, and perspective during specific moments captured here.`;
}

export function generateQuotesAfter(name: string): string {
  return `Each quote above is tied to its original context, whether a specific speech, work, or interview, allowing readers to understand not just what ${name} said but the circumstances that prompted it — context that often changes how a quote should be understood. These quotes frequently connect to specific moments covered in the timeline above, where the fuller circumstances behind each statement are explained in greater depth. Taken together with the rest of this page, these quotes round out a fuller picture of ${name} beyond dates and achievements alone.`;
}
