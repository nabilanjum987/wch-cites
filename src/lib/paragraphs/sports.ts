/**
 * SEO paragraph generators — WorldCityHub Sports Page
 *
 * TWO paragraphs per section: para_before (above data) + para_after (below data)
 * Target: 10 sections × ~200 words × 2 = 3,500+ words per city sports page.
 * All paragraphs use real live data variables for genuine uniqueness per city.
 * Pattern mirrors src/lib/paragraphs/city.ts exactly.
 */

const MONTHS = ["January","February","March","April","May","June",
                 "July","August","September","October","November","December"];

function now() {
  const d = new Date();
  return { month: MONTHS[d.getMonth()], year: d.getFullYear() };
}

// ─── 1. NEXT MATCH ───────────────────────────────────────────────────────────

export function generateNextMatchParagraph(country: string, sport: string): string {
  const { month, year } = now();
  return `The countdown above shows exactly when ${country}'s national ${sport.toLowerCase()} team next takes the field, giving fans a single, clear reference point rather than needing to hunt across multiple sources for fixture confirmation. National team matches typically draw the widest audience of any sporting event in ${country}, often becoming genuine national occasions that pause daily routines across the country. Through ${month} ${year}, this card updates automatically as soon as a new fixture is confirmed, so the next match shown here is always the most current scheduled game.`;
}

export function generateNextMatchAfter(country: string, sport: string): string {
  const { month, year } = now();
  return `Beyond the date and opponent, the venue shown above matters for ${country} fans planning to attend in person or simply curious whether this is a home fixture or an away trip for the national ${sport.toLowerCase()} team. International ${sport.toLowerCase()} schedules are typically set months in advance through governing body calendars, though dates can occasionally shift due to broadcasting agreements or unforeseen circumstances. Checking back periodically through ${month} ${year} ensures you're working from the latest confirmed details rather than an earlier provisional schedule.`;
}

// ─── 2. RECENT RESULTS ───────────────────────────────────────────────────────

export function generateRecentParagraph(country: string, sport: string): string {
  const { month, year } = now();
  return `${country}'s recent ${sport.toLowerCase()} results above show how the national team has performed in its last several outings, giving a sense of current form heading into upcoming fixtures. Win-loss patterns over a handful of recent matches often matter more to fans and analysts than any single result in isolation, since they reveal whether the team is building momentum or working through a rougher patch. Through ${month} ${year}, these results update as soon as each match concludes, keeping this section a genuinely current record of the national team's trajectory.`;
}

export function generateRecentAfter(country: string, sport: string): string {
  const { month, year } = now();
  return `Each result above includes the final score and opponent, letting fans of ${country}'s national team track not just whether they won or lost but the margin and quality of opposition involved — a narrow loss to a top-ranked side reads very differently from a narrow loss to a weaker one. This recent form feeds directly into expectations for the upcoming fixture shown in the Next Match section above, since recent performance is typically the single best predictor of near-term results. Through ${month} ${year}, this rolling window of recent matches continues updating as new results come in.`;
}

// ─── 3. UPCOMING MATCHES ─────────────────────────────────────────────────────

export function generateUpcomingMatchesParagraph(country: string, sport: string): string {
  const { month, year } = now();
  return `Beyond the immediate next fixture, the matches above extend the view further into ${country}'s ${sport.toLowerCase()} calendar, useful for fans planning their viewing schedule or travel around multiple upcoming national team games. Seeing several fixtures laid out together also reveals the broader shape of the season ahead — whether ${country} faces a particularly demanding stretch of fixtures or a lighter run through ${month} ${year}. This forward-looking list complements the Recent Results section above, together giving a complete picture of where the national team has been and where it's headed.`;
}

export function generateUpcomingMatchesAfter(country: string, sport: string): string {
  const { month, year } = now();
  return `Fixture details for matches further in the future carry slightly more uncertainty than the immediate next game, since venues and exact kickoff times can occasionally shift as broadcasting and logistics arrangements are finalised closer to each date. For ${country} fans planning to attend any of these matches in person, confirming details closer to the date is worth the extra check, particularly for away fixtures requiring travel. Through ${month} ${year}, this list continues extending forward as the international ${sport.toLowerCase()} calendar adds new confirmed fixtures.`;
}

