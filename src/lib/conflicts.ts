// Conflicts overview data (Page 17 of the locked plan — the strictest
// editorial rules on the site).
//
// Sources are restricted to the locked whitelist: UN agencies (UNHCR
// data API, UN News), ICRC, and wire/international reporting from
// Reuters, AP, BBC and Al Jazeera. Headlines come through GNews and are
// FILTERED to that whitelist — anything else is dropped, never shown.
// No casualty figures from the parties themselves, no partisan sources,
// no editorialising: titles are reproduced from the wire source with
// attribution and a link. Peace Efforts is a compulsory section.

import { gnewsSearch, type NewsArticle } from '@/lib/apis/news';

const WHITELIST = [
  'reuters', 'associated press', 'ap news', 'bbc', 'al jazeera',
  'un news', 'unhcr', 'icrc', 'reliefweb',
];

export function sourceName(article: NewsArticle): string {
  const raw = article.source as unknown;
  if (typeof raw === 'string') return raw;
  return (raw as { name?: string } | null)?.name ?? '';
}

export function isWhitelisted(article: NewsArticle): boolean {
  const src = sourceName(article).toLowerCase();
  return WHITELIST.some((w) => src.includes(w));
}

export async function fetchWhitelistNews(query: string, max = 3): Promise<NewsArticle[]> {
  try {
    const results = await gnewsSearch(query, 'en', 10, 'all', '');
    const seen = new Set<string>();
    const out: NewsArticle[] = [];
    for (const a of results) {
      if (!isWhitelisted(a)) continue;
      if (seen.has(a.title)) continue;
      seen.add(a.title);
      out.push(a);
      if (out.length >= max) break;
    }
    return out;
  } catch {
    return [];
  }
}

export interface UnhcrTotals {
  year: number;
  refugees: number;
  asylumSeekers: number;
  idps: number;
  returnedRefugees: number;
  stateless: number;
}

// Global displacement totals from the UNHCR Population Statistics API
// (the aggregate row the API returns without a country filter).
export async function fetchUnhcrTotals(): Promise<UnhcrTotals | null> {
  for (const year of [2024, 2023]) {
    try {
      const res = await fetch(`https://api.unhcr.org/population/v1/population/?year=${year}`, {
        next: { revalidate: 86400 },
      } as RequestInit);
      if (!res.ok) continue;
      const json = await res.json();
      const items = (json?.items ?? []) as Record<string, unknown>[];
      const row = items.find((r) => r.coo === '-' || r.coo_name === '-') ?? items[0];
      if (!row || row.refugees == null) continue;
      const num = (v: unknown) => (typeof v === 'number' ? v : 0);
      return {
        year,
        refugees: num(row.refugees),
        asylumSeekers: num(row.asylum_seekers),
        idps: num(row.idps),
        returnedRefugees: num(row.returned_refugees),
        stateless: num(row.stateless),
      };
    } catch { /* try previous year / fall through */ }
  }
  return null;
}

export interface MajorConflict {
  slug: string;
  name: string;
  region: string;
  since: string;
  summary: string;
  reliefweb: string;
  query: string;
}

// The list itself is structure; every dynamic figure or headline on the
// page comes from UNHCR/GNews-whitelist at render time. Summaries are
// single neutral lines, attributed where they characterise scale.
export const MAJOR_CONFLICTS: MajorConflict[] = [
  {
    slug: 'ukraine-russia',
    name: 'Ukraine–Russia',
    region: 'Eastern Europe',
    since: '2022 (conflict since 2014)',
    summary: 'Full-scale invasion of Ukraine since February 2022. UNHCR counts millions of Ukrainian refugees across Europe and millions more displaced inside Ukraine.',
    reliefweb: 'https://reliefweb.int/country/ukr',
    query: 'Ukraine conflict humanitarian UN',
  },
  {
    slug: 'israel-gaza',
    name: 'Israel–Gaza',
    region: 'Middle East',
    since: '2023 (current escalation)',
    summary: 'Escalation since October 2023. UN agencies report most of Gaza\u2019s population displaced and dependent on humanitarian assistance.',
    reliefweb: 'https://reliefweb.int/country/pse',
    query: 'Gaza humanitarian situation UN',
  },
  {
    slug: 'sudan',
    name: 'Sudan',
    region: 'East Africa',
    since: '2023',
    summary: 'Fighting between the Sudanese Armed Forces and the Rapid Support Forces since April 2023. UN agencies describe it as one of the world\u2019s largest displacement crises.',
    reliefweb: 'https://reliefweb.int/country/sdn',
    query: 'Sudan conflict displaced UN',
  },
  {
    slug: 'myanmar',
    name: 'Myanmar',
    region: 'Southeast Asia',
    since: '2021',
    summary: 'Armed conflict across Myanmar since the February 2021 military takeover, with displacement in multiple regions reported by UN agencies.',
    reliefweb: 'https://reliefweb.int/country/mmr',
    query: 'Myanmar conflict humanitarian UN',
  },
  {
    slug: 'dr-congo',
    name: 'DR Congo (East)',
    region: 'Central Africa',
    since: 'Long-running; escalation since 2022',
    summary: 'Armed-group conflict in the eastern provinces, with repeated displacement around North and South Kivu reported by UN agencies.',
    reliefweb: 'https://reliefweb.int/country/cod',
    query: 'DR Congo conflict displaced UN',
  },
  {
    slug: 'haiti',
    name: 'Haiti',
    region: 'Caribbean',
    since: '2021 (crisis escalation)',
    summary: 'Gang violence centred on Port-au-Prince has displaced large numbers of residents; UN agencies run humanitarian operations amid severe access constraints.',
    reliefweb: 'https://reliefweb.int/country/hti',
    query: 'Haiti crisis humanitarian UN',
  },
];

export const HUMANITARIAN_ORGS = [
  { name: 'UNHCR — UN Refugee Agency', url: 'https://www.unhcr.org', note: 'Refugee protection and assistance worldwide.' },
  { name: 'ICRC — Red Cross', url: 'https://www.icrc.org', note: 'Neutral humanitarian protection and assistance in armed conflict.' },
  { name: 'WFP — World Food Programme', url: 'https://www.wfp.org', note: 'Emergency food assistance in conflict zones.' },
  { name: 'MSF — Doctors Without Borders', url: 'https://www.msf.org', note: 'Independent medical care where it is needed most.' },
  { name: 'UNICEF', url: 'https://www.unicef.org', note: 'Children\u2019s aid, water, nutrition and education in emergencies.' },
];
