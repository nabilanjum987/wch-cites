'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateNextMatchParagraph, generateNextMatchAfter,
  generateRecentParagraph, generateRecentAfter,
  generateUpcomingMatchesParagraph, generateUpcomingMatchesAfter,
  generateLiveScoresParagraph, generateLiveScoresAfter,
  generateStandingsParagraph, generateStandingsAfter,
  generateStadiumsParagraph, generateStadiumsAfter,
  generateOlympicsParagraph, generateOlympicsAfter,
  generateAthletesParagraph, generateAthletesAfter,
  generateNewsParagraph, generateNewsAfter,
  generateShopParagraph, generateShopAfter,
} from '../../../../../lib/paragraphs/sports';

// === TYPES ===
interface City {
  name: string;
  city_slug: string;
  country: string;
  country_code: string;
  country_slug: string;
  province: string;
  province_slug: string;
  lat: number;
  lng: number;
  population: number;
  timezone: string;
  major_religion: string;
  religion_percent: number;
  primary_color: string;
  secondary_color: string;
  famous_for: string;
  famous_products: string;
  emergency_police: string;
  emergency_ambulance: string;
  emergency_fire: string;
  region: string;
  is_active: boolean;
}

interface SportPriority {
  id: string;
  label: string;
  emoji: string;
  tsdbName: string;
}

interface DomesticLeague {
  id: string;
  name: string;
  country: string;
  emoji: string;
}

interface SportEvent {
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

interface NationalTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strDescriptionEN: string;
  intFormedYear: string;
  strStadium: string;
  strCountry: string;
}

interface TeamPlayer {
  idPlayer: string;
  strPlayer: string;
  strPosition: string;
  strNationality: string;
  strThumb: string;
  strDescriptionEN: string;
}

interface StandingsTeam {
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

interface TopScorer {
  name: string;
  team: string;
  goals: number;
}

interface Stadium {
  id: string;
  name: string;
  capacity: number;
  city: string;
  country: string;
  team: string;
}

interface OlympicMedals {
  year: number;
  city: string;
  gold: number;
  silver: number;
  bronze: number;
  rank: number;
}

interface Athlete {
  id: string;
  name: string;
  sport: string;
  country: string;
  birthYear: number;
  achievements: string;
}

interface SportsNews {
  title: string;
  description: string;
  image: string;
  url: string;
  source: string;
  publishedAt: string;
}

// === API LOGIC ===
const BASE = 'https://www.thesportsdb.com/api/v1/json/2';

const COUNTRY_SPORT_PRIORITY: Record<string, SportPriority[]> = {
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
  DEFAULT: [
    { id: 'football', label: 'Football', emoji: '⚽', tsdbName: 'Soccer' },
    { id: 'basketball', label: 'Basketball', emoji: '🏀', tsdbName: 'Basketball' },
    { id: 'cricket', label: 'Cricket', emoji: '🏏', tsdbName: 'Cricket' },
    { id: 'tennis', label: 'Tennis', emoji: '🎾', tsdbName: 'Tennis' },
    { id: 'athletics', label: 'Athletics', emoji: '🏃', tsdbName: 'Athletics' },
  ],
};

const COUNTRY_DOMESTIC_LEAGUES: Record<string, DomesticLeague> = {
  PK: { id: 'psl', name: 'Pakistan Super League (PSL)', country: 'Pakistan', emoji: '🏏' },
  IN: { id: 'ipl', name: 'Indian Premier League (IPL)', country: 'India', emoji: '🏏' },
  GB: { id: 'epl', name: 'Premier League', country: 'England', emoji: '⚽' },
  US: { id: 'nfl', name: 'National Football League (NFL)', country: 'USA', emoji: '🏈' },
  DE: { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', emoji: '⚽' },
  FR: { id: 'ligue1', name: 'Ligue 1', country: 'France', emoji: '⚽' },
};

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
    { name: 'Royal Challengers', played: 10, wins: 5, draws: 0, losses: 5, goalsFor: 77, goalsAgainst: 80, goalDiff: -3, points: 10 },
    { name: 'Chennai Super Kings', played: 10, wins: 4, draws: 0, losses: 6, goalsFor: 72, goalsAgainst: 85, goalDiff: -13, points: 8 },
  ],
};

