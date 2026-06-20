/**
 * SEO paragraph generators — WorldCityHub Rates Page (country-level)
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 12 sections × ~220 words × 2 = 5,000+ words per country rates page.
 * All paragraphs use real live data variables for genuine uniqueness per country.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. KARAT TABLE (gold rates by purity) ─────────────────────────────────

export function generateKaratParagraph(country: string, currencyCode: string, perGram: number | null): string {
  const { month, year } = now();
  const priceStr = perGram !== null ? `${perGram.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currencyCode}` : `today's live rate`;
  return `Gold prices in ${country} today stand at ${priceStr} per gram for 24K, the purest grade tracked on this page. The table above breaks this single figure down across every karat commonly traded in ${country} — 24K, 22K, 21K, 20K, and 18K — each reflecting a different gold-to-alloy ratio and therefore a different price per gram, gram-for-gram. In ${month} ${year}, jewellers, investors, and households across ${country} use this karat breakdown daily, since 24K suits pure investment while 21K and 22K are the more common choices for jewellery actually worn and sold in local markets.`;
}

export function generateKaratAfter(country: string): string {
  const { month, year } = now();
  return `Switching between per-gram, per-tola, per-10-gram, and per-troy-ounce units above matters because different units dominate different contexts in ${country} — tola remains the traditional unit at jewellery counters across South Asia, while troy ounces are the standard for international investment comparisons. Gold in ${country} typically moves in response to two separate forces: the global US-dollar gold price set by international markets, and the local currency's exchange rate against the dollar, meaning a day of flat global gold prices can still produce a meaningfully different local price if the currency itself has moved. Tracking both the karat table and the local currency section further down this page together gives a fuller picture of why gold prices in ${country} shift the way they do through ${month} ${year}.`;
}

// ─── 2. 30-DAY PRICE HISTORY CHART ─────────────────────────────────────────

export function generateChartParagraph(country: string): string {
  const { month, year } = now();
  return `The 30-day price history above charts how 24K gold has moved in ${country} over the past month, turning a single daily snapshot into a visible trend. A rising line through ${month} ${year} signals sustained upward pressure — often from global uncertainty, currency depreciation, or central bank buying — while a flattening or declining line suggests the opposite. For anyone in ${country} timing a gold purchase or sale, this 30-day view is considerably more useful than today's price alone, since gold can spike or dip on a single news day before settling back toward its underlying trend.`;
}

export function generateChartAfter(country: string): string {
  const { month, year } = now();
  return `Reading this chart alongside the karat table above reveals not just where ${country}'s gold price stands today but how it got there — whether today's rate represents a local peak, a local trough, or a continuation of a steady multi-week trend through ${month} ${year}. Gold traders and everyday buyers in ${country} both watch this kind of short-term chart differently: traders look for momentum to act on quickly, while households planning a wedding purchase or long-term saving often wait for a dip relative to the recent 30-day range. Either way, the shape of this curve, not just its current endpoint, is what gives the number context.`;
}

// ─── 3. TODAY'S MARKET SUMMARY ──────────────────────────────────────────────

export function generateSummaryParagraph(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `Today's market summary above shows ${country}'s gold price range for the day — the opening price, the current price, and the day's high and low — giving a compact view of how much movement has occurred within these 24 hours alone. This intraday range matters separately from the 30-day trend, since a day with a wide gap between high and low signals unusual volatility in ${country}'s gold market, often tied to a specific news event, currency swing, or shift in global sentiment during ${month} ${year}. The position bar beneath the four figures shows at a glance whether the current price sits closer to today's high or today's low.`;
}

export function generateSummaryAfter(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `All figures in this summary are quoted in ${currencyCode}, ${country}'s local currency, rather than US dollars, which is the figure that actually matters to jewellers, investors, and households making a purchase decision in ${country} today. The gap between the day's open and current price is often the most immediately useful number here — a current price meaningfully above the day's open suggests gold has strengthened since markets opened in ${month} ${year}, while a price below open suggests the opposite. This summary refreshes continuously, so revisiting it later in the day shows how the picture has evolved since the morning.`;
}

// ─── 4. OIL & ENERGY PRICES ─────────────────────────────────────────────────

export function generateOilSectionParagraph(country: string): string {
  const { month, year } = now();
  return `Global oil and energy prices shown above ripple through ${country}'s economy in ways that extend far beyond what drivers pay at the pump — fuel costs feed directly into transport, manufacturing, electricity generation, and ultimately the price of nearly every good sold in ${country}. Tracking Brent crude, WTI, and natural gas prices together gives a clearer picture than any single benchmark alone, since ${country}'s import mix and regional supply contracts mean these global figures don't translate into local fuel prices in a perfectly linear way. Through ${month} ${year}, sustained moves in this section often arrive at the petrol pump in ${country} with a lag of days to weeks, depending on how quickly local pricing mechanisms adjust.`;
}

export function generateOilSectionAfter(country: string): string {
  const { month, year } = now();
  return `The fuel price table below the global benchmarks shows what ${country}'s drivers and businesses are actually paying at the pump right now, in local currency per liter, which is ultimately the figure that matters for household budgets and transport costs. Because most South Asian economies including ${country} import the large majority of their oil, global crude price swings combined with currency movements compound on top of each other — a weakening local currency makes imported oil more expensive even when the global dollar price of crude stays flat. This dual exposure is why oil and energy prices deserve close attention in ${country} through ${month} ${year}, beyond what the headline crude price alone would suggest.`;
}

// ─── 5. CRYPTOCURRENCY ──────────────────────────────────────────────────────

export function generateCryptoParagraph(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `The top 10 cryptocurrencies above are priced in ${currencyCode} for ${country}'s market, converting the global dollar-denominated crypto market into figures that are directly usable for anyone in ${country} actually buying, selling, or simply tracking digital assets. The Fear & Greed Index alongside the table summarises overall market sentiment in a single number, while Bitcoin's dominance percentage shows what share of total crypto market value sits in Bitcoin versus the broader altcoin market at this moment in ${month} ${year}. Cryptocurrency adoption in ${country} has grown steadily despite regulatory uncertainty in much of South Asia, often driven by remittance use cases and as a hedge against local currency depreciation.`;
}

export function generateCryptoAfter(country: string): string {
  const { month, year } = now();
  return `For residents of ${country} using cryptocurrency as a store of value or remittance channel, the 24-hour change column above is the figure that matters most day to day, since crypto markets move considerably faster than traditional assets like gold or equities. Market capitalization, shown in the rightmost column, indicates the total value of each cryptocurrency rather than its price alone — a useful distinction, since a low unit price does not necessarily mean a coin is small or new. Through ${month} ${year}, this table updates continuously, reflecting the genuinely 24/7 nature of crypto markets compared to the fixed trading hours that govern ${country}'s stock exchange, shown further down this page.`;
}

// ─── 6. CURRENCY EXCHANGE RATES ─────────────────────────────────────────────

export function generateCurrencyParagraph(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `${country}'s exchange rate against the US dollar and other major currencies, shown above, is arguably the single most consequential figure on this entire page — it directly shapes import costs, inflation, remittance value, and the price of nearly everything else tracked here, from gold to oil to fuel. The remittance calculator built into this section lets anyone receiving money from family working abroad see exactly how much they'll receive in ${currencyCode} at today's rate, a genuinely practical tool given how significant remittance inflows are to ${country}'s economy. Through ${month} ${year}, even small daily movements in this rate compound meaningfully over weeks and months for households and businesses dependent on foreign income or imported goods.`;
}

export function generateCurrencyAfter(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `The 30-day exchange rate chart above shows whether ${currencyCode} has been strengthening or weakening against the dollar recently — a trend that matters more than any single day's rate for anyone making a larger financial decision in ${country}, such as timing an overseas purchase, a remittance transfer, or a foreign currency conversion. Currency depreciation in economies like ${country}'s tends to show up first in import-heavy categories — fuel, edible oil, and electronics — before working its way through the broader economy as a generalised inflation pressure. Watching this exchange rate trend alongside the inflation and misery index figures further down this page connects the dots between currency movement and its real cost of living impact in ${country} through ${month} ${year}.`;
}

// ─── 7. STOCK MARKET ─────────────────────────────────────────────────────────

export function generateStocksParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s main stock market indices, shown above, track the day's performance for the country's primary listed companies, giving a real-time read on investor sentiment toward the domestic economy. The year-to-date percentage alongside each index matters more than the daily change for understanding the bigger picture — a single red day in ${month} ${year} means little if the broader YTD trend remains strongly positive, and vice versa. Below the headline indices, a snapshot of major global markets gives context for whether ${country}'s market is moving in line with broader international sentiment or diverging on local factors specific to the domestic economy.`;
}

export function generateStocksAfter(country: string): string {
  const { month, year } = now();
  return `The top gainers and losers lists above highlight which individual companies are driving today's market activity in ${country} beyond the index-level summary, often revealing sector-specific stories — a banking stock move tied to interest rate expectations, or an energy stock reacting to the oil prices shown earlier on this page. Retail and institutional investors in ${country} use this kind of daily movers list to spot where capital is flowing on a given day, though a single day's gainers list says little about a stock's longer-term fundamentals. Through ${month} ${year}, cross-referencing this section against the interest rate data further down the page often explains a meaningful share of the day's broader market direction.`;
}

// ─── 8. INTEREST RATES ──────────────────────────────────────────────────────

export function generateInterestParagraph(country: string, rate: number | null): string {
  const { month, year } = now();
  const rateStr = rate !== null ? `${rate}%` : "the current benchmark rate";
  return `${country}'s central bank policy rate currently stands at ${rateStr}, the single figure that anchors the cost of borrowing and the return on saving across the entire economy. Above, the home loan and savings calculators translate this abstract policy number into a concrete, relatable outcome — what a real loan would cost in monthly payments, or what a real savings deposit would earn over a year, both calculated directly from today's rate. Through ${month} ${year}, this policy rate also feeds directly into the misery index and purchasing power figures further down this page, since interest rates and inflation are two sides of the same monetary policy story in ${country}.`;
}

export function generateInterestAfter(country: string): string {
  const { month, year } = now();
  return `When ${country}'s central bank raises rates, borrowing becomes more expensive but savings become more rewarding — a deliberate trade-off typically used to cool inflation, while rate cuts work in the opposite direction to stimulate borrowing and spending during slower economic periods. The "last change" and "next meeting" dates shown above matter for anyone planning a major financial decision in ${country}, since a known upcoming policy meeting often shapes market expectations and behaviour well before the actual announcement. Through ${month} ${year}, tracking this rate alongside the stock market section above gives insight into how monetary policy and market sentiment in ${country} are moving together or diverging.`;
}

// ─── 9. COMMODITY PRICES ───────────────────────────────────────────────────

export function generateCommoditiesParagraph(country: string): string {
  const { month, year } = now();
  return `The commodity prices above are organised specifically around relevance to ${country} — highlighting the metals and agricultural goods that most directly affect local cost of living, manufacturing input costs, and food security, rather than presenting an undifferentiated global commodity list. Items flagged as particularly relevant to ${country} carry an explanatory note on why they matter locally, whether as a major import, a key agricultural export, or an input to a significant domestic industry. Through ${month} ${year}, commodity price swings — particularly in agriculture — translate into food inflation in ${country} faster than almost any other category tracked on this page.`;
}

export function generateCommoditiesAfter(country: string): string {
  const { month, year } = now();
  return `Beyond the highlighted items, the broader metals and agriculture categories above give a wider view of global commodity markets relevant to ${country}'s trade relationships, manufacturing base, and export economy. Metal prices in particular tend to move in response to global industrial demand, especially from major manufacturing economies, while agricultural commodity prices respond more to weather, harvest yields, and seasonal supply patterns specific to growing regions around the world. For businesses and policymakers in ${country} through ${month} ${year}, this section offers an early warning system — commodity price trends here often arrive at local market shelves and local industrial costs with a lag of weeks to months.`;
}

// ─── 10. FINANCIAL STRESS & MISERY INDEX ───────────────────────────────────

export function generateStressParagraph(country: string, miseryIndex: number | null): string {
  const { month, year } = now();
  const indexStr = miseryIndex !== null ? miseryIndex.toString() : "today's calculated figure";
  return `${country}'s misery index currently stands at ${indexStr}, calculated as the sum of inflation and unemployment — a simple but widely used economic gauge of how much financial pressure an average household is under. The financial stress meter above translates a cluster of economic indicators into a single visual reading, while the comparison list below ranks ${country} against other tracked economies, giving useful context for whether current conditions in ${country} are unusually severe, broadly typical, or relatively favourable by regional standards. Through ${month} ${year}, this index tends to move slowly compared to daily figures like gold or currency rates, since it reflects underlying structural conditions rather than daily market sentiment.`;
}

export function generateStressAfter(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `The "what this means for you" breakdown above translates ${country}'s abstract misery index into concrete household terms — how much extra a fixed monthly budget needs just to maintain the same standard of living given current inflation, and how much purchasing power a fixed sum has lost over the past year in ${currencyCode}. This kind of translation matters because headline economic statistics often feel disconnected from daily lived experience, while a concrete number — extra money needed for the same grocery basket, for instance — makes the abstract figure immediately relatable for households in ${country} navigating ${month} ${year}. Comparing this index over time, rather than as a single snapshot, reveals whether economic pressure in ${country} is currently easing or intensifying.`;
}

// ─── 11. PURCHASING POWER CALCULATOR ───────────────────────────────────────

export function generatePurchasingParagraph(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `The purchasing power calculator above shows how a fixed sum of ${currencyCode} has changed in real value over time in ${country}, factoring in inflation alongside the gold price and Bitcoin price as alternative stores of value for comparison. This kind of side-by-side view answers a question many households and savers in ${country} ask intuitively but rarely see quantified: would the same money have been better preserved by holding cash, gold, or a leading cryptocurrency, given how each has performed against inflation through recent months of ${month} ${year}. The calculator updates using ${country}'s actual current inflation rate alongside today's live gold and Bitcoin prices from elsewhere on this page, rather than generic assumptions.`;
}

export function generatePurchasingAfter(country: string, currencyCode: string): string {
  const { month, year } = now();
  return `Historically, gold has functioned as one of the more reliable inflation hedges available to households in ${country} and across South Asia, while cryptocurrency has offered far higher volatility in both directions — meaningful gains in strong periods alongside meaningful losses in weak ones. Cash savings in ${currencyCode}, by contrast, steadily lose real value during any period of sustained inflation unless interest earned exceeds the inflation rate, which is rarely the case during the high-inflation periods ${country} has experienced in recent years. This calculator is intended as an educational comparison rather than financial advice, and anyone in ${country} making a significant savings or investment decision through ${month} ${year} should weigh these trade-offs against their own personal financial circumstances and risk tolerance.`;
}

// ─── 12. FINANCIAL NEWS ─────────────────────────────────────────────────────

export function generateNewsParagraph(country: string): string {
  const { month, year } = now();
  return `The financial news articles above are curated specifically for ${country}'s economic context, surfacing the stories most relevant to the rates, prices, and indicators tracked throughout this page rather than generic global financial headlines. Reading these alongside the live data above — gold, currency, stocks, interest rates — connects the abstract numbers to the actual events driving them, whether a central bank policy decision, a global commodity shock, or a domestic economic development specific to ${country} in ${month} ${year}. For anyone trying to understand not just what the numbers are today but why they are moving, this news section is often the most useful starting point on the page.`;
}

export function generateNewsAfter(country: string): string {
  const { month, year } = now();
  return `Each article above links directly to its original source, allowing readers in ${country} to go beyond the headline and read the full reporting on stories affecting the country's economy through ${month} ${year}. Financial news coverage specific to ${country} can be harder to find through generic search than headlines from larger global economies, which is part of why this curated section exists — to surface the stories that actually move the numbers tracked on this page rather than requiring a separate search across multiple news sources. Checking back regularly captures the rolling story of ${country}'s economy as it develops, rather than a single static snapshot in time.`;
}
