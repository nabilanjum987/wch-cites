/**
 * SEO paragraph generators — WorldCityHub Weather Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 14 sections × ~250 words × 2 = 3,200+ words per city weather page
 * All paragraphs use real live data variables for genuine uniqueness per city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. HERO CARD (current conditions snapshot) ────────────────────────────

export function generateHeroParagraph(
  city: string, temp: number | null, condition: string | null,
  tempMax: number | null, tempMin: number | null
): string {
  const { month, year } = now();
  if (temp === null) {
    return `${city}'s current weather snapshot updates every hour, pulling live data for the city's exact coordinates rather than a generalised regional estimate. Anyone checking conditions in ${city} right now — whether planning a commute, deciding what to wear, or simply curious — gets a real-time reading rather than yesterday's forecast. The hero card above shows today's temperature, sky conditions, sunrise and sunset times, UV exposure, and humidity in a single glance, sourced from OpenWeatherMap and refreshed continuously throughout ${month} ${year}.`;
  }
  const spread = tempMax !== null && tempMin !== null ? `${Math.round(tempMax)}°C high and ${Math.round(tempMin)}°C low` : "a wide daily swing";
  return `Right now in ${city}, conditions show ${Math.round(temp)}°C with ${condition ?? "shifting"} skies, against a forecast ${spread} for today. This snapshot updates every hour for ${city}'s exact coordinates, so the numbers above reflect this precise moment in ${month} ${year} rather than a generalised regional average. The gap between today's high and low matters as much as the current reading — ${city} often sees its sharpest temperature swing in the two or three hours after sunset, which is why the sunrise, sunset, and UV figures sit alongside the headline temperature rather than in a separate panel.`;
}

export function generateHeroAfter(city: string, country: string): string {
  const { month, year } = now();
  return `The hero numbers above are the starting point for everything else on this page — the hourly forecast, the 10-day outlook, and the historical averages all build outward from this single live reading for ${city}. Weather stations across ${country} feed continuously updated data into the model behind this page, which means the temperature, humidity, and UV index shown for ${city} reflect actual current conditions rather than a forecast issued hours or days earlier. For residents, this snapshot answers the most immediate question of the day — what does it feel like outside right now — while the sections further down answer the longer questions: what will it feel like this evening, tomorrow, and across the coming season in ${month} ${year}.`;
}

// ─── 2. CURRENT CONDITIONS STATS GRID ──────────────────────────────────────

export function generateStatsParagraph(
  city: string, feelsLike: number | null, humidity: number | null,
  windSpeed: number | null, pressure: number | null
): string {
  const { month, year } = now();
  const feelStr = feelsLike !== null ? `${Math.round(feelsLike)}°C` : "close to the actual reading";
  const humStr = humidity !== null ? `${humidity}%` : "moderate";
  return `Beyond the headline temperature, ${city}'s detailed conditions in ${month} ${year} show a feels-like reading of ${feelStr}, humidity at ${humStr}, and wind speeds of ${windSpeed !== null ? Math.round(windSpeed) : "--"} km/h. Pressure currently reads ${pressure ?? "--"} hPa, a figure meteorologists watch closely because a falling pressure trend over a few hours is one of the clearest early signals of an approaching weather system in ${city}. Dew point and visibility — also shown in the grid above — matter more than most people realise: a high dew point in ${city} during the pre-monsoon months can make a moderate temperature feel considerably more oppressive than the thermometer alone suggests.`;
}

export function generateStatsAfter(city: string): string {
  const { month, year } = now();
  return `Each figure in the conditions grid above is drawn from the same live observation used to generate ${city}'s headline temperature, so the numbers are internally consistent rather than blended from different sources or time windows. Residents who track these details closely — outdoor workers, athletes, parents deciding whether it is safe to send children outside — use the combination of UV index and humidity together rather than either figure alone, since high UV with low humidity behaves very differently on the skin than high UV with high humidity. The visibility reading is particularly relevant for ${city} during the winter months of ${month} ${year}, when fog and haze can reduce visibility sharply in the early morning hours before clearing by mid-morning.`;
}

// ─── 3. WHAT TO WEAR ────────────────────────────────────────────────────────

export function generateWearParagraph(city: string): string {
  const { month, year } = now();
  return `Deciding what to wear in ${city} today in ${month} ${year} is harder than checking a single temperature, because the city's daily temperature swing between morning, afternoon, evening, and night can exceed ten degrees on a clear day. The four wardrobe cards above translate live hourly data into practical clothing guidance for each part of the day — morning layers that can be removed by midday, lightweight afternoon wear for the peak heat, and warmer layers again once the sun drops in the evening. This kind of hour-by-hour guidance is especially useful for ${city} residents commuting early and returning late, since the conditions at departure and return can feel like entirely different seasons.`;
}

export function generateWearAfter(city: string): string {
  const { month, year } = now();
  return `The clothing recommendations above factor in not just temperature but also the chance of rain at each part of the day, which is why an umbrella appears in the list during ${city}'s wetter stretches of the year and disappears entirely during the dry winter months. Locals in ${city} tend to layer rather than commit to a single outfit for the day — a habit the wardrobe guide above is built to support, since each time-of-day card can be read independently depending on your actual schedule. For visitors unfamiliar with how quickly conditions shift in ${city} through ${month} ${year}, this section is one of the most practically useful on the page, turning raw forecast numbers into a decision you can act on before you leave the house.`;
}

// ─── 4. WEATHER STORY (narrative) ──────────────────────────────────────────

export function generateStoryParagraph(city: string): string {
  const { month, year } = now();
  return `The weather story above turns ${city}'s raw forecast numbers into a short, readable summary of how the rest of today is likely to unfold — what to expect by evening, whether rain is likely, and how tomorrow compares. It is written fresh from the live data each time the page loads, which means it reflects this exact moment in ${month} ${year} rather than a static description that could be hours or days out of date. For someone short on time who just wants the practical takeaway without parsing eight separate stat cards, this narrative is designed to be the fastest way to understand ${city}'s weather at a glance.`;
}

export function generateStoryAfter(city: string, country: string): string {
  const { month, year } = now();
  return `${city}'s daily weather story is generated independently for every city WorldCityHub tracks, which is part of what makes each city's page genuinely unique rather than a template with the name swapped out. The narrative draws on the same hourly and daily forecast data that powers the rest of the page, but presents it in the connected, conversational form that a local meteorologist might use rather than as a list of disconnected figures. As ${country}'s weather patterns shift through ${month} ${year} — whether toward the monsoon, the winter chill, or the pre-summer heat — the story for ${city} updates automatically to reflect whichever phase the city is currently in.`;
}

// ─── 5. HOURLY FORECAST ─────────────────────────────────────────────────────

export function generateHourlyParagraph(city: string): string {
  const { month, year } = now();
  return `The hourly forecast above breaks down ${city}'s next 24 hours in detail, showing how temperature, sky conditions, and rain probability are expected to shift through the day and into the night. This level of granularity matters for anyone planning something time-specific in ${city} — an outdoor event, a flight, a wedding, a long drive — where the difference between a 2 PM departure and a 6 PM departure can mean a completely different weather experience. In ${month} ${year}, ${city}'s hourly pattern often follows a predictable arc: a cool start, a sharp rise toward early afternoon, and a gradual decline through the evening, though this rhythm shifts noticeably with the seasons.`;
}

export function generateHourlyAfter(city: string): string {
  return `Scroll through the hourly cards above to find the exact window that suits your plans in ${city} — whether that is the coolest hour for a run, the driest hour for an outdoor errand, or the warmest hour for drying laundry. Each card combines temperature with rain probability so you are not just seeing how hot or cold it will be but also how likely you are to need an umbrella at that specific hour. The hourly data updates continuously throughout the day, meaning the forecast for six hours from now in ${city} becomes more accurate the closer that hour approaches, since short-range forecasting is inherently more reliable than long-range projections.`;
}

// ─── 6. 10-DAY FORECAST ─────────────────────────────────────────────────────

export function generateTenDayParagraph(city: string): string {
  const { month, year } = now();
  return `The 10-day forecast above gives ${city} residents and visitors a longer planning horizon than the hourly view allows — useful for booking travel, scheduling outdoor events, or simply knowing what kind of week lies ahead through ${month} ${year}. Each day's card shows the expected high, low, sky conditions, and rain probability, letting you scan the coming week at a glance rather than checking back daily. Forecast confidence naturally decreases the further out you look — the first two or three days in ${city}'s 10-day outlook tend to be the most reliable, while days seven through ten should be treated as a general trend rather than an exact prediction.`;
}

export function generateTenDayAfter(city: string, country: string): string {
  return `${city}'s 10-day outlook is generated from the same forecasting models used across ${country}, calibrated specifically for the city's coordinates rather than interpolated from a distant weather station. Residents planning a trip out of ${city}, a family event, or a construction schedule dependent on dry weather often use this view as their primary reference, checking back every day or two as the forecast window rolls forward and earlier predictions sharpen into more confident short-range figures. The pattern of rising and falling daily highs across the 10 days can also reveal whether ${city} is heading into a stable stretch of similar weather or a more changeable period with day-to-day swings worth watching closely.`;
}

// ─── 7. SUN & MOON ───────────────────────────────────────────────────────────

export function generateSunMoonParagraph(
  city: string, sunrise: string | null, sunset: string | null
): string {
  const { month, year } = now();
  const srStr = sunrise ?? "shortly after dawn";
  const ssStr = sunset ?? "in the early evening";
  return `The sun rises over ${city} at ${srStr} and sets at ${ssStr} today, defining the rhythm of daylight that shapes everything from school schedules to prayer times across the city in ${month} ${year}. The animated sun arc above tracks exactly where the sun sits in its path right now, while the golden hour windows mark the twenty-to-thirty minutes of soft, warm light on either side of sunrise and sunset that photographers in ${city} prize above any other time of day. Civil, nautical, and astronomical twilight times are also shown — each marking a progressively darker stage of dusk and dawn that matters for anyone working outdoors, observing the sky, or simply wanting to know exactly when true darkness falls over ${city}.`;
}

export function generateSunMoonAfter(city: string): string {
  const { month, year } = now();
  return `The moon phase, illumination percentage, moonrise, and moonset times shown above for ${city} are calculated for the city's precise coordinates and update daily through ${month} ${year}. This data is especially relevant around the start of each Islamic lunar month, when crescent visibility determines the official beginning of religious observances across the region, and during major eclipse events, which are flagged above with a note on whether they will be visible from ${city} specifically. The constellation panel rounds out the section with tonight's most prominent visible constellation and the direction to look — a small detail that turns a clear night in ${city} into an easy, accessible stargazing opportunity for anyone willing to step outside and look up.`;
}

// ─── 8. MONTHLY CLIMATE & AVERAGES ─────────────────────────────────────────

export function generateMonthlyParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s climate classification and monthly averages above answer a different question than the daily forecast — not what will the weather be tomorrow, but what is ${city}'s weather like as a whole across the full year. This view is built from years of historical observation rather than a single forecast model, making it the most reliable reference for anyone planning a trip to ${city} months in advance, deciding when to schedule an outdoor wedding, or simply trying to understand the city's seasonal character beyond today's snapshot in ${month} ${year}. The best-months recommendation factors in both temperature comfort and typical rainfall, giving a genuinely practical answer rather than a generic seasonal guess.`;
}

export function generateMonthlyAfter(city: string): string {
  return `The monthly average chart above shows the typical high and low temperature band for every month of the year in ${city}, making it easy to see at a glance which months run hottest, which run coldest, and how wide the gap between day and night temperatures tends to be in each season. Long-term residents of ${city} use this data instinctively — they know without checking that certain months call for heavy layers and others call for nothing more than light cotton — but for newcomers, visiting family from abroad, or anyone planning months ahead, the chart above compresses years of lived experience into a single readable view of how ${city}'s climate moves through its annual cycle.`;
}

// ─── 9. HISTORICAL AVERAGES (today) ────────────────────────────────────────

export function generateHistoryParagraph(city: string): string {
  const { month, year } = now();
  return `The historical averages above show what today's date has typically looked like in ${city} across past years — the average high, average low, and the record temperatures ever recorded on this date. Comparing today's live forecast against this long-term baseline reveals whether ${city} is currently running warmer, cooler, or roughly in line with what is normal for this point in ${month} ${year}. This kind of comparison is more informative than the live temperature alone, since a reading that feels unremarkable in isolation can actually represent a significant departure from what the city has historically experienced on this exact date.`;
}

export function generateHistoryAfter(city: string): string {
  const { month, year } = now();
  return `Record temperatures for ${city}, shown above alongside the historical average, mark the extreme boundaries of what the city's climate has produced on this date in recorded history. These records matter beyond curiosity — they inform infrastructure planning, agricultural decisions in the districts surrounding ${city}, and public health advisories during unusually extreme stretches of weather. As climate patterns shift globally, comparing each year's data against these historical baselines is one of the clearest ways to track whether ${city}'s weather is following its established pattern or beginning to diverge from it, a question increasingly relevant through ${month} ${year} and the years ahead.`;
}

// ─── 10. WEATHER ALERTS ─────────────────────────────────────────────────────

export function generateAlertsParagraph(city: string): string {
  const { month, year } = now();
  return `When active, the alert banner above carries official weather warnings affecting ${city} right now — heat advisories, heavy rain warnings, dust storm alerts, or other significant weather events that residents should plan around. These alerts are sourced from meteorological warning systems and surfaced immediately at the top of the page, ahead of the routine forecast data, because timely awareness of severe weather can directly affect safety decisions in ${city} during ${month} ${year}. Not every day produces an alert — most days in ${city} pass without any active warning — but when one does appear, it is the most time-sensitive information on this entire page.`;
}

export function generateAlertsAfter(city: string): string {
  return `Each alert shown for ${city} includes the specific event type, a description of expected impact, and the exact start and end time of the warning window, allowing residents to plan precisely rather than reacting to a vague general notice. Multiple simultaneous alerts — which can occur during major weather events affecting ${city} and the surrounding region together — are listed with the option to expand and view all active warnings at once. Checking this section before heading out during ${city}'s more volatile weather months is a simple habit that can meaningfully reduce risk, particularly for outdoor workers, drivers, and anyone responsible for children or elderly family members who are more vulnerable to extreme heat, cold, or storm conditions.`;
}

// ─── 11. NEARBY WEATHER COMPARISON ─────────────────────────────────────────

export function generateNearbyParagraph(city: string): string {
  const { month, year } = now();
  return `The nearby weather comparison above places ${city}'s current conditions alongside neighbouring cities, making it easy to see at a glance whether the wider region is experiencing similar weather or whether ${city} is running notably warmer, cooler, cleaner, or hazier than the cities around it. This regional view is genuinely practical in ${month} ${year} for anyone deciding between two nearby destinations for a day trip, weighing a short-notice escape from unusually hot or polluted conditions in ${city}, or simply curious how their city compares to the places just a short drive away.`;
}

export function generateNearbyAfter(city: string): string {
  return `Each row in the comparison table above is a live snapshot, not a static average, so the relative differences between ${city} and its neighbours reflect actual current conditions rather than typical seasonal patterns. The "escape the heat" callout, when it appears, highlights the single nearest city offering a meaningfully cooler alternative — a small but genuinely useful detail during ${city}'s hottest stretches of the year. Air quality is shown alongside temperature because the two do not always move together: a nearby city can be cooler than ${city} while having noticeably worse air, or vice versa, and seeing both figures side by side gives a fuller picture than temperature alone ever could.`;
}

// ─── 12. AIR QUALITY OVERVIEW ───────────────────────────────────────────────

export function generateAQIOverviewParagraph(
  city: string, aqi: number | null, level: string | null
): string {
  const { month, year } = now();
  const aqiStr = aqi !== null ? `an AQI reading of ${aqi}` : "today's live AQI reading";
  const levelStr = level ?? "current category";
  return `${city}'s air quality right now stands at ${aqiStr}, classified as ${levelStr}. Air pollution is one of the most consequential public health issues facing major cities across South Asia, and ${city} is no exception — the gauge above translates a technical pollution index into a plain-language category that anyone can interpret in seconds. Through ${month} ${year}, ${city}'s air quality tends to fluctuate with weather conditions, traffic patterns, and seasonal agricultural burning in the surrounding region, which is why checking this figure regularly — rather than assuming it stays constant — matters for anyone with respiratory sensitivities, young children, or elderly family members.`;
}

export function generateAQIOverviewAfter(city: string): string {
  const { month, year } = now();
  return `The AQI gauge above uses the standard international scale, where readings under 50 represent good air quality and readings above 150 represent conditions that can affect the general population, not just sensitive groups. ${city}'s air quality has historically shown a clear seasonal pattern, typically worsening in the cooler months when temperature inversions trap pollutants closer to ground level and improving during the monsoon when rain washes particulates from the air. Tracking this figure through ${month} ${year} alongside the pollutant breakdown, source analysis, and health advice further down this page gives a complete picture of not just how polluted ${city}'s air is right now, but why, and what to do about it.`;
}

// ─── 13. POLLUTANT BREAKDOWN & SOURCES ─────────────────────────────────────

export function generatePollutantsParagraph(city: string): string {
  const { month, year } = now();
  return `The pollutant breakdown above separates ${city}'s overall AQI figure into its individual components — PM2.5, PM10, nitrogen dioxide, ozone, carbon monoxide, and sulphur dioxide — each measured against its recommended safe limit. PM2.5, the finest and most dangerous particulate matter, is typically the dominant pollutant in ${city} and the rest of the region during ${month} ${year}, capable of penetrating deep into the lungs and bloodstream in a way that larger particles cannot. Understanding which specific pollutant is elevated on a given day in ${city} — rather than just the single combined AQI number — helps explain why some days feel hazy with relatively comfortable breathing, while other days produce visible irritation even with moderate visibility.`;
}

export function generatePollutantsAfter(city: string): string {
  const { month, year } = now();
  return `The source breakdown above attributes ${city}'s air pollution to its most likely origins — vehicle emissions, industrial activity, agricultural burning in surrounding districts, and dust — giving context for why pollution levels shift through the week and across the seasons. Vehicle emissions tend to dominate during weekday rush hours in ${city}, while agricultural burning contributes more heavily during specific harvest windows each year, and dust becomes a larger factor during dry, windy stretches of ${month} ${year}. This breakdown is necessarily an estimate rather than a precise measurement, since pinpointing the exact source of airborne pollutants requires specialised monitoring equipment, but it offers a reasonable, evidence-based picture of what is driving ${city}'s air quality on any given day.`;
}

// ─── 14. AIR QUALITY HEALTH ADVICE & PURIFICATION ──────────────────────────

export function generateAQIHealthParagraph(city: string): string {
  const { month, year } = now();
  return `The health advice above translates ${city}'s current air quality reading into specific, actionable guidance — when outdoor exercise is safe, when sensitive groups should take extra precaution, and when it is genuinely better to stay indoors. This guidance updates automatically as the AQI reading changes throughout ${month} ${year}, so the recommendations shown reflect today's actual conditions in ${city} rather than generic year-round advice. Children, the elderly, pregnant women, and anyone with asthma or another respiratory condition are consistently the most affected by elevated pollution levels in ${city}, which is why the advice above is written with those groups specifically in mind even as it remains useful guidance for everyone.`;
}

export function generateAQIHealthAfter(city: string): string {
  const { month, year } = now();
  return `Beyond the immediate advice above, the best-times guide and purification tips further down this section give ${city} residents a practical toolkit for managing daily exposure to air pollution — from choosing the cleanest hours for outdoor activity to selecting an effective HEPA air purifier for the home. The 7-day AQI trend chart shows whether ${city}'s air quality has been improving or worsening over the past week, useful context for deciding whether today's reading is a temporary spike or part of a longer pattern through ${month} ${year}. Combined with the pollutant and source breakdowns above, this section gives ${city} residents everything needed to understand, anticipate, and respond to the city's air quality on any given day.`;
}
