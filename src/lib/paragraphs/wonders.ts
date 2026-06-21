/**
 * SEO paragraph generators — WorldCityHub Wonders Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 6 sections × ~180 words × 2 = 2,200+ words per wonder page.
 * Each wonder gets genuinely unique copy using name/city/country.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

// ─── 1. VISITOR GUIDE TODAY ──────────────────────────────────────────────────

export function generateVisitorGuideParagraph(name: string): string {
  return `Planning a visit to ${name} involves more than simply showing up — what to wear, what it costs, what's restricted, and how to actually get there each shape whether the visit goes smoothly. The guide above covers all four of these practical dimensions together, translating general visitor advice into the specific details that apply to ${name} rather than generic travel guidance that could apply to any destination.`;
}

export function generateVisitorGuideAfter(name: string): string {
  return `Following the practical guidance above — particularly the rules section — matters not just for a smooth visit but for helping preserve ${name} for future visitors, since heritage sites like this one are often more fragile than their monumental scale might suggest. Combining this visitor guide with the photography tips and best visiting time information found elsewhere on this page gives a genuinely complete picture for planning a visit to ${name} that makes the most of the time spent there.`;
}

// ─── 2. THE STORY ────────────────────────────────────────────────────────────

export function generateStoryParagraph(name: string, city: string): string {
  return `The history above traces how ${name} came to be built and the centuries of significance that have accumulated since, context that transforms a visit from simply viewing an impressive structure into genuinely understanding what makes it matter. Few wonders carry significance purely through scale or beauty alone — the story behind ${name} and its connection to ${city} is what elevates it to genuine wonder status.`;
}

export function generateStoryAfter(name: string): string {
  return `This historical context behind ${name} connects directly to the architectural details covered in the next section, since understanding the history makes specific design choices and construction techniques considerably more meaningful than viewing them in isolation. For deeper reading beyond this summary, the Wikipedia link above offers considerably more extensive historical detail than fits within a single page focused on practical visitor information for ${name}.`;
}

// ─── 3. ARCHITECTURE ─────────────────────────────────────────────────────────

export function generateArchitectureParagraph(name: string): string {
  return `${name}'s architectural details above reveal the specific engineering and design choices that distinguish it from comparable structures, the kind of technical detail that turns appreciation of the wonder from purely visual into genuinely informed. Understanding these unique features connects directly to the history covered earlier on this page, since architectural choices typically reflect both the technological capabilities and cultural priorities of the era when ${name} was constructed.`;
}

export function generateArchitectureAfter(name: string): string {
  return `Many of the architectural features highlighted above remain genuinely impressive by modern engineering standards, a reminder that ${name}'s builders worked with remarkable skill and ambition using the tools and materials available to them at the time. These design elements are also what photography enthusiasts most often seek to capture, a connection explored further in the photography guide section elsewhere on this page. Appreciating these details in person rather than through photos alone remains one of the most compelling reasons to visit ${name} directly.`;
}

// ─── 4. SURPRISING FACTS ─────────────────────────────────────────────────────

export function generateFactsParagraph(name: string): string {
  return `The surprising facts above go beyond the standard historical and architectural overview covered elsewhere on this page, surfacing the kind of unexpected details that rarely appear in conventional guidebook descriptions of ${name}. These facts are specifically chosen for their capacity to genuinely surprise even visitors who already know the basic history and significance of the wonder, offering fresh angles on a site that might otherwise feel thoroughly covered by the rest of this page.`;
}

export function generateFactsAfter(name: string): string {
  return `These facts about ${name} are the kind of details worth sharing with fellow visitors or remembering for later conversation, the small but genuinely interesting specifics that make a visit memorable beyond the obvious visual impact. Each fact above is verifiable and grounded in genuine historical or scientific detail about ${name} rather than the kind of loosely sourced trivia that often circulates about major landmarks.`;
}

// ─── 5. PHOTOGRAPHY GUIDE TODAY ──────────────────────────────────────────────

export function generatePhotographyParagraph(name: string): string {
  return `Capturing ${name} well requires more than simply pointing a camera at an impressive structure — timing, vantage point, and a few technical considerations make the difference between a forgettable snapshot and a genuinely striking photograph. The guidance above, combining today's specific best timing with established photo spots and practical tips, gives both casual visitors and serious photographers a real edge for capturing ${name} at its best.`;
}

export function generatePhotographyAfter(name: string): string {
  return `The specific photo spots identified above for ${name} reflect locations that consistently produce strong results, vetted through repeated visits rather than guesswork, while the timing guidance accounts for how lighting at ${name} shifts meaningfully across the day. Combining this photography guidance with the architectural details covered earlier on this page helps identify which specific features are most worth framing deliberately rather than capturing incidentally.`;
}

// ─── 6. NEARBY WONDERS ───────────────────────────────────────────────────────

export function generateNearbyParagraph(name: string, city: string): string {
  return `The nearby wonders above sit close enough to ${name} to realistically combine into an extended visit, useful for anyone making the trip to this part of ${city} and wanting to make the most of the journey rather than visiting a single site in isolation. Distance figures shown for each nearby wonder give a realistic sense of how much additional time a combined visit would require.`;
}

export function generateNearbyAfter(name: string, city: string): string {
  return `Many of these nearby wonders share historical or cultural connections with ${name}, often built during overlapping periods or by related patrons, context worth understanding together rather than treating each as an entirely separate destination. Each nearby wonder links through to its own dedicated page with the same depth of practical and historical detail found here for ${name}, making it straightforward to plan a fuller, multi-site visit to this part of ${city}.`;
}
