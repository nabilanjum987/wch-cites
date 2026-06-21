/**
 * SEO paragraph generators — WorldCityHub Compare Cities Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 5 sections × ~180 words × 2 = 1,800+ words per comparison page.
 * Each comparison gets genuinely unique copy using both city names.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. LIVE CONDITIONS ──────────────────────────────────────────────────────

export function generateLiveConditionsParagraph(city1: string, city2: string): string {
  const { month, year } = now();
  return `The live conditions above place ${city1} and ${city2} side by side at this exact moment — current weather, air quality, gold rates, and currency, all updating in real time rather than relying on outdated averages. This kind of direct, simultaneous comparison reveals differences that separate research on each city individually often misses, since checking ${city1} and ${city2} at different times can obscure how the two genuinely compare on any given day in ${month} ${year}.`;
}

export function generateLiveConditionsAfter(city1: string, city2: string): string {
  const { month, year } = now();
  return `These live figures for ${city1} and ${city2} are pulled from the same data feeding each city's own dedicated weather and rates pages elsewhere on this site, ensuring full consistency rather than separately sourced numbers that might conflict. Day-to-day conditions naturally fluctuate, so a single snapshot comparison in ${month} ${year} is best read alongside the more structural metrics covered in the comprehensive comparison further down this page, rather than as the sole basis for any major decision between ${city1} and ${city2}.`;
}

// ─── 2. COMPREHENSIVE COMPARISON ─────────────────────────────────────────────

export function generateComprehensiveParagraph(city1: string, city2: string): string {
  return `The comprehensive comparison above scores ${city1} and ${city2} across eleven distinct categories — from cost of living and safety to culture, food, education, and healthcare — giving a structured, multi-dimensional view rather than a single oversimplified verdict on which city is "better." Each category captures a genuinely different aspect of daily life, and ${city1} and ${city2} rarely lead identically across all of them, which is exactly why a full breakdown matters more than any single headline statistic.`;
}

export function generateComprehensiveAfter(city1: string, city2: string): string {
  return `Reading this table category by category, rather than only at the overall score, reveals where ${city1} and ${city2} genuinely differ versus where they're closely matched — a distinction that matters enormously depending on what you personally prioritise. Someone weighing cost of living heavily will draw a different conclusion from this same data than someone prioritising culture or healthcare, which is why this comparison is structured to support your own decision-making rather than impose a single ranking between ${city1} and ${city2}.`;
}

// ─── 3. WHICH CITY SHOULD YOU CHOOSE ─────────────────────────────────────────

export function generateVerdictParagraph(city1: string, city2: string): string {
  return `Moving beyond raw scores, the breakdown above translates the comprehensive comparison data into practical, scenario-based guidance — specific reasons someone might choose ${city1} versus specific reasons someone might choose ${city2}, based on what each city genuinely does best. This kind of decision-oriented framing is often more useful than scores alone, since the right choice between ${city1} and ${city2} depends entirely on individual priorities rather than which city scores marginally higher overall.`;
}

export function generateVerdictAfter(city1: string, city2: string): string {
  return `The bottom-line recommendation above synthesises the full comparison into a single practical takeaway, though it's worth treating as a starting point for further thinking rather than a definitive final answer, since personal circumstances inevitably weigh certain factors more heavily than this general guidance can account for. Whether ${city1} or ${city2} ultimately suits you better often comes down to a small number of priorities that matter most specifically to your situation — career, family, climate preference, or cost — each worth weighing individually against this broader comparison.`;
}

// ─── 4. WHAT PEOPLE SAY ──────────────────────────────────────────────────────

export function generateReviewsParagraph(city1: string, city2: string): string {
  return `The firsthand perspectives above come from people who've actually made the choice between ${city1} and ${city2}, offering a genuinely different kind of insight than the statistical comparison covered elsewhere on this page — lived experience rather than aggregated data. These accounts often surface details that don't show up in standard metrics: the texture of daily life, the small frustrations and unexpected delights that come with actually living in ${city1} versus ${city2} rather than just visiting or researching from a distance.`;
}

export function generateReviewsAfter(city1: string, city2: string): string {
  return `These perspectives should be read as individual experiences rather than universal truths about ${city1} or ${city2}, since personal circumstances, expectations, and priorities shape how any single person experiences a city. Still, recurring themes across multiple reviews — whether about ${city1}'s pace of life or ${city2}'s job market, for instance — tend to reflect genuine, broadly shared patterns worth weighing alongside the harder data covered earlier on this page.`;
}

// ─── 5. EXPLORE FULL CITY GUIDES ─────────────────────────────────────────────

export function generateGuidesParagraph(city1: string, city2: string): string {
  return `This comparison page necessarily condenses ${city1} and ${city2} down to a handful of comparative metrics, but each city's own dedicated page elsewhere on this site offers considerably deeper coverage — weather, prayer times, local rates, news, events, economy, and sports, each covered in genuine depth specific to that single city. The links above take you from this side-by-side comparison into the fuller, standalone picture of whichever city interests you most.`;
}

export function generateGuidesAfter(city1: string, city2: string): string {
  return `Whether you ultimately lean toward ${city1} or ${city2} based on this comparison, exploring the individual city guide is the natural next step for genuinely understanding daily life there beyond the comparative framing used throughout this page. These dedicated guides update continuously with live data, offering an ongoing resource rather than a static snapshot — useful whether you're planning a visit, considering a move, or simply curious how ${city1} and ${city2} are each doing today.`;
}
