'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { City } from '@/types/city';

interface Team {
  idTeam: string;
  strTeam: string;
  strSport: string;
  strStadium: string;
  strBadge?: string;
}

interface Match {
  idEvent: string;
  strEvent: string;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intAwayScore?: string;
}

async function fetchTeams(
  cityName: string
): Promise<Team[] | null> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/2/searchteams.php?t=${encodeURIComponent(cityName)}`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.teams) return null;

    return data.teams.slice(0, 6).map((t: any) => ({
      idTeam: t.idTeam,
      strTeam: t.strTeam,
      strSport: t.strSport,
      strStadium: t.strStadium,
      strBadge: t.strBadge,
    }));
  } catch {
    return null;
  }
}

async function fetchNextMatch(
  teamId: string
): Promise<Match | null> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/2/eventsnext.php?id=${teamId}`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.events || data.events.length === 0) return null;

    const e = data.events[0];
    return {
      idEvent: e.idEvent,
      strEvent: e.strEvent,
      strLeague: e.strLeague,
      dateEvent: e.dateEvent,
      strTime: e.strTime,
      strHomeTeam: e.strHomeTeam,
      strAwayTeam: e.strAwayTeam,
    };
  } catch {
    return null;
  }
}

async function fetchRecentResults(
  teamId: string
): Promise<Match[] | null> {
  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/2/eventslast.php?id=${teamId}`
    );

    if (!response.ok) return null;
    const data = await response.json();

    if (!data.results) return null;

    return data.results.slice(0, 5).map((r: any) => ({
      idEvent: r.idEvent,
      strEvent: r.strEvent,
      strLeague: r.strLeague,
      dateEvent: r.dateEvent,
      strHomeTeam: r.strHomeTeam,
      strAwayTeam: r.strAwayTeam,
      intHomeScore: r.intHomeScore,
      intAwayScore: r.intAwayScore,
    }));
  } catch {
    return null;
  }
}

const DEFAULT_SPORTS: Record<string, Array<{ name: string; sport: string; stadium: string }>> = {
  lahore: [
    { name: 'Lahore Qalandars', sport: 'Cricket', stadium: 'Gaddafi Stadium' },
    { name: 'WAPDA FC', sport: 'Football', stadium: 'Lahore City Stadium' },
  ],
  karachi: [
    { name: 'Karachi Kings', sport: 'Cricket', stadium: 'National Stadium' },
    { name: 'Karachi United', sport: 'Football', stadium: 'KMC Stadium' },
  ],
  islamabad: [
    { name: 'Islamabad United', sport: 'Cricket', stadium: 'Rawalpindi Cricket Stadium' },
  ],
};

function SportEmoji(sport: string): string {
  const lower = sport.toLowerCase();
  if (lower.includes('cricket')) return '🏏';
  if (lower.includes('football') || lower.includes('soccer')) return '⚽';
  if (lower.includes('basketball')) return '🏀';
  if (lower.includes('hockey')) return '🏒';
  if (lower.includes('tennis')) return '🎾';
  if (lower.includes('rugby')) return '🏉';
  if (lower.includes('golf')) return '⛳';
  return '🏅';
}

function TeamCard({
  team,
  nextMatch,
  recentResults,
  index,
}: {
  team: Team;
  nextMatch?: Match | null;
  recentResults?: Match[] | null;
  index: number;
}) {
  return (
    <motion.div
      className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
          {SportEmoji(team.strSport)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg">{team.strTeam}</h3>
          <p className="text-sm text-gray-500">{team.strSport}</p>
          {team.strStadium && (
            <p className="text-xs text-blue-600 mt-1">${team.strStadium}</p>
          )}
        </div>
        {team.strBadge && (
          <img
            src={team.strBadge}
            alt={team.strTeam}
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {nextMatch && (
        <div className="bg-emerald-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-emerald-600 uppercase font-semibold mb-1">
            Next Match
          </p>
          <p className="text-sm font-medium text-gray-900">
            {nextMatch.strHomeTeam} vs {nextMatch.strAwayTeam}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {nextMatch.dateEvent} {nextMatch.strTime?.slice(0, 5) || ''}
          </p>
          <p className="text-xs text-gray-500">{nextMatch.strLeague}</p>
        </div>
      )}

      {recentResults && recentResults.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase font-semibold mb-2">
            Recent Results
          </p>
          <div className="space-y-2">
            {recentResults.slice(0, 3).map((match) => (
              <div
                key={match.idEvent}
                className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1.5"
              >
                <span className="text-gray-600 truncate flex-1">
                  {match.strHomeTeam} {match.intHomeScore || '-'} -{' '}
                  {match.intAwayScore || '-'} {match.strAwayTeam}
                </span>
                <span className="text-gray-400 ml-2">{match.dateEvent}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function SportsSection({ city }: { city: City }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [nextMatches, setNextMatches] = useState<Record<string, Match>>({});
  const [recentResults, setRecentResults] = useState<Record<string, Match[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const fromAPI = await fetchTeams(city.name);

      if (fromAPI && fromAPI.length > 0) {
        setTeams(fromAPI);

        const matches: Record<string, Match> = {};
        const results: Record<string, Match[]> = {};

        for (const team of fromAPI) {
          const next = await fetchNextMatch(team.idTeam);
          if (next) matches[team.idTeam] = next;

          const recent = await fetchRecentResults(team.idTeam);
          if (recent) results[team.idTeam] = recent;
        }

        setNextMatches(matches);
        setRecentResults(results);
      } else {
        const defaults =
          DEFAULT_SPORTS[city.city_slug] ||
          DEFAULT_SPORTS[city.name.toLowerCase()] ||
          [{ name: 'Local Sports Team', sport: 'Various', stadium: city.name }];
        setTeams(
          defaults.map((d, idx) => ({
            idTeam: `default-${idx}`,
            strTeam: d.name,
            strSport: d.sport,
            strStadium: d.stadium,
          }))
        );
      }

      setLoading(false);
    }

    load();
  }, [city]);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 mb-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-2xl">🏅</span>
        Sports & Teams
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-4xl mb-3">🏅</p>
          <p>No sports teams found for this city</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, idx) => (
            <TeamCard
              key={team.idTeam}
              team={team}
              nextMatch={nextMatches[team.idTeam]}
              recentResults={recentResults[team.idTeam]}
              index={idx}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
