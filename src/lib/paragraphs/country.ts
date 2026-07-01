/**
 * SEO paragraph generators — WorldCityHub Country Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 10 sections × ~200 words × 2 = 3,500+ words per country page.
 * All paragraphs use real live data variables for genuine uniqueness per country.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. MAJOR CITIES WEATHER ────────────────────────────────────────────────

export function generateCitiesWeatherParagraph(country: string): string {
  const { month, year } = now();
  return `Current weather across ${country}'s major cities above gives a quick snapshot of conditions nationwide in a single glance, useful for travellers planning a route across the country or anyone simply curious how climate varies between ${country}'s biggest urban centres right now. A country as geographically varied as ${country} often sees meaningfully different conditions between cities on the same day — coastal cities, inland plains, and higher-altitude regions can each be experiencing a distinctly different ${month} ${year}. Tapping any city above takes you through to that city's full dedicated weather page for the complete forecast.`;
}

export function generateCitiesWeatherAfter(country: string): string {
  const { month, year } = now();
  return `This nationwide snapshot updates live alongside each city's individual weather page elsewhere on this site, so the temperatures shown above always reflect current conditions rather than a static daily average. For anyone deciding between multiple ${country} cities for travel or relocation, comparing conditions side by side like this is considerably faster than checking each city's forecast individually. Through ${month} ${year} and across the seasons, this comparative view becomes especially useful during periods when ${country}'s regions are experiencing notably different weather patterns from each other.`;
}

// ─── 2. COUNTRY FACTS ────────────────────────────────────────────────────────

export function generateFactsParagraph(country: string, capital: string): string {
  const { month, year } = now();
  return `The core facts above — population, land area, capital, currency, primary language, and system of government — form the essential reference points for understanding ${country} at a glance, the kind of details useful whether researching for travel, business, study, or general interest. ${capital} serves as ${country}'s capital, typically the seat of national government and often, though not always, the country's largest or most internationally recognised city. Through ${month} ${year}, these foundational facts change rarely if at all, making this section a reliable quick-reference unlike the more frequently updated economic and weather data found elsewhere on this page.`;
}

export function generateFactsAfter(country: string): string {
  const { month, year } = now();
  return `Population and land area together determine ${country}'s population density, a figure that shapes everything from urban planning to infrastructure strain to the character of daily life in the country's major cities. The government type and currency listed above provide essential context for anyone engaging with ${country} economically or politically — understanding the system of governance helps explain how policy decisions get made, while the currency connects directly to the live exchange rate and inflation figures covered in the Economy Dashboard further down this page. Through ${month} ${year}, these fundamentals remain the starting point for any deeper exploration of ${country}.`;
}

// ─── 3. LIVE DATA STRIP ──────────────────────────────────────────────────────

export function generateLiveDataParagraph(country: string): string {
  const { month, year } = now();
  return `The live data strip above pulls together ${country}'s currency exchange rate, GDP, and inflation figures into a single condensed view, giving the fastest possible read on current economic conditions without navigating to the dedicated Rates or Economy pages elsewhere on this site. These three figures are deliberately chosen because they shift at different speeds — currency rates can move daily, while GDP and inflation reflect slower, more structural trends — together giving a layered view of ${country}'s economy at this moment in ${month} ${year}. The prayer time shown alongside reflects the current schedule in ${country}'s capital specifically.`;
}

export function generateLiveDataAfter(country: string): string {
  const { month, year } = now();
  return `This condensed strip is intentionally minimal, designed as a quick-glance summary rather than a full breakdown — anyone wanting deeper detail on any of these figures will find dedicated sections with fuller context, historical trends, and explanatory analysis on this site's Rates and Economy pages for ${country}. Checking this strip periodically through ${month} ${year} is a fast way to stay roughly oriented on ${country}'s economic direction without committing to reading the more detailed pages every time. The figures here refresh on the same schedule as their full dedicated page counterparts.`;
}

// ─── 4. STATES / PROVINCES ───────────────────────────────────────────────────

export function generateProvincesParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s states and provinces above represent the country's primary administrative divisions, each with its own capital, population, and land area, and often with meaningfully different economic character, culture, and even climate from the others. Understanding this provincial structure matters for anything beyond surface-level knowledge of ${country} — local governance, regional economic differences, and even accent and cultural variation in ${country} typically follow these provincial boundaries more closely than the national average would suggest. Through ${month} ${year}, tapping any province above leads to its own dedicated page with deeper detail on that specific region.`;
}

export function generateProvincesAfter(country: string): string {
  const { month, year } = now();
  return `Population and area figures shown for each province above reveal significant internal variation within ${country} that a single national average obscures — some provinces are densely urban and relatively small in land area, while others span vast, sparsely populated territory. This kind of regional breakdown is essential for anyone researching ${country} beyond its capital or largest city, since provincial capitals and major cities each carry their own distinct economic and cultural identity. Through ${month} ${year}, exploring individual province pages reveals a considerably more detailed and locally accurate picture of ${country} than the national-level data on this page alone can provide.`;
}

// ─── 5. FAMOUS PERSONALITIES ────────────────────────────────────────────────

export function generatePersonalitiesParagraph(country: string): string {
  const { month, year } = now();
  return `The personalities featured above represent some of ${country}'s most significant historical and contemporary figures, spanning fields from politics and literature to science, sports, and the arts — individuals whose achievements have shaped ${country}'s national identity and international reputation. Each profile links through to a fuller biography, offering more depth than the brief summary card shown here. Through ${month} ${year}, this rotating selection highlights different figures across different fields, giving a broader sense of ${country}'s contributions across multiple domains rather than concentrating on any single area of achievement.`;
}

export function generatePersonalitiesAfter(country: string): string {
  const { month, year } = now();
  return `These figures are often taught in schools across ${country} and referenced regularly in national media, making them genuinely useful starting points for understanding what ${country} values and celebrates as a nation, beyond what statistics and economic figures alone can convey. For visitors or newcomers to ${country}, recognising these names provides useful cultural context — references that locals will assume familiarity with in everyday conversation. Through ${month} ${year}, this list continues to reflect the individuals most closely associated with ${country}'s achievements and national story.`;
}

// ─── 6. FAMOUS PLACES ────────────────────────────────────────────────────────

export function generatePlacesParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s famous places above span the landmarks, natural wonders, and religious or historical sites that define the country's physical and cultural geography — the destinations that draw both domestic and international visitors and that locals point to with genuine pride. Several carry UNESCO World Heritage status, marking them as sites of outstanding universal value recognised well beyond ${country}'s own borders. Through ${month} ${year}, this selection offers a starting point for travel planning or simply a deeper appreciation of what makes ${country}'s landscape and heritage distinctive.`;
}

export function generatePlacesAfter(country: string): string {
  const { month, year } = now();
  return `Each landmark above is tied to a specific city within ${country}, connecting this national overview to the more detailed city-level pages found elsewhere on this site where deeper local context, practical visiting information, and surrounding attractions are covered in fuller depth. The mix of mountain, religious, natural, and architectural sites reflects ${country}'s genuinely varied geography and history, rarely reducible to a single defining landscape or era. Through ${month} ${year}, this section continues to highlight the destinations most representative of what makes ${country} worth exploring beyond its major cities.`;
}

// ─── 7. ECONOMY DASHBOARD ────────────────────────────────────────────────────

export function generateEconomyDashboardParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s economy dashboard above condenses GDP, growth rate, inflation, and unemployment into four headline figures, giving the fastest possible read on overall economic health without navigating to this site's more detailed dedicated Economy page. These four numbers work together rather than independently — strong GDP growth alongside high inflation tells a different story than strong growth with stable prices, and unemployment alongside both reveals whether that growth is translating into broad-based opportunity across ${country} or concentrating narrowly. Through ${month} ${year}, this snapshot reflects the latest available figures for ${country}'s national economy.`;
}

export function generateEconomyDashboardAfter(country: string): string {
  const { month, year } = now();
  return `For deeper analysis behind any of these four figures — what they mean in practical household terms, how ${country} compares internationally, or how these numbers are trending over time — this site's dedicated Economy page for ${country} offers considerably more detail than this condensed dashboard view. These figures are sourced from the same data feeding ${country}'s Rates and Economy pages, ensuring consistency across the site rather than conflicting numbers in different places. Through ${month} ${year}, checking back periodically captures how ${country}'s economic conditions are evolving over time.`;
}

// ─── 7b. GROWTH DASHBOARD (World Bank 10-year trends) ─────────────────────────

export function generateGrowthDashboardParagraph(country: string): string {
  const { month, year } = now();
  return `Beyond a single snapshot, understanding ${country}'s trajectory means looking at how key indicators have moved over the past decade. The three charts below, sourced directly from World Bank Open Data, trace ${country}'s gross domestic product, total population, and exports of goods and services year by year, revealing whether growth has been steady, volatile, or accelerating. A rising GDP line paired with a flattening population curve points toward improving per-capita prosperity, while exports trending upward signals ${country}'s growing integration into global trade. As of ${month} ${year}, these figures reflect the most recent data World Bank has published for ${country}, typically lagging the present by one to two years due to how national accounts are compiled and verified.`;
}

export function generateGrowthDashboardAfter(country: string): string {
  const { month, year } = now();
  return `These ten-year trends matter more than any single year's figure because they smooth out short-term shocks — a single bad harvest, a currency swing, or a one-off policy change — and reveal the underlying direction ${country}'s economy is actually heading. Investors, policymakers, and researchers studying ${country} typically weight multi-year trends far more heavily than any individual data point precisely for this reason. Through ${month} ${year}, World Bank continues to update these series annually, so checking back periodically captures the latest available picture of ${country}'s long-run economic and demographic path.`;
}

// ─── 8. NATIONAL TEAMS ───────────────────────────────────────────────────────

export function generateTeamsParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s national teams above represent the country on the international sporting stage, each carrying its own current world ranking and history of major achievements across the sports where ${country} has built a competitive tradition. National team sport often generates the widest shared sporting interest across ${country}, uniting fans across regional, linguistic, and other divides in a way that domestic club competition typically cannot match. Through ${month} ${year}, these rankings and achievement lists reflect the current standing of each team, with deeper match-by-match detail available on this site's dedicated Sports pages for individual cities.`;
}

export function generateTeamsAfter(country: string): string {
  const { month, year } = now();
  return `The achievements listed above for each of ${country}'s national teams represent the highlights of each program's history — major tournament wins, notable upsets, and defining moments that fans across the country still reference in everyday sporting conversation. Current world ranking offers a snapshot of present competitive standing, though rankings fluctuate considerably based on recent results and tournament cycles through ${month} ${year}. For live scores, upcoming fixtures, and the latest sports news connected to these national teams, this site's city-level Sports pages provide considerably more current, granular coverage than this summary view.`;
}

// ─── 9. NATIONAL HOLIDAYS & EVENTS ──────────────────────────────────────────

export function generateHolidaysParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s national holidays and observances above shape the rhythm of the calendar year nationwide — public holidays, religious observances, and days of historical or civic significance that affect business hours, school schedules, and public life across the entire country regardless of region. Knowing these dates in advance matters practically for anyone planning travel, business, or significant personal events in ${country}, since many of these observances bring widespread closures or significantly busier travel periods. Through ${month} ${year}, this list reflects ${country}'s confirmed national calendar for the year.`;
}

export function generateHolidaysAfter(country: string): string {
  const { month, year } = now();
  return `Each holiday above carries its own type and significance — some are purely civic, tied to historical milestones in ${country}'s national story, while others carry religious weight observed with varying degrees of intensity depending on the specific community and region within the country. This national list complements the more granular event coverage found on this site's city-level Events pages, which capture local happenings beyond just the nationally recognised dates shown here. Through ${month} ${year} and into the coming year, this calendar continues to anchor major planning decisions for households, businesses, and institutions across ${country}.`;
}

// ─── 10. EMERGENCY CONTACTS & NEIGHBORING COUNTRIES ─────────────────────────

export function generateEmergencyParagraph(country: string): string {
  const { month, year } = now();
  return `The emergency contact numbers above for police, ambulance, and fire services in ${country} are essential information worth knowing before you need them, whether you're a long-term resident, a new arrival, or simply visiting ${country} for the first time. These numbers connect directly to the relevant national emergency response service and work nationwide rather than being limited to any single city or region. Through ${month} ${year}, saving these numbers directly to a phone is a small but genuinely worthwhile precaution for anyone spending meaningful time in ${country}.`;
}

export function generateEmergencyAfter(country: string): string {
  const { month, year } = now();
  return `Below the emergency numbers, ${country}'s neighboring countries are listed for quick reference and easy navigation to their own dedicated country pages, useful for understanding ${country}'s regional context or planning multi-country travel through the surrounding area. Geographic proximity often shapes shared history, trade relationships, and cultural exchange between ${country} and its neighbors, context that becomes especially relevant when comparing economic, political, or cultural patterns across the wider region. Through ${month} ${year}, this combination of practical safety information and regional navigation rounds out this page's coverage of ${country}.`;
}
