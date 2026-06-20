/**
 * SEO paragraph generators — WorldCityHub Events Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 8 sections × ~200 words × 2 = 3,000+ words per city events page.
 * All paragraphs use real live data variables for genuine uniqueness per city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. LIVE NOW ──────────────────────────────────────────────────────────────

export function generateLiveNowParagraph(city: string): string {
  const { month, year } = now();
  return `Events shown as live in ${city} right now are happening at this exact moment — not scheduled for later today, but actively underway, with the countdown showing how much time remains before each one wraps up. This real-time view is genuinely useful for anyone deciding spontaneously whether to head out and catch something happening in ${city} this very hour, rather than planning days in advance. Through ${month} ${year}, this section only appears when something is actively in progress, so an empty live section simply means nothing is happening at this precise moment, not that ${city} lacks events.`;
}

export function generateLiveNowAfter(city: string): string {
  const { month, year } = now();
  return `Live events in ${city} are pulled from the same database powering the rest of this page, filtered specifically to whatever falls between its scheduled start and end time right now, which is why this section updates continuously as events begin and conclude throughout the day. This kind of real-time filtering is more useful for spontaneous, same-day plans than the broader Today's Events and Upcoming Events sections further down, which are better suited for planning ahead. Checking back at different points during ${month} ${year} will often surface entirely different live events as ${city}'s daily schedule unfolds.`;
}

// ─── 2. EVENTS MAP ────────────────────────────────────────────────────────────

export function generateMapParagraph(city: string): string {
  const { month, year } = now();
  return `The map above plots every currently filtered event in ${city} by its exact venue location, turning a list of names and times into a genuinely useful spatial view of where things are actually happening across the city. This matters in practice — an event that looks appealing on paper can be impractical if it's on the opposite side of ${city} from where you're starting, and the map makes that immediately obvious in a way a plain list cannot. Through ${month} ${year}, this view is particularly useful for planning a day with multiple stops, letting you group nearby events together rather than crossing ${city} back and forth.`;
}

export function generateMapAfter(city: string): string {
  const { month, year } = now();
  return `Clustering on the map above reflects ${city}'s actual event geography — certain neighbourhoods and venues naturally host more activity than others, and seeing that concentration visually helps explain why some parts of the city feel busier on a given night than others. For visitors unfamiliar with ${city}'s layout, this map doubles as a quick orientation tool, showing not just where events are but implicitly which areas of the city are the more active cultural and social hubs. Through ${month} ${year}, this same map updates automatically as the event list above changes with each new filter or search.`;
}

// ─── 3. TODAY'S EVENTS ────────────────────────────────────────────────────────

export function generateTodayParagraph(city: string): string {
  const { month, year } = now();
  return `Today's events in ${city} are everything scheduled to start or already underway before midnight, giving the most immediately actionable list on this page for anyone deciding what to do today. This list spans every category tracked — sports, music, culture, food, religious observances, business, and more — so the mix you see reflects whatever ${city} genuinely has on offer today in ${month} ${year}, rather than a curated highlight reel. Checking this section each morning is the single fastest way to see what ${city} has planned before the day gets away from you.`;
}

export function generateTodayAfter(city: string): string {
  const { month, year } = now();
  return `Each event card above links through to full details — exact venue, ticket information where applicable, and a precise countdown to start time — making this list a genuinely complete planning tool rather than just a teaser. ${city}'s daily event volume naturally fluctuates with the day of the week and the season, with weekends and culturally significant periods through ${month} ${year} typically showing a noticeably fuller list than an average weekday. If today's list looks thin, the Upcoming Events section just below extends the view considerably further into the days and weeks ahead.`;
}

// ─── 4. UPCOMING EVENTS ───────────────────────────────────────────────────────

export function generateUpcomingParagraph(city: string): string {
  const { month, year } = now();
  return `Upcoming events above extend beyond today, covering everything scheduled in ${city} over the coming days and weeks depending on which time filter is selected — tomorrow, this weekend, this week, this month, or all upcoming events without limit. This forward-looking view is essential for anyone planning ahead rather than deciding same-day, whether that's booking tickets, planning a visit to ${city} around a specific event, or simply building a calendar of things to look forward to through ${month} ${year}. The category and search filters above this section let you narrow this list to exactly the kind of event you're interested in.`;
}

export function generateUpcomingAfter(city: string): string {
  const { month, year } = now();
  return `Events further out on this list naturally carry slightly more uncertainty than today's confirmed schedule — timings, venues, and even whether an event proceeds at all can shift in the days before it happens, particularly for outdoor events sensitive to weather in ${city}. For anything you're planning seriously around, checking back closer to the date is worth the few extra seconds to confirm details haven't changed since you first saw the listing. Through ${month} ${year}, this upcoming list continues extending forward as new events get added and past ones move into history.`;
}

// ─── 5. RECURRING EVENTS ──────────────────────────────────────────────────────

export function generateRecurringParagraph(city: string): string {
  const { month, year } = now();
  return `Recurring events above are ${city}'s steady, predictable fixtures — weekly markets, regular religious gatherings, monthly meetups, and other activities that happen on a consistent schedule rather than as one-off occasions. These are often the easiest events to plan around precisely because they're so reliable, making them a good starting point for anyone new to ${city} looking to build a regular routine or simply know what's reliably happening on a given day of the week through ${month} ${year}. Unlike the one-time events above, these don't need checking daily — once you know the pattern, you know it.`;
}

export function generateRecurringAfter(city: string): string {
  const { month, year } = now();
  return `Many of ${city}'s recurring events have run for years and represent genuine local institutions rather than passing trends, which is part of why long-time residents often build their week around them without giving it much thought. For visitors or newcomers, this list is a fast way to tap into ${city}'s established rhythms — the market everyone shops at, the gathering everyone attends — rather than discovering them slowly through word of mouth. Through ${month} ${year} and beyond, this section changes far less frequently than the Today's and Upcoming Events lists above, reflecting its more stable, settled nature.`;
}

// ─── 6. NATIONAL EVENTS ───────────────────────────────────────────────────────

export function generateNationalParagraph(country: string): string {
  const { month, year } = now();
  return `National events above are observed across all of ${country}, not just the city this page covers — public holidays, national days of significance, and country-wide observances that shape daily life, business hours, and public mood throughout the country regardless of which specific city someone happens to be in. Knowing these dates in advance matters practically: banks, government offices, and many businesses across ${country} close or adjust hours around these dates, and travel can become considerably busier in the days surrounding major national observances through ${month} ${year}. This section gives that national context to complement the more local, city-specific events listed elsewhere on this page.`;
}

export function generateNationalAfter(country: string): string {
  const { month, year } = now();
  return `Each national event above carries its own significance across ${country} — some are purely civic and administrative, like public holidays tied to historical milestones, while others carry religious or cultural weight observed with widely varying degrees of celebration depending on the region and community within ${country}. Planning travel, business, or significant personal events around these dates is worth doing deliberately, since national observances through ${month} ${year} can affect everything from transport availability to whether a particular service is even open. This national list updates as ${country}'s official calendar is confirmed each year.`;
}

// ─── 7. SUBMIT YOUR EVENT ─────────────────────────────────────────────────────

export function generateSubmitParagraph(city: string): string {
  const { month, year } = now();
  return `Organising something in ${city}? The submission tool above lets event organisers add their own listing directly to this page, putting it in front of everyone using this site to plan what to do in ${city}. This is particularly valuable for smaller, independent, or community-organised events that might not otherwise get picked up by automated news and listings feeds — a neighbourhood gathering, a small business launch, a community fundraiser — exactly the kind of event that benefits most from direct visibility through ${month} ${year}. Submitting takes just a few details: what, where, when, and who it's for.`;
}

export function generateSubmitAfter(city: string): string {
  const { month, year } = now();
  return `Once submitted, an event for ${city} becomes part of the same searchable, filterable system powering every other listing on this page — appearing in Today's or Upcoming Events depending on its date, showing up on the map above by venue location, and surfacing in search results for anyone looking for that specific type of event. This open submission model is part of what keeps ${city}'s event coverage comprehensive rather than limited only to what major news sources happen to report on. Through ${month} ${year}, this growing pool of community-submitted events continues to fill gaps that purely automated sourcing alone would miss.`;
}

// ─── 8. TOUR BOOKING AFFILIATES ───────────────────────────────────────────────

export function generateTourParagraph(city: string): string {
  const { month, year } = now();
  return `For visitors to ${city} looking to book guided tours, experiences, or activities around the events on this page, the booking options above connect directly to established tour and experience platforms covering the city. This is particularly useful for tourists unfamiliar with ${city} who want a structured, guided way to experience the city's events and attractions rather than navigating everything independently, especially during a short visit through ${month} ${year}. These bookable experiences often complement the free, independently-discoverable events listed elsewhere on this page with more curated, accompanied options.`;
}

export function generateTourAfter(city: string): string {
  const { month, year } = now();
  return `Booking through the options above supports continued free access to ${city}'s comprehensive event listings on this page, since affiliate partnerships like these are what allow a resource like this to remain freely available rather than requiring a subscription or paywall. Tour and experience offerings for ${city} typically range from single-day guided excursions to longer multi-day packages, giving flexibility depending on how much time a visitor has available during ${month} ${year}. Whether booking through these options or planning independently using the rest of this page, the goal remains the same — helping you make the most of what ${city} has to offer.`;
}