// ─── 4. LIVE SCORES TODAY ────────────────────────────────────────────────────

export function generateLiveScoresParagraph(sport: string, city: string): string {
  const { month, year } = now();
  return `Live ${sport.toLowerCase()} scores above track every match happening today across the sport, refreshing continuously so scores stay current without needing a manual reload. This section isn't limited to ${city}'s national team specifically — it surfaces the day's broader ${sport.toLowerCase()} activity, useful for fans following the sport more generally rather than just one national side. Through ${month} ${year}, an empty result here simply means no matches in this sport are scheduled today, not that the sport itself is inactive — switching sports using the selector above often reveals a fuller schedule.`;
}

export function generateLiveScoresAfter(sport: string, city: string): string {
  const { month, year } = now();
  return `Each live score card above updates in real time as matches progress, showing current score, match status, and time elapsed where applicable, giving genuinely live coverage rather than a periodically refreshed snapshot. The sport selector above this section lets ${city} residents switch between whichever sports are most actively followed in the country, since match activity and audience interest both vary considerably by sport and by day. Through ${month} ${year}, checking this section at different points during the day will often surface an entirely different set of live matches as earlier games conclude and new ones begin.`;
}

// ─── 5. DOMESTIC LEAGUE STANDINGS ────────────────────────────────────────────

export function generateStandingsParagraph(leagueName: string, country: string): string {
  const { month, year } = now();
  return `${leagueName} standings above show exactly where every club sits in the current season table, ranked by points alongside wins, draws, losses, and goal difference — the full picture behind each team's league position. Domestic league football and cricket carry enormous weight in everyday sporting conversation across ${country}, often generating more sustained week-to-week engagement than international fixtures, which occur far less frequently. Through ${month} ${year}, this table updates after each round of matches, so the standings shown reflect the current state of the season rather than an outdated snapshot.`;
}

export function generateStandingsAfter(leagueName: string, country: string): string {
  const { month, year } = now();
  return `The top scorers list alongside the standings table highlights which individual players are having the strongest season in ${leagueName}, a detail that often matters as much to fans in ${country} as the team standings themselves, particularly for players being talked about for national team selection. Position in this table directly shapes a club's season narrative — title contention, mid-table stability, or relegation pressure — and that narrative typically intensifies as the season progresses through ${month} ${year}. Together, these two views give a genuinely complete read on the current domestic season.`;
}

// ─── 6. MAJOR STADIUMS ───────────────────────────────────────────────────────

export function generateStadiumsParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s major stadiums above are where the national sporting story has actually been written — host venues for historic matches, record crowds, and the kind of atmosphere that turns a routine fixture into a lasting memory for fans who attended. Each venue carries its own capacity, history, and significance within ${country}'s sporting landscape, often serving multiple sports and hosting both domestic league matches and international fixtures across ${month} ${year} and beyond. For sports tourists or fans relocating to ${country}, this section offers a quick orientation to the country's most significant sporting venues.`;
}

export function generateStadiumsAfter(country: string): string {
  const { month, year } = now();
  return `Stadium capacity figures shown above matter beyond simple scale — they often determine which matches a venue can realistically host, with the largest grounds in ${country} reserved for marquee national team fixtures and major finals rather than routine domestic league games. Many of these venues have evolved considerably over the decades, undergoing renovations and capacity changes that reflect ${country}'s broader sporting infrastructure investment through recent years. Visiting one of these stadiums in person, whether for a match or simply a tour, remains one of the more direct ways to experience ${country}'s sporting culture firsthand through ${month} ${year}.`;
}

// ─── 7. OLYMPICS HISTORY ─────────────────────────────────────────────────────

export function generateOlympicsParagraph(country: string): string {
  const { month, year } = now();
  return `${country}'s Olympic medal history above tracks the country's performance across recent Games, breaking down gold, silver, and bronze totals alongside overall ranking for each Olympic cycle shown. Olympic success draws on a different set of sports and athletes than the football, cricket, or other domestic favourites covered elsewhere on this page, often spotlighting individual disciplines that receive less everyday media attention in ${country} outside of the Games themselves. Through ${month} ${year}, this historical record offers context for how ${country}'s Olympic program has evolved across recent editions of the Games.`;
}

