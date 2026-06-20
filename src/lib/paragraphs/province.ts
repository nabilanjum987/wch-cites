/**
 * SEO paragraph generators — WorldCityHub Province Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 8 sections × ~200 words × 2 = 3,000+ words per province page.
 * All paragraphs use real live data variables for genuine uniqueness per province.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. PROVINCE OVERVIEW ───────────────────────────────────────────────────

export function generateOverviewParagraph(province: string, country: string, capital: string): string {
  const { month, year } = now();
  return `${province} is one of ${country}'s primary administrative regions, anchored by ${capital} as its capital and carrying its own distinct population, land area, and economic footprint within the wider country. The figures above — population, area, and GDP contribution — give the essential reference points for understanding ${province}'s scale and significance relative to the rest of ${country}. Through ${month} ${year}, these fundamentals provide context for everything else covered on this page, from the province's major cities to its leading industries.`;
}

export function generateOverviewAfter(province: string, country: string): string {
  const { month, year } = now();
  return `Population and land area together determine ${province}'s population density, a figure that shapes everything from urban infrastructure strain in its major cities to the character of rural life across the wider province. The GDP contribution figure above places ${province} within ${country}'s broader national economy, context that connects directly to the more detailed Province Economy section further down this page. Through ${month} ${year}, these overview figures remain the starting point for any deeper exploration of what makes ${province} distinct within ${country}.`;
}

// ─── 2. MAJOR CITIES ─────────────────────────────────────────────────────────

export function generateCitiesParagraph(province: string): string {
  const { month, year } = now();
  return `${province}'s major cities above each carry their own population, current weather, and distinct local character, together forming the urban backbone of the wider province. Tapping through to any city above leads to its own dedicated page with considerably deeper coverage — weather forecasts, prayer times, local rates, news, events, and more — making this grid a launching point rather than a complete picture in itself. Through ${month} ${year}, these cities represent where the large majority of ${province}'s population, economic activity, and daily life is concentrated.`;
}

export function generateCitiesAfter(province: string): string {
  const { month, year } = now();
  return `Population figures shown alongside each city above reveal the relative scale of urban centres across ${province}, useful context for understanding which cities serve as genuine economic and population hubs versus smaller regional centres. Each city's character within ${province} often differs meaningfully — some built around heavy industry, others around agriculture, trade, or administration — a variation that becomes clearer when exploring each city's individual dedicated page. Through ${month} ${year}, this grid offers the fastest way to navigate from a province-level view down to the specific city-level detail covered elsewhere on this site.`;
}

// ─── 3. WEATHER ACROSS PROVINCE ──────────────────────────────────────────────

export function generateWeatherParagraph(province: string): string {
  const { month, year } = now();
  return `Current conditions across ${province}'s major cities above give a quick comparative snapshot of weather variation within the province, useful for travel planning or simply understanding how climate shifts across different parts of ${province} on a given day. Provinces spanning significant geographic distance often see meaningfully different conditions between their northern and southern, or coastal and inland, cities even on the same date in ${month} ${year}. This condensed view complements the fuller weather forecasts available on each individual city's dedicated weather page elsewhere on this site.`;
}

export function generateWeatherAfter(province: string): string {
  const { month, year } = now();
  return `This snapshot updates live alongside each city's individual weather page, ensuring the temperatures shown above always reflect current conditions across ${province} rather than a static daily average. For anyone planning travel within ${province} or deciding between cities for a visit, comparing conditions side by side like this is considerably faster than checking each city's forecast individually. Through ${month} ${year} and across the seasons, this comparative view becomes especially useful during periods when different parts of ${province} are experiencing notably different weather from each other.`;
}

// ─── 4. PROVINCE ECONOMY ─────────────────────────────────────────────────────

export function generateEconomyParagraph(province: string, country: string): string {
  const { month, year } = now();
  return `${province}'s economic contribution to ${country} above reflects the province's role within the wider national economy, a figure shaped by its mix of industries, population, and infrastructure relative to the rest of the country. Provincial GDP contribution doesn't always track proportionally with population share — some provinces punch above their population weight economically due to concentrated industry or trade activity, while others contribute a smaller economic share relative to how many people live there. Through ${month} ${year}, this economic snapshot offers context for understanding ${province}'s significance within ${country} beyond population figures alone.`;
}

export function generateEconomyAfter(province: string, country: string): string {
  const { month, year } = now();
  return `The population share figure above, alongside the GDP contribution, together reveal whether ${province}'s economic weight within ${country} is proportional to, above, or below its population share — a useful indicator of relative economic productivity and development concentration within the province. This economic snapshot connects directly to the Major Industries section further down this page, where the specific sectors driving ${province}'s contribution to ${country}'s economy are detailed individually. Through ${month} ${year}, understanding this economic role provides useful context for ${province}'s broader significance within the national conversation.`;
}

// ─── 5. MAJOR INDUSTRIES ─────────────────────────────────────────────────────

export function generateIndustriesParagraph(province: string): string {
  const { month, year } = now();
  return `${province}'s major industries above represent the economic sectors driving employment, exports, and GDP contribution across the province, each shaped by ${province}'s particular geography, resources, and historical economic development. Understanding this industrial mix explains a great deal about daily life in ${province} — which sectors offer the most local employment, what goods and services the region is known for producing, and how the province's economy is likely to respond to broader national or global economic shifts through ${month} ${year}.`;
}

export function generateIndustriesAfter(province: string, country: string): string {
  const { month, year } = now();
  return `Each industry above typically concentrates in specific cities or regions within ${province} rather than spreading evenly across the entire province, a pattern connected to the Major Cities section earlier on this page where each city's particular economic character becomes clearer. These industries connect directly to the famous products covered in the next section, since provincial industries are often precisely what produces the goods ${province} has become known for, both within ${country} and sometimes internationally. Through ${month} ${year}, this industrial base remains the foundation of ${province}'s ongoing economic identity.`;
}

// ─── 6. FAMOUS PRODUCTS ──────────────────────────────────────────────────────

export function generateProductsParagraph(province: string): string {
  const { month, year } = now();
  return `${province}'s famous products above represent the goods the province has built a genuine reputation for, whether agricultural specialties, manufactured items, or craft traditions passed down through generations of local producers. Products marked with particular distinction typically carry recognition well beyond ${province}'s own borders, sometimes becoming genuinely associated with the province's identity in broader national or even international perception. Through ${month} ${year}, this list connects directly to the industries covered in the previous section, since these products are often the tangible output of ${province}'s leading economic sectors.`;
}

export function generateProductsAfter(province: string): string {
  const { month, year } = now();
  return `These products often trace back to specific local conditions unique to ${province} — particular soil and climate for agricultural goods, or specific craft traditions and skilled labor pools for manufactured items — making them genuinely difficult to replicate elsewhere even within the same country. For visitors to ${province}, seeking out these famous products locally, whether at markets or directly from producers, often provides a more authentic experience than purchasing the same items shipped elsewhere. Through ${month} ${year}, this list continues to reflect the products most closely associated with ${province}'s economic and cultural identity.`;
}

// ─── 7. NOTABLE LANDMARKS ────────────────────────────────────────────────────

export function generateLandmarksParagraph(province: string, capital: string): string {
  const { month, year } = now();
  return `${province}'s notable landmarks above, concentrated largely around ${capital}, represent the historical, religious, and civic sites that define the province's physical and cultural heritage. These landmarks often serve as the first stop for visitors to ${province} and remain genuine points of local pride for residents, connecting the province's present to its history across generations. Through ${month} ${year}, this selection offers a starting point for exploring ${province} beyond its economic and demographic statistics covered elsewhere on this page.`;
}

export function generateLandmarksAfter(province: string, capital: string): string {
  const { month, year } = now();
  return `Many of these landmarks in and around ${capital} continue serving active civic or religious functions today rather than existing purely as historical sites, meaning a visit often involves observing genuine local life alongside the heritage value of the location itself. For deeper coverage of any individual city's specific landmarks beyond this province-wide overview, each city's own dedicated page elsewhere on this site offers considerably more detailed local context. Through ${month} ${year}, these sites remain central to understanding ${province}'s cultural and historical character beyond its economic statistics.`;
}

// ─── 8. EMERGENCY CONTACTS ───────────────────────────────────────────────────

export function generateEmergencyParagraph(province: string, country: string): string {
  const { month, year } = now();
  return `The emergency contact numbers above for police, ambulance, and fire services apply across ${province} and the whole of ${country}, essential information worth knowing before you need it whether you're a long-term resident of the province or simply visiting. These numbers connect to the same national emergency response services covered on ${country}'s main country page, working consistently regardless of which specific city or district within ${province} you happen to be in. Through ${month} ${year}, saving these numbers directly to a phone is a small but genuinely worthwhile precaution for anyone spending time in ${province}.`;
}

export function generateEmergencyAfter(province: string, country: string): string {
  const { month, year } = now();
  return `These emergency numbers remain identical across every province within ${country}, since emergency response is organised at the national level rather than varying province by province, meaning the same numbers apply whether you're in ${province} or anywhere else in ${country}. For broader national context beyond ${province} specifically — country-wide economic data, national holidays, or neighbouring countries — ${country}'s main country page elsewhere on this site offers that wider view. Through ${month} ${year}, this page's combination of province-specific detail and these universally applicable emergency numbers rounds out a complete picture of life in ${province}.`;
}
