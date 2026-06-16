const BASE = 'https://www.thesportsdb.com/api/v1/json/2';
const GNEWS_BASE = 'https://gnews.io/api/v1/search';

export type SportPriority = {
  id: string;
  label: string;
  emoji: string;
  tsdbName: string;
};

export type DomesticLeague = {
  id: string;
  name: string;
  country: string;
  emoji: string;
};

export const COUNTRY_SPORT_PRIORITY: Record<string, SportPriority[]> = {
  PK: [
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'hockey', label: 'Hockey', emoji: '🏑', tsdbName: 'Ice Hockey' },
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'squash', label: 'Squash', emoji: '🎾', tsdbName: 'Squash' },
    { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼', tsdbName: 'Kabaddi' },
  ],
  GB: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'rugby', label: 'Rugby', emoji: '🏉', tsdbName: 'Rugby' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'boxing', label: 'Boxing', emoji: '🥊', tsdbName: 'Boxing' },
  ],
  US: [
    { id: 'american_football', label: 'Football', emoji: '🏈', tsdbName: 'American Football' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
    { id: 'baseball', label: 'Baseball', emoji: '⚾', tsdbName: 'Baseball' },
    { id: 'ice_hockey', label: 'Ice Hockey', emoji: '🏒', tsdbName: 'Ice Hockey' },
    { id: 'soccer', label: 'Soccer', emoji: '⚽', tsdbName: 'Soccer' },
  ],
  IN: [
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'hockey', label: 'Hockey', emoji: '🏑', tsdbName: 'Ice Hockey' },
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'badminton', label: 'Badminton', emoji: '🏸', tsdbName: 'Badminton' },
    { id: 'kabaddi', label: 'Kabaddi', emoji: '🤼', tsdbName: 'Kabaddi' },
  ],
  AU: [
    { id: 'rugby', label: 'Rugby', emoji: '🏉', tsdbName: 'Rugby' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'swimming', label: 'Swimming', emoji: '🏊', tsdbName: 'Swimming' },
  ],
  BR: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'volleyball', label: 'Volleyball', emoji: '🏐', tsdbName: 'Volleyball' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'mma', label: 'MMA', emoji: '🥋', tsdbName: 'MMA' },
  ],
  DE: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'motorsport', label: 'Motorsport', emoji: '🏎️', tsdbName: 'Motorsport' },
    { id: 'handball', label: 'Handball', emoji: '🤾', tsdbName: 'Handball' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
  ],
  FR: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'rugby', label: 'Rugby', emoji: '🏉', tsdbName: 'Rugby' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'cycling', label: 'Cycling', emoji: '🚴', tsdbName: 'Cycling' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
  ],
  DEFAULT: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'athletics', label: 'Athletics', emoji: '🏃', tsdbName: 'Athletics' },
  ],
};

export const COUNTRY_DOMESTIC_LEAGUES: Record<string, DomesticLeague> = {
  PK: {
    id: 'psl',
    name: 'Pakistan Super League (PSL)',
    country: 'Pakistan',
    emoji: '🏏',
  },
  IN: {
    id: 'ipl',
    name: 'Indian Premier League (IPL)',
    country: 'India',
    emoji: '🏏',
  },
  GB: {
    id: 'epl',
    name: 'Premier League',
    country: 'England',
    emoji: '⚽',
  },
  US: {
    id: 'nfl',
    name: 'National Football League (NFL)',
    country: 'USA',
    emoji: '🏈',
  },
  AU: {
    id: 'afl',
    name: 'Australian Football League (AFL)',
    country: 'Australia',
    emoji: '🏉',
  },
  BR: {
    id: 'cbv',
    name: 'Campeonato Brasileiro',
    country: 'Brazil',
    emoji: '⚽',
  },
  DE: {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Germany',
    emoji: '⚽',
  },
  FR: {
    id: 'ligue1',
    name: 'Ligue 1',
    country: 'France',
    emoji: '⚽',
  },
};

export function getSportsByCountry(countryCode: string): SportPriority[] {
  return COUNTRY_SPORT_PRIORITY[countryCode.toUpperCase()] ?? COUNTRY_SPORT_PRIORITY.DEFAULT;
}

export function getDomesticLeague(countryCode: string): DomesticLeague | null {
  return COUNTRY_DOMESTIC_LEAGUES[countryCode.toUpperCase()] ?? null;
}

export interface SportEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strVenue: string;
  strStatus: string;
  strTime: string;
  strLeague: string;
  strSport: string;
  strThumb?: string;
  dateEvent?: string;
}

export interface NationalTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strDescriptionEN: string;
  intFormedYear: string;
  strStadium: string;
  strCountry: string;
}

export interface TeamPlayer {
  idPlayer: string;
  strPlayer: string;
  strPosition: string;
  strNationality: string;
  strThumb: string;
  strDescriptionEN: string;
  strCutout?: string;
}

