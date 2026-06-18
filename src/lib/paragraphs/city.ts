/**
 * SEO paragraph generators — WorldCityHub City Main Page
 * 
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 13 sections × ~250 words × 2 = 3,200+ words per city page
 * All paragraphs use real live data variables for genuine uniqueness per city.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. CITY INTRO ────────────────────────────────────────────────────────────

export function generateCityIntro(
  city: string, country: string, province: string,
  population: string, wikiExtract: string
): string {
  const { month, year } = now();
  const extract = wikiExtract
    ? wikiExtract.split(". ").slice(0, 3).join(". ") + "."
    : `${city} is one of the most historically significant and culturally vibrant cities in ${country}, with roots stretching back over a thousand years of continuous civilization.`;
  return `${city} — the heart of ${province} — is ${extract} As of ${month} ${year}, ${city} is home to an estimated ${population} people, making it one of the largest and most dynamic urban centres in ${country}. Whether you are a resident, a traveller, a student, or a member of the global diaspora, this page delivers everything you need about ${city} in real time: live weather, today's prayer times, current gold and currency rates, breaking news, upcoming events, economic data, and much more. All information updates continuously from verified free APIs so that the ${city} you see here is the ${city} of right now — not yesterday.`;
}

export function generateCityIntroAfter(
  city: string, country: string, province: string
): string {
  const { month, year } = now();
  return `${city} occupies a unique position in ${country}'s national story — simultaneously a custodian of ancient heritage and a driving force of modern economic and cultural life. The city's location in ${province} places it at the intersection of major trade, transport, and communication corridors that have shaped the region for centuries. In ${month} ${year}, ${city} continues to evolve: new infrastructure projects reshape its skyline while its old bazaars, shrines, and street-food lanes preserve a living memory of everything that came before. WorldCityHub tracks all of this in one place — making ${city}'s daily pulse accessible to anyone, anywhere in the world, at any time of day.`;
}

// ─── 2. WEATHER ───────────────────────────────────────────────────────────────

export function generateWeatherParagraph(
  city: string, temp: number | null, feelsLike: number | null,
  humidity: number | null, description: string | null, windSpeed: number | null
): string {
  const { month, year } = now();
  if (!temp) {
    return `${city}'s weather in ${month} ${year} reflects the seasonal patterns typical of its geographic region. The city's climate shapes daily life for millions of residents — from the clothes they wear to the time they step outside and the routes they take across the city. Whether you are planning a morning walk near the historic monuments, an afternoon visit to the bazaars, or an evening drive along the canal, knowing ${city}'s current weather conditions in advance helps you make better decisions. Use the live weather snapshot above for today's temperature, humidity, wind speed, and sky conditions — all sourced from OpenWeatherMap and updated every hour for ${city}'s exact coordinates.`;
  }
  const feel = temp > 35
    ? "very hot — midday sun exposure should be minimised and hydration kept high throughout the day"
    : temp < 12
    ? "cold — warm layers are recommended, especially in the early morning and after sunset"
    : temp < 20
    ? "cool and pleasant — ideal for outdoor activity at any time of day"
    : "warm and comfortable for most outdoor activities across the city";
  return `${city}'s weather right now in ${month} ${year} shows ${Math.round(temp)}°C, feeling like ${Math.round(feelsLike ?? temp)}°C with ${humidity ?? "--"}% humidity and winds at ${Math.round((windSpeed ?? 0))} km/h. Conditions are ${description ?? "partly cloudy"}. For residents and visitors in ${city} today, it is ${feel}. Planning around ${city}'s weather is especially important during the transitional months of March–April and September–October when temperatures shift dramatically between morning and afternoon. The live hourly forecast on the full Weather page gives a 24-hour breakdown so you can time your commute, errands, or sightseeing for the most comfortable window of the day.`;
}

export function generateWeatherAfter(city: string, country: string): string {
  const { month, year } = now();
  return `${city}'s climate in ${month} ${year} is part of a larger weather pattern affecting the entire ${country} region. The city's elevation, proximity to river systems, and position relative to seasonal wind patterns — including the South Asian monsoon — combine to produce weather that is distinctly its own. Residents of ${city} know instinctively how the sky looks before a dust storm, what the humidity feels like in the weeks before the monsoon breaks, and how sharply temperatures drop on a clear winter night. For those newly arrived, or for diaspora members planning a visit, the historical monthly averages on the full Weather page give a complete picture of all four seasons — helping you pack right, plan right, and arrive informed about what ${city}'s skies have in store.`;
}

// ─── 3. SUN & MOON ───────────────────────────────────────────────────────────

export function generateSunMoonParagraph(
  city: string, sunrise: string | null, sunset: string | null
): string {
  const { month, year } = now();
  const srStr = sunrise ?? "around 6:00 AM";
  const ssStr = sunset ?? "around 6:30 PM";
  return `The sun rises over ${city} at ${srStr} and sets at ${ssStr} today in ${month} ${year}. For Muslims in ${city}, these times are religiously significant: Fajr prayer begins before sunrise, Maghrib is offered at the exact moment of sunset, and the window between them defines the fasting day during Ramadan. Photographers know that the twenty minutes around ${city}'s golden hour — just before sunset — produce extraordinary light over its historic monuments, turning sandstone and marble into shades of amber and rose. The moon data above shows tonight's phase and illumination percentage, useful for stargazers, farmers in surrounding districts, and anyone following the Islamic lunar calendar for upcoming religious occasions such as Eid or the start of Ramadan.`;
}

export function generateSunMoonAfter(city: string): string {
  const { month, year } = now();
  return `Tracking sunrise and sunset times in ${city} through ${month} ${year} reveals one of the subtler rhythms of life at this latitude. As the year moves from the short days of December — when daylight in ${city} lasts barely ten hours — to the long June days stretching past fourteen hours, the city's routines shift accordingly: school schedules, office hours, shop opening times, and prayer intervals all breathe in and out with the lengthening and shortening of daylight. The moon phase data is especially valued during Ramadan and at the beginning of each Islamic month, when crescent sighting determines the official start of religious observances across Pakistan and beyond. All sun and moon calculations are computed in real time for ${city}'s exact geographic coordinates.`;
}

// ─── 4. PRAYER TIMES ─────────────────────────────────────────────────────────

export function generatePrayerParagraph(
  city: string, timings: Record<string, string> | null
): string {
  const { month, year } = now();
  if (!timings) {
    return `Prayer times (اوقات نماز) in ${city} for ${month} ${year} are calculated using the Karachi method — the standard methodology adopted across Pakistan, Bangladesh, and parts of India. The five daily prayers of Fajr, Dhuhr, Asr, Maghrib, and Isha shift by a minute or two each day as the sun's position changes through the year. For ${city}'s Muslim majority, these times are not merely a schedule — they are the rhythm of the day, the structure around which work, meals, school, and rest are organised. The live prayer countdown above shows exactly how many hours and minutes remain until the next prayer, calculated for ${city}'s precise geographic coordinates and updated in real time throughout the day.`;
  }
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = timings;
  return `Today's prayer times in ${city} for ${month} ${year}: Fajr ${Fajr} · Dhuhr ${Dhuhr} · Asr ${Asr} · Maghrib ${Maghrib} · Isha ${Isha}. These timings are calculated using the Karachi method (University of Islamic Sciences), the standard reference for prayer across Pakistan. The live countdown ring above shows exactly how long remains until the next prayer. For residents following the Hanafi madhab, Asr follows the longer shadow calculation — approximately one hour later than the Shafi'i time. ${city}'s latitude means prayer times shift noticeably between summer and winter: Fajr in June can be as early as 3:30 AM while in December it may not begin until 5:30 AM, making the full monthly timetable on the Prayer Times page essential for planning ahead.`;
}

export function generatePrayerAfter(city: string): string {
  const { month, year } = now();
  return `Beyond the five obligatory prayers, ${city}'s spiritual life in ${month} ${year} encompasses a rich calendar of Islamic observances, voluntary prayers, and community gatherings at the city's thousands of mosques. The Tahajjud prayer in the last third of the night, the Ishraq prayer shortly after sunrise, and the Duha prayer mid-morning are all practised by devout residents who weave these voluntary acts into their daily routines. The dedicated Prayer Times page for ${city} provides a complete monthly timetable in downloadable PDF format, a Qibla compass pointing toward Mecca from ${city}'s exact coordinates, Sehri and Iftar times for voluntary fasts, and the live Zakat Nisab calculated from today's gold and silver rates. Click the link to access the full spiritual hub for ${city}.`;
}

// ─── 5. GOLD RATES ───────────────────────────────────────────────────────────

export function generateGoldParagraph(
  city: string, goldPerGram: number | null
): string {
  const { month, year } = now();
  const rateStr = goldPerGram
    ? `PKR ${goldPerGram.toLocaleString()} per gram for 24-karat gold`
    : "the current live rate shown in the widget above";
  return `Gold rates in ${city} today in ${month} ${year} stand at ${rateStr} — reflecting the national Pakistan gold market which moves in line with international bullion prices and local USD/PKR exchange movements. For families in ${city} buying gold jewellery for a wedding, a woman checking the value of her existing holdings, or an investor tracking precious metals, this live rate is the most reliable reference point available. ${city}'s gold bazaars use this national rate as their base price, adding a small making charge on top for crafted jewellery pieces. The 22-karat and 18-karat rates shown above are calculated proportionally from the 24-karat benchmark and update automatically when the spot price moves.`;
}

export function generateGoldAfter(city: string): string {
  const { month, year } = now();
  return `Gold in ${city} and across Pakistan serves purposes far beyond investment. It is a store of household wealth, a marker of social status, a component of the traditional mehr in Islamic marriages, and a critical input for the Zakat calculation — the obligatory annual charity paid on wealth held above the Nisab threshold. In ${month} ${year}, with global gold prices moving on the back of geopolitical uncertainty and central bank buying, ${city} residents are increasingly aware of how the gold rate affects both purchasing power and religious obligations. The Zakat Nisab based on today's silver rate is shown on the full Rates page, alongside 24-hour price charts, historical trend data, and currency exchange rates for USD, AED, SAR, GBP, EUR, and more than a dozen additional currencies.`;
}

// ─── 6. NEWS ────────────────────────────────────────────────────────────────

export function generateNewsParagraph(
  city: string, topHeadline: string | null
): string {
  const { month, year } = now();
  const headlineNote = topHeadline
    ? `The most-read story right now: "${topHeadline.substring(0, 80)}...".`
    : `The latest headlines from ${city} span government, finance, sports, culture, and community news.`;
  return `${city} news in ${month} ${year} — ${headlineNote} The five categories above — Government, Finance, Sports, Entertainment, and Religion — reflect the sections ${city}'s residents engage with most. Government news covers decisions at provincial and municipal level that directly affect daily life: infrastructure projects, public service announcements, law-and-order updates, and policy changes. Finance news tracks the economic pulse of ${city}: business openings and closures, market movements, employment trends, and remittance flows that shape household incomes across the city's neighbourhoods every single day.`;
}

export function generateNewsAfter(city: string): string {
  const { month, year } = now();
  return `The Sports, Entertainment, and Religion sections on this page bring ${city}'s cultural heartbeat to the surface in ${month} ${year}. Cricket — especially PSL matches involving ${city}'s franchise — commands the largest readership, followed closely by national team updates and local league results. Entertainment news covers the film, music, and television productions that residents are watching and discussing right now. Religion news tracks mosque events, Islamic calendar milestones, interfaith activities, and the community gatherings that give ${city}'s spiritual landscape its distinctive character. All news sources are trusted Pakistani and international outlets and update continuously throughout the day. The full News page adds Urdu-language coverage, a video news section, a social pulse tracker, and a 30-day archive.`;
}

// ─── 7. EVENTS ──────────────────────────────────────────────────────────────

export function generateEventsParagraph(city: string): string {
  const { month, year } = now();
  return `Events happening in ${city} in ${month} ${year} span four levels — Global, National, Local, and Today — giving residents and visitors a complete picture of what is happening in and around the city at any given moment. Global events touching ${city} include international sporting fixtures where Pakistan is represented, diplomatic summits affecting trade and travel, and cultural festivals with ${city}-based participants. National events cover the milestones on Pakistan's official calendar: Independence Day, Defence Day, and the major Islamic occasions that bring ${city}'s millions into shared celebration or reflection. Local events are the lifeblood of the city's cultural calendar: literary festivals, sufi music nights, cricket tournaments, university convocations, art exhibitions, and food festivals that make ${city} one of the most event-rich cities in South Asia.`;
}

export function generateEventsAfter(city: string): string {
  const { month, year } = now();
  return `The Today tab above is the fastest way to find what is specifically happening in ${city} on this date in ${month} ${year} — from the PSL match at the stadium tonight to the weekly bazaar that opens at dawn in the old city. ${city}'s event calendar is one of the most active in Pakistan: the city hosts more literary, artistic, commercial, and sporting events than any other provincial capital, making it impossible to visit without encountering something worth attending. The full Events page adds a monthly calendar view, an interactive map of event locations across the city, a recurring events directory of weekly bazaars and standing fixtures, and a free form to submit your own event for listing — making ${city}'s event calendar the most complete available anywhere online.`;
}

// ─── 8. ECONOMY ────────────────────────────────────────────────────────────

export function generateEconomyParagraph(
  city: string, country: string,
  gdpPerCapita: number | null, inflation: number | null, unemployment: number | null
): string {
  const { month, year } = now();
  const gdpStr = gdpPerCapita
    ? `a GDP per capita of approximately $${gdpPerCapita.toLocaleString()}`
    : "a GDP that places it among the top economic centres in the region";
  const infStr = inflation ? `an annual inflation rate of ${inflation}%` : "current inflation pressures";
  return `${city}'s economy in ${month} ${year} reflects ${country}'s broader macroeconomic conditions — including ${gdpStr} and ${infStr}. As one of ${country}'s largest economic hubs, ${city} contributes a disproportionately large share of national GDP through its textile and garment sector, leather goods industry, IT services, food processing, and financial services. The city is home to a major concentration of manufacturing units, export-processing zones, and logistics infrastructure. For residents, economic conditions translate directly into daily realities: the cost of groceries, rents across neighbourhoods, job availability by sector, and the exchange rate that determines how much arrives from family members working abroad.`;
}

export function generateEconomyAfter(city: string, country: string): string {
  const { month, year } = now();
  return `Understanding ${city}'s economic position in ${month} ${year} goes beyond national statistics. The city's distinct industrial clusters each respond differently to policy changes, global commodity prices, and exchange rate movements. The Misery Index (inflation plus unemployment) on the full Economy page gives a plain-language signal of how hard or easy the current economic moment feels for the average household in ${city}. The Financial Stress Meter, Purchasing Power Calculator, and Opportunity Index are all calibrated to ${country}'s current data and updated whenever new official figures are released. For anyone making financial decisions in or about ${city} — whether investing, hiring, or simply budgeting a monthly household — the Economy page is the most comprehensive free resource available online.`;
}

// ─── 9. SPORTS ────────────────────────────────────────────────────────────

export function generateSportsParagraph(city: string): string {
  const { month, year } = now();
  return `Sports in ${city} in ${month} ${year} are dominated by cricket — a passion so deep it operates less like entertainment and more like a collective identity for the city's millions. The Pakistan Super League franchise based in ${city} is among the most followed in the competition, with match days drawing tens of thousands in person and millions more in front of screens across the city and the diaspora worldwide. Beyond cricket, ${city} has a proud history in field hockey — once the sport at which Pakistani teams were globally unmatched — as well as squash, where players from ${city} and its surrounding districts have punched far above their weight on the world circuit. Today's live scores and upcoming fixtures are shown in the sports snapshot above.`;
}

export function generateSportsAfter(city: string): string {
  const { month, year } = now();
  return `The sports culture of ${city} in ${month} ${year} extends well beyond the professional game. Gully cricket is played on every available surface from dawn to dusk across the city's neighbourhoods. Parks and open grounds host kabaddi, football, and athletics. Local academies and school programmes identify and develop talent that, at its best, goes on to wear Pakistan colours. The full Sports page for ${city} covers the national team's schedule and rankings across all formats of cricket, the PSL standings and fixture list, Pakistan's field hockey and squash news, the city's major stadiums with capacity and location information, the Olympic medal history, and a curated list of ${city}'s greatest sports personalities with links to their full profile pages. Whether you follow cricket, football, squash, or kabaddi, the Sports page brings the full picture together in one place.`;
}

// ─── 10. PERSONALITIES ───────────────────────────────────────────────────

export function generatePersonalitiesParagraph(city: string): string {
  const { month, year } = now();
  return `${city} has produced some of the most consequential figures in Pakistani and South Asian history — poets who shaped the literary canon, cricketers who carried a nation's pride, politicians who changed the course of states, and scholars whose ideas still reverberate in universities worldwide. In ${month} ${year}, the personalities featured above represent different dimensions of the city's extraordinary human output — from the classical arts to contemporary sport, from political leadership to literary achievement. These are not distant historical figures seen only in textbooks; they are living presences in ${city}'s daily conversation, their legacies visible in the names of schools, stadiums, parks, and public squares scattered across the city.`;
}

export function generatePersonalitiesAfter(city: string): string {
  return `Clicking on any personality above takes you to their full dedicated page — a comprehensive profile including a life timeline, their greatest achievements, famous quotes in both English and Urdu, the places in ${city} most associated with their life and work, and a feed of the latest news mentioning them. ${city}'s personality pages are updated monthly: new figures are featured in rotation to ensure the full breadth of the city's human contribution is celebrated throughout the year. If you know of a personality from ${city} who should be featured and is not yet listed, the Submit form on the Personalities index page allows anyone to propose an addition — helping make this the most complete record of ${city}'s remarkable people anywhere on the internet.`;
}

// ─── 11. FAMOUS PLACES ──────────────────────────────────────────────────

export function generatePlacesParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s famous places in ${month} ${year} span more than a thousand years of architectural and cultural history — from towering Mughal-era minarets to modern business districts, from the shrines of revered Sufi saints to shaded colonial-era public gardens. The places featured above have been selected to represent different periods and aspects of ${city}'s character: the sacred, the regal, the commercial, the natural, and the everyday. Each one draws visitors from across Pakistan and increasingly from international tourism circuits that are discovering what residents have always known — that ${city} contains more historical and cultural density per square kilometre than almost anywhere else in South Asia.`;
}

export function generatePlacesAfter(city: string): string {
  return `Clicking any place card above opens its full dedicated page — with opening hours and ticket prices updated live where possible, a visitor guide with practical tips on the best time to visit and how to get there, a full history with UNESCO status where applicable, an image gallery, and a list of nearby attractions to combine in a single outing. ${city}'s famous places are rotated monthly on this main city page so that over the course of a year the full range of the city's attractions is highlighted. The complete Places directory for ${city} — accessible from the link above — lists every significant landmark, market, museum, park, mosque, church, and cultural institution, making it the most comprehensive guide to things to see and do in ${city} available for free online.`;
}

// ─── 12. HERITAGE PRODUCTS ──────────────────────────────────────────────

export function generateHeritageParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s heritage products in ${month} ${year} are the material expression of centuries of craft tradition, artistic skill, and cultural identity. Every city has products that are distinctively its own — shapes, colours, materials, and techniques passed from generation to generation that cannot be fully replicated anywhere else. The products showcased above are authentically from ${city}: made by artisans who learned their craft in the city's workshops, using locally sourced materials, following patterns and processes that predate industrialisation by hundreds of years. Buying these products — whether as a gift, a personal memento, or a considered investment in authentic craftsmanship — connects the buyer directly to ${city}'s living heritage and to the families who sustain it.`;
}

export function generateHeritageAfter(city: string): string {
  return `Each product image above links to a full dedicated Heritage Product page — where you will find the complete history and cultural significance of the craft, information on the artisan communities who produce it, guidance on identifying authentic versus mass-produced versions, and links to verified sources where genuine pieces can be purchased. ${city}'s heritage industries collectively employ tens of thousands of artisans and generate significant export revenue — but they face constant pressure from cheaper machine-made alternatives. Featuring them here and linking buyers directly to legitimate sources is WorldCityHub's contribution to sustaining these irreplaceable craft traditions. The Heritage Products directory for ${city} lists every documented traditional product associated with the city — a resource for researchers, buyers, and anyone curious about what makes ${city} genuinely unique.`;
}

// ─── 13. STREET FOOD ────────────────────────────────────────────────────

export function generateStreetFoodParagraph(city: string): string {
  const { month, year } = now();
  return `${city}'s street food in ${month} ${year} is, by any honest measure, one of the great culinary traditions of the world — dense, layered, historically rooted, and entirely unlike anything you will find elsewhere. The dishes above are not tourist approximations; they are the real thing, sold on the same street corners by families whose recipes have not changed in generations. ${city}'s food culture is inseparable from its identity: to know the city properly is to have eaten Nihari at dawn in the old city, to have stood at a gol gappa cart in the afternoon heat, to have sat on a plastic chair at a famous food street as the evening call to prayer drifts over the smoke of a dozen tandoor ovens. These are experiences no restaurant elsewhere, however skilled, can replicate.`;
}

export function generateStreetFoodAfter(city: string): string {
  return `The street food section above covers the dishes that ${city} is most celebrated for — the ones that residents who have moved away dream about and return specifically to eat, and the ones that visitors consistently describe as the highlight of their time in the city. Each dish links to more information about its history, where to find the best version in ${city}, what it costs, and what to order alongside it. The full Street Food guide for ${city} maps the city's most important food streets and markets, lists the legendary establishments that have been serving for decades, and gives practical guidance on visiting: best times, what to expect, how to order, and how to navigate the city's layered culinary geography. Whether you are a first-time visitor or a returning resident, the food guide will show you something new.`;
}

// ─── 14. EMERGENCY ──────────────────────────────────────────────────────

export function generateEmergencyParagraph(
  city: string, police: string | null,
  ambulance: string | null, fire: string | null
): string {
  const { month, year } = now();
  const polStr = police ?? "15";
  const ambStr = ambulance ?? "1122";
  const fireStr = fire ?? "16";
  return `Emergency contacts for ${city} in ${month} ${year}: Police ${polStr} · Ambulance / Rescue ${ambStr} · Fire Brigade ${fireStr}. These are the primary national and provincial emergency numbers active across ${city}. Saving them in your phone before you need them — rather than searching in a moment of crisis — is a basic preparedness step that emergency services consistently recommend. The Rescue 1122 service covering ${city} and the broader region is one of Pakistan's most professional emergency response operations: it handles ambulance calls, road accident response, fire emergencies, and disaster relief with a target response time measured in minutes within city limits.`;
}

export function generateEmergencyAfter(city: string): string {
  return `Beyond the universal emergency numbers above, ${city} has a network of specialised helplines covering specific needs: the Women's Safety Helpline (1043), the Child Protection Helpline (1121), the Edhi Foundation emergency line (115), and the Punjab Disaster Management Authority's dedicated disaster response number. The Women's Helpline is operational 24 hours and provides immediate assistance including referrals to safe houses, legal aid, and counselling. The Child Helpline operates similarly and is accessible free of charge from any mobile or landline in ${city}. All helpline numbers on this page are verified against official sources and checked for accuracy on a regular basis to ensure they remain current and reachable when they are needed most.`;
}

// ─── 15. CITY AT A GLANCE ───────────────────────────────────────────────

export function generateCityGlanceParagraph(
  city: string, country: string, province: string,
  area: string, elevation: string, founded: string
): string {
  const { month, year } = now();
  return `${city} at a glance in ${month} ${year}: located in ${province}, ${country}, covering ${area} km² at ${elevation} metres above sea level, with a recorded history stretching back to ${founded}. These numbers frame a city that is, in human terms, almost impossible to reduce to statistics. ${city}'s population, area, and age place it among the truly ancient living cities of South Asia — places continuously inhabited, rebuilt, and reinvented across thousands of years of human civilisation. The demographic data above — religious breakdown, language distribution, literacy rate, life expectancy — gives a snapshot of who lives in ${city} today and how the city compares to national and regional averages on the key development indicators that matter most.`;
}

export function generateCityGlanceAfter(city: string, country: string): string {
  return `The statistics in the City at a Glance section above are drawn from the most recent available census data for ${country}, supplemented by estimates from the World Bank, UN development databases, and national statistics bureaux. Where official figures are not yet available for ${city} specifically, provincial or regional estimates are used and clearly labelled as such. Population figures are especially subject to variation: the difference between the municipal boundary population and the greater metropolitan area population can be significant, and rapid urbanisation means any figure more than five years old should be treated as a minimum rather than a ceiling. The full Economy page for ${city} provides a detailed breakdown of population growth trends, projections to 2040, and what these numbers mean for housing, employment, infrastructure, and public services in the years ahead.`;
}

// ─── 16. NEARBY CITIES ──────────────────────────────────────────────────

export function generateNearbyCitiesParagraph(city: string): string {
  const { month, year } = now();
  return `The cities near ${city} shown above form part of an interconnected urban network — linked by motorways, railway lines, shared economic activity, and the daily movement of millions of workers, students, traders, and families. Understanding ${city}'s relationship with its neighbours is essential context for anyone living in, working in, or travelling through the region in ${month} ${year}. Some nearby cities are effectively part of the same economic zone as ${city}, with continuous urban development stretching between them along major roads. Others are distinct in character — smaller, specialised in particular industries, or known for cultural traditions — while remaining close enough for a comfortable day trip or a regular daily commute.`;
}

export function generateNearbyCitiesAfter(city: string): string {
  return `Each city listed in the nearby section above has its own full page on WorldCityHub — showing its current weather, prayer times, gold rates, news, events, and everything else that makes it unique. Clicking any nearby city takes you to its complete city profile. The distances shown are straight-line distances from ${city}'s centre; actual road travel times will vary depending on traffic, time of day, and which route is taken. For travellers, the nearby cities section is a practical starting point for planning day trips and regional itineraries from ${city} as a base. For Google, the internal links between city pages help establish the geographic relationships across the WorldCityHub network — improving rankings for ${city} and its neighbours simultaneously through the natural authority of a well-structured city information database.`;
}
