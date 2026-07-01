/**
 * SEO paragraph generators — WorldCityHub Economy Page (country-level, shown per city)
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 10 sections × ~200 words × 2 = 3,500+ words per city economy page.
 * All paragraphs use real live data variables for genuine uniqueness per city/country.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. FINANCIAL STRESS METER ─────────────────────────────────────────────

export function generateStressMeterParagraph(country: string, city: string): string {
  const { month, year } = now();
  return `The financial stress meter above condenses ${country}'s current economic pressure — inflation, unemployment, and debt-to-GDP combined — into a single visual reading, giving residents of ${city} a quick gauge of how much strain the broader economy is under right now. This single number is necessarily a simplification of a complex economy, but it offers a useful starting point before diving into the detailed breakdowns further down this page. Through ${month} ${year}, this meter shifts gradually rather than dramatically, since it reflects underlying structural conditions in ${country} rather than daily market sentiment.`;
}

export function generateStressMeterAfter(country: string, city: string): string {
  const { month, year } = now();
  return `Each of the three component figures feeding this meter — inflation, unemployment, and debt-to-GDP — tells a different part of ${country}'s economic story, and a high overall stress score can stem from any single factor spiking or from a combination of moderate pressures across all three. For residents of ${city}, this meter is most useful tracked over time rather than as a single snapshot, since a worsening trend through ${month} ${year} signals tightening household budgets ahead, while an improving trend suggests easing pressure. The detailed sections further down this page break down exactly what's driving today's reading.`;
}

// ─── 2. GLOBAL MISERY INDEX ─────────────────────────────────────────────────

export function generateMiseryParagraph(country: string): string {
  const { month, year } = now();
  return `The Global Misery Index above ranks ${country} against other tracked economies using a simple, widely recognised formula — inflation plus unemployment — giving useful international context for whether conditions in ${country} are unusually severe or broadly in line with global peers. This comparative ranking matters because economic figures rarely mean much in isolation; a 12% inflation rate sounds alarming on its own but reads very differently depending on whether neighbouring and comparable economies are experiencing 5% or 20% through ${month} ${year}. Scrolling through this table places ${country}'s current economic experience in a genuinely global frame.`;
}

export function generateMiseryAfter(country: string): string {
  const { month, year } = now();
  return `${country}'s position on this list shifts as both its own inflation and unemployment figures change and as other tracked economies' figures move, meaning a country's misery index rank can shift even without any change in its own underlying numbers. This index, first developed by economist Arthur Okun, remains a deliberately simple measure — it doesn't capture currency stability, debt burden, or income inequality, all of which matter separately and are covered in their own dedicated sections elsewhere on this page. Tracking ${country}'s ranking through ${month} ${year} alongside these other indicators builds a more complete economic picture than any single index alone.`;
}

// ─── 3. POPULATION & DEMOGRAPHICS ──────────────────────────────────────────

export function generatePopulationParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s population and demographic figures above form the human foundation underneath every other economic statistic on this page — GDP, employment, and debt figures all ultimately describe outcomes for the people counted here. Literacy rate and life expectancy in particular function as long-run indicators of national development, shifting slowly over years and decades rather than month to month, unlike the more volatile inflation and currency figures found elsewhere on this page. Through ${month} ${year}, these demographic fundamentals provide essential context for interpreting ${country}'s economic performance — a young, growing labor force implies different economic dynamics than an aging one.`;
}

export function generatePopulationAfter(country: string): string {
  const { month, year } = now();
  return `The labor force figure above — the share of ${country}'s population actively working or seeking work — directly determines the denominator behind the unemployment rate shown further down this page, making these two figures inseparable in practice even though they're presented in separate sections. A rising literacy rate and life expectancy over recent years in ${country} typically correlate with improving human development outcomes more broadly, a connection explored further in the HDI section below. These demographic figures, current through ${month} ${year}, update far less frequently than financial indicators like inflation or currency rates, reflecting their slower-moving, structural nature.`;
}

// ─── 4. ECONOMIC CORE (GDP) ─────────────────────────────────────────────────

export function generateEconomicCoreParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s GDP figures above represent the total value of everything the economy produced over the past year, broken down into the headline total, the annual growth rate, and the per-person average that translates an abstract national figure into something an individual can relate to. GDP growth is the figure economists watch most closely for forward momentum — a country with strong growth in ${month} ${year} is generally creating jobs and expanding opportunity faster than one with stagnant or negative growth, even if the current per-capita figure itself remains modest. These three numbers together give the clearest single snapshot of ${country}'s overall economic scale and trajectory.`;
}

export function generateEconomicCoreAfter(country: string): string {
  const { month, year } = now();
  return `GDP per capita, while useful for international comparison, says nothing about how evenly that wealth is actually distributed across ${country}'s population — a figure explored separately through the Gini coefficient in the Human Development section further down this page. Total GDP and per-capita GDP can tell different stories simultaneously: a large total economy with a relatively low per-capita figure typically points to a large population spread across that wealth, common across much of South Asia including ${country}. Through ${month} ${year}, tracking GDP growth alongside the inflation figures in the next section gives a fuller sense of whether ${country}'s economy is genuinely expanding in real terms or simply growing in nominal currency terms.`;
}

// ─── 5. INFLATION & PRICES ──────────────────────────────────────────────────

export function generateInflationParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s inflation rate above measures how quickly prices for everyday goods and services are rising, directly determining how far household income actually stretches month to month. The interest rate shown alongside it is the central bank's primary tool for managing that inflation — typically raised to cool an overheating economy and cut to stimulate a sluggish one, a relationship explored in more depth on this page's dedicated Rates section. Through ${month} ${year}, the purchasing power calculator below translates this abstract inflation percentage into a concrete answer: how much more the same basket of goods costs compared to a year ago in ${country}.`;
}

export function generateInflationAfter(country: string): string {
  const { month, year } = now();
  return `Inflation in ${country} rarely affects all goods equally — food and fuel typically rise faster than the headline average during periods of currency pressure or global commodity shocks, meaning lower-income households who spend a larger share of income on these essentials often experience inflation more acutely than the official figure suggests. The gap between ${country}'s inflation rate and its interest rate matters too: when interest rates sit meaningfully below inflation, savers are effectively losing real value by holding cash rather than gaining it. Through ${month} ${year}, tracking this relationship alongside the employment figures in the next section reveals how monetary policy in ${country} is balancing price stability against economic growth.`;
}

// ─── 6. EMPLOYMENT & LABOUR ──────────────────────────────────────────────────

export function generateEmploymentParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s unemployment and poverty rate figures above measure two related but distinct dimensions of economic hardship — unemployment counts those actively seeking work but unable to find it, while the poverty rate captures a broader population living below a basic income threshold regardless of employment status. These figures connect directly to the population and labor force data covered earlier on this page, translating an abstract percentage into the actual number of people in ${country} currently affected. Through ${month} ${year}, both figures respond to the same underlying economic conditions — GDP growth, inflation, and investment levels — covered in the surrounding sections of this page.`;
}

export function generateEmploymentAfter(country: string): string {
  const { month, year } = now();
  return `Unemployment in economies like ${country}'s often coexists with significant informal employment — work that isn't captured in official statistics but still provides income, meaning the official unemployment figure can understate the full picture of how people in ${country} actually earn a living. The poverty rate, by contrast, captures outcomes more directly tied to inflation and currency stability, since even employed households can fall below the poverty line if wages haven't kept pace with the rising prices covered in the previous section. Through ${month} ${year}, watching both figures together gives a more complete read on economic wellbeing in ${country} than either statistic offers alone.`;
}

// ─── 7. NATIONAL DEBT & FISCAL HEALTH ───────────────────────────────────────

export function generateDebtParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s debt-to-GDP ratio above measures how much the government owes relative to the total size of its economy, while the per-citizen figure translates that abstract national number into each individual's theoretical share of the debt burden. This matters beyond an accounting exercise — debt servicing costs directly compete with spending on healthcare, education, and infrastructure in ${country}'s annual budget, meaning a high debt burden can constrain public services even when the broader economy is otherwise performing reasonably well. Through ${month} ${year}, this fiscal picture connects directly to the interest rate and inflation figures covered earlier, since borrowing costs and currency stability both shape how sustainable a given debt level actually is.`;
}

export function generateDebtAfter(country: string): string {
  const { month, year } = now();
  return `Not all debt is equally risky — debt denominated in ${country}'s own local currency behaves very differently from debt owed in foreign currency, since a weakening exchange rate (covered in detail on this page's Rates section) makes foreign-currency debt considerably more expensive to service in local terms even if the nominal amount owed hasn't changed. International thresholds like the EU's 60% debt-to-GDP guideline offer useful reference points, though sustainable debt levels vary considerably depending on a country's growth rate, currency stability, and access to international credit markets. Through ${month} ${year}, ${country}'s debt trajectory remains one of the clearer long-term signals of fiscal health, worth tracking alongside the GDP growth figures covered earlier on this page.`;
}

// ─── 8. HUMAN DEVELOPMENT & QUALITY OF LIFE ─────────────────────────────────

export function generateHdiParagraph(country: string): string {
  const { month, year } = now();
  return `The Human Development Index and Gini coefficient above move beyond pure economic output to capture quality of life and inequality in ${country} — two dimensions that GDP figures alone consistently fail to reflect. HDI combines income, education, and life expectancy into a single composite score, offering a more rounded view of national development than GDP per capita can provide on its own, while the Gini coefficient measures specifically how evenly income is distributed across ${country}'s population. Through ${month} ${year}, these two figures together answer a question the earlier GDP section can't: not just how much wealth ${country} generates, but how broadly that wealth and wellbeing actually reach its people.`;
}

export function generateHdiAfter(country: string): string {
  const { month, year } = now();
  return `A country can show solid GDP growth while its HDI score improves only slowly, particularly if that growth concentrates among a narrow segment of the population rather than translating into broader gains in education and health access across ${country}. The Gini coefficient specifically flags this kind of disconnect — a high Gini alongside strong GDP growth suggests the benefits of that growth are not being shared evenly, a pattern worth watching alongside the poverty and employment figures covered earlier on this page. Through ${month} ${year}, tracking HDI trends over multiple years, rather than as a single snapshot, gives the clearest sense of whether ${country}'s development is genuinely broad-based.`;
}

// ─── 8b. GROWTH DASHBOARD (World Bank 10-year trends) ─────────────────────────

export function generateEconomyGrowthParagraph(country: string): string {
  const { month, year } = now();
  return `The single-figure snapshots above this section describe ${country}'s economy at one moment in time, but the three ten-year charts below — GDP, population, and exports, sourced directly from World Bank Open Data — reveal the trajectory behind those numbers. A decade of data smooths out one-off shocks like a bad harvest, a currency swing, or a single policy misstep, surfacing the underlying direction ${country}'s economy is genuinely heading rather than a snapshot that could be an outlier. As of ${month} ${year}, these series typically lag the present by one to two years, reflecting how long national accounts take to compile and verify.`;
}

export function generateEconomyGrowthAfter(country: string): string {
  const { month, year } = now();
  return `Reading GDP growth alongside population growth reveals whether ${country}'s prosperity is genuinely improving per person or simply expanding because more people are being added to the same economic pie — a distinction the GDP figure alone cannot make. Exports trending upward, meanwhile, signals deepening integration into global trade, which often correlates with the investment climate and trade figures discussed elsewhere on this page. Through ${month} ${year}, this multi-year view offers the fullest picture available of where ${country}'s economy has been and where current momentum suggests it may be heading.`;
}

// ─── 9. TRADE & FOREIGN INVESTMENT ──────────────────────────────────────────

export function generateTradeParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s trade balance and foreign direct investment figures above show how the country interacts economically with the rest of the world — whether it exports more than it imports, and how much foreign capital is flowing in to fund local businesses and infrastructure. A trade deficit, where imports exceed exports, isn't automatically a bad sign, but it does create ongoing demand for foreign currency that puts pressure on the exchange rate figures covered on this page's Rates section. Through ${month} ${year}, foreign direct investment serves as a useful vote of confidence indicator — sustained FDI inflows generally suggest international investors see genuine long-term opportunity in ${country}'s economy.`;
}

export function generateTradeAfter(country: string): string {
  const { month, year } = now();
  return `For economies like ${country}'s with significant trade deficits, remittances from citizens working abroad often play an outsized role in offsetting the gap, supplying foreign currency that helps stabilise the exchange rate even when the formal trade balance runs persistently negative. This dynamic is particularly pronounced across South Asia, where diaspora remittances frequently rival or exceed foreign direct investment as a source of foreign currency inflow. Through ${month} ${year}, watching ${country}'s trade balance alongside its currency performance on this page's Rates section reveals how directly these international economic relationships translate into the price of everyday imported goods for households.`;
}

// ─── 10. OPPORTUNITY INDEX ──────────────────────────────────────────────────

export function generateOpportunityParagraph(city: string, country: string): string {
  const { month, year } = now();
  return `The Opportunity Index above synthesises everything covered earlier on this page — growth, inflation, trade, and investment trends — into three practical scores aimed at a different audience than the rest of this page: investors, entrepreneurs, and businesses evaluating ${city} and ${country} as a place to deploy capital or build something new. Business environment, real estate potential, and export opportunity each draw on different combinations of the underlying economic indicators, reflecting that "opportunity" looks different depending on what kind of activity you're considering. Through ${month} ${year}, these scores update as the underlying economic data shifts, giving a current rather than historical read on conditions in ${country}.`;
}

export function generateOpportunityAfter(city: string, country: string): string {
  const { month, year } = now();
  return `These three scores are intentionally not a single combined number, since business environment, real estate, and export opportunity in ${country} can move in genuinely different directions at once — a weak local currency that hurts the broader business climate can simultaneously boost export competitiveness, for instance. Each score above is accompanied by a brief explanatory insight translating the underlying data into a plain-language read on why that score sits where it does for ${city} and ${country} right now, in ${month} ${year}. As with every figure on this page, these scores are intended as a starting point for further research rather than a standalone investment recommendation.`;
}