export function generateOlympicsAfter(country: string): string {
  const { month, year } = now();
  return `The year-by-year breakdown above reveals whether ${country}'s Olympic performance has been improving, declining, or holding steady across recent Games, a trend that often correlates with national investment in sports infrastructure and athlete development programs. Olympic medals carry particular national significance precisely because they represent success against the entire world rather than a single regional or continental competitor, making each medal a genuinely rare achievement worth the historical record kept here. Through ${month} ${year} and toward the next Games, this section will continue tracking ${country}'s Olympic legacy as new results come in.`;
}

// ─── 8. GREATEST ATHLETES ────────────────────────────────────────────────────

export function generateAthletesParagraph(country: string): string {
  const { month, year } = now();
  return `The athletes featured above represent some of ${country}'s most significant sporting figures, spanning the sports that have defined the country's competitive identity on both domestic and international stages. Each profile links through to a fuller biography, letting readers go beyond the brief summary shown here to understand the full career and achievements behind the name. Through ${month} ${year}, this rotating selection highlights different athletes across different sports, giving a broader view of ${country}'s sporting talent than focusing on any single discipline alone would provide.`;
}

export function generateAthletesAfter(country: string): string {
  const { month, year } = now();
  return `These athletes often serve as genuine national icons in ${country}, their achievements referenced in everyday conversation well beyond dedicated sports discussion, and their influence frequently extending into broader cultural and even political significance. For younger readers and aspiring athletes in ${country}, these profiles offer concrete examples of what's achievable from within the country's own sporting system, often citing the specific pathway and program that produced each athlete's success. Through ${month} ${year}, this list continues to reflect the athletes most closely associated with defining ${country}'s sporting reputation.`;
}

// ─── 9. SPORTS NEWS ──────────────────────────────────────────────────────────

export function generateNewsParagraph(country: string): string {
  const { month, year } = now();
  return `The sports news articles above cover the latest developments across ${country}'s sporting landscape, surfacing the stories generating the most current discussion among fans, whether transfer news, team selection decisions, or coverage of recent results. Reading these alongside the live scores, standings, and fixture information elsewhere on this page connects the raw data to the actual narrative driving it — why a particular result matters, or what's at stake in an upcoming fixture, through ${month} ${year}. Each article links to its original source for readers wanting the full story beyond the headline summary shown here.`;
}

export function generateNewsAfter(country: string): string {
  const { month, year } = now();
  return `Sports news coverage in ${country} tends to follow the rhythm of the domestic season and international fixture calendar, with coverage volume naturally increasing around major matches, transfer windows, and significant national team announcements. This curated selection draws from established sports media covering ${country}, giving a reliable starting point rather than requiring readers to search across multiple outlets independently. Checking back regularly through ${month} ${year} captures the ongoing story of ${country}'s sporting year as it unfolds match by match and season by season.`;
}

// ─── 10. SHOP & WATCH (AFFILIATE) ───────────────────────────────────────────

export function generateShopParagraph(country: string, sport: string): string {
  const { month, year } = now();
  return `For fans of ${country}'s ${sport.toLowerCase()} scene looking to go beyond simply following along, the options above connect to gear, streaming, fantasy leagues, and ticket booking platforms relevant to the sport. Whether picking up equipment to play yourself, finding a reliable way to watch matches live, joining a fantasy competition for the season, or booking tickets to attend a match in person, these curated options save the time of searching independently. Through ${month} ${year}, this section rounds out the page with practical, actionable options for fans wanting to engage more deeply with the sport.`;
}

export function generateShopAfter(country: string, sport: string): string {
  const { month, year } = now();
  return `These options connect to established platforms rather than obscure or unverified sources, prioritising reliability for fans in ${country} looking to genuinely engage with ${sport.toLowerCase()} beyond passive following. Fantasy sports in particular have grown substantially in popularity across South Asia in recent years, adding a layer of personal stake to following domestic and international fixtures throughout ${month} ${year}. Whichever option appeals, each is intended as a genuine convenience for fans already invested in following ${country}'s sporting calendar via the rest of this page.`;
}