const MOCK_SCORERS: Record<string, TopScorer[]> = {
  psl: [
    { name: 'Babar Azam', team: 'Peshawar Zalmi', goals: 485 },
    { name: 'Muhammad Hafeez', team: 'Islamabad United', goals: 430 },
    { name: 'Iftikhar Ahmed', team: 'Karachi Kings', goals: 320 },
    { name: 'Shoaib Malik', team: 'Multan Sultans', goals: 315 },
    { name: 'Fakhar Zaman', team: 'Lahore Qalandars', goals: 310 },
  ],
  ipl: [
    { name: 'Virat Kohli', team: 'Royal Challengers', goals: 7000 },
    { name: 'Rohit Sharma', team: 'Mumbai Indians', goals: 6500 },
    { name: 'Suresh Raina', team: 'Chennai Super Kings', goals: 5600 },
    { name: 'MS Dhoni', team: 'Chennai Super Kings', goals: 5400 },
    { name: 'KL Rahul', team: 'Delhi Capitals', goals: 5200 },
  ],
};

const MOCK_STADIUMS: Record<string, Stadium[]> = {
  PK: [
    { id: 'gaddafi', name: 'Gaddafi Stadium', capacity: 27800, city: 'Lahore', country: 'Pakistan', team: 'Lahore Qalandars' },
    { id: 'national', name: 'National Stadium', capacity: 34228, city: 'Karachi', country: 'Pakistan', team: 'Karachi Kings' },
    { id: 'multan', name: 'Multan Cricket Stadium', capacity: 33800, city: 'Multan', country: 'Pakistan', team: 'Multan Sultans' },
  ],
  IN: [
    { id: 'eden', name: 'Eden Gardens', capacity: 66349, city: 'Kolkata', country: 'India', team: 'Kolkata Knight Riders' },
    { id: 'wankhede', name: 'Wankhede Stadium', capacity: 33108, city: 'Mumbai', country: 'India', team: 'Mumbai Indians' },
    { id: 'arun', name: 'Arun Jaitley Stadium', capacity: 41820, city: 'Delhi', country: 'India', team: 'Delhi Capitals' },
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
  { id: 'babar-azam', name: 'Babar Azam', sport: 'Cricket', country: 'Pakistan', birthYear: 1994, achievements: 'Youngest Test captain, ODI runs leader' },
  { id: 'virat-kohli', name: 'Virat Kohli', sport: 'Cricket', country: 'India', birthYear: 1988, achievements: 'Most international runs, ODI centuries leader' },
  { id: 'hasan-ali', name: 'Hasan Ali', sport: 'Cricket', country: 'Pakistan', birthYear: 1995, achievements: 'Leading fast bowler, T20 World Cup winner' },
  { id: 'rohit-sharma', name: 'Rohit Sharma', sport: 'Cricket', country: 'India', birthYear: 1987, achievements: '3x World Cup winner, Most T20 centuries' },
];

function getSportsByCountry(code: string): SportPriority[] {
  return COUNTRY_SPORT_PRIORITY[code.toUpperCase()] ?? COUNTRY_SPORT_PRIORITY.DEFAULT;
}

function getDomesticLeague(code: string): DomesticLeague | null {
  return COUNTRY_DOMESTIC_LEAGUES[code.toUpperCase()] ?? null;
}

async function getCityData(country: string, province: string, city: string): Promise<City | null> {
  return {
    name: city.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    city_slug: city,
    country: country.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    country_code: country.toUpperCase().slice(0, 2),
    country_slug: country,
    province: province.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    province_slug: province,
    lat: 0,
    lng: 0,
    population: 0,
    timezone: 'UTC',
    major_religion: 'Unknown',
    religion_percent: 0,
    primary_color: codeToColor(country.toUpperCase().slice(0, 2)),
    secondary_color: '#FFFFFF',
    famous_for: '',
    famous_products: '',
    emergency_police: '911',
    emergency_ambulance: '911',
    emergency_fire: '911',
    region: 'Unknown',
    is_active: true,
  };
}

function codeToColor(code: string): string {
  const colors: Record<string, string> = {
    PK: '#01411C', IN: '#FF9933', GB: '#012169', US: '#B22234',
    DE: '#000000', FR: '#002395', AU: '#00008B', JP: '#BC002D',
  };
  return colors[code] ?? '#1a1a2e';
}

async function fetchTodayEvents(sport: string, date: string): Promise<SportEvent[]> {
  try {
    const res = await fetch(`${BASE}/eventsday.php?d=${date}&s=${encodeURIComponent(sport)}`, { next: { revalidate: 900 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch { return []; }
}

async function fetchNationalTeam(country: string): Promise<NationalTeam | null> {
  try {
    const res = await fetch(`${BASE}/searchteams.php?t=${encodeURIComponent(country)}`, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const data = await res.json();
    const teams: NationalTeam[] = data.teams ?? [];
    return teams.find(t => t.strCountry?.toLowerCase() === country.toLowerCase()) ?? teams[0] ?? null;
  } catch { return null; }
}

async function fetchTeamPlayers(teamId: string): Promise<TeamPlayer[]> {
  try {
    const res = await fetch(`${BASE}/lookup_all_players.php?id=${teamId}`, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.player ?? [];
  } catch { return []; }
}

async function fetchNextMatches(teamId: string, limit = 5): Promise<SportEvent[]> {
  try {
    const res = await fetch(`${BASE}/eventsnext.php?id=${teamId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.events ?? []).slice(0, limit);
  } catch { return []; }
}

async function fetchRecentResults(teamId: string, limit = 5): Promise<SportEvent[]> {
  try {
    const res = await fetch(`${BASE}/eventslast.php?id=${teamId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results ?? []).slice(0, limit);
  } catch { return []; }
}

function getStandings(leagueId: string): StandingsTeam[] {
  return MOCK_STANDINGS[leagueId] ?? [];
}

function getTopScorers(leagueId: string): TopScorer[] {
  return MOCK_SCORERS[leagueId] ?? [];
}

function getStadiums(code: string): Stadium[] {
  return MOCK_STADIUMS[code.toUpperCase()] ?? [];
}

function getOlympicHistory(code: string): OlympicMedals[] {
  return MOCK_OLYMPICS[code.toUpperCase()] ?? [];
}

function getRotatingAthletes(month: number): Athlete[] {
  const startIdx = (month % 12) * 4;
  return Array.from({ length: 4 }, (_, i) => MOCK_ATHLETES[(startIdx + i) % MOCK_ATHLETES.length]);
}

async function fetchSportsNews(): Promise<SportsNews[]> {
  return [];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-transparent/8 rounded-lg ${className ?? ''}`} />;
}

function LiveBadge({ status }: { status: string }) {
  const isLive = status?.toLowerCase().includes('live') ||
    status?.toLowerCase().includes('in progress') ||
    status?.toLowerCase() === '1h' ||
    status?.toLowerCase() === '2h';

  if (!isLive) return null;

  return (
    <span className="inline-flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      <span className="w-1.5 h-1.5 bg-transparent rounded-full animate-pulse" />
      LIVE
    </span>
  );
}

function ScoreCard({ event }: { event: SportEvent }) {
  const isLive = event.strStatus?.toLowerCase().includes('live') ||
    event.strStatus?.toLowerCase().includes('in progress') ||
    event.strStatus?.toLowerCase() === '1h' ||
    event.strStatus?.toLowerCase() === '2h';

  const hasScore = event.intHomeScore !== null && event.intAwayScore !== null;

  return (
    <motion.div variants={fadeUp} className={`bg-transparent rounded-2xl  border ${isLive ? 'border-red-500/30' : 'border-white/8'} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium truncate max-w-[60%]">{event.strLeague}</span>
        <LiveBadge status={event.strStatus} />
        {!isLive && <span className="text-xs text-gray-400">{event.strStatus}</span>}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <p className="font-semibold text-white text-sm leading-tight">{event.strHomeTeam}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasScore ? (
            <div className="flex items-center gap-1">
              <span className={`text-2xl font-bold ${isLive ? 'text-red-400' : 'text-white'}`}>{event.intHomeScore}</span>
              <span className="text-gray-400 font-medium">—</span>
              <span className={`text-2xl font-bold ${isLive ? 'text-red-400' : 'text-white'}`}>{event.intAwayScore}</span>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-400">{event.strTime ?? 'TBD'}</span>
          )}
        </div>
        <div className="flex-1 text-center">
          <p className="font-semibold text-white text-sm leading-tight">{event.strAwayTeam}</p>
        </div>
      </div>
      {event.strVenue && <p className="text-center text-xs text-gray-400 mt-2 truncate">📍 {event.strVenue}</p>}
    </motion.div>
  );
}

function NextMatchCard({ event }: { event: SportEvent }) {
  const today = new Date().toDateString();
  const matchDate = event.dateEvent ? new Date(event.dateEvent).toDateString() : '';
  const isTonight = today === matchDate;

  return (
    <motion.div
      variants={fadeUp}
      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white "
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Next Match</h3>
        {isTonight && (
          <span className="bg-amber-500/100/100 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            TONIGHT
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-bold text-lg">{event.strHomeTeam}</p>
        </div>
        <div className="text-center px-4">
          <p className="text-2xl font-bold text-amber-400">VS</p>
          <p className="text-xs text-gray-400 mt-1">{event.strTime ?? 'TBD'}</p>
        </div>
        <div className="flex-1 text-center">
          <p className="font-bold text-lg">{event.strAwayTeam}</p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className="text-sm text-gray-300">{event.strLeague}</p>
        {event.strVenue && <p className="text-xs text-gray-400 mt-1">📍 {event.strVenue}</p>}
        {event.dateEvent && <p className="text-xs text-gray-400">{formatDate(event.dateEvent)}</p>}
      </div>
    </motion.div>
  );
}

function WBadge({ score, opScore }: { score: string; opScore: string }) {
  const won = parseInt(score) > parseInt(opScore);
  const lost = parseInt(score) < parseInt(opScore);

  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded ${won ? 'bg-green-500/100/15 text-green-400' : lost ? 'bg-red-500/100/15 text-red-400' : 'bg-transparent/5 text-gray-300'}`}>
      {won ? 'W' : lost ? 'L' : 'D'}
    </span>
  );
}

function RecentResultCard({ event, teamName }: { event: SportEvent; teamName: string }) {
  const isHome = event.strHomeTeam.toLowerCase().includes(teamName.toLowerCase());
  const teamScore = isHome ? event.intHomeScore : event.intAwayScore;
  const oppScore = isHome ? event.intAwayScore : event.intHomeScore;
  const opponent = isHome ? event.strAwayTeam : event.strHomeTeam;

  return (
    <motion.div variants={fadeUp} className="bg-transparent rounded-xl border border-white/8 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WBadge score={teamScore || '0'} opScore={oppScore || '0'} />
        <span className="text-sm text-gray-300">{opponent}</span>
      </div>
      <div className="text-right">
        <span className="font-bold text-white">{teamScore} - {oppScore}</span>
        <p className="text-xs text-gray-400">{event.dateEvent ? formatDate(event.dateEvent) : ''}</p>
      </div>
    </motion.div>
  );
}

function SportSelectorBar({ sports, active, onSelect }: { sports: SportPriority[]; active: string; onSelect: (id: string) => void }) {
  return (
    <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

      {/* Dark aurora orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-8"
          style={{ backgroundColor: "#0C7A3D" }} />
        <div className="absolute bottom-40 left-1/4 w-72 h-72 rounded-full filter blur-3xl opacity-6"
          style={{ backgroundColor: "#0C7A3D" }} />
      </div>
      {sports.map((s, i) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
            active === s.id ? 'bg-black/50 text-white  scale-105' : 'bg-transparent text-gray-400 border border-white/10 hover:border-gray-400'
          }`}
        >
          <span>{s.emoji}</span>
          <span>{s.label}</span>
          {i === 0 && <span className={`text-xs ${active === s.id ? 'text-gray-300' : 'text-gray-400'}`}>✓</span>}
        </button>
      ))}
    </div>
  );
}

function StandingsTable({ teams }: { teams: StandingsTeam[] }) {
  return (
    <motion.div variants={fadeUp} className="bg-transparent rounded-2xl border border-white/8 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-transparent/4">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-400">#</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-400">Team</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">P</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">W</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">D</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">L</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">GD</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-400">Pts</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((t, i) => (
              <tr key={t.name} className={i < 4 ? 'bg-green-500/100/10/50' : ''}>
                <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                <td className="px-3 py-2 font-medium text-white">{t.name}</td>
                <td className="px-3 py-2 text-center text-gray-400">{t.played}</td>
                <td className="px-3 py-2 text-center text-gray-400">{t.wins}</td>
                <td className="px-3 py-2 text-center text-gray-400">{t.draws}</td>
                <td className="px-3 py-2 text-center text-gray-400">{t.losses}</td>
                <td className="px-3 py-2 text-center text-gray-400">{t.goalDiff > 0 ? '+' : ''}{t.goalDiff}</td>
                <td className="px-3 py-2 text-center font-bold text-white">{t.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function TopScorersCard({ scorers }: { scorers: TopScorer[] }) {
  return (
    <motion.div variants={fadeUp} className="bg-transparent rounded-2xl border border-white/8 p-4">
      <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-3">Top Run Scorers</h4>
      <div className="space-y-2">
        {scorers.slice(0, 5).map((s, i) => (
          <div key={s.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-500/100/15 text-amber-400' : 'bg-transparent/5 text-gray-500'}`}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{s.name}</p>
                <p className="text-xs text-gray-400">{s.team}</p>
              </div>
            </div>
            <span className="font-bold text-white">{s.goals.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function StadiumCard({ stadium }: { stadium: Stadium }) {
  const [weather, setWeather] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`https://wttr.in/${encodeURIComponent(stadium.city)}?format=%t&format=%C`);
        if (res.ok) {
          const text = await res.text();
          setWeather(text.trim());
        }
      } catch {
        setWeather('N/A');
      }
    }
    fetchWeather();
  }, [stadium.city]);

  return (
    <motion.div variants={fadeUp} className="bg-transparent rounded-2xl border border-white/8 p-4">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-bold text-white">{stadium.name}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{stadium.city}, {stadium.country}</p>
        </div>
        <span className="text-2xl">🏟️</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Capacity</p>
          <p className="font-semibold text-white">{stadium.capacity.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Home Team</p>
          <p className="font-semibold text-white truncate">{stadium.team}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-white/8">
        <p className="text-xs text-gray-400">Current Weather</p>
        <p className="text-sm font-medium text-white">{weather ?? 'Loading...'}</p>
      </div>
    </motion.div>
  );
}

function OlympicsCard({ medals }: { medals: OlympicMedals[] }) {
  const totalGold = medals.reduce((sum, m) => sum + m.gold, 0);
  const totalSilver = medals.reduce((sum, m) => sum + m.silver, 0);
  const totalBronze = medals.reduce((sum, m) => sum + m.bronze, 0);
  const total = totalGold + totalSilver + totalBronze;

  return (
    <motion.div variants={fadeUp} className="bg-transparent rounded-2xl border border-white/8 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Olympics History</h3>
        <span className="text-2xl">🏅</span>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-amber-500/100/10">
          <p className="text-2xl font-bold text-amber-400">{totalGold}</p>
          <p className="text-xs text-amber-400">Gold</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-transparent/5">
          <p className="text-2xl font-bold text-gray-400">{totalSilver}</p>
          <p className="text-xs text-gray-400">Silver</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-orange-500/100/10">
          <p className="text-2xl font-bold text-orange-400">{totalBronze}</p>
          <p className="text-xs text-orange-300">Bronze</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-transparent/4">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-300 mb-2">Recent Olympics</h4>
      <div className="space-y-2">
        {medals.map(m => (
          <div key={`${m.year}-${m.city}`} className="flex items-center justify-between py-2 px-3 bg-transparent/4 rounded-lg">
            <div>
              <p className="font-medium text-white">{m.year} {m.city}</p>
              <p className="text-xs text-gray-400">Rank: #{m.rank}</p>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="text-amber-400">{m.gold}🥇</span>
              <span className="text-gray-500">{m.silver}🥈</span>
              <span className="text-orange-400">{m.bronze}🥉</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function AthleteCard({ athlete }: { athlete: Athlete }) {
  return (
    <motion.a
      variants={fadeUp}
      href={`/personalities/${athlete.id}`}
      className="block bg-transparent rounded-2xl border border-white/8 overflow-hidden hover: transition-shadow"
    >
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        {athlete.id ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-lg font-bold">{athlete.name.charAt(0)}</span>
          </div>
        ) : (
          <span className="text-6xl">👤</span>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-white">{athlete.name}</h4>
        <p className="text-sm text-gray-500">{athlete.sport} · {athlete.country}</p>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{athlete.achievements}</p>
      </div>
    </motion.a>
  );
}

function NewsCard({ article }: { article: SportsNews }) {
  return (
    <motion.a
      variants={fadeUp}
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-transparent rounded-2xl border border-white/8 overflow-hidden hover: transition-shadow"
    >
      {article.image && (
        <div className="aspect-video bg-transparent/5">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{article.source}</p>
        <h4 className="font-semibold text-white line-clamp-2">{article.title}</h4>
        {article.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.description}</p>}
      </div>
    </motion.a>
  );
}

function AffiliateSection() {
  const affiliates = [
    {
      title: 'Buy Cricket Gear',
      subtitle: 'Flat 8% off on Amazon',
      icon: '🏏',
      url: `https://www.amazon.com/s?k=cricket+gear&tag=worldcityhub-20`,
      bg: 'from-amber-50 to-orange-50',
    },
    {
      title: 'Watch Live Cricket',
      subtitle: 'Stream matches online',
      icon: '📺',
      url: '#',
      bg: 'from-blue-50 to-indigo-50',
    },
    {
      title: 'Fantasy Cricket',
      subtitle: 'Play & win on Dream11',
      icon: '🏆',
      url: '#',
      bg: 'from-purple-50 to-pink-50',
    },
    {
      title: 'Match Tickets',
      subtitle: 'Book on Ticketmaster',
      icon: '🎫',
      url: 'https://www.ticketmaster.com/sports',
      bg: 'from-green-50 to-emerald-50',
    },
    {
      title: 'Buy Jerseys',
      subtitle: 'Official team gear',
      icon: '👕',
      url: 'https://www.amazon.com/s?k=cricket+pakistan+jersey&tag=worldcityhub-20',
      bg: 'from-red-50 to-rose-50',
    },
    {
      title: 'Stream Sports',
      subtitle: 'ESPN+ & live coverage',
      icon: '📡',
      url: 'https://plus.espn.com/',
      bg: 'from-sky-50 to-cyan-50',
    },
  ];

  return (
    <motion.section variants={fadeUp}>
      <h2 className="text-lg font-bold text-white mb-4">Shop & Watch</h2>
      <div className="grid grid-cols-2 gap-3">
        {affiliates.map(a => (
          <a
            key={a.title}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`block bg-gradient-to-br ${a.bg} rounded-2xl p-4 hover: transition-shadow`}
          >
            <span className="text-3xl">{a.icon}</span>
            <h4 className="font-bold text-white mt-2">{a.title}</h4>
            <p className="text-xs text-gray-400">{a.subtitle}</p>
            <span className="inline-flex items-center gap-1 text-xs text-blue-400 font-medium mt-2">
              Shop Now <span>→</span>
            </span>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function SportsPage() {
  const params = useParams<{ country: string; province: string; city: string }>();

  const [city, setCity] = useState<City | null>(null);
  const [sports, setSports] = useState<SportPriority[]>([]);
  const [domesticLeague, setDomesticLeague] = useState<DomesticLeague | null>(null);
  const [activeSport, setActiveSport] = useState<string>('');
  const [events, setEvents] = useState<SportEvent[]>([]);
  const [nationalTeam, setNationalTeam] = useState<NationalTeam | null>(null);
  const [nextMatches, setNextMatches] = useState<SportEvent[]>([]);
  const [recentResults, setRecentResults] = useState<SportEvent[]>([]);
  const [standings, setStandings] = useState<StandingsTeam[]>([]);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [olympics, setOlympics] = useState<OlympicMedals[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [news, setNews] = useState<SportsNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitial() {
      const data = await getCityData(params.country, params.province, params.city);
      setCity(data);
      if (data) {
        const list = getSportsByCountry(data.country_code);
        setSports(list);
        setActiveSport(list[0]?.id ?? '');
        setDomesticLeague(getDomesticLeague(data.country_code));

        const std = getStadiums(data.country_code);
        setStadiums(std);

        const olympic = getOlympicHistory(data.country_code);
        setOlympics(olympic);

        const month = new Date().getMonth();
        const athleteList = getRotatingAthletes(month);
        setAthletes(athleteList);

        const newsData = await fetchSportsNews();
        setNews(newsData);
      }
      setLoading(false);
    }
    loadInitial();
  }, [params]);

  const loadSportData = useCallback(async (sportId: string) => {
    if (!sports.length || !city) return;
    const sport = sports.find(s => s.id === sportId);
    if (!sport) return;

    const today = new Date().toISOString().split('T')[0];
    const [eventsData, team] = await Promise.all([
      fetchTodayEvents(sport.tsdbName, today),
      fetchNationalTeam(sport.tsdbName),
    ]);
    setEvents(eventsData);
    setNationalTeam(team);

    if (team) {
      const [pl, next, recent] = await Promise.all([
        fetchTeamPlayers(team.idTeam),
        fetchNextMatches(team.idTeam, 5),
        fetchRecentResults(team.idTeam, 5),
      ]);
      setNextMatches(next);
      setRecentResults(recent);
    }

    if (domesticLeague) {
      const [table, scorers] = await Promise.all([
        getStandings(domesticLeague.id),
        getTopScorers(domesticLeague.id),
      ]);
      setStandings(table);
      setTopScorers(scorers);
    }
  }, [sports, city, domesticLeague]);

  useEffect(() => {
    if (activeSport) loadSportData(activeSport);
  }, [activeSport, loadSportData]);

  if (loading) {
    return (
      <div style={{ backgroundColor: "#0a0f1e", minHeight: "100vh", position: "relative" }} className="min-h-screen bg-transparent/4">
        <div className="h-40 animate-pulse bg-gray-300" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      </div>
    );
  }

  const activeSportLabel = sports.find(s => s.id === activeSport)?.label ?? '';
  const headerColor = city?.primary_color ?? '#1a1a2e';
  const nextMatch = nextMatches[0];

  return (
    <div className="min-h-screen bg-transparent/4">
      <header className="relative overflow-hidden" style={{ backgroundColor: headerColor }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm mb-4 flex items-center gap-1.5 flex-wrap">
            {[
              { label: 'Home', href: '/' },
              { label: city?.country ?? params.country, href: `/${params.country}` },
              { label: city?.province ?? params.province, href: `/${params.country}/${params.province}` },
              { label: city?.name ?? params.city, href: `/${params.country}/${params.province}/${params.city}` },
              { label: 'Sports', href: null },
            ].map((c, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                {c.href ? <a href={c.href} className="text-white/70 hover:text-white transition-colors">{c.label}</a> : <span className="text-white font-medium">{c.label}</span>}
                {i < arr.length - 1 && <span className="text-white/40">›</span>}
              </span>
            ))}
          </nav>
          <h1 className="text-3xl font-bold text-white">{city?.name ?? ''} Sports</h1>
          <p className="text-white/70 mt-1 text-sm">Live scores, standings, national team & more</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <motion.section initial="hidden" animate="visible" variants={fadeUp}>
          <SportSelectorBar sports={sports} active={activeSport} onSelect={s => { setActiveSport(s); setEvents([]); setNationalTeam(null); setNextMatches([]); setRecentResults([]); }} />
        </motion.section>

        {nextMatch && (
          <>
            <p className="text-gray-300 leading-relaxed text-sm">
              {generateNextMatchParagraph(city?.country ?? '', activeSportLabel)}
            </p>
            <NextMatchCard event={nextMatch} />
            <p className="text-gray-400 leading-relaxed text-sm">
              {generateNextMatchAfter(city?.country ?? '', activeSportLabel)}
            </p>
          </>
        )}

        {recentResults.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-lg font-bold text-white mb-4">Recent Results</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateRecentParagraph(city?.country ?? '', activeSportLabel)}
            </p>
            <div className="space-y-2">{recentResults.map(e => <RecentResultCard key={e.idEvent} event={e} teamName={nationalTeam?.strTeam ?? ''} />)}</div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateRecentAfter(city?.country ?? '', activeSportLabel)}
            </p>
          </motion.section>
        )}

        {nextMatches.length > 1 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-lg font-bold text-white mb-4">Upcoming Matches</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateUpcomingMatchesParagraph(city?.country ?? '', activeSportLabel)}
            </p>
            <div className="space-y-3">{nextMatches.slice(1).map(e => <ScoreCard key={e.idEvent} event={e} />)}</div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateUpcomingMatchesAfter(city?.country ?? '', activeSportLabel)}
            </p>
          </motion.section>
        )}

        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-white">Live Scores Today</h2>
            <span className="text-sm text-gray-500">— {activeSportLabel}</span>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            {generateLiveScoresParagraph(activeSportLabel, city?.name ?? '')}
          </p>
          <AnimatePresence mode="wait">
            {events.length > 0 ? (
              <motion.div key="events" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {events.map(e => <ScoreCard key={e.idEvent} event={e} />)}
              </motion.div>
            ) : (
              <div className="bg-transparent rounded-2xl border border-white/8 p-8 text-center">
                <p className="text-gray-500 text-sm">No {activeSportLabel} matches scheduled for today.</p>
              </div>
            )}
          </AnimatePresence>
          <p className="text-gray-400 leading-relaxed text-sm mt-4">
            {generateLiveScoresAfter(activeSportLabel, city?.name ?? '')}
          </p>
        </motion.section>

        {domesticLeague && standings.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-white">{domesticLeague.name}</h2>
              <span className="text-sm text-gray-500">Standings</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateStandingsParagraph(domesticLeague.name, city?.country ?? '')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <StandingsTable teams={standings} />
              {topScorers.length > 0 && <TopScorersCard scorers={topScorers} />}
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateStandingsAfter(domesticLeague.name, city?.country ?? '')}
            </p>
          </motion.section>
        )}

        {stadiums.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-lg font-bold text-white mb-4">Major Stadiums</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateStadiumsParagraph(city?.country ?? '')}
            </p>
            <div className="grid md:grid-cols-3 gap-4">{stadiums.map(s => <StadiumCard key={s.id} stadium={s} />)}</div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateStadiumsAfter(city?.country ?? '')}
            </p>
          </motion.section>
        )}

        {olympics.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateOlympicsParagraph(city?.country ?? '')}
            </p>
            <OlympicsCard medals={olympics} />
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateOlympicsAfter(city?.country ?? '')}
            </p>
          </motion.section>
        )}

        {athletes.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-lg font-bold text-white mb-4">Greatest Athletes</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateAthletesParagraph(city?.country ?? '')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{athletes.map(a => <AthleteCard key={a.id} athlete={a} />)}</div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateAthletesAfter(city?.country ?? '')}
            </p>
          </motion.section>
        )}

        {news.length > 0 && (
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-lg font-bold text-white mb-4">Sports News</h2>
            <p className="text-gray-300 leading-relaxed text-sm mb-4">
              {generateNewsParagraph(city?.country ?? '')}
            </p>
            <div className="grid md:grid-cols-2 gap-4">{news.slice(0, 5).map((n, i) => <NewsCard key={i} article={n} />)}</div>
            <p className="text-gray-400 leading-relaxed text-sm mt-4">
              {generateNewsAfter(city?.country ?? '')}
            </p>
          </motion.section>
        )}

        <motion.section variants={fadeUp}>
          <h2 className="text-lg font-bold text-white mb-4">🏆 Historic Achievements</h2>
          <div className="space-y-3">
            {(city?.country === 'Pakistan' || city?.country_slug === 'pakistan' ? [
              { year: '1992', title: 'Cricket World Cup Champions', detail: 'Pakistan beat England at MCG under Imran Khan\'s captaincy — only World Cup win.' },
              { year: '1994', title: 'Squash World Open — Jansher Khan', detail: '8-time World Open champion from Peshawar, widely considered the greatest squash player ever.' },
              { year: '2009', title: 'ICC World Twenty20 Champions', detail: 'Pakistan beat Sri Lanka in the T20 World Cup final at Lord\'s.' },
              { year: '2017', title: 'ICC Champions Trophy', detail: 'Pakistan defeated India by 180 runs in the final at The Oval, London.' },
            ] : [
              { year: '—', title: 'Major Championship', detail: 'Historic sporting achievement for this city and country.' },
              { year: '—', title: 'World Record', detail: 'Internationally recognised sporting milestone.' },
            ]).map((a) => (
              <div key={a.year + a.title} className="flex gap-4 items-start rounded-xl p-4 border border-white/8" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                <div className="text-2xl font-bold text-white/20 min-w-[3rem] text-center">{a.year}</div>
                <div>
                  <div className="text-white font-semibold text-sm">{a.title}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{a.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <p className="text-gray-300 leading-relaxed text-sm">
          {generateShopParagraph(city?.country ?? '', activeSportLabel)}
        </p>
        <AffiliateSection />
        <p className="text-gray-400 leading-relaxed text-sm">
          {generateShopAfter(city?.country ?? '', activeSportLabel)}
        </p>
      </main>
    </div>
  );
}
