/**
 * SEO paragraph generators — WorldCityHub Personality Page
 *
 * TWO short paragraphs per section: para_before (introduces the
 * section that FOLLOWS it) + para_after (reflects on the section
 * ABOVE it). Honesty rules (personalities family fix, S3):
 *   • A paragraph never points at its section as "above" when the
 *     section follows it, or claims connections the page does not
 *     contain.
 *   • No em dashes.
 *   • The quotes paragraphs make no "own words / original context"
 *     overclaim: the wording is "well-documented words, with the
 *     setting where it is reliably recorded".
 * Each paragraph is composed only from the profile's own fields
 * (name, city) — no facts are asserted beyond what the section it
 * frames actually shows.
 */

// ─── 1. LIFE TIMELINE ────────────────────────────────────────────────────────

export function generateTimelineParagraph(name: string, city: string): string {
  return `A life is easiest to follow in the order it was lived. The timeline that follows traces ${name}'s years in sequence: the early life, the turning points and the milestones that built a lasting connection to ${city}. Read in order, each entry shows how one step led to the next.`;
}

export function generateTimelineAfter(name: string, city: string): string {
  return `Taken together, these entries give the shape of ${name}'s life at a glance, and the outline of a connection to ${city} that the rest of this page fills in. The other sections add the detail behind the milestones: what was achieved, what was made, and what was said along the way.`;
}

// ─── 2. ACHIEVEMENTS ─────────────────────────────────────────────────────────

export function generateAchievementsParagraph(name: string): string {
  return `These are the concrete accomplishments behind ${name}'s reputation: records set, titles earned, institutions founded and honours received. Each entry states what was done and why it matters, so the claim on a reader's attention rests on evidence rather than praise.`;
}

export function generateAchievementsAfter(name: string): string {
  return `No achievement stands on its own: each grew out of the years of work traced in this profile's timeline. For the fastest check of what ${name} is remembered for, and the concrete basis for it, this is the section to cite.`;
}

// ─── 3. FAMOUS WORKS ─────────────────────────────────────────────────────────

export function generateWorksParagraph(name: string): string {
  return `The works listed here are the tangible output of ${name}'s career: the books, poems, recordings and institutions that readers can still engage with directly. Each entry carries its year, where one is recorded, and a note on why it matters.`;
}

export function generateWorksAfter(name: string): string {
  return `Read in order, the works show the arc of a career, from early pieces to the mature output that made a reputation. Many remain available today, and they are the most direct route into what ${name} actually contributed.`;
}

// ─── 4. FAMOUS QUOTES ────────────────────────────────────────────────────────

export function generateQuotesParagraph(name: string): string {
  return `Recorded words are the closest a profile comes to a person's own voice. The quotations here are ${name}'s well-documented words; where a setting is reliably recorded, it is given alongside, so each quote can be read in the circumstances that produced it.`;
}

export function generateQuotesAfter(name: string): string {
  return `Read against the timeline, these words belong to the moments they came from: a speech, a poem, an interview. They are one part of the record this profile assembles, alongside the dated facts of a life and the work that survived it.`;
}
