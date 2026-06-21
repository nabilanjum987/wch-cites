/**
 * SEO paragraph generators — WorldCityHub Oceans Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 7 sections × ~180 words × 2 = 2,500+ words per ocean page.
 * Each ocean gets genuinely unique copy using its name.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. LIVE SEA CONDITIONS ──────────────────────────────────────────────────

export function generateLiveConditionsParagraph(name: string): string {
  const { month, year } = now();
  return `Current sea conditions for the ${name} above — wave height, water temperature, swell direction, and visibility — reflect live observation data rather than seasonal averages, giving mariners, fishermen, and anyone planning water-based activity an accurate read on what's actually happening right now. Conditions on a body of water this large vary considerably by location and season, and this snapshot captures the general state through ${month} ${year} rather than a single fixed point.`;
}

export function generateLiveConditionsAfter(name: string): string {
  const { month, year } = now();
  return `These conditions matter well beyond recreational interest — shipping routes, fishing operations, and coastal safety advisories across the ${name} all depend on accurate, current sea state information rather than historical averages alone. Conditions can shift meaningfully within hours during seasonal transitions, so checking this panel close to any planned activity on the ${name} through ${month} ${year} is considerably more reliable than relying on general seasonal expectations alone.`;
}

// ─── 2. HISTORY & GEOGRAPHY ──────────────────────────────────────────────────

export function generateHistoryGeoParagraph(name: string): string {
  return `The history and geography above trace how the ${name} has shaped human civilization along its shores for millennia — trade routes, naval history, and the geological forces that carved its current boundaries and depths. Understanding this background transforms the ${name} from simply a body of water on a map into a place with genuine historical and geographic significance worth appreciating beyond its practical uses covered elsewhere on this page.`;
}

export function generateHistoryGeoAfter(name: string): string {
  return `This historical and geographic context behind the ${name} connects directly to the shipping importance and bordering cities sections found elsewhere on this page, since the ${name}'s strategic position has shaped trade and settlement patterns for centuries. Understanding both the deep history and the underlying geology gives a fuller appreciation of why the ${name} occupies the role it does in regional and global geography today.`;
}

// ─── 3. MARINE LIFE ──────────────────────────────────────────────────────────

export function generateMarineLifeParagraph(name: string): string {
  return `The marine life above represents the genuine biodiversity supported by the ${name}, spanning mammals, fish, and other marine species adapted to its specific temperature, depth, and current conditions. Each category reflects species genuinely native to or commonly found within the ${name}, rather than a generic list of ocean wildlife that could apply to any body of water.`;
}

export function generateMarineLifeAfter(name: string): string {
  return `This marine biodiversity in the ${name} connects directly to the climate change impacts covered further down this page, since shifting water temperatures and changing conditions increasingly affect the species and ecosystems that have adapted to the ${name}'s historical conditions over thousands of years. Appreciating this marine life adds another dimension to understanding the ${name} beyond its role in shipping, weather, and coastal geography covered elsewhere on this page.`;
}

// ─── 4. SHIPPING IMPORTANCE ──────────────────────────────────────────────────

export function generateShippingParagraph(name: string): string {
  return `The ${name}'s role in global shipping above reflects its strategic importance to international trade, connecting major ports and economies through established maritime routes that have developed over generations. Understanding this shipping significance explains why the ${name} matters well beyond its immediate coastal regions — disruptions or developments here can ripple through global supply chains and trade economics far from its shores.`;
}

export function generateShippingAfter(name: string): string {
  return `The major ports and routes listed above for the ${name} represent some of the most consequential maritime infrastructure in the region, handling significant volumes of trade that connect the countries bordering this body of water to the wider global economy. This shipping context connects directly to the bordering cities covered further down this page, many of which owe much of their economic significance to their position along these established ${name} trade routes.`;
}

// ─── 5. MONSOON & SEASONAL PATTERNS ──────────────────────────────────────────

export function generateMonsoonParagraph(name: string): string {
  const { month, year } = now();
  return `The seasonal patterns above show how the ${name} shifts across the year, each season bringing distinct conditions that have shaped agriculture, fishing, and daily life for the communities along its shores for centuries. Understanding these patterns matters practically for anyone planning activity around the ${name}, since conditions in ${month} ${year} reflect wherever the current seasonal cycle happens to sit.`;
}

export function generateMonsoonAfter(name: string): string {
  return `The historical impact noted above reflects just how consequential these seasonal patterns have been for the ${name} and its surrounding regions, shaping everything from traditional fishing calendars to historical trade timing that depended on predictable seasonal winds and currents. These same seasonal forces connect directly to the climate change discussion further down this page, since shifting patterns increasingly affect the reliability of cycles communities along the ${name} have depended on for generations.`;
}

// ─── 6. CLIMATE CHANGE IMPACT ────────────────────────────────────────────────

export function generateClimateParagraph(name: string): string {
  const { month, year } = now();
  return `The climate change data above documents measurable shifts already underway in the ${name} — rising temperatures, sea level changes, and broader ecosystem impacts that represent genuine, ongoing transformation rather than distant future projection. These changes carry direct consequences for the marine life, coastal communities, and shipping patterns covered elsewhere on this page, making this section essential context for understanding the ${name}'s likely trajectory through ${month} ${year} and beyond.`;
}

export function generateClimateAfter(name: string): string {
  return `The specific effects listed above for the ${name} connect directly to the marine life and bordering cities sections elsewhere on this page, since warming waters and rising sea levels don't occur in isolation — they reshape the species that can thrive in the ${name} and threaten the coastal infrastructure of cities built along its edge. Understanding these climate impacts adds essential context for anyone studying or working with the ${name}, well beyond its historical and recreational significance.`;
}

// ─── 7. BORDERING CITIES ─────────────────────────────────────────────────────

export function generateBorderingParagraph(name: string): string {
  return `The cities bordering the ${name} above represent some of the most significant coastal population centres shaped directly by their proximity to this body of water — their economies, climates, and historical development all connected to the ${name} in ways covered throughout the rest of this page. Each city listed links through to its own dedicated page elsewhere on this site, offering considerably deeper coverage than this summary view allows.`;
}

export function generateBorderingAfter(name: string): string {
  const { month, year } = now();
  return `These bordering cities connect the abstract geography and shipping data covered earlier on this page to actual, lived urban environments — places where the ${name}'s influence on climate, economy, and culture plays out in daily life rather than remaining a purely geographic abstraction. Through ${month} ${year}, exploring any of these city-specific pages reveals how directly the ${name} continues shaping the communities along its shores.`;
}