export interface StandingsTeam {
  name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface TopScorer {
  name: string;
  team: string;
  goals: number;
  assists?: number;
}

export interface Stadium {
  id: string;
  name: string;
  capacity: number;
  city: string;
  country: string;
  team: string;
  yearOpened?: number;
}

export interface OlympicMedals {
  year: number;
  city: string;
  gold: number;
  silver: number;
  bronze: number;
  rank: number;
}

export interface Athlete {
  id: string;
  name: string;
  sport: string;
  country: string;
  birthYear: number;
  achievements: string;
  photo?: string;
  wikipediaUrl?: string;
}

export interface SportsNews {
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  publishedAt: string;
}

// Mock data
const MOCK_STANDINGS: Record<string, StandingsTeam[]> = {
  psl: [
    { name: 'Multan Sultans', played: 10, wins: 7, draws: 0, losses: 3, goalsFor: 85, goalsAgainst: 70, goalDiff: 15, points: 14 },
    { name: 'Peshawar Zalmi', played: 10, wins: 6, draws: 0, losses: 4, goalsFor: 80, goalsAgainst: 75, goalDiff: 5, points: 12 },
    { name: 'Islamabad United', played: 10, wins: 5, draws: 0, losses: 5, goalsFor: 78, goalsAgainst: 82, goalDiff: -4, points: 10 },
    { name: 'Lahore Qalandars', played: 10, wins: 5, draws: 0, losses: 5, goalsFor: 77, goalsAgainst: 80, goalDiff: -3, points: 10 },
    { name: 'Karachi Kings', played: 10, wins: 4, draws: 0, losses: 6, goalsFor: 72, goalsAgainst: 85, goalDiff: -13, points: 8 },
  ],
  ipl: [
    { name: 'Mumbai Indians', played: 10, wins: 7, draws: 0, losses: 3, goalsFor: 85, goalsAgainst: 70, goalDiff: 15, points: 14 },
    { name: 'Delhi Capitals', played: 10, wins: 6, draws: 0, losses: 4, goalsFor: 80, goalsAgainst: 75, goalDiff: 5, points: 12 },
    { name: 'Kolkata Knight Riders', played: 10, wins: 5, draws: 0, losses: 5, goalsFor: 78, goalsAgainst: 82, goalDiff: -4, points: 10 },
    { name: 'RCB', played: 10, wins: 5, draws: 0, losses: 5, goalsFor: 77, goalsAgainst: 80, goalDiff: -3, points: 10 },
    { name: 'CSK', played: 10, wins: 4, draws: 0, losses: 6, goalsFor: 72, goalsAgainst: 85, goalDiff: -13, points: 8 },
  ],
};

const MOCK_TOP_SCORERS: Record<string, TopScorer[]> = {
  psl: [
    { name: 'Babar Azam', team: 'Peshawar Zalmi', goals: 485 },
    { name: 'Muhammad Hafeez', team: 'Islamabad United', goals: 430 },
    { name: 'Iftikhar Ahmed', team: 'Karachi Kings', goals: 320 },
    { name: 'Shoaib Malik', team: 'Multan Sultans', goals: 315 },
    { name: 'Fakhar Zaman', team: 'Lahore Qalandars', goals: 310 },
  ],
  ipl: [
    { name: 'Virat Kohli', team: 'Royal Challengers Bangalore', goals: 7000 },
    { name: 'Rohit Sharma', team: 'Mumbai Indians', goals: 6500 },
    { name: 'Suresh Raina', team: 'Chennai Super Kings', goals: 5600 },
    { name: 'MS Dhoni', team: 'Chennai Super Kings', goals: 5400 },
    { name: 'AB de Villiers', team: 'Royal Challengers Bangalore', goals: 5200 },
  ],
};

const MOCK_STADIUMS: Record<string, Stadium[]> = {
  pk: [
    {
      id: 'gaddafi',
      name: 'Gaddafi Stadium',
      capacity: 27800,
      city: 'Lahore',
      country: 'Pakistan',
      team: 'Lahore Qalandars',
      yearOpened: 1959,
    },
    {
      id: 'national',
      name: 'National Stadium',
      capacity: 34228,
      city: 'Karachi',
      country: 'Pakistan',
      team: 'Karachi Kings',
      yearOpened: 1955,
    },
    {
      id: 'multan',
      name: 'Multan Cricket Stadium',
      capacity: 33800,
      city: 'Multan',
      country: 'Pakistan',
      team: 'Multan Sultans',
      yearOpened: 1980,
    },
  ],
  in: [
    {
      id: 'eden',
      name: 'Eden Gardens',
      capacity: 66349,
      city: 'Kolkata',
      country: 'India',
      team: 'Kolkata Knight Riders',
      yearOpened: 1934,
    },
    {
      id: 'wankhede',
      name: 'Wankhede Stadium',
      capacity: 33108,
      city: 'Mumbai',
      country: 'India',
      team: 'Mumbai Indians',
      yearOpened: 1974,
    },
    {
      id: 'arun',
      name: 'Arun Jaitley Stadium',
      capacity: 41820,
      city: 'Delhi',
      country: 'India',
      team: 'Delhi Capitals',
      yearOpened: 1999,
    },
  ],
};

const MOCK_OLYMPICS: Record<string, OlympicMedals[]> = {
  PK: [
    { year: 2020, city: 'Tokyo', gold: 0, silver: 0, bronze: 2, rank: 80 },
    { year: 2016, city: 'Rio', gold: 0, silver: 0, bronze: 1, rank: 90 },
    { year: 2012, city: 'London', gold: 0, silver: 0, bronze: 1, rank: 85 },
  ],
  IN: [
    { year: 2020, city: 'Tokyo', gold: 1, silver: 2, bronze: 4, rank: 48 },
    { year: 2016, city: 'Rio', gold: 2, silver: 1, bronze: 6, rank: 67 },
    { year: 2012, city: 'London', gold: 0, silver: 2, bronze: 4, rank: 55 },
  ],
  GB: [
    { year: 2020, city: 'Tokyo', gold: 22, silver: 21, bronze: 22, rank: 4 },
    { year: 2016, city: 'Rio', gold: 27, silver: 23, bronze: 17, rank: 2 },
    { year: 2012, city: 'London', gold: 29, silver: 17, bronze: 19, rank: 3 },
  ],
};

const MOCK_ATHLETES: Athlete[] = [
  {
    id: '1',
    name: 'Babar Azam',
    sport: 'Cricket',
    country: 'Pakistan',
    birthYear: 1994,
    achievements: 'Youngest Test captain, ODI runs leader',
  },
  {
    id: '2',
    name: 'Virat Kohli',
    sport: 'Cricket',
    country: 'India',
    birthYear: 1988,
    achievements: 'Most international runs, ODI centuries leader',
  },
  {
    id: '3',
    name: 'Hasan Ali',
    sport: 'Cricket',
    country: 'Pakistan',
    birthYear: 1995,
    achievements: 'Leading fast bowler, T20 World Cup winner',
  },
  {
    id: '4',
    name: 'Rohit Sharma',
    sport: 'Cricket',
    country: 'India',
    birthYear: 1987,
    achievements: '3x World Cup winner, Most T20 centuries',
  },
];

async function fetchTodayEvents(sport: string, date: string): Promise<SportEvent[]> {
  try {
    const res = await fetch(
      `${BASE}/eventsday.php?d=${date}&s=${encodeURIComponent(sport)}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

async function fetchNationalTeam(
  country: string,
  sport: string
): Promise<NationalTeam | null> {
  try {
    const res = await fetch(
      `${BASE}/searchteams.php?t=${encodeURIComponent(country)}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const teams: NationalTeam[] = data.teams ?? [];
    const match = teams.find(
      t =>
        t.strCountry?.toLowerCase() === country.toLowerCase() &&
        t.strTeam.toLowerCase().includes(country.toLowerCase())
    );
    return match ?? teams[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchTeamPlayers(teamId: string): Promise<TeamPlayer[]> {
  try {
    const res = await fetch(
      `${BASE}/lookup_all_players.php?id=${teamId}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.player ?? [];
  } catch {
    return [];
  }
}

async function fetchUpcomingEvents(teamId: string): Promise<SportEvent[]> {
  try {
    const res = await fetch(
      `${BASE}/eventsnext.php?id=${teamId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

export async function fetchNextMatches(teamId: string, limit = 5): Promise<SportEvent[]> {
  const events = await fetchUpcomingEvents(teamId);
  return events.slice(0, limit);
}

export async function fetchRecentResults(teamId: string, limit = 5): Promise<SportEvent[]> {
  try {
    const res = await fetch(
      `${BASE}/eventslast.php?id=${teamId}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getStandings(leagueId: string): Promise<StandingsTeam[]> {
  return MOCK_STANDINGS[leagueId] ?? [];
}

export async function getTopScorers(leagueId: string): Promise<TopScorer[]> {
  return MOCK_TOP_SCORERS[leagueId] ?? [];
}

export async function getStadiums(countryCode: string): Promise<Stadium[]> {
  return MOCK_STADIUMS[countryCode.toLowerCase()] ?? [];
}

export async function getOlympicHistory(countryCode: string): Promise<OlympicMedals[]> {
  return MOCK_OLYMPICS[countryCode.toUpperCase()] ?? [];
}

export function getRotatingAthletes(month: number): Athlete[] {
  const startIdx = (month % 12) * 4;
  const result = [];
  for (let i = 0; i < 4; i++) {
    result.push(MOCK_ATHLETES[(startIdx + i) % MOCK_ATHLETES.length]);
  }
  return result;
}

export async function fetchSportsNews(
  country: string,
  query?: string
): Promise<SportsNews[]> {
  try {
    const searchQuery = query ? `${country} ${query}` : `${country} sports`;
    const gnewsKey = process.env.GNEWS_API_KEY || 'demo';
    const res = await fetch(
      `${GNEWS_BASE}?q=${encodeURIComponent(searchQuery)}&lang=en&max=5&apikey=${gnewsKey}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles ?? []).map((a: any) => ({
      title: a.title,
      description: a.description,
      image: a.image,
      url: a.url,
      source: a.source.name,
      publishedAt: a.publishedAt,
    }));
  } catch {
    return [];
  }
}

