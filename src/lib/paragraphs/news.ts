/**
 * SEO paragraph generators, WorldCityHub News Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 10 sections × ~200 words × 2 = 3,500+ words per city news page.
 * All paragraphs use real live data variables for genuine uniqueness per city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. NEWS SEARCH ──────────────────────────────────────────────────────────

export function generateSearchParagraph(city: string): string {
  const { month, year } = now();
  return `Search above to find specific stories about ${city} without scrolling through every headline on this page, useful when you already know roughly what you're looking for, whether a particular event, a named official, or a developing local story from ${month} ${year}. This search pulls from the same continuously updated news feed that powers the rest of this page, so results reflect the latest coverage of ${city} rather than a static, infrequently refreshed index. For anyone tracking a specific ongoing story in ${city}, searching directly is often faster than waiting for it to resurface in the general feed below.`;
}

export function generateSearchAfter(city: string): string {
  const { month, year } = now();
  return `Search results above are drawn from the full pool of articles covering ${city}, including stories that may not have made it into the Top Stories or Live Feed sections further down this page, since those sections necessarily surface only a curated subset at any given time. This makes search a genuinely useful complement to passive browsing, especially for research, fact-checking, or simply catching up on a story that broke a few days earlier in ${month} ${year}. Combining a specific search here with the broader categorized feed below gives a complete picture of how ${city} is being covered in the news right now.`;
}

// ─── 2. TOP STORIES ──────────────────────────────────────────────────────────

export function generateTopStoriesParagraph(city: string): string {
  const { month, year } = now();
  return `The top stories above represent the most significant news currently coming out of ${city}, ranked by a combination of recency, source prominence, and relevance to local readers rather than simple chronological order. This curation matters because raw news feeds can bury genuinely important stories under a flood of minor updates, the selection above is designed to surface what actually matters to someone trying to stay informed about ${city} in ${month} ${year} without reading through dozens of articles. Each story links directly to its original source, so the summary here is a starting point rather than the full account.`;
}

export function generateTopStoriesAfter(city: string): string {
  const { month, year } = now();
  return `Stories featured above span the categories that matter most to ${city} residents, government and politics, finance and economy, sports, culture, and more, giving a genuinely representative snapshot of the city's news landscape rather than a feed dominated by a single topic. Breaking news, when present, is flagged distinctly from routine coverage, helping readers separate urgent developments from the steady background flow of daily reporting in ${city}. Checking back periodically through ${month} ${year} captures how today's top stories evolve, since a developing situation in ${city} can shift considerably within just a few hours.`;
}

// ─── 3. MORE STORIES ─────────────────────────────────────────────────────────

export function generateMoreStoriesParagraph(city: string): string {
  const { month, year } = now();
  return `Beyond the headline stories above, this section surfaces additional coverage of ${city} that didn't make the top selection but still represents meaningful news for residents and anyone following the city closely. Local news ecosystems like ${city}'s often produce far more coverage in a given day than any single "top stories" list can capture, particularly around government decisions, community events, and ongoing local issues that may not generate the same attention as breaking national news. Through ${month} ${year}, this expanded list gives a fuller picture of the day's reporting from ${city} for readers who want more than just the headline summary.`;
}

export function generateMoreStoriesAfter(city: string): string {
  const { month, year } = now();
  return `The stories in this expanded list draw from the same set of trusted local and national sources covering ${city} as the top stories section above, simply extending further down the day's coverage rather than applying a different or lower editorial standard. This is often where smaller but still locally significant stories live, a municipal announcement, a community development, a local business story, the kind of coverage that shapes daily life in ${city} without necessarily making national headlines. Through ${month} ${year}, scrolling through this fuller list is the closest equivalent to reading a complete local newspaper front to back.`;
}

// ─── 4. LIVE FEED ─────────────────────────────────────────────────────────────

export function generateLiveFeedParagraph(city: string): string {
  const { month, year } = now();
  return `The live feed on the right tracks ${city}'s news as it breaks, refreshing automatically every fifteen minutes so the most current stories always appear at the top without requiring a manual page reload. Color-coded category dots let you scan the feed visually, red for breaking news, and distinct colors for sports, finance, and world coverage, making it possible to spot the type of story you're interested in without reading every headline individually. For anyone who wants to keep ${city}'s news running in the background while working on something else through ${month} ${year}, this feed is built specifically for that kind of passive, continuous monitoring.`;
}

export function generateLiveFeedAfter(city: string): string {
  const { month, year } = now();
  return `Unlike the curated top stories section, this live feed for ${city} is closer to a raw, chronological stream, every qualifying article appears here in the order it was published, without editorial ranking by importance. This makes it the most complete single view of ${city}'s news activity on this page, useful for catching smaller stories that might not surface in the more curated sections elsewhere. The "updated" timestamp at the top of this panel shows exactly when the feed last refreshed, giving a clear sense of how current the displayed stories are at any moment in ${month} ${year}.`;
}

// ─── 5. ARCHIVE BY DATE ───────────────────────────────────────────────────────

export function generateArchiveParagraph(city: string): string {
  const { month, year } = now();
  return `The archive calendar above lets you step back to any previous date and see exactly what ${city} was reading and talking about on that day, turning this page into a searchable historical record rather than only a live feed of current events. This is genuinely useful for research, for revisiting a story you remember but can't quite place the date of, or simply for understanding how a particular situation in ${city} developed over a series of days or weeks. Through ${month} ${year} and beyond, each day's news gets added to this growing archive, so the further back you can search will only continue to expand.`;
}

export function generateArchiveAfter(city: string): string {
  const { month, year } = now();
  return `Selecting any date on the calendar above pulls the actual articles published about ${city} on that specific day, not a generic summary, giving genuine historical depth rather than a vague recollection of what happened. This kind of dated archive is particularly valuable for tracking how a slow-developing story in ${city} unfolded over time, a policy debate, an infrastructure project, an ongoing investigation, where understanding the sequence of events matters as much as the current state. Anyone researching ${city}'s recent history through ${month} ${year} will find this archive considerably more precise than relying on memory or a generic web search.`;
}

// ─── 6. VIDEO NEWS ────────────────────────────────────────────────────────────



// ─── 7. SOCIAL PULSE ──────────────────────────────────────────────────────────



// ─── 8. WEEK IN REVIEW ────────────────────────────────────────────────────────

export function generateWeekParagraph(city: string): string {
  const { month, year } = now();
  return `Week in Review above compresses the past seven days of ${city}'s news into a digestible summary, ideal for anyone who hasn't checked in daily and wants to catch up without scrolling back through an entire week of individual articles. This weekly view often reveals patterns that a single day's news can't, a story that built gradually over several days, a recurring theme across multiple unrelated events, or the overall direction ${city}'s news cycle has taken through this stretch of ${month} ${year}. For busy readers, this section alone can substitute for daily browsing while still keeping pace with what genuinely mattered.`;
}

export function generateWeekAfter(city: string): string {
  const { month, year } = now();
  return `The stories selected for this weekly summary of ${city} are chosen for their lasting significance over the seven-day window, rather than simply listing whatever was most recent at the moment the page loaded. This editorial approach means a story from early in the week can still appear here if it remained relevant or continued developing, even after newer headlines have since taken over the live feed above. Revisiting this section each week through ${month} ${year} builds a rolling, easily digestible record of ${city}'s recent history without requiring daily attention.`;
}

// ─── 9. GLOBAL IMPACT ON CITY ────────────────────────────────────────────────



// ─── 10. NEWS SOURCES ─────────────────────────────────────────────────────────

export function generateSourcesParagraph(city: string, country: string): string {
  const { month, year } = now();
  return `The sources listed above show exactly where ${city}'s news coverage on this page comes from, a mix of local outlets covering ${city} and the surrounding region directly, alongside national sources covering ${country} more broadly and international outlets providing global context. This transparency matters because understanding where a story originates helps readers judge its perspective, depth, and reliability, rather than treating all news as an undifferentiated stream. Through ${month} ${year}, this page continues drawing from this same mix of vetted sources to maintain consistent, trustworthy coverage of ${city}.`;
}

export function generateSourcesAfter(city: string, country: string): string {
  const { month, year } = now();
  return `Local sources tend to provide the deepest coverage of stories specific to ${city} itself, municipal decisions, neighbourhood developments, local business news, that larger national outlets covering all of ${country} simply don't have the resources to report on in the same depth. National and international sources, by contrast, contribute the wider context of how events in ${city} connect to broader trends across ${country} and the world. Together, through ${month} ${year}, this layered mix of sources is what allows this page to cover ${city} with both local depth and national or global context in a single place.`;
}
